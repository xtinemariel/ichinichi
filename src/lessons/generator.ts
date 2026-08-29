/**
 * Lesson generator — teach first, quiz last.
 * Never requires Japanese keyboard / typing.
 */
import type {
  Concept,
  Exercise,
  ExerciseOption,
  GeneratedLesson,
  ItemProgress,
  LessonNotes,
  LessonPhase,
  LessonType,
  TeachBlock,
  UserState,
} from "@/lib/types";
import {
  CONCEPTS,
  getConceptById,
  getGrammarById,
  getKanaById,
  getKanjiById,
  getVocabById,
  HIRAGANA,
  KANJI,
  VOCABULARY,
} from "@/curriculum";
import { isDue, isWeak } from "@/engine/mastery";
import { uid } from "@/lib/dates";
import { containsKanji } from "@/lib/furigana";
import { resolveFuriganaReading } from "@/lib/readings";
import {
  buildGrammarQuizExercises,
  buildGrammarReviewPhase,
  buildGrammarTeachContent,
  isGrammarConcept,
  sameMeaning,
  uniqueByMeaning,
} from "@/lessons/grammarLesson";
import { GRAMMAR_POINTS } from "@/curriculum/grammar";
import { getGrammarPedagogy } from "@/curriculum/grammarPedagogy";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(correct: string, pool: string[], count = 3): string[] {
  return shuffle(pool.filter((p) => p !== correct)).slice(0, count);
}

function mcOptions(correct: string, distractors: string[]): ExerciseOption[] {
  return shuffle([correct, ...distractors]).map((label, i) => ({
    id: `opt-${i}`,
    label,
  }));
}

function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[。．.！!？?\s]/g, "")
    .replace(/ー/g, "");
}

export function checkAnswer(exercise: Exercise, userAnswer: string): boolean {
  if (exercise.type === "matching") {
    return normalizeAnswer(userAnswer) === normalizeAnswer(exercise.correctAnswer);
  }
  const normalized = normalizeAnswer(userAnswer);
  const candidates = [
    exercise.correctAnswer,
    ...(exercise.acceptableAnswers ?? []),
  ].map(normalizeAnswer);
  return candidates.includes(normalized);
}

function showRomaji(concept: Concept): boolean {
  return concept.order <= 22;
}

function getIntroducedIds(
  state: UserState,
  contentType: ItemProgress["contentType"]
): string[] {
  return Object.values(state.progress)
    .filter((p) => p.contentType === contentType && p.mastery >= 1)
    .map((p) => p.id);
}

function getDueOrWeakIds(
  state: UserState,
  contentType: ItemProgress["contentType"]
): string[] {
  return Object.values(state.progress)
    .filter(
      (p) =>
        p.contentType === contentType &&
        p.mastery >= 1 &&
        (isDue(p) || isWeak(p))
    )
    .map((p) => p.id);
}

/** Collect reviewable items the user has actually studied — never invent greetings. */
function collectReviewExercises(state: UserState, limit = 4): Exercise[] {
  const exercises: Exercise[] = [];
  const used = new Set<string>();

  const push = (ex: Exercise | null) => {
    if (!ex || !ex.contentId || used.has(ex.contentId)) return;
    used.add(ex.contentId);
    exercises.push(ex);
  };

  // 1. Due / weak items first (any type)
  for (const id of shuffle(getDueOrWeakIds(state, "kana")).slice(0, 3)) {
    push(makeKanaToRomaji(id) ?? makeRomajiToKana(id));
  }
  for (const id of shuffle(getDueOrWeakIds(state, "vocabulary")).slice(0, 3)) {
    push(makeVocabMc(id));
  }
  for (const id of shuffle(getDueOrWeakIds(state, "grammar")).slice(0, 2)) {
    push(makeGrammarMc(id));
  }
  for (const id of shuffle(getDueOrWeakIds(state, "kanji")).slice(0, 2)) {
    push(makeKanjiMc(id));
  }

  // 2. Fill from content linked to recently completed concepts
  if (exercises.length < limit) {
    for (const conceptId of state.recentLessonConceptIds) {
      if (exercises.length >= limit) break;
      const concept = getConceptById(conceptId);
      if (!concept) continue;
      for (const id of shuffle(concept.kanaIds).slice(0, 3)) {
        push(makeKanaToRomaji(id));
        if (exercises.length >= limit) break;
      }
      for (const id of shuffle(concept.vocabularyIds).slice(0, 2)) {
        push(makeVocabMc(id));
        if (exercises.length >= limit) break;
      }
      for (const id of concept.grammarIds.slice(0, 1)) {
        push(makeGrammarMc(id));
      }
      for (const id of shuffle(concept.kanjiIds).slice(0, 2)) {
        push(makeKanjiMc(id));
      }
    }
  }

  // 3. Fill from any introduced progress (still only things the user has seen)
  if (exercises.length < limit) {
    for (const id of shuffle(getIntroducedIds(state, "kana")).slice(0, 4)) {
      push(makeRomajiToKana(id) ?? makeKanaToRomaji(id));
      if (exercises.length >= limit) break;
    }
    for (const id of shuffle(getIntroducedIds(state, "vocabulary")).slice(0, 4)) {
      push(makeVocabMc(id));
      if (exercises.length >= limit) break;
    }
  }

  return shuffle(exercises).slice(0, limit);
}

