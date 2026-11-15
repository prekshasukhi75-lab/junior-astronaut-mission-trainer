/**
 * Future NASA Lunar Reconnaissance Orbiter (LRO) / Diviner archival data
 * service boundary.
 *
 * Step 3 intentionally leaves external API fetching unimplemented. All lunar
 * temperature panels in Moon Temperature Explorer display clearly labelled
 * illustrative educational examples from src/data/moonTemperatureData.ts.
 */

export interface LunarDataServiceStatus {
  connected: boolean;
  missionName: string;
  instrumentName: string;
  note: string;
}

export const NASA_LUNAR_DATA_STATUS: LunarDataServiceStatus = {
  connected: false,
  missionName: 'NASA Lunar Reconnaissance Orbiter (LRO)',
  instrumentName: 'Diviner Lunar Radiometer Experiment',
  note: 'Educational simulation mode active. Live or archival dataset queries will be connected in a later step.',
};
