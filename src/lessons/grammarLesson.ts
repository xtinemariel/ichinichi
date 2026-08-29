/**
 * Grammar lesson pedagogy — teach blocks, review, and a progressive quiz.
 */
import type {
  Concept,
  Exercise,
  ExerciseOption,
  GrammarExample,
  GrammarPoint,
  GrammarPedagogy,
  LessonPhase,
  TeachBlock,
  UserState,
} from "@/lib/types";
import { GRAMMAR_POINTS, getGrammarById } from "@/curriculum/grammar";
import {
  getFunctionLabel,
  getGrammarPedagogy,
} from "@/curriculum/grammarPedagogy";
import { resolveFuriganaReading } from "@/lib/readings";
import { uid } from "@/lib/dates";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(correct: string, pool: string[], count = 3): string[] {
  return shuffle([...new Set(pool)].filter((p) => p !== correct)).slice(0, count);
}

/** Exhaust the closest-matching distractors before falling back to generics. */
function pickPreferred(
  correct: string,
  preferred: string[],
  fallback: string[],
  count = 3
): string[] {
  const first = pickDistractors(correct, preferred, count);
  if (first.length >= count) return first;
  const rest = pickDistractors(
    correct,
    fallback.filter((f) => !first.includes(f)),
    count - first.length
  );
  return [...first, ...rest];
}

function mcOptions(correct: string, distractors: string[]): ExerciseOption[] {
  return shuffle([correct, ...distractors]).map((label, i) => ({
    id: `opt-${i}`,
    label,
  }));
}

function ex(
  japanese: string,
  reading?: string
): { japanese: string; reading?: string } {
  return { japanese, reading: resolveFuriganaReading(japanese, reading) };
}

export function isGrammarConcept(concept: Concept): boolean {
  return (
    concept.grammarIds.length > 0 ||
    concept.type === "grammar" ||
    concept.type === "particle" ||
    concept.lessonType === "GRAMMAR"
  );
}

export function getPrimaryGrammar(concept: Concept): GrammarPoint | null {
  return (
    concept.grammarIds.map((id) => getGrammarById(id)).find(Boolean) ?? null
  );
}

/* ─── Teach block builders ─── */

export function buildGrammarLearnBlocks(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy
): TeachBlock[] {
  const blocks: TeachBlock[] = [];

  blocks.push({ kind: "heading", text: grammar.title });

  if (pedagogy.discovery) {
    const d = pedagogy.discovery;
    blocks.push({
      kind: "discovery",
      before: {
        ...ex(d.before.japanese, d.before.reading),
        english: d.before.english,
      },
      after: {
        ...ex(d.after.japanese, d.after.reading),
        english: d.after.english,
      },
      question: d.question,
      change: d.change,
      insight: d.insight,
    });
  }

  blocks.push({
    kind: "callout",
    variant: "remember",
    title: "What does it mean?",
    body: pedagogy.meaningConcept ?? grammar.explanation,
  });

  if (pedagogy.whenToUse) {
    blocks.push({
      kind: "callout",
      variant: "tip",
      title: "When do I use it?",
      body: pedagogy.whenToUse,
    });
  }

  if (pedagogy.whenNotToUse) {
    blocks.push({
      kind: "callout",
      variant: "tip",
      title: "When would I NOT use it?",
      body: pedagogy.whenNotToUse,
    });
  }

  if (pedagogy.nuance) {
    blocks.push({
      kind: "paragraph",
      text: `What does it sound like? ${pedagogy.nuance}`,
    });
  }

  blocks.push({ kind: "pattern", label: "Sentence pattern", value: grammar.pattern });

  if (pedagogy.formation && pedagogy.formation.length > 0) {
    blocks.push({
      kind: "formation",
      title: "How to form it",
      rows: pedagogy.formation,
    });
  }

  const firstExample = pedagogy.richExamples?.[0];
  if (firstExample) {
    blocks.push({
      kind: "example",
      japanese: firstExample.japanese,
      reading: resolveFuriganaReading(
        firstExample.japanese,
        firstExample.reading
      ),
      english: firstExample.english,
      highlight: firstExample.highlight,
      breakdown: firstExample.breakdown,
      note: firstExample.note,
    });
  }

  return blocks;
}

