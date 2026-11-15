import type {
  NasaAssetDetails,
  NasaImageItem,
  NasaSearchResponse,
} from '../types/imageExplorer';

const NASA_API_BASE = 'https://images-api.nasa.gov';

export class NasaApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'NasaApiError';
    this.code = code;
  }
}

interface RawNasaLink {
  href?: string;
  rel?: string;
  render?: string;
}

interface RawNasaData {
  nasa_id?: string;
  title?: string;
  description?: string;
  description_508?: string;
  date_created?: string;
  keywords?: string[];
  center?: string;
  photographer?: string;
  media_type?: string;
}

interface RawNasaCollectionItem {
  href?: string;
  data?: RawNasaData[];
  links?: RawNasaLink[];
}

function normalizeHttpUrl(rawUrl: string | undefined): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === 'http:') {
      parsed.protocol = 'https:';
    }
    if (parsed.protocol !== 'https:') return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

export async function searchNasaImages(
  query: string,
  page = 1,
  pageSize = 18
): Promise<NasaSearchResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: '',
      page: 1,
      pageSize,
      totalHits: 0,
      hasNextPage: false,
      hasPrevPage: false,
      items: [],
    };
  }

  const params = new URLSearchParams({
    q: trimmed,
    media_type: 'image',
    page: String(Math.max(1, page)),
    page_size: String(pageSize),
  });

  let response: globalThis.Response;
  try {
    response = await fetch(`${NASA_API_BASE}/search?${params.toString()}`, {
      signal: AbortSignal.timeout(12000),
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      throw new NasaApiError(
        'NASA_TIMEOUT',
        'The NASA Image Library took too long to respond. Please try again.'
      );
    }
    throw new NasaApiError(
      'NASA_NETWORK_ERROR',
      'Could not reach the NASA Image Library. Check your internet connection and try again.'
    );
  }

  if (!response.ok) {
    throw new NasaApiError(
      `NASA_HTTP_${response.status}`,
      'The NASA Image Library is temporarily unavailable. Please try again in a moment.'
    );
  }

  let json: {
    collection?: {
      items?: RawNasaCollectionItem[];
      metadata?: { total_hits?: number };
      links?: Array<{ rel?: string }>;
    };
  };

  try {
    json = await response.json();
  } catch {
    throw new NasaApiError(
      'NASA_INVALID_JSON',
      'Received an unexpected response from the NASA Image Library.'
    );
  }

  const rawItems = Array.isArray(json.collection?.items)
    ? json.collection.items
    : [];

  const seenIds = new Set<string>();
  const items: NasaImageItem[] = [];

  for (const entry of rawItems) {
    const meta = Array.isArray(entry.data) ? entry.data[0] : undefined;
    const nasaId = meta?.nasa_id?.trim();
    if (!nasaId || seenIds.has(nasaId)) continue;

    const links = Array.isArray(entry.links) ? entry.links : [];
    const previewCandidate =
      links.find((l) => l.rel === 'preview' && l.render === 'image')?.href ??
      links.find((l) => l.render === 'image')?.href ??
      links[0]?.href;

    const previewUrl = normalizeHttpUrl(previewCandidate);
    if (!previewUrl) continue;

    seenIds.add(nasaId);

    const rawDesc =
      (typeof meta?.description === 'string' && meta.description.trim()) ||
      (typeof meta?.description_508 === 'string' && meta.description_508.trim()) ||
      'No official NASA description was provided for this archival image.';

    const keywords = Array.isArray(meta?.keywords)
      ? meta.keywords.filter((k): k is string => typeof k === 'string' && k.trim().length > 0)
      : [];

    items.push({
      nasaId,
      title: meta?.title?.trim() || `NASA Archive Image (${nasaId})`,
      description: rawDesc,
      dateCreated: meta?.date_created?.trim() || '',
      keywords,
      center: meta?.center?.trim() || 'NASA Archive',
      photographer: meta?.photographer?.trim() || '',
      previewUrl,
      nasaSourceUrl: `https://images.nasa.gov/details-${encodeURIComponent(nasaId)}`,
    });
  }

  const totalHits =
    typeof json.collection?.metadata?.total_hits === 'number'
      ? json.collection.metadata.total_hits
      : items.length;
  const navLinks = Array.isArray(json.collection?.links)
    ? json.collection.links
    : [];

  return {
    query: trimmed,
    page,
    pageSize,
    totalHits,
    hasNextPage: navLinks.some((l) => l.rel === 'next'),
    hasPrevPage: navLinks.some((l) => l.rel === 'prev') || page > 1,
    items,
  };
}

export async function fetchNasaAssetAndMetadata(
  nasaId: string,
  fallbackPreviewUrl: string
): Promise<NasaAssetDetails> {
  let bestImageUrl = fallbackPreviewUrl;
  let metadataSummary: Record<string, unknown> | null = null;

  const assetPromise = fetch(
    `${NASA_API_BASE}/asset/${encodeURIComponent(nasaId)}`,
    { signal: AbortSignal.timeout(8000) }
  )
    .then(async (res) => {
      if (!res.ok) return null;
      return res.json() as Promise<{
        collection?: { items?: Array<{ href?: string }> };
      }>;
    })
    .catch(() => null);

  const metaPromise = fetch(
    `${NASA_API_BASE}/metadata/${encodeURIComponent(nasaId)}`,
    { signal: AbortSignal.timeout(8000) }
  )
    .then(async (res) => {
      if (!res.ok) return null;
      const pointer = (await res.json()) as { location?: string };
      const locUrl = normalizeHttpUrl(pointer?.location);
      if (!locUrl) return null;
      const metaRes = await fetch(locUrl, { signal: AbortSignal.timeout(6000) });
      if (!metaRes.ok) return null;
      return metaRes.json() as Promise<Record<string, unknown>>;
    })
    .catch(() => null);

  const [assetData, metaData] = await Promise.all([assetPromise, metaPromise]);

  if (assetData?.collection?.items) {
    const hrefs = assetData.collection.items
      .map((i) => normalizeHttpUrl(i.href))
      .filter((url) => /\.(jpg|jpeg|png)(\?|$)/i.test(url));

    const preferred =
      hrefs.find((u) => /~medium\./i.test(u)) ??
      hrefs.find((u) => /~large\./i.test(u)) ??
      hrefs.find((u) => /~orig\./i.test(u)) ??
      hrefs[0];

    if (preferred) {
      bestImageUrl = preferred;
    }
  }

  if (metaData && typeof metaData === 'object') {
    metadataSummary = metaData;
  }

  return {
    bestImageUrl,
    metadataSummary,
  };
}