/* ─── Exercise builders (selection only) ─── */

function makeVocabMc(
  vocabId: string,
  countsAsQuiz = false,
  withRomaji = false
): Exercise | null {
  const v = getVocabById(vocabId);
  if (!v) return null;
  return {
    id: uid("ex"),
    type: "multiple_choice",
    prompt: "What does this mean?",
    promptJapanese: v.japanese,
    promptReading: containsKanji(v.japanese) ? v.kana : withRomaji ? v.romaji : undefined,
    options: mcOptions(
      v.english,
      pickDistractors(
        v.english,
        VOCABULARY.map((x) => x.english)
      )
    ),
    correctAnswer: v.english,
    contentId: v.id,
    contentType: "vocabulary",
    explanation: `${v.japanese} means "${v.english}".`,
    countsAsQuiz,
  };
}

/** English → Japanese via selecting Japanese options */
function makeVocabSelectJp(vocabId: string, countsAsQuiz = false): Exercise | null {
  const v = getVocabById(vocabId);
  if (!v) return null;
  const pool = VOCABULARY.filter((x) => x.theme === v.theme || x.id !== v.id).map(
    (x) => x.japanese
  );
  return {
    id: uid("ex"),
    type: "en_to_jp",
    prompt: `Which one means "${v.english}"?`,
    options: mcOptions(v.japanese, pickDistractors(v.japanese, pool)),
    correctAnswer: v.japanese,
    contentId: v.id,
    contentType: "vocabulary",
    isProduction: true,
    explanation: `"${v.english}" → ${v.japanese}`,
    countsAsQuiz,
  };
}

function makeKanaToRomaji(kanaId: string, countsAsQuiz = false): Exercise | null {
  const k = getKanaById(kanaId);
  if (!k) return null;
  return {
    id: uid("ex"),
    type: "kana_recognition",
    prompt: "What sound does this make?",
    promptJapanese: k.character,
    options: mcOptions(
      k.romaji,
      pickDistractors(
        k.romaji,
        HIRAGANA.map((x) => x.romaji)
      )
    ),
    correctAnswer: k.romaji,
    contentId: k.id,
    contentType: "kana",
    explanation: `${k.character} is pronounced "${k.romaji}".`,
    countsAsQuiz,
  };
}

/** Romaji → pick the character */
function makeRomajiToKana(kanaId: string, countsAsQuiz = false): Exercise | null {
  const k = getKanaById(kanaId);
  if (!k) return null;
  const sameType = HIRAGANA.filter((x) => x.type === k.type || true);
  return {
    id: uid("ex"),
    type: "kana_select",
    prompt: `Which character is "${k.romaji}"?`,
    options: mcOptions(
      k.character,
      pickDistractors(
        k.character,
        sameType.map((x) => x.character)
      )
    ),
    correctAnswer: k.character,
    contentId: k.id,
    contentType: "kana",
    isProduction: true,
    explanation: `"${k.romaji}" → ${k.character}`,
    countsAsQuiz,
  };
}

function makeKanjiMc(kanjiId: string, countsAsQuiz = false): Exercise | null {
  const k = getKanjiById(kanjiId);
  if (!k) return null;
  const reading = [...k.onyomi, ...k.kunyomi].filter(Boolean)[0];
  return {
    id: uid("ex"),
    type: "multiple_choice",
    prompt: "What does this kanji mean?",
    promptJapanese: k.character,
    promptReading: reading,
    options: mcOptions(
      k.meaning,
      pickDistractors(
        k.meaning,
        KANJI.map((x) => x.meaning)
      )
    ),
    correctAnswer: k.meaning,
    contentId: k.id,
    contentType: "kanji",
    explanation: `${k.character} (${reading ?? ""}) means "${k.meaning}".`,
    countsAsQuiz,
  };
}

function makeGrammarMc(grammarId: string, countsAsQuiz = false): Exercise | null {
  const g = getGrammarById(grammarId);
  if (!g || g.examples.length === 0) return null;
  const example = g.examples[Math.floor(Math.random() * g.examples.length)];

  // Distractors are real translations from other grammar points, so they are
  // always plausible; anything meaning the same as the answer is excluded.
  const pool = uniqueByMeaning(
    GRAMMAR_POINTS.filter((other) => other.id !== g.id)
      .flatMap((other) => other.examples.map((e) => e.english))
      .filter((en) => !sameMeaning(en, example.english))
  );

  const distractors = pickDistractors(example.english, shuffle(pool), 3);
  if (distractors.length < 2) return null;

  return {
    id: uid("ex"),
    type: "jp_to_en",
    prompt: "What does this mean?",
    promptJapanese: example.japanese,
    promptReading: resolveFuriganaReading(example.japanese, example.reading),
    options: mcOptions(example.english, distractors),
    correctAnswer: example.english,
    contentId: g.id,
    contentType: "grammar",
    explanation: g.explanation,
    countsAsQuiz,
  };
}

