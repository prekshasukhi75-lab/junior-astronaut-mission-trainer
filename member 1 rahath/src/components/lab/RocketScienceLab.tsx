import { useEffect, useRef, useState } from 'react';
import { Flame, Rocket, RotateCcw } from 'lucide-react';

interface RocketScienceLabProps {
  onObservationChange: (summary: string) => void;
}

type LaunchPhase = 'idle' | 'burning' | 'coasting' | 'complete' | 'too-heavy';

const MAX_DISPLAY_ALTITUDE_KM = 220;
const KARMAN_LINE_KM = 100;

export function RocketScienceLab({ onObservationChange }: RocketScienceLabProps) {
  const [fuelLevelPct, setFuelLevelPct] = useState(80);
  const [thrustLevelPct, setThrustLevelPct] = useState(85);
  const [phase, setPhase] = useState<LaunchPhase>('idle');

  const [altitudeKm, setAltitudeKm] = useState(0);
  const [peakAltitudeKm, setPeakAltitudeKm] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [fuelRemainingPct, setFuelRemainingPct] = useState(80);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Set fuel and engine thrust, then press Launch Rocket to test Newton’s Third Law.'
  );

  const rafRef = useRef<number | null>(null);

  // Gravity load scales slightly with fuel mass (42% dry rocket + up to 16% fuel mass)
  const requiredThrustPct = Math.round(42 + (fuelLevelPct / 100) * 16);
  const canLiftOff = thrustLevelPct > requiredThrustPct;

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const stopSimulation = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const handleResetPad = (newFuel = fuelLevelPct) => {
    stopSimulation();
    setPhase('idle');
    setAltitudeKm(0);
    setPeakAltitudeKm(0);
    setSpeedKmh(0);
    setFuelRemainingPct(newFuel);
    setStatusMessage(
      'Rocket reset on launchpad. Adjust fuel and thrust levels to test another flight.'
    );
  };

  const handleChangeFuel = (val: number) => {
    setFuelLevelPct(val);
    if (phase === 'idle' || phase === 'complete' || phase === 'too-heavy') {
      handleResetPad(val);
      onObservationChange(
        `Fuel tank set to ${val}%. More fuel allows a longer engine burn, though extra propellant slightly increases rocket weight.`
      );
    }
  };

  const handleChangeThrust = (val: number) => {
    setThrustLevelPct(val);
    if (phase === 'idle' || phase === 'complete' || phase === 'too-heavy') {
      const nextCanLift = val > requiredThrustPct;
      onObservationChange(
        nextCanLift
          ? `Engine thrust set to ${val}% (beats gravity weight threshold of ${requiredThrustPct}%). Ready for liftoff!`
          : `Engine thrust at ${val}% is too weak to beat gravity (${requiredThrustPct}% needed). Push thrust higher for liftoff!`
      );
    }
  };

  const handleLaunch = () => {
    stopSimulation();
    setAltitudeKm(0);
    setPeakAltitudeKm(0);
    setSpeedKmh(0);
    setFuelRemainingPct(fuelLevelPct);

    if (!canLiftOff) {
      setPhase('too-heavy');
      const msg = `Engine fired at ${thrustLevelPct}% thrust, which is less than the ${requiredThrustPct}% needed to beat gravity! Rocket stays on the pad.`;
      setStatusMessage(msg);
      onObservationChange(msg);
      return;
    }

    setPhase('burning');
    setStatusMessage('Liftoff! Exhaust pushes downward while thrust drives the rocket skyward.');

    const burnRatePctPerSec = 10 + (thrustLevelPct / 100) * 14;
    const netAccelFactor = (thrustLevelPct - requiredThrustPct) * 0.42;
    const gravityDecelKmPerSec2 = 3.2;

    let simAltKm = 0;
    let simVelKmPerSec = 0;
    let simFuel = fuelLevelPct;
    let maxAlt = 0;
    let lastMs = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastMs) / 1000));
      lastMs = now;

      if (simFuel > 0) {
        const fuelBurned = Math.min(simFuel, burnRatePctPerSec * dt);
        simFuel -= fuelBurned;
        // Rocket gets slightly lighter as fuel burns, increasing acceleration slightly
        const massBonus = 1 + ((fuelLevelPct - simFuel) / 100) * 0.25;
        const accel = netAccelFactor * massBonus - gravityDecelKmPerSec2 * 0.35;
        simVelKmPerSec = Math.max(0, simVelKmPerSec + accel * dt);
        setPhase('burning');
      } else {
        setPhase('coasting');
        simVelKmPerSec = simVelKmPerSec - gravityDecelKmPerSec2 * dt;
      }

      simAltKm = Math.max(0, Math.min(MAX_DISPLAY_ALTITUDE_KM, simAltKm + simVelKmPerSec * dt));
      if (simAltKm > maxAlt) {
        maxAlt = simAltKm;
      }

      setAltitudeKm(simAltKm);
      setPeakAltitudeKm(maxAlt);
      setSpeedKmh(Math.max(0, Math.round(simVelKmPerSec * 1400)));
      setFuelRemainingPct(Math.max(0, Math.round(simFuel)));

      // End cleanly at apogee (when coasting velocity reaches <= 0) or max orbit cap
      if ((simFuel <= 0 && simVelKmPerSec <= 0) || simAltKm >= MAX_DISPLAY_ALTITUDE_KM) {
        setPhase('complete');
        setSpeedKmh(0);
        rafRef.current = null;

        const reachedSpace = maxAlt >= KARMAN_LINE_KM;
        const finalMsg = reachedSpace
          ? `Space reached! With ${fuelLevelPct}% fuel and ${thrustLevelPct}% thrust, your rocket climbed to ${maxAlt.toFixed(0)} km—soaring past the 100 km Kármán Line!`
          : `Peak altitude ${maxAlt.toFixed(0)} km (${fuelLevelPct}% fuel, ${thrustLevelPct}% thrust). Increase fuel or thrust to cross the 100 km space boundary!`;
        setStatusMessage(finalMsg);
        onObservationChange(finalMsg);
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  };

  const rocketHeightPct = Math.min(82, (altitudeKm / MAX_DISPLAY_ALTITUDE_KM) * 82);
  const isFiring = phase === 'burning' || phase === 'too-heavy';
  const isFlying = phase === 'burning' || phase === 'coasting';
  const altitudeZoneLabel =
    altitudeKm >= 100
      ? 'Outer Space (Above Kármán Line)'
      : altitudeKm >= 20
        ? 'Upper Atmosphere'
        : altitudeKm > 0
          ? 'Lower Sky Climb'
          : 'Launchpad Ready';

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: Animated Launch Column & Altitude Scale */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#060913] p-5 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-cyan-300">
            Vertical Propulsion Launch Range
          </span>
          <span className="font-mono text-xs text-slate-300">
            Zone: <strong className="text-white">{altitudeZoneLabel}</strong>
          </span>
        </div>

        <div className="relative mt-4 flex h-[360px] overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-[#03050C] via-[#0B1835] to-[#17305A]">
          {/* Altitude Reference Grid */}
          <div className="relative flex-1">
            {/* Stars in Upper Space */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-80">
              <span className="absolute left-[15%] top-[18%] h-1 w-1 rounded-full bg-white" />
              <span className="absolute left-[38%] top-[10%] h-1.5 w-1.5 rounded-full bg-cyan-200" />
              <span className="absolute left-[68%] top-[24%] h-1 w-1 rounded-full bg-white" />
              <span className="absolute left-[84%] top-[14%] h-1.5 w-1.5 rounded-full bg-amber-200" />
              <span className="absolute left-[26%] top-[36%] h-1 w-1 rounded-full bg-slate-200" />
              <span className="absolute left-[74%] top-[40%] h-1 w-1 rounded-full bg-cyan-100" />
            </div>

            {/* 100 km Karman Line */}
            <div
              style={{ bottom: `${(KARMAN_LINE_KM / MAX_DISPLAY_ALTITUDE_KM) * 82 + 8}%` }}
              className="absolute inset-x-0 border-t border-dashed border-cyan-400/60"
            >
              <span className="ml-3 rounded bg-[#060913]/85 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
                100 km · Kármán Line (Space Boundary)
              </span>
            </div>

            {/* 20 km Stratosphere Marker */}
            <div
              style={{ bottom: `${(20 / MAX_DISPLAY_ALTITUDE_KM) * 82 + 8}%` }}
              className="absolute inset-x-0 border-t border-dotted border-slate-400/35"
            >
              <span className="ml-3 font-mono text-[10px] text-slate-300/80">
                20 km · Stratosphere
              </span>
            </div>

            {/* Launchpad Tower & Base */}
            <div className="absolute bottom-0 inset-x-0 h-6 bg-slate-800 border-t border-slate-600" />
            <div className="absolute bottom-6 left-1/2 -translate-x-12 h-24 w-3 border-r border-slate-500/70 bg-slate-700/60" />

            {/* Rocket Assembly */}
            <div
              style={{ bottom: `calc(${rocketHeightPct}% + 24px)` }}
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <svg
                width="54"
                height="96"
                viewBox="0 0 54 96"
                role="img"
                aria-label="Space Launch Rocket"
              >
                {/* Nose Cone */}
                <path d="M27 4 L39 28 L15 28 Z" fill="#E03C31" />
                {/* Main Fuselage */}
                <rect x="15" y="28" width="24" height="44" rx="2" fill="#F8FAFC" />
                {/* Red Stripe & Window */}
                <rect x="15" y="34" width="24" height="6" fill="#E03C31" />
                <circle cx="27" cy="52" r="5" fill="#0EA5E9" stroke="#0F172A" strokeWidth="2" />
                {/* Left & Right Fins */}
                <path d="M15 56 L5 74 L15 72 Z" fill="#E03C31" />
                <path d="M39 56 L49 74 L39 72 Z" fill="#E03C31" />
                {/* Engine Nozzle */}
                <path d="M20 72 L34 72 L37 80 L17 80 Z" fill="#475569" />

                {/* Exhaust Flame when firing */}
                {isFiring && (
                  <g>
                    <path
                      d={`M18 80 L27 ${84 + (thrustLevelPct / 100) * 12} L36 80 Z`}
                      fill="#F59E0B"
                    />
                    <path
                      d="M22 80 L27 90 L32 80 Z"
                      fill="#FEF08A"
                    />
                  </g>
                )}
              </svg>

              {isFiring && (
                <span className="mt-1 rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-200">
                  Exhaust Pushing Down!
                </span>
              )}
            </div>
          </div>

          {/* Right Vertical Altitude Ruler */}
          <div className="flex w-20 flex-col justify-between border-l border-slate-800/90 bg-[#060913]/85 p-2.5 text-right font-mono text-[10px] text-slate-400 tabular-nums">
            <span>220 km</span>
            <span>160 km</span>
            <span className="text-cyan-300">100 km</span>
            <span>50 km</span>
            <span>0 km</span>
          </div>
        </div>

        {/* Live Telemetry Readouts */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-[#0B1120] p-3 font-mono tabular-nums">
            <span className="block text-[10px] text-slate-400">Altitude</span>
            <span className="mt-1 block text-base font-bold text-white">
              {altitudeKm.toFixed(1)} km
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0B1120] p-3 font-mono tabular-nums">
            <span className="block text-[10px] text-slate-400">Peak Reached</span>
            <span className="mt-1 block text-base font-bold text-cyan-300">
              {peakAltitudeKm.toFixed(1)} km
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0B1120] p-3 font-mono tabular-nums">
            <span className="block text-[10px] text-slate-400">Rocket Speed</span>
            <span className="mt-1 block text-base font-bold text-white">
              {speedKmh.toLocaleString()} km/h
            </span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#0B1120] p-3 font-mono tabular-nums">
            <span className="block text-[10px] text-slate-400">Fuel Left</span>
            <span className="mt-1 block text-base font-bold text-amber-300">
              {fuelRemainingPct}%
            </span>
          </div>
        </div>

        <p
          role="status"
          className={`mt-3 rounded-lg border p-3 text-xs leading-relaxed ${
            phase === 'too-heavy'
              ? 'border-amber-400/50 bg-amber-500/10 text-amber-100'
              : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-100'
          }`}
        >
          {statusMessage}
        </p>
      </div>

      {/* Right: Fuel, Thrust & Force Comparison Controls */}
      <div className="flex flex-col justify-between space-y-5 lg:col-span-5">
        <div className="rounded-xl border border-slate-800 bg-[#060913] p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="fuel-slider" className="font-mono text-cyan-300">
                Step 1 · Fuel Tank Level
              </label>
              <span className="font-mono font-bold text-white tabular-nums">
                {fuelLevelPct}%
              </span>
            </div>
            <input
              id="fuel-slider"
              type="range"
              min={20}
              max={100}
              step={5}
              disabled={isFlying}
              value={fuelLevelPct}
              onChange={(e) => handleChangeFuel(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer accent-cyan-400 disabled:opacity-50"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
              <span>20% Short Burn</span>
              <span>60% Medium</span>
              <span>100% Max Tank</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="thrust-slider" className="font-mono text-cyan-300">
                Step 2 · Engine Thrust Power
              </label>
              <span className="font-mono font-bold text-white tabular-nums">
                {thrustLevelPct}%
              </span>
            </div>
            <input
              id="thrust-slider"
              type="range"
              min={40}
              max={100}
              step={5}
              disabled={isFlying}
              value={thrustLevelPct}
              onChange={(e) => handleChangeThrust(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer accent-[#E03C31] disabled:opacity-50"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
              <span>40% Low Power</span>
              <span>70% Liftoff</span>
              <span>100% Max Boost</span>
            </div>
          </div>

          {/* Force Comparison Bars */}
          <div className="rounded-lg border border-slate-800 bg-[#0B1120] p-4 space-y-3">
            <p className="font-mono text-xs text-slate-300">
              Launchpad Force Check · Thrust vs. Gravity
            </p>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-cyan-200">Upward Engine Thrust</span>
                <span className="font-mono text-cyan-300 tabular-nums">
                  {thrustLevelPct}%
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  style={{ width: `${thrustLevelPct}%` }}
                  className="h-full rounded-full bg-cyan-400 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-amber-200">Downward Gravity Pull</span>
                <span className="font-mono text-amber-300 tabular-nums">
                  {requiredThrustPct}%
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  style={{ width: `${requiredThrustPct}%` }}
                  className="h-full rounded-full bg-amber-400 transition-all"
                />
              </div>
            </div>

            <p
              className={`pt-1 font-mono text-xs font-semibold ${
                canLiftOff ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {canLiftOff
                ? 'Status: Ready for Liftoff (Thrust beats Gravity!)'
                : 'Status: Thrust too low — increase Engine Thrust above Gravity'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLaunch}
              disabled={isFlying}
              className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-md bg-[#E03C31] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#F04A3E] disabled:opacity-50 cursor-pointer"
            >
              <Rocket className="h-4 w-4" aria-hidden="true" />
              <span>{isFlying ? 'Rocket In Flight...' : 'Launch Rocket'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleResetPad()}
              className="inline-flex min-h-[46px] items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-400/70 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset Pad</span>
            </button>
          </div>
        </div>

        {/* Science Explainer: Thrust, Gravity & Propulsion */}
        <div className="rounded-xl border border-slate-800 bg-[#060913] p-5 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
            <Flame className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <span>How Rockets Beat Gravity</span>
          </div>
          <div className="space-y-2 text-xs leading-relaxed text-slate-300">
            <p>
              <strong className="text-white">Propulsion (Action):</strong> Burning fuel shoots fast hot gas downward out of the rocket nozzle.
            </p>
            <p>
              <strong className="text-white">Thrust (Reaction):</strong> By Newton’s Third Law, pushing gas down pushes the rocket upward with equal force.
            </p>
            <p>
              <strong className="text-white">Gravity:</strong> Earth’s gravity pulls downward on the rocket every second. Only when thrust exceeds gravity can a spacecraft climb toward space!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
