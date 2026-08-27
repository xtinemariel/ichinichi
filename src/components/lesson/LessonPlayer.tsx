"use client";

import { useMemo, useState } from "react";
import type {
  Exercise,
  GeneratedLesson,
  LessonPhase,
  LessonResult,
  PhaseKind,
} from "@/lib/types";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import { TeachBlocks } from "@/components/lesson/TeachBlocks";
import { uid } from "@/lib/dates";

interface Props {
  lesson: GeneratedLesson;
  onComplete: (result: LessonResult) => void;
  onExit: () => void;
}

type Step =
  | { kind: "teach"; phaseIndex: number }
  | { kind: "exercise"; phaseIndex: number; exerciseIndex: number };

const PHASE_ORDER: PhaseKind[] = [
  "intro",
  "review",
  "learn",
  "examples",
  "quiz",
];

const PHASE_META: Record<
  PhaseKind,
  { label: string; tone: string }
> = {
  intro: { label: "Lesson", tone: "teaching" },
  review: { label: "Review", tone: "practice" },
  learn: { label: "Learn", tone: "teaching" },
  examples: { label: "Examples", tone: "teaching" },
  practice: { label: "Practice", tone: "practice" },
  recall: { label: "Recall", tone: "practice" },
  quiz: { label: "Check", tone: "assessment" },
};

function initialStep(phases: LessonPhase[]): Step {
  const first = phases[0];
  if (first.mode === "teaching" || (first.teachBlocks?.length && !first.exercises.length)) {
    return { kind: "teach", phaseIndex: 0 };
  }
  if (first.teachBlocks?.length) return { kind: "teach", phaseIndex: 0 };
  return { kind: "exercise", phaseIndex: 0, exerciseIndex: 0 };
}

