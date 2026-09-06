"use client";

import Link from "next/link";
import { referenceLinkForConcept } from "@/curriculum/quickReference/lessonLinks";

interface Props {
  conceptId: string;
}

export function ReferenceLessonLink({ conceptId }: Props) {
  const link = referenceLinkForConcept(conceptId);
  if (!link) return null;

  return (
    <Link
      href={link.href}
      className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
    >
      <span aria-hidden>↗</span>
      <span>
        Need a refresher? View {link.label} reference
      </span>
    </Link>
  );
}