function makeConjugationSelect(
  prompt: string,
  correct: string,
  options: string[],
  contentId: string,
  explanation: string,
  countsAsQuiz = false
): Exercise {
  return {
    id: uid("ex"),
    type: "conjugation",
    prompt,
    options: mcOptions(correct, options.filter((o) => o !== correct).slice(0, 3)),
    correctAnswer: correct,
    contentId,
    contentType: "grammar",
    isProduction: true,
    explanation,
    countsAsQuiz,
  };
}

function makeWordOrdering(
  prompt: string,
  tokens: string[],
  answer: string,
  contentId: string,
  contentType: Exercise["contentType"] = "grammar",
  countsAsQuiz = false
): Exercise {
  return {
    id: uid("ex"),
    type: "word_ordering",
    prompt,
    tokens: shuffle(tokens),
    correctAnswer: answer,
    contentId,
    contentType,
    isProduction: true,
    explanation: answer,
    countsAsQuiz,
  };
}

function makeMatching(
  pairs: Array<{ left: string; right: string }>,
  contentId?: string
): Exercise {
  const correctAnswer = pairs.map((p) => `${p.left}=${p.right}`).sort().join("|");
  return {
    id: uid("ex"),
    type: "matching",
    prompt: "Match each item with its meaning",
    matchingPairs: pairs,
    correctAnswer,
    contentId,
    contentType: "vocabulary",
    explanation: pairs.map((p) => `${p.left} → ${p.right}`).join(" · "),
  };
}

export function conceptExercises(
  concept: Concept,
  mode: "practice" | "recall" | "quiz"
): Exercise[] {
  const quiz = mode === "quiz";
  const exercises: Exercise[] = [];

  // Pronunciation opener — vowel recognition without typing
  if (concept.id === "c-pronunciation") {
    for (const id of ["h-a", "h-i", "h-u", "h-e", "h-o"]) {
      const ex =
        mode === "practice" || mode === "recall"
          ? makeRomajiToKana(id, quiz)
          : makeKanaToRomaji(id, quiz);
      if (ex) exercises.push(ex);
    }
    exercises.push({
      id: uid("ex"),
      type: "multiple_choice",
      prompt: "Japanese mora (syllable beats) are generally:",
      options: mcOptions("Equal in length / timing", [
        "Stressed like English",
        "Silent most of the time",
        "Only used in singing",
      ]),
      correctAnswer: "Equal in length / timing",
      explanation:
        "Each mora gets roughly equal time — this rhythm is key to natural Japanese.",
      countsAsQuiz: quiz,
    });
    const limit = mode === "quiz" ? 5 : mode === "recall" ? 4 : 6;
    return shuffle(exercises).slice(0, limit);
  }

  for (const id of shuffle(concept.kanaIds).slice(0, mode === "quiz" ? 3 : 4)) {
    if (mode === "practice") {
      const a = makeRomajiToKana(id, quiz);
      const b = makeKanaToRomaji(id, quiz);
      if (a) exercises.push(a);
      if (b && exercises.length < 5) exercises.push(b);
    } else {
      const ex =
        mode === "recall" ? makeRomajiToKana(id, quiz) : makeKanaToRomaji(id, quiz);
      if (ex) exercises.push(ex);
    }
  }

  for (const id of shuffle(concept.vocabularyIds).slice(0, 4)) {
    const ex =
      mode === "recall" || mode === "quiz"
        ? makeVocabSelectJp(id, quiz) ?? makeVocabMc(id, quiz)
        : makeVocabMc(id, quiz);
    if (ex) exercises.push(ex);
  }

  for (const id of concept.grammarIds.slice(0, 2)) {
    const ex = makeGrammarMc(id, quiz);
    if (ex) exercises.push(ex);
  }

  for (const id of shuffle(concept.kanjiIds).slice(0, 3)) {
    const ex = makeKanjiMc(id, quiz);
    if (ex) exercises.push(ex);
  }

  // Concept-specific conjugation banks (selection)
  if (concept.id === "c-past-tense" || concept.id === "c-masu") {
    exercises.push(
      makeConjugationSelect(
        "食べます → polite past?",
        "食べました",
        ["食べました", "食べません", "食べませんでした", "食べる"],
        "g-mashita",
        "ます → ました for polite past.",
        quiz
      )
    );
    exercises.push(
      makeConjugationSelect(
        'How do you say "I drank" politely?',
        "飲みました",
        ["飲みます", "飲みました", "飲みません", "飲みませんでした"],
        "g-mashita",
        "飲む → 飲みます → 飲みました",
        quiz
      )
    );
  }

  if (concept.id === "c-desu") {
    exercises.push(
      makeConjugationSelect(
        'Complete: わたしは 学生______。 — "I am a student."',
        "です",
        ["です", "ます", "でした", "ません"],
        "g-desu",
        "です states what something is, right now. でした would make it past (“I was a student”).",
        quiz
      )
    );
    exercises.push(
      makeWordOrdering(
        "Build: I am a student.",
        ["わたしは", "学生", "です"],
        "わたしは学生です",
        "g-desu",
        "grammar",
        quiz
      )
    );
  }

  if (concept.id === "c-particle-wo") {
    exercises.push(
      makeConjugationSelect(
        'Which particle marks the thing being drunk?\nコーヒー______ 飲みます。 — "I drink coffee."',
        "を",
        ["を", "が", "に", "で"],
        "g-wo",
        "を marks the direct object — the thing the verb acts on.",
        quiz
      )
    );
  }

  if (concept.id === "c-particle-ni") {
    exercises.push(
      makeConjugationSelect(
        'Complete: 学校______ 行きます。 — "I go to school."',
        "に",
        ["に", "を", "で", "と"],
        "g-ni",
        "に marks the destination you move toward.",
        quiz
      )
    );
  }

  if (
    concept.id === "c-sentence-building" ||
    concept.lessonType === "SENTENCE_BUILDING"
  ) {
    exercises.push(
      makeWordOrdering(
        "Build: I go to school.",
        ["わたしは", "学校に", "行きます"],
        "わたしは学校に行きます",
        "v-iku",
        "vocabulary",
        quiz
      )
    );
  }

  if (concept.vocabularyIds.length >= 3 && mode === "practice") {
    const pairs = concept.vocabularyIds
      .slice(0, 4)
      .map((id) => getVocabById(id))
      .filter(Boolean)
      .map((v) => ({ left: v!.japanese, right: v!.english }));
    if (pairs.length >= 3) exercises.push(makeMatching(pairs));
  }

  if (
    concept.lessonType === "READING" ||
    concept.id.startsWith("c-reading") ||
    concept.id === "c-listening-1"
  ) {
    exercises.push({
      id: uid("ex"),
      type: "reading",
      prompt: "According to the passage, the writer is a…",
      passage: "わたしは学生です。毎日日本語を勉強します。コーヒーが好きです。",
      options: mcOptions("Student", ["Teacher", "Doctor", "Engineer"]),
      correctAnswer: "Student",
      contentId: "v-gakusei",
      contentType: "vocabulary",
      explanation: "学生 means student.",
      countsAsQuiz: quiz,
    });
  }

  const limit = mode === "quiz" ? 5 : mode === "recall" ? 4 : 6;
  return shuffle(exercises).slice(0, limit);
}

