"use client";

import type { VocabRating } from "@/lib/types";

interface Props {
  onRate: (rating: VocabRating) => void;
  disabled?: boolean;
}

const buttons: Array<{
  rating: VocabRating;
  label: string;
  hint: string;
  className: string;
}> = [
  {
    rating: "again",
    label: "Again",
    hint: "Soon",
    className:
      "border-[var(--error)]/30 bg-[var(--error-soft)] text-[var(--error)] hover:border-[var(--error)]/50",
  },
  {
    rating: "hard",
    label: "Hard",
    hint: "Later today",
    className:
      "border-[var(--accent-warm)]/40 bg-[var(--accent-warm-soft)] text-[var(--ink)] hover:border-[var(--accent-warm)]/60",
  },
  {
    rating: "good",
    label: "Good",
    hint: "Tomorrow",
    className:
      "border-[var(--primary)]/30 bg-[var(--primary-soft)] text-[var(--primary)] hover:border-[var(--primary)]/50",
  },
  {
    rating: "easy",
    label: "Easy",
    hint: "Later",
    className:
      "border-[var(--info)]/30 bg-[var(--info-soft)] text-[var(--info)] hover:border-[var(--info)]/50",
  },
];

export function VocabRatingBar({ onRate, disabled }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-center text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
        How well did you know it?
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {buttons.map((btn) => (
          <button
            key={btn.rating}
            type="button"
            disabled={disabled}
            onClick={() => onRate(btn.rating)}
            className={`rounded-md border px-3 py-3 text-center transition-colors disabled:opacity-50 ${btn.className}`}
          >
            <span className="block text-sm font-medium">{btn.label}</span>
            <span className="mt-0.5 block text-[10px] opacity-70">{btn.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
