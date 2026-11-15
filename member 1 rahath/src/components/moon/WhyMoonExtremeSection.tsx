import { MOON_TEMP_MEDIA, WHY_EXTREME_CARDS } from '../../data/moonTemperatureData';
import { SpaceImage } from '../SpaceImage';

export function WhyMoonExtremeSection() {
  return (
    <section
      id="why-moon-extreme"
      aria-labelledby="why-extreme-heading"
      className="border-b border-slate-800/80 bg-[#080D1B] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Lunar Climate Basics
            </p>
            <h2
              id="why-extreme-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
            >
              WHY IS THE MOON SO EXTREME?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              On Earth, oceans and swirling air keep temperatures fairly mild. On the Moon,
              sunlight and shadow rule everything.
            </p>

            {/* Realistic contrast visual */}
            <figure className="mt-6 overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B1120]">
              <div className="grid grid-cols-2 border-b border-slate-800/80">
                <div className="aspect-[4/3] overflow-hidden border-r border-slate-800/80">
                  <SpaceImage
                    src={MOON_TEMP_MEDIA.day.src}
                    alt={MOON_TEMP_MEDIA.day.alt}
                    fallbackTitle="Lunar Day"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] overflow-hidden">
                  <SpaceImage
                    src={MOON_TEMP_MEDIA.night.src}
                    alt={MOON_TEMP_MEDIA.night.alt}
                    fallbackTitle="Lunar Night"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <figcaption className="px-4 py-3 font-mono text-xs text-slate-400">
                Left: Direct lunar sunlight · Right: Cold lunar night lit by Earthshine
              </figcaption>
            </figure>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
            {WHY_EXTREME_CARDS.map((card) => (
              <article
                key={card.index}
                className="rounded-xl border border-slate-800/90 bg-[#0B1120] p-6"
              >
                <p className="font-mono text-xs text-cyan-300">
                  {card.index} <span aria-hidden="true">·</span> Key Reason
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-white">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
