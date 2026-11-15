import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type {
  AnalyzedImageResult,
  DetectedComponent,
  NasaImageItem,
} from '../../types/imageExplorer';
import { HotspotRenderer } from './hotspotRenderer';

interface SpaceImageViewerProps {
  image: NasaImageItem;
  resolvedImageUrl: string;
  isResolvingAsset: boolean;
  analysisResult: AnalyzedImageResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  aiConfigured: boolean | null;
  selectedComponentId: string | null;
  onTriggerExplore: () => void;
  onSelectComponent: (component: DetectedComponent) => void;
  onReturnToGallery: () => void;
}

export function SpaceImageViewer({
  image,
  resolvedImageUrl,
  isResolvingAsset,
  analysisResult,
  isAnalyzing,
  analysisError,
  aiConfigured,
  selectedComponentId,
  onTriggerExplore,
  onSelectComponent,
  onReturnToGallery,
}: SpaceImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [baseWidth, setBaseWidth] = useState<number | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const activeSrc = resolvedImageUrl || image.previewUrl;
  const components = analysisResult?.components ?? [];

  useEffect(() => {
    setImageLoadFailed(false);
  }, [activeSrc]);

  useEffect(() => {
    setZoom(1);
    setBaseWidth(null);
    setHoveredId(null);
  }, [image.nasaId]);

  const handleZoomIn = () => {
    if (zoom === 1 && imgRef.current && imgRef.current.clientWidth > 0) {
      setBaseWidth(imgRef.current.clientWidth);
    }
    setZoom((z) => Math.min(2.4, Number((z + 0.35).toFixed(2))));
  };
  const handleZoomOut = () => setZoom((z) => Math.max(1, Number((z - 0.35).toFixed(2))));
  const handleResetZoom = () => setZoom(1);

  const isZoomed = zoom > 1 && baseWidth !== null && baseWidth > 0;

  return (
    <div className="flex flex-col rounded-xl border border-slate-800/90 bg-[#0B1120] overflow-hidden">
      {/* Viewer Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-[#080D1B] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 2.4}
            aria-label="Zoom in"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-slate-700/80 bg-[#0B1120] px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-400/70 disabled:opacity-40 cursor-pointer"
          >
            <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Zoom In</span>
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            aria-label="Zoom out"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-slate-700/80 bg-[#0B1120] px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-400/70 disabled:opacity-40 cursor-pointer"
          >
            <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Zoom Out</span>
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            disabled={zoom === 1}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-slate-700/80 bg-[#0B1120] px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-400/70 disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset ({Math.round(zoom * 100)}%)</span>
          </button>

          {components.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLabels((prev) => !prev)}
              aria-pressed={showLabels}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-slate-700/80 bg-[#0B1120] px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-400/70 cursor-pointer"
            >
              {showLabels ? (
                <Eye className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              )}
              <span>{showLabels ? 'Hide Labels' : 'Show Labels'}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onTriggerExplore}
          disabled={isAnalyzing || isResolvingAsset || imageLoadFailed}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#F04A3E] disabled:opacity-50 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              <span>Analyzing Image...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>EXPLORE THIS IMAGE</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Canvas Stage */}
      <div className="relative flex min-h-[320px] max-h-[600px] overflow-auto bg-[#050811] p-4 sm:min-h-[440px]">
        {imageLoadFailed ? (
          <div className="m-auto max-w-md rounded-xl border border-slate-800 bg-[#0B1120] p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-amber-300" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              NASA Image Could Not Load
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              The image file from NASA’s archive did not load in your browser. Choose another
              image from the search gallery.
            </p>
            <button
              type="button"
              onClick={onReturnToGallery}
              className="mt-4 inline-flex min-h-[40px] items-center rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white hover:bg-[#F04A3E] cursor-pointer"
            >
              Explore Another Image
            </button>
          </div>
        ) : (
          <div
            className="relative m-auto shrink-0 transition-[width] duration-150"
            style={isZoomed ? { width: `${Math.round(baseWidth * zoom)}px` } : undefined}
          >
            <img
              ref={imgRef}
              src={activeSrc}
              alt={image.title}
              referrerPolicy="no-referrer"
              onLoad={() => {
                if (zoom === 1 && imgRef.current && imgRef.current.clientWidth > 0) {
                  setBaseWidth(imgRef.current.clientWidth);
                }
              }}
              onError={() => setImageLoadFailed(true)}
              className={
                isZoomed
                  ? 'block h-auto w-full rounded-md select-none'
                  : 'block max-h-[520px] w-auto max-w-full rounded-md object-contain select-none'
              }
            />
            {!isAnalyzing &&
              analysisResult?.isSuitableForComponentExploration &&
              components.length > 0 && (
                <HotspotRenderer
                  components={components}
                  selectedComponentId={selectedComponentId}
                  hoveredComponentId={hoveredId}
                  showLabels={showLabels}
                  onSelectComponent={onSelectComponent}
                  onHoverComponent={setHoveredId}
                />
              )}
          </div>
        )}

        {/* Loading Overlay during AI Vision inspection */}
        {isAnalyzing && (
          <div
            aria-live="polite"
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#060913]/88 p-6 text-center"
          >
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" aria-hidden="true" />
            <p className="mt-3 font-display text-lg font-bold text-white">
              Scanning NASA Image Components...
            </p>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
              Our vision AI is inspecting the actual photograph to locate real visible
              scientific features.
            </p>
          </div>
        )}
      </div>

      {/* Analysis Status / Error / Unsuitable Image / Component List */}
      <div className="border-t border-slate-800/80 bg-[#0B1120] p-4 sm:p-5">
        {aiConfigured === false && !analysisError && !analysisResult && (
          <div className="mb-4 rounded-lg border border-amber-500/35 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-100">
            <strong>AI Configuration Needed:</strong> Set{' '}
            <code className="font-mono">GEMINI_API_KEY</code> in{' '}
            <strong>Settings &gt; Secrets</strong> to enable AI component detection and ASTRA
            chat. You can still browse all official NASA images and metadata.
          </div>
        )}

        {analysisError && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                aria-hidden="true"
              />
              <span>{analysisError}</span>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={onTriggerExplore}
                className="min-h-[36px] rounded-md border border-amber-400/50 bg-[#0B1120] px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-[#111B33] cursor-pointer"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={onReturnToGallery}
                className="min-h-[36px] rounded-md bg-[#E03C31] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#F04A3E] cursor-pointer"
              >
                Pick Another Image
              </button>
            </div>
          </div>
        )}

        {analysisResult && !analysisResult.isSuitableForComponentExploration && (
          <div className="rounded-lg border border-slate-700 bg-[#060913] p-4 text-sm text-slate-200">
            <p className="font-display text-base font-bold text-white">
              Component Regions Not Available for This Image
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
              {analysisResult.unsuitableReason}
            </p>
            <button
              type="button"
              onClick={onReturnToGallery}
              className="mt-3 inline-flex min-h-[38px] items-center rounded-md border border-cyan-400/50 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20 cursor-pointer"
            >
              Try a Different NASA Image or Diagram
            </button>
          </div>
        )}

        {!analysisResult && !analysisError && !isAnalyzing && (
          <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
            Click <strong className="text-white">EXPLORE THIS IMAGE</strong> above to let
            vision AI identify visible parts and layers you can touch and ask ASTRA about.
          </p>
        )}

        {components.length > 0 && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs text-cyan-300">
                Detected Components ({components.length}) · Touch any region or button
              </p>
              <span className="font-mono text-[11px] text-slate-400">
                AI Vision Analysis · {analysisResult?.subject}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {components.map((component, idx) => {
                const isSelected = component.id === selectedComponentId;
                return (
                  <button
                    key={component.id}
                    type="button"
                    onClick={() => onSelectComponent(component)}
                    onMouseEnter={() => setHoveredId(component.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    aria-pressed={isSelected}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                        : 'border-slate-700/80 bg-[#060913] text-slate-200 hover:border-cyan-400/60 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-cyan-300">0{idx + 1}.</span>
                    <span>{component.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
