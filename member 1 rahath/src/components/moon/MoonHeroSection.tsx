import { ArrowDownRight, ArrowLeft } from 'lucide-react';
import {
  HERO_MISSION_LABELS,
  MOON_TEMP_MEDIA,
} from '../../data/moonTemperatureData';
import { SpaceImage } from '../SpaceImage';

interface MoonHeroSectionProps {
  onBackToScienceCentre: () => void;
  onExploreMoon: () => void;
}

export function MoonHeroSection({
  onBackToScienceCentre,
  onExploreMoon,
}: MoonHeroSectionProps) {
  return (
    <section
      aria-labelledby="moon-hero-heading"
      className="relative isolate overflow-hidden border-b border-slate-800/80 bg-[#060913]"
    >
      {/* Full-bleed Lunar Landscape Photography */}
      <div className="absolute inset-0 -z-10">
        <SpaceImage
          src={MOON_TEMP_MEDIA.hero.src}
          alt={MOON_TEMP_MEDIA.hero.alt}
          fallbackTitle="Moon Surface Expedition"
          className="h-full w-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#060913]/95 via-[#060913]/80 to-[#060913]/35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-[#060913]/50"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        {/* Top Return Link + Attribution */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToScienceCentre}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-slate-700/80 bg-[#0B1120]/90 px-3.5 py-2 text-xs font-semibold text-slate-200 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-cyan-400/70 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-400 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Science Centre</span>
          </button>

          <p className="font-mono text-xs text-slate-300">
            {MOON_TEMP_MEDIA.hero.attribution}
          </p>
        </div>

        <div className="mt-10 max-w-2xl">
          <p className="font-mono text-xs tracking-wider text-cyan-300 sm:text-sm">
            Module 02 · Lunar Thermal Science
          </p>

          <h1
            id="moon-hero-heading"
            className="mt-3 font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-6xl"
          >
            MOON TEMPERATURE EXPLORER
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 sm:text-xl">
            Discover the extreme temperatures of our Moon.
          </p>

          {/* Small Mission-Style Information Labels (unboxed typographic row) */}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-700/70 pt-4 font-mono text-xs text-slate-300">
            {HERO_MISSION_LABELS.map((label, idx) => (
              <span key={label} className="inline-flex items-center gap-4">
                {idx > 0 && (
                  <span aria-hidden="true" className="text-slate-600">
                    /
                  </span>
                )}
                <span>{label}</span>
              </span>
            ))}
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={onExploreMoon}
              className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-md bg-[#E03C31] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-all duration-150 hover:bg-[#F04A3E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 cursor-pointer"
            >
              <span>Explore the Moon</span>
              <ArrowDownRight
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
