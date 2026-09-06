import type { JpLine, ReferenceGrammarEntry, ReferenceTable } from "./types";

export const GRAMMAR_GROUPS: Array<{
  title: string;
  entries: ReferenceGrammarEntry[];
}> = [
  {
    title: "Basic statements",
    entries: [
      {
        id: "desu",
        pattern: "〜です",
        meaning: "Polite “is / am / are”",
        form: "Noun / adj + です",
        example: { japanese: "私は学生です。", reading: "わたしは がくせいです。", english: "I am a student." },
        searchTerms: ["desu", "is", "am", "are"],
      },
      {
        id: "janai",
        pattern: "〜じゃないです",
        meaning: "Polite negative “is not”",
        example: { japanese: "私は先生じゃないです。", reading: "わたしは せんせいじゃないです。", english: "I am not a teacher." },
        searchTerms: ["janai", "じゃない", "negative", "is not"],
      },
      {
        id: "deshita",
        pattern: "〜でした",
        meaning: "Polite past “was”",
        example: { japanese: "昨日は雨でした。", reading: "きのうは あめでした。", english: "Yesterday was rainy." },
        searchTerms: ["deshita", "でした", "past", "was"],
      },
      {
        id: "janakatta",
        pattern: "〜じゃなかったです",
        meaning: "Polite past negative “was not”",
        example: { japanese: "昨日は休みじゃなかったです。", reading: "きのうは やすみじゃなかったです。", english: "Yesterday was not a day off." },
        searchTerms: ["janakatta", "past negative"],
      },
    ],
  },
  {
    title: "Existence",
    entries: [
      {
        id: "arimasu",
        pattern: "N が あります",
        meaning: "There is (inanimate)",
        example: { japanese: "本が あります。", reading: "ほんが あります。", english: "There is a book." },
        searchTerms: ["arimasu", "existence", "there is", "ga"],
      },
      {
        id: "imasu",
        pattern: "〜がいます",
        meaning: "There is (animate)",
        example: { japanese: "猫がいます。", reading: "ねこが います。", english: "There is a cat." },
        searchTerms: ["imasu", "existence", "there is"],
      },
    ],
  },
  {
    title: "Location",
    entries: [
      {
        id: "ni-arimasu",
        pattern: "〜にあります / 〜にいます",
        meaning: "Located at (thing / person)",
        example: { japanese: "本は机の上にあります。", reading: "ほんは つくえの うえに あります。", english: "The book is on the desk." },
        searchTerms: ["location", "ni arimasu"],
      },
    ],
  },
  {
    title: "Desire & invitations",
    entries: [
      {
        id: "tai-desu",
        pattern: "〜たいです",
        meaning: "Want to do",
        form: "Verb stem + たいです",
        example: { japanese: "寿司を食べたいです。", reading: "すしを たべたいです。", english: "I want to eat sushi." },
        negative: { japanese: "行きたくないです。", reading: "いきたくないです。", english: "I don't want to go." },
        searchTerms: ["tai", "want"],
      },
      {
        id: "mashou-gram",
        pattern: "〜ましょう",
        meaning: "Let's…",
        example: { japanese: "一緒に行きましょう。", reading: "いっしょに いきましょう。", english: "Let's go together." },
        searchTerms: ["mashou", "let's"],
      },
      {
        id: "masenka-gram",
        pattern: "〜ませんか",
        meaning: "Would you like to…?",
        example: { japanese: "お茶を飲みませんか。", reading: "おちゃを のみませんか。", english: "Would you like some tea?" },
        searchTerms: ["masenka", "invitation"],
      },
    ],
  },
  {
    title: "Requests, permission & prohibition",
    entries: [
      {
        id: "te-kudasai-gram",
        pattern: "〜てください",
        meaning: "Please do…",
        example: { japanese: "見てください。", reading: "みてください。", english: "Please look." },
        searchTerms: ["te", "kudasai", "request"],
      },
      {
        id: "te-mo-ii-gram",
        pattern: "〜てもいいです",
        meaning: "May / it is okay to",
        example: { japanese: "入ってもいいです。", reading: "はいってもいいです。", english: "You may enter." },
        searchTerms: ["te mo ii", "permission"],
      },
      {
        id: "te-wa-ikenai-gram",
        pattern: "〜てはいけません",
        meaning: "Must not",
        example: { japanese: "食べてはいけません。", reading: "たべてはいけません。", english: "You must not eat (it)." },
        searchTerms: ["te wa ikenai", "prohibition"],
      },
      {
        id: "naide-kudasai",
        pattern: "〜ないでください",
        meaning: "Please don't…",
        example: { japanese: "忘れないでください。", reading: "わすれないでください。", english: "Please don't forget." },
        searchTerms: ["naide", "please don't"],
      },
    ],
  },
  {
    title: "Progressive & ability",
    entries: [
      {
        id: "te-iru-gram",
        pattern: "〜ています",
        meaning: "Ongoing action or resulting state",
        example: { japanese: "雨が降っています。", reading: "あめが ふっています。", english: "It is raining." },
        searchTerms: ["te iru", "progressive"],
      },
      {
        id: "dekiru",
        pattern: "〜できます / 〜ができます",
        meaning: "Can do; able to",
        form: "Dictionary form + ことができます · Noun + ができます",
        example: { japanese: "日本語ができます。", reading: "にほんごが できます。", english: "I can speak Japanese." },
        negative: { japanese: "泳ぐことができません。", reading: "およぐことが できません。", english: "I can't swim." },
        note: "N5 focus: できます with nouns/skills and ことができます with verbs.",
        searchTerms: ["dekiru", "can", "ability"],
      },
    ],
  },
  {
    title: "Likes & dislikes",
    entries: [
      {
        id: "suki",
        pattern: "〜が好きです",
        meaning: "Like",
        example: { japanese: "猫が好きです。", reading: "ねこが すきです。", english: "I like cats." },
        searchTerms: ["suki", "like"],
      },
      {
        id: "kirai",
        pattern: "〜が嫌いです",
        meaning: "Dislike",
        example: { japanese: "野菜が嫌いです。", reading: "やさいが きらいです。", english: "I dislike vegetables." },
        searchTerms: ["kirai", "dislike"],
      },
    ],
  },
  {
    title: "Frequency & amount",
    entries: [
      {
        id: "frequency",
        pattern: "Frequency adverbs",
        meaning: "How often",
        form: "いつも · よく · ときどき · あまり〜ません · ぜんぜん〜ません",
        example: { japanese: "よく映画を見ます。", reading: "よく えいがを みます。", english: "I often watch movies." },
        searchTerms: ["itsumo", "yoku", "tokidoki", "frequency", "amari", "zenzen"],
      },
      {
        id: "amount",
        pattern: "Amount words",
        meaning: "How much / many",
        form: "たくさん · 少し · あまり",
        example: { japanese: "水をたくさん飲みます。", reading: "みずを たくさん のみます。", english: "I drink a lot of water." },
        searchTerms: ["takusan", "sukoshi", "amari", "amount"],
      },
    ],
  },
  {
    title: "Reason & sequence",
    entries: [
      {
        id: "kara-reason",
        pattern: "〜から",
        meaning: "Because (reason)",
        example: { japanese: "時間が ありませんから、タクシーで行きます。", reading: "じかんが ありませんから、タクシーで いきます。", english: "Because I don't have time, I'll go by taxi." },
        searchTerms: ["kara", "because", "reason"],
      },
      {
        id: "mae-ni",
        pattern: "〜まえに",
        meaning: "Before doing",
        example: { japanese: "寝るまえに、歯を磨きます。", reading: "ねるまえに、はを みがきます。", english: "Before sleeping, I brush my teeth." },
        searchTerms: ["mae", "before"],
      },
      {
        id: "ato-de",
        pattern: "〜あとで",
        meaning: "After doing",
        example: { japanese: "ご飯を食べたあとで、散歩します。", reading: "ごはんを たべたあとで、さんぽします。", english: "After eating, I take a walk." },
        searchTerms: ["ato", "after"],
      },
    ],
  },
];

