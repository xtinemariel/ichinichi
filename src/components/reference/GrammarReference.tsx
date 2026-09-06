"use client";

import { ReferenceCategoryLayout } from "@/components/reference/ReferenceCategoryLayout";
import { ReferenceExample } from "@/components/reference/ReferenceExample";
import { ReferenceGrammarCard } from "@/components/reference/ReferenceGrammarCard";
import { ReferenceSection } from "@/components/reference/ReferenceSection";
import { ReferenceTableView } from "@/components/reference/ReferenceTable";
import {
  COUNTERS_TABLE,
  DAYS_OF_WEEK,
  GRAMMAR_GROUPS,
  SENTENCE_PATTERNS,
  TIME_REFERENCE,
} from "@/curriculum/quickReference/grammar";

export function GrammarReference() {
  return (
    <ReferenceCategoryLayout title="Grammar">
      <ReferenceSection
        id="grammar-patterns"
        title="Essential patterns"
        intro="Grouped by function — scan what you need."
      >
        <div className="space-y-8">
          {GRAMMAR_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
                {group.title}
              </h3>
              <div className="space-y-3">
                {group.entries.map((entry) => (
                  <ReferenceGrammarCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ReferenceSection>

      <ReferenceSection
        id="sentence-patterns"
        title="Sentence templates"
        intro="High-frequency structures at a glance."
      >
        <div className="space-y-4">
          {SENTENCE_PATTERNS.map((sp) => (
            <div key={sp.pattern} className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <p className="font-jp text-sm text-[var(--accent)]">{sp.pattern}</p>
              <div className="mt-2">
                <ReferenceExample example={sp.example} compact />
              </div>
            </div>
          ))}
        </div>
      </ReferenceSection>

      <ReferenceSection id="counters" title="Numbers & counters">
        <ReferenceTableView table={COUNTERS_TABLE} compact />
      </ReferenceSection>

      <ReferenceSection id="time" title="Time & dates">
        <ReferenceTableView table={TIME_REFERENCE} compact />
        <div className="mt-6">
          <p className="mb-3 text-xs tracking-[0.15em] uppercase text-[var(--muted)]">Days of the week</p>
          <ReferenceTableView table={DAYS_OF_WEEK} compact />
        </div>
      </ReferenceSection>
    </ReferenceCategoryLayout>
  );
}
