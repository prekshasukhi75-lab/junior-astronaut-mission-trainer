import type { FooterTopicInfo } from '../data/scienceCentreData';

interface FooterProps {
  onNavigateScienceCentre: () => void;
  onOpenTopic: (topicId: FooterTopicInfo['id']) => void;
}

export function Footer({ onNavigateScienceCentre, onOpenTopic }: FooterProps) {
  return (
    <footer className="bg-[#050811] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-slate-800/80 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg font-bold tracking-wide text-white">
              Mission: Little Astronaut
            </p>
            <p className="mt-1 text-sm text-slate-400">
              NASA Science Centre landing interface for young explorers aged 7–12.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-300"
          >
            <button
              type="button"
              onClick={onNavigateScienceCentre}
              className="min-h-[40px] whitespace-nowrap transition-colors duration-150 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 cursor-pointer"
            >
              Science Centre
            </button>

            <button
              type="button"
              onClick={() => onOpenTopic('nasa-data-sources')}
              className="min-h-[40px] whitespace-nowrap transition-colors duration-150 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 cursor-pointer"
            >
              NASA data sources
            </button>

            <button
              type="button"
              onClick={() => onOpenTopic('about-project')}
              className="min-h-[40px] whitespace-nowrap transition-colors duration-150 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 cursor-pointer"
            >
              About the project
            </button>

            <button
              type="button"
              onClick={() => onOpenTopic('learning-resources')}
              className="min-h-[40px] whitespace-nowrap transition-colors duration-150 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 cursor-pointer"
            >
              Learning resources
            </button>
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Mission: Little Astronaut · Group 3 Science Centre</p>
          <p>Official NASA Image Library integration · Interactive educational space modules.</p>
        </div>
      </div>
    </footer>
  );
}
