"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ReferenceSearchBar } from "@/components/reference/ReferenceSearchBar";

interface Props {
  title: string;
  subtitle?: string;
  backHref?: string;
  children: ReactNode;
}

export function ReferenceCategoryLayout({
  title,
  subtitle = "Quick Reference",
  backHref = "/reference",
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-lg px-5 pb-28 pt-10 animate-fade-up">
      <Link
        href={backHref}
        className="inline-flex items-center text-xs tracking-wide text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← Quick Reference
      </Link>
      <p className="mt-4 text-xs tracking-[0.2em] uppercase text-[var(--muted)]">{subtitle}</p>
      <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">{title}</h1>
      <div className="mt-6">
        <ReferenceSearchBar />
      </div>
      <div className="mt-8 space-y-10">{children}</div>
    </div>
  );
}
