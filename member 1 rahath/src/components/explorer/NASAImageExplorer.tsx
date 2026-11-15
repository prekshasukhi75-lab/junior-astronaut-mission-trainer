import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Compass,
  History,
  Search,
} from 'lucide-react';
import {
  EXPLORER_HERO_MEDIA,
  QUICK_DISCOVERY_PROMPTS,
  SUGGESTED_SPACE_TOPICS,
} from '../../data/imageExplorerData';
import {
  addSearchHistoryTerm,
  awardUniqueLearningPoints,
  getLearningPoints,
  getSavedDiscoveries,
  getSearchHistory,
  toggleSaveDiscovery,
  updateSavedDiscoveryComponents,
} from '../../services/discoveryStorageService';
import {
  analyzeNasaImage,
  getAiServiceStatus,
  ImageAnalysisError,
} from '../../services/imageAnalysisService';
import {
  fetchNasaAssetAndMetadata,
  NasaApiError,
  searchNasaImages,
} from '../../services/nasaImageService';
import type {
  AnalyzedImageResult,
  DetectedComponent,
  NasaImageItem,
  NasaSearchResponse,
  SavedDiscoveryItem,
} from '../../types/imageExplorer';
import { SpaceImage } from '../SpaceImage';
import { AstraSpaceBot } from './AstraSpaceBot';
import { ComponentInfoPanel } from './ComponentInfoPanel';
import { DiscoveryCollection } from './DiscoveryCollection';
import { SpaceImageViewer } from './SpaceImageViewer';

interface NASAImageExplorerProps {
  onBackToScienceCentre: () => void;
  onNavigateSolarActivity: () => void;
  onNavigateMoonTemperature: () => void;
}

