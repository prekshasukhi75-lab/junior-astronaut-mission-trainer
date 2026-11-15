import {
  EXPLORATION_DESTINATIONS,
  type DestinationModule,
} from '../data/scienceCentreData';
import { DestinationCard } from './DestinationCard';

interface ExplorationGridProps {
  onSelectDestination: (destination: DestinationModule) => void;
}

export function ExplorationGrid({ onSelectDestination }: ExplorationGridProps) {
  return (
    <section
      id="explore-destinations"
      aria-labelledby="exploration-heading"
      className="border-b border-slate-800/80 bg-[#060913] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Main Exploration Deck
            </p>
            <h2
              id="exploration-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
            >
              CHOOSE YOUR SCIENCE DESTINATION
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            Select any of the four NASA Science Centre stations below to preview what you will
            investigate.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {EXPLORATION_DESTINATIONS.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onSelect={onSelectDestination}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
