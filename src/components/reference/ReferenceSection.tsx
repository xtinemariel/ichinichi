"use client";

import type { ReactNode } from "react";

interface Props {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export function ReferenceSection({ id, title, intro, children }: Props) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="font-display text-xl text-[var(--ink)]">{title}</h2>
        {intro && (
          <p className="mt-1.5 text-sm text-[var(--ink-soft)] leading-relaxed">{intro}</p>
        )}
      </div>
      {children}
    </section>
  );
}