export function NASAImageExplorer({
  onBackToScienceCentre,
  onNavigateSolarActivity,
  onNavigateMoonTemperature,
}: NASAImageExplorerProps) {
  const [searchInput, setSearchInput] = useState('Earth');
  const [activeQuery, setActiveQuery] = useState('Earth');
  const [searchResult, setSearchResult] = useState<NasaSearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<NasaImageItem | null>(null);
  const [resolvedImageUrl, setResolvedImageUrl] = useState('');
  const [isResolvingAsset, setIsResolvingAsset] = useState(false);

  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzedImageResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] =
    useState<DetectedComponent | null>(null);

  const [searchHistory, setSearchHistory] = useState<string[]>(() =>
    getSearchHistory()
  );
  const [savedDiscoveries, setSavedDiscoveries] = useState<SavedDiscoveryItem[]>(
    () => getSavedDiscoveries()
  );
  const [learningPoints, setLearningPoints] = useState<number>(() =>
    getLearningPoints()
  );

  const activeImageIdRef = useRef<string | null>(null);
  const searchSeqRef = useRef(0);

  useEffect(() => {
    void getAiServiceStatus().then((status) => {
      setAiConfigured(status.configured);
    });
  }, []);

  const executeSearch = useCallback(
    async (query: string, page = 1, recordHistory = true) => {
      const clean = query.trim();
      if (!clean) return;

      const seq = ++searchSeqRef.current;
      activeImageIdRef.current = null;
      setActiveQuery(clean);
      setSearchInput(clean);
      setIsSearching(true);
      setSearchError(null);
      setSelectedImage(null);
      setAnalysisResult(null);
      setAnalysisError(null);
      setSelectedComponent(null);

      if (recordHistory) {
        setSearchHistory(addSearchHistoryTerm(clean));
      }

      try {
        const result = await searchNasaImages(clean, page, 18);
        if (seq !== searchSeqRef.current) return;
        setSearchResult(result);
      } catch (err) {
        if (seq !== searchSeqRef.current) return;
        setSearchResult(null);
        setSearchError(
          err instanceof NasaApiError
            ? err.message
            : 'Could not reach the NASA Image Library right now.'
        );
      } finally {
        if (seq === searchSeqRef.current) {
          setIsSearching(false);
        }
      }
    },
    []
  );

  // Run an initial search on mount so real NASA images appear right away
  useEffect(() => {
    void executeSearch('Earth', 1, false);
  }, [executeSearch]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    void executeSearch(searchInput, 1, true);
    const resultsEl = document.querySelector('#nasa-search-results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenImage = async (item: NasaImageItem) => {
    activeImageIdRef.current = item.nasaId;
    setSelectedImage(item);
    setResolvedImageUrl(item.previewUrl);
    setAnalysisResult(null);
    setAnalysisError(null);
    setSelectedComponent(null);
    setIsResolvingAsset(true);

    const workspaceEl = document.querySelector('#image-workspace');
    if (workspaceEl) {
      workspaceEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const assetInfo = await fetchNasaAssetAndMetadata(
      item.nasaId,
      item.previewUrl
    );
    if (activeImageIdRef.current !== item.nasaId) return;
    setResolvedImageUrl(assetInfo.bestImageUrl || item.previewUrl);
    setIsResolvingAsset(false);
  };

  const handleReturnToGallery = () => {
    activeImageIdRef.current = null;
    setSelectedImage(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setSelectedComponent(null);
    setIsResolvingAsset(false);
  };

  const handleTriggerExploreImage = async () => {
    if (!selectedImage || isAnalyzing) return;
    const targetId = selectedImage.nasaId;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setSelectedComponent(null);

    try {
      const result = await analyzeNasaImage(selectedImage, resolvedImageUrl);
      if (activeImageIdRef.current !== targetId) return;
      setAnalysisResult(result);
      if (result.isSuitableForComponentExploration && result.components.length > 0) {
        const firstComp = result.components[0];
        setSelectedComponent(firstComp);
        const earned = awardUniqueLearningPoints(
          `${selectedImage.nasaId}::${firstComp.id}`,
          15
        );
        if (earned > 0) {
          setLearningPoints(getLearningPoints());
        }
        setSavedDiscoveries(
          updateSavedDiscoveryComponents(selectedImage.nasaId, firstComp.name)
        );
      }
    } catch (err) {
      if (activeImageIdRef.current !== targetId) return;
      setAnalysisError(
        err instanceof ImageAnalysisError
          ? err.message
          : 'AI image analysis could not be completed right now.'
      );
    } finally {
      if (activeImageIdRef.current === targetId) {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSelectComponent = (component: DetectedComponent) => {
    setSelectedComponent(component);
    if (!selectedImage) return;

    const earned = awardUniqueLearningPoints(
      `${selectedImage.nasaId}::${component.id}`,
      15
    );
    if (earned > 0) {
      setLearningPoints(getLearningPoints());
    }
    setSavedDiscoveries(
      updateSavedDiscoveryComponents(selectedImage.nasaId, component.name)
    );
  };

  const handleToggleSaveCurrent = () => {
    if (!selectedImage) return;
    const discoveredNames = selectedComponent
      ? [selectedComponent.name]
      : analysisResult?.components.map((c) => c.name) ?? [];
    const { discoveries, pointsAwarded } = toggleSaveDiscovery(
      selectedImage,
      discoveredNames
    );
    setSavedDiscoveries(discoveries);
    if (pointsAwarded > 0) {
      setLearningPoints(getLearningPoints());
    }
  };

  const handleRemoveSavedDiscovery = (nasaId: string) => {
    const existing = savedDiscoveries.find((d) => d.nasaId === nasaId);
    if (!existing) return;
    const { discoveries } = toggleSaveDiscovery(
      {
        nasaId: existing.nasaId,
        title: existing.title,
        description: existing.description,
        dateCreated: existing.dateCreated,
        keywords: existing.keywords,
        center: existing.center,
        photographer: '',
        previewUrl: existing.previewUrl,
        nasaSourceUrl: existing.nasaSourceUrl,
      },
      existing.discoveredComponents
    );
    setSavedDiscoveries(discoveries);
  };

  const isCurrentImageSaved = Boolean(
    selectedImage &&
      savedDiscoveries.some((item) => item.nasaId === selectedImage.nasaId)
  );

  return (
    <div className="bg-[#060913]">
      {/* Hero & Search Hub */}
      <section
        aria-labelledby="explorer-hero-heading"
        className="relative isolate overflow-hidden border-b border-slate-800/80"
      >
        <div className="absolute inset-0 -z-10">
          <SpaceImage
            src={EXPLORER_HERO_MEDIA.src}
            alt={EXPLORER_HERO_MEDIA.alt}
            fallbackTitle="NASA Deep Space Explorer"
            className="h-full w-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#060913]/95 via-[#060913]/85 to-[#060913]/65"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-[#060913]/55"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBackToScienceCentre}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-slate-700/80 bg-[#0B1120]/90 px-3.5 py-2 text-xs font-semibold text-slate-200 whitespace-nowrap shrink-0 transition-colors hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Science Centre</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-[#0B1120]/90 px-3.5 py-2 text-xs">
                <Award className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span className="text-slate-300">Learning Points:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {learningPoints}
                </span>
              </div>

              <a
                href="#discovery-collection"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector('#discovery-collection')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-slate-700/80 bg-[#0B1120]/90 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/70 hover:text-cyan-200"
              >
                <Bookmark className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                <span>My Discoveries ({savedDiscoveries.length})</span>
              </a>
            </div>
          </div>

          <div className="mt-10 max-w-3xl">
            <p className="font-mono text-xs tracking-wider text-cyan-300 sm:text-sm">
              Search · Discover · Touch · Learn
            </p>
            <h1
              id="explorer-hero-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-6xl"
            >
              NASA INTELLIGENT IMAGE EXPLORER
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 sm:text-xl">
              Explore the universe. Discover what&apos;s hidden inside.
            </p>

            {/* Prominent Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="nasa-search-input" className="sr-only">
                Search NASA Image Library
              </label>
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="nasa-search-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search Earth, Mars, Saturn, Rockets, Moon, Sun..."
                  className="min-h-[48px] w-full rounded-md border border-slate-700 bg-[#0B1120]/95 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none sm:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching || !searchInput.trim()}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-[#E03C31] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#F04A3E] disabled:opacity-50 cursor-pointer"
              >
                <span>{isSearching ? 'Searching...' : 'Explore'}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            {/* Suggested Searches */}
            <div className="mt-5">
              <p className="font-mono text-xs text-slate-300">Suggested Topics</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SUGGESTED_SPACE_TOPICS.map((topic) => {
                  const isActive =
                    activeQuery.toLowerCase() === topic.toLowerCase() && !selectedImage;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => void executeSearch(topic, 1, true)}
                      className={`min-h-[34px] rounded-md border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                          : 'border-slate-700/80 bg-[#0B1120]/85 text-slate-200 hover:border-cyan-400/60 hover:text-white'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1 font-mono text-slate-400">
                  <History className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Recent Searches:</span>
                </span>
                {searchHistory.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => void executeSearch(term, 1, true)}
                    className="rounded border border-slate-800 bg-[#0B1120] px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-400/60 hover:text-cyan-200 cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Discovery Cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_DISCOVERY_PROMPTS.map((item) => (
              <button
                key={item.topic}
                type="button"
                onClick={() => void executeSearch(item.topic, 1, true)}
                className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120]/90 p-4 text-left transition-colors hover:border-cyan-400/60 hover:bg-[#0E1629] cursor-pointer"
              >
                <div>
                  <p className="font-mono text-[11px] text-cyan-300">Quick Discovery</p>
                  <h2 className="mt-1 font-display text-base font-bold text-white">
                    {item.label}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    {item.note}
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-cyan-300">
                  <span>Search Topic</span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Either Selected Image Workspace OR NASA Search Results Gallery */}
      {selectedImage ? (
        <section
          id="image-workspace"
          aria-labelledby="workspace-title"
          className="border-b border-slate-800/80 bg-[#060913] py-12 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Workspace Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <p className="font-mono text-xs text-cyan-400">
                  Interactive Exploration Workspace · NASA ID: {selectedImage.nasaId}
                </p>
                <h2
                  id="workspace-title"
                  className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl"
                >
                  {selectedImage.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleSaveCurrent}
                  aria-pressed={isCurrentImageSaved}
                  className={`inline-flex min-h-[40px] items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    isCurrentImageSaved
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                      : 'border-slate-700 bg-[#0B1120] text-slate-200 hover:border-cyan-400/70'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {isCurrentImageSaved ? 'Saved to My Discoveries' : 'Save Discovery'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleReturnToGallery}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-slate-700 bg-[#111B33] px-4 py-2 text-xs font-semibold text-white hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Explore Another Image</span>
                </button>
              </div>
            </div>

            {/* 2-Column Desktop Workspace (Viewer + Info Left, ASTRA Guide Right) */}
            <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                <SpaceImageViewer
                  image={selectedImage}
                  resolvedImageUrl={resolvedImageUrl}
                  isResolvingAsset={isResolvingAsset}
                  analysisResult={analysisResult}
                  isAnalyzing={isAnalyzing}
                  analysisError={analysisError}
                  aiConfigured={aiConfigured}
                  selectedComponentId={selectedComponent?.id ?? null}
                  onTriggerExplore={() => void handleTriggerExploreImage()}
                  onSelectComponent={handleSelectComponent}
                  onReturnToGallery={handleReturnToGallery}
                />

                <ComponentInfoPanel
                  image={selectedImage}
                  analysisResult={analysisResult}
                  selectedComponent={selectedComponent}
                />
              </div>

              <div className="lg:col-span-4 lg:sticky lg:top-20">
                <AstraSpaceBot
                  image={selectedImage}
                  resolvedImageUrl={resolvedImageUrl}
                  selectedComponent={selectedComponent}
                  aiConfigured={aiConfigured}
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section
          id="nasa-search-results"
          aria-labelledby="results-heading"
          className="border-b border-slate-800/80 bg-[#060913] py-14 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs text-cyan-400">
                  Official NASA Image and Video Library Results
                </p>
                <h2
                  id="results-heading"
                  className="mt-1.5 font-display text-2xl font-bold text-white sm:text-3xl"
                >
                  NASA IMAGES FOR &ldquo;{activeQuery.toUpperCase()}&rdquo;
                </h2>
              </div>

              {searchResult && !isSearching && (
                <p className="font-mono text-xs text-slate-400 tabular-nums">
                  Page {searchResult.page} · {searchResult.items.length} shown (
                  {searchResult.totalHits.toLocaleString()} total matches)
                </p>
              )}
            </div>

            {/* Loading Skeletons */}
            {isSearching && (
              <div
                aria-busy="true"
                aria-label="Searching NASA Image Library"
                className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl border border-slate-800 bg-[#0B1120]"
                  >
                    <div className="aspect-[4/3] w-full animate-pulse bg-slate-800/70" />
                    <div className="space-y-2.5 p-5">
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
                      <div className="h-5 w-3/4 animate-pulse rounded bg-slate-800" />
                      <div className="h-4 w-full animate-pulse rounded bg-slate-800/70" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NASA API Error State */}
            {searchError && !isSearching && (
              <div
                role="alert"
                className="mt-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-100"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-300"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      NASA Image Search Unavailable
                    </h3>
                    <p className="mt-1 text-sm">{searchError}</p>
                    <button
                      type="button"
                      onClick={() => void executeSearch(activeQuery, 1, false)}
                      className="mt-4 inline-flex min-h-[40px] items-center rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white hover:bg-[#F04A3E] cursor-pointer"
                    >
                      Retry NASA Search
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty Search Results State */}
            {!isSearching &&
              !searchError &&
              searchResult &&
              searchResult.items.length === 0 && (
                <div className="mt-8 rounded-xl border border-slate-800 bg-[#0B1120] p-8 text-center">
                  <Compass
                    className="mx-auto h-8 w-8 text-cyan-400"
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 font-display text-xl font-bold text-white">
                    No NASA Images Found for &ldquo;{activeQuery}&rdquo;
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
                    Try searching for a planet, spacecraft, or cosmic object like Earth,
                    Saturn, Mars, Apollo, or James Webb.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {['Earth', 'Mars', 'Saturn', 'Rockets', 'Moon'].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => void executeSearch(topic, 1, true)}
                        className="min-h-[38px] rounded-md border border-slate-700 bg-[#111B33] px-3.5 py-1.5 text-xs font-semibold text-white hover:border-cyan-400 cursor-pointer"
                      >
                        Search {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Real NASA Results Grid */}
            {!isSearching &&
              !searchError &&
              searchResult &&
              searchResult.items.length > 0 && (
                <>
                  <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResult.items.map((item) => (
                      <article
                        key={item.nasaId}
                        className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B1120] transition-colors hover:border-cyan-400/60"
                      >
                        <div>
                          <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-800/80 bg-[#060913]">
                            <SpaceImage
                              src={item.previewUrl}
                              alt={item.title}
                              fallbackTitle={item.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          </div>

                          <div className="p-5">
                            <p className="font-mono text-xs text-cyan-300">
                              {item.nasaId} <span aria-hidden="true">·</span>{' '}
                              {item.center}
                            </p>
                            <h3 className="mt-1.5 font-display text-lg font-bold text-white line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-300 line-clamp-3 sm:text-sm">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 px-5 py-3.5">
                          <button
                            type="button"
                            onClick={() => void handleOpenImage(item)}
                            className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#F04A3E] cursor-pointer"
                          >
                            <span>Open Image</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>

                          {item.dateCreated && (
                            <span className="font-mono text-xs text-slate-400 tabular-nums">
                              {item.dateCreated.slice(0, 10)}
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-10 flex items-center justify-between border-t border-slate-800/80 pt-6">
                    <button
                      type="button"
                      disabled={!searchResult.hasPrevPage || searchResult.page <= 1}
                      onClick={() =>
                        void executeSearch(activeQuery, searchResult.page - 1, false)
                      }
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-white hover:border-cyan-400/70 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      <span>Previous Page</span>
                    </button>

                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      Page {searchResult.page}
                    </span>

                    <button
                      type="button"
                      disabled={!searchResult.hasNextPage}
                      onClick={() =>
                        void executeSearch(activeQuery, searchResult.page + 1, false)
                      }
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-white hover:border-cyan-400/70 disabled:opacity-40 cursor-pointer"
                    >
                      <span>Next Page</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
          </div>
        </section>
      )}

      {/* Saved Discoveries Collection */}
      <DiscoveryCollection
        discoveries={savedDiscoveries}
        onOpenDiscovery={(item) => void handleOpenImage(item)}
        onRemoveDiscovery={handleRemoveSavedDiscovery}
      />

      {/* Cross-Section Navigation */}
      <section
        aria-label="Science Centre navigation"
        className="border-b border-slate-800/80 bg-[#060913] py-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="font-mono text-xs text-cyan-400">Continue Exploring</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
              Visit another NASA Science Centre module
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBackToScienceCentre}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Science Centre</span>
            </button>

            <button
              type="button"
              onClick={onNavigateSolarActivity}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-slate-700 bg-[#111B33] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
            >
              <span>Solar Activity</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onNavigateMoonTemperature}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 hover:bg-[#F04A3E] cursor-pointer"
            >
              <span>Moon Temperature Explorer</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
