import type { UserState, UserPreferences } from "@/lib/types";

const STORAGE_KEY = "ichinichi-user-state-v1";
const ACTIVE_LESSON_KEY = "ichinichi-active-lesson-v1";

export function createDefaultUserState(): UserState {
  const now = new Date().toISOString();
  return {
    userId: "local-user",
    createdAt: now,
    lastStudyDate: null,
    streak: 0,
    totalStudyMinutes: 0,
    lessonsCompleted: 0,
    dayNumber: 1,
    preferences: {
      dailyGoalLessons: 1,
    },
    progress: {},
    conceptStatus: {},
    completedLessons: [],
    knowledgeChecks: [],
    recentLessonConceptIds: [],
    currentCurriculumIndex: 0,
  };
}

export function loadUserState(): UserState {
  if (typeof window === "undefined") {
    return createDefaultUserState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultUserState();
    const parsed = JSON.parse(raw) as UserState;
    return {
      ...createDefaultUserState(),
      ...parsed,
      preferences: {
        ...createDefaultUserState().preferences,
        ...parsed.preferences,
      },
      progress: parsed.progress ?? {},
      conceptStatus: parsed.conceptStatus ?? {},
      completedLessons: parsed.completedLessons ?? [],
      knowledgeChecks: parsed.knowledgeChecks ?? [],
      recentLessonConceptIds: parsed.recentLessonConceptIds ?? [],
    };
  } catch {
    return createDefaultUserState();
  }
}

export function saveUserState(state: UserState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updatePreferences(
  state: UserState,
  prefs: Partial<UserPreferences>
): UserState {
  const next = {
    ...state,
    preferences: { ...state.preferences, ...prefs },
  };
  saveUserState(next);
  return next;
}

export function saveActiveLesson(lessonJson: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ACTIVE_LESSON_KEY, lessonJson);
}

export function loadActiveLesson(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACTIVE_LESSON_KEY);
}

export function clearActiveLesson(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ACTIVE_LESSON_KEY);
}

export function resetUserState(): UserState {
  const fresh = createDefaultUserState();
  saveUserState(fresh);
  clearActiveLesson();
  return fresh;
}