export function buildGrammarExamplesBlocks(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy
): TeachBlock[] {
  const blocks: TeachBlock[] = [];
  const examples = pedagogy.richExamples ?? grammar.examples;

  blocks.push({ kind: "heading", text: "See it in context" });
  blocks.push({
    kind: "paragraph",
    text: "Read each example at your own pace. Notice how the pattern appears in real sentences — you'll practice and answer questions in the next steps.",
  });

  for (const exItem of examples.slice(pedagogy.discovery ? 1 : 0)) {
    const rich = exItem as GrammarExample;
    blocks.push({
      kind: "example",
      japanese: rich.japanese,
      reading: resolveFuriganaReading(rich.japanese, rich.reading),
      english: rich.english,
      highlight: rich.highlight,
      breakdown: rich.breakdown,
      note: rich.note,
    });
  }

  if (pedagogy.dialogue) {
    blocks.push({ kind: "heading", text: pedagogy.dialogue.title ?? "In conversation" });
    blocks.push({
      kind: "dialogue",
      title: pedagogy.dialogue.title,
      lines: pedagogy.dialogue.lines.map((line) => ({
        ...line,
        reading: resolveFuriganaReading(line.japanese, line.reading),
      })),
    });
  }

  if (pedagogy.contrasts) {
    blocks.push({ kind: "heading", text: "Compare" });
    for (const c of pedagogy.contrasts) {
      blocks.push({
        kind: "contrast",
        title: c.title,
        exampleA: {
          ...ex(c.exampleA.japanese, c.exampleA.reading),
          english: c.exampleA.english,
          label: c.exampleA.label,
        },
        exampleB: {
          ...ex(c.exampleB.japanese, c.exampleB.reading),
          english: c.exampleB.english,
          label: c.exampleB.label,
        },
        explanation: c.explanation,
      });
    }
  }

  const mistakes = pedagogy.mistakes ?? [];
  if (mistakes.length > 0) {
    blocks.push({ kind: "heading", text: "Common mistakes" });
    for (const m of mistakes.slice(0, 3)) {
      blocks.push({
        kind: "callout",
        variant: "mistake",
        title: "Watch out",
        body: [m.right ? `❌ ${m.wrong}\n✅ ${m.right}` : m.wrong, m.note]
          .filter(Boolean)
          .join("\n\n"),
      });
    }
  }

  if (grammar.notes?.length && !pedagogy.whenToUse) {
    blocks.push({
      kind: "callout",
      variant: "tip",
      title: "Note",
      body: grammar.notes.join(" "),
    });
  }

  return blocks;
}

/* ─── Exercise builders ─── */

/** Two labels conflict when they describe overlapping functions. */
function labelsConflict(a: string, b: string): boolean {
  const words = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );
  const wa = words(a);
  const wb = words(b);
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared += 1;
  return shared >= 2;
}

function makeMeaningMc(grammar: GrammarPoint): Exercise | null {
  const correct = getFunctionLabel(grammar.id);
  if (!correct) return null;

  // Distractors are other grammar points' function labels, excluding any that
  // could also describe this grammar point.
  const distractors = GRAMMAR_POINTS.filter((g) => g.id !== grammar.id)
    .map((g) => getFunctionLabel(g.id))
    .filter((l): l is string => Boolean(l) && !labelsConflict(correct, l!));

  const picked = pickDistractors(correct, distractors, 3);
  if (picked.length < 2) return null;

  return {
    id: uid("ex"),
    type: "multiple_choice",
    prompt: `What does 「${grammar.title}」 do?`,
    options: mcOptions(correct, picked),
    correctAnswer: correct,
    contentId: grammar.id,
    contentType: "grammar",
    explanation: grammar.explanation,
  };
}

function makeRecognitionMc(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy,
  variant = 0
): Exercise | null {
  const candidates: GrammarExample[] =
    pedagogy.richExamples ?? grammar.examples;
  const highlighted = (pedagogy.richExamples ?? []).find((e) => e.highlight);
  const ordered = highlighted
    ? [highlighted, ...candidates.filter((c) => c !== highlighted)]
    : candidates;
  const target = ordered[variant] ?? ordered[0];
  if (!target) return null;

  const correct = target.english;
  const wrongFromExamples = uniqueByMeaning(
    [...candidates, ...grammar.examples]
      .filter((e) => !sameMeaning(e.english, correct))
      .map((e) => e.english)
  );
  const picked = pickDistractors(correct, wrongFromExamples, 3);
  if (picked.length < 2) return null;

  return {
    id: uid("ex"),
    type: "jp_to_en",
    prompt: "What does this mean?",
    promptJapanese: target.japanese,
    promptReading: resolveFuriganaReading(target.japanese, target.reading),
    options: mcOptions(correct, picked),
    correctAnswer: correct,
    contentId: grammar.id,
    contentType: "grammar",
    explanation: target.note ?? grammar.explanation,
  };
}

