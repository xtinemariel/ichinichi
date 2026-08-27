/** Core domain types for the N5 study app */

export type ConceptType =
  | "kana"
  | "grammar"
  | "vocabulary"
  | "kanji"
  | "particle"
  | "reading"
  | "listening"
  | "sentence";

export type LessonType =
  | "NEW_CONCEPT"
  | "REVIEW"
  | "VOCABULARY"
  | "GRAMMAR"
  | "KANA"
  | "KANJI"
  | "READING"
  | "LISTENING"
  | "SENTENCE_BUILDING"
  | "TRANSLATION"
  | "MIXED_REVIEW";

export type PhaseKind =
  | "intro"
  | "review"
  | "learn"
  | "examples"
  | "practice"
  | "recall"
  | "quiz";

export type ExerciseType =
  | "multiple_choice"
  | "jp_to_en"
  | "en_to_jp"
  | "word_ordering"
  | "conjugation"
  | "kana_recognition"
  | "kana_select"
  | "reading"
  | "matching";

/** 0 = not introduced … 5 = consistently mastered */
export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type CurriculumPhase =
  | "foundations"
  | "katakana"
  | "basic"
  | "particles"
  | "vocabulary"
  | "verbs"
  | "adjectives"
  | "grammar"
  | "kanji"
  | "integration";

export interface CurriculumUnit {
  id: string;
  phase: CurriculumPhase;
  title: string;
  description: string;
  order: number;
}

export interface Concept {
  id: string;
  unitId: string;
  type: ConceptType;
  title: string;
  description: string;
  order: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  lessonType: LessonType;
  estimatedMinutes: number;
  vocabularyIds: string[];
  grammarIds: string[];
  kanjiIds: string[];
  kanaIds: string[];
  contentIds: string[];
}

export interface VocabularyItem {
  id: string;
  japanese: string;
  kana: string;
  romaji: string;
  english: string;
  exampleSentence: string;
  /** Kana reading for exampleSentence (for furigana) */
  exampleSentenceReading?: string;
  exampleTranslation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  theme: string;
  partOfSpeech?: string;
  relatedConceptIds: string[];
}

export interface GrammarPoint {
  id: string;
  title: string;
  explanation: string;
  pattern: string;
  examples: Array<{
    japanese: string;
    reading?: string;
    english: string;
  }>;
  notes?: string[];
  commonMistakes: string[];
  prerequisiteIds: string[];
}

export interface KanaItem {
  id: string;
  character: string;
  romaji: string;
  type: "hiragana" | "katakana";
  row: string;
}

export interface KanjiItem {
  id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  exampleWords: Array<{
    japanese: string;
    reading: string;
    english: string;
  }>;
  category: string;
  exampleSentence: string;
  /** Kana reading for exampleSentence (for furigana) */
  exampleSentenceReading?: string;
  exampleTranslation: string;
}

export interface ItemProgress {
  id: string;
  contentType: "concept" | "vocabulary" | "grammar" | "kana" | "kanji";
  mastery: MasteryLevel;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  accuracy: number;
  lastReviewed: string | null;
  nextReview: string | null;
  introducedAt: string | null;
  intervalDays: number;
}

export interface UserPreferences {
  dailyGoalLessons: 1 | 2 | 3;
  displayName?: string;
}

export interface CompletedLessonRecord {
  id: string;
  conceptId: string;
  lessonType: LessonType;
  title: string;
  startedAt: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  quizScore?: number;
  quizTotal?: number;
  durationSeconds: number;
  struggledItems: string[];
  improvedAreas: Partial<
    Record<"vocabulary" | "grammar" | "kana" | "kanji", number>
  >;
  nextReviewHint?: string;
}

export interface UserState {
  userId: string;
  createdAt: string;
  lastStudyDate: string | null;
  streak: number;
  totalStudyMinutes: number;
  lessonsCompleted: number;
  dayNumber: number;
  preferences: UserPreferences;
  progress: Record<string, ItemProgress>;
  /** Concept-level familiarity (distinct from item mastery) */
  conceptStatus: Record<string, ConceptProgress>;
  completedLessons: CompletedLessonRecord[];
  knowledgeChecks: KnowledgeCheckRecord[];
  recentLessonConceptIds: string[];
  currentCurriculumIndex: number;
}

