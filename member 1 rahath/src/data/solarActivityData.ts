import solarHeroImg from '../assets/images/solar_hero_sun_1794648516970.jpg';
import solarFlareImg from '../assets/images/solar_flare_clean_1794648533347.jpg';
import solarCmeImg from '../assets/images/solar_cme_clean_1794648533019.jpg';
import solarParticlesImg from '../assets/images/solar_particles_clean_1794648533854.jpg';

export interface SolarReferenceStat {
  label: string;
  value: string;
  detail: string;
  sourceLabel: string;
}

export interface MeetSunTopic {
  index: string;
  title: string;
  body: string;
}

export interface FlareInteractivePart {
  id: 'sunspots' | 'magnetic-loops' | 'flash-point' | 'light-burst';
  step: string;
  title: string;
  shortLabel: string;
  explanation: string;
  position: { cx: number; cy: number };
}

export interface MonitorDemoPanel {
  code: 'FLR' | 'CME' | 'SEP';
  title: string;
  statusLabel: string;
  demoHeadline: string;
  summary: string;
  astronautNote: string;
}

export type SolarEventChoice = 'flare' | 'cme' | 'sep';

export interface IdentifyEventRound {
  id: string;
  promptTitle: string;
  clueText: string;
  visualCue: string;
  correctAnswer: SolarEventChoice;
  explanation: string;
}

export interface MissionChallengeOption {
  id: 'stay-outside' | 'enter-shelter' | 'remove-helmet';
  label: string;
  summary: string;
  isRecommended: boolean;
  outcomeTitle: string;
  consequence: string;
}

export interface DidYouKnowFact {
  index: string;
  title: string;
  fact: string;
  reference: string;
}

export const SOLAR_MEDIA = {
  hero: {
    src: solarHeroImg,
    alt: 'Extreme ultraviolet view of the Sun showing glowing plasma loops arching along its limb.',
    attribution: 'Imagery concept: NASA Solar Dynamics Observatory (SDO) extreme ultraviolet Sun view',
  },
  flare: {
    src: solarFlareImg,
    alt: 'Bright solar flare erupting from twisted magnetic loops above an active sunspot region.',
    attribution: 'Imagery concept: NASA SDO extreme ultraviolet observation of an active flare region',
  },
  cme: {
    src: solarCmeImg,
    alt: 'Coronagraph visualization showing a bright plasma cloud expanding outward from behind a dark occulting disk.',
    attribution: 'Imagery concept: NASA/ESA SOHO LASCO coronagraph plasma eruption view',
  },
  particles: {
    src: solarParticlesImg,
    alt: 'Streams of solar energetic particles traveling past the Moon and deflecting around Earth’s magnetic field.',
    attribution: 'Imagery concept: NASA Heliophysics Earth-Moon space weather visualization',
  },
};

export const SOLAR_REFERENCE_STATS: SolarReferenceStat[] = [
  {
    label: 'Star Type & Approximate Age',
    value: 'Yellow Dwarf · ~4.6B yrs',
    detail: 'A G-type main-sequence star at the center of our solar system.',
    sourceLabel: 'Educational Reference · NASA Sun Facts',
  },
  {
    label: 'Average Distance to Earth',
    value: '~150 Million km',
    detail: 'Sunlight takes about 8 minutes and 20 seconds to reach Earth.',
    sourceLabel: 'Educational Reference · NASA Space Place',
  },
  {
    label: 'Temperature Zones',
    value: '~5,500 °C Surface',
    detail: 'The visible photosphere is cooler than the ~15 million °C fusion core.',
    sourceLabel: 'Educational Reference · NASA Heliophysics',
  },
];

