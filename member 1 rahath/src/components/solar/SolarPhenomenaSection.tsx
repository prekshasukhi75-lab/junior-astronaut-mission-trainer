import { useState } from 'react';
import {
  FLARE_INTERACTIVE_PARTS,
  SOLAR_MEDIA,
} from '../../data/solarActivityData';
import { SpaceImage } from '../SpaceImage';

export function SolarPhenomenaSection() {
  const [selectedPartId, setSelectedPartId] = useState(
    FLARE_INTERACTIVE_PARTS[0].id
  );

  const activePart =
    FLARE_INTERACTIVE_PARTS.find((part) => part.id === selectedPartId) ??
    FLARE_INTERACTIVE_PARTS[0];

  return (
    <div className="bg-[#060913]">
      {/* Section 3: Solar Flares + Interactive Hotspot Explorer */}
      <section
        id="solar-flares"
        aria-labelledby="solar-flares-heading"
        className="border-b border-slate-800/80 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B1120]">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#060913] lg:flex-1">
                  <SpaceImage
                    src={SOLAR_MEDIA.flare.src}
                    alt={SOLAR_MEDIA.flare.alt}
                    fallbackTitle="Solar Flare Eruption"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="border-t border-slate-800/80 px-4 py-3 font-mono text-xs text-slate-400">
                  {SOLAR_MEDIA.flare.attribution}
                </figcaption>
              </figure>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8 lg:col-span-6">
              <div>
                <p className="font-mono text-xs tracking-wider text-cyan-400">
                  Solar Event 01 · Electromagnetic Burst
                </p>
                <h2
                  id="solar-flares-heading"
                  className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                  SOLAR FLARES
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                  <p>
                    <strong className="text-white">What causes a solar flare?</strong> Near dark
                    sunspots, the Sun’s magnetic field lines twist and cross like stretched rubber
                    bands. When those magnetic lines suddenly snap and reconnect, they trigger a
                    solar flare.
                  </p>
                  <p>
                    <strong className="text-white">How it releases energy:</strong> A solar flare
                    fires an intense flash of light, ultraviolet rays, and X-rays out into space at
                    the speed of light—reaching Earth and the Moon in just over 8 minutes.
                  </p>
                  <p>
                    <strong className="text-white">Why astronauts monitor them:</strong> Sudden
                    flashes can disrupt high-frequency radio signals and signal that an active
                    region on the Sun may also launch particles or plasma clouds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Solar Event Diagram Activity */}
          <div className="mt-10 rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs text-cyan-400">
                  Interactive Diagram · Click Each Hotspot
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
                  Explore the Parts of a Solar Flare
                </h3>
              </div>
              <p className="text-xs text-slate-400 sm:text-sm">
                Select any numbered marker on the solar event diagram or button below.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              {/* Illustrated Interactive SVG Solar Event */}
              <div className="lg:col-span-7">
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#050811] p-3">
                  <svg
                    viewBox="0 0 440 250"
                    role="img"
                    aria-label="Interactive diagram of a solar flare showing sunspots, twisted magnetic loops, reconnection flash point, and X-ray burst"
                    className="h-auto w-full"
                  >
                    <defs>
                      <radialGradient id="sunSurfaceGrad" cx="50%" cy="115%" r="85%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="55%" stopColor="#B45309" />
                        <stop offset="100%" stopColor="#451A03" />
                      </radialGradient>
                      <radialGradient id="flareGlowGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
                        <stop offset="45%" stopColor="#F97316" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Space backdrop */}
                    <rect width="440" height="250" fill="#050811" />

                    {/* Curved Solar Limb */}
                    <ellipse cx="220" cy="290" rx="260" ry="125" fill="url(#sunSurfaceGrad)" />

                    {/* Sunspot Pair */}
                    <ellipse cx="148" cy="196" rx="18" ry="8" fill="#1C0A00" opacity="0.88" />
                    <ellipse cx="268" cy="196" rx="18" ry="8" fill="#1C0A00" opacity="0.88" />

                    {/* Magnetic Loops */}
                    <path
                      d="M 148 194 C 145 95, 270 95, 268 194"
                      fill="none"
                      stroke="#FBBF24"
                      strokeWidth="3.5"
                      opacity="0.85"
                    />
                    <path
                      d="M 155 194 C 165 120, 255 120, 262 194"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      opacity="0.7"
                    />
                    <path
                      d="M 140 194 C 120 75, 296 75, 276 194"
                      fill="none"
                      stroke="#EA580C"
                      strokeWidth="2"
                      strokeDasharray="5 4"
                      opacity="0.75"
                    />

                    {/* Reconnection Flash */}
                    <circle cx="228" cy="168" r="38" fill="url(#flareGlowGrad)" />
                    <circle cx="228" cy="168" r="10" fill="#FEF9C3" />

                    {/* Outgoing X-Ray & Ultraviolet Burst Rays */}
                    <line
                      x1="240"
                      y1="158"
                      x2="345"
                      y2="78"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    <line
                      x1="246"
                      y1="168"
                      x2="368"
                      y2="112"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      opacity="0.75"
                    />
                    <line
                      x1="234"
                      y1="150"
                      x2="312"
                      y2="52"
                      stroke="#BAE6FD"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      opacity="0.75"
                    />

                    {/* Clickable Hotspot Markers */}
                    {FLARE_INTERACTIVE_PARTS.map((part, idx) => {
                      const isActive = part.id === activePart.id;
                      return (
                        <g
                          key={part.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`Inspect ${part.title}`}
                          aria-pressed={isActive}
                          onClick={() => setSelectedPartId(part.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedPartId(part.id);
                            }
                          }}
                          className="cursor-pointer focus:outline-none"
                        >
                          <circle
                            cx={part.position.cx}
                            cy={part.position.cy}
                            r={isActive ? 17 : 14}
                            fill={isActive ? '#0891B2' : '#0B1120'}
                            stroke={isActive ? '#67E8F9' : '#94A3B8'}
                            strokeWidth={isActive ? 2.5 : 1.5}
                          />
                          <text
                            x={part.position.cx}
                            y={part.position.cy + 4}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="11"
                            fontFamily="IBM Plex Mono, monospace"
                            fontWeight="600"
                          >
                            {idx + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Part Selector + Information Readout */}
              <div className="flex flex-col justify-between lg:col-span-5">
                <div className="grid grid-cols-2 gap-2.5">
                  {FLARE_INTERACTIVE_PARTS.map((part, idx) => {
                    const isActive = part.id === activePart.id;
                    return (
                      <button
                        key={part.id}
                        type="button"
                        onClick={() => setSelectedPartId(part.id)}
                        aria-pressed={isActive}
                        className={`min-h-[44px] rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-cyan-400 cursor-pointer ${
                          isActive
                            ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                            : 'border-slate-800 bg-[#060913] text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-[11px] text-cyan-300">0{idx + 1}. </span>
                        {part.shortLabel}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-xl border border-slate-800 bg-[#060913] p-5">
                  <p className="font-mono text-xs text-cyan-300">{activePart.step}</p>
                  <h4 className="mt-1.5 font-display text-xl font-bold text-white">
                    {activePart.title}
                  </h4>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-200 sm:text-base">
                    {activePart.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Coronal Mass Ejections (CMEs) */}
      <section
        id="coronal-mass-ejections"
        aria-labelledby="cme-heading"
        className="border-b border-slate-800/80 bg-[#080D1B] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8 lg:col-span-6">
              <div>
                <p className="font-mono text-xs tracking-wider text-cyan-400">
                  Solar Event 02 · Plasma Cloud Eruption
                </p>
                <h2
                  id="cme-heading"
                  className="mt-2 font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-4xl"
                >
                  CORONAL MASS EJECTIONS (CMEs)
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                  <p>
                    <strong className="text-white">What material is released?</strong> A Coronal
                    Mass Ejection (CME) blasts an enormous bubble of magnetized plasma—billions of
                    tons of hot, electrically charged gas—out of the Sun’s outer atmosphere, called
                    the corona.
                  </p>
                  <p>
                    <strong className="text-white">How it travels through space:</strong> Unlike
                    light from a solar flare, a CME is made of physical matter. It sweeps outward
                    into the solar system and typically takes one to several days to travel the
                    distance to Earth and the Moon.
                  </p>
                  <p>
                    <strong className="text-white">Why scientists monitor CMEs:</strong> Space
                    telescopes use a round blocker called a coronagraph to hide the Sun’s blinding
                    glare so scientists can see faint plasma clouds and check which direction they
                    are heading.
                  </p>
                  <p>
                    <strong className="text-white">How they influence space weather:</strong> When
                    an Earth-directed CME pushes against our planet’s magnetic shield, it can spark
                    bright polar auroras and disturb satellites or radio communications.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B1120]">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#060913] lg:flex-1">
                  <SpaceImage
                    src={SOLAR_MEDIA.cme.src}
                    alt={SOLAR_MEDIA.cme.alt}
                    fallbackTitle="Coronal Mass Ejection Visualization"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="border-t border-slate-800/80 px-4 py-3 font-mono text-xs text-slate-400">
                  {SOLAR_MEDIA.cme.attribution}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Solar Energetic Particles */}
      <section
        id="solar-energetic-particles"
        aria-labelledby="sep-heading"
        className="border-b border-slate-800/80 bg-[#060913] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B1120]">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#060913] lg:flex-1">
                  <SpaceImage
                    src={SOLAR_MEDIA.particles.src}
                    alt={SOLAR_MEDIA.particles.alt}
                    fallbackTitle="Solar Energetic Particles & Magnetosphere"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="border-t border-slate-800/80 px-4 py-3 font-mono text-xs text-slate-400">
                  {SOLAR_MEDIA.particles.attribution}
                </figcaption>
              </figure>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8 lg:col-span-6">
              <div>
                <p className="font-mono text-xs tracking-wider text-cyan-400">
                  Solar Event 03 · Radiation &amp; Astronaut Safety
                </p>
                <h2
                  id="sep-heading"
                  className="mt-2 font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-4xl"
                >
                  SOLAR ENERGETIC PARTICLES
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                  <p>
                    <strong className="text-white">What energetic particles are:</strong> During
                    powerful solar eruptions, tiny atomic particles—mostly protons and
                    electrons—can be accelerated to tremendous speeds and stream out into space.
                  </p>
                  <p>
                    <strong className="text-white">Why they matter for astronauts:</strong> On
                    Earth, our thick atmosphere and global magnetic field deflect or absorb most
                    space radiation. Astronauts traveling to the Moon or working on the lunar
                    surface are outside Earth’s protective bubble.
                  </p>
                  <p>
                    <strong className="text-white">
                      Why spacecraft and habitats need shielding:
                    </strong>{' '}
                    NASA engineers build spacecraft and lunar habitats with radiation-absorbing
                    walls and storm shelters so crews can step inside safely when a particle event
                    is detected.
                  </p>
                  <p className="rounded-lg border border-slate-800 bg-[#060913] p-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                    <strong className="text-cyan-300">Important Science Note:</strong> Not every
                    solar flare produces the same radiation hazard—many small flares cause little
                    or no particle storm at all, which is why scientists monitor each event
                    individually.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