function makeTransformationEx(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy,
  variant = 0
): Exercise | null {
  const rows = pedagogy.formation ?? [];
  const row = rows[variant] ?? rows[0];
  if (!row) return null;

  const distractors = (pedagogy.formation ?? [])
    .map((r) => r.to)
    .filter((t) => t !== row.to);

  return {
    id: uid("ex"),
    type: "conjugation",
    prompt: `Change 「${row.from}」 to match the pattern.`,
    options: mcOptions(row.to, pickDistractors(row.to, distractors, 3)),
    correctAnswer: row.to,
    contentId: grammar.id,
    contentType: "grammar",
    isProduction: true,
    explanation: `${row.from} → ${row.to}${row.note ? ` (${row.note})` : ""}`,
  };
}

/** Endings and particles used as plausible-but-wrong completion choices. */
const COMPLETION_DISTRACTORS = [
  "は", "が", "を", "に", "で", "と", "も", "の", "へ", "から", "まで",
  "です", "ます", "ません", "でした", "ました", "ませんでした",
  "ください", "ましょう", "たい", "ない",
];

function makeCompletionEx(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy
): Exercise | null {
  const recall = pedagogy.recall;
  if (!recall) return null;

  const parts = recall.template.split("________");
  if (parts.length < 2) return null;
  const answer = recall.answer;

  // Same-shape distractors (other conjugations of this pattern) make the
  // question test the grammar rather than the option formats.
  const sameShape = (pedagogy.formation ?? [])
    .map((f) => stripPunctuation(f.to.replace(/です$/, "")))
    .filter((s) => s && s !== answer);

  const picked = pickPreferred(answer, sameShape, COMPLETION_DISTRACTORS, 3);
  if (picked.length < 2) return null;

  return {
    id: uid("ex"),
    type: "conjugation",
    prompt: `Complete the sentence:\n${parts[0]}______${parts[1] ?? ""}`,
    options: mcOptions(answer, picked),
    correctAnswer: answer,
    contentId: grammar.id,
    contentType: "grammar",
    isProduction: true,
    hint: recall.hint,
    explanation: `${parts[0]}${answer}${parts[1] ?? ""}`,
  };
}

function makeWordOrderEx(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy
): Exercise | null {
  const target = pedagogy.richExamples?.[0] ?? grammar.examples[0];
  if (!target) return null;

  const tokens = tokenizeJapanese(target.japanese);
  if (!tokens || tokens.length < 3 || tokens.length > 6) return null;

  return {
    id: uid("ex"),
    type: "word_ordering",
    prompt: `Build this sentence: "${target.english}"`,
    tokens: shuffle(tokens),
    correctAnswer: stripPunctuation(target.japanese),
    contentId: grammar.id,
    contentType: "grammar",
    isProduction: true,
    explanation: `${target.japanese} — ${target.english}`,
  };
}

/** All example sentences that mean something different from `english`. */
function differentMeaningPool(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy,
  english: string
): string[] {
  const all = [...(pedagogy.richExamples ?? []), ...grammar.examples];
  const seenJp = new Set<string>();
  const seenEn = new Set<string>();
  const pool: string[] = [];
  for (const e of all) {
    if (sameMeaning(e.english, english)) continue;
    const jp = stripPunctuation(e.japanese);
    const en = normalizeEnglish(e.english);
    // Two options that translate the same way would both be defensible.
    if (seenJp.has(jp) || seenEn.has(en)) continue;
    seenJp.add(jp);
    seenEn.add(en);
    pool.push(jp);
  }
  return pool;
}

