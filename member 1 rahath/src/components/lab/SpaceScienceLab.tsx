import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Globe,
  Moon,
  Orbit,
  RefreshCw,
  Rocket,
  RotateCcw,
  Sparkles,
  Sun,
} from 'lucide-react';
import { LAB_EXPERIMENTS, SPACE_LAB_MEDIA } from '../../data/spaceScienceLabData';
import {
  loadLabProgress,
  recordExperimentQuizCompletion,
  resetLabProgress,
} from '../../services/labProgressService';
import { fetchNasaApod } from '../../services/nasaApodService';
import { searchNasaImages } from '../../services/nasaImageService';
import type { NasaImageItem } from '../../types/imageExplorer';
import type {
  LabExperimentId,
  LabProgressState,
  NasaApodResult,
} from '../../types/spaceLab';
import { SpaceImage } from '../SpaceImage';
import { ExperimentLearningShell } from './ExperimentLearningShell';
import { LightAndSpaceLab } from './LightAndSpaceLab';
import { MoonCraterExperiment } from './MoonCraterExperiment';
import { PlanetGravityLab } from './PlanetGravityLab';
import { RocketScienceLab } from './RocketScienceLab';
import { ScienceLabCertificateModal } from './ScienceLabCertificateModal';
import { SolarSystemBuilder } from './SolarSystemBuilder';

interface SpaceScienceLabProps {
  cadetName: string;
  onBackToScienceCentre: () => void;
  onNavigateSolarActivity: () => void;
  onNavigateMoonTemperature: () => void;
  onNavigateNasaImages: () => void;
}

const STATION_ICONS: Record<LabExperimentId, typeof Globe> = {
  'planet-gravity': Globe,
  'solar-system': Orbit,
  'moon-crater': Moon,
  'rocket-science': Rocket,
  'light-space': Sun,
};

const INITIAL_OBSERVATIONS: Record<LabExperimentId, string> = {
  'planet-gravity':
    'Select any planet and click Drop Object to measure how fast it accelerates downward over 20 meters.',
  'solar-system':
    'Click any planet in orbit or switch to Arrange Planet Order to explore how solar distance controls a planet’s year.',
  'moon-crater':
    'Pick a meteorite size and impact speed, then launch it onto the lunar surface to measure the resulting crater.',
  'rocket-science':
    'Adjust fuel and engine thrust so upward thrust exceeds downward gravity, then launch toward the 100 km Kármán Line.',
  'light-space':
    'Move the Moon around Earth or toggle Space Vacuum vs. Earth’s Air to create eclipses and see why space is dark.',
};

