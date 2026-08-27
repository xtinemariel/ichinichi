import type {
  ConceptProgress,
  ConceptStatus,
  KnowledgeCheckOutcome,
  KnowledgeCheckRecord,
  UserState,
} from "@/lib/types";
import { ensureProgress, applyAnswer } from "@/engine/mastery";
import { addDays, todayKey, uid } from "@/lib/dates";
import { saveUserState } from "@/lib/storage";
import { getSortedConcepts } from "@/curriculum";

export function getConceptStatus(
  state: UserState,
  conceptId: string
): ConceptStatus {
  return state.conceptStatus[conceptId]?.status ?? "NOT_STARTED";
}

export function getConceptProgress(
  state: UserState,
  conceptId: string
): ConceptProgress {
  return (
    state.conceptStatus[conceptId] ?? {
      conceptId,
      status: "NOT_STARTED",
      postponeCount: 0,
      postponedUntil: null,
    }
  );
}

/** Familiar or mastered — safe to advance past in curriculum */
export function isConceptCleared(
  state: UserState,
  conceptId: string
): boolean {
  const status = getConceptStatus(state, conceptId);
  if (status === "FAMILIAR" || status === "MASTERED") return true;

  const p = state.progress[conceptId];
  const completedOnce = state.completedLessons.some(
    (l) => l.conceptId === conceptId
  );
  if (completedOnce && (p?.mastery ?? 0) >= 1) return true;
  if ((p?.mastery ?? 0) >= 4) return true;

  return false;
}

export function setConceptStatus(
  state: UserState,
  conceptId: string,
  status: ConceptStatus,
  extra?: Partial<ConceptProgress>
): UserState {
  const prev = getConceptProgress(state, conceptId);
  return {
    ...state,
    conceptStatus: {
      ...state.conceptStatus,
      [conceptId]: {
        ...prev,
        ...extra,
        conceptId,
        status,
      },
    },
  };
}

export function classifyKnowledgeScore(
  score: number,
  total: number
): KnowledgeCheckOutcome {
  if (total <= 0) return "fail";
  const ratio = score / total;
  if (ratio >= 0.8) return "pass";
  if (ratio >= 0.6) return "borderline";
  return "fail";
}

/**
 * Apply a knowledge-check result.
 * PASS → FAMILIAR (not MASTERED) + schedule spaced review
 * BORDERLINE → NEEDS_REVIEW
 * FAIL → leave NOT_STARTED / LEARNING
 */
