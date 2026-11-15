import moonHeroImg from '../assets/images/moon_temp_hero_1794648956901.jpg';
import moonDayImg from '../assets/images/moon_day_sunlit_1794648958441.jpg';
import moonNightImg from '../assets/images/moon_night_dark_1794648958461.jpg';
import moonPolarCraterImg from '../assets/images/moon_polar_crater_1794648959576.jpg';
import moonLroImg from '../assets/images/moon_lro_spacecraft_1794648959237.jpg';

export interface MoonExtremeCard {
  index: string;
  title: string;
  description: string;
}

export type LunarRegionId =
  | 'sunlit-surface'
  | 'lunar-night'
  | 'shadowed-crater'
  | 'polar-region';

export interface LunarMapRegion {
  id: LunarRegionId;
  number: string;
  name: string;
  shortLabel: string;
  summary: string;
  whyDifferent: string;
  illustrativeCondition: string;
  thermalScalePercent: number;
  illustrativeLabel: string;
  mapCoords: { cx: number; cy: number };
}

export type DayNightMode = 'day' | 'night';

export interface DayNightCondition {
  mode: DayNightMode;
  title: string;
  imageSrc: string;
  imageAlt: string;
  attribution: string;
  conditionLabel: string;
  explanation: string;
  astronautImpact: string;
  solarPowerNote: string;
}

export type TemperatureZoneChoice =
  | 'direct-sunlight'
  | 'permanent-shadow'
  | 'extreme-cold';

export interface TemperatureGameRound {
  id: string;
  question: string;
  clueTitle: string;
  clueDescription: string;
  visualType: TemperatureZoneChoice;
  correctChoice: TemperatureZoneChoice;
  explanation: string;
}

export type LunarBaseSiteId = 'sunlit-area' | 'shadowed-crater' | 'polar-region';

export interface LunarBaseOption {
  id: LunarBaseSiteId;
  title: string;
  subtitle: string;
  overview: string;
  sunlight: string;
  temperature: string;
  energy: string;
  waterIce: string;
  tradeOffSummary: string;
}

export const MOON_TEMP_MEDIA = {
  hero: {
    src: moonHeroImg,
    alt: 'Astronaut standing beside a sunlit lunar crater rim overlooking deep black shadows inside the crater.',
    attribution: 'Imagery concept: NASA Apollo lunar surface expedition photography',
  },
  day: {
    src: moonDayImg,
    alt: 'Brightly sunlit lunar terrain and astronaut in direct solar illumination under a pitch-black sky.',
    attribution: 'Imagery concept: NASA lunar surface daylight photography',
  },
  night: {
    src: moonNightImg,
    alt: 'Cold, darkened lunar craters dimly lit by blue Earthshine during lunar night.',
    attribution: 'Imagery concept: Lunar night surface illuminated by Earthshine',
  },
  polarCrater: {
    src: moonPolarCraterImg,
    alt: 'Oblique orbital view of a deep lunar polar crater with sunlight grazing the rim and permanent darkness on the floor.',
    attribution: 'Imagery concept: NASA Lunar Reconnaissance Orbiter Camera (LROC) polar crater view',
  },
  lro: {
    src: moonLroImg,
    alt: 'Lunar Reconnaissance Orbiter spacecraft with gold thermal blankets and solar wing flying over cratered lunar terrain.',
    attribution: 'Imagery concept: NASA Lunar Reconnaissance Orbiter (LRO) mission visualization',
  },
};

export const HERO_MISSION_LABELS = [
  'Lunar Day-Night Cycle: ~29.5 Earth Days',
  'Atmosphere: Virtually None (Exosphere)',
  'Target Group: Explorers Ages 7–12',
];

