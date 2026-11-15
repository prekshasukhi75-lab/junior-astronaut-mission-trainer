/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ExplorationGrid } from './components/ExplorationGrid';
import { FeaturedDiscovery } from './components/FeaturedDiscovery';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { NASAImageExplorer } from './components/explorer/NASAImageExplorer';
import { MoonTemperatureExplorer } from './components/moon/MoonTemperatureExplorer';
import { RecentSpaceEvents } from './components/RecentSpaceEvents';
import {
  CadetProfileModal,
  DestinationPreviewModal,
  FooterTopicModal,
  type CadetProfile,
} from './components/ScienceCentreModals';
import { SolarActivityCentre } from './components/solar/SolarActivityCentre';
import { SpaceScienceLab } from './components/lab/SpaceScienceLab';
import { TopNav } from './components/TopNav';
import {
  FOOTER_TOPICS,
  type DestinationModule,
  type FooterTopicInfo,
  type NavSectionId,
} from './data/scienceCentreData';

type ActiveCentreView =
  | 'landing'
  | 'solar-activity'
  | 'moon-temperature'
  | 'nasa-image-explorer'
  | 'space-science-lab';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveCentreView>('landing');
  const [activeNav, setActiveNav] = useState<NavSectionId>('science-centre');
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationModule | null>(null);
  const [selectedFooterTopic, setSelectedFooterTopic] =
    useState<FooterTopicInfo | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cadetProfile, setCadetProfile] = useState<CadetProfile>({
    name: 'Cadet Explorer',
    ageGroup: '7–9 Explorer',
    focusTrack: 'Moon Mapper',
  });

  const scrollToTarget = (selector: string) => {
    if (selector === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectNav = (itemId: NavSectionId, href: string) => {
    setActiveNav(itemId);
    if (activeView !== 'landing') {
      setActiveView('landing');
      window.setTimeout(() => scrollToTarget(href), 30);
      return;
    }
    scrollToTarget(href);
  };

  const handleStartExploring = () => {
    setActiveNav('explore');
    scrollToTarget('#explore-destinations');
  };

  const openSolarActivity = () => {
    setActiveView('solar-activity');
    setActiveNav('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openMoonTemperature = () => {
    setActiveView('moon-temperature');
    setActiveNav('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openNasaImageExplorer = () => {
    setActiveView('nasa-image-explorer');
    setActiveNav('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSpaceScienceLab = () => {
    setActiveView('space-science-lab');
    setActiveNav('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDestination = (destination: DestinationModule) => {
    if (destination.id === 'solar-activity') {
      openSolarActivity();
      return;
    }
    if (destination.id === 'moon-temperature') {
      openMoonTemperature();
      return;
    }
    if (destination.id === 'nasa-image-explorer') {
      openNasaImageExplorer();
      return;
    }
    if (destination.id === 'space-science-lab') {
      openSpaceScienceLab();
      return;
    }
    setSelectedDestination(destination);
  };

  const handleBackToScienceCentre = () => {
    setActiveView('landing');
    setActiveNav('science-centre');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen bg-[#060913] text-slate-100">
      <TopNav
        activeNav={activeNav}
        cadetName={cadetProfile.name}
        onSelectNav={handleSelectNav}
        onOpenProfile={() => setProfileOpen(true)}
      />

      <main>
        {activeView === 'solar-activity' ? (
          <SolarActivityCentre
            onBackToScienceCentre={handleBackToScienceCentre}
            onExploreMoonTemperature={openMoonTemperature}
            onExploreNasaImages={openNasaImageExplorer}
          />
        ) : activeView === 'moon-temperature' ? (
          <MoonTemperatureExplorer
            onBackToScienceCentre={handleBackToScienceCentre}
            onNavigateSolarActivity={openSolarActivity}
            onExploreNasaImages={openNasaImageExplorer}
          />
        ) : activeView === 'nasa-image-explorer' ? (
          <NASAImageExplorer
            onBackToScienceCentre={handleBackToScienceCentre}
            onNavigateSolarActivity={openSolarActivity}
            onNavigateMoonTemperature={openMoonTemperature}
          />
        ) : activeView === 'space-science-lab' ? (
          <SpaceScienceLab
            cadetName={cadetProfile.name}
            onBackToScienceCentre={handleBackToScienceCentre}
            onNavigateSolarActivity={openSolarActivity}
            onNavigateMoonTemperature={openMoonTemperature}
            onNavigateNasaImages={openNasaImageExplorer}
          />
        ) : (
          <>
            <HeroSection onStartExploring={handleStartExploring} />

            <ExplorationGrid onSelectDestination={handleSelectDestination} />

            <FeaturedDiscovery onInspectMoonModule={openMoonTemperature} />

            <RecentSpaceEvents />
          </>
        )}
      </main>

      <Footer
        onNavigateScienceCentre={handleBackToScienceCentre}
        onOpenTopic={(topicId) => setSelectedFooterTopic(FOOTER_TOPICS[topicId])}
      />

      <DestinationPreviewModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />

      <FooterTopicModal
        topic={selectedFooterTopic}
        onClose={() => setSelectedFooterTopic(null)}
      />

      <CadetProfileModal
        isOpen={profileOpen}
        profile={cadetProfile}
        onUpdateProfile={setCadetProfile}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
