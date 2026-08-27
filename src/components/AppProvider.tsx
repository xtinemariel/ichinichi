"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  CompletedLessonRecord,
  GeneratedLesson,
  KnowledgeCheck,
  KnowledgeCheckOutcome,
  KnowledgeCheckRecord,
  LessonResult,
  Recommendation,
  UserState,
} from "@/lib/types";
import {
  clearActiveLesson,
  createDefaultUserState,
  loadActiveLesson,
  loadUserState,
  saveActiveLesson,
  updatePreferences,
  resetUserState,
  saveUserState,
} from "@/lib/storage";
import {
  recommendLesson,
  repairCurriculumState,
  syncCurriculumIndex,
} from "@/engine/recommend";
import {
  applyLessonResult,
  getCategoryProgress,
  getStrongAreas,
  getWeakAreas,
  isWelcomeBack,
  lessonsCompletedToday,
  labelForContentId,
} from "@/engine/progress";
import {
  applyKnowledgeCheckResult,
  postponeConcept,
  setConceptStatus,
} from "@/engine/conceptStatus";
import {
  generateKnowledgeCheck,
  generateQuickReview,
} from "@/lessons/generator";
import { isInsforgeConfigured } from "@/lib/insforge";
import {
  getCurrentAuthUser,
  loadOrMigrateProgress,
  signInWithEmail,
  signOutAuth,
  signUpWithEmail,
  upsertCloudProgress,
  verifySignupEmail,
  type AuthUser,
} from "@/lib/progressSync";

interface KnowledgeCheckSession {
  check: KnowledgeCheck;
  result: {
    score: number;
    total: number;
    outcome: KnowledgeCheckOutcome;
    missedContentIds: string[];
    record: KnowledgeCheckRecord;
  } | null;
}

const CHECK_KEY = "ichinichi-active-kcheck-v1";
const AUTH_PROMPT_KEY = "ichinichi-auth-prompt-dismissed-v1";