export const MEET_THE_SUN_TOPICS: MeetSunTopic[] = [
  {
    index: '01',
    title: 'What the Sun Is',
    body: 'The Sun is not solid rock like Earth or the Moon. It is a giant sphere of super-hot, electrically charged gas called plasma—mostly hydrogen and helium—held together by strong gravity.',
  },
  {
    index: '02',
    title: 'Why the Sun Produces Energy',
    body: 'Deep inside the Sun’s core, immense pressure squeezes hydrogen atoms together into helium in a process called nuclear fusion. That reaction releases huge amounts of light and heat that warm our planet.',
  },
  {
    index: '03',
    title: 'What Solar Activity Means',
    body: 'Because the Sun is made of moving charged gas, it creates powerful magnetic fields. As the Sun spins, those invisible magnetic lines twist, tangle, and sometimes snap—producing sunspots, bright flares, and plasma clouds.',
  },
  {
    index: '04',
    title: 'Why It Matters for Space Exploration',
    body: 'On Earth, our thick atmosphere and magnetic shield protect us from most solar bursts. Out in space or on the Moon, astronauts and spacecraft operate without that shield, so Mission Control watches the Sun closely.',
  },
];

export const FLARE_INTERACTIVE_PARTS: FlareInteractivePart[] = [
  {
    id: 'sunspots',
    step: 'Part 01',
    title: 'Sunspot Pair',
    shortLabel: 'Sunspots',
    explanation:
      'Darker, cooler patches on the Sun’s visible surface where strong magnetic fields poke out like opposite poles of a giant bar magnet.',
    position: { cx: 155, cy: 195 },
  },
  {
    id: 'magnetic-loops',
    step: 'Part 02',
    title: 'Twisted Magnetic Loops',
    shortLabel: 'Magnetic Loops',
    explanation:
      'Glowing arches of plasma follow invisible magnetic field lines between sunspots. Over hours or days, twisting motion stores huge magnetic energy.',
    position: { cx: 210, cy: 120 },
  },
  {
    id: 'flash-point',
    step: 'Part 03',
    title: 'Magnetic Reconnection Flash',
    shortLabel: 'Flash Point',
    explanation:
      'When stressed magnetic lines suddenly snap and rearrange—called magnetic reconnection—they release stored energy in a brilliant flash.',
    position: { cx: 228, cy: 168 },
  },
  {
    id: 'light-burst',
    step: 'Part 04',
    title: 'X-Ray & Ultraviolet Burst',
    shortLabel: 'Energy Burst',
    explanation:
      'The flare sends out intense X-rays and ultraviolet light traveling at the speed of light, reaching Earth and the Moon in about 8 minutes.',
    position: { cx: 335, cy: 88 },
  },
];

export const SPACE_WEATHER_DEMO_PANELS: MonitorDemoPanel[] = [
  {
    code: 'FLR',
    title: 'Solar Flares',
    statusLabel: 'Demonstration Sample',
    demoHeadline: 'Bright Electromagnetic Flash Scenario',
    summary:
      'Demonstrates how space weather centers track sudden bursts of X-ray and ultraviolet light from active sunspot regions.',
    astronautNote:
      'Because light travels at 300,000 km/s, flare radiation arrives at Earth and the Moon roughly 8 minutes after eruption.',
  },
  {
    code: 'CME',
    title: 'Coronal Mass Ejections',
    statusLabel: 'Demonstration Sample',
    demoHeadline: 'Expanding Plasma Cloud Scenario',
    summary:
      'Demonstrates how coronagraph telescopes watch massive clouds of magnetized plasma expanding away from the Sun.',
    astronautNote:
      'CMEs travel slower than light—often taking 1 to 3 days to cross space—giving mission teams time to track their direction.',
  },
  {
    code: 'SEP',
    title: 'Solar Energetic Particle Events',
    statusLabel: 'Demonstration Sample',
    demoHeadline: 'High-Speed Particle Stream Scenario',
    summary:
      'Demonstrates how observatories monitor fast-moving protons and electrons accelerated during major solar eruptions.',
    astronautNote:
      'Not every solar flare produces a major particle storm; when one does occur, crews outside Earth’s magnetic field move inside shielded habitats.',
  },
];

