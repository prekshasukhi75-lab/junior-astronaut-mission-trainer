export type LabExperimentId =
  | 'planet-gravity'
  | 'solar-system'
  | 'moon-crater'
  | 'rocket-science'
  | 'light-space';

export interface LabQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LabExperimentDefinition {
  id: LabExperimentId;
  stationNumber: string;
  title: string;
  shortTitle: string;
  tagline: string;
  discipline: string;
  badgeTitle: string;
  pointsReward: number;
  whatWeLearn: string;
  scientificConcept: string;
  instructions: string[];
  observationGuidance: string;
  didYouKnow: string;
  didYouKnowSource: string;
  quiz: LabQuizQuestion[];
}

export interface PlanetLabProfile {
  id:
    | 'mercury'
    | 'venus'
    | 'earth'
    | 'mars'
    | 'jupiter'
    | 'saturn'
    | 'uranus'
    | 'neptune';
  name: string;
  orderFromSun: number;
  gravityMs2: number;
  diameterKm: number;
  distanceMillionKm: number;
  distanceAU: number;
  orbitalPeriodLabel: string;
  moonsCount: number;
  colorHex: string;
  accentHex: string;
  relativeRadiusPx: number;
  orbitSpeedMultiplier: number;
  hasRings?: boolean;
  gravityReason: string;
  quickFact: string;
}

export interface LabProgressState {
  completedIds: LabExperimentId[];
  quizScores: Partial<Record<LabExperimentId, number>>;
  totalPoints: number;
  lastUpdatedAt: string | null;
}

export interface NasaApodItem {
  title: string;
  date: string;
  explanation: string;
  url: string;
  mediaType: string;
  copyright?: string;
  apodPageUrl: string;
}

export interface NasaApodResult {
  live: boolean;
  usingDemoKey: boolean;
  item: NasaApodItem;
  notice?: string;
}
