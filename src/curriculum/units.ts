import type { CurriculumUnit } from "@/lib/types";

/**
 * Curriculum units ordered by learning phase.
 * Concepts attach to these units; the roadmap UI groups by unit.
 */
export const CURRICULUM_UNITS: CurriculumUnit[] = [
  // Phase 1 — Foundations (Hiragana)
  {
    id: "unit-pronunciation",
    phase: "foundations",
    title: "Pronunciation",
    description: "Japanese sounds, rhythm, and mora timing",
    order: 1,
  },
  {
    id: "unit-hiragana-basic",
    phase: "foundations",
    title: "Hiragana · Basic Chart",
    description: "Learn the 46 basic hiragana characters",
    order: 2,
  },
  {
    id: "unit-hiragana-voiced",
    phase: "foundations",
    title: "Hiragana · Voiced Sounds",
    description: "Dakuten, handakuten, and combination sounds",
    order: 3,
  },
  {
    id: "unit-hiragana-practice",
    phase: "foundations",
    title: "Hiragana · Reading Practice",
    description: "Lock in hiragana through mixed reading",
    order: 4,
  },

  // Phase 2 — Katakana
  {
    id: "unit-katakana-basic",
    phase: "katakana",
    title: "Katakana · Basic Chart",
    description: "Learn the basic katakana characters",
    order: 5,
  },
  {
    id: "unit-katakana-advanced",
    phase: "katakana",
    title: "Katakana · Advanced",
    description: "Dakuten, combinations, long vowels, loanwords",
    order: 6,
  },

  // Phase 3 — Basic Japanese
  {
    id: "unit-sentence-basics",
    phase: "basic",
    title: "Sentence Basics",
    description: "Word order, です, and simple statements",
    order: 7,
  },
  {
    id: "unit-questions-demo",
    phase: "basic",
    title: "Questions & Demonstratives",
    description: "か questions and これ/この forms",
    order: 8,
  },
  {
    id: "unit-numbers-time",
    phase: "basic",
    title: "Numbers & Time",
    description: "Count and talk about time",
    order: 9,
  },

  // Phase 4 — Particles
  {
    id: "unit-particles-topic",
    phase: "particles",
    title: "Particles · Topic & Possession",
    description: "は、も、の",
    order: 10,
  },
  {
    id: "unit-particles-object",
    phase: "particles",
    title: "Particles · Object & Direction",
    description: "を、に、へ",
    order: 11,
  },
  {
    id: "unit-particles-place",
    phase: "particles",
    title: "Particles · Place & Range",
    description: "で、と、から、まで",
    order: 12,
  },

  // Phase 5 — Vocabulary
  {
    id: "unit-vocab-people",
    phase: "vocabulary",
    title: "People & Family",
    description: "Words for people around you",
    order: 13,
  },
  {
    id: "unit-vocab-world",
    phase: "vocabulary",
    title: "Places & Things",
    description: "Places, food, transport, objects",
    order: 14,
  },
  {
    id: "unit-vocab-life",
    phase: "vocabulary",
    title: "Daily Life",
    description: "School, work, hobbies, weather, shopping",
    order: 15,
  },

  // Phase 6 — Verbs
  {
    id: "unit-verbs-core",
    phase: "verbs",
    title: "Core Verbs",
    description: "Essential N5 action verbs",
    order: 16,
  },
  {
    id: "unit-verbs-polite",
    phase: "verbs",
    title: "Polite Verb Forms",
    description: "ます / ません / past forms",
    order: 17,
  },
  {
    id: "unit-verbs-te",
    phase: "verbs",
    title: "て-form & Uses",
    description: "て-form, requests, and progressive",
    order: 18,
  },

  // Phase 7 — Adjectives
  {
    id: "unit-adjectives",
    phase: "adjectives",
    title: "Adjectives",
    description: "い and な adjectives in all basic tenses",
    order: 19,
  },

  // Phase 8 — Core Grammar
  {
    id: "unit-grammar-existence",
    phase: "grammar",
    title: "Existence & Feelings",
    description: "あります/います, likes, location",
    order: 20,
  },
  {
    id: "unit-grammar-requests",
    phase: "grammar",
    title: "Requests & Ability",
    description: "ください, permission, prohibition, can",
    order: 21,
  },
  {
    id: "unit-grammar-connect",
    phase: "grammar",
    title: "Connecting Ideas",
    description: "Reasons, contrasts, comparisons, counters",
    order: 22,
  },

  // Phase 9 — Kanji
  {
    id: "unit-kanji-foundation",
    phase: "kanji",
    title: "Kanji Foundations",
    description: "Numbers, time, and people",
    order: 23,
  },
  {
    id: "unit-kanji-world",
    phase: "kanji",
    title: "Kanji · World Around You",
    description: "Nature, places, and daily life",
    order: 24,
  },
  {
    id: "unit-kanji-actions",
    phase: "kanji",
    title: "Kanji · Actions & Description",
    description: "Common verb and adjective kanji",
    order: 25,
  },

  // Phase 10 — Integration
  {
    id: "unit-integration",
    phase: "integration",
    title: "N5 Integration",
    description: "Reading, listening, and production tasks",
    order: 26,
  },
];
