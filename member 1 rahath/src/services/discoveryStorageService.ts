import type { NasaImageItem, SavedDiscoveryItem } from '../types/imageExplorer';

const SEARCH_HISTORY_KEY = 'mla_explorer_search_history_v1';
const SAVED_DISCOVERIES_KEY = 'mla_explorer_saved_discoveries_v1';
const EXPLORED_KEYS_STORAGE = 'mla_explorer_discovered_components_v1';
const LEARNING_POINTS_KEY = 'mla_explorer_learning_points_v1';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or sandboxed iframe storage restrictions
  }
}

export function getSearchHistory(): string[] {
  const list = readJson<unknown>(SEARCH_HISTORY_KEY, []);
  if (!Array.isArray(list)) return [];
  return list.filter((item): item is string => typeof item === 'string').slice(0, 8);
}

export function addSearchHistoryTerm(term: string): string[] {
  const clean = term.trim();
  if (!clean) return getSearchHistory();
  const current = getSearchHistory().filter(
    (item) => item.toLowerCase() !== clean.toLowerCase()
  );
  const updated = [clean, ...current].slice(0, 8);
  writeJson(SEARCH_HISTORY_KEY, updated);
  return updated;
}

export function getSavedDiscoveries(): SavedDiscoveryItem[] {
  const list = readJson<unknown>(SAVED_DISCOVERIES_KEY, []);
  if (!Array.isArray(list)) return [];
  return list.filter(
    (item): item is SavedDiscoveryItem =>
      Boolean(item && typeof item === 'object' && 'nasaId' in item)
  );
}

export function toggleSaveDiscovery(
  image: NasaImageItem,
  discoveredComponentNames: string[]
): {
  discoveries: SavedDiscoveryItem[];
  isSaved: boolean;
  pointsAwarded: number;
} {
  const existing = getSavedDiscoveries();
  const alreadySaved = existing.some((item) => item.nasaId === image.nasaId);

  if (alreadySaved) {
    const updated = existing.filter((item) => item.nasaId !== image.nasaId);
    writeJson(SAVED_DISCOVERIES_KEY, updated);
    return { discoveries: updated, isSaved: false, pointsAwarded: 0 };
  }

  const nextItem: SavedDiscoveryItem = {
    nasaId: image.nasaId,
    title: image.title,
    previewUrl: image.previewUrl,
    nasaSourceUrl: image.nasaSourceUrl,
    center: image.center,
    dateCreated: image.dateCreated,
    description: image.description,
    keywords: image.keywords,
    discoveredComponents: Array.from(new Set(discoveredComponentNames)),
    savedAt: new Date().toISOString(),
  };

  const updated = [nextItem, ...existing];
  writeJson(SAVED_DISCOVERIES_KEY, updated);

  const rewardKey = `save::${image.nasaId}`;
  const pointsAwarded = awardUniqueLearningPoints(rewardKey, 25);

  return { discoveries: updated, isSaved: true, pointsAwarded };
}

export function updateSavedDiscoveryComponents(
  nasaId: string,
  componentName: string
): SavedDiscoveryItem[] {
  const existing = getSavedDiscoveries();
  const updated = existing.map((item) => {
    if (item.nasaId !== nasaId) return item;
    if (item.discoveredComponents.includes(componentName)) return item;
    return {
      ...item,
      discoveredComponents: [...item.discoveredComponents, componentName],
    };
  });
  writeJson(SAVED_DISCOVERIES_KEY, updated);
  return updated;
}

export function getLearningPoints(): number {
  const val = readJson<unknown>(LEARNING_POINTS_KEY, 0);
  return typeof val === 'number' && Number.isFinite(val) ? val : 0;
}

export function getExploredKeys(): string[] {
  const val = readJson<unknown>(EXPLORED_KEYS_STORAGE, []);
  return Array.isArray(val)
    ? val.filter((k): k is string => typeof k === 'string')
    : [];
}

/**
 * Awards learning points only once per unique discovery key
 * so repeated clicks on the same component never farm points.
 */
export function awardUniqueLearningPoints(
  uniqueKey: string,
  amount: number
): number {
  const explored = getExploredKeys();
  if (explored.includes(uniqueKey)) {
    return 0;
  }
  const updatedKeys = [...explored, uniqueKey];
  writeJson(EXPLORED_KEYS_STORAGE, updatedKeys);

  const nextTotal = getLearningPoints() + amount;
  writeJson(LEARNING_POINTS_KEY, nextTotal);
  return amount;
}
