import { useEffect, useRef, useState } from 'react';
import { Flame, RotateCcw } from 'lucide-react';

interface MoonCraterExperimentProps {
  onObservationChange: (summary: string) => void;
}

type MeteorSizeId = 'pebble' | 'boulder' | 'asteroid';

interface MeteorPreset {
  id: MeteorSizeId;
  label: string;
  diameterM: number;
  visualRadiusPx: number;
}

interface CraterRecord {
  id: number;
  meteorLabel: string;
  diameterM: number;
  speedKms: number;
  craterWidthM: number;
  craterDepthM: number;
  xPct: number;
  yPct: number;
}

const METEOR_PRESETS: MeteorPreset[] = [
  { id: 'pebble', label: 'Small Meteorite (1 m)', diameterM: 1, visualRadiusPx: 6 },
  { id: 'boulder', label: 'Space Boulder (10 m)', diameterM: 10, visualRadiusPx: 11 },
  { id: 'asteroid', label: 'Giant Asteroid (50 m)', diameterM: 50, visualRadiusPx: 17 },
];

export function MoonCraterExperiment({
  onObservationChange,
}: MoonCraterExperimentProps) {
  const [selectedSize, setSelectedSize] = useState<MeteorSizeId>('boulder');
  const [impactSpeed, setImpactSpeed] = useState(30); // km/s
  const [craters, setCraters] = useState<CraterRecord[]>([]);
  const [isAnimatingDrop, setIsAnimatingDrop] = useState(false);
  const [dropProgress, setDropProgress] = useState(0); // 0 -> 1
  const [flashActive, setFlashActive] = useState(false);

  const rafRef = useRef<number | null>(null);
  const nextIdRef = useRef(1);

  const activePreset =
    METEOR_PRESETS.find((m) => m.id === selectedSize) ?? METEOR_PRESETS[1];

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Educational scaling model showing how size and velocity^2/3 drive crater growth
  const estimateCrater = (diameterM: number, speedKms: number) => {
    const craterWidthM = Math.round(
      diameterM * 12 * Math.pow(speedKms / 20, 0.65)
    );
    const craterDepthM = Math.max(2, Math.round(craterWidthM * 0.2));
    return { craterWidthM, craterDepthM };
  };

  const previewEstimate = estimateCrater(activePreset.diameterM, impactSpeed);

  const handleDropMeteorite = () => {
    if (isAnimatingDrop) return;
    setIsAnimatingDrop(true);
    setFlashActive(false);
    setDropProgress(0);

    const dropIndex = craters.length;
    // Spread craters across the surface so comparisons are clearly visible
    const targetXPcts = [22, 50, 76, 36, 64];
    const targetYPcts = [68, 62, 70, 56, 64];
    const xPct = targetXPcts[dropIndex % targetXPcts.length];
    const yPct = targetYPcts[dropIndex % targetYPcts.length];

    const durationMs = Math.max(380, 920 - impactSpeed * 7);
    const startMs = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startMs) / durationMs);
      setDropProgress(progress);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIsAnimatingDrop(false);
        setFlashActive(true);
        const { craterWidthM, craterDepthM } = estimateCrater(
          activePreset.diameterM,
          impactSpeed
        );

        const newRecord: CraterRecord = {
          id: nextIdRef.current++,
          meteorLabel: activePreset.label,
          diameterM: activePreset.diameterM,
          speedKms: impactSpeed,
          craterWidthM,
          craterDepthM,
          xPct,
          yPct,
        };

        setCraters((prev) => [newRecord, ...prev].slice(0, 5));
        onObservationChange(
          `A ${activePreset.diameterM} m meteorite striking at ${impactSpeed} km/s carved a crater about ${craterWidthM} m wide and ${craterDepthM} m deep!`
        );

        window.setTimeout(() => setFlashActive(false), 360);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const handleClearSurface = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsAnimatingDrop(false);
    setDropProgress(0);
    setFlashActive(false);
    setCraters([]);
    onObservationChange(
      'Lunar surface cleared. Select a meteorite size and impact speed to drop a new meteorite.'
    );
  };

  const latestCrater = craters[0] ?? null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: Lunar Impact Stage */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#060913] p-5 lg:col-span-7">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs text-cyan-300">
              Lunar Regolith Impact Simulator
            </span>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              Recorded Impacts: {craters.length}
            </span>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-800 bg-[#040710]">
            <svg
              viewBox="0 0 600 340"
              role="img"
              aria-label="Moon surface crater formation simulation stage"
              className="block h-auto w-full"
            >
              <defs>
                <linearGradient id="regolithGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748B" />
                  <stop offset="30%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
              </defs>

              {/* Starry Airless Sky */}
              <circle cx="70" cy="48" r="1.5" fill="#94A3B8" opacity="0.7" />
              <circle cx="190" cy="28" r="1.2" fill="#94A3B8" opacity="0.5" />
              <circle cx="340" cy="52" r="1.5" fill="#94A3B8" opacity="0.6" />
              <circle cx="510" cy="40" r="1.3" fill="#94A3B8" opacity="0.6" />

              {/* Moon Surface Ground */}
              <path
                d="M 0 185 Q 150 176 300 184 Q 450 192 600 182 L 600 340 L 0 340 Z"
                fill="url(#regolithGrad)"
              />
              <path
                d="M 0 185 Q 150 176 300 184 Q 450 192 600 182"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
              />

              {/* Formed Craters */}
              {craters.map((crater) => {
                const cx = (crater.xPct / 100) * 600;
                const cy = (crater.yPct / 100) * 340;
                const rx = Math.max(18, Math.min(82, crater.craterWidthM * 0.085));
                const ry = Math.max(7, rx * 0.34);

                return (
                  <g key={crater.id}>
                    {/* Bright Ejecta Rays */}
                    <line
                      x1={cx - rx * 1.45}
                      y1={cy + 3}
                      x2={cx + rx * 1.45}
                      y2={cy - 2}
                      stroke="#CBD5E1"
                      strokeOpacity="0.35"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                    <line
                      x1={cx - rx * 0.9}
                      y1={cy - ry * 1.3}
                      x2={cx + rx * 0.9}
                      y2={cy + ry * 1.3}
                      stroke="#CBD5E1"
                      strokeOpacity="0.3"
                      strokeWidth="1.5"
                    />
                    {/* Crater Rim */}
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={rx + 4}
                      ry={ry + 3}
                      fill="#94A3B8"
                      opacity="0.65"
                    />
                    {/* Crater Bowl Shadow */}
                    <ellipse
                      cx={cx}
                      cy={cy + 2}
                      rx={rx}
                      ry={ry}
                      fill="#0F172A"
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                    <text
                      x={cx}
                      y={cy + ry + 16}
                      textAnchor="middle"
                      fill="#E2E8F0"
                      fontSize="11"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {crater.craterWidthM} m
                    </text>
                  </g>
                );
              })}

              {/* Incoming Meteorite Streak */}
              {isAnimatingDrop && (
                <g>
                  <line
                    x1={180}
                    y1={10}
                    x2={180 + dropProgress * 120}
                    y2={10 + dropProgress * 195}
                    stroke="#FBBF24"
                    strokeWidth="2.5"
                    strokeDasharray="5 4"
                  />
                  <circle
                    cx={180 + dropProgress * 120}
                    cy={10 + dropProgress * 195}
                    r={activePreset.visualRadiusPx}
                    fill="#D97706"
                    stroke="#FEF08A"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* Impact Flash */}
              {flashActive && latestCrater && (
                <circle
                  cx={(latestCrater.xPct / 100) * 600}
                  cy={(latestCrater.yPct / 100) * 340}
                  r="42"
                  fill="#FDE047"
                  opacity="0.5"
                />
              )}
            </svg>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleDropMeteorite}
              disabled={isAnimatingDrop}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#E03C31] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#F04A3E] disabled:opacity-50 cursor-pointer"
            >
              <Flame className="h-4 w-4" aria-hidden="true" />
              <span>
                {isAnimatingDrop ? 'Meteorite Incoming...' : 'Drop Meteorite'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleClearSurface}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/70 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear Surface</span>
            </button>
          </div>

          <span className="font-mono text-xs text-slate-300 tabular-nums">
            Predicted Width: ~{previewEstimate.craterWidthM} m
          </span>
        </div>
      </div>

      {/* Right: Meteor Controls + Crater Comparison Table */}
      <div className="flex flex-col justify-between space-y-5 lg:col-span-5">
        <div className="rounded-xl border border-slate-800 bg-[#060913] p-5">
          <p className="font-mono text-xs text-cyan-300">
            Step 1 · Select Meteorite Size
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2.5">
            {METEOR_PRESETS.map((preset) => {
              const active = preset.id === selectedSize;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedSize(preset.id)}
                  aria-pressed={active}
                  className={`flex min-h-[46px] items-center justify-between rounded-lg border px-4 py-2.5 text-left text-xs font-semibold transition-colors cursor-pointer sm:text-sm ${
                    active
                      ? 'border-cyan-400 bg-cyan-500/15 text-white'
                      : 'border-slate-800 bg-[#0B1120] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className="font-mono text-xs text-cyan-300 tabular-nums">
                    {preset.diameterM} m rock
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 border-t border-slate-800/80 pt-4">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="impact-speed-slider"
                className="font-mono text-cyan-300"
              >
                Step 2 · Impact Speed
              </label>
              <span className="font-mono font-bold text-white tabular-nums">
                {impactSpeed} km/s
              </span>
            </div>
            <input
              id="impact-speed-slider"
              type="range"
              min={10}
              max={70}
              step={5}
              value={impactSpeed}
              onChange={(e) => setImpactSpeed(Number(e.target.value))}
              className="mt-3 w-full accent-cyan-400 cursor-pointer"
            />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400 tabular-nums">
              <span>10 km/s (Slow)</span>
              <span>40 km/s</span>
              <span>70 km/s (Ultra-Fast)</span>
            </div>
          </div>
        </div>

        {/* Crater Comparison Log */}
        <div className="rounded-xl border border-slate-800 bg-[#060913] p-5">
          <p className="font-mono text-xs text-cyan-300">
            Crater Size Comparison Log
          </p>

          {craters.length === 0 ? (
            <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
              Drop two or more meteorites with different sizes or speeds to
              compare crater widths side-by-side!
            </p>
          ) : (
            <div className="mt-3 space-y-2.5">
              {craters.map((c, idx) => {
                const barPct = Math.min(
                  100,
                  Math.max(8, Math.round((c.craterWidthM / 1350) * 100))
                );
                return (
                  <div
                    key={c.id}
                    className="rounded-lg border border-slate-800 bg-[#0B1120] p-3"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-white">
                        Drop #{craters.length - idx} · {c.diameterM} m @{' '}
                        {c.speedKms} km/s
                      </span>
                      <span className="font-mono text-cyan-300 tabular-nums">
                        {c.craterWidthM} m wide · {c.craterDepthM} m deep
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        style={{ width: `${barPct}%` }}
                        className="h-full rounded-full bg-cyan-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