export const WHY_EXTREME_CARDS: MoonExtremeCard[] = [
  {
    index: '01',
    title: 'Almost No Atmosphere',
    description:
      'Earth’s air acts like a cozy blanket that spreads warmth around the globe and blocks harsh sunlight. The Moon has almost no air, so heat cannot move smoothly from sunny areas to dark areas.',
  },
  {
    index: '02',
    title: 'Blistering Direct Sunlight',
    description:
      'Without clouds or thick air overhead, sunlight strikes lunar rock and dust at full strength for roughly two Earth weeks at a time, heating sunlit ground to scorching levels.',
  },
  {
    index: '03',
    title: 'Long, Freezing Lunar Nights',
    description:
      'Once the Sun sets on the Moon, darkness lasts for about 14 Earth days. With no atmosphere to trap daytime warmth, heat escapes quickly into space and the surface plunges into deep cold.',
  },
  {
    index: '04',
    title: 'Shadows Change Everything',
    description:
      'Even right next to a bright sunlit boulder or crater rim, a deep shadow receives zero direct sunlight. Stepping a few meters from sunlight into shade creates a dramatic temperature drop.',
  },
];

export const LUNAR_MAP_REGIONS: LunarMapRegion[] = [
  {
    id: 'sunlit-surface',
    number: '01',
    name: 'Sunlit Lunar Surface',
    shortLabel: 'Sunlit Surface',
    summary:
      'Open plains and crater rims facing the Sun during the two-week lunar daytime.',
    whyDifferent:
      'With no clouds or air to filter sunlight, solar energy strikes the dark grey regolith directly for days without interruption.',
    illustrativeCondition: 'Very Hot Daytime Heating',
    thermalScalePercent: 92,
    illustrativeLabel: 'Illustrative Example · Strong Daytime Heat',
    mapCoords: { cx: 120, cy: 165 },
  },
  {
    id: 'lunar-night',
    number: '02',
    name: 'Dark Lunar Night Region',
    shortLabel: 'Lunar Night Region',
    summary:
      'The half of the Moon turned away from the Sun during its ~14-Earth-day night.',
    whyDifferent:
      'Because there is no insulating atmosphere to hold warmth near the ground, heat radiates straight out into cold space once sunlight disappears.',
    illustrativeCondition: 'Severe Nighttime Cold',
    thermalScalePercent: 22,
    illustrativeLabel: 'Illustrative Example · Deep Night Freeze',
    mapCoords: { cx: 255, cy: 170 },
  },
  {
    id: 'shadowed-crater',
    number: '03',
    name: 'Permanently Shadowed Polar Crater',
    shortLabel: 'Shadowed Polar Crater',
    summary:
      'Deep crater floors near the Moon’s North and South Poles that sunlight never reaches.',
    whyDifferent:
      'Sunlight arrives at a very low sideways angle near the poles, so tall crater rims block the Sun forever, trapping extreme cold for billions of years.',
    illustrativeCondition: 'Extreme Permanent Cold',
    thermalScalePercent: 8,
    illustrativeLabel: 'Illustrative Example · Coldest Lunar Trap',
    mapCoords: { cx: 185, cy: 272 },
  },
  {
    id: 'polar-region',
    number: '04',
    name: 'Lunar Polar Region',
    shortLabel: 'Lunar Polar Region',
    summary:
      'Highlands and crater rims near the poles where the Sun skims low along the horizon.',
    whyDifferent:
      'Elevated polar ridges can catch extended sunlight for solar power while sitting right next to permanently shadowed craters that may hold water ice.',
    illustrativeCondition: 'Moderate Polar Sunlight & Sharp Shadows',
    thermalScalePercent: 52,
    illustrativeLabel: 'Illustrative Example · Mixed Light & Shade',
    mapCoords: { cx: 182, cy: 76 },
  },
];