/* ─── Teaching content builders ─── */

/** After a few lessons, review warm-ups feel repetitive — offer a skip. */
const REVIEW_SKIP_MIN_LESSONS = 3;

export function reviewIsSkippable(
  state: UserState,
  options?: { isWelcomeBack?: boolean; forceReview?: boolean }
): boolean {
  if (options?.isWelcomeBack || options?.forceReview) return false;
  return state.lessonsCompleted >= REVIEW_SKIP_MIN_LESSONS;
}

function buildReviewPhase(
  state: UserState,
  options?: { skippable?: boolean }
): LessonPhase {
  const exercises = collectReviewExercises(state, 4);
  const skippable = options?.skippable ?? false;
  return {
    id: uid("phase"),
    kind: "review",
    title: "Quick review",
    estimatedMinutes: 3,
    mode: "practice",
    skippable,
    teachBlocks:
      exercises.length > 0
        ? [
            {
              kind: "paragraph",
              text: skippable
                ? "A quick warm-up on what you've already studied. Skip ahead if you're ready for today's lesson."
                : "Warm up with a few things you've already studied — recognition only.",
            },
          ]
        : undefined,
    exercises,
  };
}

function buildKanaTeachBlocks(concept: Concept): {
  learn: TeachBlock[];
  examples: TeachBlock[];
} {
  const romaji = showRomaji(concept);
  const chars = concept.kanaIds
    .map((id) => getKanaById(id))
    .filter(Boolean);
  const learn: TeachBlock[] = [
    {
      kind: "heading",
      text: concept.title,
    },
    {
      kind: "paragraph",
      text:
        "Look at each character carefully. Say the sound aloud. You will practice recognizing them — no typing needed.",
    },
  ];

  for (const k of chars.slice(0, 6)) {
    if (!k) continue;
    learn.push({
      kind: "hero_character",
      character: k.character,
      sound: k.romaji,
      romaji: romaji ? k.romaji : undefined,
      note: `This is "${k.romaji}".`,
    });
  }

  const examples: TeachBlock[] = [
    { kind: "heading", text: "See them together" },
    {
      kind: "paragraph",
      text: "Read down the list. Try to hear the sound in your head before checking.",
    },
  ];
  for (const k of chars) {
    if (!k) continue;
    examples.push({
      kind: "vocab_row",
      japanese: k.character,
      reading: romaji ? k.romaji : undefined,
      english: k.romaji,
    });
  }
  examples.push({
    kind: "callout",
    variant: "tip",
    title: "Memory tip",
    body: "Shape first, sound second. Cover the romaji and test yourself once.",
  });

  return { learn, examples };
}

