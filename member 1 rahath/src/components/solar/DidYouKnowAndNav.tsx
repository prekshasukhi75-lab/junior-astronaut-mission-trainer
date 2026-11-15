import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DID_YOU_KNOW_FACTS } from '../../data/solarActivityData';

interface DidYouKnowAndNavProps {
  onBackToScienceCentre: () => void;
  onExploreMoonTemperature: () => void;
  onExploreNasaImages: () => void;
}

export function DidYouKnowAndNav({
  onBackToScienceCentre,
  onExploreMoonTemperature,
  onExploreNasaImages,
}: DidYouKnowAndNavProps) {
  return (
    <div className="bg-[#060913]">
      {/* Section 9: Did You Know? */}
      <section
        id="did-you-know"
        aria-labelledby="did-you-know-heading"
        className="border-b border-slate-800/80 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Verified Astronomy Facts
            </p>
            <h2
              id="did-you-know-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
            >
              DID YOU KNOW?
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {DID_YOU_KNOW_FACTS.map((item) => (
              <article
                key={item.index}
                className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0B1120] p-6"
              >
                <div>
                  <p className="font-mono text-xs text-cyan-300">
                    Fact {item.index}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {item.fact}
                  </p>
                </div>

                <p className="mt-5 border-t border-slate-800/80 pt-3 font-mono text-xs text-slate-400">
                  {item.reference}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Destination Navigation */}
      <section
        aria-label="Solar Activity section navigation"
        className="border-b border-slate-800/80 bg-[#080D1B] py-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="font-mono text-xs text-cyan-400">Continue Exploring</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
              Where would you like to travel next?
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBackToScienceCentre}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Science Centre</span>
            </button>

            <button
              type="button"
              onClick={onExploreMoonTemperature}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-slate-700 bg-[#111B33] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
            >
              <span>Explore Moon Temperature</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onExploreNasaImages}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#F04A3E] cursor-pointer"
            >
              <span>Explore NASA Images</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
