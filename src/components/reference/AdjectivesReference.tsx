"use client";

import { ReferenceCallout } from "@/components/reference/ReferenceCallout";
import { ReferenceCategoryLayout } from "@/components/reference/ReferenceCategoryLayout";
import { ReferenceExample } from "@/components/reference/ReferenceExample";
import { ReferenceSection } from "@/components/reference/ReferenceSection";
import { ReferenceTableView } from "@/components/reference/ReferenceTable";
import {
  ADJ_COMPARE,
  I_ADJ_RULES,
  I_ADJ_TABLE,
  II_IRREGULAR,
  NA_ADJ_TABLE,
} from "@/curriculum/quickReference/adjectives";

export function AdjectivesReference() {
  return (
    <ReferenceCategoryLayout title="Adjectives">
      <ReferenceSection
        id="i-adj"
        title="い-adjectives"
        intro="Example: 高い (expensive / tall)"
      >
        <ReferenceTableView table={I_ADJ_TABLE} />
        <ReferenceCallout
          title="Rules"
          body={I_ADJ_RULES.join("\n")}
        />
      </ReferenceSection>

      <ReferenceSection
        id="na-adj"
        title="な-adjectives"
        intro="Example: 静か (quiet) — conjugate like nouns, not like い-adjectives."
      >
        <ReferenceTableView table={NA_ADJ_TABLE} />
      </ReferenceSection>

      <ReferenceSection id="ii-irregular" title="いい — irregular">
        <ReferenceTableView table={II_IRREGULAR} compact />
        <ReferenceCallout
          variant="remember"
          title="Key pattern"
          body="いい → よくない · よかった · よくなかった"
        />
      </ReferenceSection>

      <ReferenceSection id="adj-compare" title="Quick compare">
        <ReferenceExample example={ADJ_COMPARE.example} />
        <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{ADJ_COMPARE.meaning}</p>
      </ReferenceSection>
    </ReferenceCategoryLayout>
  );
}