export const DAY_VS_NIGHT_DATA: Record<DayNightMode, DayNightCondition> = {
  day: {
    mode: 'day',
    title: 'Moon in Sunlight (Lunar Day)',
    imageSrc: MOON_TEMP_MEDIA.day.src,
    imageAlt: MOON_TEMP_MEDIA.day.alt,
    attribution: MOON_TEMP_MEDIA.day.attribution,
    conditionLabel: 'Roughly 14 Earth Days of Continuous Sunlight',
    explanation:
      'During lunar day, the Sun shines relentlessly onto airless rock and dust. Without clouds or air currents to carry heat away, exposed surfaces become intensely hot—hotter than boiling water at Earth’s equator at lunar noon.',
    astronautImpact:
      'Spacesuits use reflective white outer layers and water-cooled inner garments to keep astronauts comfortable while working in bright sunlight.',
    solarPowerNote:
      'Solar panels generate abundant electricity throughout the long lunar day.',
  },
  night: {
    mode: 'night',
    title: 'Moon in Darkness (Lunar Night)',
    imageSrc: MOON_TEMP_MEDIA.night.src,
    imageAlt: MOON_TEMP_MEDIA.night.alt,
    attribution: MOON_TEMP_MEDIA.night.attribution,
    conditionLabel: 'Roughly 14 Earth Days of Continuous Darkness',
    explanation:
      'During lunar night, the Sun disappears below the horizon for two Earth weeks. Because the Moon has no insulating blanket of air, stored heat escapes into space and the ground grows far colder than Antarctica’s winter.',
    astronautImpact:
      'Spacecraft, rovers, and habitats need thick multi-layer gold thermal insulation and internal heaters so electronics and batteries do not freeze.',
    solarPowerNote:
      'Solar panels produce zero power in the dark, so crews must rely on stored batteries or other power systems.',
  },
};

export const POLAR_CRATER_TOPICS = [
  {
    title: 'What Are Permanently Shadowed Regions?',
    body: 'Permanently shadowed regions (PSRs) are deep crater floors and basins near the Moon’s North and South Poles where direct rays from the Sun never shine.',
  },
  {
    title: 'Why Sunlight Never Reaches Some Floors',
    body: 'Unlike Earth, which tilts about 23.5 degrees, the Moon’s spin axis tilts only about 1.5 degrees. Because of that tiny tilt, sunlight glides almost sideways across the poles—so tall crater walls cast permanent shadows.',
  },
  {
    title: 'Why Scientists Study These Dark Craters',
    body: 'These ultra-cold regions act like natural space freezers. Studying them helps scientists learn how water and ancient icy molecules arrived in the inner solar system billions of years ago.',
  },
  {
    title: 'Why Water Ice May Exist There',
    body: 'In normal sunlit places on the Moon, ice would quickly turn to gas and float away into space. Inside permanently shadowed craters, extreme cold can lock water ice inside the soil for ages—a vital resource for future astronauts.',
  },
];

export const TEMPERATURE_GAME_ROUNDS: TemperatureGameRound[] = [
  {
    id: 'zone-round-1',
    question: 'Which lunar area receives direct, unfiltered sunlight for days at a time?',
    clueTitle: 'Location Clue A · Brightly Lit Crater Plain',
    clueDescription:
      'No clouds or atmosphere block the Sun above this flat equatorial plain. Solar panels work at full power, and rock surfaces heat up intensely.',
    visualType: 'direct-sunlight',
    correctChoice: 'direct-sunlight',
    explanation:
      'Correct! The sunlit lunar surface receives direct solar energy without any atmospheric filter, causing strong daytime heating.',
  },
  {
    id: 'zone-round-2',
    question: 'Which lunar area remains in permanent shadow year-round?',
    clueTitle: 'Location Clue B · Deep Polar Crater Bowl',
    clueDescription:
      'Located near the Moon’s South Pole, this deep crater floor sits behind tall rocky rims. Because the Moon barely tilts, sunlight only grazes the top rim and never reaches the bottom.',
    visualType: 'permanent-shadow',
    correctChoice: 'permanent-shadow',
    explanation:
      'Correct! Tall crater walls near the poles block low-angle sunlight forever, creating a permanently shadowed region where water ice can stay frozen.',
  },
  {
    id: 'zone-round-3',
    question: 'Which lunar area experiences extreme cold across open ground during darkness?',
    clueTitle: 'Location Clue C · Two-Week Lunar Night Side',
    clueDescription:
      'The Sun set here days ago, and only faint blue Earthshine lights the craters. With no blanket of air to trap daytime warmth, heat escapes quickly into space.',
    visualType: 'extreme-cold',
    correctChoice: 'extreme-cold',
    explanation:
      'Correct! Without an atmosphere to hold warmth, the dark lunar night side loses heat rapidly and becomes extraordinarily cold.',
  },
];

