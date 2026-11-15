import spaceLabHeroImg from '../assets/images/card_space_science_lab_1794648139815.jpg';
import moonCraterRefImg from '../assets/images/moon_polar_crater_1794648959576.jpg';
import solarRefImg from '../assets/images/solar_hero_sun_1794648516970.jpg';
import type {
  LabExperimentDefinition,
  NasaApodItem,
  PlanetLabProfile,
} from '../types/spaceLab';

export const SPACE_LAB_MEDIA = {
  hero: {
    src: spaceLabHeroImg,
    alt: 'Astronauts inspecting scientific instruments beside a lunar research habitat with solar arrays.',
  },
  fallbackApod: {
    src: solarRefImg,
    alt: 'Extreme ultraviolet view of solar loops and magnetic activity on the Sun.',
  },
  craterFallback: {
    src: moonCraterRefImg,
    alt: 'Deeply cratered lunar polar surface showing sharp shadows.',
  },
};

export const PLANET_LAB_PROFILES: PlanetLabProfile[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    orderFromSun: 1,
    gravityMs2: 3.7,
    diameterKm: 4879,
    distanceMillionKm: 57.9,
    distanceAU: 0.39,
    orbitalPeriodLabel: '88 Earth days',
    moonsCount: 0,
    colorHex: '#94A3B8',
    accentHex: '#CBD5E1',
    relativeRadiusPx: 7,
    orbitSpeedMultiplier: 2.2,
    gravityReason:
      'Mercury is the smallest planet with much less mass than Earth, so its surface pull is only about 38% of Earth’s gravity.',
    quickFact:
      'Mercury races around the Sun faster than any other planet, completing a full year in just 88 Earth days!',
  },
  {
    id: 'venus',
    name: 'Venus',
    orderFromSun: 2,
    gravityMs2: 8.87,
    diameterKm: 12104,
    distanceMillionKm: 108.2,
    distanceAU: 0.72,
    orbitalPeriodLabel: '225 Earth days',
    moonsCount: 0,
    colorHex: '#F59E0B',
    accentHex: '#FDE68A',
    relativeRadiusPx: 10,
    orbitSpeedMultiplier: 1.6,
    gravityReason:
      'Venus is nearly the same size and mass as Earth, which gives it a surface gravity about 90% as strong as Earth’s.',
    quickFact:
      'Venus spins backward compared to most planets, so on Venus the Sun rises in the west and sets in the east.',
  },
  {
    id: 'earth',
    name: 'Earth',
    orderFromSun: 3,
    gravityMs2: 9.81,
    diameterKm: 12742,
    distanceMillionKm: 149.6,
    distanceAU: 1.0,
    orbitalPeriodLabel: '365.25 days',
    moonsCount: 1,
    colorHex: '#0EA5E9',
    accentHex: '#38BDF8',
    relativeRadiusPx: 11,
    orbitSpeedMultiplier: 1.25,
    gravityReason:
      'Earth’s mass and radius produce our familiar 9.81 m/s² downward acceleration—our baseline for comparing every other world.',
    quickFact:
      'Earth is the only known planet with liquid water oceans on its surface and a breathable nitrogen-oxygen atmosphere.',
  },
  {
    id: 'mars',
    name: 'Mars',
    orderFromSun: 4,
    gravityMs2: 3.71,
    diameterKm: 6779,
    distanceMillionKm: 227.9,
    distanceAU: 1.52,
    orbitalPeriodLabel: '687 Earth days',
    moonsCount: 2,
    colorHex: '#E03C31',
    accentHex: '#FCA5A5',
    relativeRadiusPx: 8,
    orbitSpeedMultiplier: 0.95,
    gravityReason:
      'Mars has about half Earth’s diameter and only about 11% of Earth’s mass, so objects fall noticeably slower there.',
    quickFact:
      'Olympus Mons on Mars is the tallest volcano in the solar system—nearly three times the height of Mount Everest!',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    orderFromSun: 5,
    gravityMs2: 24.79,
    diameterKm: 139820,
    distanceMillionKm: 778.5,
    distanceAU: 5.2,
    orbitalPeriodLabel: '11.86 Earth years',
    moonsCount: 95,
    colorHex: '#D97706',
    accentHex: '#FDBA74',
    relativeRadiusPx: 20,
    orbitSpeedMultiplier: 0.55,
    gravityReason:
      'Jupiter is the largest and most massive planet in our solar system (318 times Earth’s mass!), creating powerful gravity over 2.5× Earth’s.',
    quickFact:
      'Jupiter’s Great Red Spot is a giant spinning storm wider than our entire planet Earth.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    orderFromSun: 6,
    gravityMs2: 10.44,
    diameterKm: 116460,
    distanceMillionKm: 1434,
    distanceAU: 9.58,
    orbitalPeriodLabel: '29.45 Earth years',
    moonsCount: 146,
    colorHex: '#EAB308',
    accentHex: '#FEF08A',
    relativeRadiusPx: 17,
    orbitSpeedMultiplier: 0.38,
    hasRings: true,
    gravityReason:
      'Even though Saturn is huge (95× Earth’s mass), it is very spread out and fluffy, so its cloud-top gravity is only slightly stronger than Earth’s!',
    quickFact:
      'Saturn’s dazzling rings stretch hundreds of thousands of kilometers wide yet can be thinner than a football field.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    orderFromSun: 7,
    gravityMs2: 8.69,
    diameterKm: 50724,
    distanceMillionKm: 2871,
    distanceAU: 19.2,
    orbitalPeriodLabel: '84 Earth years',
    moonsCount: 28,
    colorHex: '#22D3EE',
    accentHex: '#A5F3FC',
    relativeRadiusPx: 13,
    orbitSpeedMultiplier: 0.24,
    gravityReason:
      'Uranus is an ice giant whose low density and large radius give it cloud-top gravity slightly weaker than Earth’s.',
    quickFact:
      'Uranus is tilted almost completely sideways, so it rolls around the Sun like a spinning barrel.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    orderFromSun: 8,
    gravityMs2: 11.15,
    diameterKm: 49244,
    distanceMillionKm: 4495,
    distanceAU: 30.1,
    orbitalPeriodLabel: '164.8 Earth years',
    moonsCount: 16,
    colorHex: '#2563EB',
    accentHex: '#93C5FD',
    relativeRadiusPx: 13,
    orbitSpeedMultiplier: 0.16,
    gravityReason:
      'Neptune is slightly smaller than Uranus but denser and more massive, producing gravity a bit stronger than Earth’s.',
    quickFact:
      'Supersonic winds on Neptune blow faster than 2,000 kilometers per hour across its deep blue clouds.',
  },
];

