import { DayVsNightSection } from './DayVsNightSection';
import { InteractiveLunarMap } from './InteractiveLunarMap';
import { MoonHeroSection } from './MoonHeroSection';
import { MoonTemperatureGames } from './MoonTemperatureGames';
import { NasaScienceCornerAndNav } from './NasaScienceCornerAndNav';
import { PolarCraterSection } from './PolarCraterSection';
import { WhyMoonExtremeSection } from './WhyMoonExtremeSection';

interface MoonTemperatureExplorerProps {
  onBackToScienceCentre: () => void;
  onNavigateSolarActivity: () => void;
  onExploreNasaImages: () => void;
}

export function MoonTemperatureExplorer({
  onBackToScienceCentre,
  onNavigateSolarActivity,
  onExploreNasaImages,
}: MoonTemperatureExplorerProps) {
  const handleExploreMoon = () => {
    const target = document.querySelector('#why-moon-extreme');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      <MoonHeroSection
        onBackToScienceCentre={onBackToScienceCentre}
        onExploreMoon={handleExploreMoon}
      />
      <WhyMoonExtremeSection />
      <InteractiveLunarMap />
      <DayVsNightSection />
      <PolarCraterSection />
      <MoonTemperatureGames />
      <NasaScienceCornerAndNav
        onBackToScienceCentre={onBackToScienceCentre}
        onNavigateSolarActivity={onNavigateSolarActivity}
        onExploreNasaImages={onExploreNasaImages}
      />
    </div>
  );
}
