import type {
  CategoryProgress,
  CompletedLessonRecord,
  LessonResult,
  UserState,
} from "@/lib/types";
import { CONCEPTS } from "@/curriculum/concepts";
import { VOCABULARY } from "@/curriculum/vocabulary";
import { GRAMMAR_POINTS } from "@/curriculum/grammar";
import { ALL_KANA } from "@/curriculum/kana";
import { KANJI } from "@/curriculum/kanji";
import { applyAnswer, ensureProgress, isMastered, isWeak } from "./mastery";
import { daysBetween, todayKey, uid } from "@/lib/dates";
import { saveUserState } from "@/lib/storage";
import { markConceptFromLesson } from "@/engine/conceptStatus";

export function getCategoryProgress(state: UserState): CategoryProgress {
  const avg = (
    ids: string[],
    type: "vocabulary" | "grammar" | "kana" | "kanji"
  ): number => {
    if (ids.length === 0) return 0;
    let sum = 0;
    for (const id of ids) {
      const p = state.progress[id];
      sum += p ? (p.mastery / 5) * 100 : 0;
    }
    return Math.round(sum / ids.length);
  };

  const vocabulary = avg(
    VOCABULARY.map((v) => v.id),
    "vocabulary"
  );
  const grammar = avg(
    GRAMMAR_POINTS.map((g) => g.id),
    "grammar"
  );
  const kana = avg(
    ALL_KANA.map((k) => k.id),
    "kana"
  );
  const kanji = avg(
    KANJI.map((k) => k.id),
    "kanji"
  );

  // Concept-based curriculum progress
  const introducedConcepts = CONCEPTS.filter(
    (c) => (state.progress[c.id]?.mastery ?? 0) >= 1
  ).length;
  const overall = Math.round((introducedConcepts / CONCEPTS.length) * 100);

  // Soft proxies until dedicated reading/listening content expands
  const reading = Math.round(
    (overall * 0.4 + grammar * 0.3 + vocabulary * 0.3) * 0.5
  );
  const listening = Math.round(overall * 0.25);

  return {
    vocabulary,
    grammar,
    kana,
    kanji,
    reading,
    listening,
    overall,
  };
}

export function getWeakAreas(state: UserState): string[] {
  const weak: Array<{ label: string; score: number }> = [];

  for (const c of CONCEPTS) {
    const p = state.progress[c.id];
    if (p && isWeak(p)) {
      weak.push({ label: c.title, score: p.mastery + p.accuracy });
    }
  }

  for (const v of VOCABULARY) {
    const p = state.progress[v.id];
    if (p && isWeak(p)) {
      weak.push({
        label: `${v.japanese} (${v.english})`,
        score: p.mastery + p.accuracy,
      });
    }
  }

  return weak
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((w) => w.label);
}

export function getStrongAreas(state: UserState): string[] {
  const strong: string[] = [];
  for (const c of CONCEPTS) {
    const p = state.progress[c.id];
    if (p && isMastered(p)) {
      strong.push(c.title);
    }
  }
  return strong.slice(0, 6);
}

export function daysSinceLastStudy(state: UserState): number {
  if (!state.lastStudyDate) return 0;
  return daysBetween(state.lastStudyDate, todayKey());
}

export function isWelcomeBack(state: UserState): boolean {
  return daysSinceLastStudy(state) >= 3;
}

export function lessonsCompletedToday(state: UserState): number {
  const today = todayKey();
  return state.completedLessons.filter((l) =>
    l.completedAt.startsWith(today)
  ).length;
}

export function dailyGoalMet(state: UserState): boolean {
  return lessonsCompletedToday(state) >= state.preferences.dailyGoalLessons;
}

/**
 * Apply a completed lesson: update mastery, streak, curriculum position.
 */
