/**
 * Simulates src/lib/readings.ts resolveFuriganaReading to find:
 *  - strings that render with NO furigana (inference failed)
 *  - strings whose INFERRED reading is likely wrong
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const KANJI_RE = /[\u4E00-\u9FFF々〆ヵヶ]/u;
const containsKanji = (t) => KANJI_RE.test(t);
const isKanjiChar = (c) => KANJI_RE.test(c);
const normalize = (r) => r.replace(/[\s\u3000]+/g, "");

const EXTRA_READINGS = [
  ["田中","たなか"],["山田","やまだ"],["太郎","たろう"],["日本","にほん"],["日本語","にほんご"],
  ["学生","がくせい"],["先生","せんせい"],["友達","ともだち"],["友だ","ともだ"],["今日","きょう"],
  ["明日","あした"],["昨日","きのう"],["元気","げんき"],["時間","じかん"],["電車","でんしゃ"],
  ["会社","かいしゃ"],["学校","がっこう"],["病院","びょういん"],["映画","えいが"],["新聞","しんぶん"],
  ["手紙","てがみ"],["時計","とけい"],["教室","きょうしつ"],["上手","じょうず"],["大学","だいがく"],
  ["高校","こうこう"],["中学","ちゅうがく"],["お疲れ","おつかれ"],["お願い","おねがい"],["願い","ねがい"],
  ["下さ","くださ"],["座っ","すわっ"],["座","すわ"],["違","ちが"],
];

function parseVocab() {
  const src = readFileSync(join(ROOT, "src/curriculum/vocabulary/data.ts"), "utf8").split("\n");
  const out = [];
  for (let i = 0; i < src.length; i++) {
    const jp = src[i].match(/^\s*japanese:\s*"([^"]*)"/);
    if (!jp) continue;
    for (let j = i + 1; j < Math.min(i + 4, src.length); j++) {
      const k = src[j].match(/^\s*kana:\s*"([^"]*)"/);
      if (k) { out.push([jp[1], k[1]]); break; }
    }
  }
  return out;
}

function parseKanji() {
  const src = readFileSync(join(ROOT, "src/curriculum/kanji.ts"), "utf8").split("\n");
  const words = [];
  const chars = [];
  for (let i = 0; i < src.length; i++) {
    const jp = src[i].match(/^\s*japanese:\s*"([^"]*)"/);
    if (jp) {
      for (let j = i + 1; j < Math.min(i + 3, src.length); j++) {
        const r = src[j].match(/^\s*reading:\s*"([^"]*)"/);
        if (r) { words.push([jp[1], r[1]]); break; }
      }
    }
    const ch = src[i].match(/^\s*character:\s*"([^"]*)"/);
    if (ch) {
      let on = [], kun = [];
      for (let j = i + 1; j < Math.min(i + 8, src.length); j++) {
        const o = src[j].match(/^\s*onyomi:\s*\[([^\]]*)\]/);
        const k = src[j].match(/^\s*kunyomi:\s*\[([^\]]*)\]/);
        if (o) on = [...o[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]);
        if (k) kun = [...k[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]);
      }
      const preferred = kun[0] ?? on[0];
      if (preferred) chars.push([ch[1], preferred]);
    }
  }
  return { words, chars };
}

const map = new Map();
const add = (s, r) => {
  if (!s || !r || !containsKanji(s)) return;
  if (!map.has(s)) map.set(s, normalize(r));
};
for (const [s, r] of EXTRA_READINGS) add(s, r);
for (const [s, r] of parseVocab()) add(s, r);
const { words, chars } = parseKanji();
for (const [s, r] of words) add(s, r);
for (const [s, r] of chars) add(s, r);

const dict = [...map.entries()]
  .map(([surface, reading]) => ({ surface, reading }))
  .sort((a, b) => b.surface.length - a.surface.length);

function inferReading(surface) {
  if (!containsKanji(surface)) return undefined;
  const cs = [...surface];
  let result = "";
  let i = 0;
  const used = [];
  while (i < cs.length) {
    const ch = cs[i];
    if (!isKanjiChar(ch)) { result += ch; i += 1; continue; }
    let matched = null;
    for (const e of dict) {
      const ec = [...e.surface];
      if (cs.slice(i, i + ec.length).join("") === e.surface) { matched = e; break; }
    }
    if (!matched) return { failed: ch };
    result += matched.reading;
    used.push(`${matched.surface}=${matched.reading}`);
    i += [...matched.surface].length;
  }
  return { reading: result, used };
}

// Collect all kanji-containing strings lacking explicit readings
const FILES = [
  "src/curriculum/grammar.ts",
  "src/curriculum/grammarPedagogy.ts",
  "src/curriculum/grammarPedagogyExtended.ts",
  "src/lessons/generator.ts",
];
const targets = [];
for (const file of FILES) {
  const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*japanese:\s*"([^"]*)"/);
    if (!m) continue;
    let hasReading = false;
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      if (/^\s*reading:\s*"/.test(lines[j])) { hasReading = true; break; }
      if (/^\s*(japanese|english):/.test(lines[j])) break;
    }
    if (!hasReading && containsKanji(m[1])) targets.push({ file, line: i + 1, jp: m[1] });
  }
}
{
  const lines = readFileSync(join(ROOT, "src/curriculum/vocabulary/data.ts"), "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*exampleSentence:\s*"([^"]*)"/);
    if (!m || !containsKanji(m[1])) continue;
    if (/^\s*exampleSentenceReading:/.test(lines[i + 1] ?? "")) continue;
    targets.push({ file: "vocab", line: i + 1, jp: m[1] });
  }
}

const failed = [];
const inferred = [];
for (const t of targets) {
  const r = inferReading(t.jp);
  if (!r || r.failed) failed.push({ ...t, char: r?.failed });
  else inferred.push({ ...t, reading: r.reading, used: r.used });
}

console.log(`=== NO FURIGANA AT ALL — inference failed (${failed.length}) ===`);
for (const f of failed) console.log(`${f.file}:${f.line}  ${f.jp}   [unknown kanji: ${f.char}]`);

console.log(`\n=== INFERRED READINGS — verify correctness (${inferred.length}) ===`);
for (const f of inferred) console.log(`${f.jp}\n   → ${f.reading}\n     via ${f.used.join(" + ")}`);
