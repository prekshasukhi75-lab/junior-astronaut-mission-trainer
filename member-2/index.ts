/**
 * Mission: Little Astronaut - Member 2 Deliverables Package
 * Role: Visual Environment, Illustrated Lunar Outpost & Child-Friendly Info Panels
 */

// Master Environment Orchestrator
export { LunarOutpostEnvironment } from './components/environment/LunarOutpostEnvironment';

// Standalone Outpost Buildings (Delivered separately for modular integration)
export { CrewHabitat } from './components/buildings/CrewHabitat';
export { SolarPanelStation } from './components/buildings/SolarPanelStation';
export { Greenhouse } from './components/buildings/Greenhouse';
export { RadiationShelter } from './components/buildings/RadiationShelter';
export { LunarRover } from './components/buildings/LunarRover';

// Environment & Astronauts
export { AstronautCharacters } from './components/characters/AstronautCharacters';
export { LunarLandscape } from './components/environment/LunarLandscape';
export { EarthBackground } from './components/environment/EarthBackground';

// UI Panels & Audio
export { BuildingInfoPanel } from './components/panels/BuildingInfoPanel';
export { soundEffects } from './components/panels/AudioEffects';

// Educational Content & Types
export { OUTPOST_ELEMENTS } from './data/outpostData';
export type {
  OutpostElementId,
  BuildingInfo,
  MiniTask,
  StatItem,
  BuildingComponentProps,
  LunarOutpostProps
} from './types/outpost';
