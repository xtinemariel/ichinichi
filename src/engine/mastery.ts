import type { ItemProgress, MasteryLevel } from "@/lib/types";
import { addDays, todayKey } from "@/lib/dates";

/**
 * Lightweight spaced repetition.
 * Intervals grow with mastery; mistakes pull items back sooner.
 */
const INTERVALS_BY_MASTERY: Record<MasteryLevel, number> = {
  0: 0,
  1: 0, // review same day / next lesson
  2: 1, // tomorrow
  3: 3, // few days
  4: 7, // next week
  5: 14, // later
};

export function createEmptyProgress(
  id: string,
  contentType: ItemProgress["contentType"]
): ItemProgress {
  return {
    id,
    contentType,
    mastery: 0,
    attempts: 0,
    correctAttempts: 0,
    incorrectAttempts: 0,
    accuracy: 0,
    lastReviewed: null,
    nextReview: null,
    introducedAt: null,
    intervalDays: 0,
  };
}

export function ensureProgress(
  map: Record<string, ItemProgress>,
  id: string,
  contentType: ItemProgress["contentType"]
): ItemProgress {
  if (!map[id]) {
    map[id] = createEmptyProgress(id, contentType);
  }
  return map[id];
}

function clampMastery(n: number): MasteryLevel {
  return Math.max(0, Math.min(5, Math.round(n))) as MasteryLevel;
}

/**
 * Apply a single exercise result to an item's mastery + review schedule.
 * Production answers weigh more heavily than recognition.
 */
export function applyAnswer(
  progress: ItemProgress,
  correct: boolean,
  isProduction = false
): ItemProgress {
  const today = todayKey();
  const weight = isProduction ? 1.25 : 1;
  const next: ItemProgress = { ...progress };

  next.attempts += 1;
  if (correct) {
    next.correctAttempts += 1;
  } else {
    next.incorrectAttempts += 1;
  }
  next.accuracy =
    next.attempts === 0 ? 0 : next.correctAttempts / next.attempts;

  if (!next.introducedAt) {
    next.introducedAt = today;
  }
  next.lastReviewed = today;

  if (correct) {
    const bump = weight >= 1.25 ? 1 : next.mastery < 2 ? 1 : 0.5;
    next.mastery = clampMastery(next.mastery + bump);
  } else {
    next.mastery = clampMastery(next.mastery - (isProduction ? 1.5 : 1));
  }

  // Never leave introduced items at 0
  if (next.mastery === 0 && next.introducedAt) {
    next.mastery = 1;
  }

  const baseInterval = INTERVALS_BY_MASTERY[next.mastery];
  let interval = baseInterval;

  if (!correct) {
    interval = 0;
  } else if (next.accuracy >= 0.85 && next.mastery >= 3) {
    interval = Math.max(interval, next.intervalDays + 1);
  }

  next.intervalDays = interval;
  next.nextReview = addDays(today, interval);

  return next;
}

export function isDue(progress: ItemProgress, today = todayKey()): boolean {
  if (!progress.introducedAt || progress.mastery === 0) return false;
  if (!progress.nextReview) return true;
  return progress.nextReview <= today;
}

export function isWeak(progress: ItemProgress): boolean {
  if (!progress.introducedAt || progress.mastery === 0) return false;
  return (
    progress.mastery <= 2 ||
    (progress.attempts >= 3 && progress.accuracy < 0.6)
  );
}

export function isIntroduced(progress: ItemProgress | undefined): boolean {
  return Boolean(progress && progress.mastery >= 1);
}

export function isMastered(progress: ItemProgress | undefined): boolean {
  return Boolean(progress && progress.mastery >= 4);
}
