"use client";

import { ReferenceExample } from "@/components/reference/ReferenceExample";
import type { ReferenceCompare } from "@/curriculum/quickReference/types";

interface Props {
  compare: ReferenceCompare;
}

export function ReferenceCompareView({ compare }: Props) {
  return (
    <div id={compare.id} className="scroll-mt-24 space-y-3 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-4">
      <h3 className="font-display text-lg text-[var(--ink)]">{compare.title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {compare.items.map((item) => (
          <div key={item.label} className="rounded-md bg-[var(--surface)] px-3 py-3 space-y-2">
            <p className="font-jp text-base text-[var(--accent)]">{item.label}</p>
            <p className="text-sm text-[var(--ink-soft)]">{item.summary}</p>
            <ReferenceExample example={item.example} compact />
          </div>
        ))}
      </div>
      {compare.note && (
        <p className="text-sm text-[var(--muted)] leading-relaxed">{compare.note}</p>
      )}
    </div>
  );
}
