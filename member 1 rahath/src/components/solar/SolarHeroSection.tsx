import { ArrowLeft } from 'lucide-react';
import { SOLAR_MEDIA, SOLAR_REFERENCE_STATS } from '../../data/solarActivityData';
import { SpaceImage } from '../SpaceImage';

interface SolarHeroSectionProps {
  onBackToScienceCentre: () => void;
}

export function SolarHeroSection({ onBackToScienceCentre }: SolarHeroSectionProps) {
  return (
    <section
      aria-labelledby="solar-hero-heading"
      className="relative isolate overflow-hidden border-b border-slate-800/80 bg-[#060913]"
    >
      {/* Full-bleed NASA SDO-inspired solar imagery */}
      <div className="absolute inset-0 -z-10">
        <SpaceImage
          src={SOLAR_MEDIA.hero.src}
          alt={SOLAR_MEDIA.hero.alt}
          fallbackTitle="NASA Solar Observatory View"
          className="h-full w-full object-cover object-center sm:object-[70%_50%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#060913]/95 via-[#060913]/80 to-[#060913]/35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-[#060913]/55"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Top Back Navigation */}
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
            {SOLAR_MEDIA.hero.attribution}
          </p>
        </div>

        <div className="mt-10 max-w-2xl">
          <p className="font-mono text-xs tracking-wider text-cyan-300 sm:text-sm">
            Module 01 · Solar Activity &amp; Space Weather Centre
          </p>

          <h1
            id="solar-hero-heading"
            className="mt-3 font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-6xl"
          >
            UNDERSTANDING OUR SUN
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 sm:text-xl">
            Discover the powerful activity happening on the star that keeps our solar system alive.
          </p>
        </div>

        {/* Three Verified Educational Reference Cards (Not Live Measurements) */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
          {SOLAR_REFERENCE_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120]/90 p-5 backdrop-blur-sm"
            >
              <div>
                <p className="font-mono text-xs text-cyan-300">{stat.sourceLabel}</p>
                <h2 className="mt-2 text-xs font-medium text-slate-300">{stat.label}</h2>
                <p className="mt-1.5 font-display text-2xl font-bold text-white tabular-nums">
                  {stat.value}
                </p>
              </div>
              <p className="mt-3 border-t border-slate-800/80 pt-3 text-xs leading-relaxed text-slate-300">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