export function LessonPlayer({ lesson, onComplete, onExit }: Props) {
  const startedAt = useMemo(() => new Date().toISOString(), []);
  const [step, setStep] = useState<Step>(() => initialStep(lesson.phases));
  const [answers, setAnswers] = useState<LessonResult["answers"]>([]);
  const [score, setScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceTotal, setPracticeTotal] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  /** Extra retry exercises injected after practice mistakes */
  const [extraExercises, setExtraExercises] = useState<
    Record<number, Exercise[]>
  >({});

  const phase = lesson.phases[step.phaseIndex];
  const phaseExercises = useMemo(() => {
    const extras = extraExercises[step.phaseIndex] ?? [];
    return [...(phase?.exercises ?? []), ...extras];
  }, [phase, extraExercises, step.phaseIndex]);

  const trackPhases = useMemo(() => {
    const present = new Set(lesson.phases.map((p) => p.kind));
    return PHASE_ORDER.filter((k) => present.has(k));
  }, [lesson.phases]);

  const currentTrackIndex = trackPhases.indexOf(phase?.kind ?? "learn");

  const progressRatio = (step.phaseIndex + 0.5) / lesson.phases.length;
  const minutesLeft = Math.max(
    1,
    Math.round(lesson.estimatedMinutes * (1 - Math.min(0.95, progressRatio)))
  );

  const finish = (
    finalAnswers: LessonResult["answers"],
    totals: {
      score: number;
      quizScore: number;
      quizTotal: number;
      practiceScore: number;
      practiceTotal: number;
    }
  ) => {
    onComplete({
      lessonId: lesson.id,
      conceptId: lesson.conceptId,
      score: totals.score,
      totalQuestions: Math.max(finalAnswers.length, 1),
      quizScore: totals.quizScore,
      quizTotal: totals.quizTotal,
      practiceScore: totals.practiceScore,
      practiceTotal: totals.practiceTotal,
      answers: finalAnswers,
      durationSeconds: Math.round(
        (Date.now() - new Date(startedAt).getTime()) / 1000
      ),
      startedAt,
      completedAt: new Date().toISOString(),
    });
  };

  const goToPhase = (phaseIndex: number) => {
    if (phaseIndex >= lesson.phases.length) {
      finish(answers, {
        score,
        quizScore,
        quizTotal,
        practiceScore,
        practiceTotal,
      });
      return;
    }
    const next = lesson.phases[phaseIndex];
    if (next.mode === "teaching" || (next.teachBlocks?.length && next.exercises.length === 0)) {
      setStep({ kind: "teach", phaseIndex });
      return;
    }
    if (next.teachBlocks?.length && next.exercises.length > 0) {
      setStep({ kind: "teach", phaseIndex });
      return;
    }
    setStep({ kind: "exercise", phaseIndex, exerciseIndex: 0 });
  };

  const advanceFromTeach = () => {
    const p = lesson.phases[step.phaseIndex];
    if (p.exercises.length > 0 || (extraExercises[step.phaseIndex]?.length ?? 0) > 0) {
      setStep({
        kind: "exercise",
        phaseIndex: step.phaseIndex,
        exerciseIndex: 0,
      });
      return;
    }
    goToPhase(step.phaseIndex + 1);
  };

  const handleExerciseResult = (
    exercise: Exercise,
    correct: boolean,
    userAnswer: string
  ) => {
    const isQuiz = phase.mode === "assessment" || exercise.countsAsQuiz;
    const entry = {
      exerciseId: exercise.id,
      contentId: exercise.contentId,
      contentType: exercise.contentType,
      correct,
      isProduction: exercise.isProduction,
      countsAsQuiz: isQuiz,
      userAnswer,
    };
    const nextAnswers = [...answers, entry];
    const nextScore = score + (correct ? 1 : 0);
    let nextQuizScore = quizScore;
    let nextQuizTotal = quizTotal;
    let nextPracticeScore = practiceScore;
    let nextPracticeTotal = practiceTotal;

    if (isQuiz) {
      nextQuizTotal += 1;
      if (correct) nextQuizScore += 1;
    } else {
      nextPracticeTotal += 1;
      if (correct) nextPracticeScore += 1;
    }

    setAnswers(nextAnswers);
    setScore(nextScore);
    setQuizScore(nextQuizScore);
    setQuizTotal(nextQuizTotal);
    setPracticeScore(nextPracticeScore);
    setPracticeTotal(nextPracticeTotal);

    // Adaptive: on practice miss, queue a similar retry if possible
    if (
      !correct &&
      phase.mode === "practice" &&
      exercise.contentId &&
      (extraExercises[step.phaseIndex]?.length ?? 0) < 2
    ) {
      const retry: Exercise = {
        ...exercise,
        id: uid("retry"),
        prompt: exercise.prompt.startsWith("Try again")
          ? exercise.prompt
          : `Try another: ${exercise.prompt}`,
      };
      setExtraExercises((prev) => ({
        ...prev,
        [step.phaseIndex]: [...(prev[step.phaseIndex] ?? []), retry],
      }));
    }

    if (step.kind !== "exercise") return;

    const list = [
      ...(phase.exercises ?? []),
      ...(extraExercises[step.phaseIndex] ?? []),
      // account for retry just added
    ];
    const effectiveLen =
      phase.exercises.length +
      (extraExercises[step.phaseIndex]?.length ?? 0) +
      (!correct && phase.mode === "practice" && (extraExercises[step.phaseIndex]?.length ?? 0) < 2
        ? 1
        : 0);

    if (step.exerciseIndex + 1 < effectiveLen) {
      setStep({
        kind: "exercise",
        phaseIndex: step.phaseIndex,
        exerciseIndex: step.exerciseIndex + 1,
      });
      return;
    }

    // Use latest extras length after state update — finish phase
    void list;
    const totals = {
      score: nextScore,
      quizScore: nextQuizScore,
      quizTotal: nextQuizTotal,
      practiceScore: nextPracticeScore,
      practiceTotal: nextPracticeTotal,
    };

    if (step.phaseIndex + 1 >= lesson.phases.length) {
      finish(nextAnswers, totals);
      return;
    }
    goToPhase(step.phaseIndex + 1);
  };

  const meta = PHASE_META[phase?.kind ?? "learn"];
  const isTeaching = step.kind === "teach";

  if (showNotes) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-10 pt-4">
        <button
          type="button"
          onClick={() => setShowNotes(false)}
          className="text-sm text-[var(--muted)] self-start"
        >
          ← Back to lesson
        </button>
        <h1 className="mt-6 font-display text-3xl text-[var(--ink)]">
          Lesson notes
        </h1>
        <p className="mt-2 text-[var(--ink-soft)]">{lesson.title}</p>
        <p className="mt-6 text-sm text-[var(--ink-soft)] leading-relaxed">
          {lesson.notes.summary}
        </p>
        {lesson.notes.remember.length > 0 && (
          <div className="mt-8">
            <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
              Remember
            </p>
            <ul className="mt-3 space-y-2">
              {lesson.notes.remember.map((r) => (
                <li key={r} className="font-jp text-[var(--ink)] text-lg">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {lesson.notes.commonMistakes.length > 0 && (
          <div className="mt-8 space-y-3">
            <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
              Common mistakes
            </p>
            {lesson.notes.commonMistakes.map((m) => (
              <div
                key={m.wrong}
                className="rounded-sm border border-[var(--danger)]/20 bg-[var(--danger-wash)] px-4 py-3 text-sm"
              >
                <p className="text-[var(--ink-soft)]">❌ {m.wrong}</p>
                <p className="mt-1 text-[var(--ink)]">✅ {m.right}</p>
                <p className="mt-2 text-[var(--muted)]">{m.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-10 pt-4">
      <header className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← Exit
        </button>
        <button
          type="button"
          onClick={() => setShowNotes(true)}
          className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
        >
          Notes
        </button>
      </header>

      <div className="mb-2 text-center">
        <p className="text-sm text-[var(--ink-soft)]">{lesson.title}</p>
      </div>

      {/* Phase track */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] tracking-wide">
        {trackPhases.map((kind, i) => {
          const done = i < currentTrackIndex;
          const current = i === currentTrackIndex;
          return (
            <span key={kind} className="flex items-center gap-2">
              <span
                className={
                  current
                    ? "font-medium text-[var(--accent)]"
                    : done
                      ? "text-[var(--ink)]"
                      : "text-[var(--muted)]"
                }
              >
                {done ? "✓ " : current ? "● " : "○ "}
                {PHASE_META[kind].label.toUpperCase()}
              </span>
              {i < trackPhases.length - 1 && (
                <span className="text-[var(--line)]">·</span>
              )}
            </span>
          );
        })}
      </div>

      <div
        className={`mb-6 rounded-sm border px-3 py-2 ${
          meta.tone === "assessment"
            ? "border-[var(--ink)]/20 bg-[var(--wash)]"
            : meta.tone === "teaching"
              ? "border-[var(--accent-soft)] bg-[var(--accent-wash)]/50"
              : "border-[var(--line)] bg-[var(--paper)]"
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="tracking-[0.15em] uppercase text-[var(--ink)]">
            {meta.label}
            {meta.tone === "teaching" && (
              <span className="ml-2 font-normal normal-case tracking-normal text-[var(--muted)]">
                — reading & learning
              </span>
            )}
            {meta.tone === "assessment" && (
              <span className="ml-2 font-normal normal-case tracking-normal text-[var(--muted)]">
                — check what you learned
              </span>
            )}
            {meta.tone === "practice" && phase?.kind === "review" && (
              <span className="ml-2 font-normal normal-case tracking-normal text-[var(--muted)]">
                — quick warm-up
              </span>
            )}
          </span>
          <span className="tabular-nums text-[var(--muted)]">~{minutesLeft}m</span>
        </div>
        <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{
              width: `${((step.phaseIndex + (isTeaching ? 0.3 : 0.7)) / lesson.phases.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex-1">
        {step.kind === "teach" && phase?.teachBlocks && (
          <div className="space-y-8">
            <TeachBlocks blocks={phase.teachBlocks} />
            <button
              type="button"
              onClick={advanceFromTeach}
              className="btn-primary w-full"
            >
              {phase.exercises.length > 0 ? "Start check" : "Continue"}
            </button>
          </div>
        )}

        {step.kind === "exercise" && phase && phaseExercises[step.exerciseIndex] && (
          <ExerciseRenderer
            key={phaseExercises[step.exerciseIndex].id}
            exercise={phaseExercises[step.exerciseIndex]}
            mode={phase.mode === "assessment" ? "assessment" : "practice"}
            onResult={(correct, userAnswer) =>
              handleExerciseResult(
                phaseExercises[step.exerciseIndex],
                correct,
                userAnswer
              )
            }
          />
        )}
      </div>
    </div>
  );
}
