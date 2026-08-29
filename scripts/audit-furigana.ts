/**
 * Furigana + reading QA over every explicit surface/reading pair in the
 * curriculum. Imports the real alignment code from src/lib/furigana.ts so the
 * report always reflects what learners actually see.
 *
 *   npx esbuild scripts/audit-furigana.ts --bundle --platform=node \
 *     --format=esm --outfile=/tmp/af.mjs && node /tmp/af.mjs
 *
 * Set FULL=1 to print every checked pair instead of only problems.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildFuriganaSegments,
  containsKanji,
  normalizeReading,
} from "@/lib/furigana";

const ROOT = process.cwd();
const KANA_CHAR = /[\u3040-\u309F\u30A0-\u30FF\u30FCー]/u;
/** Kana plus the punctuation readings legitimately carry. */
const KANA_ONLY = /^[\u3040-\u309F\u30A0-\u30FF\u30FCー\s\u3000。、！？「」]+$/u;

/** Surfaces that genuinely carry more than one N5 reading. */
const DUAL_READING = new Set([
  "十", // じゅう (the number) vs とお (native counter: 十 apples)
]);

type Entry = {
  file: string;
  line: number;
  japanese: string;
  reading?: string;
};

/** Pulls `<jpKey>: "…"` / `<rdKey>: "…"` pairs out of a curriculum source file. */
function extractPairs(file: string, jpKey: string, rdKey: string): Entry[] {
  const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
  const out: Entry[] = [];

  for (let i = 0; i < lines.length; i++) {
    const jp = lines[i].match(new RegExp(`^\\s*${jpKey}:\\s*"([^"]*)"`));
    if (!jp) continue;

    let reading: string | undefined;
    for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
      const rd = lines[j].match(new RegExp(`^\\s*${rdKey}:\\s*"([^"]*)"`));
      if (rd) {
        reading = rd[1];
        break;
      }
      if (new RegExp(`^\\s*(${jpKey}|id|character):`).test(lines[j])) break;
    }
    out.push({ file, line: i + 1, japanese: jp[1], reading });
  }
  return out;
}

const entries: Entry[] = [
  ...extractPairs("src/curriculum/grammar.ts", "japanese", "reading"),
  ...extractPairs("src/curriculum/grammarPedagogy.ts", "japanese", "reading"),
  ...extractPairs("src/curriculum/grammarPedagogyExtended.ts", "japanese", "reading"),
  ...extractPairs("src/curriculum/kanji.ts", "japanese", "reading"),
  ...extractPairs("src/curriculum/vocabulary/data.ts", "japanese", "kana"),
  ...extractPairs(
    "src/curriculum/vocabulary/data.ts",
    "exampleSentence",
    "exampleSentenceReading"
  ),
];

const problems: Array<Entry & { why: string }> = [];
const flag = (e: Entry, why: string) => problems.push({ ...e, why });

const readingMap = new Map<string, Map<string, string[]>>();
let checked = 0;

for (const e of entries) {
  if (!e.japanese) continue;
  const hasKanji = containsKanji(e.japanese);

  if (hasKanji && !e.reading) {
    flag(e, "MISSING READING (falls back to runtime inference)");
    continue;
  }
  if (!e.reading) continue;

  const reading = normalizeReading(e.reading);

  if (containsKanji(reading)) {
    flag(e, `READING CONTAINS KANJI: ${reading}`);
    continue;
  }
  if (!hasKanji) {
    if (reading !== normalizeReading(e.japanese)) {
      flag(e, `KANA-ONLY SURFACE DISAGREES WITH READING: ${reading}`);
    }
    continue;
  }
  if (!KANA_ONLY.test(e.reading)) {
    flag(e, `READING IS NOT KANA: ${e.reading}`);
    continue;
  }

  checked += 1;

  const segments = buildFuriganaSegments(e.japanese, e.reading);
  const rendered = segments
    .map((s) => (s.furigana ? `${s.text}[${s.furigana}]` : s.text))
    .join("");

  // One ruby over an all-kanji word (元気) is correct; one ruby over a mixed
  // surface means the aligner gave up and blanketed the whole string.
  const wholeWordRuby =
    segments.length === 1 && segments[0].furigana && KANA_CHAR.test(e.japanese);
  if (wholeWordRuby) {
    flag(e, `ALIGNMENT FAILED, whole-word ruby: ${rendered}`);
  } else {
    for (const s of segments) {
      if (!s.furigana) continue;
      // Single kanji reach four kana (弟/おとうと, 妹/いもうと); beyond that, or
      // beyond three per character in a compound, the split is likely wrong.
      const limit = Math.max(4, [...s.text].length * 3);
      if ([...s.furigana].length > limit) {
        flag(e, `IMPLAUSIBLE RUBY 「${s.text}」→「${s.furigana}」 in ${rendered}`);
      }
    }
  }

  if (process.env.FULL) console.log(`  ${e.file}:${e.line}  ${rendered}`);

  const byReading = readingMap.get(e.japanese) ?? new Map<string, string[]>();
  const locs = byReading.get(reading) ?? [];
  locs.push(`${e.file}:${e.line}`);
  byReading.set(reading, locs);
  readingMap.set(e.japanese, byReading);
}

const inconsistent = [...readingMap.entries()].filter(
  ([surface, m]) => m.size > 1 && !DUAL_READING.has(surface)
);

console.log(`\nChecked ${checked} kanji surfaces with explicit readings.`);

console.log(`\n=== PROBLEMS (${problems.length}) ===`);
for (const p of problems) {
  console.log(`${p.file}:${p.line}  ${p.japanese}\n    ${p.why}`);
}

console.log(`\n=== INCONSISTENT READINGS FOR SAME SURFACE (${inconsistent.length}) ===`);
for (const [surface, m] of inconsistent) {
  console.log(surface);
  for (const [r, locs] of m) console.log(`    ${r}   ${locs.slice(0, 3).join(", ")}`);
}

if (!problems.length && !inconsistent.length) {
  console.log("\nNo furigana problems detected.");
}
