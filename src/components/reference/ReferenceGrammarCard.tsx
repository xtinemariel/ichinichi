"use client";

import { ReferenceExample } from "@/components/reference/ReferenceExample";
import type { ReferenceGrammarEntry } from "@/curriculum/quickReference/types";

interface Props {
  entry: ReferenceGrammarEntry;
}

export function ReferenceGrammarCard({ entry }: Props) {
  return (
    <article
      id={entry.id}
      className="scroll-mt-24 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 space-y-2"
    >
      <h3 className="font-jp text-lg text-[var(--accent)]">{entry.pattern}</h3>
      <p className="text-sm text-[var(--ink-soft)]">
        <span className="text-xs uppercase tracking-wide text-[var(--muted)] mr-2">Meaning</span>
        {entry.meaning}
      </p>
      {entry.form && (
        <p className="text-sm text-[var(--ink-soft)]">
          <span className="text-xs uppercase tracking-wide text-[var(--muted)] mr-2">Pattern</span>
          <span className="font-jp">{entry.form}</span>
        </p>
      )}
      <ReferenceExample example={entry.example} compact />
      {entry.negative && (
        <div className="pt-1">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Negative</p>
          <ReferenceExample example={entry.negative} compact />
        </div>
      )}
      {entry.note && (
        <p className="text-xs text-[var(--muted)] italic pt-1">{entry.note}</p>
      )}
    </article>
  );
}