export const SENTENCE_PATTERNS: Array<{
  pattern: string;
  example: JpLine;
}> = [
  { pattern: "A は B です", example: { japanese: "私は学生です。", reading: "わたしは がくせいです。", english: "I am a student." } },
  { pattern: "A は B じゃないです", example: { japanese: "私は先生じゃないです。", reading: "わたしは せんせいじゃないです。", english: "I am not a teacher." } },
  { pattern: "A の B", example: { japanese: "私の本です。", reading: "わたしの ほんです。", english: "It is my book." } },
  { pattern: "A を V", example: { japanese: "水を飲みます。", reading: "みずを のみます。", english: "I drink water." } },
  { pattern: "A に V", example: { japanese: "学校に行きます。", reading: "がっこうに いきます。", english: "I go to school." } },
  { pattern: "A で V", example: { japanese: "学校で勉強します。", reading: "がっこうで べんきょうします。", english: "I study at school." } },
  { pattern: "A が あります", example: { japanese: "本が あります。", reading: "ほんが あります。", english: "There is a book." } },
  { pattern: "A がいます", example: { japanese: "猫がいます。", reading: "ねこが います。", english: "There is a cat." } },
];

export const COUNTERS_TABLE: ReferenceTable = {
  headers: ["For", "Counter", "Example"],
  jpColumns: [2],
  rows: [
    { cells: ["General things", "〜つ", { japanese: "りんごを三つ", reading: "りんごを みっつ", english: "three apples" }] },
    { cells: ["People", "〜人", { japanese: "一人 · 二人", reading: "ひとり · ふたり", english: "1 person · 2 people (irregular)" }] },
    { cells: ["People (3+)", "〜人", { japanese: "三人", reading: "さんにん", english: "three people" }] },
    { cells: ["Long objects", "〜本", { japanese: "ペンを二本", reading: "ペンを にほん", english: "two pens" }] },
    { cells: ["Flat objects", "〜枚", { japanese: "紙を一枚", reading: "かみを いちまい", english: "one sheet" }] },
    { cells: ["Age", "〜歳", { japanese: "二十歳", reading: "はたち", english: "20 years old (irregular)" }] },
  ],
};

