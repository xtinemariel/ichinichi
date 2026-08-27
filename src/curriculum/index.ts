export { CURRICULUM_UNITS } from "./units";
export {
  CONCEPTS,
  PREREQUISITES,
  getConceptById,
  getConceptsByUnit,
  getSortedConcepts,
} from "./concepts";
export {
  VOCABULARY,
  getVocabById,
  getVocabByTheme,
  getVocabByIds,
} from "./vocabulary";
export { GRAMMAR_POINTS, getGrammarById } from "./grammar";
export {
  HIRAGANA,
  KATAKANA,
  ALL_KANA,
  getKanaById,
  getKanaByRow,
} from "./kana";
export { KANJI, getKanjiById, getKanjiByCategory } from "./kanji";

/** Convenience: all learning items linked on a concept */
export function getConceptContentIds(conceptId: string): string[] {
  const { getConceptById: get } = require("./concepts") as typeof import("./concepts");
  const c = get(conceptId);
  return c?.contentIds ?? [];
}
