import { useEffect, useRef, useState } from 'react';
import { ArrowDown, RotateCcw } from 'lucide-react';
import { GRAVITY_LAB_PLANETS } from '../../data/spaceScienceLabData';
import type { PlanetLabProfile } from '../../types/spaceLab';

interface PlanetGravityLabProps {
  onObservationChange: (summary: string) => void;
}

type DropObjectId = 'moon-rock' | 'astronaut-boot' | 'rover-wheel';

const DROP_OBJECTS: Array<{
  id: DropObjectId;
  label: string;
  massLabel: string;
}> = [
  { id: 'moon-rock', label: 'Moon Rock', massLabel: '2.5 kg' },
  { id: 'astronaut-boot', label: 'Astronaut Boot', massLabel: '1.2 kg' },
  { id: 'rover-wheel', label: 'Rover Wheel', massLabel: '8.0 kg' },
];

const DROP_HEIGHT_METERS = 20;
const EARTH_GRAVITY = 9.81;

export function PlanetGravityLab({ onObservationChange }: PlanetGravityLabProps) {
  const [selectedPlanetId, setSelectedPlanetId] =
    useState<PlanetLabProfile['id']>('mars');
  const [selectedObject, setSelectedObject] =
    useState<DropObjectId>('moon-rock');
  const [compareEarth, setCompareEarth] = useState(true);

  const [isDropping, setIsDropping] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [planetDropDist, setPlanetDropDist] = useState(0);
  const [earthDropDist, setEarthDropDist] = useState(0);
  const [lastDropSummary, setLastDropSummary] = useState<string | null>(null);

  const rafRef = useRef<number | null>(null);

  const selectedPlanet =
    GRAVITY_LAB_PLANETS.find((p) => p.id === selectedPlanetId) ??
    GRAVITY_LAB_PLANETS[0];

  const planetTotalTime = Math.sqrt(
    (2 * DROP_HEIGHT_METERS) / selectedPlanet.gravityMs2
  );
  const earthTotalTime = Math.sqrt((2 * DROP_HEIGHT_METERS) / EARTH_GRAVITY);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const stopAnimation = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const resetDrop = () => {
    stopAnimation();
    setIsDropping(false);
    setElapsedSec(0);
    setPlanetDropDist(0);
    setEarthDropDist(0);
  };

  const handleSelectPlanet = (planetId: PlanetLabProfile['id']) => {
    resetDrop();
    setSelectedPlanetId(planetId);
    const p =
      GRAVITY_LAB_PLANETS.find((item) => item.id === planetId) ??
      GRAVITY_LAB_PLANETS[0];
    onObservationChange(
      `${p.name} selected (${p.gravityMs2.toFixed(2)} m/s²). Press Drop Object to test a 20-meter fall and compare it with Earth (9.81 m/s²).`
    );
  };

  const handleStartDrop = () => {
    resetDrop();
    setIsDropping(true);
    const startMs = performance.now();
    const maxDurationSec = compareEarth
      ? Math.max(planetTotalTime, earthTotalTime)
      : planetTotalTime;

    const tick = (now: number) => {
      const t = Math.min((now - startMs) / 1000, maxDurationSec);
      const dPlanet = Math.min(
        DROP_HEIGHT_METERS,
        0.5 * selectedPlanet.gravityMs2 * t * t
      );
      const dEarth = Math.min(
        DROP_HEIGHT_METERS,
        0.5 * EARTH_GRAVITY * t * t
      );

      setElapsedSec(t);
      setPlanetDropDist(dPlanet);
      setEarthDropDist(dEarth);

      if (t < maxDurationSec) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIsDropping(false);
        rafRef.current = null;

        const planetImpactSpeed = selectedPlanet.gravityMs2 * planetTotalTime;
        const summary = compareEarth
          ? `On ${selectedPlanet.name} (${selectedPlanet.gravityMs2.toFixed(2)} m/s²), the 20 m drop took ${planetTotalTime.toFixed(2)} s (impact speed ${planetImpactSpeed.toFixed(1)} m/s), compared to ${earthTotalTime.toFixed(2)} s on Earth.`
          : `On ${selectedPlanet.name} (${selectedPlanet.gravityMs2.toFixed(2)} m/s²), the object fell 20 m in ${planetTotalTime.toFixed(2)} s, reaching ${planetImpactSpeed.toFixed(1)} m/s at touchdown.`;
        setLastDropSummary(summary);
        onObservationChange(summary);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const planetProgressPct = (planetDropDist / DROP_HEIGHT_METERS) * 100;
  const earthProgressPct = (earthDropDist / DROP_HEIGHT_METERS) * 100;
  const planetCurrentSpeed =
    planetDropDist >= DROP_HEIGHT_METERS
      ? selectedPlanet.gravityMs2 * planetTotalTime
      : selectedPlanet.gravityMs2 * elapsedSec;
  const earthCurrentSpeed =
    earthDropDist >= DROP_HEIGHT_METERS
      ? EARTH_GRAVITY * earthTotalTime
      : EARTH_GRAVITY * elapsedSec;

  const activeObjLabel =
    DROP_OBJECTS.find((o) => o.id === selectedObject)?.label ?? 'Moon Rock';

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: Interactive Drop Tower Simulation */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#060913] p-5 lg:col-span-7">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs text-cyan-300">
              20-Meter Vacuum Drop Chamber
            </span>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              Clock: {elapsedSec.toFixed(2)} s
            </span>
          </div>

          <div
            className={`mt-4 grid gap-4 ${
              compareEarth ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {/* Selected Planet Chamber */}
            <div className="flex flex-col rounded-xl border border-slate-800 bg-[#0B1120] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-base font-bold text-white">
                  {selectedPlanet.name}
                </span>
                <span className="font-mono text-xs font-semibold text-cyan-300 tabular-nums">
                  {selectedPlanet.gravityMs2.toFixed(2)} m/s²
                </span>
              </div>

              <div className="relative mt-3 h-64 overflow-hidden rounded-lg border border-slate-800 bg-gradient-to-b from-[#050811] to-[#0E172E]">
                {/* Height Grid Lines */}
                {[25, 50, 75].map((pct) => (
                  <div
                    key={pct}
                    style={{ top: `${pct}%` }}
                    className="absolute inset-x-0 border-t border-dashed border-slate-800/80"
                  />
                ))}
                <span className="absolute left-2 top-2 font-mono text-[10px] text-slate-500">
                  20 m
                </span>
                <span className="absolute left-2 bottom-4 font-mono text-[10px] text-slate-500">
                  0 m
                </span>

                {/* Falling Object */}
                <div
                  style={{
                    top: `calc(${Math.min(100, planetProgressPct) * 0.8}% + 10px)`,
                  }}
                  className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                >
                  <div
                    style={{
                      backgroundColor: selectedPlanet.colorHex,
                      borderColor: selectedPlanet.accentHex,
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-lg"
                  >
                    <span className="font-mono text-[10px] font-bold text-slate-950">
                      {selectedObject === 'moon-rock'
                        ? 'ROCK'
                        : selectedObject === 'astronaut-boot'
                          ? 'BOOT'
                          : 'WHL'}
                    </span>
                  </div>
                </div>

                {/* Planet Surface Floor */}
                <div
                  style={{ backgroundColor: selectedPlanet.colorHex }}
                  className="absolute inset-x-0 bottom-0 h-3 opacity-75"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs tabular-nums">
                <div className="rounded bg-[#060913] px-2.5 py-1.5">
                  <span className="block text-[10px] text-slate-400">
                    Fallen
                  </span>
                  <span className="text-white">
                    {planetDropDist.toFixed(1)} m
                  </span>
                </div>
                <div className="rounded bg-[#060913] px-2.5 py-1.5">
                  <span className="block text-[10px] text-slate-400">
                    Speed
                  </span>
                  <span className="text-cyan-300">
                    {planetCurrentSpeed.toFixed(1)} m/s
                  </span>
                </div>
              </div>
            </div>

            {/* Earth Reference Chamber */}
            {compareEarth && (
              <div className="flex flex-col rounded-xl border border-slate-800 bg-[#0B1120] p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-base font-bold text-white">
                    Earth (Baseline)
                  </span>
                  <span className="font-mono text-xs font-semibold text-sky-300 tabular-nums">
                    9.81 m/s²
                  </span>
                </div>

                <div className="relative mt-3 h-64 overflow-hidden rounded-lg border border-slate-800 bg-gradient-to-b from-[#050811] to-[#0C1D36]">
                  {[25, 50, 75].map((pct) => (
                    <div
                      key={pct}
                      style={{ top: `${pct}%` }}
                      className="absolute inset-x-0 border-t border-dashed border-slate-800/80"
                    />
                  ))}
                  <span className="absolute left-2 top-2 font-mono text-[10px] text-slate-500">
                    20 m
                  </span>
                  <span className="absolute left-2 bottom-4 font-mono text-[10px] text-slate-500">
                    0 m
                  </span>

                  <div
                    style={{
                      top: `calc(${Math.min(100, earthProgressPct) * 0.8}% + 10px)`,
                    }}
                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-200 bg-sky-500 shadow-lg">
                      <span className="font-mono text-[10px] font-bold text-slate-950">
                        {selectedObject === 'moon-rock'
                          ? 'ROCK'
                          : selectedObject === 'astronaut-boot'
                            ? 'BOOT'
                            : 'WHL'}
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-3 bg-sky-500/75" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs tabular-nums">
                  <div className="rounded bg-[#060913] px-2.5 py-1.5">
                    <span className="block text-[10px] text-slate-400">
                      Fallen
                    </span>
                    <span className="text-white">
                      {earthDropDist.toFixed(1)} m
                    </span>
                  </div>
                  <div className="rounded bg-[#060913] px-2.5 py-1.5">
                    <span className="block text-[10px] text-slate-400">
                      Speed
                    </span>
                    <span className="text-sky-300">
                      {earthCurrentSpeed.toFixed(1)} m/s
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons + Result */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleStartDrop}
              disabled={isDropping}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#E03C31] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#F04A3E] disabled:opacity-50 cursor-pointer"
            >
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
              <span>
                {isDropping
                  ? `Dropping ${activeObjLabel}...`
                  : `Drop ${activeObjLabel}`}
              </span>
            </button>

            <button
              type="button"
              onClick={resetDrop}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/70 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              resetDrop();
              setCompareEarth((prev) => !prev);
            }}
            aria-pressed={compareEarth}
            className={`min-h-[40px] rounded-md border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              compareEarth
                ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100'
                : 'border-slate-700 bg-[#0B1120] text-slate-300'
            }`}
          >
            {compareEarth
              ? 'Comparing with Earth: ON'
              : 'Compare with Earth: OFF'}
          </button>
        </div>

        {lastDropSummary && (
          <p className="mt-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs leading-relaxed text-cyan-100">
            {lastDropSummary}
          </p>
        )}
      </div>

      {/* Right: Planet Selector, Object Picker & Gravity Bar Comparison */}
      <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
        <div className="rounded-xl border border-slate-800 bg-[#060913] p-5">
          <p className="font-mono text-xs text-cyan-300">
            Step 1 · Select Planet
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {GRAVITY_LAB_PLANETS.map((planet) => {
              const active = planet.id === selectedPlanet.id;
              return (
                <button
                  key={planet.id}
                  type="button"
                  onClick={() => handleSelectPlanet(planet.id)}
                  aria-pressed={active}
                  className={`flex min-h-[54px] flex-col justify-between rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-cyan-400 bg-cyan-500/15 text-white'
                      : 'border-slate-800 bg-[#0B1120] text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <span className="font-display text-sm font-bold">
                    {planet.name}
                  </span>
                  <span className="font-mono text-xs text-cyan-300 tabular-nums">
                    {planet.gravityMs2.toFixed(2)} m/s²
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 font-mono text-xs text-cyan-300">
            Step 2 · Choose Test Object
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {DROP_OBJECTS.map((obj) => {
              const active = obj.id === selectedObject;
              return (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => {
                    resetDrop();
                    setSelectedObject(obj.id);
                  }}
                  aria-pressed={active}
                  className={`min-h-[46px] rounded-lg border px-2.5 py-2 text-center text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100'
                      : 'border-slate-800 bg-[#0B1120] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="block">{obj.label}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {obj.massLabel}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            In a vacuum with no air drag, heavy and light objects accelerate at
            the exact same rate!
          </p>
        </div>

        {/* Gravity Comparison Chart + Why It Differs */}
        <div className="rounded-xl border border-slate-800 bg-[#060913] p-5">
          <p className="font-mono text-xs text-cyan-300">
            Surface Gravity Comparison (m/s²)
          </p>
          <div className="mt-3 space-y-2.5">
            {GRAVITY_LAB_PLANETS.map((planet) => {
              const widthPct = Math.round((planet.gravityMs2 / 25) * 100);
              const isSelected = planet.id === selectedPlanet.id;
              return (
                <div key={planet.id}>
                  <div className="flex justify-between text-xs">
                    <span
                      className={
                        isSelected ? 'font-bold text-white' : 'text-slate-300'
                      }
                    >
                      {planet.name}
                    </span>
                    <span className="font-mono text-cyan-300 tabular-nums">
                      {planet.gravityMs2.toFixed(2)} m/s² (
                      {(planet.gravityMs2 / EARTH_GRAVITY).toFixed(2)}× Earth)
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: planet.colorHex,
                      }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-800/80 pt-3">
            <p className="font-mono text-xs text-slate-400">
              Why {selectedPlanet.name}&apos;s Gravity Differs
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-200 sm:text-sm">
              {selectedPlanet.gravityReason}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
