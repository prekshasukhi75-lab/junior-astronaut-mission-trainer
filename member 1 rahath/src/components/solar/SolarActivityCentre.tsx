import { DidYouKnowAndNav } from './DidYouKnowAndNav';
import { MeetTheSunSection } from './MeetTheSunSection';
import { SolarHeroSection } from './SolarHeroSection';
import { SolarLearningGames } from './SolarLearningGames';
import { SolarPhenomenaSection } from './SolarPhenomenaSection';
import { SpaceWeatherMonitor } from './SpaceWeatherMonitor';

interface SolarActivityCentreProps {
  onBackToScienceCentre: () => void;
  onExploreMoonTemperature: () => void;
  onExploreNasaImages: () => void;
}

export function SolarActivityCentre({
  onBackToScienceCentre,
  onExploreMoonTemperature,
  onExploreNasaImages,
}: SolarActivityCentreProps) {
  return (
    <div>
      <SolarHeroSection onBackToScienceCentre={onBackToScienceCentre} />
      <MeetTheSunSection />
      <SolarPhenomenaSection />
      <SpaceWeatherMonitor />
      <SolarLearningGames />
      <DidYouKnowAndNav
        onBackToScienceCentre={onBackToScienceCentre}
        onExploreMoonTemperature={onExploreMoonTemperature}
        onExploreNasaImages={onExploreNasaImages}
      />
    </div>
  );
}
