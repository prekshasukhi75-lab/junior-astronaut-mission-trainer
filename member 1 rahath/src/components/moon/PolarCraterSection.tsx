import {
  MOON_TEMP_MEDIA,
  POLAR_CRATER_TOPICS,
} from '../../data/moonTemperatureData';
import { SpaceImage } from '../SpaceImage';

export function PolarCraterSection() {
  return (
    <section
      id="polar-crater-discovery"
      aria-labelledby="polar-crater-heading"
      className="border-b border-slate-800/80 bg-[#060913] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B1120]">
              <div className="aspect-[4/3] w-full overflow-hidden lg:flex-1">
                <SpaceImage
                  src={MOON_TEMP_MEDIA.polarCrater.src}
                  alt={MOON_TEMP_MEDIA.polarCrater.alt}
                  fallbackTitle="Lunar Polar Crater"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="border-t border-slate-800/80 px-4 py-3 font-mono text-xs text-slate-400">
                {MOON_TEMP_MEDIA.polarCrater.attribution}
              </figcaption>
            </figure>
          </div>

          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="font-mono text-xs tracking-wider text-cyan-400">
                Polar Science · Cold Traps &amp; Water Ice
              </p>
              <h2
                id="polar-crater-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-4xl"
              >
                POLAR CRATER DISCOVERY
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {POLAR_CRATER_TOPICS.map((topic) => (
                <article
                  key={topic.title}
                  className="rounded-xl border border-slate-800/90 bg-[#0B1120] p-5"
                >
                  <h3 className="font-display text-base font-bold text-white">
                    {topic.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                    {topic.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