interface AppContextValue {
  ready: boolean;
  state: UserState;
  recommendation: Recommendation | null;
  activeLesson: GeneratedLesson | null;
  knowledgeCheck: KnowledgeCheckSession | null;
  lastCompletion: {
    record: CompletedLessonRecord;
    struggledLabels: string[];
    notes?: GeneratedLesson["notes"];
  } | null;
  user: AuthUser | null;
  isGuest: boolean;
  authConfigured: boolean;
  showSavePrompt: boolean;
  dismissSavePrompt: () => void;
  signUp: (
    email: string,
    password: string
  ) => Promise<"ok" | "needs_verification">;
  signIn: (email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshRecommendation: (
    mode?: "continue" | "review_today" | "weak_areas"
  ) => void;
  startLesson: (lesson?: GeneratedLesson) => void;
  discardLesson: () => void;
  completeLesson: (result: LessonResult, lesson: GeneratedLesson) => void;
  clearCompletion: () => void;
  startKnowledgeCheck: (conceptId?: string) => void;
  completeKnowledgeCheck: (result: {
    score: number;
    total: number;
    answers: Array<{
      exerciseId: string;
      contentId?: string;
      contentType?: "concept" | "vocabulary" | "grammar" | "kana" | "kanji";
      correct: boolean;
      userAnswer: string;
    }>;
    missedContentIds: string[];
    correctContentIds: string[];
    durationSeconds: number;
  }) => void;
  clearKnowledgeCheck: () => void;
  continueAfterPass: () => void;
  continueAnyway: () => void;
  startQuickReview: () => void;
  reviewLater: (conceptId?: string) => void;
  setDailyGoal: (lessons: 1 | 2 | 3) => void;
  resetProgress: () => void;
  categoryProgress: ReturnType<typeof getCategoryProgress>;
  weakAreas: string[];
  strongAreas: string[];
  welcomeBack: boolean;
  lessonsToday: number;
}

const AppContext = createContext<AppContextValue | null>(null);

function applyUserState(
  next: UserState,
  setState: (s: UserState) => void,
  setRecommendation: (r: Recommendation) => void
) {
  const repaired = repairCurriculumState(next);
  saveUserState(repaired);
  setState(repaired);
  setRecommendation(recommendLesson(repaired));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<UserState | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [activeLesson, setActiveLesson] = useState<GeneratedLesson | null>(
    null
  );
  const [knowledgeCheck, setKnowledgeCheck] =
    useState<KnowledgeCheckSession | null>(null);
  const [lastCompletion, setLastCompletion] =
    useState<AppContextValue["lastCompletion"]>(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const cloudSyncReady = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const authConfigured = isInsforgeConfigured();
      let authUser: AuthUser | null = null;
      if (authConfigured) {
        try {
          authUser = await getCurrentAuthUser();
        } catch {
          authUser = null;
        }
      }

      if (cancelled) return;

      let loaded: UserState;
      if (authUser) {
        loaded = await loadOrMigrateProgress(authUser);
        setUser(authUser);
      } else {
        loaded = repairCurriculumState(loadUserState());
        if (loaded.userId !== "local-user") {
          // Stale logged-in cache without session → treat as guest
          loaded = { ...createDefaultUserState(), ...loaded, userId: "local-user" };
        }
        loaded = { ...loaded, userId: "local-user" };
        saveUserState(loaded);
        setUser(null);
      }

      setState(loaded);
      setRecommendation(recommendLesson(loaded));

      const saved = loadActiveLesson();
      if (saved) {
        try {
          setActiveLesson(JSON.parse(saved) as GeneratedLesson);
        } catch {
          clearActiveLesson();
        }
      }

      try {
        const raw = sessionStorage.getItem(CHECK_KEY);
        if (raw) {
          setKnowledgeCheck({
            check: JSON.parse(raw) as KnowledgeCheck,
            result: null,
          });
        }
      } catch {
        sessionStorage.removeItem(CHECK_KEY);
      }

      cloudSyncReady.current = true;
      setReady(true);
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced cloud sync for logged-in users
  useEffect(() => {
    if (!ready || !cloudSyncReady.current || !state || !user) return;
    if (state.userId === "local-user") return;
    const handle = window.setTimeout(() => {
      void upsertCloudProgress(state);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [state, user, ready]);

  const dismissSavePrompt = useCallback(() => {
    setShowSavePrompt(false);
    try {
      localStorage.setItem(AUTH_PROMPT_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const maybeOfferSavePrompt = useCallback((next: UserState) => {
    if (next.userId !== "local-user") return;
    if (next.lessonsCompleted < 1) return;
    try {
      if (localStorage.getItem(AUTH_PROMPT_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    setShowSavePrompt(true);
  }, []);

  const adoptAuthUser = useCallback(async (authUser: AuthUser) => {
    const next = await loadOrMigrateProgress(authUser);
    setUser(authUser);
    setShowSavePrompt(false);
    applyUserState(next, setState, setRecommendation);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string) => {
      const result = await signUpWithEmail(email, password);
      if (result.needsVerification) return "needs_verification" as const;
      await adoptAuthUser(result.user);
      return "ok" as const;
    },
    [adoptAuthUser]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const authUser = await signInWithEmail(email, password);
      await adoptAuthUser(authUser);
    },
    [adoptAuthUser]
  );

  const verifyEmail = useCallback(
    async (email: string, otp: string) => {
      const authUser = await verifySignupEmail(email, otp);
      await adoptAuthUser(authUser);
    },
    [adoptAuthUser]
  );

  const signOut = useCallback(async () => {
    await signOutAuth();
    setUser(null);
    clearActiveLesson();
    setActiveLesson(null);
    setKnowledgeCheck(null);
    setLastCompletion(null);
    sessionStorage.removeItem(CHECK_KEY);
    const fresh = resetUserState();
    setState(fresh);
    setRecommendation(recommendLesson(fresh));
  }, []);

  const refreshRecommendation = useCallback(
    (mode: "continue" | "review_today" | "weak_areas" = "continue") => {
      setState((prev) => {
        if (!prev) return prev;
        setRecommendation(recommendLesson(prev, mode));
        return prev;
      });
    },
    []
  );

  const startLesson = useCallback((lesson?: GeneratedLesson) => {
    setState((prev) => {
      if (!prev) return prev;
      const rec = lesson
        ? {
            lesson,
            reason: "Selected lesson",
            isWelcomeBack: false,
          }
        : recommendLesson(prev);
      setRecommendation(rec);
      setActiveLesson(rec.lesson);
      saveActiveLesson(JSON.stringify(rec.lesson));
      setLastCompletion(null);
      setKnowledgeCheck(null);
      setShowSavePrompt(false);
      sessionStorage.removeItem(CHECK_KEY);
      return prev;
    });
  }, []);

  const discardLesson = useCallback(() => {
    clearActiveLesson();
    setActiveLesson(null);
  }, []);

  const completeLesson = useCallback(
    (result: LessonResult, lesson: GeneratedLesson) => {
      setState((prev) => {
        if (!prev) return prev;
        const { state: next, struggledItems, improvedAreas } =
          applyLessonResult(prev, result, lesson.title, lesson.lessonType);

        setLastCompletion({
          record: {
            ...next.completedLessons[0],
            improvedAreas,
          },
          struggledLabels: struggledItems.map(labelForContentId),
          notes: lesson.notes,
        });

        clearActiveLesson();
        setActiveLesson(null);
        setRecommendation(recommendLesson(next));
        maybeOfferSavePrompt(next);
        return next;
      });
    },
    [maybeOfferSavePrompt]
  );

  const clearCompletion = useCallback(() => {
    setLastCompletion(null);
  }, []);

  const startKnowledgeCheck = useCallback((conceptId?: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const id = conceptId ?? recommendLesson(prev).lesson.conceptId;
      const check = generateKnowledgeCheck(id, prev);
      setKnowledgeCheck({ check, result: null });
      sessionStorage.setItem(CHECK_KEY, JSON.stringify(check));
      setActiveLesson(null);
      clearActiveLesson();
      setLastCompletion(null);
      return prev;
    });
  }, []);

  const completeKnowledgeCheck = useCallback(
    (result: {
      score: number;
      total: number;
      answers: Array<{
        exerciseId: string;
        contentId?: string;
        contentType?: "concept" | "vocabulary" | "grammar" | "kana" | "kanji";
        correct: boolean;
        userAnswer: string;
      }>;
      missedContentIds: string[];
      correctContentIds: string[];
      durationSeconds: number;
    }) => {
      setState((prev) => {
        if (!prev || !knowledgeCheck) return prev;
        const { state: applied, outcome, record } = applyKnowledgeCheckResult(
          prev,
          {
            conceptId: knowledgeCheck.check.conceptId,
            title: knowledgeCheck.check.title,
            score: result.score,
            totalQuestions: result.total,
            missedContentIds: result.missedContentIds,
            correctContentIds: result.correctContentIds,
            durationSeconds: result.durationSeconds,
            answers: result.answers,
          }
        );
        const next = syncCurriculumIndex(applied);
        saveUserState(next);
        setKnowledgeCheck({
          check: knowledgeCheck.check,
          result: {
            score: result.score,
            total: result.total,
            outcome,
            missedContentIds: result.missedContentIds,
            record,
          },
        });
        sessionStorage.removeItem(CHECK_KEY);
        setRecommendation(recommendLesson(next));
        return next;
      });
    },
    [knowledgeCheck]
  );

  const clearKnowledgeCheck = useCallback(() => {
    setKnowledgeCheck(null);
    sessionStorage.removeItem(CHECK_KEY);
  }, []);

  const continueAfterPass = useCallback(() => {
    setKnowledgeCheck(null);
    sessionStorage.removeItem(CHECK_KEY);
  }, []);

  const continueAnyway = useCallback(() => {
    setState((prev) => {
      if (!prev || !knowledgeCheck) return prev;
      let next = setConceptStatus(
        prev,
        knowledgeCheck.check.conceptId,
        "NEEDS_REVIEW"
      );
      next = {
        ...next,
        recentLessonConceptIds: [
          knowledgeCheck.check.conceptId,
          ...next.recentLessonConceptIds.filter(
            (id) => id !== knowledgeCheck.check.conceptId
          ),
        ].slice(0, 8),
      };
      saveUserState(next);
      setKnowledgeCheck(null);
      sessionStorage.removeItem(CHECK_KEY);
      setRecommendation(recommendLesson(next, "continue"));
      return next;
    });
  }, [knowledgeCheck]);

  const startQuickReview = useCallback(() => {
    setState((prev) => {
      if (!prev || !knowledgeCheck) return prev;
      const lesson = generateQuickReview(
        knowledgeCheck.check.conceptId,
        prev,
        knowledgeCheck.result?.missedContentIds ?? []
      );
      setKnowledgeCheck(null);
      sessionStorage.removeItem(CHECK_KEY);
      setActiveLesson(lesson);
      saveActiveLesson(JSON.stringify(lesson));
      return prev;
    });
  }, [knowledgeCheck]);

  const reviewLater = useCallback(
    (conceptId?: string) => {
      setState((prev) => {
        if (!prev) return prev;
        const id = conceptId ?? recommendation?.lesson.conceptId;
        if (!id) return prev;
        const next = postponeConcept(prev, id);
        setRecommendation(recommendLesson(next, "continue"));
        return next;
      });
    },
    [recommendation]
  );

  const setDailyGoal = useCallback((lessons: 1 | 2 | 3) => {
    setState((prev) => {
      if (!prev) return prev;
      return updatePreferences(prev, { dailyGoalLessons: lessons });
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = resetUserState();
    if (user) {
      const owned = { ...fresh, userId: user.id };
      saveUserState(owned);
      void upsertCloudProgress(owned);
      setState(owned);
      setRecommendation(recommendLesson(owned));
    } else {
      setState(fresh);
      setRecommendation(recommendLesson(fresh));
    }
    setActiveLesson(null);
    setLastCompletion(null);
    setKnowledgeCheck(null);
    sessionStorage.removeItem(CHECK_KEY);
  }, [user]);

  const value = useMemo<AppContextValue | null>(() => {
    if (!state) return null;
    return {
      ready,
      state,
      recommendation,
      activeLesson,
      knowledgeCheck,
      lastCompletion,
      user,
      isGuest: !user,
      authConfigured: isInsforgeConfigured(),
      showSavePrompt,
      dismissSavePrompt,
      signUp,
      signIn,
      verifyEmail,
      signOut,
      refreshRecommendation,
      startLesson,
      discardLesson,
      completeLesson,
      clearCompletion,
      startKnowledgeCheck,
      completeKnowledgeCheck,
      clearKnowledgeCheck,
      continueAfterPass,
      continueAnyway,
      startQuickReview,
      reviewLater,
      setDailyGoal,
      resetProgress,
      categoryProgress: getCategoryProgress(state),
      weakAreas: getWeakAreas(state),
      strongAreas: getStrongAreas(state),
      welcomeBack: isWelcomeBack(state),
      lessonsToday: lessonsCompletedToday(state),
    };
  }, [
    ready,
    state,
    recommendation,
    activeLesson,
    knowledgeCheck,
    lastCompletion,
    user,
    showSavePrompt,
    dismissSavePrompt,
    signUp,
    signIn,
    verifyEmail,
    signOut,
    refreshRecommendation,
    startLesson,
    discardLesson,
    completeLesson,
    clearCompletion,
    startKnowledgeCheck,
    completeKnowledgeCheck,
    clearKnowledgeCheck,
    continueAfterPass,
    continueAnyway,
    startQuickReview,
    reviewLater,
    setDailyGoal,
    resetProgress,
  ]);

  if (!value) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