export const IDENTIFY_EVENT_ROUNDS: IdentifyEventRound[] = [
  {
    id: 'round-1',
    promptTitle: 'Observation Clue 1',
    clueText:
      'Space telescopes see a sudden, super-bright flash of X-rays and ultraviolet light above an active sunspot group. Its light reaches Earth in just over 8 minutes.',
    visualCue: 'Sudden electromagnetic flash at the speed of light',
    correctAnswer: 'flare',
    explanation:
      'Correct! A solar flare is a sudden flash of light and electromagnetic energy caused when twisted magnetic fields on the Sun snap and reconnect.',
  },
  {
    id: 'round-2',
    promptTitle: 'Observation Clue 2',
    clueText:
      'A coronagraph telescope spots a gigantic bubble of magnetized plasma—billions of tons of solar gas—slowly billowing away from the Sun over 1 to 3 days.',
    visualCue: 'Giant expanding cloud of solar plasma moving through space',
    correctAnswer: 'cme',
    explanation:
      'Correct! A Coronal Mass Ejection (CME) launches a huge cloud of magnetized plasma from the Sun’s outer atmosphere into the solar system.',
  },
  {
    id: 'round-3',
    promptTitle: 'Observation Clue 3',
    clueText:
      'Tiny protons and electrons are accelerated to tremendous speeds during a major solar eruption, creating a radiation hazard that requires habitat shielding for astronauts on the Moon.',
    visualCue: 'High-speed charged particles requiring crew radiation shielding',
    correctAnswer: 'sep',
    explanation:
      'Correct! Solar Energetic Particle (SEP) events send fast-moving protons and electrons across space, which is why lunar astronauts shelter behind thick shielding.',
  },
];

export const MISSION_CHALLENGE_OPTIONS: MissionChallengeOption[] = [
  {
    id: 'stay-outside',
    label: 'Keep exploring the open crater rim',
    summary: 'Continue collecting rock samples outside the lunar habitat.',
    isRecommended: false,
    outcomeTitle: 'Unsafe Choice — Exposed on the Surface',
    consequence:
      'The Moon has no thick atmosphere or global magnetic field to block fast solar particles. Staying outdoors during a space-weather warning leaves astronauts with only their spacesuits for protection.',
  },
  {
    id: 'enter-shelter',
    label: 'Move inside the shielded lunar habitat shelter',
    summary: 'Pause the moonwalk, return indoors, and wait for Mission Control’s all-clear.',
    isRecommended: true,
    outcomeTitle: 'Mission-Safe Decision — Crew Protected',
    consequence:
      'Smart teamwork! Lunar habitats and spacecraft include dedicated storm shelters lined with dense materials, water tanks, and equipment racks that help absorb incoming energetic particles until conditions calm down.',
  },
  {
    id: 'remove-helmet',
    label: 'Park the lunar rover and take off helmets inside the open rover',
    summary: 'Stop driving and stay seated on the unpressurized lunar rover.',
    isRecommended: false,
    outcomeTitle: 'Unsafe Choice — Lunar Rovers Have No Air',
    consequence:
      'An open lunar rover does not hold breathable air or block space radiation. Astronauts must always keep their pressurized spacesuits sealed outside and return to the pressurized, shielded habitat.',
  },
];

export const DID_YOU_KNOW_FACTS: DidYouKnowFact[] = [
  {
    index: '01',
    title: 'Sunlight Takes About 8 Minutes, Plasma Takes Days',
    fact: 'Light from a solar flare races across 150 million kilometers to reach Earth in roughly 8 minutes and 20 seconds, while a Coronal Mass Ejection plasma cloud usually takes one to several days to make the same trip.',
    reference: 'Educational Reference: NASA Space Place & Heliophysics Science',
  },
  {
    index: '02',
    title: 'The Sun Follows an ~11-Year Activity Cycle',
    fact: 'Roughly every 11 years, the Sun’s magnetic poles flip and solar activity rises from quiet "solar minimum" to active "solar maximum," when sunspots and flares happen much more often.',
    reference: 'Educational Reference: NASA / NOAA Solar Cycle Overview',
  },
  {
    index: '03',
    title: 'Auroras Are Space Weather in Action',
    fact: 'When solar wind and coronal mass ejections interact with Earth’s magnetic field, charged particles cascade toward our North and South Poles and make upper-atmosphere gases glow as colorful auroras.',
    reference: 'Educational Reference: NASA Science — Auroras & Magnetosphere',
  },
];
