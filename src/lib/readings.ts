import { KANJI, VOCABULARY } from "@/curriculum";
import {
  containsKanji,
  inferReading,
  readingForFurigana,
  type ReadingEntry,
} from "@/lib/furigana";

/** Common name / compound readings used in example sentences */
const EXTRA_READINGS: ReadingEntry[] = [
  { surface: "田中", reading: "たなか" },
  { surface: "山田", reading: "やまだ" },
  { surface: "太郎", reading: "たろう" },
  { surface: "日本", reading: "にほん" },
  { surface: "日本語", reading: "にほんご" },
  { surface: "学生", reading: "がくせい" },
  { surface: "先生", reading: "せんせい" },
  { surface: "友達", reading: "ともだち" },
  { surface: "友だ", reading: "ともだ" },
  { surface: "今日", reading: "きょう" },
  { surface: "明日", reading: "あした" },
  { surface: "昨日", reading: "きのう" },
  { surface: "元気", reading: "げんき" },
  { surface: "時間", reading: "じかん" },
  { surface: "電車", reading: "でんしゃ" },
  { surface: "会社", reading: "かいしゃ" },
  { surface: "学校", reading: "がっこう" },
  { surface: "病院", reading: "びょういん" },
  { surface: "映画", reading: "えいが" },
  { surface: "新聞", reading: "しんぶん" },
  { surface: "手紙", reading: "てがみ" },
  { surface: "時計", reading: "とけい" },
  { surface: "教室", reading: "きょうしつ" },
  { surface: "上手", reading: "じょうず" },
  { surface: "大学", reading: "だいがく" },
  { surface: "高校", reading: "こうこう" },
  { surface: "中学", reading: "ちゅうがく" },
  { surface: "お疲れ", reading: "おつかれ" },
  { surface: "お願い", reading: "おねがい" },
  { surface: "願い", reading: "ねがい" },
  { surface: "下さ", reading: "くださ" },
  { surface: "座っ", reading: "すわっ" },
  { surface: "座", reading: "すわ" },
  { surface: "違", reading: "ちが" },
];

let cachedDict: ReadingEntry[] | null = null;

function readingDictionary(): ReadingEntry[] {
  if (cachedDict) return cachedDict;

  const map = new Map<string, string>();
  const add = (surface: string, reading: string) => {
    if (!surface || !reading) return;
    if (!containsKanji(surface)) return;
    if (!map.has(surface)) map.set(surface, reading);
  };

  for (const e of EXTRA_READINGS) add(e.surface, e.reading);

  for (const v of VOCABULARY) {
    add(v.japanese, v.kana);
  }

  for (const k of KANJI) {
    for (const w of k.exampleWords) {
      add(w.japanese, w.reading);
    }
    const preferred = k.kunyomi[0] ?? k.onyomi[0];
    if (preferred) add(k.character, preferred);
  }

  cachedDict = [...map.entries()]
    .map(([surface, reading]) => ({ surface, reading }))
    .sort((a, b) => b.surface.length - a.surface.length);

  return cachedDict;
}

/**
 * Resolve a kana reading for furigana display.
 * Prefers an explicit reading; otherwise infers from curriculum data.
 * Returns undefined for plain kana (no furigana).
 */
export function resolveFuriganaReading(
  surface: string,
  explicitReading?: string | null
): string | undefined {
  const fromExplicit = readingForFurigana(surface, explicitReading);
  if (fromExplicit) return fromExplicit;
  if (!containsKanji(surface)) return undefined;
  return inferReading(surface, readingDictionary());
}
