/**
 * Future NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information)
 * service boundary.
 *
 * Step 2 intentionally leaves live API fetching unimplemented. All Space Weather
 * Monitor panels currently render clearly labelled educational demonstration content
 * from src/data/solarActivityData.ts.
 */

export type DonkiEventType = 'FLR' | 'CME' | 'SEP';

export interface DonkiServiceStatus {
  connected: boolean;
  provider: string;
  plannedEndpoints: ReadonlyArray<{
    code: DonkiEventType;
    name: string;
    purpose: string;
  }>;
}

export const NASA_DONKI_SERVICE_STATUS: DonkiServiceStatus = {
  connected: false,
  provider: 'NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information)',
  plannedEndpoints: [
    {
      code: 'FLR',
      name: 'Solar Flare Feed',
      purpose: 'Planned archival & educational summary feed for solar flare observations.',
    },
    {
      code: 'CME',
      name: 'Coronal Mass Ejection Feed',
      purpose: 'Planned educational overview of CME eruptions tracked by space observatories.',
    },
    {
      code: 'SEP',
      name: 'Solar Energetic Particle Feed',
      purpose: 'Planned educational feed for high-energy solar particle events.',
    },
  ],
};
