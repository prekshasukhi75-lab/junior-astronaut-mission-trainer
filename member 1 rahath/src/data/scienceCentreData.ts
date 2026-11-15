import heroLunarImg from '../assets/images/hero_lunar_astronaut_1794648137491.jpg';
import solarActivityImg from '../assets/images/card_solar_activity_1794648137282.jpg';
import moonTemperatureImg from '../assets/images/card_moon_temperature_1794648138216.jpg';
import nasaImageExplorerImg from '../assets/images/card_nasa_image_explorer_1794648139159.jpg';
import spaceScienceLabImg from '../assets/images/card_space_science_lab_1794648139815.jpg';
import discoverMoonImg from '../assets/images/featured_discover_moon_1794648139870.jpg';

export type NavSectionId = 'home' | 'science-centre' | 'missions' | 'explore';

export interface NavItem {
  id: NavSectionId;
  label: string;
  href: string;
}

export interface DestinationModule {
  id: 'solar-activity' | 'moon-temperature' | 'nasa-image-explorer' | 'space-science-lab';
  index: string;
  discipline: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  previewSummary: string;
  learningTopics: string[];
}

export interface DemonstrationSpaceEvent {
  id: string;
  category: string;
  title: string;
  label: string;
  summary: string;
  scienceFocus: string;
}

export interface FooterTopicInfo {
  id: 'nasa-data-sources' | 'about-project' | 'learning-resources';
  title: string;
  subtitle: string;
  paragraphs: string[];
  highlights: string[];
}

export const HERO_MEDIA = {
  imageSrc: heroLunarImg,
  imageAlt:
    'Astronaut in a pressurized spacesuit standing near a lunar crater rim with Earth visible in the black sky above.',
};

export const FEATURED_MOON_MEDIA = {
  imageSrc: discoverMoonImg,
  imageAlt:
    'Orbital photograph of the heavily cratered lunar horizon with a blue-and-white Earth rising above the Moon.',
};

export const TOP_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#top' },
  { id: 'science-centre', label: 'Science Centre', href: '#science-centre' },
  { id: 'missions', label: 'Missions', href: '#discover-moon' },
  { id: 'explore', label: 'Explore', href: '#explore-destinations' },
];

export const EXPLORATION_DESTINATIONS: DestinationModule[] = [
  {
    id: 'solar-activity',
    index: '01',
    discipline: 'Heliophysics',
    title: 'SOLAR ACTIVITY',
    description: "Discover solar flares, solar storms and the Sun's activity.",
    imageSrc: solarActivityImg,
    imageAlt:
      'Extreme ultraviolet view of the Sun showing bright active flare regions and glowing magnetic plasma loops.',
    previewSummary:
      'Step inside our solar observation deck to learn how giant magnetic loops on the Sun release bursts of energy called solar flares and how space weather travels across the solar system.',
    learningTopics: [
      'How magnetic energy builds up inside sunspots',
      'What causes solar flares and coronal mass ejections',
      'Why astronauts and satellites monitor space weather',
    ],
  },
  {
    id: 'moon-temperature',
    index: '02',
    discipline: 'Lunar Thermal Science',
    title: 'MOON TEMPERATURE',
    description: 'Explore how temperatures change across the lunar surface.',
    imageSrc: moonTemperatureImg,
    imageAlt:
      'Thermal map of the Moon showing warm sunlit equatorial regions in amber and freezing shadowed polar craters in deep blue.',
    previewSummary:
      'Compare blistering lunar daytime heat with deep frozen polar craters using orbital thermal mapping concepts inspired by NASA’s Lunar Reconnaissance Orbiter.',
    learningTopics: [
      'Why the Moon swings from scorching sun to freezing shadow',
      'How permanently shadowed craters near the lunar poles stay cold',
      'Why water ice can survive inside dark polar craters',
    ],
  },
  {
    id: 'nasa-image-explorer',
    index: '03',
    discipline: 'Mission Archives',
    title: 'NASA IMAGE EXPLORER',
    description: 'Discover real photographs and discoveries from NASA missions.',
    imageSrc: nasaImageExplorerImg,
    imageAlt:
      'Apollo-era lunar roving vehicle parked near volcanic boulders on the Moon with sunlit mountains on the horizon.',
    previewSummary:
      'Browse curated mission photography from historic lunar landings, robotic rovers, and space telescopes to see how engineers and astronauts documented other worlds.',
    learningTopics: [
      'Historic photography from Apollo lunar surface expeditions',
      'How cameras and rovers study rocks, dust, and craters',
      'Connecting mission images with scientific discoveries',
    ],
  },
  {
    id: 'space-science-lab',
    index: '04',
    discipline: 'Astronaut Habitats',
    title: 'SPACE SCIENCE LAB',
    description: 'Learn about radiation, lunar environments and astronaut survival.',
    imageSrc: spaceScienceLabImg,
    imageAlt:
      'Astronauts inspecting scientific instruments beside a cylindrical lunar research habitat with solar panels.',
    previewSummary:
      'Investigate what astronauts need to live and work safely on the Moon—from radiation shielding and spacesuit cooling to solar power and breathable air systems.',
    learningTopics: [
      'Protecting astronauts from cosmic and solar radiation',
      'How lunar habitats recycle air and water',
      'Designing spacesuits for fine lunar dust and extreme cold',
    ],
  },
];

