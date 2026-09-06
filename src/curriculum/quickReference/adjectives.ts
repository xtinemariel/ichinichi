import type { ReferenceGrammarEntry, ReferenceTable } from "./types";

export const I_ADJ_TABLE: ReferenceTable = {
  headers: ["Form", "Example", "Rule"],
  jpColumns: [1],
  rows: [
    { cells: ["Present", { japanese: "高いです", reading: "たかいです", english: "is expensive" }, "adj + です"] },
    { cells: ["Negative", { japanese: "高くないです", reading: "たかくないです", english: "is not expensive" }, "い → くないです"] },
    { cells: ["Past", { japanese: "高かったです", reading: "たかかったです", english: "was expensive" }, "い → かったです"] },
    { cells: ["Past negative", { japanese: "高くなかったです", reading: "たかくなかったです", english: "was not expensive" }, "い → くなかったです"] },
  ],
};

export const I_ADJ_RULES = ["い → くない (negative)", "い → かった (past)", "い → くなかった (past negative)"];

export const NA_ADJ_TABLE: ReferenceTable = {
  headers: ["Form", "Example", "Rule"],
  jpColumns: [1],
  rows: [
    { cells: ["Present", { japanese: "静かです", reading: "しずかです", english: "is quiet" }, "な-adj + です"] },
    { cells: ["Negative", { japanese: "静かじゃないです", reading: "しずかじゃないです", english: "is not quiet" }, "じゃないです"] },
    { cells: ["Past", { japanese: "静かでした", reading: "しずかでした", english: "was quiet" }, "でした"] },
    { cells: ["Past negative", { japanese: "静かじゃなかったです", reading: "しずかじゃなかったです", english: "was not quiet" }, "じゃなかったです"] },
  ],
};

export const II_IRREGULAR: ReferenceTable = {
  headers: ["Form", "Example"],
  jpColumns: [1],
  rows: [
    { cells: ["Present", { japanese: "いいです", english: "is good" }] },
    { cells: ["Negative", { japanese: "よくないです", english: "is not good" }] },
    { cells: ["Past", { japanese: "よかったです", english: "was good" }] },
    { cells: ["Past negative", { japanese: "よくなかったです", english: "was not good" }] },
  ],
};

export const ADJ_COMPARE: ReferenceGrammarEntry = {
  id: "adj-compare",
  pattern: "い vs な",
  meaning: "い-adjectives end in い and conjugate by changing い. な-adjectives attach to nouns with な and conjugate like nouns (じゃない / でした).",
  example: {
    japanese: "大きい家 · 静かな家",
    reading: "おおきい いえ · しずかな いえ",
    english: "a big house · a quiet house",
  },
  searchTerms: ["i-adjective", "na-adjective", "compare"],
};

export const ADJ_SEARCH_SECTIONS = [
  { id: "i-adj", title: "い-adjectives", terms: ["i-adjective", "ii", "kunai", "くない", "katta", "かった", "高い", "negative", "past"] },
  { id: "na-adj", title: "な-adjectives", terms: ["na-adjective", "janai", "じゃない", "deshita", "でした", "静か", "negative", "past"] },
  { id: "ii-irregular", title: "いい irregular", terms: ["ii", "yoi", "yokunai", "yokatta", "good"] },
];
