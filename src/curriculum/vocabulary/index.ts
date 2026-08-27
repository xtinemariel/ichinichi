import type { VocabularyItem } from "@/lib/types";
import { VOCABULARY } from "./data";

export { VOCABULARY };

export function getVocabById(id: string): VocabularyItem | undefined {
  return VOCABULARY.find((v) => v.id === id);
}

export function getVocabByTheme(theme: string): VocabularyItem[] {
  return VOCABULARY.filter((v) => v.theme === theme);
}

export function getVocabByIds(ids: string[]): VocabularyItem[] {
  return ids
    .map((id) => getVocabById(id))
    .filter((v): v is VocabularyItem => Boolean(v));
}