function buildGrammarTeachBlocks(concept: Concept): {
  learn: TeachBlock[];
  examples: TeachBlock[];
} {
  // Special overrides for bundled/synthetic concepts
  if (concept.id === "c-past-tense") {
    const learn: TeachBlock[] = [
      { kind: "heading", text: "Talking About the Past" },
      {
        kind: "paragraph",
        text: "In Japanese, the polite past form of a verb uses 〜ました.",
      },
      { kind: "pattern", label: "Polite past", value: "[verb stem] ました" },
      {
        kind: "table",
        headers: ["Present (ます)", "Past (ました)", "English"],
        rows: [
          ["食べます", "食べました", "I eat → I ate"],
          ["飲みます", "飲みました", "I drink → I drank"],
          ["行きます", "行きました", "I go → I went"],
          ["見ます", "見ました", "I watch → I watched"],
        ],
      },
      {
        kind: "callout",
        variant: "remember",
        title: "Remember",
        body: "ます = present/future · ました = past · ません = negative · ませんでした = past negative",
      },
    ];
    const examples: TeachBlock[] = [
      { kind: "heading", text: "In full sentences" },
      {
        kind: "example",
        japanese: "昨日映画を見ました。",
        english: "I watched a movie yesterday.",
        highlight: "ました",
      },
      {
        kind: "example",
        japanese: "朝ごはんを食べました。",
        english: "I ate breakfast.",
        highlight: "ました",
      },
      {
        kind: "example",
        japanese: "勉強しませんでした。",
        english: "I did not study.",
        highlight: "ませんでした",
      },
      {
        kind: "callout",
        variant: "mistake",
        title: "Common mistake",
        body: '❌ 食べませんでした = "I don\'t eat"\n✅ 食べませんでした = "I did not eat" (past)',
      },
    ];
    return { learn, examples };
  }

  if (concept.id === "c-word-order") {
    return {
      learn: [
        { kind: "heading", text: "Japanese Word Order" },
        {
          kind: "paragraph",
          text: "English is often Subject–Verb–Object. Japanese is typically Subject–Object–Verb — the verb comes at the end.",
        },
        {
          kind: "example",
          japanese: "わたしは コーヒーを 飲みます。",
          english: "I drink coffee.",
        },
        {
          kind: "breakdown",
          title: "Break it down",
          parts: [
            { jp: "わたしは", en: "I (topic)" },
            { jp: "コーヒーを", en: "coffee (object)" },
            { jp: "飲みます", en: "drink (verb — at the end)" },
          ],
        },
      ],
      examples: [],
    };
  }

  if (concept.id === "c-pronunciation") {
    return {
      learn: [
        { kind: "heading", text: "How Japanese Sounds" },
        {
          kind: "paragraph",
          text: "Japanese has five pure vowels. Each mora (beat) gets roughly equal time — unlike English stress.",
        },
        {
          kind: "hero_character",
          character: "あ",
          sound: "a",
          romaji: "a",
          note: 'Open "ah"',
        },
        {
          kind: "hero_character",
          character: "い",
          sound: "i",
          romaji: "i",
          note: 'Like "ee"',
        },
        {
          kind: "hero_character",
          character: "う",
          sound: "u",
          romaji: "u",
          note: 'Like "oo"',
        },
        {
          kind: "hero_character",
          character: "え",
          sound: "e",
          romaji: "e",
          note: 'Like "eh"',
        },
        {
          kind: "hero_character",
          character: "お",
          sound: "o",
          romaji: "o",
          note: 'Like "oh"',
        },
        {
          kind: "callout",
          variant: "tip",
          title: "Try this",
          body: "Say a-i-u-e-o slowly, then at a steady rhythm. Audio can be added later — for now, speak aloud.",
        },
      ],
      examples: [
        { kind: "heading", text: "Meet the vowels together" },
        {
          kind: "table",
          headers: ["Character", "Sound"],
          rows: [
            ["あ", "a"],
            ["い", "i"],
            ["う", "u"],
            ["え", "e"],
            ["お", "o"],
          ],
        },
      ],
    };
  }

  if (isGrammarConcept(concept)) {
    const { learn, examples } = buildGrammarTeachContent(concept);
    return { learn, examples };
  }

  return {
    learn: [
      { kind: "heading", text: concept.title },
      { kind: "paragraph", text: concept.description },
    ],
    examples: [],
  };
}

