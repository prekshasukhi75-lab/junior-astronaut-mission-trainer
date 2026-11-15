import { ArrowRight } from 'lucide-react';
import type { DestinationModule } from '../data/scienceCentreData';
import { SpaceImage } from './SpaceImage';

interface DestinationCardProps {
  destination: DestinationModule;
  onSelect: (destination: DestinationModule) => void;
}

export function DestinationCard({ destination, onSelect }: DestinationCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(destination)}
      aria-label={`Explore ${destination.title}: ${destination.description}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B1120] text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-[#0E1629] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 cursor-pointer"
    >
      {/* 4:3 Space Imagery Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-slate-800/80 bg-[#070B16]">
        <SpaceImage
          src={destination.imageSrc}
          alt={destination.imageAlt}
          fallbackTitle={destination.title}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1120]/70 via-transparent to-transparent"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="font-mono text-xs tracking-wide text-cyan-300/90">
            {destination.index} <span aria-hidden="true">·</span> {destination.discipline}
          </p>

          <h3 className="mt-2 font-display text-xl font-bold tracking-wide text-white sm:text-2xl">
            {destination.title}
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-300 sm:text-base">
            {destination.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-slate-700/80 bg-[#111B33] px-4 py-2 text-xs font-semibold tracking-wide text-white whitespace-nowrap shrink-0 transition-colors duration-150 group-hover:border-cyan-400/70 group-hover:bg-cyan-500/15 group-hover:text-cyan-200">
            <span>Explore</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>

          <span className="font-mono text-xs text-slate-400 transition-colors duration-150 group-hover:text-slate-200">
            Module {destination.index}
          </span>
        </div>
      </div>
    </button>
  );
}