export const TIME_REFERENCE: ReferenceTable = {
  headers: ["Word", "Reading", "Meaning"],
  jpColumns: [0],
  rows: [
    { cells: [{ japanese: "今日", reading: "きょう" }, "きょう", "today"] },
    { cells: [{ japanese: "明日", reading: "あした" }, "あした", "tomorrow"] },
    { cells: [{ japanese: "昨日", reading: "きのう" }, "きのう", "yesterday"] },
    { cells: [{ japanese: "今", reading: "いま" }, "いま", "now"] },
    { cells: [{ japanese: "毎日", reading: "まいにち" }, "まいにち", "every day"] },
    { cells: [{ japanese: "〜時", reading: "〜じ" }, "〜じ", "o'clock"] },
    { cells: [{ japanese: "〜分", reading: "〜ふん/〜ぷん" }, "〜ふん", "minutes"] },
  ],
};

export const DAYS_OF_WEEK: ReferenceTable = {
  headers: ["Day", "Reading"],
  jpColumns: [0],
  rows: [
    { cells: [{ japanese: "月曜日", reading: "げつようび" }, "Monday"] },
    { cells: [{ japanese: "火曜日", reading: "かようび" }, "Tuesday"] },
    { cells: [{ japanese: "水曜日", reading: "すいようび" }, "Wednesday"] },
    { cells: [{ japanese: "木曜日", reading: "もくようび" }, "Thursday"] },
    { cells: [{ japanese: "金曜日", reading: "きんようび" }, "Friday"] },
    { cells: [{ japanese: "土曜日", reading: "どようび" }, "Saturday"] },
    { cells: [{ japanese: "日曜日", reading: "にちようび" }, "Sunday"] },
  ],
};

export const GRAMMAR_SEARCH_SECTIONS = [
  { id: "grammar-patterns", title: "Grammar patterns", terms: ["grammar", "desu", "masu", "tai", "te", "iru", "kudasai"] },
  { id: "sentence-patterns", title: "Sentence templates", terms: ["sentence", "pattern", "template", "word order"] },
  { id: "counters", title: "Counters & numbers", terms: ["counter", "hitotsu", "hitori", "futari", "hon", "mai", "nin"] },
  { id: "time", title: "Time & dates", terms: ["time", "today", "tomorrow", "yesterday", "kyou", "ashita", "kinou", "ji", "fun"] },
];
