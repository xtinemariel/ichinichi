"use client";

import { useState } from "react";
import type { Exercise, KnowledgeCheck } from "@/lib/types";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";

interface Props {
  check: KnowledgeCheck;
  onComplete: (result: {
    score: number;
    total: number;
    answers: Array<{
      exerciseId: string;
      contentId?: string;
      contentType?: Exercise["contentType"];
      correct: boolean;
      userAnswer: string;
    }>;
    missedContentIds: string[];
    correctContentIds: string[];
    durationSeconds: number;
  }) => void;
  onExit: () => void;
}

export function KnowledgeCheckPlayer({ check, onComplete, onExit }: Props) {
  const [startedAt] = useState(Date.now);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{
      exerciseId: string;
      contentId?: string;
      contentType?: Exercise["contentType"];
      correct: boolean;
      userAnswer: string;
    }>
  >([]);

  const exercise = check.exercises[index];
  const total = check.exercises.length;

  const handleResult = (correct: boolean, userAnswer: string) => {
    const entry = {
      exerciseId: exercise.id,
      contentId: exercise.contentId,
      contentType: exercise.contentType,
      correct,
      userAnswer,
    };
    const nextAnswers = [...answers, entry];
    const nextScore = score + (correct ? 1 : 0);
    setAnswers(nextAnswers);
    setScore(nextScore);

    if (index + 1 >= total) {
      const missed = nextAnswers
        .filter((a) => !a.correct && a.contentId)
        .map((a) => a.contentId!);
      const correctIds = nextAnswers
        .filter((a) => a.correct && a.contentId)
        .map((a) => a.contentId!);
      onComplete({
        score: nextScore,
        total,
        answers: nextAnswers,
        missedContentIds: [...new Set(missed)],
        correctContentIds: [...new Set(correctIds)],
        durationSeconds: Math.round((Date.now() - startedAt) / 1000),
      });
      return;
    }
    setIndex(index + 1);
  };

  if (!exercise) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">
        No questions available.
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 pb-10 pt-4">
      <header className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← Exit
        </button>
        <p className="text-xs tabular-nums text-[var(--muted)]">~2 min</p>
      </header>

      <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
        Knowledge check
      </p>
      <h1 className="mt-1 font-display text-2xl text-[var(--ink)]">
        {check.title}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Question {index + 1} of {total}
      </p>

      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-[var(--progress-track)]">
        <div
          className="h-full rounded-full bg-[var(--progress-fill)] transition-all"
          style={{ width: `${((index + 0.2) / total) * 100}%` }}
        />
      </div>

      <div className="mt-10 flex-1">
        <ExerciseRenderer
          key={exercise.id}
          exercise={exercise}
          mode="assessment"
          onResult={handleResult}
        />
      </div>
    </div>
  );
}
