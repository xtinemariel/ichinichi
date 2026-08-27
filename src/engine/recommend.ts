import type { Recommendation, UserState } from "@/lib/types";
import {
  CONCEPTS,
  PREREQUISITES,
  getConceptById,
  getSortedConcepts,
} from "@/curriculum";
import { isDue, isWeak, isIntroduced, isMastered } from "@/engine/mastery";
import {
  daysSinceLastStudy,
  isWelcomeBack,
} from "@/engine/progress";
import {
  getConceptStatus,
  isConceptCleared,
  isPostponed,
} from "@/engine/conceptStatus";
import { generateLesson } from "@/lessons/generator";

function prerequisitesMet(conceptId: string, state: UserState): boolean {
  const prereqs = PREREQUISITES[conceptId] ?? [];
  return prereqs.every(
    (pid) =>
      isConceptCleared(state, pid) ||
      (isIntroduced(state.progress[pid]) &&
        (state.progress[pid]?.mastery ?? 0) >= 1)
  );
}

/**
 * Next lesson = first uncleared concept in curriculum order.
 * "Review later" soft-skips at most one open lesson — never walks the
 * rest of the path to Mixed Review.
 */
export function findNextCurriculumConcept(state: UserState) {
  const sorted = getSortedConcepts();
  let skippedPostponed = false;

  for (const concept of sorted) {
    if (isConceptCleared(state, concept.id)) continue;
    if (isPostponed(state, concept.id) && !skippedPostponed) {
      skippedPostponed = true;
      continue;
    }
    return concept;
  }

  return sorted[sorted.length - 1];
}

/** Keep the stored cursor aligned with real progress (repairs bad local state). */
export function syncCurriculumIndex(state: UserState): UserState {
  const sorted = getSortedConcepts();
  const next = findNextCurriculumConcept(state);
  const idx = sorted.findIndex((c) => c.id === next.id);
  if (idx < 0 || state.currentCurriculumIndex === idx) return state;
  return { ...state, currentCurriculumIndex: idx };
}

/**
 * Fix progress corrupted by older recommender bugs:
 * clear postpone flags and realign the curriculum cursor.
 */
export function repairCurriculumState(state: UserState): UserState {
  let conceptStatus = state.conceptStatus;
  let changed = false;

  for (const [id, progress] of Object.entries(state.conceptStatus)) {
    if (progress.postponedUntil != null) {
      if (!changed) {
        conceptStatus = { ...state.conceptStatus };
        changed = true;
      }
      conceptStatus[id] = {
        ...progress,
        postponedUntil: null,
      };
    }
  }

  const next = changed ? { ...state, conceptStatus } : state;
  return syncCurriculumIndex(next);
}

function findOverdueReviewConcept(state: UserState) {
  const justFinished = state.recentLessonConceptIds[0];
  const due = CONCEPTS.filter((c) => {
    if (c.id === justFinished) return false;
    const status = getConceptStatus(state, c.id);
    if (
      status !== "FAMILIAR" &&
      status !== "MASTERED" &&
      status !== "LEARNING" &&
      status !== "NEEDS_REVIEW"
    ) {
      return false;
    }
    const p = state.progress[c.id];
    return p && isDue(p) && !isMastered(p);
  }).sort((a, b) => {
    const pa = state.progress[a.id]!;
    const pb = state.progress[b.id]!;
    return (pa.nextReview ?? "").localeCompare(pb.nextReview ?? "");
  });

  return due[0] ?? null;
}

function findWeakConcept(state: UserState) {
  const weak = CONCEPTS.filter((c) => {
    const p = state.progress[c.id];
    return p && isWeak(p) && isConceptCleared(state, c.id);
  }).sort(
    (a, b) =>
      (state.progress[a.id]?.mastery ?? 0) -
      (state.progress[b.id]?.mastery ?? 0)
  );
  return weak[0] ?? null;
}

