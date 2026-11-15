import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  DAY_VS_NIGHT_DATA,
  type DayNightMode,
} from '../../data/moonTemperatureData';
import { SpaceImage } from '../SpaceImage';

export function DayVsNightSection() {
  const [activeMode, setActiveMode] = useState<DayNightMode>('day');
  const activeCondition = DAY_VS_NIGHT_DATA[activeMode];

  return (
    <section
      id="day-vs-night"
      aria-labelledby="day-vs-night-heading"
      className="border-b border-slate-800/80 bg-[#080D1B] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Thermal Comparison · 14-Day Cycle
            </p>
            <h2
              id="day-vs-night-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
            >
              DAY VS NIGHT ON THE MOON
            </h2>
          </div>

          {/* Interactive Day / Night Switch */}
          <div
            role="group"
            aria-label="Select lunar lighting condition"
            className="inline-flex rounded-lg border border-slate-700/80 bg-[#0B1120] p-1 self-start"
          >
            <button
              type="button"
              onClick={() => setActiveMode('day')}
              aria-pressed={activeMode === 'day'}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeMode === 'day'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50'
                  : 'text-slate-300 hover:text-white border border-transparent'
              }`}
            >
              <Sun className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Moon in Sunlight</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('night')}
              aria-pressed={activeMode === 'night'}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeMode === 'night'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50'
                  : 'text-slate-300 hover:text-white border border-transparent'
              }`}
            >
              <Moon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Moon During Lunar Night</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Visual Comparison Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {(['day', 'night'] as const).map((modeKey) => {
            const item = DAY_VS_NIGHT_DATA[modeKey];
            const isHighlighted = activeMode === modeKey;
            return (
              <button
                key={modeKey}
                type="button"
                onClick={() => setActiveMode(modeKey)}
                aria-pressed={isHighlighted}
                className={`flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  isHighlighted
                    ? modeKey === 'day'
                      ? 'border-amber-400/80 bg-[#0D1528]'
                      : 'border-cyan-400/80 bg-[#0D1528]'
                    : 'border-slate-800/90 bg-[#0B1120] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-800/80">
                  <SpaceImage
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fallbackTitle={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="font-mono text-xs text-cyan-300">
                    {item.conditionLabel}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                    {item.explanation}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Condition Mission Readout */}
        <div className="mt-6 rounded-xl border border-slate-800/90 bg-[#0B1120] p-6">
          <p className="font-mono text-xs text-cyan-300">
            Selected Condition Briefing · {activeCondition.title}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-bold text-white">
                How Astronauts &amp; Equipment Stay Safe
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                {activeCondition.astronautImpact}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Solar Power Availability
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                {activeCondition.solarPowerNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
