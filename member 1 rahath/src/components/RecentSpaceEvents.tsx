import { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { DEMONSTRATION_SPACE_EVENTS } from '../data/scienceCentreData';

export function RecentSpaceEvents() {
  const [selectedEventId, setSelectedEventId] = useState(
    DEMONSTRATION_SPACE_EVENTS[0].id
  );

  const selectedEvent =
    DEMONSTRATION_SPACE_EVENTS.find((event) => event.id === selectedEventId) ??
    DEMONSTRATION_SPACE_EVENTS[0];

  return (
    <section
      id="recent-events"
      aria-labelledby="recent-events-heading"
      className="border-b border-slate-800/80 bg-[#060913] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Demonstration Preview · Educational Feed
            </p>
            <h2
              id="recent-events-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl"
            >
              RECENT SPACE EVENTS
            </h2>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs leading-relaxed text-amber-200 max-w-md">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
            <span>
              <strong>Demonstration Content:</strong> Sample educational topics shown for
              interface preview. Live NASA telemetry and measurements are not connected yet.
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Event Selector List */}
          <div className="flex flex-col gap-3 lg:col-span-5" role="list">
            {DEMONSTRATION_SPACE_EVENTS.map((event) => {
              const isSelected = event.id === selectedEvent.id;
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEventId(event.id)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400/70 bg-[#101A33]'
                      : 'border-slate-800/90 bg-[#0B1120] hover:border-slate-700 hover:bg-[#0E1629]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-cyan-300">{event.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{event.label}</span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold text-white">
                      {event.title}
                    </h3>
                  </div>

                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform duration-150 ${
                      isSelected ? 'translate-x-0.5 text-cyan-300' : 'text-slate-500'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Selected Demonstration Briefing Panel */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-cyan-300">{selectedEvent.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300">{selectedEvent.label}</span>
              </div>

              <h3 className="mt-3 font-display text-2xl font-bold text-white">
                {selectedEvent.title}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-200">
                {selectedEvent.summary}
              </p>

              <div className="mt-6 border-t border-slate-800/80 pt-5">
                <h4 className="font-mono text-xs tracking-wide text-slate-400">
                  How Scientists Study This
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {selectedEvent.scienceFocus}
                </p>
              </div>
            </div>

            <p className="mt-8 border-t border-slate-800/80 pt-4 font-mono text-xs text-slate-400">
              Preview Mode · Sample educational note without live NASA measurements
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
