import { useState } from 'react';
import { Info, MapPin } from 'lucide-react';
import {
  LUNAR_MAP_REGIONS,
  type LunarRegionId,
} from '../../data/moonTemperatureData';

export function InteractiveLunarMap() {
  const [selectedRegionId, setSelectedRegionId] =
    useState<LunarRegionId>('sunlit-surface');

  const activeRegion =
    LUNAR_MAP_REGIONS.find((region) => region.id === selectedRegionId) ??
    LUNAR_MAP_REGIONS[0];

  return (
    <section
      id="lunar-temperature-map"
      aria-labelledby="lunar-map-heading"
      className="border-b border-slate-800/80 bg-[#060913] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Interactive Exploration Map · 4 Selectable Regions
            </p>
            <h2
              id="lunar-map-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
            >
              INTERACTIVE LUNAR TEMPERATURE MAP
            </h2>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-xs leading-relaxed text-amber-200 max-w-md">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            <span>
              <strong>Illustrative Educational Model:</strong> Region guides show relative
              heating and cooling conditions—not live NASA temperature measurements.
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Interactive Moon Sphere Diagram */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 lg:col-span-6">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-mono text-cyan-300">
                Click any marker on the Moon
              </span>
              <span className="font-mono">Solar illumination from left</span>
            </div>

            <div className="my-4 flex items-center justify-center">
              <svg
                viewBox="0 0 380 340"
                role="img"
                aria-label="Interactive temperature map of the Moon with four selectable regions"
                className="h-auto w-full max-w-[380px]"
              >
                <defs>
                  <linearGradient id="moonDayNightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
                    <stop offset="48%" stopColor="#94A3B8" stopOpacity="0.85" />
                    <stop offset="56%" stopColor="#1E293B" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#090F24" stopOpacity="0.98" />
                  </linearGradient>
                  <radialGradient id="polarColdCap" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0E7490" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Starfield Grid Backdrop */}
                <rect width="380" height="340" rx="14" fill="#050811" />
                <circle cx="42" cy="45" r="1.2" fill="#94A3B8" opacity="0.6" />
                <circle cx="330" cy="58" r="1.5" fill="#94A3B8" opacity="0.5" />
                <circle cx="342" cy="285" r="1.2" fill="#94A3B8" opacity="0.6" />
                <circle cx="48" cy="292" r="1.2" fill="#94A3B8" opacity="0.5" />

                {/* Incoming Sunlight Arrows on Left */}
                <line x1="12" y1="120" x2="46" y2="120" stroke="#FBBF24" strokeWidth="2" />
                <line x1="12" y1="170" x2="46" y2="170" stroke="#FBBF24" strokeWidth="2" />
                <line x1="12" y1="220" x2="46" y2="220" stroke="#FBBF24" strokeWidth="2" />

                {/* Moon Sphere */}
                <circle
                  cx="190"
                  cy="170"
                  r="116"
                  fill="url(#moonDayNightGrad)"
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* Subtle Lunar Craters */}
                <circle cx="132" cy="128" r="16" fill="#0F172A" opacity="0.16" />
                <circle cx="155" cy="212" r="22" fill="#0F172A" opacity="0.18" />
                <circle cx="236" cy="126" r="18" fill="#020617" opacity="0.35" />
                <circle cx="242" cy="214" r="14" fill="#020617" opacity="0.35" />

                {/* Polar Cold Zone Glows */}
                <ellipse cx="188" cy="272" rx="40" ry="18" fill="url(#polarColdCap)" />
                <ellipse cx="188" cy="72" rx="34" ry="14" fill="url(#polarColdCap)" opacity="0.6" />

                {/* Day / Night Terminator Line */}
                <path
                  d="M 190 54 A 24 116 0 0 1 190 286"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* 4 Clickable Region Markers */}
                {LUNAR_MAP_REGIONS.map((region) => {
                  const isActive = region.id === activeRegion.id;
                  return (
                    <g
                      key={region.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${region.name}`}
                      aria-pressed={isActive}
                      onClick={() => setSelectedRegionId(region.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedRegionId(region.id);
                        }
                      }}
                      className="cursor-pointer focus:outline-none"
                    >
                      <circle
                        cx={region.mapCoords.cx}
                        cy={region.mapCoords.cy}
                        r={isActive ? 20 : 16}
                        fill={isActive ? '#0891B2' : '#0B1120'}
                        stroke={isActive ? '#67E8F9' : '#E2E8F0'}
                        strokeWidth={isActive ? 2.5 : 1.5}
                      />
                      <text
                        x={region.mapCoords.cx}
                        y={region.mapCoords.cy + 4}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontFamily="IBM Plex Mono, monospace"
                        fontWeight="600"
                      >
                        {region.number}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Region Selector Buttons */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LUNAR_MAP_REGIONS.map((region) => {
                const isActive = region.id === activeRegion.id;
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => setSelectedRegionId(region.id)}
                    aria-pressed={isActive}
                    className={`flex min-h-[44px] items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                        : 'border-slate-800 bg-[#060913] text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-cyan-300">{region.number}.</span>
                    <span className="truncate">{region.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Region Information & Illustrative Temperature Panel */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Region {activeRegion.number} Selected</span>
              </div>

              <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                {activeRegion.name}
              </h3>

              <p className="mt-3 text-base leading-relaxed text-slate-200">
                {activeRegion.summary}
              </p>

              <div className="mt-6 border-t border-slate-800/80 pt-5">
                <h4 className="font-mono text-xs text-slate-400">
                  Why Its Temperature Conditions Are Different
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {activeRegion.whyDifferent}
                </p>
              </div>
            </div>

            {/* Temperature Information Panel (Illustrative Scale Only) */}
            <div className="mt-8 rounded-xl border border-slate-800 bg-[#060913] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-cyan-300">
                  Temperature Information Panel
                </span>
                <span className="font-mono text-[11px] text-amber-300">
                  Illustrative Example · Not Live NASA Data
                </span>
              </div>

              <p className="mt-2 font-display text-xl font-bold text-white">
                {activeRegion.illustrativeCondition}
              </p>

              {/* Illustrative Relative Thermal Bar */}
              <div className="mt-4">
                <div className="flex justify-between font-mono text-[11px] text-slate-400">
                  <span>Extreme Cold</span>
                  <span>Moderate</span>
                  <span>Intense Heat</span>
                </div>
                <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-slate-500 to-amber-500">
                  <div
                    className="relative h-full"
                    style={{ width: `${activeRegion.thermalScalePercent}%` }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-0 h-full w-1.5 bg-white shadow"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {activeRegion.illustrativeLabel} — exact orbital measurements will appear
                  once NASA LRO/Diviner datasets are connected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
