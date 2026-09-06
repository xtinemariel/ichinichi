import {
  VOCABULARY,
  getVocabById,
  getVocabByIds,
  getVocabByTheme,
} from "@/curriculum/vocabulary";
import { addDays, todayKey } from "@/lib/dates";
import { containsKanji } from "@/lib/furigana";
import type {
  Exercise,
  ExerciseOption,
  ItemProgress,
  MasteryLevel,
  UserState,
  VocabCardKind,
  VocabRating,
  VocabSessionSummary,
  VocabStudyCard,
  VocabStudyStatus,
  VocabularyItem,
} from "@/lib/types";
import {
  applyAnswer,
  ensureProgress,
  isDue,
  isMastered,
  isWeak,
} from "@/engine/mastery";

const INTERVALS_BY_MASTERY: Record<MasteryLevel, number> = {
  0: 0,
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 14,
};

export const VOCAB_THEME_LABELS: Record<string, string> = {
  greetings: "Greetings",
  people: "People",
  family: "Family",
  numbers: "Numbers",
  counters: "Counters",
  time: "Time",
  days: "Dates",
  verbs: "Verbs",
  adjectives: "Adjectives",
  food: "Food",
  drinks: "Drinks",
  places: "Places",
  transportation: "Transportation",
  objects: "Home",
  daily: "Everyday Life",
  school: "School",
  work: "Work",
  body: "Body",
  weather: "Weather",
  hobbies: "Nature & Hobbies",
  colors: "Colors",
  shopping: "Shopping",
  pronouns: "Pronouns",
  position: "Location",
  adverbs: "Adverbs",
};

