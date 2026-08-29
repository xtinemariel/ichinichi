/**
 * Generates every lesson and validates the exercises a learner will actually see.
 * Run: npx tsx scripts/audit-lessons.ts
 */
import { CONCEPTS } from "@/curriculum";
import { generateLesson } from "@/lessons/generator";
import { buildFuriganaSegments, containsKanji } from "@/lib/furigana";
import { resolveFuriganaReading } from "@/lib/readings";
import { createDefaultUserState } from "@/lib/storage";
import type { Exercise } from "@/lib/types";

const state = createDefaultUserState();

type Issue = { lesson: string; phase: string; kind: string; detail: string };
const issues: Issue[] = [];
const report = (lesson: string, phase: string, kind: string, detail: string) =>
  issues.push({ lesson, phase, kind, detail });

const KANA_ONLY = /^[\u3040-\u309F\u30A0-\u30FF\u30FC\s\u3000、。？！]+$/u;

function checkFurigana(lesson: string, phase: string, jp?: string, reading?: string) {
  if (!jp || !containsKanji(jp)) return;
  const resolved = resolveFuriganaReading(jp, reading);
  if (!resolved) {
    report(lesson, phase, "NO_FURIGANA", `kanji with no reading: ${jp}`);
    return;
  }
  if (!KANA_ONLY.test(resolved)) {
    report(lesson, phase, "BAD_READING", `${jp} → ${resolved}`);
    return;
  }
  // Only meaningful for mixed kanji+kana surfaces; an all-kanji word
  // legitimately renders as a single ruby span.
  const mixed = /[\u3040-\u309F\u30A0-\u30FF]/u.test(jp);
  const segs = buildFuriganaSegments(jp, resolved);
  if (mixed && segs.length === 1 && segs[0].furigana) {
    report(lesson, phase, "FURIGANA_FALLBACK", `${jp} → ${resolved}`);
  }
}

function checkExercise(lesson: string, phase: string, ex: Exercise) {
  const where = `${ex.type} "${ex.prompt.slice(0, 60).replace(/\n/g, " ⏎ ")}"`;

  if (!ex.prompt?.trim()) report(lesson, phase, "EMPTY_PROMPT", where);

  if (ex.options && ex.options.length > 0) {
    const labels = ex.options.map((o) => o.label);
    if (labels.length < 2) {
      report(lesson, phase, "TOO_FEW_OPTIONS", `${where} → ${labels.length}`);
    }
    const dupes = labels.filter((l, i) => labels.indexOf(l) !== i);
    if (dupes.length) {
      report(lesson, phase, "DUPLICATE_OPTION", `${where} → ${[...new Set(dupes)].join(" | ")}`);
    }
    // Options that differ only in punctuation/apostrophe style are two
    // correct answers as far as the learner is concerned.
    const norm = labels.map((l) => l.toLowerCase().replace(/[^a-z\u3040-\u30ff\u4e00-\u9fff]/g, ""));
    const semDupes = norm.filter((l, i) => l && norm.indexOf(l) !== i);
    if (semDupes.length) {
      report(lesson, phase, "EQUIVALENT_OPTIONS", `${where} → ${labels.join(" | ")}`);
    }
    if (!labels.includes(ex.correctAnswer)) {
      report(lesson, phase, "ANSWER_NOT_IN_OPTIONS", `${where} → answer "${ex.correctAnswer}"`);
    }
    if (labels.some((l) => !l?.trim())) {
      report(lesson, phase, "EMPTY_OPTION", where);
    }
  } else if (ex.type === "multiple_choice" || ex.type === "jp_to_en" || ex.type === "en_to_jp") {
    report(lesson, phase, "NO_OPTIONS", where);
  }

  if (ex.type === "word_ordering") {
    const toks = ex.tokens ?? [];
    if (toks.length < 2) {
      report(lesson, phase, "WORD_ORDER_TOO_SHORT", where);
    }
    const joined = [...toks].sort().join("");
    const answerSorted = [...ex.correctAnswer].sort().join("");
    if (joined.split("").sort().join("") !== answerSorted.split("").sort().join("")) {
      report(lesson, phase, "WORD_ORDER_MISMATCH", `${where} tokens=${toks.join("/")} answer=${ex.correctAnswer}`);
    }
    if (toks.some((t) => /^[んっゃゅょー]/u.test(t))) {
      report(lesson, phase, "WORD_ORDER_BAD_SPLIT", `${where} tokens=${toks.join("/")}`);
    }
  }

  if (!ex.correctAnswer?.trim()) report(lesson, phase, "NO_ANSWER", where);

  checkFurigana(lesson, phase, ex.promptJapanese, ex.promptReading);
  if (ex.passage) checkFurigana(lesson, phase, ex.passage, undefined);

  // An option that is identical to the prompt sentence gives the answer away.
  if (ex.promptJapanese && ex.options?.some((o) => o.label === ex.promptJapanese)) {
    report(lesson, phase, "OPTION_ECHOES_PROMPT", where);
  }
}

