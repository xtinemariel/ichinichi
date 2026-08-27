"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { CURRICULUM_UNITS } from "@/curriculum";
import { getRoadmapState, canAccessConcept } from "@/engine/recommend";
import { generateLesson } from "@/lessons/generator";

export function CurriculumScreen() {
  const router = useRouter();
  const { state, startLesson } = useApp();
  const roadmap = useMemo(() => getRoadmapState(state), [state]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const unitMeta = (unitId: string) =>
    CURRICULUM_UNITS.find((u) => u.id === unitId);

  return (
    <div className="mx-auto max-w-lg px-5 pb-28 pt-10 animate-fade-up">
      <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
        N5 roadmap
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Your path
      </h1>
      <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">
        Follow the curriculum in order. Prerequisites keep each step grounded.
      </p>

      <div className="mt-10 space-y-8">
        {roadmap.map((unit) => {
          const meta = unitMeta(unit.unitId);
          if (!meta) return null;
          const isOpen = expanded === unit.unitId;

          return (
            <div key={unit.unitId}>
              <button
                type="button"
                onClick={() =>
                  setExpanded(isOpen ? null : unit.unitId)
                }
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <StatusDot status={unit.status} />
                    <h2 className="font-display text-xl text-[var(--ink)]">
                      {meta.title}
                    </h2>
                  </div>
                  <p className="mt-1 pl-5 text-sm text-[var(--muted)]">
                    {meta.description}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wider text-[var(--muted)] pt-1">
                  {unit.status === "done"
                    ? "Done"
                    : unit.status === "current"
                      ? "Current"
                      : "Up next"}
                </span>
              </button>

              {isOpen && (
                <ul className="mt-4 space-y-1 border-l border-[var(--line)] ml-1.5 pl-4">
                  {unit.concepts.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => {
                          const access = canAccessConcept(c.id, state);
                          if (!access.allowed) {
                            setWarning(
                              `Prerequisites needed: ${access.missing.join(", ")}`
                            );
                            return;
                          }
                          setWarning(null);
                          const lesson = generateLesson(c.id, state);
                          startLesson(lesson);
                          router.push("/lesson");
                        }}
                        className="flex w-full items-center justify-between gap-2 py-2 text-left text-sm hover:text-[var(--accent)]"
                      >
                        <span className="flex items-center gap-2 text-[var(--ink-soft)]">
                          <ConceptMark status={c.status} />
                          {c.title}
                        </span>
                        {c.mastery > 0 && (
                          <span className="text-xs tabular-nums text-[var(--muted)]">
                            {c.mastery}/5
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {warning && (
        <div className="fixed bottom-24 inset-x-4 mx-auto max-w-lg rounded-sm border border-[var(--danger)]/30 bg-[var(--danger-wash)] px-4 py-3 text-sm text-[var(--ink)]">
          {warning}
          <button
            type="button"
            className="ml-3 text-[var(--muted)] underline"
            onClick={() => setWarning(null)}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: "done" | "current" | "upcoming" }) {
  const color =
    status === "done"
      ? "bg-[var(--accent)]"
      : status === "current"
        ? "bg-[var(--ink)]"
        : "bg-[var(--line)]";
  return <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color}`} />;
}

function ConceptMark({
  status,
}: {
  status: "mastered" | "current" | "available" | "locked";
}) {
  if (status === "mastered")
    return <span className="text-[var(--accent)]">✓</span>;
  if (status === "current")
    return <span className="text-[var(--ink)]">●</span>;
  if (status === "available")
    return <span className="text-[var(--muted)]">○</span>;
  return <span className="text-[var(--line)]">○</span>;
}