function buildVocabTeachBlocks(concept: Concept): {
  learn: TeachBlock[];
  examples: TeachBlock[];
} {
  const vocabs = concept.vocabularyIds
    .map((id) => getVocabById(id))
    .filter(Boolean);
  const learn: TeachBlock[] = [
    { kind: "heading", text: concept.title },
    {
      kind: "paragraph",
      text: "Learn this small set of related words. Read the Japanese first, then the meaning.",
    },
  ];
  for (const v of vocabs.slice(0, 10)) {
    if (!v) continue;
    learn.push({
      kind: "vocab_row",
      japanese: v.japanese,
      reading: resolveFuriganaReading(v.japanese, v.kana),
      english: v.english,
    });
  }

  const examples: TeachBlock[] = [
    { kind: "heading", text: "In sentences" },
    {
      kind: "paragraph",
      text: "See how these words appear in simple Japanese.",
    },
  ];
  for (const v of vocabs.slice(0, 8)) {
    if (!v) continue;
    examples.push({
      kind: "example",
      japanese: v.exampleSentence,
      reading: resolveFuriganaReading(
        v.exampleSentence,
        v.exampleSentenceReading
      ),
      english: v.exampleTranslation,
    });
  }
  return { learn, examples };
}

function buildKanjiTeachBlocks(concept: Concept): {
  learn: TeachBlock[];
  examples: TeachBlock[];
} {
  const kanjis = concept.kanjiIds
    .map((id) => getKanjiById(id))
    .filter(Boolean);
  const learn: TeachBlock[] = [
    { kind: "heading", text: concept.title },
    {
      kind: "paragraph",
      text: "Focus on meaning first, then common readings. A few kanji at a time.",
    },
  ];
  for (const k of kanjis.slice(0, 6)) {
    if (!k) continue;
    const readings = [...k.onyomi, ...k.kunyomi].filter(Boolean);
    learn.push({
      kind: "hero_character",
      character: k.character,
      furigana: readings[0],
      sound: k.meaning,
      romaji: readings.length > 1 ? readings.slice(0, 3).join(" · ") : undefined,
    });
  }
  const examples: TeachBlock[] = [
    { kind: "heading", text: "In words & sentences" },
  ];
  for (const k of kanjis.slice(0, 4)) {
    if (!k) continue;
    for (const w of k.exampleWords.slice(0, 2)) {
      examples.push({
        kind: "vocab_row",
        japanese: w.japanese,
        reading: resolveFuriganaReading(w.japanese, w.reading),
        english: w.english,
      });
    }
    examples.push({
      kind: "example",
      japanese: k.exampleSentence,
      reading: resolveFuriganaReading(
        k.exampleSentence,
        k.exampleSentenceReading
      ),
      english: k.exampleTranslation,
    });
  }
  return { learn, examples };
}

function buildTeachContent(concept: Concept): {
  learn: TeachBlock[];
  examples: TeachBlock[];
} {
  if (concept.kanaIds.length > 0 && concept.type === "kana") {
    return buildKanaTeachBlocks(concept);
  }
  if (concept.grammarIds.length > 0 || concept.type === "grammar" || concept.type === "particle") {
    return buildGrammarTeachBlocks(concept);
  }
  if (concept.kanjiIds.length > 0 || concept.type === "kanji") {
    return buildKanjiTeachBlocks(concept);
  }
  if (concept.vocabularyIds.length > 0) {
    return buildVocabTeachBlocks(concept);
  }
  return buildGrammarTeachBlocks(concept);
}

function buildNotes(concept: Concept): LessonNotes {
  const g = concept.grammarIds.map((id) => getGrammarById(id)).find(Boolean);
  const remember: string[] = [];
  const mistakes: LessonNotes["commonMistakes"] = [];

  if (concept.id === "c-past-tense") {
    remember.push(
      "ます = polite present/future",
      "ました = polite past",
      "ません = polite negative",
      "ませんでした = polite past negative"
    );
    mistakes.push({
      wrong: "食べません",
      right: "食べませんでした",
      note: "For “I did not eat,” ません is not enough — でした is what makes it past.",
    });
  } else if (g) {
    const pedagogy = getGrammarPedagogy(g);
    remember.push(g.pattern);
    if (pedagogy.meaningConcept) remember.push(pedagogy.meaningConcept);
    for (const m of (pedagogy.mistakes ?? []).slice(0, 2)) {
      mistakes.push({ wrong: m.wrong, right: m.right, note: m.note });
    }
  } else if (concept.id === "c-pronunciation") {
    remember.push(
      "Five vowels: あ a · い i · う u · え e · お o",
      "Each mora gets roughly equal time"
    );
  } else if (concept.kanaIds.length) {
    remember.push(
      ...concept.kanaIds
        .slice(0, 5)
        .map((id) => getKanaById(id))
        .filter(Boolean)
        .map((k) => `${k!.character} = ${k!.romaji}`)
    );
  } else if (concept.vocabularyIds.length) {
    remember.push(
      ...concept.vocabularyIds
        .slice(0, 5)
        .map((id) => getVocabById(id))
        .filter(Boolean)
        .map((v) => `${v!.japanese} — ${v!.english}`)
    );
  }

  return {
    summary: concept.description,
    remember: remember.slice(0, 6),
    commonMistakes: mistakes.slice(0, 3),
  };
}

