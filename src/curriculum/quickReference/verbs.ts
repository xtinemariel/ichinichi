import type { JpLine, ReferenceCompare, ReferenceGrammarEntry, ReferenceTable } from "./types";

/** Core conjugation row for one verb form label */
export interface VerbFormRow {
  form: string;
  taberu: string;
  nomu: string;
  iku: string;
  meaning: string;
}

export const VERB_FORM_TABLE: VerbFormRow[] = [
  { form: "Dictionary", taberu: "食べる", nomu: "飲む", iku: "行く", meaning: "plain base / casual" },
  { form: "ます", taberu: "食べます", nomu: "飲みます", iku: "行きます", meaning: "polite present" },
  { form: "ません", taberu: "食べません", nomu: "飲みません", iku: "行きません", meaning: "polite negative" },
  { form: "ました", taberu: "食べました", nomu: "飲みました", iku: "行きました", meaning: "polite past" },
  { form: "ませんでした", taberu: "食べませんでした", nomu: "飲みませんでした", iku: "行きませんでした", meaning: "polite past negative" },
  { form: "ない", taberu: "食べない", nomu: "飲まない", iku: "行かない", meaning: "plain negative" },
  { form: "なかった", taberu: "食べなかった", nomu: "飲まなかった", iku: "行かなかった", meaning: "plain past negative" },
  { form: "て", taberu: "食べて", nomu: "飲んで", iku: "行って", meaning: "て-form" },
  { form: "た", taberu: "食べた", nomu: "飲んだ", iku: "行った", meaning: "plain past" },
  { form: "たい", taberu: "食べたい", nomu: "飲みたい", iku: "行きたい", meaning: "want to ~" },
  { form: "ましょう", taberu: "食べましょう", nomu: "飲みましょう", iku: "行きましょう", meaning: "let's ~" },
];

export const VERB_GROUPS_TABLE: ReferenceTable = {
  headers: ["Group", "Examples", "Tip"],
  jpColumns: [1],
  rows: [
    {
      cells: [
        "る-verbs",
        { japanese: "食べる · 見る · 起きる", english: "drop る before endings" },
        "Penultimate vowel is い or え",
      ],
    },
    {
      cells: [
        "う-verbs",
        { japanese: "書く · 飲む · 話す · 読む · 買う", english: "change final u-sound" },
        "Most verbs ending in う-row kana",
      ],
    },
    {
      cells: [
        "Irregular",
        { japanese: "する · 来る", reading: "する · くる" },
        "Memorize separately",
      ],
    },
    {
      cells: [
        "る-traps",
        { japanese: "帰る · 入る · 走る", reading: "かえる · はいる · はしる", english: "look like る-verbs" },
        "Conjugate as う-verbs",
      ],
    },
  ],
};

export const U_VERB_MASU_TABLE: ReferenceTable = {
  headers: ["Ending", "Change", "Example"],
  jpColumns: [2],
  rows: [
    { cells: ["う", "い + ます", { japanese: "買う → 買います", reading: "かう → かいます" }] },
    { cells: ["く", "き + ます", { japanese: "書く → 書きます", reading: "かく → かきます" }] },
    { cells: ["ぐ", "ぎ + ます", { japanese: "泳ぐ → 泳ぎます", reading: "およぐ → およぎます" }] },
    { cells: ["す", "し + ます", { japanese: "話す → 話します", reading: "はなす → はなします" }] },
    { cells: ["つ", "ち + ます", { japanese: "待つ → 待ちます", reading: "まつ → まちます" }] },
    { cells: ["ぬ", "に + ます", { japanese: "死ぬ → 死にます", reading: "しぬ → しにます" }] },
    { cells: ["ぶ", "び + ます", { japanese: "遊ぶ → 遊びます", reading: "あそぶ → あそびます" }] },
    { cells: ["む", "み + ます", { japanese: "飲む → 飲みます", reading: "のむ → のみます" }] },
    { cells: ["る", "り + ます", { japanese: "帰る → 帰ります", reading: "かえる → かえります" }] },
  ],
};

export const NAI_FORM_RULES: ReferenceTable = {
  headers: ["Type", "Rule", "Example"],
  jpColumns: [2],
  rows: [
    { cells: ["る-verb", "drop る + ない", { japanese: "食べる → 食べない" }] },
    { cells: ["う-verb", "change ending + ない", { japanese: "飲む → 飲まない", reading: "のむ → のまない" }] },
    { cells: ["する", "しない", { japanese: "する → しない" }] },
    { cells: ["来る", "来ない", { japanese: "来る → 来ない", reading: "くる → こない" }] },
  ],
};

export const TE_TA_FORM_RULES: ReferenceTable = {
  headers: ["Type", "て-form", "た-form"],
  jpColumns: [1, 2],
  rows: [
    { cells: ["る-verb", { japanese: "食べて" }, { japanese: "食べた" }] },
    { cells: ["う → って / った", { japanese: "買って", reading: "かって" }, { japanese: "買った", reading: "かった" }] },
    { cells: ["く → いて / いた", { japanese: "書いて", reading: "かいて" }, { japanese: "書いた", reading: "かいた" }] },
    { cells: ["ぐ → いで / いだ", { japanese: "泳いで", reading: "およいで" }, { japanese: "泳いだ", reading: "およいだ" }] },
    { cells: ["す → して / した", { japanese: "話して", reading: "はなして" }, { japanese: "話した", reading: "はなした" }] },
    { cells: ["つ → って / った", { japanese: "待って", reading: "まって" }, { japanese: "待った", reading: "まった" }] },
    { cells: ["む/ぶ/ぬ", "んで / んだ", { japanese: "飲んで → 飲んだ", reading: "のんで → のんだ" }] },
    { cells: ["行く", { japanese: "行って", reading: "いって" }, { japanese: "行った", reading: "いった" }] },
    { cells: ["する / 来る", { japanese: "して · 来て", reading: "して · きて" }, { japanese: "した · 来た", reading: "した · きた" }] },
  ],
};

