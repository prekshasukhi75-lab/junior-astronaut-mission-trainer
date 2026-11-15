import { LAB_EXPERIMENTS } from '../data/spaceScienceLabData';
import type { LabExperimentId, LabProgressState } from '../types/spaceLab';

const LAB_PROGRESS_STORAGE_KEY = 'mla_space_science_lab_progress_v1';

const DEFAULT_PROGRESS: LabProgressState = {
  completedIds: [],
  quizScores: {},
  totalPoints: 0,
  lastUpdatedAt: null,
};

export function loadLabProgress(): LabProgressState {
  try {
    const raw = window.localStorage.getItem(LAB_PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LabProgressState>;
    const validIds = new Set(LAB_EXPERIMENTS.map((e) => e.id));
    const completedIds = Array.isArray(parsed.completedIds)
      ? Array.from(
          new Set(
            parsed.completedIds.filter((id): id is LabExperimentId =>
              validIds.has(id as LabExperimentId)
            )
          )
        )
      : [];

    const quizScores: Partial<Record<LabExperimentId, number>> = {};
    if (parsed.quizScores && typeof parsed.quizScores === 'object') {
      for (const id of validIds) {
        const val = (parsed.quizScores as Record<string, unknown>)[id];
        if (typeof val === 'number' && Number.isFinite(val)) {
          quizScores[id] = Math.max(0, Math.min(3, Math.round(val)));
        }
      }
    }

    const totalPoints = computeTotalPoints(completedIds, quizScores);

    return {
      completedIds,
      quizScores,
      totalPoints,
      lastUpdatedAt:
        typeof parsed.lastUpdatedAt === 'string' ? parsed.lastUpdatedAt : null,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function computeTotalPoints(
  completedIds: LabExperimentId[],
  quizScores: Partial<Record<LabExperimentId, number>>
): number {
  const completionPts = completedIds.length * 100;
  const quizPts = Object.values(quizScores).reduce<number>(
    (sum, score) => sum + (typeof score === 'number' ? score * 20 : 0),
    0
  );
  return completionPts + quizPts;
}

export function recordExperimentQuizCompletion(
  current: LabProgressState,
  experimentId: LabExperimentId,
  scoreOutOfThree: number
): {
  nextState: LabProgressState;
  newlyCompleted: boolean;
  pointsGained: number;
} {
  const clampedScore = Math.max(0, Math.min(3, Math.round(scoreOutOfThree)));
  const alreadyCompleted = current.completedIds.includes(experimentId);
  const completedIds = alreadyCompleted
    ? current.completedIds
    : [...current.completedIds, experimentId];

  const prevBest = current.quizScores[experimentId] ?? 0;
  const bestScore = Math.max(prevBest, clampedScore);
  const quizScores = {
    ...current.quizScores,
    [experimentId]: bestScore,
  };

  const totalPoints = computeTotalPoints(completedIds, quizScores);
  const pointsGained = Math.max(0, totalPoints - current.totalPoints);

  const nextState: LabProgressState = {
    completedIds,
    quizScores,
    totalPoints,
    lastUpdatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(
      LAB_PROGRESS_STORAGE_KEY,
      JSON.stringify(nextState)
    );
  } catch {
    // Ignore storage restriction errors
  }

  return {
    nextState,
    newlyCompleted: !alreadyCompleted,
    pointsGained,
  };
}

export function resetLabProgress(): LabProgressState {
  try {
    window.localStorage.removeItem(LAB_PROGRESS_STORAGE_KEY);
  } catch {
    // Ignore
  }
  return DEFAULT_PROGRESS;
}
