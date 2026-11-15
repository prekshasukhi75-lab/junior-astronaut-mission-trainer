import { ArrowDownRight } from 'lucide-react';
import { HERO_MEDIA } from '../data/scienceCentreData';
import { SpaceImage } from './SpaceImage';

interface HeroSectionProps {
  onStartExploring: () => void;
}

export function HeroSection({ onStartExploring }: HeroSectionProps) {
  return (
    <section
      id="science-centre"
      className="relative isolate overflow-hidden border-b border-slate-800/80 bg-[#060913]"
    >
      {/* Full-bleed lunar astronaut photography */}
      <div className="absolute inset-0 -z-10">
        <SpaceImage
          src={HERO_MEDIA.imageSrc}
          alt={HERO_MEDIA.imageAlt}
          fallbackTitle="NASA Lunar Surface Expedition"
          className="h-full w-full object-cover object-center sm:object-[65%_35%]"
        />
        {/* Measured scrims ensuring WCAG AA contrast for typography */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#060913]/95 via-[#060913]/75 to-[#060913]/30"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-[#060913]/45"
        />
      </div>

      <div className="mx-auto flex min-h-[540px] max-w-7xl flex-col justify-center px-4 py-20 sm:min-h-[600px] sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-wider text-cyan-300 sm:text-sm">
            Mission: Little Astronaut · Space Exploration Hub
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-6xl">
            NASA SCIENCE CENTRE
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-xl">
            Explore the science behind life beyond Earth.
          </p>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
            Designed for young explorers aged 7–12 to investigate solar storms, lunar surface
            temperatures, real NASA photography, and how astronauts survive off Earth.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={onStartExploring}
              className="group inline-flex min-h-[44px] items-center gap-2.5 bg-[#E03C31] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 rounded-md transition-all duration-150 hover:bg-[#F04A3E] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 cursor-pointer"
            >
              <span>Start Exploring</span>
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