export const DISCOVER_MOON_FACTS = [
  {
    label: 'Average Distance from Earth',
    value: '384,400 km',
    note: 'About 30 Earth diameters away',
  },
  {
    label: 'Lunar Orbit Period',
    value: '27.3 days',
    note: 'Time to complete one orbit around Earth',
  },
  {
    label: 'Surface Environment',
    value: 'Airless World',
    note: 'No thick atmosphere to trap heat or block radiation',
  },
];

export const DEMONSTRATION_SPACE_EVENTS: DemonstrationSpaceEvent[] = [
  {
    id: 'demo-solar-flare-guide',
    category: 'Solar Observation',
    title: 'Active Sunspot Region Overview',
    label: 'Demonstration Content',
    summary:
      'A sample educational entry illustrating how mission scientists watch twisted magnetic field lines on the Sun before a solar flare erupts.',
    scienceFocus:
      'Solar telescopes observe extreme ultraviolet light to spot bright active loops high above the solar surface.',
  },
  {
    id: 'demo-lunar-south-pole',
    category: 'Lunar Environment',
    title: 'Lunar South Pole Sunlight Window',
    label: 'Demonstration Content',
    summary:
      'A sample briefing showing why crater rims near the Moon’s South Pole catch long periods of sunlight while nearby crater floors stay in permanent shadow.',
    scienceFocus:
      'Sunlit ridges help solar arrays generate power, while shadowed craters may preserve ancient water ice.',
  },
  {
    id: 'demo-radiation-shielding',
    category: 'Space Weather',
    title: 'Solar Particle Storm Preparedness Brief',
    label: 'Demonstration Content',
    summary:
      'A demonstration alert explaining how astronauts respond when fast-moving solar particles travel toward Earth and the Moon.',
    scienceFocus:
      'Crews inside spacecraft or lunar habitats move to shielded storm-shelter modules with extra water and polyethylene walls.',
  },
  {
    id: 'demo-aurora-connection',
    category: 'Earth-Sun System',
    title: 'Geomagnetic Aurora Demonstration Note',
    label: 'Demonstration Content',
    summary:
      'An educational sample describing how energized particles from the Sun interact with Earth’s magnetic field to light up polar skies.',
    scienceFocus:
      'Unlike Earth, the Moon lacks a global magnetic shield, so solar wind strikes the lunar regolith directly.',
  },
];

export const FOOTER_TOPICS: Record<FooterTopicInfo['id'], FooterTopicInfo> = {
  'nasa-data-sources': {
    id: 'nasa-data-sources',
    title: 'NASA Data Sources',
    subtitle: 'Official Archives & Educational Modules',
    paragraphs: [
      'The NASA Intelligent Image Explorer connects directly to the official NASA Image and Video Library API (images-api.nasa.gov) to search real mission photography, asset files, and archival metadata.',
      'The Solar Activity Centre and Moon Temperature Explorer use curated educational simulations and demonstration telemetry clearly labeled as non-live educational content.',
    ],
    highlights: [
      'NASA Image and Video Library (live archival search & metadata)',
      'Lunar Reconnaissance Orbiter & Diviner thermal education concepts',
      'Solar Dynamics Observatory & space weather educational summaries',
    ],
  },
  'about-project': {
    id: 'about-project',
    title: 'About Mission: Little Astronaut',
    subtitle: 'Group 3 — NASA Science Centre Initiative',
    paragraphs: [
      'Mission: Little Astronaut introduces children aged 7–12 to real aerospace engineering, planetary science, and space exploration using authentic mission-control clarity instead of cartoonish gimmicks.',
      'This landing interface establishes the core navigation, visual language, and four interactive Science Centre destinations.',
    ],
    highlights: [
      'Designed specifically for curious explorers aged 7–12',
      'Built with realistic space imagery and clear scientific explanations',
      'Modular foundation ready for interactive destination laboratories',
    ],
  },
  'learning-resources': {
    id: 'learning-resources',
    title: 'Learning Resources',
    subtitle: 'Guides for Young Explorers & Educators',
    paragraphs: [
      'Each destination in the Science Centre pairs real mission imagery with approachable, age-appropriate concepts about the Sun, the Moon, and astronaut survival.',
      'Educators and families can explore the four upcoming destination themes together to spark questions about physics, astronomy, and engineering.',
    ],
    highlights: [
      'Solar Activity: Understanding stars, plasma, and space weather',
      'Moon Temperature: Learning how sunlight and shadow shape lunar climates',
      'Space Science Lab: Exploring habitats, shielding, and life support',
    ],
  },
};