function lessonMeta(concept: Concept): {
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  lessonType: LessonType;
} {
  if (concept.id === "c-past-tense") {
    return {
      title: "Talking About Yesterday",
      subtitle: "Grammar · Past Tense",
      description:
        "Learn how to say simple things like: I ate. I went. I watched a movie. I didn't study.",
      objectives: [
        "Use ました for polite past",
        "Use ませんでした for past negative",
        "Talk about yesterday's activities",
      ],
      lessonType: "GRAMMAR",
    };
  }

  const typeLabel: Partial<Record<LessonType, string>> = {
    KANA: "Writing · Kana",
    GRAMMAR: "Grammar",
    VOCABULARY: "Vocabulary",
    KANJI: "Kanji",
    REVIEW: "Review",
    NEW_CONCEPT: "New Concept",
    READING: "Reading",
    LISTENING: "Listening",
    SENTENCE_BUILDING: "Production",
  };

  const objectives = isGrammarConcept(concept)
    ? [
        `Discover how ${concept.title} works`,
        "Build from recognition to independent recall",
        "Use the grammar in new sentences",
      ]
    : [
        `Understand: ${concept.title}`,
        "See clear examples",
        "Build from recognition to independent recall",
      ];

  return {
    title: concept.title,
    subtitle: typeLabel[concept.lessonType] ?? "Lesson",
    description: concept.description,
    objectives,
    lessonType: concept.lessonType,
  };
}

/**
 * Deterministic curriculum-bound lesson generator.
 * Structure: Review → Learn → Examples → Quiz
 */
