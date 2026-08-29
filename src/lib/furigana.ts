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

  // Kana groups anchor the alignment: each must sit exactly where the previous
  // group ended, so the only free choice is how much reading each kanji run
  // takes. Scanning for the *first* match of the next kana run is wrong when
  // that kana also occurs inside the preceding kanji's reading (母 + は against
  // はは|は|せんせい). Instead every split is scored and the most plausible one
  // wins, using the rule of thumb that a kanji is worth about two kana.
  const KANA_PER_KANJI = 2;
  const best = new Map<string, Split | null>();

  type Split = { score: number; lengths: number[] };

  function solve(groupIndex: number, pos: number): Split | null {
    if (groupIndex === groups.length) {
      return pos === normalized.length ? { score: 0, lengths: [] } : null;
    }

    const key = `${groupIndex}:${pos}`;
    const cached = best.get(key);
    if (cached !== undefined) return cached;

    const group = groups[groupIndex];
    let result: Split | null = null;

    if (!group.kanji) {
      // Readings never carry the spaces some surfaces use as beginner aids.
      const needle = normalizeReading(group.text);
      if (normalized.startsWith(needle, pos)) {
        const rest = solve(groupIndex + 1, pos + needle.length);
        if (rest) {
          result = { score: rest.score, lengths: [needle.length, ...rest.lengths] };
        }
      }
    } else {
      const chars = [...group.text].length;
      const expected = chars * KANA_PER_KANJI;
      // A kanji cannot be silent, so it takes at least one kana per character.
      for (let len = chars; pos + len <= normalized.length; len++) {
        const rest = solve(groupIndex + 1, pos + len);
        if (!rest) continue;
        const score = rest.score + Math.abs(len - expected);
        if (!result || score < result.score) {
          result = { score, lengths: [len, ...rest.lengths] };
        }
      }
    }

    best.set(key, result);
    return result;
  }

  const split = solve(0, 0);
  if (!split) {
    return [{ text: surface, furigana: normalized }];
  }

  const segments: FuriganaSegment[] = [];
  let readingPos = 0;
  groups.forEach((group, i) => {
    const len = split.lengths[i];
    const furigana = normalized.slice(readingPos, readingPos + len);
    readingPos += len;
    segments.push(group.kanji ? { text: group.text, furigana } : { text: group.text });
  });

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