let uidCounter = 0;
function uid(prefix: string): string {
  uidCounter += 1;
  return `${prefix}-${Date.now()}-${uidCounter}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(correct: string, pool: string[], count = 3): string[] {
  const unique = [...new Set(pool.filter((x) => x && x !== correct))];
  return shuffle(unique).slice(0, count);
}

function mcOptions(correct: string, distractors: string[]): ExerciseOption[] {
  return shuffle([correct, ...distractors]).map((label, i) => ({
    id: `opt-${i}`,
    label,
  }));
}

function clampMastery(n: number): MasteryLevel {
  return Math.max(0, Math.min(5, Math.round(n))) as MasteryLevel;
}

export function getVocabStudyStatus(
  progress: ItemProgress | undefined
): VocabStudyStatus {
  if (!progress || progress.mastery === 0) return "new";
  if (progress.mastery <= 2) return "learning";
  if (progress.mastery === 3) return "familiar";
  return "mastered";
}

export function getVocabProgress(
  state: UserState,
  vocabId: string
): ItemProgress {
  return ensureProgress({ ...state.progress }, vocabId, "vocabulary");
}

export function getVocabSessionSummary(state: UserState): VocabSessionSummary {
  let newCount = 0;
  let reviewCount = 0;
  let masteredCount = 0;

  for (const word of VOCABULARY) {
    const progress = state.progress[word.id];
    if (!progress || progress.mastery === 0) {
      newCount += 1;
    } else if (isDue(progress)) {
      reviewCount += 1;
    }
    if (isMastered(progress)) masteredCount += 1;
  }

  const newInSession = Math.min(5, newCount);
  const readyCount = reviewCount + newInSession;
  const sessionSize = Math.min(
    15,
    Math.max(reviewCount > 0 || newCount > 0 ? 5 : 0, readyCount)
  );

  return {
    newCount,
    reviewCount,
    readyCount,
    sessionSize,
    totalWords: VOCABULARY.length,
    masteredCount,
    savedCount: state.savedVocabularyIds.length,
    caughtUp: reviewCount === 0 && newCount === 0,
  };
}

export function getVocabThemes(): Array<{
  theme: string;
  label: string;
  count: number;
}> {
  const counts = new Map<string, number>();
  for (const word of VOCABULARY) {
    counts.set(word.theme, (counts.get(word.theme) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([theme, count]) => ({
      theme,
      label: VOCAB_THEME_LABELS[theme] ?? theme,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function isUnintroduced(state: UserState, vocabId: string): boolean {
  const progress = state.progress[vocabId];
  return !progress || progress.mastery === 0;
}

function buildPracticePool(state: UserState, limit: number): VocabularyItem[] {
  const due = shuffle(
    VOCABULARY.filter((word) => {
      const progress = state.progress[word.id];
      return progress && isDue(progress);
    })
  );
  const weak = shuffle(
    VOCABULARY.filter((word) => {
      const progress = state.progress[word.id];
      return progress && isWeak(progress) && !isDue(progress);
    })
  );
  const fresh = shuffle(
    VOCABULARY.filter((word) => isUnintroduced(state, word.id))
  ).slice(0, 5);

  const pool: VocabularyItem[] = [];
  const seen = new Set<string>();
  for (const item of [...due, ...weak, ...fresh]) {
    if (seen.has(item.id) || pool.length >= limit) continue;
    seen.add(item.id);
    pool.push(item);
  }
  return pool;
}

export type VocabSessionMode = "practice" | "new" | "theme" | "saved";

export function buildVocabSession(
  state: UserState,
  options: {
    mode?: VocabSessionMode;
    theme?: string;
    limit?: number;
  } = {}
): VocabStudyCard[] {
  const summary = getVocabSessionSummary(state);
  const limit =
    options.limit ??
    (options.mode === "theme" || options.mode === "saved"
      ? 15
      : summary.sessionSize || 12);

  let pool: VocabularyItem[] = [];

  if (options.mode === "saved") {
    pool = getVocabByIds(state.savedVocabularyIds);
  } else if (options.mode === "theme" && options.theme) {
    pool = getVocabByTheme(options.theme);
  } else if (options.mode === "new") {
    pool = VOCABULARY.filter((word) => isUnintroduced(state, word.id));
  } else {
    pool = buildPracticePool(state, limit);
  }

  pool = shuffle(pool).slice(0, limit);

  return pool.map((word) => {
    const progress = state.progress[word.id];
    const kind = pickCardKind(progress);
    return {
      id: uid("vc"),
      vocabId: word.id,
      kind,
      exercise:
        kind === "flashcard" ? undefined : buildRecallExercise(word, kind),
    };
  });
}

function pickCardKind(progress: ItemProgress | undefined): VocabCardKind {
  const mastery = progress?.mastery ?? 0;
  if (mastery <= 1) return "flashcard";
  if (mastery === 2) {
    return shuffle<VocabCardKind>(["flashcard", "recall_en"])[0];
  }
  if (mastery === 3) {
    return shuffle<VocabCardKind>(["recall_en", "recall_jp", "context"])[0];
  }
  return shuffle<VocabCardKind>([
    "recall_en",
    "recall_jp",
    "recall_kana",
    "context",
  ])[0];
}

function blankTargetInExample(
  word: VocabularyItem
): { sentence: string; reading?: string } | null {
  const example = word.exampleSentence;
  if (!example) return null;

  const blankSurface = (surface: string, readingSurface?: string) => {
    let reading = word.exampleSentenceReading;
    if (reading && readingSurface) {
      reading = reading.replace(readingSurface, "＿＿");
    }
    return {
      sentence: example.replace(surface, "＿＿"),
      reading,
    };
  };

  if (example.includes(word.japanese)) {
    const readingSurface =
      word.kana !== word.japanese && word.exampleSentenceReading?.includes(word.kana)
        ? word.kana
        : undefined;
    return blankSurface(word.japanese, readingSurface);
  }

  if (word.kana && word.kana !== word.japanese && example.includes(word.kana)) {
    return blankSurface(word.kana, word.kana);
  }

  if (word.japanese === "する") {
    const suruForm = example.match(/し(?:ます|ました|ません|たい|て|た|ながら|ましょう)/);
    if (suruForm) {
      const kanaForm = word.exampleSentenceReading?.match(
        /し(?:ます|ました|ません|たい|て|た|ながら|ましょう)/
      );
      return blankSurface(suruForm[0], kanaForm?.[0]);
    }
  }

  const stem = word.japanese.replace(/(する|る|く|ぐ|ぶ|む|ぬ|う|つ|す|い)$/, "");
  if (stem.length >= 1) {
    const match = example.match(new RegExp(`${stem}[ぁ-んァ-ヶー]*`));
    if (match) {
      const surface = match[0];
      let reading = word.exampleSentenceReading;
      if (reading && word.kana) {
        const kanaStem = word.kana.replace(
          /(する|る|く|ぐ|ぶ|む|ぬ|う|つ|す|い)$/,
          ""
        );
        const kanaMatch = reading.match(
          new RegExp(`${kanaStem}[ぁ-んァ-ヶー]*`)
        );
        if (kanaMatch) {
          reading = reading.replace(kanaMatch[0], "＿＿");
        }
      }
      return {
        sentence: example.replace(surface, "＿＿"),
        reading,
      };
    }
  }

  return null;
}

function buildRecallExercise(
  word: VocabularyItem,
  kind: Exclude<VocabCardKind, "flashcard">
): Exercise | undefined {
  const meaningPool = VOCABULARY.map((x) => x.english);
  const japanesePool = VOCABULARY.filter(
    (x) => x.theme === word.theme || x.id !== word.id
  ).map((x) => x.japanese);

  if (kind === "recall_en") {
    return {
      id: uid("ex"),
      type: "multiple_choice",
      prompt: "What does this mean?",
      promptJapanese: word.japanese,
      promptReading: containsKanji(word.japanese) ? word.kana : undefined,
      options: mcOptions(
        word.english,
        pickDistractors(word.english, meaningPool)
      ),
      correctAnswer: word.english,
      contentId: word.id,
      contentType: "vocabulary",
      explanation: `${word.japanese} means "${word.english}".`,
    };
  }

  if (kind === "recall_kana") {
    return {
      id: uid("ex"),
      type: "multiple_choice",
      prompt: "What does this mean?",
      promptReading: word.kana,
      options: mcOptions(
        word.english,
        pickDistractors(word.english, meaningPool)
      ),
      correctAnswer: word.english,
      contentId: word.id,
      contentType: "vocabulary",
      explanation: `${word.kana} (${word.japanese}) means "${word.english}".`,
    };
  }

  if (kind === "recall_jp") {
    return {
      id: uid("ex"),
      type: "en_to_jp",
      prompt: `Which Japanese word means "${word.english}"?`,
      options: mcOptions(
        word.japanese,
        pickDistractors(word.japanese, japanesePool)
      ),
      correctAnswer: word.japanese,
      contentId: word.id,
      contentType: "vocabulary",
      isProduction: true,
      explanation: `"${word.english}" → ${word.japanese}`,
    };
  }

  const blank = blankTargetInExample(word);
  if (!blank) {
    return buildRecallExercise(word, "recall_en");
  }

  return {
    id: uid("ex"),
    type: "en_to_jp",
    prompt: "Which word completes the sentence?",
    passage: blank.sentence,
    passageReading: blank.reading,
    options: mcOptions(
      word.japanese,
      pickDistractors(word.japanese, japanesePool)
    ),
    correctAnswer: word.japanese,
    contentId: word.id,
    contentType: "vocabulary",
    isProduction: true,
    explanation: `${blank.sentence.replace("＿＿", word.japanese)} — ${word.exampleTranslation}`,
  };
}

export function applyVocabRating(
  state: UserState,
  vocabId: string,
  rating: VocabRating,
  isProduction = false
): UserState {
  const progress = getVocabProgress(state, vocabId);
  const today = todayKey();

  if (rating === "again") {
    const updated = applyAnswer(progress, false, isProduction);
    return {
      ...state,
      progress: {
        ...state.progress,
        [vocabId]: {
          ...updated,
          intervalDays: 0,
          nextReview: today,
        },
      },
    };
  }

  let updated = applyAnswer(progress, true, isProduction);

  if (rating === "hard") {
    const reduced = clampMastery(updated.mastery - 1);
    const hardMastery = Math.max(1, reduced) as MasteryLevel;
    const interval = INTERVALS_BY_MASTERY[hardMastery];
    updated = {
      ...updated,
      mastery: hardMastery,
      intervalDays: interval,
      nextReview: addDays(today, interval),
    };
  } else if (rating === "easy") {
    const boosted = clampMastery(updated.mastery + 1);
    const interval = INTERVALS_BY_MASTERY[boosted] ?? updated.intervalDays + 3;
    updated = {
      ...updated,
      mastery: boosted,
      intervalDays: interval,
      nextReview: addDays(today, interval),
    };
  }

  return {
    ...state,
    progress: {
      ...state.progress,
      [vocabId]: updated,
    },
  };
}

export function toggleSavedVocabulary(
  state: UserState,
  vocabId: string
): UserState {
  if (!getVocabById(vocabId)) return state;
  const saved = new Set(state.savedVocabularyIds);
  if (saved.has(vocabId)) {
    saved.delete(vocabId);
  } else {
    saved.add(vocabId);
  }
  return {
    ...state,
    savedVocabularyIds: [...saved],
  };
}

export function isVocabularySaved(state: UserState, vocabId: string): boolean {
  return state.savedVocabularyIds.includes(vocabId);
}

export function labelForVocabStatus(status: VocabStudyStatus): string {
  switch (status) {
    case "new":
      return "New";
    case "learning":
      return "Learning";
    case "familiar":
      return "Familiar";
    case "mastered":
      return "Mastered";
  }
}
