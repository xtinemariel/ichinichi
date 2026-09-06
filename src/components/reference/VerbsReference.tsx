"use client";

import { ReferenceCallout } from "@/components/reference/ReferenceCallout";
import { ReferenceCategoryLayout } from "@/components/reference/ReferenceCategoryLayout";
import { ReferenceGrammarCard } from "@/components/reference/ReferenceGrammarCard";
import { ReferenceSection } from "@/components/reference/ReferenceSection";
import { ReferenceTableView } from "@/components/reference/ReferenceTable";
import {
  IRREGULAR_VERBS,
  NAI_FORM_RULES,
  TE_TA_FORM_RULES,
  U_VERB_MASU_TABLE,
  VERB_FORM_TABLE,
  VERB_FORM_USES,
  VERB_GROUPS_TABLE,
} from "@/curriculum/quickReference/verbs";

export function VerbsReference() {
  return (
    <ReferenceCategoryLayout title="Verbs">
      <ReferenceSection
        id="verb-forms"
        title="Core verb forms"
        intro="Same endings for every verb group — compare 食べる, 飲む, and 行く."
      >
        <div className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="bg-[var(--wash)] text-left text-xs tracking-wide text-[var(--muted)]">
                <th className="px-3 py-2.5 font-medium">Form</th>
                <th className="px-3 py-2.5 font-medium">食べる</th>
                <th className="px-3 py-2.5 font-medium">飲む</th>
                <th className="px-3 py-2.5 font-medium">行く</th>
                <th className="px-3 py-2.5 font-medium">Use</th>
              </tr>
            </thead>
            <tbody>
              {VERB_FORM_TABLE.map((row) => (
                <tr key={row.form} className="border-t border-[var(--line)]">
                  <td className="px-3 py-2.5 text-[var(--ink-soft)] whitespace-nowrap">{row.form}</td>
                  <td className="px-3 py-2.5 font-jp text-base">{row.taberu}</td>
                  <td className="px-3 py-2.5 font-jp text-base">{row.nomu}</td>
                  <td className="px-3 py-2.5 font-jp text-base">{row.iku}</td>
                  <td className="px-3 py-2.5 text-[var(--muted)] text-xs">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReferenceSection>

      <ReferenceSection
        id="verb-groups"
        title="Verb groups"
        intro="Three groups cover almost all N5 verbs. The group decides how endings attach."
      >
        <ReferenceTableView table={VERB_GROUPS_TABLE} />
      </ReferenceSection>

      <ReferenceSection id="masu-rules" title="う-verbs → ます">
        <ReferenceTableView table={U_VERB_MASU_TABLE} compact />
        <ReferenceCallout
          title="る-verbs"
          body="Drop る, add ます — 食べる → 食べます · 見る → 見ます"
        />
      </ReferenceSection>

      <ReferenceSection id="nai-form" title="ない-form">
        <ReferenceTableView table={NAI_FORM_RULES} compact />
      </ReferenceSection>

      <ReferenceSection
        id="te-ta-form"
        title="て-form & た-form"
        intro="Same stem change — swap て↔た or で↔だ for past."
      >
        <ReferenceTableView table={TE_TA_FORM_RULES} compact />
      </ReferenceSection>

      <ReferenceSection id="irregular-verbs" title="Important irregulars">
        <div className="space-y-4">
          {IRREGULAR_VERBS.map((item) => (
            <div key={item.verb}>
              <p className="mb-2 font-jp text-base text-[var(--accent)]">{item.verb}</p>
              <ReferenceTableView table={item.forms} compact />
              {item.highlight && (
                <ReferenceCallout variant="remember" title="Remember" body={item.highlight} />
              )}
            </div>
          ))}
        </div>
      </ReferenceSection>

      <ReferenceSection
        id="form-uses"
        title="When do I use this?"
        intro="One example each — not a full lesson."
      >
        <div className="space-y-3">
          {VERB_FORM_USES.map((entry) => (
            <ReferenceGrammarCard key={entry.id} entry={entry} />
          ))}
        </div>
      </ReferenceSection>
    </ReferenceCategoryLayout>
  );
}
