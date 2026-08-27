/**
 * AI lesson content service boundary.
 *
 * Curriculum / concept selection stays deterministic in the learning engine.
 * This module is the seam where OpenRouter / InsForge AI can later generate
 * explanations, example variations, and exercise paraphrases — always for a
 * pre-selected concept and validated against a schema.
 */

import type { GeneratedLesson } from "@/lib/types";

export interface AiLessonContext {
  conceptId: string;
  conceptTitle: string;
  knownVocabulary: string[];
  weakConcepts: string[];
  targetDifficulty: number;
  lessonDurationMinutes: number;
}

export interface AiGeneratedContent {
  explanation?: string;
  examples?: Array<{ japanese: string; english: string }>;
  hints?: string[];
  feedback?: string;
}

/**
 * MVP: returns null so the deterministic generator is used.
 * Wire OpenRouter / InsForge here in Phase 3 without changing curriculum control.
 */
export async function enrichLessonWithAi(
  _lesson: GeneratedLesson,
  _context: AiLessonContext
): Promise<AiGeneratedContent | null> {
  return null;
}

export function validateAiContent(content: unknown): content is AiGeneratedContent {
  if (!content || typeof content !== "object") return false;
  const c = content as AiGeneratedContent;
  if (c.explanation !== undefined && typeof c.explanation !== "string") return false;
  if (c.examples !== undefined && !Array.isArray(c.examples)) return false;
  return true;
}