export function SpaceScienceLab({
  cadetName,
  onBackToScienceCentre,
  onNavigateSolarActivity,
  onNavigateMoonTemperature,
  onNavigateNasaImages,
}: SpaceScienceLabProps) {
  const [activeStationId, setActiveStationId] =
    useState<LabExperimentId | null>(null);
  const [progress, setProgress] = useState<LabProgressState>(() =>
    loadLabProgress()
  );
  const [observations, setObservations] =
    useState<Record<LabExperimentId, string>>(INITIAL_OBSERVATIONS);
  const [certificateOpen, setCertificateOpen] = useState(false);

  // NASA APOD real-data state
  const [apodResult, setApodResult] = useState<NasaApodResult | null>(null);
  const [apodLoading, setApodLoading] = useState(true);

  // NASA Image Archive real-data reference cards
  const [nasaGallery, setNasaGallery] = useState<NasaImageItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  const loadApodData = useCallback(async () => {
    setApodLoading(true);
    const res = await fetchNasaApod();
    setApodResult(res);
    setApodLoading(false);
  }, []);

  const loadReferenceGallery = useCallback(async () => {
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      const response = await searchNasaImages('NASA rocket launch moon', 1, 6);
      if (response.items.length === 0) {
        const fallbackQuery = await searchNasaImages('Apollo Moon', 1, 6);
        setNasaGallery(fallbackQuery.items.slice(0, 4));
      } else {
        setNasaGallery(response.items.slice(0, 4));
      }
    } catch (err) {
      setGalleryError(
        err instanceof Error
          ? err.message
          : 'Could not reach NASA Image Library.'
      );
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApodData();
    void loadReferenceGallery();
  }, [loadApodData, loadReferenceGallery]);

  const handleOpenStation = (id: LabExperimentId) => {
    setActiveStationId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setActiveStationId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleObservationChange = useCallback(
    (stationId: LabExperimentId, summary: string) => {
      setObservations((prev) => ({
        ...prev,
        [stationId]: summary,
      }));
    },
    []
  );

  const handleCompleteQuiz = (
    stationId: LabExperimentId,
    scoreOutOfThree: number
  ) => {
    const outcome = recordExperimentQuizCompletion(
      progress,
      stationId,
      scoreOutOfThree
    );
    setProgress(outcome.nextState);
    return {
      newlyCompleted: outcome.newlyCompleted,
      pointsGained: outcome.pointsGained,
    };
  };

  const handleResetProgress = () => {
    const fresh = resetLabProgress();
    setProgress(fresh);
  };

  const completedCount = progress.completedIds.length;
  const totalExperiments = LAB_EXPERIMENTS.length;
  const completionPct = Math.round((completedCount / totalExperiments) * 100);
  const allCompleted = completedCount >= totalExperiments;

  // Render active interactive experiment station view
  if (activeStationId) {
    const activeExp =
      LAB_EXPERIMENTS.find((e) => e.id === activeStationId) ?? LAB_EXPERIMENTS[0];
    const currentIdx = LAB_EXPERIMENTS.findIndex((e) => e.id === activeExp.id);
    const nextExp =
      LAB_EXPERIMENTS[(currentIdx + 1) % LAB_EXPERIMENTS.length];

    return (
      <div className="bg-[#060913]">
        <ExperimentLearningShell
          experiment={activeExp}
          isCompleted={progress.completedIds.includes(activeExp.id)}
          bestQuizScore={progress.quizScores[activeExp.id]}
          liveObservation={observations[activeExp.id]}
          onBackToLab={handleBackToHub}
          onCompleteQuiz={(score) => handleCompleteQuiz(activeExp.id, score)}
        >
          {activeExp.id === 'planet-gravity' ? (
            <PlanetGravityLab
              onObservationChange={(s) =>
                handleObservationChange('planet-gravity', s)
              }
            />
          ) : activeExp.id === 'solar-system' ? (
            <SolarSystemBuilder
              onObservationChange={(s) =>
                handleObservationChange('solar-system', s)
              }
            />
          ) : activeExp.id === 'moon-crater' ? (
            <MoonCraterExperiment
              onObservationChange={(s) =>
                handleObservationChange('moon-crater', s)
              }
            />
          ) : activeExp.id === 'rocket-science' ? (
            <RocketScienceLab
              onObservationChange={(s) =>
                handleObservationChange('rocket-science', s)
              }
            />
          ) : (
            <LightAndSpaceLab
              onObservationChange={(s) =>
                handleObservationChange('light-space', s)
              }
            />
          )}
        </ExperimentLearningShell>

        {/* Station Footer Bar */}
        <section className="border-t border-slate-800/80 bg-[#080D1B] py-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={handleBackToHub}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-white hover:border-cyan-400/70 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>All 5 Lab Experiments</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenStation(nextExp.id)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#E03C31] px-5 py-2 text-xs font-semibold text-white hover:bg-[#F04A3E] cursor-pointer"
            >
              <span>Next Station: {nextExp.shortTitle}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#060913]">
      {/* Section 1: Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0">
          <SpaceImage
            src={SPACE_LAB_MEDIA.hero.src}
            alt={SPACE_LAB_MEDIA.hero.alt}
            fallbackTitle="NASA Virtual Space Science Lab"
            className="h-full w-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060913] via-[#060913]/85 to-[#060913]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-[#060913]/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <button
            type="button"
            onClick={onBackToScienceCentre}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-slate-700/80 bg-[#0B1120]/90 px-3.5 py-2 text-xs font-semibold text-slate-100 hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Science Centre</span>
          </button>

          <div className="mt-6 max-w-3xl">
            <p className="font-mono text-xs tracking-wider text-cyan-300">
              Module 04 <span aria-hidden="true">·</span> Interactive Virtual Research Facility
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-6xl">
              SPACE SCIENCE LAB
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Conduct five hands-on space physics experiments—drop gear across alien
              gravity wells, build our solar system, blast craters into lunar dust,
              launch rockets past the Kármán Line, and aim sunlight to trigger eclipses.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenStation('planet-gravity')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#E03C31] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#F04A3E] cursor-pointer"
              >
                <FlaskConical className="h-4 w-4" aria-hidden="true" />
                <span>Start Station 01: Planet Gravity</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <a
                href="#lab-experiments-grid"
                className="inline-flex min-h-[46px] items-center rounded-md border border-cyan-400/50 bg-[#0B1120]/85 px-5 py-2.5 text-sm font-semibold text-cyan-200 hover:border-cyan-300"
              >
                Browse All 5 Experiments
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Explorer Progress & Badge Dashboard */}
      <section
        aria-labelledby="lab-progress-heading"
        className="border-b border-slate-800/80 bg-[#080D1B] py-10 sm:py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-6 sm:p-7">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-5 lg:flex-row lg:items-center">
              <div>
                <p className="font-mono text-xs text-cyan-300">
                  Cadet Laboratory Record · {cadetName || 'Cadet Explorer'}
                </p>
                <h2
                  id="lab-progress-heading"
                  className="mt-1 font-display text-2xl font-bold text-white"
                >
                  SCIENCE EXPLORER PROGRESS
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-lg border border-slate-800 bg-[#060913] px-4 py-2 font-mono text-xs tabular-nums">
                  <span className="text-slate-400">Stations Complete: </span>
                  <strong className="text-white">
                    {completedCount} / {totalExperiments}
                  </strong>
                </div>

                <div className="rounded-lg border border-slate-800 bg-[#060913] px-4 py-2 font-mono text-xs tabular-nums">
                  <span className="text-slate-400">Science Points: </span>
                  <strong className="text-amber-300">{progress.totalPoints}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setCertificateOpen(true)}
                  disabled={!allCompleted}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
                    allCompleted
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer'
                      : 'border border-slate-700 bg-[#060913] text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {allCompleted
                      ? 'Open Explorer Certificate'
                      : `Certificate Unlocks at 5/5 (${totalExperiments - completedCount} left)`}
                  </span>
                </button>

                {completedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetProgress}
                    title="Reset lab progress"
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-md border border-slate-800 bg-[#060913] px-3 py-2 text-xs text-slate-300 hover:border-slate-600 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Completion Bar */}
            <div className="mt-5">
              <div className="flex justify-between font-mono text-xs text-slate-300 tabular-nums">
                <span>Overall Lab Completion</span>
                <span className="text-cyan-300">{completionPct}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  style={{ width: `${completionPct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                />
              </div>
            </div>

            {/* Five Earned / Locked Badges */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {LAB_EXPERIMENTS.map((exp) => {
                const earned = progress.completedIds.includes(exp.id);
                const best = progress.quizScores[exp.id];
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => handleOpenStation(exp.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                      earned
                        ? 'border-emerald-400/50 bg-emerald-500/10'
                        : 'border-slate-800 bg-[#060913] hover:border-cyan-400/60'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                        earned
                          ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-300'
                          : 'border-slate-800 bg-[#0B1120] text-slate-400'
                      }`}
                    >
                      {earned ? (
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-xs font-bold text-white">
                        {exp.badgeTitle}
                      </p>
                      <p className="font-mono text-[11px] text-slate-400 tabular-nums">
                        {earned
                          ? `Earned · Best ${best ?? 3}/3`
                          : exp.stationNumber}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Five Interactive Experiment Stations */}
      <section
        id="lab-experiments-grid"
        aria-labelledby="lab-stations-heading"
        className="border-b border-slate-800/80 py-14 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Interactive Physics &amp; Astronomy Stations
            </p>
            <h2
              id="lab-stations-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-4xl"
            >
              CHOOSE AN EXPERIMENT STATION
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LAB_EXPERIMENTS.map((exp) => {
              const Icon = STATION_ICONS[exp.id];
              const isCompleted = progress.completedIds.includes(exp.id);
              const bestScore = progress.quizScores[exp.id];

              return (
                <article
                  key={exp.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0B1120] p-6 transition-all hover:border-cyan-400/70 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/35 bg-cyan-500/10 text-cyan-300">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span
                        className={`font-mono text-xs ${
                          isCompleted ? 'text-emerald-300' : 'text-slate-400'
                        }`}
                      >
                        {exp.stationNumber}{' '}
                        {isCompleted ? `· Done (${bestScore ?? 3}/3)` : ''}
                      </span>
                    </div>

                    <p className="mt-4 font-mono text-xs text-cyan-300">
                      {exp.discipline}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold text-white">
                      {exp.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {exp.tagline}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-800/80 pt-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Badge: {exp.badgeTitle}</span>
                      <span className="font-mono text-amber-300">
                        +{exp.pointsReward} pts
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenStation(exp.id)}
                      className={`mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        isCompleted
                          ? 'border border-emerald-400/50 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20'
                          : 'bg-[#E03C31] text-white hover:bg-[#F04A3E]'
                      }`}
                    >
                      <span>
                        {isCompleted ? 'Review Experiment' : 'Start Experiment'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Real NASA Science Data (APOD + NASA Image Library) */}
      <section
        aria-labelledby="real-nasa-science-heading"
        className="border-b border-slate-800/80 bg-[#080D1B] py-14 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="font-mono text-xs tracking-wider text-cyan-400">
                Real Public NASA Resources
              </p>
              <h2
                id="real-nasa-science-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-4xl"
              >
                REAL NASA SCIENCE DATA
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                While our interactive workbench above runs educational physics
                simulations, this corner connects to live NASA Astronomy Picture
                of the Day (APOD) and official NASA archival photographs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void loadApodData();
                void loadReferenceGallery();
              }}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-white hover:border-cyan-400/70 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
              <span>Refresh NASA Data</span>
            </button>
          </div>

          {/* APOD Feature Panel */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-[#0B1120] p-6">
            {apodLoading ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="h-64 animate-pulse rounded-xl bg-slate-800/70 lg:col-span-5" />
                <div className="space-y-3 lg:col-span-7">
                  <div className="h-4 w-48 animate-pulse rounded bg-slate-800" />
                  <div className="h-7 w-3/4 animate-pulse rounded bg-slate-800" />
                  <div className="h-24 w-full animate-pulse rounded bg-slate-800/70" />
                </div>
              </div>
            ) : apodResult ? (
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#060913] lg:col-span-5">
                  {apodResult.item.mediaType === 'image' ? (
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <SpaceImage
                        src={apodResult.item.url}
                        alt={apodResult.item.title}
                        fallbackTitle={apodResult.item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] flex-col items-center justify-center p-6 text-center">
                      <p className="font-mono text-xs text-cyan-300">
                        APOD Media Format: {apodResult.item.mediaType}
                      </p>
                      <a
                        href={apodResult.item.apodPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white hover:bg-[#F04A3E]"
                      >
                        <span>Watch on NASA APOD</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span
                      className={`rounded px-2.5 py-0.5 font-semibold ${
                        apodResult.live
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-amber-500/15 text-amber-200'
                      }`}
                    >
                      {apodResult.live
                        ? 'Live NASA APOD Feed'
                        : 'Verified Educational Fallback'}
                    </span>
                    <span className="text-slate-400">
                      Date: {apodResult.item.date}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-bold text-white">
                    {apodResult.item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300 line-clamp-5">
                    {apodResult.item.explanation}
                  </p>

                  {apodResult.notice && (
                    <p className="mt-3 rounded-lg border border-amber-400/35 bg-amber-500/10 p-3 text-xs text-amber-100">
                      {apodResult.notice}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
                    <span>
                      Credit: {apodResult.item.copyright || 'NASA APOD'}
                    </span>
                    <a
                      href={apodResult.item.apodPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      <span>Open Official NASA APOD Page</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Real NASA Photo Archive Row */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">
                REAL NASA ARCHIVE PHOTOGRAPHS
              </h3>
              <span className="font-mono text-xs text-slate-400">
                Source: images-api.nasa.gov
              </span>
            </div>

            {galleryLoading ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-xl border border-slate-800 bg-[#0B1120]"
                  />
                ))}
              </div>
            ) : galleryError ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-xs text-amber-100">
                <span>{galleryError}</span>
                <button
                  type="button"
                  onClick={() => void loadReferenceGallery()}
                  className="rounded-md border border-amber-300/60 px-3 py-1.5 font-semibold text-white hover:bg-amber-500/20 cursor-pointer"
                >
                  Retry NASA Images
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {nasaGallery.map((item) => (
                  <article
                    key={item.nasaId}
                    className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-[#0B1120]"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-black">
                      <SpaceImage
                        src={item.previewUrl}
                        alt={item.title}
                        fallbackTitle={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <p className="font-mono text-[11px] text-cyan-300">
                          {item.center} · {item.nasaId}
                        </p>
                        <h4 className="mt-1 line-clamp-2 font-display text-sm font-bold text-white">
                          {item.title}
                        </h4>
                      </div>
                      <a
                        href={item.nasaSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-cyan-300 hover:text-cyan-200"
                      >
                        <span>NASA Source</span>
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 5: Cross-Module Navigation */}
      <section
        aria-label="Space Science Lab cross-module navigation"
        className="border-b border-slate-800/80 bg-[#060913] py-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="font-mono text-xs text-cyan-400">Continue Exploring</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
              Visit another Mission: Little Astronaut station
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBackToScienceCentre}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Science Centre</span>
            </button>

            <button
              type="button"
              onClick={onNavigateSolarActivity}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-slate-700 bg-[#111B33] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
            >
              <span>Solar Activity</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onNavigateMoonTemperature}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-slate-700 bg-[#111B33] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
            >
              <span>Moon Temperature Explorer</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onNavigateNasaImages}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#F04A3E] cursor-pointer"
            >
              <span>NASA Image Explorer</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <ScienceLabCertificateModal
        isOpen={certificateOpen}
        cadetName={cadetName}
        progress={progress}
        onClose={() => setCertificateOpen(false)}
      />
    </div>
  );
}