function peekNextUp(state: UserState, currentId: string) {
  const sorted = getSortedConcepts();
  const idx = sorted.findIndex((c) => c.id === currentId);
  for (let i = idx + 1; i < sorted.length; i++) {
    if (!isConceptCleared(state, sorted[i].id)) {
      return { title: sorted[i].title, when: "Up next" };
    }
  }
  const next = sorted[idx + 1];
  if (!next) return { title: "N5 integration practice", when: "Soon" };
  return { title: next.title, when: "Up next" };
}

/**
 * Lesson recommendation engine.
 */
export function recommendLesson(
  state: UserState,
  mode: "continue" | "review_today" | "weak_areas" = "continue"
): Recommendation {
  const welcomeBack = isWelcomeBack(state);
  const gap = daysSinceLastStudy(state);

  if (mode === "weak_areas") {
    const weak = findWeakConcept(state) ?? findNextCurriculumConcept(state);
    const lesson = generateLesson(weak.id, state, { forceReview: true });
    return {
      lesson,
      reason: "Focusing on your weakest areas",
      isWelcomeBack: false,
      nextUp: peekNextUp(state, weak.id),
    };
  }

  if (mode === "review_today") {
    const last = state.recentLessonConceptIds[0];
    const conceptId = last ?? findNextCurriculumConcept(state).id;
    const lesson = generateLesson(conceptId, state, { forceReview: true });
    return {
      lesson,
      reason: "Reviewing today's material",
      isWelcomeBack: false,
      nextUp: peekNextUp(state, conceptId),
    };
  }

  // Welcome-back: review due familiar material, but never replace the
  // curriculum frontier with Mixed Review while the path is incomplete.
  if (welcomeBack) {
    const due = findOverdueReviewConcept(state);
    if (due) {
      const lesson = generateLesson(due.id, state, {
        isWelcomeBack: true,
        forceReview: true,
      });
      return {
        lesson,
        reason:
          gap >= 3
            ? `Welcome back — reviewing what matters after ${gap} days away`
            : "Reviewing due material",
        isWelcomeBack: true,
        nextUp: peekNextUp(state, due.id),
      };
    }
  }

  const next = findNextCurriculumConcept(state);
  const lesson = generateLesson(next.id, state);
  const status = getConceptStatus(state, next.id);
  return {
    lesson,
    reason:
      status === "NEEDS_REVIEW"
        ? "A concept needs a bit more attention"
        : welcomeBack
          ? gap >= 3
            ? `Welcome back — continuing after ${gap} days away`
            : "Continuing your N5 path"
          : "Next step in your N5 path",
    isWelcomeBack: welcomeBack,
    nextUp: peekNextUp(state, next.id),
  };
}

export function getRoadmapState(state: UserState) {
  const units = [...new Set(CONCEPTS.map((c) => c.unitId))];
  return units.map((unitId) => {
    const concepts = CONCEPTS.filter((c) => c.unitId === unitId);
    const statuses = concepts.map((c) => {
      const status = getConceptStatus(state, c.id);
      if (status === "MASTERED") return "mastered" as const;
      if (status === "FAMILIAR") return "mastered" as const;
      if (status === "LEARNING" || status === "NEEDS_REVIEW")
        return "current" as const;
      if (isIntroduced(state.progress[c.id])) return "current" as const;
      if (prerequisitesMet(c.id, state)) return "available" as const;
      return "locked" as const;
    });

    let unitStatus: "done" | "current" | "upcoming" = "upcoming";
    if (statuses.every((s) => s === "mastered")) unitStatus = "done";
    else if (statuses.some((s) => s === "current" || s === "available"))
      unitStatus = "current";

    return {
      unitId,
      concepts: concepts.map((c, i) => ({
        ...c,
        status: statuses[i],
        mastery: state.progress[c.id]?.mastery ?? 0,
        familiarity: getConceptStatus(state, c.id),
      })),
      status: unitStatus,
    };
  });
}

export function canAccessConcept(
  conceptId: string,
  state: UserState
): { allowed: boolean; missing: string[] } {
  const missing = (PREREQUISITES[conceptId] ?? [])
    .filter(
      (pid) =>
        !isConceptCleared(state, pid) && !isIntroduced(state.progress[pid])
    )
    .map((pid) => getConceptById(pid)?.title ?? pid);
  return { allowed: missing.length === 0, missing };
}