export function applyLessonResult(
  state: UserState,
  result: LessonResult,
  lessonTitle: string,
  lessonType: CompletedLessonRecord["lessonType"]
): { state: UserState; struggledItems: string[]; improvedAreas: CompletedLessonRecord["improvedAreas"] } {
  let next: UserState = {
    ...state,
    progress: { ...state.progress },
    completedLessons: [...state.completedLessons],
    recentLessonConceptIds: [...state.recentLessonConceptIds],
    conceptStatus: { ...state.conceptStatus },
  };

  const struggledItems: string[] = [];
  const areaDeltas: Record<string, number> = {
    vocabulary: 0,
    grammar: 0,
    kana: 0,
    kanji: 0,
  };

  for (const answer of result.answers) {
    if (!answer.contentId || !answer.contentType) continue;

    const before = ensureProgress(
      next.progress,
      answer.contentId,
      answer.contentType
    );
    const prevMastery = before.mastery;
    // Quiz / production answers weigh more for mastery
    const asProduction = Boolean(
      answer.isProduction || answer.countsAsQuiz
    );
    const updated = applyAnswer(before, answer.correct, asProduction);
    next.progress[answer.contentId] = updated;

    if (!answer.correct) {
      struggledItems.push(answer.contentId);
    }

    const delta = updated.mastery - prevMastery;
    if (
      answer.contentType === "vocabulary" ||
      answer.contentType === "grammar" ||
      answer.contentType === "kana" ||
      answer.contentType === "kanji"
    ) {
      areaDeltas[answer.contentType] += delta;
    }
  }

  // Mark concept as introduced — quiz accuracy matters most
  const conceptProgress = ensureProgress(
    next.progress,
    result.conceptId,
    "concept"
  );
  const quizRatio =
    result.quizTotal > 0
      ? result.quizScore / result.quizTotal
      : result.totalQuestions === 0
        ? 0.5
        : result.score / result.totalQuestions;
  const conceptCorrect = quizRatio >= 0.6;
  next.progress[result.conceptId] = applyAnswer(
    conceptProgress,
    conceptCorrect,
    true
  );

  const conceptAfter = next.progress[result.conceptId];
  const nextReviewHint = conceptAfter?.nextReview
    ? `We'll review this again around ${conceptAfter.nextReview}.`
    : quizRatio < 0.7
      ? "We'll review this again soon."
      : "We'll review this again in a few days.";

  const today = todayKey();
  if (state.lastStudyDate) {
    const gap = daysBetween(state.lastStudyDate, today);
    if (gap === 1) next.streak = state.streak + 1;
    else if (gap === 0) next.streak = Math.max(state.streak, 1);
    else next.streak = 1;
  } else {
    next.streak = 1;
  }

  if (state.lastStudyDate !== today && (!state.lastStudyDate || daysBetween(state.lastStudyDate, today) >= 1)) {
    if (!state.lastStudyDate || daysBetween(state.createdAt.slice(0, 10), today) >= 0) {
      // Advance day number only on a new study day
      if (state.lastStudyDate && daysBetween(state.lastStudyDate, today) >= 1) {
        next.dayNumber = state.dayNumber + 1;
      }
    }
  }
  if (!state.lastStudyDate) {
    next.dayNumber = 1;
  }

  next.lastStudyDate = today;
  next.lessonsCompleted = state.lessonsCompleted + 1;
  next.totalStudyMinutes =
    state.totalStudyMinutes + Math.max(1, Math.round(result.durationSeconds / 60));

  const improvedAreas: CompletedLessonRecord["improvedAreas"] = {};
  for (const [key, val] of Object.entries(areaDeltas)) {
    if (val > 0) {
      improvedAreas[key as keyof typeof improvedAreas] = Math.round(val * 4);
    }
  }

  const record: CompletedLessonRecord = {
    id: uid("lesson"),
    conceptId: result.conceptId,
    lessonType,
    title: lessonTitle,
    startedAt: result.startedAt,
    completedAt: result.completedAt,
    score: result.quizTotal > 0 ? result.quizScore : result.score,
    totalQuestions: result.quizTotal > 0 ? result.quizTotal : result.totalQuestions,
    quizScore: result.quizScore,
    quizTotal: result.quizTotal,
    durationSeconds: result.durationSeconds,
    struggledItems: [...new Set(struggledItems)].slice(0, 5),
    improvedAreas,
    nextReviewHint,
  };

  next.completedLessons = [record, ...next.completedLessons].slice(0, 100);
  next.recentLessonConceptIds = [
    result.conceptId,
    ...next.recentLessonConceptIds.filter((id) => id !== result.conceptId),
  ].slice(0, 8);

  // Advance curriculum pointer when concept is reasonably learned
  const conceptIdx = CONCEPTS.findIndex((c) => c.id === result.conceptId);
  if (
    conceptIdx >= 0 &&
    conceptIdx >= next.currentCurriculumIndex &&
    quizRatio >= 0.5
  ) {
    if (quizRatio < 0.7) {
      next.currentCurriculumIndex = conceptIdx;
    } else {
      next.currentCurriculumIndex = Math.min(CONCEPTS.length - 1, conceptIdx + 1);
    }
  }

  next = markConceptFromLesson(next, result.conceptId, quizRatio);

  saveUserState(next);
  return { state: next, struggledItems: record.struggledItems, improvedAreas };
}

export function labelForContentId(id: string): string {
  const vocab = VOCABULARY.find((v) => v.id === id);
  if (vocab) return `${vocab.japanese} — ${vocab.english}`;
  const grammar = GRAMMAR_POINTS.find((g) => g.id === id);
  if (grammar) return grammar.title;
  const kana = ALL_KANA.find((k) => k.id === id);
  if (kana) return `${kana.character} (${kana.romaji})`;
  const kanji = KANJI.find((k) => k.id === id);
  if (kanji) return `${kanji.character} — ${kanji.meaning}`;
  const concept = CONCEPTS.find((c) => c.id === id);
  if (concept) return concept.title;
  return id;
}
