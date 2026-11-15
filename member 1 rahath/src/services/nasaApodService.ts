import { FALLBACK_APOD_ITEM } from '../data/spaceScienceLabData';
import type { NasaApodResult } from '../types/spaceLab';

export async function fetchNasaApod(): Promise<NasaApodResult> {
  try {
    const res = await fetch('/api/nasa/apod', {
      signal: AbortSignal.timeout(10000),
    });
    const payload = (await res.json()) as {
      live?: boolean;
      usingDemoKey?: boolean;
      item?: NasaApodResult['item'];
      message?: string;
    };

    if (!res.ok || !payload.live || !payload.item || !payload.item.url) {
      return {
        live: false,
        usingDemoKey: Boolean(payload.usingDemoKey),
        item: FALLBACK_APOD_ITEM,
        notice:
          payload.message ||
          'NASA APOD is temporarily unavailable. Displaying verified educational fallback content.',
      };
    }

    return {
      live: true,
      usingDemoKey: Boolean(payload.usingDemoKey),
      item: payload.item,
    };
  } catch {
    return {
      live: false,
      usingDemoKey: true,
      item: FALLBACK_APOD_ITEM,
      notice:
        'Could not reach the NASA APOD server right now. Displaying verified educational fallback content.',
    };
  }
}
