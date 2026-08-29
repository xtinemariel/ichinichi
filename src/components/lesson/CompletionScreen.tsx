"use client";

import { useState } from "react";
import type { CompletedLessonRecord, GeneratedLesson } from "@/lib/types";
import { TeachBlocks } from "@/components/lesson/TeachBlocks";

interface Props {
  record: CompletedLessonRecord;
  struggledLabels: string[];
  lessonNotes?: GeneratedLesson["notes"];
  onDone: () => void;
  onAnother: (mode: "continue" | "review_today" | "weak_areas") => void;
  onReviewNotes?: () => void;
}

export function CompletionScreen({
  record,
  struggledLabels,
  lessonNotes,
  onDone,
  onAnother,
}: Props) {
  const [showNotes, setShowNotes] = useState(false);
  const quizScore = record.quizScore ?? record.score;
  const quizTotal = record.quizTotal ?? record.totalQuestions;
  const ratio =
    quizTotal === 0 ? 0 : Math.round((quizScore / quizTotal) * 100);

  const improvements = Object.entries(record.improvedAreas ?? {}).filter(
    ([, v]) => (v ?? 0) > 0
  );

  if (showNotes && lessonNotes) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10 animate-fade-up">
        <button
          type="button"
          onClick={() => setShowNotes(false)}
          className="text-sm text-[var(--muted)] self-start"
        >
          ← Back
        </button>
        <h1 className="mt-6 font-display text-3xl text-[var(--ink)]">
          Review lesson
        </h1>
        <p className="mt-2 text-[var(--ink-soft)]">{record.title}</p>
        <p className="mt-6 text-sm leading-relaxed text-[var(--ink-soft)]">
          {lessonNotes.summary}
        </p>
        {lessonNotes.remember.length > 0 && (
          <div className="mt-8">
            <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
              Remember
            </p>
            <ul className="mt-3 space-y-2">
              {lessonNotes.remember.map((r) => (
                <li key={r} className="text-[var(--ink)] text-[15px]">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {lessonNotes.commonMistakes.length > 0 && (
          <div className="mt-8 space-y-3">
            <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
              Common mistakes
            </p>
            {lessonNotes.commonMistakes.map((m) => (
              <div
                key={m.wrong}
                className="rounded-md border border-[var(--error)]/30 bg-[var(--error-soft)] px-4 py-3 text-sm"
              >
                {m.right ? (
                  <>
                    <p>❌ {m.wrong}</p>
                    <p className="mt-1">✅ {m.right}</p>
                  </>
                ) : (
                  <p>⚠️ {m.wrong}</p>
                )}
                {m.note && (
                  <p className="mt-2 text-[var(--muted)]">{m.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
        <TeachBlocks
          blocks={[
            {
              kind: "callout",
              variant: "tip",
              title: "No quiz required",
              body: "This is teaching material only — review anytime.",
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10 animate-fade-up">
      <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
        Lesson complete
      </p>
      <h1 className="mt-3 font-display text-4xl text-[var(--ink)] leading-tight">
        Well done
      </h1>
      <p className="mt-2 text-[var(--ink-soft)]">{record.title}</p>

      <div className="mt-10">
        <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
          Quiz
        </p>
        <div className="mt-2 flex items-end gap-3">
          <span className="font-display text-6xl text-[var(--ink)] tabular-nums">
            {quizScore}
          </span>
          <span className="mb-2 text-[var(--muted)]">/ {quizTotal}</span>
          <span className="mb-3 ml-auto text-sm text-[var(--accent)]">
            {ratio}%
          </span>
        </div>
      </div>

      {improvements.length > 0 && (
        <div className="mt-8 space-y-2">
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
            Mastery
          </p>
          {improvements.map(([area, delta]) => (
            <div
              key={area}
              className="flex justify-between border-b border-[var(--line)] py-2 text-sm capitalize"
            >
              <span>{area}</span>
              <span className="text-[var(--accent)]">+{delta}%</span>
            </div>
          ))}
        </div>
      )}

      {struggledLabels.length > 0 && (
        <div className="mt-8 space-y-2">
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
            Needs review
          </p>
          <ul className="space-y-2">
            {struggledLabels.map((label) => (
              <li
                key={label}
                className="font-jp text-[var(--ink-soft)] text-[15px]"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.nextReviewHint && (
        <p className="mt-6 text-sm text-[var(--muted)] leading-relaxed">
          {record.nextReviewHint}
        </p>
      )}

      <div className="mt-auto space-y-3 pt-12">
        {lessonNotes && (
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="btn-ghost w-full"
          >
            Review lesson notes
          </button>
        )}
        <p className="text-sm text-[var(--muted)]">Another session?</p>
        <button
          type="button"
          onClick={() => onAnother("continue")}
          className="btn-primary w-full"
        >
          Continue curriculum
        </button>
        <button
          type="button"
          onClick={() => onAnother("review_today")}
          className="btn-ghost w-full"
        >
          Practice this topic again
        </button>
        <button
          type="button"
          onClick={() => onAnother("weak_areas")}
          className="btn-ghost w-full"
        >
          Practice weak areas
        </button>
        <button
          type="button"
          onClick={onDone}
          className="w-full py-3 text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          Done for now
        </button>
      </div>
    </div>
  );
}
