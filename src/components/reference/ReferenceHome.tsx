"use client";

import Link from "next/link";
import { REFERENCE_CATEGORIES } from "@/curriculum/quickReference/categories";
import { ReferenceSearchBar } from "@/components/reference/ReferenceSearchBar";

export function ReferenceHome() {
  return (
    <div className="mx-auto max-w-lg px-5 pb-28 pt-10 animate-fade-up">
      <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">N5 desk reference</p>
      <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">Quick Reference</h1>
      <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">
        Look up conjugations, particles, and grammar patterns — then get back to studying.
      </p>

      <div className="mt-8">
        <ReferenceSearchBar />
      </div>

      <nav className="mt-10 grid gap-3 sm:grid-cols-2" aria-label="Reference categories">
        {REFERENCE_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-4 transition-colors hover:border-[var(--accent-soft)] hover:bg-[var(--surface-raised)]"
          >
            <h2 className="font-display text-lg text-[var(--ink)] group-hover:text-[var(--accent)]">
              {cat.title}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--muted)] leading-relaxed">{cat.description}</p>
          </Link>
        ))}
      </nav>
    </div>
  );
}