/** Concept familiarity — separate from SRS mastery scores */
export type ConceptStatus =
  | "NOT_STARTED"
  | "LEARNING"
  | "FAMILIAR"
  | "MASTERED"
  | "NEEDS_REVIEW";

export interface ConceptProgress {
  conceptId: string;
  status: ConceptStatus;
  postponeCount: number;
  postponedUntil: string | null;
}

export type KnowledgeCheckOutcome = "pass" | "borderline" | "fail";

export interface KnowledgeCheckRecord {
  id: string;
  conceptId: string;
  title: string;
  date: string;
  score: number;
  totalQuestions: number;
  missedContentIds: string[];
  correctContentIds: string[];
  outcome: KnowledgeCheckOutcome;
  durationSeconds: number;
}

export interface KnowledgeCheck {
  id: string;
  conceptId: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  exercises: Exercise[];
}

/** Teaching content blocks — rendered, not quizzed */
export type TeachBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | {
      kind: "hero_character";
      character: string;
      sound: string;
      /** Kana reading shown as furigana above the character */
      furigana?: string;
      romaji?: string;
      note?: string;
    }
  | {
      kind: "example";
      japanese: string;
      reading?: string;
      english: string;
      highlight?: string;
    }
  | {
      kind: "breakdown";
      title?: string;
      parts: Array<{ jp: string; en: string }>;
    }
  | { kind: "pattern"; label: string; value: string }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | {
      kind: "callout";
      variant: "tip" | "mistake" | "remember";
      title: string;
      body: string;
    }
  | {
      kind: "vocab_row";
      japanese: string;
      reading?: string;
      english: string;
    };

export interface ExerciseOption {
  id: string;
  label: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  promptJapanese?: string;
  promptReading?: string;
  /** Selectable answers only — never require Japanese typing */
  options?: ExerciseOption[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint?: string;
  explanation?: string;
  contentId?: string;
  contentType?: ItemProgress["contentType"];
  isProduction?: boolean;
  countsAsQuiz?: boolean;
  tokens?: string[];
  passage?: string;
  passageReading?: string;
  matchingPairs?: MatchingPair[];
}

export interface LessonPhase {
  id: string;
  kind: PhaseKind;
  title: string;
  estimatedMinutes: number;
  mode: "teaching" | "practice" | "assessment";
  teachBlocks?: TeachBlock[];
  exercises: Exercise[];
}

export interface LessonNotes {
  summary: string;
  remember: string[];
  commonMistakes: Array<{
    wrong: string;
    right: string;
    note: string;
  }>;
}

export interface GeneratedLesson {
  id: string;
  conceptId: string;
  lessonType: LessonType;
  title: string;
  subtitle: string;
  description: string;
  estimatedMinutes: number;
  objectives: string[];
  phases: LessonPhase[];
  notes: LessonNotes;
  reviewRatio: number;
  isWelcomeBack?: boolean;
}

export interface LessonResult {
  lessonId: string;
  conceptId: string;
  score: number;
  totalQuestions: number;
  quizScore: number;
  quizTotal: number;
  practiceScore: number;
  practiceTotal: number;
  answers: Array<{
    exerciseId: string;
    contentId?: string;
    contentType?: ItemProgress["contentType"];
    correct: boolean;
    isProduction?: boolean;
    countsAsQuiz?: boolean;
    userAnswer: string;
  }>;
  durationSeconds: number;
  startedAt: string;
  completedAt: string;
}

export interface CategoryProgress {
  vocabulary: number;
  grammar: number;
  kana: number;
  kanji: number;
  reading: number;
  listening: number;
  overall: number;
}

export interface Recommendation {
  lesson: GeneratedLesson;
  reason: string;
  isWelcomeBack: boolean;
  nextUp?: { title: string; when: string };
}
