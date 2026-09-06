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
import { ReferenceLessonLink } from "@/components/reference/ReferenceLessonLink";
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
  "review",
  "learn",
  "examples",
  "quiz",
];

const PHASE_META: Record<
  PhaseKind,
  { label: string; tone: string }
> = {
  review: { label: "Review", tone: "practice" },
  learn: { label: "Learn", tone: "teaching" },
  examples: { label: "Examples", tone: "teaching" },
  quiz: { label: "Quiz", tone: "assessment" },
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
  /** Extra retry exercises injected before the quiz's final recall question. */
  const [extraExercises, setExtraExercises] = useState<
    Record<number, Exercise[]>
  >({});

  const phase = lesson.phases[step.phaseIndex];
  const phaseExercises = useMemo(() => {
    const extras = extraExercises[step.phaseIndex] ?? [];
    const exercises = phase?.exercises ?? [];
    if (phase?.kind === "quiz" && exercises.length > 1) {
      return [...exercises.slice(0, -1), ...extras, exercises[exercises.length - 1]];
    }
    return [...exercises, ...extras];
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

    // Adaptive: keep retries in the same flow, before the final recall item.
    const isFinalRecall =
      phase.kind === "quiz" &&
      exercise.id === phase.exercises[phase.exercises.length - 1]?.id;
    const supportsRetry =
      !isFinalRecall && (phase.kind === "quiz" || phase.mode === "practice");
    if (
      !correct &&
      supportsRetry &&
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

    const effectiveLen =
      phase.exercises.length +
      (extraExercises[step.phaseIndex]?.length ?? 0) +
      (!correct && supportsRetry && (extraExercises[step.phaseIndex]?.length ?? 0) < 2
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
                className="rounded-md border border-[var(--error)]/30 bg-[var(--error-soft)] px-4 py-3 text-sm"
              >
                {m.right ? (
                  <>
                    <p className="text-[var(--ink-soft)]">❌ {m.wrong}</p>
                    <p className="mt-1 text-[var(--ink)]">✅ {m.right}</p>
                  </>
                ) : (
                  <p className="text-[var(--ink)]">⚠️ {m.wrong}</p>
                )}
                {m.note && (
                  <p className="mt-2 text-[var(--muted)]">{m.note}</p>
                )}
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
        <div className="flex items-center gap-3">
          {phase?.kind === "review" && phase.skippable && (
            <button
              type="button"
              onClick={() => goToPhase(step.phaseIndex + 1)}
              className="text-xs text-[var(--muted)] hover:text-[var(--primary)]"
            >
              Skip review
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Notes
          </button>
        </div>
      </header>

      <div className="mb-2 text-center">
        <p className="text-sm text-[var(--ink-soft)]">{lesson.title}</p>
        <ReferenceLessonLink conceptId={lesson.conceptId} />
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
        className={`mb-6 rounded-md border px-3 py-2 ${
          meta.tone === "assessment"
            ? "border-[var(--secondary)]/25 bg-[var(--surface)]"
            : meta.tone === "teaching"
              ? "border-[var(--accent-soft)] bg-[var(--primary-soft)]/45"
              : "border-[var(--border)] bg-[var(--surface)]"
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
                — from recognition to recall
              </span>
            )}
            {meta.tone === "practice" && phase?.kind === "review" && (
              <span className="ml-2 font-normal normal-case tracking-normal text-[var(--muted)]">
                — quick warm-up
              </span>
            )}
          </span>
          <span className="tabular-nums text-[var(--muted)]">
            {step.kind === "exercise" && phase?.kind === "quiz"
              ? `${step.exerciseIndex + 1} / ${phaseExercises.length}`
              : `~${minutesLeft}m`}
          </span>
        </div>
        <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-[var(--progress-track)]">
          <div
            className="h-full rounded-full bg-[var(--progress-fill)] transition-all duration-500"
            style={{
              width:
                step.kind === "exercise" && phase?.kind === "quiz"
                  ? `${((step.exerciseIndex + 1) / phaseExercises.length) * 100}%`
                  : `${((step.phaseIndex + (isTeaching ? 0.3 : 0.7)) / lesson.phases.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex-1">
        {step.kind === "teach" && phase?.teachBlocks && (
          <div className="space-y-8">
            <TeachBlocks blocks={phase.teachBlocks} />
            <div className="flex flex-col gap-3">
              {phase.skippable && phase.kind === "review" && (
                <button
                  type="button"
                  onClick={() => goToPhase(step.phaseIndex + 1)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-secondary)] hover:border-[var(--accent-soft)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                >
                  Skip review — I know this already
                </button>
              )}
              <button
                type="button"
                onClick={advanceFromTeach}
                className="btn-primary w-full"
              >
                {phase.exercises.length > 0
                  ? phase.kind === "review"
                    ? "Start review"
                    : "Start quiz"
                  : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step.kind === "exercise" && phase && phaseExercises[step.exerciseIndex] && (
          <ExerciseRenderer
            key={phaseExercises[step.exerciseIndex].id}
            exercise={phaseExercises[step.exerciseIndex]}
            mode={phase.kind === "quiz" ? "practice" : phase.mode === "assessment" ? "assessment" : "practice"}
            allowRetry={
              phaseExercises[step.exerciseIndex].id !==
                phase.exercises[phase.exercises.length - 1]?.id &&
              (phase.kind === "quiz" || phase.mode === "practice")
            }
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
