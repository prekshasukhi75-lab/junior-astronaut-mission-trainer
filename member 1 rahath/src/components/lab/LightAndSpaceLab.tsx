import { useState } from 'react';
import { Eye, Moon, Sun } from 'lucide-react';

interface LightAndSpaceLabProps {
  onObservationChange: (summary: string) => void;
}

type MediumMode = 'vacuum' | 'air';

export function LightAndSpaceLab({ onObservationChange }: LightAndSpaceLabProps) {
  const [moonAngleDeg, setMoonAngleDeg] = useState(45);
  const [mediumMode, setMediumMode] = useState<MediumMode>('vacuum');
  const [beamOn, setBeamOn] = useState(true);

  const normalizedAngle = ((moonAngleDeg % 360) + 360) % 360;
  const isSolarEclipse =
    beamOn && (normalizedAngle <= 14 || normalizedAngle >= 346);
  const isLunarEclipse =
    beamOn && normalizedAngle >= 166 && normalizedAngle <= 194;

  // Compute Moon position around Earth (centered at 370, 150 inside 560x300 SVG)
  const earthCx = 370;
  const earthCy = 150;
  const orbitRx = 115;
  const orbitRy = 86;
  // Angle 0° puts Moon to the left of Earth (directly between Sun at x=70 and Earth at x=370)
  const rad = (normalizedAngle * Math.PI) / 180;
  const moonCx = earthCx - Math.cos(rad) * orbitRx;
  const moonCy = earthCy - Math.sin(rad) * orbitRy;

  const updateAngle = (deg: number, customSummary?: string) => {
    setMoonAngleDeg(deg);
    const norm = ((deg % 360) + 360) % 360;
    if (customSummary) {
      onObservationChange(customSummary);
      return;
    }
    if (norm <= 14 || norm >= 346) {
      onObservationChange(
        'Solar Eclipse aligned! The Moon sits directly between the Sun and Earth, blocking straight-line sunlight and casting a shadow onto Earth.'
      );
    } else if (norm >= 166 && norm <= 194) {
      onObservationChange(
        'Lunar Eclipse aligned! Earth sits directly between the Sun and the Moon, casting Earth’s dark shadow across the Moon (making it glow coppery red).'
      );
    } else {
      onObservationChange(
        `Moon positioned at ${norm}° in its orbit. Sunlight travels in straight lines past Earth and lights up the Moon’s Sun-facing side.`
      );
    }
  };

  const handleToggleMedium = (mode: MediumMode) => {
    setMediumMode(mode);
    onObservationChange(
      mode === 'vacuum'
        ? 'Space Vacuum mode: With almost no air molecules to scatter light sideways, outer space stays dark even while sunlight streams past!'
        : 'Earth Air mode: Gas molecules scatter blue sunlight in every direction, turning a planet’s daytime sky bright instead of black.'
    );
  };

  const eventLabel = !beamOn
    ? 'Sunlight Beam Paused'
    : isSolarEclipse
      ? 'SOLAR ECLIPSE IN PROGRESS'
      : isLunarEclipse
        ? 'LUNAR ECLIPSE IN PROGRESS'
        : 'Normal Sunlight Travel';

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: Optical Sun-Earth-Moon Stage */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#060913] p-5 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-cyan-300">
            Sunlight Ray &amp; Eclipse Optical Bench
          </span>
          <span
            className={`rounded px-2.5 py-0.5 font-mono text-xs font-semibold ${
              isSolarEclipse
                ? 'bg-amber-500/20 text-amber-200'
                : isLunarEclipse
                  ? 'bg-rose-500/20 text-rose-200'
                  : 'bg-slate-800 text-slate-200'
            }`}
          >
            {eventLabel}
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
          <svg
            viewBox="0 0 560 300"
            className="w-full h-auto block"
            role="img"
            aria-label="Interactive Sun, Moon, and Earth light beam and eclipse simulation"
          >
            {/* Background: Deep Space Vacuum vs Earth-like Air Scattering */}
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="55%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="earthLit" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="52%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#082F49" />
              </linearGradient>
              <linearGradient id="airSky" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0C4A6E" />
                <stop offset="60%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#082F49" />
              </linearGradient>
            </defs>

            <rect
              width="560"
              height="300"
              fill={mediumMode === 'air' && beamOn ? 'url(#airSky)' : '#03060E'}
            />

            {/* Scattered photons visible only in Air mode */}
            {mediumMode === 'air' && beamOn && (
              <g opacity="0.45" fill="#BAE6FD">
                <circle cx="170" cy="70" r="2" />
                <circle cx="240" cy="220" r="2.5" />
                <circle cx="310" cy="55" r="2" />
                <circle cx="440" cy="245" r="2.5" />
                <circle cx="205" cy="255" r="2" />
                <circle cx="490" cy="75" r="2" />
              </g>
            )}

            {/* Moon Orbit Track */}
            <ellipse
              cx={earthCx}
              cy={earthCy}
              rx={orbitRx}
              ry={orbitRy}
              fill="none"
              stroke="#334155"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Sun Source */}
            <circle cx="52" cy={earthCy} r="58" fill="url(#sunGlow)" opacity={beamOn ? 0.5 : 0.15} />
            <circle
              cx="52"
              cy={earthCy}
              r="34"
              fill={beamOn ? '#FBBF24' : '#78350F'}
              stroke="#FEF08A"
              strokeWidth="2"
            />
            <text
              x="52"
              y={earthCy + 52}
              textAnchor="middle"
              fill="#FDE68A"
              fontSize="11"
              fontFamily="monospace"
            >
              SUN
            </text>

            {/* Straight-Line Sunlight Beams */}
            {beamOn && (
              <g>
                {/* Upper & Lower parallel rays */}
                {[-32, -16, 0, 16, 32].map((dy) => {
                  const rayY = earthCy + dy;
                  // Truncate center rays if hitting Moon on Solar Eclipse
                  const hitsMoon =
                    Math.abs(moonCy - rayY) < 15 && moonCx < earthCx;
                  const endX = hitsMoon ? moonCx - 10 : 540;
                  return (
                    <line
                      key={dy}
                      x1="88"
                      y1={rayY}
                      x2={endX}
                      y2={rayY}
                      stroke="#FDE047"
                      strokeWidth={dy === 0 ? '2.2' : '1.4'}
                      strokeOpacity={mediumMode === 'vacuum' ? 0.45 : 0.78}
                      strokeDasharray="6 4"
                    />
                  );
                })}
              </g>
            )}

            {/* Earth Shadow Cone (Umbra) behind Earth */}
            {beamOn && (
              <polygon
                points={`${earthCx},${earthCy - 24} 550,${earthCy - 12} 550,${earthCy + 12} ${earthCx},${earthCy + 24}`}
                fill="#020617"
                fillOpacity="0.82"
              />
            )}

            {/* Moon Shadow Cone when in front of Earth (Solar Eclipse) */}
            {beamOn && isSolarEclipse && (
              <polygon
                points={`${moonCx},${moonCy - 10} ${earthCx - 20},${earthCy - 6} ${earthCx - 20},${earthCy + 6} ${moonCx},${moonCy + 10}`}
                fill="#020617"
                fillOpacity="0.88"
              />
            )}

            {/* Earth */}
            <g>
              <circle
                cx={earthCx}
                cy={earthCy}
                r="24"
                fill="url(#earthLit)"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
              {/* Solar eclipse shadow patch on Earth's Sun-facing side */}
              {isSolarEclipse && (
                <ellipse
                  cx={earthCx - 20}
                  cy={earthCy}
                  rx="4.5"
                  ry="8"
                  fill="#020617"
                  stroke="#F59E0B"
                  strokeWidth="1"
                />
              )}
              <text
                x={earthCx}
                y={earthCy + 40}
                textAnchor="middle"
                fill="#BAE6FD"
                fontSize="11"
                fontFamily="monospace"
              >
                EARTH
              </text>
            </g>

            {/* Moon */}
            <g>
              <circle
                cx={moonCx}
                cy={moonCy}
                r="11"
                fill={
                  !beamOn
                    ? '#334155'
                    : isLunarEclipse
                      ? '#991B1B'
                      : '#E2E8F0'
                }
                stroke={isLunarEclipse ? '#F87171' : '#F8FAFC'}
                strokeWidth="1.5"
              />
              <text
                x={moonCx}
                y={moonCy - 18}
                textAnchor="middle"
                fill="#E2E8F0"
                fontSize="10"
                fontFamily="monospace"
              >
                Moon
              </text>
            </g>
          </svg>
        </div>

        {/* Dynamic Event Explanation */}
        <div className="mt-4 rounded-lg border border-slate-800 bg-[#0B1120] p-4">
          <p className="font-mono text-xs text-cyan-300">
            What Happens Right Now
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-200 sm:text-sm">
            {!beamOn
              ? 'Sunlight beam is switched off—without emitted light from the Sun, neither Earth nor the Moon can reflect light to our eyes.'
              : isSolarEclipse
                ? 'Solar Eclipse! The Moon sits at ~0° right between the Sun and Earth. Sunlight cannot curve around the Moon, so a dark shadow falls onto Earth.'
                : isLunarEclipse
                  ? 'Lunar Eclipse! Earth blocks direct sunlight from hitting the Moon (~180°). Only dim red light bent through Earth’s air reaches the Moon!'
                  : mediumMode === 'vacuum'
                    ? 'Notice how the straight-line rays only light up the Moon and Earth—the empty space around them stays black because vacuum has almost no air particles to bounce light sideways.'
                    : 'Inside an atmosphere full of air molecules, sunlight scatters in all directions—which is why Earth’s daytime sky glows blue instead of looking pitch black!'}
          </p>
        </div>
      </div>

      {/* Right: Orbit Alignment Presets, Medium Toggle & Key Concepts */}
      <div className="flex flex-col justify-between space-y-5 lg:col-span-5">
        <div className="rounded-xl border border-slate-800 bg-[#060913] p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="moon-orbit-slider" className="font-mono text-cyan-300">
                Step 1 · Moon Orbit Position
              </label>
              <span className="font-mono font-bold text-white tabular-nums">
                {normalizedAngle}°
              </span>
            </div>
            <input
              id="moon-orbit-slider"
              type="range"
              min={0}
              max={360}
              step={1}
              value={moonAngleDeg}
              onChange={(e) => updateAngle(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer accent-cyan-400"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
              <span>0° (Solar Eclipse)</span>
              <span>180° (Lunar Eclipse)</span>
              <span>360°</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-cyan-300">
              Step 2 · Quick Eclipse Demonstrations
            </p>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => {
                  setBeamOn(true);
                  updateAngle(0);
                }}
                className={`flex min-h-[44px] items-center justify-between rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  isSolarEclipse
                    ? 'border-amber-400 bg-amber-500/15 text-amber-100'
                    : 'border-slate-800 bg-[#0B1120] text-slate-200 hover:border-cyan-400/70'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-300" aria-hidden="true" />
                  Solar Eclipse Alignment
                </span>
                <span className="font-mono text-[11px] text-slate-400">0°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBeamOn(true);
                  updateAngle(180);
                }}
                className={`flex min-h-[44px] items-center justify-between rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  isLunarEclipse
                    ? 'border-rose-400 bg-rose-500/15 text-rose-100'
                    : 'border-slate-800 bg-[#0B1120] text-slate-200 hover:border-cyan-400/70'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Moon className="h-4 w-4 text-rose-300" aria-hidden="true" />
                  Lunar Eclipse Alignment
                </span>
                <span className="font-mono text-[11px] text-slate-400">180°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBeamOn(true);
                  updateAngle(90);
                }}
                className="flex min-h-[44px] items-center justify-between rounded-lg border border-slate-800 bg-[#0B1120] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-400/70 cursor-pointer"
              >
                <span>Quarter Orbit (No Eclipse)</span>
                <span className="font-mono text-[11px] text-slate-400">90°</span>
              </button>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs text-cyan-300">
              Step 3 · Space Vacuum vs. Earth&apos;s Air
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleToggleMedium('vacuum')}
                aria-pressed={mediumMode === 'vacuum'}
                className={`min-h-[44px] rounded-lg border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  mediumMode === 'vacuum'
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100'
                    : 'border-slate-800 bg-[#0B1120] text-slate-300'
                }`}
              >
                Space Vacuum (Dark)
              </button>
              <button
                type="button"
                onClick={() => handleToggleMedium('air')}
                aria-pressed={mediumMode === 'air'}
                className={`min-h-[44px] rounded-lg border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  mediumMode === 'air'
                    ? 'border-sky-400 bg-sky-500/15 text-sky-100'
                    : 'border-slate-800 bg-[#0B1120] text-slate-300'
                }`}
              >
                Earth&apos;s Air (Blue Sky)
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !beamOn;
                setBeamOn(next);
                onObservationChange(
                  next
                    ? 'Sunlight beam turned ON! Light photons race across space at ~300,000 km/s in straight lines.'
                    : 'Sunlight beam turned OFF to show that planets and moons only shine by reflecting sunlight.'
                );
              }}
              className="mt-2.5 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-white hover:border-cyan-400/70 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
              <span>{beamOn ? 'Pause Sunlight Beam' : 'Turn On Sunlight Beam'}</span>
            </button>
          </div>
        </div>

        {/* Science Summary Card */}
        <div className="rounded-xl border border-slate-800 bg-[#060913] p-5 space-y-2.5 text-xs leading-relaxed text-slate-300">
          <p className="font-mono text-cyan-300">Why Is Outer Space Black?</p>
          <p>
            Light travels in straight lines at <strong className="text-white">299,792 km/s</strong>. On Earth, air molecules scatter sunlight into your eyes from every direction. Outer space is nearly empty, so invisible rays shoot right past unless they strike a solid world like the Moon!
          </p>
        </div>
      </div>
    </div>
  );
}
