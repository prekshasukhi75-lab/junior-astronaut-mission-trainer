import { Database, Info } from 'lucide-react';
import { SPACE_WEATHER_DEMO_PANELS } from '../../data/solarActivityData';
import { NASA_DONKI_SERVICE_STATUS } from '../../services/nasaDonkiService';

export function SpaceWeatherMonitor() {
  return (
    <section
      id="space-weather-monitor"
      aria-labelledby="monitor-heading"
      className="border-b border-slate-800/80 bg-[#080D1B] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Mission Control Console · Demonstration Layout
            </p>
            <h2
              id="monitor-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
            >
              SPACE WEATHER MONITOR
            </h2>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-xs leading-relaxed text-amber-200 max-w-lg">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            <span>
              <strong>Educational Demonstration Content:</strong> Panels below explain the three
              main space-weather event types using sample scenarios. No live NASA telemetry or
              real-time measurements are shown.
            </span>
          </div>
        </div>

        {/* Three Mission-Control Demonstration Panels */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SPACE_WEATHER_DEMO_PANELS.map((panel) => (
            <article
              key={panel.code}
              className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120] p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-semibold text-cyan-300">
                    {panel.code} <span aria-hidden="true">·</span> Monitor Panel
                  </span>
                  <span className="font-mono text-amber-300">{panel.statusLabel}</span>
                </div>

                <h3 className="mt-3 font-display text-xl font-bold text-white">
                  {panel.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-200">
                  {panel.demoHeadline}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {panel.summary}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-800/80 pt-4">
                <p className="font-mono text-[11px] text-slate-400">Astronaut Context</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  {panel.astronautNote}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Reserved Area for Future NASA DONKI API Integration */}
        <div className="mt-8 rounded-xl border border-dashed border-slate-700 bg-[#060913]/80 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <Database
                className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400"
                aria-hidden="true"
              />
              <div>
                <p className="font-mono text-xs text-cyan-300">
                  Reserved Integration Slot · Status:{' '}
                  {NASA_DONKI_SERVICE_STATUS.connected
                    ? 'Connected'
                    : 'Not Connected (Demonstration Mode)'}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold text-white">
                  Future NASA DONKI API Connection Area
                </h3>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                  This console is structured to connect to{' '}
                  {NASA_DONKI_SERVICE_STATUS.provider} in an upcoming development step without
                  changing the Science Centre layout.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:shrink-0">
              {NASA_DONKI_SERVICE_STATUS.plannedEndpoints.map((endpoint) => (
                <div
                  key={endpoint.code}
                  className="rounded-lg border border-slate-800 bg-[#0B1120] px-3.5 py-2.5"
                >
                  <p className="font-mono text-xs font-semibold text-cyan-300">
                    {endpoint.code}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-300">{endpoint.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