export const LUNAR_BASE_OPTIONS: LunarBaseOption[] = [
  {
    id: 'sunlit-area',
    title: 'A Sunlit Lunar Area (Equatorial Plain)',
    subtitle: 'Flat open terrain with long, bright daytime windows',
    overview:
      'Building on an open equatorial plain makes landing and driving rovers easier, but your crew must survive massive swings between two weeks of blazing sunlight and two weeks of freezing night.',
    sunlight: 'Bright overhead sunlight for ~14 Earth days, followed by ~14 days of total darkness.',
    temperature: 'Extreme day-to-night swings require strong cooling by day and heavy heating by night.',
    energy: 'High solar power during the day, but huge batteries are needed to survive the 14-day night.',
    waterIce: 'No surface water ice can survive the intense daytime heat here.',
    tradeOffSummary:
      'Trade-off: Easy flat terrain and strong daytime solar power, balanced against a harsh 14-day dark freeze and no nearby ice.',
  },
  {
    id: 'shadowed-crater',
    title: 'A Permanently Shadowed Crater',
    subtitle: 'Deep polar crater floor in eternal darkness',
    overview:
      'Placing a base right inside a permanently shadowed crater puts astronauts near possible water-ice deposits, but living in total darkness and extreme cold creates serious engineering hurdles.',
    sunlight: 'Zero direct sunlight ever reaches the crater floor.',
    temperature: 'Relentless extreme cold can make rover wheels, seals, and electronics brittle.',
    energy: 'Solar panels cannot generate power here; energy would have to be beamed or cabled in from outside.',
    waterIce: 'Best chance of finding ancient water ice locked in lunar soil.',
    tradeOffSummary:
      'Trade-off: Closest access to potential water ice, balanced against extreme cold, steep crater slopes, and zero sunlight for solar energy.',
  },
  {
    id: 'polar-region',
    title: 'A Lunar Polar Region (Sunlit Crater Rim)',
    subtitle: 'High ridge near the South Pole bordering shadowed craters',
    overview:
      'Many mission planners study sunlit ridges near the lunar South Pole because they sit close to both extended sunlight and icy shadowed craters—yet they still bring real engineering challenges.',
    sunlight: 'Low-angle sunlight stays visible for long stretches, though nearby peaks still cast long moving shadows.',
    temperature: 'Still very cold in shaded spots, with sharp contrasts between sunny ridges and dark valleys.',
    energy: 'Vertical solar towers on high ridges can capture sunlight most of the time, reducing dark-period gaps.',
    waterIce: 'No ice on the sunlit ridge itself, so rovers must travel carefully down into nearby shadowed craters.',
    tradeOffSummary:
      'Trade-off: Balanced access to sunlight and nearby ice, but rugged terrain, long low shadows, and tricky communications with Earth.',
  },
];

export const NASA_SCIENCE_CORNER_ITEMS = [
  {
    title: 'Lunar Reconnaissance Orbiter (LRO)',
    description:
      'Launched by NASA in 2009, LRO circles the Moon from pole to pole, taking detailed photographs and scientific measurements to map safe landing zones and lunar resources.',
  },
  {
    title: 'Diviner Lunar Radiometer Experiment',
    description:
      'Mounted aboard LRO, Diviner acts like an orbital infrared thermometer—measuring invisible heat glowing off the Moon’s surface to create detailed day and night temperature maps.',
  },
  {
    title: 'Why Historical Observations Matter',
    description:
      'Years of LRO and Diviner archival maps help engineers design habitats that withstand thermal swings, pick Artemis polar exploration sites, and locate cold traps where water ice can survive.',
  },
];
