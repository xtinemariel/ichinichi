/**
 * Align Japanese surface text with a kana reading for ruby/furigana.
 * Kana runs in the surface are matched into the reading; intervening
 * reading text becomes furigana for the preceding kanji run.
 *
 * Plain hiragana / katakana never gets furigana.
 */

export function containsKanji(text: string): boolean {
  return /[\u4E00-\u9FFF々〆ヵヶ]/u.test(text);
}

function isKanjiChar(char: string): boolean {
  return /[\u4E00-\u9FFF々〆ヵヶ]/u.test(char);
}

/** Strip spaces / fullwidth spaces often present in reading fields */
export function normalizeReading(reading: string): string {
  return reading.replace(/[\s\u3000]+/g, "");
}

/**
 * Only return a reading when the surface text contains kanji.
 * Prevents furigana (or duplicate kana lines) on plain hiragana/katakana.
 */
export function readingForFurigana(
  surface: string,
  reading?: string | null
): string | undefined {
  if (!surface || !containsKanji(surface)) return undefined;
  if (!reading) return undefined;
  const normalized = normalizeReading(reading);
  if (!normalized || normalized === surface) return undefined;
  return normalized;
}

export type FuriganaSegment = {
  text: string;
  furigana?: string;
};

export function buildFuriganaSegments(
  surface: string,
  reading?: string | null
): FuriganaSegment[] {
  if (!surface) return [];
  const normalized = reading ? normalizeReading(reading) : "";
  if (!normalized || !containsKanji(surface) || surface === normalized) {
    return [{ text: surface }];
  }

  type Group = { text: string; kanji: boolean };
  const groups: Group[] = [];
  for (const char of surface) {
    const kanji = isKanjiChar(char);
    const last = groups[groups.length - 1];
    if (last && last.kanji === kanji) {
      last.text += char;
    } else {
      groups.push({ text: char, kanji });
    }
  }

  const segments: FuriganaSegment[] = [];
  let readingPos = 0;

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    if (!group.kanji) {
      const idx = normalized.indexOf(group.text, readingPos);
      if (idx === -1) {
        return [{ text: surface, furigana: normalized }];
      }
      readingPos = idx + group.text.length;
      segments.push({ text: group.text });
      continue;
    }

    const nextKana = groups.slice(i + 1).find((g) => !g.kanji);
    let end = normalized.length;
    if (nextKana) {
      const idx = normalized.indexOf(nextKana.text, readingPos);
      if (idx === -1) {
        return [{ text: surface, furigana: normalized }];
      }
      end = idx;
    }

    const furigana = normalized.slice(readingPos, end);
    segments.push(
      furigana ? { text: group.text, furigana } : { text: group.text }
    );
    readingPos = end;
  }

  return segments;
}

export type ReadingEntry = { surface: string; reading: string };

/**
 * Greedy left-to-right reading inference using a dictionary of
 * known words / kanji (longest match first).
 */
export function inferReading(
  surface: string,
  dictionary: ReadingEntry[]
): string | undefined {
  if (!containsKanji(surface)) return undefined;

  const chars = [...surface];
  let result = "";
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];
    if (!isKanjiChar(ch)) {
      result += ch;
      i += 1;
      continue;
    }

    let matched: ReadingEntry | null = null;
    for (const entry of dictionary) {
      const entryChars = [...entry.surface];
      if (entryChars.length === 0) continue;
      if (
        chars.slice(i, i + entryChars.length).join("") === entry.surface
      ) {
        matched = entry;
        break;
      }
    }

    if (!matched) return undefined;
    result += normalizeReading(matched.reading);
    i += [...matched.surface].length;
  }

  return result;
}