export const IRREGULAR_VERBS: Array<{
  verb: string;
  reading?: string;
  forms: ReferenceTable;
  highlight?: string;
}> = [
  {
    verb: "する",
    forms: {
      headers: ["Form", "Example"],
      jpColumns: [1],
      rows: [
        { cells: ["Dictionary", "する"] },
        { cells: ["ます", "します"] },
        { cells: ["ない", "しない"] },
        { cells: ["て", "して"] },
        { cells: ["た", "した"] },
      ],
    },
  },
  {
    verb: "来る",
    reading: "くる",
    forms: {
      headers: ["Form", "Example"],
      jpColumns: [1],
      rows: [
        { cells: ["Dictionary", { japanese: "来る", reading: "くる" }] },
        { cells: ["ます", { japanese: "来ます", reading: "きます" }] },
        { cells: ["ない", { japanese: "来ない", reading: "こない" }] },
        { cells: ["て", { japanese: "来て", reading: "きて" }] },
        { cells: ["た", { japanese: "来た", reading: "きた" }] },
      ],
    },
  },
  {
    verb: "行く",
    reading: "いく",
    highlight: "行く → 行って (not 行いて)",
    forms: {
      headers: ["Form", "Example"],
      jpColumns: [1],
      rows: [
        { cells: ["Dictionary", { japanese: "行く", reading: "いく" }] },
        { cells: ["ます", { japanese: "行きます", reading: "いきます" }] },
        { cells: ["ない", { japanese: "行かない", reading: "いかない" }] },
        { cells: ["て", { japanese: "行って", reading: "いって" }] },
        { cells: ["た", { japanese: "行った", reading: "いった" }] },
      ],
    },
  },
];

export const VERB_FORM_USES: ReferenceGrammarEntry[] = [
  {
    id: "te-kudasai",
    pattern: "〜てください",
    meaning: "Please do…",
    example: {
      japanese: "座ってください。",
      reading: "すわってください。",
      english: "Please sit down.",
    },
    searchTerms: ["te", "kudasai", "request", "please"],
  },
  {
    id: "te-mo-ii",
    pattern: "〜てもいいです",
    meaning: "It is okay to… / May I…?",
    example: {
      japanese: "写真を撮ってもいいですか。",
      reading: "しゃしんを とってもいいですか。",
      english: "May I take photos?",
    },
    searchTerms: ["te", "mo ii", "permission"],
  },
  {
    id: "te-wa-ikenai",
    pattern: "〜てはいけません",
    meaning: "Must not…",
    example: {
      japanese: "ここで走ってはいけません。",
      reading: "ここで はしってはいけません。",
      english: "You must not run here.",
    },
    searchTerms: ["te", "wa ikenai", "prohibition", "must not"],
  },
  {
    id: "te-iru",
    pattern: "〜ています",
    meaning: "Currently doing / ongoing state",
    example: {
      japanese: "今、本を読んでいます。",
      reading: "いま、ほんを よんでいます。",
      english: "I am reading a book now.",
    },
    searchTerms: ["te", "iru", "progressive", "ongoing"],
  },
  {
    id: "tai",
    pattern: "〜たいです",
    meaning: "Want to…",
    example: {
      japanese: "日本に行きたいです。",
      reading: "にほんに いきたいです。",
      english: "I want to go to Japan.",
    },
    searchTerms: ["tai", "want", "desire"],
  },
  {
    id: "mashou",
    pattern: "〜ましょう",
    meaning: "Let's…",
    example: {
      japanese: "一緒に食べましょう。",
      reading: "いっしょに たべましょう。",
      english: "Let's eat together.",
    },
    searchTerms: ["mashou", "let's", "suggestion"],
  },
  {
    id: "masenka",
    pattern: "〜ませんか",
    meaning: "Would you like to…?",
    example: {
      japanese: "映画を見ませんか。",
      reading: "えいがを みませんか。",
      english: "Would you like to watch a movie?",
    },
    searchTerms: ["masenka", "invitation", "won't you"],
  },
];

export const VERB_SEARCH_SECTIONS = [
  { id: "verb-forms", title: "Verb form table", terms: ["conjugation", "dictionary", "masu", "masen", "ません", "mashita", "ました", "nai", "ない", "ta", "た", "te", "て", "tai", "mashou", "negative", "past", "polite", "plain"] },
  { id: "verb-groups", title: "Verb groups", terms: ["ru-verb", "u-verb", "ichidan", "godan", "irregular", "group", "帰る", "入る", "走る"] },
  { id: "masu-rules", title: "う-verbs → ます", terms: ["masu", "conjugation", "u-verb"] },
  { id: "nai-form", title: "ない-form rules", terms: ["nai", "negative", "plain negative"] },
  { id: "te-ta-form", title: "て-form & た-form", terms: ["te-form", "ta-form", "te", "ta", "past"] },
  { id: "irregular-verbs", title: "Irregular verbs", terms: ["する", "来る", "行く", "iku", "kuru", "sur"] },
  { id: "form-uses", title: "When to use each form", terms: ["kudasai", "te iru", "te mo ii", "te wa ikenai", "tai", "mashou", "masenka"] },
];
