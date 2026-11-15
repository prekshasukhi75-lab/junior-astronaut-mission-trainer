import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import { PLANET_LAB_PROFILES } from '../../data/spaceScienceLabData';
import type { PlanetLabProfile } from '../../types/spaceLab';

interface SolarSystemBuilderProps {
  onObservationChange: (summary: string) => void;
}

const INITIAL_ANGLES: Record<PlanetLabProfile['id'], number> = {
  mercury: 0.4,
  venus: 1.5,
  earth: 2.7,
  mars: 3.9,
  jupiter: 5.0,
  saturn: 0.9,
  uranus: 2.1,
  neptune: 4.3,
};

export function SolarSystemBuilder({
  onObservationChange,
}: SolarSystemBuilderProps) {
  const [activePlanetIds, setActivePlanetIds] = useState<
    PlanetLabProfile['id'][]
  >(() => PLANET_LAB_PROFILES.map((p) => p.id));
  const [selectedPlanetId, setSelectedPlanetId] =
    useState<PlanetLabProfile['id']>('earth');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<0.5 | 1 | 2>(1);
  const [angles, setAngles] =
    useState<Record<PlanetLabProfile['id'], number>>(INITIAL_ANGLES);

  // Planet Order / Arrangement Builder
  const [mode, setMode] = useState<'explore' | 'arrange'>('explore');
  const [arrangedOrder, setArrangedOrder] = useState<PlanetLabProfile['id'][]>(
    () => [
      'earth',
      'mercury',
      'jupiter',
      'venus',
      'mars',
      'neptune',
      'saturn',
      'uranus',
    ]
  );
  const [swapFirstIdx, setSwapFirstIdx] = useState<number | null>(null);

  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    let rafId = 0;
    const animate = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      setAngles((prev) => {
        const next = { ...prev };
        for (const planet of PLANET_LAB_PROFILES) {
          next[planet.id] =
            (prev[planet.id] + dt * 0.45 * planet.orbitSpeedMultiplier * speedMultiplier) %
            (Math.PI * 2);
        }
        return next;
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, speedMultiplier]);

  const selectedPlanet =
    PLANET_LAB_PROFILES.find((p) => p.id === selectedPlanetId) ??
    PLANET_LAB_PROFILES[2];

  const handleSelectPlanet = (planet: PlanetLabProfile) => {
    setSelectedPlanetId(planet.id);
    if (!activePlanetIds.includes(planet.id)) {
      setActivePlanetIds((prev) => [...prev, planet.id]);
    }
    onObservationChange(
      `Inspecting ${planet.name} (Planet #${planet.orderFromSun} from the Sun): ${planet.distanceAU} AU away, diameter ${planet.diameterKm.toLocaleString()} km, orbital period ${planet.orbitalPeriodLabel}.`
    );
  };

  const handleTogglePlanetInSystem = (planetId: PlanetLabProfile['id']) => {
    setActivePlanetIds((prev) => {
      if (prev.includes(planetId)) {
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== planetId);
      }
      return [...prev, planetId];
    });
  };

  const handleIncludeAllPlanets = () => {
    setActivePlanetIds(PLANET_LAB_PROFILES.map((p) => p.id));
  };

  const handleArrangeSlotClick = (slotIdx: number) => {
    if (swapFirstIdx === null) {
      setSwapFirstIdx(slotIdx);
      return;
    }
    if (swapFirstIdx === slotIdx) {
      setSwapFirstIdx(null);
      return;
    }
    setArrangedOrder((prev) => {
      const next = [...prev];
      const temp = next[swapFirstIdx];
      next[swapFirstIdx] = next[slotIdx];
      next[slotIdx] = temp;
      return next;
    });
    setSwapFirstIdx(null);
  };

  const handleAutoSortRealOrder = () => {
    setArrangedOrder(PLANET_LAB_PROFILES.map((p) => p.id));
    setSwapFirstIdx(null);
    onObservationChange(
      'All 8 planets are arranged in their true order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!'
    );
  };

  const handleShuffleOrder = () => {
    setArrangedOrder([
      'mars',
      'saturn',
      'mercury',
      'neptune',
      'earth',
      'uranus',
      'venus',
      'jupiter',
    ]);
    setSwapFirstIdx(null);
  };

  const correctPositionsCount = arrangedOrder.filter(
    (id, idx) => PLANET_LAB_PROFILES[idx].id === id
  ).length;

  const displaySequence =
    mode === 'arrange'
      ? arrangedOrder
          .map((id) => PLANET_LAB_PROFILES.find((p) => p.id === id)!)
          .filter(Boolean)
      : PLANET_LAB_PROFILES;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: Animated Solar System Orbital Map */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#060913] p-5 lg:col-span-7">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('explore')}
                aria-pressed={mode === 'explore'}
                className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'explore'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                    : 'border-slate-700 bg-[#0B1120] text-slate-300'
                }`}
              >
                Orbit Builder
              </button>
              <button
                type="button"
                onClick={() => setMode('arrange')}
                aria-pressed={mode === 'arrange'}
                className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'arrange'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                    : 'border-slate-700 bg-[#0B1120] text-slate-300'
                }`}
              >
                Arrange Planet Order ({correctPositionsCount}/8)
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause orbits' : 'Play orbits'}
                className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-slate-700 bg-[#0B1120] px-3 py-1.5 text-xs font-semibold text-white hover:border-cyan-400/70 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                    <span>Orbit</span>
                  </>
                )}
              </button>

              {([0.5, 1, 2] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSpeedMultiplier(spd)}
                  aria-pressed={speedMultiplier === spd}
                  className={`min-h-[36px] rounded-md border px-2.5 py-1 text-xs font-mono cursor-pointer ${
                    speedMultiplier === spd
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                      : 'border-slate-800 bg-[#0B1120] text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}×
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Orbital Stage */}
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-[#040710]">
            <svg
              viewBox="0 0 600 600"
              role="img"
              aria-label="Interactive Solar System orbit builder. Click any planet to inspect its facts."
              className="mx-auto block h-auto w-full max-w-[540px]"
            >
              <defs>
                <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="55%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Stars */}
              <circle cx="64" cy="72" r="1.4" fill="#94A3B8" opacity="0.6" />
              <circle cx="520" cy="95" r="1.2" fill="#94A3B8" opacity="0.5" />
              <circle cx="490" cy="510" r="1.5" fill="#94A3B8" opacity="0.6" />
              <circle cx="92" cy="490" r="1.2" fill="#94A3B8" opacity="0.5" />
              <circle cx="310" cy="36" r="1.3" fill="#94A3B8" opacity="0.5" />

              {/* Central Sun */}
              <circle cx="300" cy="300" r="44" fill="url(#sunGlowGrad)" opacity="0.5" />
              <circle cx="300" cy="300" r="24" fill="#FBBF24" stroke="#FEF08A" strokeWidth="2" />
              <text
                x="300"
                y="304"
                textAnchor="middle"
                fill="#060913"
                fontSize="10"
                fontWeight="700"
                fontFamily="IBM Plex Mono, monospace"
              >
                SUN
              </text>

              {/* Orbit Rings & Clickable Planets */}
              {displaySequence.map((planet, slotIndex) => {
                const orbitRadius = 48 + slotIndex * 30;
                const isActive =
                  mode === 'arrange' || activePlanetIds.includes(planet.id);
                const isSelected = planet.id === selectedPlanet.id;
                const angle = angles[planet.id] ?? 0;
                const px = 300 + Math.cos(angle) * orbitRadius;
                const py = 300 + Math.sin(angle) * orbitRadius;

                return (
                  <g key={`${mode}-${planet.id}`}>
                    <circle
                      cx="300"
                      cy="300"
                      r={orbitRadius}
                      fill="none"
                      stroke={
                        isSelected
                          ? 'rgba(34, 211, 238, 0.55)'
                          : isActive
                            ? 'rgba(148, 163, 184, 0.25)'
                            : 'rgba(51, 65, 85, 0.14)'
                      }
                      strokeWidth={isSelected ? 1.8 : 1}
                      strokeDasharray={isActive ? undefined : '4 4'}
                    />

                    {isActive && (
                      <g
                        role="button"
                        tabIndex={0}
                        aria-label={`Inspect ${planet.name}`}
                        onClick={() => handleSelectPlanet(planet)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectPlanet(planet);
                          }
                        }}
                        className="cursor-pointer focus:outline-none"
                      >
                        {/* Invisible larger click target */}
                        <circle cx={px} cy={py} r={Math.max(18, planet.relativeRadiusPx + 8)} fill="transparent" />

                        {isSelected && (
                          <circle
                            cx={px}
                            cy={py}
                            r={planet.relativeRadiusPx + 6}
                            fill="none"
                            stroke="#22D3EE"
                            strokeWidth="2"
                          />
                        )}

                        {planet.hasRings && (
                          <ellipse
                            cx={px}
                            cy={py}
                            rx={planet.relativeRadiusPx + 9}
                            ry={planet.relativeRadiusPx * 0.42}
                            fill="none"
                            stroke="#FDE68A"
                            strokeWidth="2"
                            transform={`rotate(-22 ${px} ${py})`}
                          />
                        )}

                        <circle
                          cx={px}
                          cy={py}
                          r={planet.relativeRadiusPx}
                          fill={planet.colorHex}
                          stroke={isSelected ? '#FFFFFF' : planet.accentHex}
                          strokeWidth="1.5"
                        />

                        <text
                          x={px}
                          y={py + planet.relativeRadiusPx + 13}
                          textAnchor="middle"
                          fill={isSelected ? '#67E8F9' : '#CBD5E1'}
                          fontSize="10"
                          fontFamily="Public Sans, sans-serif"
                          fontWeight={isSelected ? '700' : '500'}
                        >
                          {planet.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Bottom Dock: Toggle Planets OR Arrange Order */}
        {mode === 'explore' ? (
          <div className="mt-4 border-t border-slate-800/80 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs text-cyan-300">
                Include or Remove Planets in Your System ({activePlanetIds.length}/8 active)
              </p>
              <button
                type="button"
                onClick={handleIncludeAllPlanets}
                className="inline-flex min-h-[34px] items-center gap-1 rounded border border-slate-700 bg-[#0B1120] px-2.5 py-1 text-xs text-slate-200 hover:border-cyan-400/70 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span>Show All 8</span>
              </button>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {PLANET_LAB_PROFILES.map((planet) => {
                const included = activePlanetIds.includes(planet.id);
                return (
                  <button
                    key={planet.id}
                    type="button"
                    onClick={() => handleTogglePlanetInSystem(planet.id)}
                    aria-pressed={included}
                    className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      included
                        ? 'border-cyan-400/70 bg-cyan-500/15 text-cyan-100'
                        : 'border-slate-800 bg-[#0B1120] text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {included ? '✓ ' : '+ '}
                    {planet.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4 border-t border-slate-800/80 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs text-cyan-300">
                Click any two slots to swap planets into order from the Sun (1 → 8)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleShuffleOrder}
                  className="inline-flex min-h-[34px] items-center gap-1 rounded border border-slate-700 bg-[#0B1120] px-2.5 py-1 text-xs text-slate-200 hover:border-cyan-400/70 cursor-pointer"
                >
                  <Shuffle className="h-3 w-3" aria-hidden="true" />
                  <span>Shuffle</span>
                </button>
                <button
                  type="button"
                  onClick={handleAutoSortRealOrder}
                  className="inline-flex min-h-[34px] items-center gap-1 rounded bg-[#E03C31] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#F04A3E] cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  <span>Real Order</span>
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {arrangedOrder.map((id, idx) => {
                const planet = PLANET_LAB_PROFILES.find((p) => p.id === id)!;
                const isRightSlot = PLANET_LAB_PROFILES[idx].id === id;
                const isSwapSelected = swapFirstIdx === idx;
                return (
                  <button
                    key={`${id}-${idx}`}
                    type="button"
                    onClick={() => handleArrangeSlotClick(idx)}
                    className={`flex min-h-[46px] items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      isSwapSelected
                        ? 'border-amber-400 bg-amber-500/20 text-amber-100'
                        : isRightSlot
                          ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100'
                          : 'border-slate-800 bg-[#0B1120] text-slate-200 hover:border-cyan-400/60'
                    }`}
                  >
                    <span>
                      <span className="font-mono text-slate-400">#{idx + 1} </span>
                      {planet.name}
                    </span>
                    {isRightSlot && (
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right: Selected Planet NASA Facts & Quick Selector */}
      <div className="flex flex-col justify-between space-y-5 lg:col-span-5">
        <div className="rounded-xl border border-cyan-500/35 bg-[#060913] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-cyan-300">
                Selected Planet · Orbit #{selectedPlanet.orderFromSun}
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                {selectedPlanet.name}
              </h3>
            </div>

            <div
              style={{
                backgroundColor: selectedPlanet.colorHex,
                borderColor: selectedPlanet.accentHex,
              }}
              className="h-12 w-12 shrink-0 rounded-full border-2 shadow-lg"
            />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-5">
            <div className="rounded-lg border border-slate-800 bg-[#0B1120] p-3">
              <dt className="font-mono text-[11px] text-slate-400">Diameter</dt>
              <dd className="mt-1 font-mono text-base font-bold text-white tabular-nums">
                {selectedPlanet.diameterKm.toLocaleString()} km
              </dd>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B1120] p-3">
              <dt className="font-mono text-[11px] text-slate-400">
                Distance from Sun
              </dt>
              <dd className="mt-1 font-mono text-base font-bold text-white tabular-nums">
                {selectedPlanet.distanceMillionKm}M km
              </dd>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B1120] p-3">
              <dt className="font-mono text-[11px] text-slate-400">
                Orbital Period (Year)
              </dt>
              <dd className="mt-1 font-mono text-base font-bold text-cyan-300 tabular-nums">
                {selectedPlanet.orbitalPeriodLabel}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B1120] p-3">
              <dt className="font-mono text-[11px] text-slate-400">
                Gravity / Moons
              </dt>
              <dd className="mt-1 font-mono text-base font-bold text-white tabular-nums">
                {selectedPlanet.gravityMs2} m/s² · {selectedPlanet.moonsCount} moons
              </dd>
            </div>
          </dl>

          <p className="mt-5 text-sm leading-relaxed text-slate-200">
            {selectedPlanet.quickFact}
          </p>
        </div>

        {/* Clickable Planet Selector List */}
        <div className="rounded-xl border border-slate-800 bg-[#060913] p-5">
          <p className="font-mono text-xs text-cyan-300">
            Quick Planet Inspector (Click Any Planet)
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {PLANET_LAB_PROFILES.map((planet) => {
              const active = planet.id === selectedPlanet.id;
              return (
                <button
                  key={planet.id}
                  type="button"
                  onClick={() => handleSelectPlanet(planet)}
                  aria-pressed={active}
                  className={`flex min-h-[42px] items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'border-cyan-400 bg-cyan-500/15 text-white'
                      : 'border-slate-800 bg-[#0B1120] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span
                    style={{ backgroundColor: planet.colorHex }}
                    className="h-3 w-3 shrink-0 rounded-full"
                    aria-hidden="true"
                  />
                  <span className="truncate">{planet.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
