"use client";

import { FuriganaText } from "@/components/FuriganaText";
import { ReferenceCategoryLayout } from "@/components/reference/ReferenceCategoryLayout";
import { ReferenceCompareView } from "@/components/reference/ReferenceCompare";
import { ReferenceSection } from "@/components/reference/ReferenceSection";
import { PARTICLE_COMPARISONS, PARTICLE_TABLE } from "@/curriculum/quickReference/particles";

export function ParticlesReference() {
  return (
    <ReferenceCategoryLayout title="Particles">
      <ReferenceSection
        id="particle-table"
        title="Particle quick table"
        intro="Tap-friendly scan — primary N5 uses only."
      >
        <div className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[320px] text-sm">
            <thead>
              <tr className="bg-[var(--wash)] text-left text-xs tracking-wide text-[var(--muted)]">
                <th className="px-3 py-2.5 w-10 font-medium"> </th>
                <th className="px-3 py-2.5 font-medium">Main use</th>
                <th className="px-3 py-2.5 font-medium">Example</th>
              </tr>
            </thead>
            <tbody>
              {PARTICLE_TABLE.map((p) => (
                <tr key={p.particle} className="border-t border-[var(--line)] align-top">
                  <td className="px-3 py-3 font-jp text-xl text-[var(--accent)]">{p.particle}</td>
                  <td className="px-3 py-3 text-[var(--ink-soft)] text-sm leading-snug">{p.use}</td>
                  <td className="px-3 py-3">
                    <p className="font-jp text-base text-[var(--ink)] leading-snug">
                      <FuriganaText text={p.example.japanese} reading={p.example.reading} />
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{p.example.english}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReferenceSection>

      <ReferenceSection id="comparisons" title="Common comparisons">
        <div className="space-y-4">
          {PARTICLE_COMPARISONS.map((c) => (
            <ReferenceCompareView key={c.id} compare={c} />
          ))}
        </div>
      </ReferenceSection>
    </ReferenceCategoryLayout>
  );
}
