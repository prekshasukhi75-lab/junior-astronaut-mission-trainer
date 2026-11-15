import { ArrowRight } from 'lucide-react';
import {
  DISCOVER_MOON_FACTS,
  FEATURED_MOON_MEDIA,
} from '../data/scienceCentreData';
import { SpaceImage } from './SpaceImage';

interface FeaturedDiscoveryProps {
  onInspectMoonModule: () => void;
}

export function FeaturedDiscovery({ onInspectMoonModule }: FeaturedDiscoveryProps) {
  return (
    <section
      id="discover-moon"
      aria-labelledby="discover-moon-heading"
      className="border-b border-slate-800/80 bg-[#080D1B] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: High-resolution orbital lunar photography */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl border border-slate-800/90 bg-[#060913]">
              <SpaceImage
                src={FEATURED_MOON_MEDIA.imageSrc}
                alt={FEATURED_MOON_MEDIA.imageAlt}
                fallbackTitle="Discover the Moon"
                className="h-full w-full object-cover lg:h-full"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060913]/65 via-transparent to-transparent"
              />
            </div>
          </div>

          {/* Right: Educational Moon Overview */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8 lg:col-span-6">
            <div>
              <p className="font-mono text-xs tracking-wider text-cyan-400">
                Featured Discovery
              </p>

              <h2
                id="discover-moon-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-4xl"
              >
                DISCOVER THE MOON
              </h2>

              <p className="mt-4 text-base leading-relaxed text-slate-200">
                Earth’s closest neighbor in space is a rocky, crater-covered world with no clouds,
                no wind, and no protective blanket of air. Because there is no thick atmosphere to
                hold warmth in or shield the ground, sunlit lunar plains can heat up past boiling
                while deep craters at the poles stay colder than liquid nitrogen.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                NASA missions study the Moon’s craters, ancient volcanic plains, and shadowed
                polar ice to help future astronauts learn how to live and conduct science beyond
                Earth.
              </p>
            </div>

            {/* Clean unboxed educational reference facts */}
            <div className="mt-8 border-t border-slate-800/80 pt-6">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {DISCOVER_MOON_FACTS.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs font-medium text-slate-400">{fact.label}</dt>
                    <dd className="mt-1 font-mono text-lg font-semibold text-white tabular-nums">
                      {fact.value}
                    </dd>
                    <dd className="mt-0.5 text-xs text-slate-400">{fact.note}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7">
                <button
                  type="button"
                  onClick={onInspectMoonModule}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-slate-700 bg-[#111B33] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-cyan-400/70 hover:bg-cyan-500/15 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 cursor-pointer"
                >
                  <span>Explore Moon Temperature</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