const CONTRACTIONS: Array<[RegExp, string]> = [
  [/won't/g, "will not"],
  [/can't/g, "cannot"],
  [/don't/g, "do not"],
  [/doesn't/g, "does not"],
  [/didn't/g, "did not"],
  [/isn't/g, "is not"],
  [/aren't/g, "are not"],
  [/wasn't/g, "was not"],
  [/i'll/g, "i will"],
  [/i'm/g, "i am"],
  [/it's/g, "it is"],
  [/that's/g, "that is"],
  [/let's/g, "let us"],
];

function normalizeEnglish(s: string): string {
  // Curly and straight apostrophes must fold together before contractions
  // expand, or “don’t” and "don't" normalise to different strings.
  // A trailing gloss in parentheses restates the same meaning, so it is
  // dropped too — otherwise the gloss alone makes two options look distinct.
  let out = s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC`´]/g, "'")
    .replace(/[(（][^)）]*[)）]/g, " ");
  for (const [re, full] of CONTRACTIONS) out = out.replace(re, full);
  return out.replace(/[^a-z]/g, "");
}

/** True when two English translations say the same thing. */
export function sameMeaning(a: string, b: string): boolean {
  return normalizeEnglish(a) === normalizeEnglish(b);
}

/**
 * Drops translations that repeat a meaning already in the list. Exact-string
 * dedupe is not enough — “don't” and “don’t” differ only by apostrophe style
 * and would otherwise appear as two identical answer options.
 */
export function uniqueByMeaning(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const key = normalizeEnglish(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function stripPunctuation(s: string): string {
  return s.replace(/[。、]/g, "");
}

function makeProductionEx(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy,
  variant = 0
): Exercise | null {
  // "How do you say X" only reads well for full sentences, not bare forms
  // like 食べて glossed as "eat (te-form)".
  const candidates = [...(pedagogy.richExamples ?? []), ...grammar.examples]
    .filter((e) => /[。？！]$/u.test(e.japanese))
    .filter((e, i, arr) => arr.findIndex((x) => sameMeaning(x.english, e.english)) === i);
  const highlighted = (pedagogy.richExamples ?? []).find((e) => e.highlight);
  const ordered = highlighted
    ? [highlighted, ...candidates.filter((c) => c !== highlighted)]
    : candidates;
  const target = ordered[variant] ?? ordered[0];
  if (!target) return null;

  const correct = stripPunctuation(target.japanese);
  const pool = differentMeaningPool(grammar, pedagogy, target.english).filter(
    (s) => s !== correct
  );
  const picked = pickDistractors(correct, pool, 3);
  if (picked.length < 2) return null;

  return {
    id: uid("ex"),
    type: "en_to_jp",
    prompt: `How do you say: "${target.english}"`,
    options: mcOptions(correct, picked),
    correctAnswer: correct,
    contentId: grammar.id,
    contentType: "grammar",
    isProduction: true,
    explanation: `"${target.english}" → ${target.japanese}`,
  };
}

const JAPANESE_RE = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/u;

/**
 * "Spot the mistake" — the answer is the incorrect sentence, and every
 * distractor is a genuinely correct sentence from the lesson.
 */
function makeMistakeEx(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy
): Exercise | null {
  // Only usable when the mistake states a concrete wrong sentence and its fix.
  const mistake = (pedagogy.mistakes ?? []).find(
    (m) =>
      m.right &&
      JAPANESE_RE.test(m.wrong) &&
      JAPANESE_RE.test(m.right) &&
      !/[[\]]/.test(m.wrong)
  );
  if (!mistake) return null;

  const correctSentences = [
    ...(pedagogy.richExamples ?? []),
    ...grammar.examples,
  ]
    .map((e) => stripPunctuation(e.japanese))
    .filter((s, i, arr) => arr.indexOf(s) === i && s !== stripPunctuation(mistake.wrong));

  const wrong = stripPunctuation(mistake.wrong);
  const picked = pickDistractors(wrong, correctSentences, 3);
  if (picked.length < 2) return null;

  return {
    id: uid("ex"),
    type: "multiple_choice",
    prompt: "Which sentence has a mistake?",
    options: mcOptions(wrong, picked),
    correctAnswer: wrong,
    contentId: grammar.id,
    contentType: "grammar",
    explanation: `❌ ${mistake.wrong}  →  ✅ ${mistake.right}\n${mistake.note}`,
  };
}

/**
 * Contrast pairs have deliberately different meanings, so asking which
 * sentence carries a given meaning has exactly one answer.
 */
function makeContrastEx(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy
): Exercise | null {
  const contrast = pedagogy.contrasts?.[0];
  if (!contrast) return null;
  if (sameMeaning(contrast.exampleA.english, contrast.exampleB.english)) {
    return null;
  }

  const correct = stripPunctuation(contrast.exampleA.japanese);
  const other = stripPunctuation(contrast.exampleB.japanese);
  if (correct === other) return null;

  const extra = differentMeaningPool(
    grammar,
    pedagogy,
    contrast.exampleA.english
  ).filter((s) => s !== correct && s !== other);

  return {
    id: uid("ex"),
    type: "multiple_choice",
    prompt: `Which sentence means "${contrast.exampleA.english}"?`,
    options: mcOptions(correct, [other, ...pickDistractors(correct, extra, 2)]),
    correctAnswer: correct,
    contentId: grammar.id,
    contentType: "grammar",
    explanation: contrast.explanation,
  };
}

// Longest first so から/まで win over か/ま.
const ORDER_PARTICLES = [
  "から", "まで", "は", "が", "を", "に", "で", "と", "も", "の", "へ",
];

/**
 * Sentence-final predicates. Their kana (the で of です, the ま of まで)
 * must never be mistaken for a particle.
 */
const PREDICATE_TAIL =
  /(?:ませんでしたか|ませんでした|てくださいか|ないでください|てください|たくないです|ましょうか|ませんか|たいです|ましょう|ました|ません|でしたか|でした|ますか|ですか|ます|です)$/u;

/** Kana that can never start a word — a sign the split cut into a word. */
const NON_INITIAL_KANA = /^[んっゃゅょァィゥェォャュョー]/u;

function tokenizeJapanese(sentence: string): string[] | null {
  const cleaned = stripPunctuation(sentence).replace(/\s+/g, "");
  const tail = cleaned.match(PREDICATE_TAIL);
  const guardFrom = tail ? cleaned.length - tail[0].length : cleaned.length;

  const tokens: string[] = [];
  let chunkStart = 0;
  let i = 0;

  while (i < guardFrom) {
    const particle = ORDER_PARTICLES.find((p) => cleaned.startsWith(p, i));
    // A particle can never open a clause, and never sits inside the predicate.
    if (particle && i > chunkStart && i + particle.length <= guardFrom) {
      tokens.push(cleaned.slice(chunkStart, i));
      tokens.push(particle);
      i += particle.length;
      chunkStart = i;
      continue;
    }
    i += 1;
  }
  if (chunkStart < cleaned.length) tokens.push(cleaned.slice(chunkStart));

  const clean = tokens.filter(Boolean);
  if (clean.join("") !== cleaned) return null;
  if (clean.some((t) => NON_INITIAL_KANA.test(t))) return null;
  // A lone kana that is not a particle means we cut a word in half.
  if (
    clean.some(
      (t) =>
        [...t].length === 1 &&
        !ORDER_PARTICLES.includes(t) &&
        /[\u3040-\u309F\u30A0-\u30FF]/u.test(t)
    )
  ) {
    return null;
  }
  return clean;
}

export function buildGrammarQuizExercises(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy
): Exercise[] {
  // Keep the order deliberate: recognize → understand → apply → produce → recall.
  // Each tier contains alternatives so simpler grammar can use fewer questions
  // without padding the quiz with redundant wording.
  const tiers: Array<Array<Exercise | null>> = [
    [makeMeaningMc(grammar), makeRecognitionMc(grammar, pedagogy, 0)],
    [makeRecognitionMc(grammar, pedagogy, 0), makeRecognitionMc(grammar, pedagogy, 1)],
    [makeMistakeEx(grammar, pedagogy), makeContrastEx(grammar, pedagogy)],
    [makeTransformationEx(grammar, pedagogy, 0)],
    [makeWordOrderEx(grammar, pedagogy)],
    [makeProductionEx(grammar, pedagogy, 1), makeProductionEx(grammar, pedagogy, 0)],
  ];

  const quiz: Exercise[] = [];
  const seen = new Set<string>();
  const seenAnswers = new Set<string>();
  const add = (exercise: Exercise | null) => {
    if (!exercise || quiz.length >= 7) return;
    const key = exerciseKey(exercise);
    const answerKey = stripPunctuation(exercise.correctAnswer);
    if (seen.has(key) || seenAnswers.has(answerKey)) return;
    seen.add(key);
    seenAnswers.add(answerKey);
    quiz.push({ ...exercise, countsAsQuiz: true });
  };

  // Take one distinct question from each stage. Do not pad the quiz with
  // alternate phrasings after the learner has already demonstrated the skill.
  for (const tier of tiers) {
    const candidate =
      tier.find(
        (exercise) =>
          exercise !== null &&
          !seenAnswers.has(stripPunctuation(exercise.correctAnswer))
      ) ?? null;
    add(candidate);
  }

  const recall = buildGrammarRecallExercise(grammar, pedagogy);
  if (recall) {
    const recallKey = exerciseKey(recall);
    const duplicateIndex = quiz.findIndex((exercise) => exerciseKey(exercise) === recallKey);
    if (duplicateIndex >= 0) quiz.splice(duplicateIndex, 1);
    quiz.push(recall);
  }

  return quiz.slice(-8);
}

function exerciseKey(ex: Exercise): string {
  return `${ex.type}|${ex.prompt}|${ex.correctAnswer}`;
}

export function buildGrammarRecallExercise(
  grammar: GrammarPoint,
  pedagogy: GrammarPedagogy
): Exercise | null {
  const recall = pedagogy.recall;
  if (!recall) return makeCompletionEx(grammar, pedagogy);

  const ex = makeCompletionEx(grammar, pedagogy);
  if (!ex) return null;

  return {
    ...ex,
    prompt: `Without looking back — ${ex.prompt}`,
    countsAsQuiz: true,
    isProduction: true,
    hint: undefined,
  };
}

/* ─── Phase builders ─── */

export function buildGrammarReviewPhase(
  concept: Concept,
  state: UserState,
  collectGeneralReview: (state: UserState, limit?: number) => Exercise[],
  options?: { skippable?: boolean }
): LessonPhase {
  const skippable = options?.skippable ?? false;
  const grammar = getPrimaryGrammar(concept);
  const exercises: Exercise[] = [];
  const used = new Set<string>();

  if (grammar) {
    const pedagogy = getGrammarPedagogy(grammar);
    for (const id of pedagogy.reviewGrammarIds ?? []) {
      const prereq = getGrammarById(id);
      if (!prereq) continue;
      const progress = state.progress[id];
      if (progress && progress.mastery >= 4) continue;

      const target = prereq.examples[0];
      if (!target || used.has(id)) continue;
      used.add(id);

      exercises.push({
        id: uid("ex"),
        type: "jp_to_en",
        prompt: "Quick check — do you remember this?",
        promptJapanese: target.japanese,
        promptReading: resolveFuriganaReading(target.japanese, target.reading),
        options: mcOptions(
          target.english,
          pickDistractors(
            target.english,
            prereq.examples.map((e) => e.english)
          )
        ),
        correctAnswer: target.english,
        contentId: id,
        contentType: "grammar",
        explanation: prereq.explanation.split(".")[0] + ".",
      });
      if (exercises.length >= 3) break;
    }
  }

  if (exercises.length < 2) {
    for (const ex of collectGeneralReview(state, 3)) {
      if (exercises.length >= 3) break;
      exercises.push(ex);
    }
  }

  return {
    id: uid("phase"),
    kind: "review",
    title: "Quick review",
    estimatedMinutes: 2,
    mode: "practice",
    skippable,
    teachBlocks: [
      {
        kind: "paragraph",
        text:
          exercises.length > 0
            ? skippable
              ? "A quick warm-up on what you need for this lesson. Already confident? Skip ahead."
              : "A quick warm-up on what you need for this lesson."
            : "No review needed — let's jump into today's grammar.",
      },
    ],
    exercises: shuffle(exercises).slice(0, 3),
  };
}

export function buildGrammarTeachContent(concept: Concept): {
  learn: TeachBlock[];
  examples: TeachBlock[];
  grammar: GrammarPoint | null;
  pedagogy: GrammarPedagogy | null;
} {
  const grammar = getPrimaryGrammar(concept);
  if (!grammar) {
    return {
      learn: [
        { kind: "heading", text: concept.title },
        { kind: "paragraph", text: concept.description },
      ],
      examples: [],
      grammar: null,
      pedagogy: null,
    };
  }

  const pedagogy = getGrammarPedagogy(grammar);
  return {
    learn: buildGrammarLearnBlocks(grammar, pedagogy),
    examples: buildGrammarExamplesBlocks(grammar, pedagogy),
    grammar,
    pedagogy,
  };
}