for (const concept of CONCEPTS) {
  const lesson = generateLesson(concept.id, state);
  const name = `${concept.id} (${concept.title})`;

  if (!lesson.phases.length) report(name, "-", "NO_PHASES", "lesson has no phases");

  for (const phase of lesson.phases) {
    for (const block of phase.teachBlocks ?? []) {
      if (block.kind === "example") {
        checkFurigana(name, phase.title, block.japanese, block.reading);
        if (!block.english?.trim()) report(name, phase.title, "EXAMPLE_NO_ENGLISH", block.japanese);
      }
      if (block.kind === "discovery") {
        checkFurigana(name, phase.title, block.before.japanese, block.before.reading);
        checkFurigana(name, phase.title, block.after.japanese, block.after.reading);
      }
      if (block.kind === "contrast") {
        checkFurigana(name, phase.title, block.exampleA.japanese, block.exampleA.reading);
        checkFurigana(name, phase.title, block.exampleB.japanese, block.exampleB.reading);
      }
      if (block.kind === "dialogue") {
        for (const l of block.lines) checkFurigana(name, phase.title, l.japanese, l.reading);
      }
      if (block.kind === "callout" && /undefined|\[object/.test(block.body)) {
        report(name, phase.title, "BROKEN_CALLOUT", block.body.slice(0, 80));
      }
      if (block.kind === "paragraph" && /undefined|\[object/.test(block.text)) {
        report(name, phase.title, "BROKEN_TEXT", block.text.slice(0, 80));
      }
    }

    const seen = new Set<string>();
    for (const ex of phase.exercises) {
      checkExercise(name, phase.title, ex);
      const key = `${ex.prompt}|${ex.correctAnswer}`;
      if (seen.has(key)) {
        report(name, phase.title, "DUPLICATE_EXERCISE", ex.prompt.slice(0, 50));
      }
      seen.add(key);
    }

    if (phase.mode === "assessment" && phase.exercises.length === 0) {
      report(name, phase.title, "EMPTY_QUIZ", "assessment phase has no exercises");
    }
  }

  for (const m of lesson.notes.commonMistakes) {
    if (/undefined/.test(`${m.wrong}${m.right ?? ""}${m.note}`)) {
      report(name, "notes", "BROKEN_MISTAKE", `${m.wrong} / ${m.right}`);
    }
  }
}

const byKind = new Map<string, Issue[]>();
for (const i of issues) {
  if (!byKind.has(i.kind)) byKind.set(i.kind, []);
  byKind.get(i.kind)!.push(i);
}

console.log(`Generated ${CONCEPTS.length} lessons.`);
console.log(`Total issues: ${issues.length}\n`);
  for (const [kind, list] of [...byKind.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`### ${kind} (${list.length})`);
  const limit = process.env.FULL ? list.length : 12;
  for (const i of list.slice(0, limit)) console.log(`   ${i.lesson} › ${i.phase}: ${i.detail}`);
  if (list.length > limit) console.log(`   ... ${list.length - limit} more`);
  console.log();
}
if (!issues.length) console.log("No issues found.");