export function generateLesson(
  conceptId: string,
  state: UserState,
  options?: { isWelcomeBack?: boolean; forceReview?: boolean }
): GeneratedLesson {
  const concept = getConceptById(conceptId) ?? CONCEPTS[0];
  const meta = lessonMeta(concept);
  const teachContent = buildTeachContent(concept);
  const { learn, examples } = teachContent;
  const grammarTeach =
    isGrammarConcept(concept) ? buildGrammarTeachContent(concept) : null;
  const notes = buildNotes(concept);
  const isKana = concept.type === "kana" || concept.lessonType === "KANA";
  const isGrammar = Boolean(grammarTeach?.grammar);
  const skipReview = concept.order <= 2 && !options?.isWelcomeBack;

  const phases: LessonPhase[] = [];

  const reviewSkippable = reviewIsSkippable(state, options);

  if (!skipReview || options?.isWelcomeBack) {
    if (isGrammar) {
      const review = buildGrammarReviewPhase(
        concept,
        state,
        collectReviewExercises,
        { skippable: reviewSkippable }
      );
      if (review.exercises.length > 0 || options?.isWelcomeBack) {
        phases.push(review);
      }
    } else {
      const review = buildReviewPhase(state, { skippable: reviewSkippable });
      if (review.exercises.length > 0 || options?.isWelcomeBack) {
        phases.push(review);
      }
    }
  }

  phases.push({
    id: uid("phase"),
    kind: "learn",
    title: "Learn",
    estimatedMinutes: isKana ? 7 : 6,
    mode: "teaching",
    teachBlocks: learn,
    exercises: [],
  });

  if (examples.length > 0) {
    phases.push({
      id: uid("phase"),
      kind: "examples",
      title: "Examples",
      estimatedMinutes: 4,
      mode: "teaching",
      teachBlocks: examples,
      exercises: [],
    });
  }

  if (isGrammar && grammarTeach?.grammar && grammarTeach.pedagogy) {
    const { grammar, pedagogy } = grammarTeach;

    phases.push({
      id: uid("phase"),
      kind: "quiz",
      title: "Quiz",
      estimatedMinutes: 7,
      mode: "assessment",
      teachBlocks: [
        {
          kind: "paragraph",
          text: "Start with recognition, then work toward using the pattern from memory. You'll get a brief explanation after every answer.",
        },
      ],
      exercises: buildGrammarQuizExercises(grammar, pedagogy),
    });
  } else {
    const staged = [
      ...conceptExercises(concept, "practice").slice(0, 2),
      ...conceptExercises(concept, "quiz").slice(0, 2),
      ...conceptExercises(concept, "recall"),
    ];
    const seen = new Set<string>();
    const quizExercises = staged
      .filter((exercise) => {
        const key = `${exercise.contentId ?? ""}|${exercise.prompt}|${exercise.correctAnswer}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 7)
      .map((exercise) => ({ ...exercise, countsAsQuiz: true }));

    phases.push({
      id: uid("phase"),
      kind: "quiz",
      title: "Quiz",
      estimatedMinutes: 7,
      mode: "assessment",
      teachBlocks: [
        {
          kind: "paragraph",
          text: "Start with recognition, then work toward answering from memory. You'll get a brief explanation after every answer.",
        },
      ],
      exercises: quizExercises,
    });
  }

  const cleaned = phases.filter(
    (p) =>
      p.mode === "teaching" ||
      p.exercises.length > 0 ||
      (p.teachBlocks && p.teachBlocks.length > 0)
  );

  return {
    id: uid("lesson"),
    conceptId: concept.id,
    lessonType: meta.lessonType,
    title: meta.title,
    subtitle: meta.subtitle,
    description: options?.isWelcomeBack
      ? "We'll review what you were due to remember, then continue your path."
      : meta.description,
    estimatedMinutes: isGrammar ? 20 : 18,
    objectives: meta.objectives,
    phases: cleaned,
    notes,
    reviewRatio: options?.forceReview || options?.isWelcomeBack ? 0.6 : 0.3,
    isWelcomeBack: options?.isWelcomeBack,
  };
}

/**
 * Short 2–3 min knowledge check (3–5 tap-only questions).
 * No teaching content — verification only.
 */
export function generateKnowledgeCheck(
  conceptId: string,
  _state: UserState
): import("@/lib/types").KnowledgeCheck {
  const concept = getConceptById(conceptId) ?? CONCEPTS[0];
  const meta = lessonMeta(concept);
  const count = Math.min(
    5,
    Math.max(3, concept.difficulty >= 3 ? 5 : 4)
  );

  const exercises = shuffle([
    ...conceptExercises(concept, "recall"),
    ...conceptExercises(concept, "quiz"),
  ])
    .filter((ex, i, arr) => {
      const key = `${ex.contentId ?? ""}|${ex.correctAnswer}`;
      return (
        arr.findIndex((e) => `${e.contentId ?? ""}|${e.correctAnswer}` === key) ===
        i
      );
    })
    .slice(0, count)
    .map((e) => ({ ...e, countsAsQuiz: true, hint: undefined }));

  return {
    id: uid("kcheck"),
    conceptId: concept.id,
    title: meta.title,
    subtitle: "Knowledge check",
    estimatedMinutes: 3,
    exercises,
  };
}

/**
 * Targeted ~5–10 min review after a borderline knowledge check.
 */
export function generateQuickReview(
  conceptId: string,
  state: UserState,
  missedContentIds: string[] = []
): GeneratedLesson {
  const concept = getConceptById(conceptId) ?? CONCEPTS[0];
  const meta = lessonMeta(concept);
  const { learn } = buildTeachContent(concept);

  // Focused practice from missed + concept exercises
  const focused: Exercise[] = [];
  for (const id of missedContentIds) {
    if (id.startsWith("h-") || id.startsWith("k-")) {
      const ex = makeKanaToRomaji(id) ?? makeRomajiToKana(id);
      if (ex) focused.push(ex);
    } else if (id.startsWith("v-")) {
      const ex = makeVocabMc(id);
      if (ex) focused.push(ex);
    } else if (id.startsWith("g-")) {
      const ex = makeGrammarMc(id);
      if (ex) focused.push(ex);
    } else if (id.startsWith("kj-")) {
      const ex = makeKanjiMc(id);
      if (ex) focused.push(ex);
    }
  }

  const extra = conceptExercises(concept, "practice");
  const exercises = shuffle([...focused, ...extra])
    .filter((ex, i, arr) => {
      const key = `${ex.contentId ?? ""}|${ex.correctAnswer}`;
      return (
        arr.findIndex((e) => `${e.contentId ?? ""}|${e.correctAnswer}` === key) ===
        i
      );
    })
    .slice(0, 6)
    .map((e) => ({ ...e, countsAsQuiz: true }));

  return {
    id: uid("lesson"),
    conceptId: concept.id,
    lessonType: "REVIEW",
    title: `Quick review · ${meta.title}`,
    subtitle: "Targeted practice",
    description:
      "A short review focused on the parts you missed — not the full lesson.",
    estimatedMinutes: 8,
    objectives: ["Fill the gaps from your knowledge check"],
    phases: [
      {
        id: uid("phase"),
        kind: "learn",
        title: "Refresh",
        estimatedMinutes: 3,
        mode: "teaching",
        teachBlocks: learn.slice(0, 6),
        exercises: [],
      },
      {
        id: uid("phase"),
        kind: "quiz",
        title: "Quiz",
        estimatedMinutes: 5,
        mode: "assessment",
        teachBlocks: [
          {
            kind: "paragraph",
            text: "Practice the points you missed. Tap to answer.",
          },
        ],
        exercises,
      },
    ],
    notes: buildNotes(concept),
    reviewRatio: 0.8,
  };
}