export function applyKnowledgeCheckResult(
  state: UserState,
  input: {
    conceptId: string;
    title: string;
    score: number;
    totalQuestions: number;
    missedContentIds: string[];
    correctContentIds: string[];
    durationSeconds: number;
    answers: Array<{
      contentId?: string;
      contentType?: "concept" | "vocabulary" | "grammar" | "kana" | "kanji";
      correct: boolean;
    }>;
  }
): {
  state: UserState;
  outcome: KnowledgeCheckOutcome;
  record: KnowledgeCheckRecord;
} {
  const outcome = classifyKnowledgeScore(input.score, input.totalQuestions);
  let next: UserState = {
    ...state,
    progress: { ...state.progress },
    conceptStatus: { ...state.conceptStatus },
    knowledgeChecks: [...(state.knowledgeChecks ?? [])],
    recentLessonConceptIds: [...state.recentLessonConceptIds],
  };

  // Update item-level progress from answers (lighter than full lesson)
  for (const a of input.answers) {
    if (!a.contentId || !a.contentType) continue;
    const before = ensureProgress(next.progress, a.contentId, a.contentType);
    next.progress[a.contentId] = applyAnswer(before, a.correct, true);
  }

  const today = todayKey();
  const conceptItem = ensureProgress(next.progress, input.conceptId, "concept");

  if (outcome === "pass") {
    next.progress[input.conceptId] = {
      ...conceptItem,
      mastery: 3,
      introducedAt: conceptItem.introducedAt ?? today,
      lastReviewed: today,
      nextReview: addDays(today, 3),
      intervalDays: 3,
      attempts: conceptItem.attempts + 1,
      correctAttempts: conceptItem.correctAttempts + 1,
      accuracy:
        (conceptItem.correctAttempts + 1) / (conceptItem.attempts + 1),
    };
    next = setConceptStatus(next, input.conceptId, "FAMILIAR", {
      postponeCount: 0,
      postponedUntil: null,
    });

    const sorted = getSortedConcepts();
    const idx = sorted.findIndex((c) => c.id === input.conceptId);
    if (idx >= 0) {
      next.currentCurriculumIndex = Math.min(sorted.length - 1, idx + 1);
    }
  } else if (outcome === "borderline") {
    next.progress[input.conceptId] = {
      ...conceptItem,
      mastery: Math.max(conceptItem.mastery, 1) as typeof conceptItem.mastery,
      introducedAt: conceptItem.introducedAt ?? today,
      lastReviewed: today,
      nextReview: today,
      intervalDays: 0,
      attempts: conceptItem.attempts + 1,
      correctAttempts: conceptItem.correctAttempts + (input.score > 0 ? 1 : 0),
      accuracy:
        (conceptItem.correctAttempts + (input.score > 0 ? 1 : 0)) /
        (conceptItem.attempts + 1),
    };
    next = setConceptStatus(next, input.conceptId, "NEEDS_REVIEW", {
      postponedUntil: null,
    });
  } else {
    // Fail — keep as learning/not started so full lesson is recommended
    const status = getConceptStatus(next, input.conceptId);
    next = setConceptStatus(
      next,
      input.conceptId,
      status === "NOT_STARTED" ? "NOT_STARTED" : "LEARNING"
    );
  }

  // Missed items come back sooner
  for (const id of input.missedContentIds) {
    const p = next.progress[id];
    if (!p) continue;
    next.progress[id] = {
      ...p,
      nextReview: today,
      intervalDays: 0,
    };
  }

  const record: KnowledgeCheckRecord = {
    id: uid("kcheck"),
    conceptId: input.conceptId,
    title: input.title,
    date: new Date().toISOString(),
    score: input.score,
    totalQuestions: input.totalQuestions,
    missedContentIds: input.missedContentIds,
    correctContentIds: input.correctContentIds,
    outcome,
    durationSeconds: input.durationSeconds,
  };

  next.knowledgeChecks = [record, ...next.knowledgeChecks].slice(0, 50);
  next.lastStudyDate = today;

  saveUserState(next);
  return { state: next, outcome, record };
}

/** Mark concept as mastered after a strong full lesson */
export function markConceptFromLesson(
  state: UserState,
  conceptId: string,
  quizRatio: number
): UserState {
  if (quizRatio >= 0.85) {
    return setConceptStatus(state, conceptId, "MASTERED", {
      postponeCount: 0,
      postponedUntil: null,
    });
  }
  if (quizRatio >= 0.5) {
    return setConceptStatus(state, conceptId, "LEARNING", {
      postponedUntil: null,
    });
  }
  return setConceptStatus(state, conceptId, "NEEDS_REVIEW");
}

/**
 * Review later — skip this concept for today only.
 * Does not mark it familiar and does not jump the curriculum cursor.
 */
export function postponeConcept(
  state: UserState,
  conceptId: string
): UserState {
  const prev = getConceptProgress(state, conceptId);
  const next = setConceptStatus(state, conceptId, prev.status, {
    postponeCount: prev.postponeCount + 1,
    postponedUntil: addDays(todayKey(), 1),
  });
  saveUserState(next);
  return next;
}

/** True when the learner asked to skip this concept until tomorrow. */
export function isPostponed(state: UserState, conceptId: string): boolean {
  const p = getConceptProgress(state, conceptId);
  if (!p.postponedUntil) return false;
  return p.postponedUntil > todayKey();
}
