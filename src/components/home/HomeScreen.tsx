"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useApp } from "@/components/AppProvider";
import { greetingForNow } from "@/lib/dates";
import { SaveProgressPrompt } from "@/components/auth/SaveProgressPrompt";

function HomeScreenInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state,
    recommendation,
    categoryProgress,
    welcomeBack,
    lessonsToday,
    startLesson,
    startKnowledgeCheck,
    reviewLater,
    isGuest,
    user,
    showSavePrompt,
    dismissSavePrompt,
    signOut,
    authConfigured,
  } = useApp();

  useEffect(() => {
    if (searchParams.get("save") === "1" && isGuest && showSavePrompt) {
      // prompt renders below
    }
  }, [searchParams, isGuest, showSavePrompt]);

  if (isGuest && showSavePrompt && searchParams.get("save") === "1") {
    return (
      <SaveProgressPrompt
        onLater={() => {
          dismissSavePrompt();
          router.replace("/");
        }}
      />
    );
  }

  if (!recommendation) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[var(--muted)]">
        Preparing today’s lesson…
      </div>
    );
  }

  const { lesson, nextUp } = recommendation;
  const goal = state.preferences.dailyGoalLessons;
  const goalMet = lessonsToday >= goal;

  return (
    <div className="mx-auto max-w-lg px-5 pb-28 pt-10">
      <header className="animate-fade-up">
        <p className="font-display text-sm tracking-[0.25em] text-[var(--accent)]">
          一日
        </p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">
          Japanese N5
        </h1>
        <p className="mt-3 text-[var(--ink-soft)]">
          {welcomeBack
            ? "Welcome back"
            : user?.name
              ? `Hello, ${user.name.split("@")[0]}`
              : greetingForNow()}
        </p>
        <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
          Day {state.dayNumber}
          {user?.email ? ` · ${user.email}` : ""}
        </p>
      </header>

      {welcomeBack && (
        <div className="animate-fade-up mt-8 border border-[var(--line)] bg-[var(--wash)] px-4 py-4 text-sm leading-relaxed text-[var(--ink-soft)]">
          No worries about the missed days. Today we&apos;ll review what
          matters most, then continue your path.
        </div>
      )}

      <section className="animate-fade-up mt-12 delay-1">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
          Today&apos;s lesson
        </p>
        <h2 className="mt-3 font-display text-3xl leading-tight text-[var(--ink)]">
          {lesson.title}
        </h2>
        <p className="mt-2 text-sm text-[var(--accent)]">{lesson.subtitle}</p>
        <p className="mt-1 text-xs tracking-wide text-[var(--muted)]">
          {lesson.estimatedMinutes} min
        </p>
        <p className="mt-5 text-[var(--ink-soft)] leading-relaxed">
          {lesson.description}
        </p>

        <button
          type="button"
          onClick={() => {
            startLesson(lesson);
            router.push("/lesson");
          }}
          className="btn-primary mt-8 w-full"
        >
          {goalMet ? "Start another lesson" : "Start lesson"}
        </button>

        <div className="mt-6 space-y-3 text-center">
          <p className="text-sm text-[var(--muted)]">Already know this?</p>
          <button
            type="button"
            onClick={() => {
              startKnowledgeCheck(lesson.conceptId);
              router.push("/check");
            }}
            className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Check my knowledge
          </button>
          <div>
            <button
              type="button"
              onClick={() => reviewLater(lesson.conceptId)}
              className="text-xs text-[var(--muted)] hover:text-[var(--ink-soft)]"
            >
              Review later
            </button>
          </div>
        </div>

        {goalMet && (
          <p className="mt-3 text-center text-xs text-[var(--muted)]">
            Daily goal reached · {lessonsToday}/{goal} lessons
          </p>
        )}
      </section>

      {isGuest ? (
        <section className="animate-fade-up mt-14 delay-2 border-t border-[var(--line)] pt-8">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            Guest mode
          </p>
          <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
            Your progress isn&apos;t being saved permanently.
          </p>
          {authConfigured && (
            <button
              type="button"
              className="btn-primary mt-5 w-full"
              onClick={() => router.push("/auth")}
            >
              Create Account
            </button>
          )}
        </section>
      ) : (
        <section className="animate-fade-up mt-14 delay-2">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            N5 Progress
          </p>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="font-display text-4xl tabular-nums text-[var(--ink)]">
                {categoryProgress.overall}%
              </p>
            </div>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[var(--accent)]/20">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all"
                style={{ width: `${categoryProgress.overall}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn-primary mt-6 w-full"
            onClick={() => {
              startLesson(lesson);
              router.push("/lesson");
            }}
          >
            Continue Learning
          </button>
          <button
            type="button"
            className="mt-4 w-full text-center text-xs text-[var(--muted)] hover:text-[var(--ink-soft)]"
            onClick={() => void signOut()}
          >
            Log out
          </button>
        </section>
      )}

      {isGuest && (
        <section className="animate-fade-up mt-10 delay-2">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            Your progress
          </p>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-sm text-[var(--ink-soft)]">N5</p>
              <p className="font-display text-4xl tabular-nums text-[var(--ink)]">
                {categoryProgress.overall}%
              </p>
            </div>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[var(--accent)]/20">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all"
                style={{ width: `${categoryProgress.overall}%` }}
              />
            </div>
          </div>
        </section>
      )}

      {nextUp && (
        <section className="animate-fade-up mt-14 delay-3 border-t border-[var(--line)] pt-8">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            Next up
          </p>
          <p className="mt-3 text-[var(--ink)]">{nextUp.title}</p>
          <p className="text-sm text-[var(--muted)]">{nextUp.when}</p>
        </section>
      )}
    </div>
  );
}

export function HomeScreen() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <HomeScreenInner />
    </Suspense>
  );
}
