"use client";

import type { KnowledgeCheckOutcome } from "@/lib/types";
import { labelForContentId } from "@/engine/progress";

interface Props {
  title: string;
  score: number;
  total: number;
  outcome: KnowledgeCheckOutcome;
  missedContentIds: string[];
  onPassContinue: () => void;
  onQuickReview: () => void;
  onContinueAnyway: () => void;
  onStartLesson: () => void;
}

export function KnowledgeCheckResult({
  title,
  score,
  total,
  outcome,
  missedContentIds,
  onPassContinue,
  onQuickReview,
  onContinueAnyway,
  onStartLesson,
}: Props) {
  if (outcome === "pass") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10 animate-fade-up">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
          Knowledge check complete
        </p>
        <p className="mt-6 font-display text-5xl tabular-nums text-[var(--ink)]">
          {score}
          <span className="text-2xl text-[var(--muted)]"> / {total}</span>
        </p>
        <h1 className="mt-6 font-display text-3xl text-[var(--ink)] leading-tight">
          You&apos;ve got this
        </h1>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          You already understand <span className="text-[var(--ink)]">{title}</span>{" "}
          well, so we&apos;ll move you forward. It can still appear in future
          reviews.
        </p>
        <button
          type="button"
          onClick={onPassContinue}
          className="btn-primary mt-auto w-full"
        >
          Continue to next lesson
        </button>
      </div>
    );
  }

  if (outcome === "borderline") {
    const missed = missedContentIds.slice(0, 3).map(labelForContentId);
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10 animate-fade-up">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
          Knowledge check complete
        </p>
        <p className="mt-6 font-display text-5xl tabular-nums text-[var(--ink)]">
          {score}
          <span className="text-2xl text-[var(--muted)]"> / {total}</span>
        </p>
        <h1 className="mt-6 font-display text-3xl text-[var(--ink)] leading-tight">
          Almost there
        </h1>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          You understand the basics, but a few areas are worth reviewing.
        </p>
        {missed.length > 0 && (
          <ul className="mt-6 space-y-2 text-sm text-[var(--ink-soft)]">
            {missed.map((m) => (
              <li key={m}>· {m}</li>
            ))}
          </ul>
        )}
        <div className="mt-auto space-y-3">
          <button
            type="button"
            onClick={onQuickReview}
            className="btn-primary w-full"
          >
            Quick review
          </button>
          <button
            type="button"
            onClick={onContinueAnyway}
            className="btn-ghost w-full"
          >
            Continue anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10 animate-fade-up">
      <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
        Knowledge check complete
      </p>
      <p className="mt-6 font-display text-5xl tabular-nums text-[var(--ink)]">
        {score}
        <span className="text-2xl text-[var(--muted)]"> / {total}</span>
      </p>
      <h1 className="mt-6 font-display text-3xl text-[var(--ink)] leading-tight">
        Let&apos;s learn this one
      </h1>
      <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
        You already recognize some of it, but a full lesson will help fill the
        gaps — no pressure.
      </p>
      <button
        type="button"
        onClick={onStartLesson}
        className="btn-primary mt-auto w-full"
      >
        Start 20-min lesson
      </button>
    </div>
  );
}
