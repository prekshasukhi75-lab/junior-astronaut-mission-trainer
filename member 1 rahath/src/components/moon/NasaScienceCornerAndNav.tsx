import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import {
  MOON_TEMP_MEDIA,
  NASA_SCIENCE_CORNER_ITEMS,
} from '../../data/moonTemperatureData';
import { NASA_LUNAR_DATA_STATUS } from '../../services/lunarDataService';
import { SpaceImage } from '../SpaceImage';

interface NasaScienceCornerAndNavProps {
  onBackToScienceCentre: () => void;
  onNavigateSolarActivity: () => void;
  onExploreNasaImages: () => void;
}

export function NasaScienceCornerAndNav({
  onBackToScienceCentre,
  onNavigateSolarActivity,
  onExploreNasaImages,
}: NasaScienceCornerAndNavProps) {
  return (
    <div className="bg-[#080D1B]">
      {/* Section 8: NASA Science Corner */}
      <section
        id="nasa-science-corner"
        aria-labelledby="nasa-corner-heading"
        className="border-b border-slate-800/80 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B1120]">
                <div className="aspect-[4/3] w-full overflow-hidden lg:flex-1">
                  <SpaceImage
                    src={MOON_TEMP_MEDIA.lro.src}
                    alt={MOON_TEMP_MEDIA.lro.alt}
                    fallbackTitle="Lunar Reconnaissance Orbiter"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="border-t border-slate-800/80 px-4 py-3 font-mono text-xs text-slate-400">
                  {MOON_TEMP_MEDIA.lro.attribution}
                </figcaption>
              </figure>
            </div>

            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="font-mono text-xs tracking-wider text-cyan-400">
                  Orbital Temperature Science
                </p>
                <h2
                  id="nasa-corner-heading"
                  className="mt-2 font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-4xl"
                >
                  NASA SCIENCE CORNER
                </h2>

                <div className="mt-6 space-y-4">
                  {NASA_SCIENCE_CORNER_ITEMS.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-xl border border-slate-800/90 bg-[#0B1120] p-5"
                    >
                      <h3 className="font-display text-lg font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100 sm:text-sm">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                <div>
                  <p>
                    <strong>Observations vs. Educational Simulations:</strong> NASA’s{' '}
                    {NASA_LUNAR_DATA_STATUS.missionName} and{' '}
                    {NASA_LUNAR_DATA_STATUS.instrumentName} collect historical scientific
                    infrared observations of the Moon. The maps and activities on this page are
                    interactive educational simulations—not live NASA feeds.
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-amber-200/90">
                    Source attribution: NASA Science / LRO Mission &amp; Diviner Experiment ·
                    Status: {NASA_LUNAR_DATA_STATUS.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Destination Navigation */}
      <section
        aria-label="Moon Temperature Explorer navigation"
        className="border-b border-slate-800/80 bg-[#060913] py-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="font-mono text-xs text-cyan-400">Continue Exploring</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
              Visit another NASA Science Centre station
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
              onClick={onExploreNasaImages}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#F04A3E] cursor-pointer"
            >
              <span>NASA Image Explorer</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
