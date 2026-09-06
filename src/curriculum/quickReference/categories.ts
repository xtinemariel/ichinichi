import type { ReferenceCategoryMeta } from "./types";

export const REFERENCE_CATEGORIES: ReferenceCategoryMeta[] = [
  {
    id: "verbs",
    title: "Verbs",
    description: "Conjugation patterns, verb groups, and form uses",
    href: "/reference/verbs",
  },
  {
    id: "adjectives",
    title: "Adjectives",
    description: "い-adjective and な-adjective forms",
    href: "/reference/adjectives",
  },
  {
    id: "particles",
    title: "Particles",
    description: "Common N5 particle usage and comparisons",
    href: "/reference/particles",
  },
  {
    id: "grammar",
    title: "Grammar",
    description: "Essential N5 patterns, sentences, numbers & time",
    href: "/reference/grammar",
  },
];

export function categoryMeta(id: string): ReferenceCategoryMeta | undefined {
  return REFERENCE_CATEGORIES.find((c) => c.id === id);
}