export const GRAVITY_LAB_PLANETS: PlanetLabProfile[] = PLANET_LAB_PROFILES.filter(
  (p) =>
    p.id === 'mercury' ||
    p.id === 'venus' ||
    p.id === 'earth' ||
    p.id === 'mars' ||
    p.id === 'jupiter' ||
    p.id === 'saturn'
);

export const LAB_EXPERIMENTS: LabExperimentDefinition[] = [
  {
    id: 'planet-gravity',
    stationNumber: 'Station 01',
    title: 'PLANET GRAVITY LAB',
    shortTitle: 'Planet Gravity',
    tagline: 'Drop test gear on six worlds to measure how gravity changes falling speed.',
    discipline: 'Planetary Physics',
    badgeTitle: 'Gravity Investigator',
    pointsReward: 100,
    whatWeLearn:
      'How gravity pulls objects toward a planet’s center and why falling speed changes on different worlds.',
    scientificConcept:
      'Every object with mass pulls on other objects—that pull is gravity! Bigger, heavier planets pull harder, while smaller planets pull more gently. Gravity acceleration is measured in meters per second squared (m/s²).',
    instructions: [
      'Choose any planet from Mercury, Venus, Earth, Mars, Jupiter, or Saturn.',
      'Select a test object (Moon Rock, Astronaut Boot, or Rover Wheel) and optionally turn on Earth Side-by-Side Comparison.',
      'Press Drop Object to watch real gravitational acceleration pull the object 20 meters down and compare its fall time.',
    ],
    observationGuidance:
      'Notice how fast the object reaches the ground on Jupiter (24.79 m/s²) compared to Mercury (3.70 m/s²) or Mars (3.71 m/s²).',
    didYouKnow:
      'Because gravity depends on both a planet’s mass AND its size, Saturn is 95 times heavier than Earth yet its cloud-top gravity (10.44 m/s²) is barely stronger than Earth’s (9.81 m/s²)!',
    didYouKnowSource: 'NASA Solar System Exploration · Planetary Fact Sheets',
    quiz: [
      {
        id: 'pg-q1',
        question: 'On which of these planets would a dropped rock hit the ground fastest?',
        options: ['Mars (3.71 m/s²)', 'Earth (9.81 m/s²)', 'Jupiter (24.79 m/s²)'],
        correctIndex: 2,
        explanation:
          'Jupiter has the strongest gravity of the six worlds (24.79 m/s²), so objects speed up and fall fastest there.',
      },
      {
        id: 'pg-q2',
        question: 'Why does Mars have weaker gravity than Earth?',
        options: [
          'Mars is red and rocky',
          'Mars has much less mass than Earth',
          'Mars has two small moons',
        ],
        correctIndex: 1,
        explanation:
          'Gravity depends strongly on mass—Mars has only about 11% of Earth’s mass, so its pull is weaker.',
      },
      {
        id: 'pg-q3',
        question: 'What unit do NASA scientists use to measure gravitational acceleration?',
        options: ['m/s² (meters per second squared)', 'Kilograms', 'Light-years'],
        correctIndex: 0,
        explanation:
          'Gravitational acceleration is measured in m/s², showing how much speed an object gains each second as it falls.',
      },
    ],
  },
  {
    id: 'solar-system',
    stationNumber: 'Station 02',
    title: 'SOLAR SYSTEM BUILDER',
    shortTitle: 'Solar System Builder',
    tagline: 'Assemble all eight planets around the Sun and inspect their orbits and NASA facts.',
    discipline: 'Orbital Mechanics',
    badgeTitle: 'Solar System Architect',
    pointsReward: 100,
    whatWeLearn:
      'The real order of the eight planets from the Sun, how distance affects orbital speed, and key facts about each world.',
    scientificConcept:
      'The Sun’s gravity holds all eight planets in orbit. Planets closer to the Sun feel stronger solar gravity and travel along shorter tracks, so they complete an orbit (their year) much faster than distant outer planets.',
    instructions: [
      'Click any orbiting planet in the simulation—or select it from the dock—to inspect its real diameter, distance, moons, and year length.',
      'Toggle planets on or off to build custom solar system arrangements, or switch to Planet Order Challenge to arrange the 8 planets from closest to farthest.',
      'Use Play, Pause, and Speed buttons to watch inner planets lap outer planets around the Sun.',
    ],
    observationGuidance:
      'Watch Mercury finish multiple laps around the Sun before Saturn or Neptune barely moves a fraction of an orbit!',
    didYouKnow:
      'Neptune takes 164.8 Earth years to orbit the Sun just once! Since its discovery in 1846, Neptune completed its very first full orbit in 2011.',
    didYouKnowSource: 'NASA Solar System Exploration · Planet Orbits',
    quiz: [
      {
        id: 'ss-q1',
        question: 'Which planet orbits closest to the Sun and has the shortest year?',
        options: ['Venus', 'Mercury', 'Mars'],
        correctIndex: 1,
        explanation:
          'Mercury is the innermost planet (0.39 AU from the Sun) and takes only 88 Earth days per orbit.',
      },
      {
        id: 'ss-q2',
        question: 'What happens to a planet’s orbital period as it gets farther from the Sun?',
        options: [
          'Its year gets much longer',
          'Its year gets shorter',
          'It stops orbiting',
        ],
        correctIndex: 0,
        explanation:
          'Farther planets travel much bigger orbital paths at slower speeds, so their years take far longer.',
      },
      {
        id: 'ss-q3',
        question: 'Which two planets are the gas giants in our solar system?',
        options: ['Earth and Mars', 'Jupiter and Saturn', 'Mercury and Venus'],
        correctIndex: 1,
        explanation:
          'Jupiter and Saturn are the massive hydrogen-and-helium gas giants; Uranus and Neptune are ice giants.',
      },
    ],
  },
  {
    id: 'moon-crater',
    stationNumber: 'Station 03',
    title: 'MOON CRATER EXPERIMENT',
    shortTitle: 'Moon Craters',
    tagline: 'Launch meteorites onto lunar regolith and measure how size and speed sculpt craters.',
    discipline: 'Impact Geology',
    badgeTitle: 'Crater Geologist',
    pointsReward: 100,
    whatWeLearn:
      'How meteorites carve impact craters on the Moon and why size and impact speed change crater width and depth.',
    scientificConcept:
      'Because the Moon has almost no air, space rocks do not burn up as shooting stars before hitting the ground. When a fast meteorite strikes, its kinetic energy explodes outward, blasting rock into a bowl-shaped crater with bright ejecta rays.',
    instructions: [
      'Pick a meteorite size (1 m Pebble, 10 m Boulder, or 50 m Asteroid).',
      'Adjust the Impact Speed slider between 10 km/s and 70 km/s.',
      'Click Drop Meteorite to watch the impact, examine the new crater in the Moon surface, and compare results in the Impact Log.',
    ],
    observationGuidance:
      'Try dropping the same size rock at 15 km/s and then at 65 km/s—high speed creates a dramatically wider crater!',
    didYouKnow:
      'Unlike Earth, the Moon has no rain, wind, or plate tectonics to erase craters—so an impact crater formed billions of years ago can still look sharp today.',
    didYouKnowSource: 'NASA Lunar Reconnaissance Orbiter (LRO) · Impact Studies',
    quiz: [
      {
        id: 'mc-q1',
        question: 'Why does the Moon have so many visible craters compared to Earth?',
        options: [
          'The Moon has no thick air to burn up small meteors and no weather to erode craters',
          'Astronauts dig them with rovers',
          'The Moon is made of soft ice',
        ],
        correctIndex: 0,
        explanation:
          'Without air friction or wind and rain erosion, meteors hit directly and their craters last for billions of years.',
      },
      {
        id: 'mc-q2',
        question: 'If two meteorites have the same size, which one makes a bigger crater?',
        options: [
          'The slower meteorite',
          'The faster meteorite',
          'They always make identical craters',
        ],
        correctIndex: 1,
        explanation:
          'Faster meteorites carry much more kinetic energy, blasting out wider and deeper craters.',
      },
      {
        id: 'mc-q3',
        question: 'What are the bright streaks radiating outward from fresh lunar craters?',
        options: ['Rivers of water', 'Ejecta rays of blasted lunar rock and dust', 'Clouds'],
        correctIndex: 1,
        explanation:
          'Impacts throw bright crushed rock—called ejecta—far across the surrounding lunar terrain.',
      },
    ],
  },
  {
    id: 'rocket-science',
    stationNumber: 'Station 04',
    title: 'ROCKET SCIENCE LAB',
    shortTitle: 'Rocket Science',
    tagline: 'Balance fuel, thrust, and gravity to launch a rocket past the Kármán Line into space.',
    discipline: 'Aerospace Propulsion',
    badgeTitle: 'Propulsion Engineer',
    pointsReward: 100,
    whatWeLearn:
      'How Newton’s Third Law produces rocket thrust and how thrust must beat gravity to reach space.',
    scientificConcept:
      'Newton’s Third Law says every action has an equal and opposite reaction. Rocket engines blast super-hot exhaust gas downward (action), which pushes the rocket upward (reaction). To lift off, upward thrust must be stronger than downward gravity!',
    instructions: [
      'Set the Fuel Level (%) and Engine Thrust (%) sliders before ignition.',
      'Observe the live Thrust-to-Weight indicator: Thrust must exceed Gravity for liftoff!',
      'Press Launch Rocket to fire the engines, track altitude up past 100 km (the Kármán Line), and test how fuel vs. thrust affects peak altitude.',
    ],
    observationGuidance:
      'Try launching with 40% thrust vs. 95% thrust—see why low thrust cannot overcome gravity, while balanced high thrust and fuel reach space!',
    didYouKnow:
      'NASA’s Space Launch System (SLS) rocket burns over 3 million liters of super-cold liquid fuel and oxidizer to lift Artemis missions off Earth!',
    didYouKnowSource: 'NASA Artemis & Space Launch System Education',
    quiz: [
      {
        id: 'rs-q1',
        question: 'Which scientific law explains how pushing exhaust downward pushes a rocket upward?',
        options: [
          'Newton’s Third Law (Action and Reaction)',
          'The Law of Shadows',
          'The Water Cycle',
        ],
        correctIndex: 0,
        explanation:
          'Newton’s Third Law explains rocket propulsion: pushing exhaust gas down creates an equal upward push on the rocket.',
      },
      {
        id: 'rs-q2',
        question: 'What must be true for a rocket to lift off the launchpad?',
        options: [
          'Gravity must be stronger than thrust',
          'Upward thrust must be greater than downward gravity',
          'The fuel tank must be empty',
        ],
        correctIndex: 1,
        explanation:
          'When upward thrust beats the rocket’s weight (gravity), net force is upward and the rocket accelerates skyward.',
      },
      {
        id: 'rs-q3',
        question: 'Around what altitude is the Kármán Line, commonly recognized as the boundary of space?',
        options: ['10 km', '100 km', '1,000,000 km'],
        correctIndex: 1,
        explanation:
          'The Kármán Line sits 100 kilometers above Earth’s surface, where Earth’s atmosphere becomes extremely thin.',
      },
    ],
  },
  {
    id: 'light-space',
    stationNumber: 'Station 05',
    title: 'LIGHT AND SPACE LAB',
    shortTitle: 'Light & Space',
    tagline: 'Aim sunlight across Earth and the Moon to create eclipses and see why space looks dark.',
    discipline: 'Optics & Astronomy',
    badgeTitle: 'Optics Explorer',
    pointsReward: 100,
    whatWeLearn:
      'How sunlight travels in straight lines through space, how solar and lunar eclipses happen, and why outer space appears black.',
    scientificConcept:
      'Light from the Sun travels through empty space in straight rays at nearly 300,000 km per second. Because space is a near-empty vacuum with very few air molecules to scatter light sideways, space looks black until sunlight bounces off a planet, moon, or astronaut!',
    instructions: [
      'Drag the Moon Orbit Position slider (or click a preset alignment button) to move the Moon around Earth.',
      'Watch what happens when the Moon blocks sunlight from hitting Earth (Solar Eclipse) or enters Earth’s shadow (Lunar Eclipse).',
      'Toggle Space Vacuum vs. Earth Air to see why a flashlight or sunlight beam makes Earth’s sky blue while deep space stays dark.',
    ],
    observationGuidance:
      'Align the Moon at 0° (between Sun and Earth) for a Solar Eclipse, and at 180° (behind Earth) for a Lunar Eclipse!',
    didYouKnow:
      'Sunlight takes about 8 minutes and 20 seconds to travel 150 million kilometers from the Sun to Earth—even at the speed of light!',
    didYouKnowSource: 'NASA Science · Sun-Earth Light & Eclipses',
    quiz: [
      {
        id: 'ls-q1',
        question: 'Why does outer space look black even though the Sun shines brightly?',
        options: [
          'The Sun turns off at night',
          'Space has almost no air or dust to scatter sunlight toward our eyes',
          'Black holes absorb all sunlight near Earth',
        ],
        correctIndex: 1,
        explanation:
          'On Earth, air scatters blue sunlight everywhere. In empty space, light passes straight by unseen unless it hits an object like the Moon or Earth.',
      },
      {
        id: 'ls-q2',
        question: 'What happens during a Solar Eclipse?',
        options: [
          'The Moon moves directly between the Sun and Earth, casting a shadow on Earth',
          'Earth moves between the Sun and Moon',
          'The Moon disappears forever',
        ],
        correctIndex: 0,
        explanation:
          'During a solar eclipse, the Moon lines up between the Sun and Earth and blocks sunlight from a strip of Earth’s surface.',
      },
      {
        id: 'ls-q3',
        question: 'During a Lunar Eclipse, what casts a shadow onto the Moon?',
        options: ['Jupiter', 'Earth', 'Mars'],
        correctIndex: 1,
        explanation:
          'In a lunar eclipse, Earth sits directly between the Sun and the Moon, casting Earth’s shadow across the Moon.',
      },
    ],
  },
];

export const FALLBACK_APOD_ITEM: NasaApodItem = {
  title: 'Solar Loops and Active Regions (Educational Spotlight)',
  date: 'Verified Fallback Entry',
  explanation:
    'NASA’s Astronomy Picture of the Day (APOD) shares real space telescope views and planetary science stories every day. When the public APOD endpoint is busy or rate-limited, our Space Science Lab displays this verified educational entry so you can keep exploring without interruption.',
  url: solarRefImg,
  mediaType: 'image',
  copyright: 'Mission: Little Astronaut Educational Archive',
  apodPageUrl: 'https://apod.nasa.gov/apod/astropix.html',
};
