import type { GrammarPedagogy } from "@/lib/types";

/** Pedagogy for grammar points not yet in the main overlay map */
export const EXTENDED_PEDAGOGY: Record<string, GrammarPedagogy> = {
  "g-word-order": {
    meaningConcept:
      "Japanese puts the verb (or です) at the end. Particles mark each word's role, so order is more flexible than English.",
    whenToUse:
      "Almost every sentence — topic near the start, action or description at the end.",
    whenNotToUse:
      "Don't copy English word order (verb in the middle). Particles, not position alone, show each word's job.",
    nuance: "Time words often come near the beginning of the sentence.",
    richExamples: [
      {
        japanese: "わたしはコーヒーを飲みます。",
        reading: "わたしは コーヒーを のみます。",
        english: "I drink coffee.",
        breakdown: [
          { jp: "わたしは", en: "I (topic)" },
          { jp: "コーヒーを", en: "coffee (object)" },
          { jp: "飲みます", en: "drink (verb — at the end)" },
        ],
      },
      {
        japanese: "たなかさんは学生です。",
        reading: "たなかさんは がくせいです。",
        english: "Tanaka is a student.",
      },
      {
        japanese: "昨日映画を見ました。",
        reading: "きのう えいがを みました。",
        english: "I watched a movie yesterday.",
        note: "Time can come first; the verb still ends the sentence.",
      },
    ],
    mistakes: [
      {
        wrong: "わたしは飲みますコーヒー",
        right: "わたしはコーヒーを飲みます",
        note: "In Japanese, the verb comes last — not in the middle like English.",
      },
    ],
    recall: {
      template: "わたしはコーヒーを ________。",
      answer: "飲みます",
      hint: "drink (polite)",
    },
  },

  "g-dewa-arimasen": {
    discovery: {
      before: {
        japanese: "わたしは先生です。",
        reading: "わたしは せんせいです。",
        english: "I am a teacher.",
      },
      after: {
        japanese: "わたしは先生ではありません。",
        reading: "わたしは せんせいでは ありません。",
        english: "I am not a teacher.",
      },
      question: "What changed?",
      change: "です → ではありません",
      insight: "ではありません is the polite negative of です — \"is not.\"",
    },
    whenToUse: "Saying something is not a noun or な-adjective: ペンではありません, 静かではありません.",
    whenNotToUse: "After verbs — verbs have their own negatives (ません, ませんでした).",
    nuance: "In casual speech: じゃないです or じゃない. Formal: ではありません.",
    formation: [
      { from: "学生です", to: "学生ではありません" },
      { from: "ペンです", to: "ペンではありません" },
    ],
    reviewGrammarIds: ["g-desu"],
    recall: {
      template: "これはペンでは ________。",
      answer: "ありません",
      hint: "is not",
    },
  },

  "g-kore-sore-are": {
    meaningConcept:
      "これ・それ・あれ are pronouns for pointing at things: this / that / that over there.",
    whenToUse:
      "Pointing at something without naming it: これはペンです (This is a pen). Distance: これ = near me, それ = near you, あれ = far from both.",
    whenNotToUse:
      "Before a noun — use この・その・あの instead (この本, not これ本).",
    richExamples: [
      {
        japanese: "これはペンです。",
        english: "This is a pen.",
        highlight: "これ",
      },
      {
        japanese: "それは何ですか。",
        reading: "それは なんですか。",
        english: "What is that?",
        highlight: "それ",
      },
      {
        japanese: "あれは学校です。",
        reading: "あれは がっこうです。",
        english: "That (over there) is a school.",
        highlight: "あれ",
      },
    ],
    contrasts: [
      {
        title: "これ (pronoun) vs この (before noun)",
        exampleA: {
          japanese: "これは本です。",
          english: "This is a book.",
          label: "Standalone → これ",
        },
        exampleB: {
          japanese: "この本はおもしろいです。",
          english: "This book is interesting.",
          label: "Before noun → この",
        },
        explanation: "これ/それ/あれ stand alone. この/その/あの must be followed by a noun.",
        contrastGrammarId: "g-kono-sono-ano",
      },
    ],
    reviewGrammarIds: ["g-desu"],
    recall: { template: "________ はペンです。", answer: "これ", hint: "this (near me)" },
  },

  "g-kono-sono-ano": {
    meaningConcept:
      "この・その・あの come before a noun: \"this ~,\" \"that ~,\" \"that ~ over there.\"",
    whenToUse:
      "When you name the thing: この本 (this book), その人 (that person), あの建物 (that building over there).",
    whenNotToUse:
      "Alone without a noun (このです is wrong). For standalone \"this,\" use これ.",
    nuance: "Same distance system as これ/それ/あれ. どの = \"which ~.\"",
    richExamples: [
      {
        japanese: "この本はおもしろいです。",
        reading: "このほんは おもしろいです。",
        english: "This book is interesting.",
        highlight: "この",
      },
      {
        japanese: "その人は誰ですか。",
        reading: "そのひとは だれですか。",
        english: "Who is that person?",
        highlight: "その",
      },
    ],
    reviewGrammarIds: ["g-kore-sore-are"],
    recall: { template: "________ 本はおもしろいです。", answer: "この", hint: "this (before noun)" },
  },

  "g-pronouns": {
    meaningConcept:
      "わたし (I), あなた (you), and names + さん are basic ways to refer to people.",
    whenToUse:
      "Introducing yourself (わたしは…), talking about others by name + さん (たなかさんは…).",
    whenNotToUse:
      "Overusing あなた — Japanese often uses the person's name instead. Dropping わたし when context is clear is natural.",
    nuance:
      "あなた can sound intimate or stiff depending on context — at N5, prefer names + さん for \"you.\"",
    reviewGrammarIds: ["g-desu", "g-wa"],
    recall: { template: "________ は日本人です。", answer: "わたし", hint: "I" },
  },

  "g-mo": {
    meaningConcept: "も means \"also\" or \"too\" — something else is true in addition.",
    whenToUse:
      "Adding another item to what's already mentioned: わたしも学生です (I'm a student too).",
    whenNotToUse:
      "Stacking with は or を on the same word (わたしはも is wrong — も replaces は/を). At the end of a sentence like English \"too.\"",
    nuance: "何も〜ない = \"nothing\" (も + negative).",
    richExamples: [
      {
        japanese: "わたしも学生です。",
        reading: "わたしも がくせいです。",
        english: "I am a student too.",
        highlight: "も",
      },
      {
        japanese: "コーヒーも飲みます。",
        reading: "コーヒーも のみます。",
        english: "I drink coffee too.",
        highlight: "も",
      },
    ],
    reviewGrammarIds: ["g-wa"],
    recall: { template: "わたし ________ 学生です。", answer: "も", hint: "also / too" },
  },

  "g-no": {
    meaningConcept:
      "の links nouns — possession (A's B) or description (Japanese food, Tokyo station).",
    whenToUse:
      "Showing ownership: わたしの本 (my book). Describing a noun: 日本の食べ物 (Japanese food).",
    whenNotToUse:
      "Where a particle like が or を is needed. Reversing order (本のわたし for \"my book\").",
    nuance: "Order is always: [owner/describer] の [thing described]. The main noun comes last.",
    richExamples: [
      {
        japanese: "わたしの本です。",
        reading: "わたしの ほんです。",
        english: "It is my book.",
        highlight: "の",
        breakdown: [
          { jp: "わたしの", en: "my" },
          { jp: "本", en: "book" },
        ],
      },
      {
        japanese: "日本の食べ物が好きです。",
        reading: "にほんの たべものが すきです。",
        english: "I like Japanese food.",
        highlight: "の",
      },
    ],
    reviewGrammarIds: ["g-desu"],
    recall: { template: "わたし ________ 本です。", answer: "の", hint: "possession" },
  },

  "g-to": {
    meaningConcept:
      "と connects nouns as \"and\" (complete list) or means \"with\" someone.",
    whenToUse:
      "Listing all items: パンとミルク (bread and milk). Doing something with someone: 友達と映画を見ます.",
    whenNotToUse:
      "Joining verbs like English \"and\" (use て-form). Incomplete lists — use や instead.",
    nuance: "と between nouns = exhaustive \"and\" (that's the whole list).",
    contrasts: [
      {
        title: "と (complete) vs や (examples)",
        exampleA: {
          japanese: "パンとミルクを買います。",
          english: "I buy bread and milk.",
          label: "Complete list → と",
        },
        exampleB: {
          japanese: "りんごやバナナを買いました。",
          english: "I bought apples and bananas (among other things).",
          label: "Examples → や",
        },
        explanation: "と = exactly these items. や = examples from a longer list.",
        contrastGrammarId: "g-ya",
      },
    ],
    reviewGrammarIds: ["g-wo"],
    recall: { template: "友達 ________ 映画を見ます。", answer: "と", hint: "with" },
  },

  "g-kara": {
    meaningConcept: "から marks a starting point — from a place, time, or origin.",
    whenToUse:
      "Starting time: 九時から (from 9 o'clock). Origin: 大阪から来ました (came from Osaka). Ranges with まで.",
    whenNotToUse:
      "Using に for \"from\" a place of origin. Confusing with reason から (から at end of a clause = because).",
    nuance: "から…まで = from…to/until. Reason から is a separate pattern (see から・ので).",
    richExamples: [
      {
        japanese: "九時から勉強します。",
        reading: "くじから べんきょうします。",
        english: "I study from nine o'clock.",
        highlight: "から",
      },
      {
        japanese: "うちから学校まで歩きます。",
        reading: "うちから がっこうまで あるきます。",
        english: "I walk from home to school.",
        highlight: "から",
      },
    ],
    reviewGrammarIds: ["g-ni"],
    recall: { template: "九時 ________ 勉強します。", answer: "から", hint: "from (time)" },
  },

  "g-made": {
    meaningConcept: "まで means \"until\" or \"as far as\" — the end of a time span or route.",
    whenToUse:
      "End time: 五時まで働きます (work until 5). Destination endpoint: 駅まで歩きます (walk as far as the station).",
    whenNotToUse:
      "When you mean \"by\" a deadline — that's までに, not まで. Putting まで before から in a range.",
    nuance: "から…まで = from…to/until. までに = by (a deadline) — related but different.",
    reviewGrammarIds: ["g-kara"],
    recall: { template: "五時 ________ 働きます。", answer: "まで", hint: "until" },
  },

  "g-ya": {
    meaningConcept:
      "や lists nouns as examples — \"A and B (and so on)\" without claiming the list is complete.",
    whenToUse:
      "Giving examples from a longer list: りんごやバナナ (apples and bananas, among other things).",
    whenNotToUse:
      "A complete two-item list that should use と. Between verbs or clauses.",
    nuance: "など often follows: AやBなど (A, B, and so on).",
    contrasts: [
      {
        title: "や (examples) vs と (complete)",
        exampleA: {
          japanese: "りんごやバナナを買いました。",
          english: "I bought apples and bananas (among other things).",
          label: "Examples → や",
        },
        exampleB: {
          japanese: "パンとミルクを買います。",
          english: "I buy bread and milk.",
          label: "Complete → と",
        },
        explanation: "や implies there may be more. と means that's the full list.",
        contrastGrammarId: "g-to",
      },
    ],
    reviewGrammarIds: ["g-to"],
    recall: { template: "りんご ________ バナナを買いました。", answer: "や", hint: "and (among others)" },
  },

  "g-masen-deshita": {
    discovery: {
      before: {
        japanese: "今日は学校に行きません。",
        reading: "きょうは がっこうに いきません。",
        english: "I won't go to school today.",
      },
      after: {
        japanese: "昨日は学校に行きませんでした。",
        reading: "きのうは がっこうに いきませんでした。",
        english: "I didn't go to school yesterday.",
      },
      question: "What changed?",
      change: "行きません → 行きませんでした",
      insight: "ませんでした is the past negative — something you did not do in the past.",
    },
    whenToUse: "Saying you did not do something in the past: 食べませんでした, 行きませんでした.",
    whenNotToUse: "Present negative — use ません. Adding です after ませんでした.",
    formation: [
      { from: "食べません", to: "食べませんでした" },
      { from: "行きません", to: "行きませんでした" },
    ],
    reviewGrammarIds: ["g-masen", "g-mashita"],
    recall: {
      template: "昨日、学校に行きません ________。",
      answer: "でした",
      hint: "didn't go (past)",
    },
  },

  "g-dictionary-form": {
    meaningConcept:
      "The dictionary form is the plain verb base — how verbs appear in dictionaries: 食べる, 行く, する.",
    whenToUse:
      "Casual speech with friends. As the base for ない, た, て, たい, ことができる, and more.",
    whenNotToUse:
      "Polite situations where ます is expected. Confusing the stem (食べ) with the full form (食べる).",
    nuance:
      "Three groups: る-verbs (食べる, 見る), う-verbs (書く, 飲む, 話す), irregulars (する, 来る). Traps: 帰る, 入る, 走る end in る but follow う-verb rules.",
    formation: [
      { from: "食べます", to: "食べる", note: "polite → plain · る-verb" },
      { from: "書きます", to: "書く", note: "う-verb" },
      { from: "します", to: "する", note: "irregular" },
      { from: "来ます", to: "来る", note: "irregular" },
    ],
    richExamples: [
      {
        japanese: "ご飯を食べる。",
        reading: "ごはんを たべる。",
        english: "I eat a meal. (plain)",
        highlight: "食べる",
      },
      {
        japanese: "本を読む。",
        reading: "ほんを よむ。",
        english: "I read a book.",
        highlight: "読む",
      },
      {
        japanese: "友達に会う。",
        reading: "ともだちに あう。",
        english: "I meet a friend.",
        highlight: "会う",
      },
    ],
    mistakes: [
      {
        wrong: "帰て",
        right: "帰る → 帰って",
        note: "帰る looks like a る-verb but conjugates as an う-verb.",
      },
    ],
    reviewGrammarIds: ["g-wo", "g-ni"],
    recall: { template: "毎日コーヒーを ________。", answer: "飲む", hint: "drink (plain)" },
  },

  "g-nai-form": {
    discovery: {
      before: {
        japanese: "肉を食べる。",
        reading: "にくを たべる。",
        english: "I eat meat. (plain)",
      },
      after: {
        japanese: "肉を食べない。",
        reading: "にくを たべない。",
        english: "I don't eat meat. (plain)",
      },
      question: "What changed?",
      change: "食べる → 食べない",
      insight:
        "The dictionary form becomes plain negative by adding ない (る-verbs drop る first). This means \"don't\" or \"won't.\"",
    },
    meaningConcept: "ない-form is the plain negative — \"don't / won't do ~.\"",
    whenToUse:
      "Casual negative statements. Base for ないでください and other patterns. Add です for polite plain negative (食べないです).",
    whenNotToUse:
      "Formal polite negative in most situations — use ません instead.",
    nuance:
      "Same ending rules as て-form: る-verbs drop る + ない; う-verbs change the final syllable (飲む→飲まない, 行く→行かない); する→しない, 来る→来ない.",
    formation: [
      { from: "食べる", to: "食べない" },
      { from: "飲む", to: "飲まない" },
      { from: "行く", to: "行かない" },
      { from: "する", to: "しない" },
      { from: "来る", to: "来ない" },
    ],
    richExamples: [
      {
        japanese: "今日は行かない。",
        reading: "きょうは いかない。",
        english: "I won't go today.",
        highlight: "行かない",
      },
      {
        japanese: "コーヒーを飲まないです。",
        reading: "コーヒーを のまないです。",
        english: "I don't drink coffee.",
        highlight: "飲まない",
      },
    ],
    reviewGrammarIds: ["g-dictionary-form"],
    recall: { template: "今日は行か ________。", answer: "ない", hint: "won't go (plain)" },
  },

  "g-ta-form": {
    meaningConcept:
      "た-form is the plain past — \"did / went / ate.\" It uses the same endings as て-form, with て→た and で→だ.",
    whenToUse:
      "Casual past statements: 昨日映画を見た. Past negative: 食べなかった (ない → なかった).",
    whenNotToUse:
      "Polite past — use ました / ませんでした. Do not attach た to the ます stem.",
    nuance:
      "Learn て-form first mentally, then swap the ending: 食べて→食べた, 飲んで→飲んだ, 行って→行った, した, 来た.",
    formation: [
      { from: "食べて", to: "食べた", note: "て → た" },
      { from: "飲んで", to: "飲んだ", note: "で → だ" },
      { from: "行って", to: "行った" },
      { from: "食べない", to: "食べなかった", note: "past negative" },
    ],
    richExamples: [
      {
        japanese: "昨日映画を見た。",
        reading: "きのう えいがを みた。",
        english: "I watched a movie yesterday.",
        highlight: "見た",
      },
      {
        japanese: "朝ごはんを食べなかった。",
        reading: "あさごはんを たべなかった。",
        english: "I didn't eat breakfast.",
        highlight: "食べなかった",
      },
    ],
    reviewGrammarIds: ["g-nai-form"],
    recall: { template: "昨日映画を見 ________。", answer: "た", hint: "watched (plain past)" },
  },

  "g-te-form": {
    meaningConcept:
      "The て-form connects verbs — used in requests, ongoing actions, permission, and linking actions.",
    whenToUse:
      "Before ください (please do), いる (ongoing), もいい (permission), or to link actions in sequence.",
    whenNotToUse:
      "As a polite sentence ending on its own in formal speech. Using ますて (wrong conjugation).",
    nuance: "Each verb group has rules: 見る→見て, 書く→書いて, 飲む→飲んで. Irregulars: する→して, 来る→きて. Same endings become た-form: 食べて→食べた, 飲んで→飲んだ.",
    formation: [
      { from: "食べる", to: "食べて", note: "る-verb" },
      { from: "書く", to: "書いて", note: "う-verb · く→いて" },
      { from: "飲む", to: "飲んで", note: "う-verb · む→んで" },
      { from: "行く", to: "行って", note: "う-verb · く→って" },
      { from: "する", to: "して", note: "irregular" },
      { from: "来る", to: "来て", note: "irregular · きて in speech" },
    ],
    reviewGrammarIds: ["g-ta-form"],
    recall: { template: "ここで ________。", answer: "待って", hint: "wait (te-form)" },
  },

  "g-te-kudasai": {
    discovery: {
      before: {
        japanese: "座る",
        english: "to sit (dictionary form)",
      },
      after: {
        japanese: "座ってください。",
        reading: "すわってください。",
        english: "Please sit down.",
      },
      question: "What changed?",
      change: "座る → 座ってください",
      insight: "て-form + ください makes a polite request — \"Please do ~.\"",
    },
    whenToUse: "Polite requests: 座ってください, ゆっくり話してください, これを見てください.",
    whenNotToUse:
      "Dictionary form + ください (食べるください). ます form + ください (食べますください). For \"please don't,\" use ないでください.",
    nuance: "ください alone after を can mean \"please give me\" (コーヒーをください).",
    reviewGrammarIds: ["g-te-form"],
    recall: { template: "座って ________。", answer: "ください", hint: "please (do)" },
  },

  "g-te-iru": {
    meaningConcept:
      "て-form + いる describes an action in progress or a resulting state.",
    whenToUse:
      "Right now: 今、本を読んでいます (I am reading). Ongoing states: 東京に住んでいます (I live in Tokyo). Weather: 雨が降っています.",
    whenNotToUse: "Using ます + いる (読みますいる). Forgetting が with weather (雨が降っている).",
    nuance: "Casual contraction: 〜てる. 住んでいる / 知っている are common \"state\" uses.",
    formation: [
      { from: "読んで", to: "読んでいます", note: "is reading" },
      { from: "住んで", to: "住んでいます", note: "lives (state)" },
    ],
    reviewGrammarIds: ["g-te-form", "g-masu"],
    recall: { template: "今、本を読んで ________。", answer: "います", hint: "is reading" },
  },

  "g-i-adj-negative": {
    discovery: {
      before: {
        japanese: "高いです",
        reading: "たかいです",
        english: "It is expensive.",
      },
      after: {
        japanese: "高くないです",
        reading: "たかくないです",
        english: "It is not expensive.",
      },
      question: "What changed?",
      change: "高い → 高くない",
      insight: "Drop the final い, add くないです to negate an い-adjective.",
    },
    whenToUse: "Negating い-adjectives: 寒くない, 面白くない, 高くないです.",
    formation: [
      { from: "高い", to: "高くないです" },
      { from: "寒い", to: "寒くないです" },
      { from: "いい", to: "よくないです", note: "irregular" },
    ],
    reviewGrammarIds: ["g-i-adjectives"],
    recall: { template: "今日は寒く ________ です。", answer: "ない", hint: "not cold" },
  },

  "g-i-adj-past": {
    meaningConcept:
      "Past い-adjectives: drop い, add かった (affirmative) or くなかった (negative).",
    whenToUse: "Describing how something was: 昨日は暑かったです (Yesterday was hot).",
    whenNotToUse: "Using でした after unchanged い-adjective (高いでした is wrong).",
    formation: [
      { from: "暑い", to: "暑かったです" },
      { from: "暑い", to: "暑くなかったです", note: "negative past" },
      { from: "いい", to: "よかったです", note: "irregular" },
    ],
    reviewGrammarIds: ["g-i-adjectives", "g-i-adj-negative"],
    recall: { template: "昨日は暑 ________ です。", answer: "かった", hint: "was hot" },
  },

  "g-na-adjectives": {
    meaningConcept:
      "な-adjectives (静か, 元気, きれい) need な before a noun and です at the end of a sentence.",
    whenToUse:
      "Describing nouns: 静かな部屋 (quiet room). Predicates: 彼は元気です (He is well).",
    whenNotToUse:
      "Adding い like い-adjectives (静かい). Using な before です (静かなです).",
    nuance: "好き and きらい are な-adjectives but take が for the liked thing. きれい looks like い-adjective but is な-adjective.",
    formation: [
      { from: "静か + 部屋", to: "静かな部屋", note: "before noun → な" },
      { from: "静か", to: "静かです", note: "predicate → です (no な)" },
    ],
    reviewGrammarIds: ["g-desu"],
    recall: { template: "静か ________ 部屋です。", answer: "な", hint: "na-adjective before noun" },
  },

  "g-na-adj-negative": {
    whenToUse: "Negating な-adjectives like nouns: 静かではありません, 元気ではありません.",
    whenNotToUse:
      "Conjugating like い-adjectives (静かいない). Using な in the negative (静かなではありません).",
    nuance: "Casual: 静かじゃない.",
    formation: [
      { from: "静かです", to: "静かではありません" },
      { from: "元気です", to: "元気ではありません" },
    ],
    reviewGrammarIds: ["g-na-adjectives", "g-dewa-arimasen"],
    recall: {
      template: "この町は静かでは ________。",
      answer: "ありません",
      hint: "is not quiet",
    },
  },

  "g-na-adj-past": {
    whenToUse: "Past な-adjectives use でした: 静かでした, 暇でした. Past negative: ではありませんでした.",
    whenNotToUse: "Using い-adjective past (静かかったです). Using ですでした.",
    formation: [
      { from: "静かです", to: "静かでした" },
      { from: "元気です", to: "元気でした" },
    ],
    nuance: "Same pattern as noun + でした.",
    reviewGrammarIds: ["g-na-adjectives"],
    recall: { template: "昨日は暇 ________。", answer: "でした", hint: "was free" },
  },

  "g-location-ni-arimasu": {
    meaningConcept:
      "To say where something or someone is, use [Place] に + あります/います.",
    whenToUse:
      "Stating location: 銀行は駅の隣にあります. 猫は椅子の下にいます. Use の for relative position: 机の上 (on the desk).",
    whenNotToUse:
      "Using で for simple existence location (教室でいます). Forgetting が on the thing that exists.",
    nuance: "は often marks the topic (thing whose location you're stating). で = where an action happens.",
    contrasts: [
      {
        title: "に (existence) vs で (action)",
        exampleA: {
          japanese: "教室の中に学生がいます。",
          english: "There are students inside the classroom.",
          label: "Exists → に",
        },
        exampleB: {
          japanese: "教室で勉強します。",
          english: "I study in the classroom.",
          label: "Action → で",
        },
        explanation: "に for where something is. で for where something happens.",
        contrastGrammarId: "g-de",
      },
    ],
    reviewGrammarIds: ["g-arimasu-imasu", "g-ni"],
    recall: { template: "猫は椅子の下に ________。", answer: "います", hint: "is (living)" },
  },

  "g-time-expressions": {
    meaningConcept:
      "Time words usually come near the start of the sentence. Clock times take に; relative words often don't.",
    whenToUse:
      "Clock times with に: 七時に起きます. Relative time without に: 明日, 毎日, 週末は.",
    whenNotToUse:
      "Adding に after 今日 / 明日 / 毎日. Putting time only after the verb like English.",
    nuance: "から / まで build time ranges. Duration uses 〜時間, 〜分.",
    richExamples: [
      {
        japanese: "七時に起きます。",
        reading: "しちじに おきます。",
        english: "I wake up at seven.",
        highlight: "に",
        note: "Exact clock time → に",
      },
      {
        japanese: "明日友達に会います。",
        reading: "あした ともだちに あいます。",
        english: "I will meet a friend tomorrow.",
        note: "明日 — no に needed",
      },
    ],
    reviewGrammarIds: ["g-ni", "g-masu"],
    recall: { template: "七時 ________ 起きます。", answer: "に", hint: "at (clock time)" },
  },

  "g-frequency": {
    meaningConcept:
      "Frequency words describe how often: いつも (always), よく (often), ときどき (sometimes).",
    whenToUse:
      "Before the verb: いつも食べます, ときどき映画を見ます. あまり and ぜんぜん pair with negative verbs.",
    whenNotToUse:
      "Using あまり or ぜんぜん with affirmative verbs. Placing frequency after the verb like English.",
    nuance: "よく can also mean \"well\" (よくできました = you did well).",
    richExamples: [
      {
        japanese: "いつも朝ごはんを食べます。",
        reading: "いつも あさごはんを たべます。",
        english: "I always eat breakfast.",
        highlight: "いつも",
      },
      {
        japanese: "あまりコーヒーを飲みません。",
        reading: "あまり コーヒーを のみません。",
        english: "I don't drink much coffee.",
        highlight: "あまり",
        note: "あまり requires a negative verb.",
      },
    ],
    reviewGrammarIds: ["g-masu", "g-masen"],
    recall: { template: "________ 朝ごはんを食べます。", answer: "いつも", hint: "always" },
  },

  "g-counters": {
    meaningConcept:
      "Japanese counts things with counter words after the number — you can't just say a bare number.",
    whenToUse:
      "Counting objects: 三つ (three things), 五人 (five people), 二本 (two long objects), 一枚 (one flat object).",
    whenNotToUse:
      "English-style bare numbers when a counter is expected. Wrong readings (いちにん instead of ひとり).",
    nuance:
      "つ is a handy general counter. Learn irregulars: 一人 (ひとり), 二人 (ふたり), 三つ (みっつ). Numbers often change sound before counters.",
    richExamples: [
      {
        japanese: "りんごを三つください。",
        reading: "りんごを みっつ ください。",
        english: "Three apples, please.",
        highlight: "三つ",
      },
      {
        japanese: "学生が五人います。",
        reading: "がくせいが ごにん います。",
        english: "There are five students.",
        highlight: "五人",
      },
    ],
    reviewGrammarIds: ["g-wo", "g-arimasu-imasu"],
    recall: { template: "りんごを三 ________ ください。", answer: "つ", hint: "general counter" },
  },

  "g-te-mo-ii": {
    meaningConcept: "て-form + もいいです gives or asks for permission — \"it's okay to ~.\"",
    whenToUse:
      "Giving permission: 写真を撮ってもいいです. Asking: ここに座ってもいいですか.",
    whenNotToUse:
      "Telling someone they must not do something — that is てはいけません. This pattern only grants or asks for permission.",
    nuance:
      "てもいいですか is polite enough for teachers, staff, and strangers. Opposite: てはいけません (must not).",
    contrasts: [
      {
        title: "てもいいです (may) vs てはいけません (must not)",
        exampleA: {
          japanese: "写真を撮ってもいいです。",
          reading: "しゃしんを とってもいいです。",
          english: "You may take photos.",
          label: "Permission",
        },
        exampleB: {
          japanese: "ここで写真を撮ってはいけません。",
          reading: "ここで しゃしんを とってはいけません。",
          english: "You must not take photos here.",
          label: "Prohibition",
        },
        explanation:
          "てもいいです allows an action. てはいけません forbids it — common for rules and signs.",
        contrastGrammarId: "g-te-wa-ikenai",
      },
    ],
    reviewGrammarIds: ["g-te-form", "g-ka-questions"],
    recall: {
      template: "ここに座っても ________ ですか。",
      answer: "いい",
      hint: "may I sit",
    },
  },

  "g-te-wa-ikenai": {
    meaningConcept:
      "て-form + はいけません states a prohibition — \"must not ~\" / \"not allowed to ~.\"",
    whenToUse:
      "Rules and instructions: ここで写真を撮ってはいけません, 廊下を走ってはいけません.",
    whenNotToUse:
      "Asking permission — use てもいいですか. Polite requests not to do something — use ないでください.",
    nuance:
      "Stronger than ないでください (please don't). Often seen on signs and in classrooms.",
    formation: [
      { from: "撮って", to: "撮ってはいけません", note: "must not take (photos)" },
      { from: "走って", to: "走ってはいけません", note: "must not run" },
    ],
    reviewGrammarIds: ["g-te-mo-ii", "g-te-form"],
    recall: {
      template: "ここで走っては ________。",
      answer: "いけません",
      hint: "must not run",
    },
  },

  "g-naide-kudasai": {
    meaningConcept: "ない-form + でください asks someone not to do something — \"Please don't ~.\"",
    whenToUse: "Polite prohibitions: 心配しないでください, 忘れないでください.",
    whenNotToUse:
      "ませんでください (use ないでください). てください for negative meaning without ないで.",
    nuance: "ない-form comes from dictionary form: 食べる → 食べない → 食べないでください.",
    contrasts: [
      {
        title: "てください (please do) vs ないでください (please don't)",
        exampleA: {
          japanese: "座ってください。",
          english: "Please sit down.",
          label: "Do → てください",
        },
        exampleB: {
          japanese: "心配しないでください。",
          reading: "しんぱいしないでください。",
          english: "Please don't worry.",
          label: "Don't → ないでください",
        },
        explanation: "Affirmative request vs negative request.",
        contrastGrammarId: "g-te-kudasai",
      },
    ],
    reviewGrammarIds: ["g-te-kudasai", "g-nai-form"],
    recall: {
      template: "忘れないで ________。",
      answer: "ください",
      hint: "please don't",
    },
  },

  "g-koto-ga-dekiru": {
    meaningConcept:
      "Dictionary form + ことができます expresses ability — \"can do ~.\"",
    whenToUse: "Stating skills or possibility: 漢字を読むことができます, 車を運転することができます.",
    whenNotToUse:
      "ます form before こと (読みますことができる). Forgetting が before できます.",
    nuance: "こと turns the verb phrase into a noun-like chunk. Negate: できません.",
    formation: [
      { from: "読む", to: "読むことができます", note: "can read" },
      { from: "運転する", to: "運転することができます", note: "can drive" },
    ],
    reviewGrammarIds: ["g-dictionary-form", "g-ga"],
    recall: {
      template: "漢字を読むことが ________。",
      answer: "できます",
      hint: "can (do)",
    },
  },

  "g-yori-hou-ga": {
    meaningConcept:
      "より and のほうが compare two things — B is more ~ than A.",
    whenToUse:
      "Comparisons: 電車よりバスのほうが安いです (buses are cheaper than trains).",
    whenNotToUse:
      "Mixing up which item is より (lesser) vs ほうが (winner). Omitting の before ほうが.",
    nuance: "A より B のほうが [adjective] — B wins the comparison.",
    richExamples: [
      {
        japanese: "電車よりバスのほうが安いです。",
        reading: "でんしゃより バスのほうが やすいです。",
        english: "Buses are cheaper than trains.",
        highlight: "より",
      },
      {
        japanese: "夏より冬のほうが好きです。",
        reading: "なつより ふゆのほうが すきです。",
        english: "I like winter more than summer.",
        highlight: "ほうが",
      },
    ],
    reviewGrammarIds: ["g-suki", "g-i-adjectives"],
    recall: {
      template: "電車よりバスの ________ が安いです。",
      answer: "ほう",
      hint: "the one that is more ~",
    },
  },

  "g-kara-reason": {
    meaningConcept: "から after a clause gives a reason — \"because ~.\"",
    whenToUse:
      "Explaining why: 時間が ありませんから、タクシーで行きます (Because I do not have time, I will go by taxi).",
    whenNotToUse:
      "Confusing with starting-point から (九時から = from 9 o'clock). から at end of noun alone.",
    nuance: "Starting-point から and reason から look the same — context and clause structure tell them apart.",
    contrasts: [
      {
        title: "から (reason) vs から (from)",
        exampleA: {
          japanese: "時間が ありませんから、タクシーで行きます。",
          reading: "じかんが ありませんから、タクシーで いきます。",
          english: "Because I don't have time, I'll go by taxi.",
          label: "Reason → clause + から",
        },
        exampleB: {
          japanese: "九時から勉強します。",
          reading: "くじから べんきょうします。",
          english: "I study from nine o'clock.",
          label: "Starting point → time + から",
        },
        explanation: "Reason から follows a full clause. Starting から follows a time or place.",
        contrastGrammarId: "g-kara",
      },
    ],
    reviewGrammarIds: ["g-kara", "g-masu"],
    recall: {
      template: "時間が ありません ________、行きます。",
      answer: "から",
      hint: "because",
    },
  },

  "g-kedo": {
    meaningConcept: "けど (けれど) means \"but\" or \"although\" — introduces a contrast or softens a statement.",
    whenToUse:
      "Contrasting ideas: 行きたいけど、時間が ありません (I want to go, but I don't have time).",
    whenNotToUse:
      "At the very start of a sentence like English \"But, ...\" in formal writing — attach to the first clause.",
    nuance: "Casual: けど. More polite: けれども. Can soften refusals or requests.",
    reviewGrammarIds: ["g-masu"],
    recall: {
      template: "行きたい ________、時間が ありません。",
      answer: "けど",
      hint: "but",
    },
  },

  "g-node": {
    meaningConcept:
      "ので gives a reason more politely/objectively than から — \"because ~, so ~.\"",
    whenToUse:
      "Explaining reasons politely: 雨が降っているので、行きません (Because it is raining, I won't go).",
    whenNotToUse:
      "Highly personal/emotional reasons where から feels more natural. Using ので after plain nouns without な/の.",
    nuance: "ので sounds slightly softer and more objective than から.",
    contrasts: [
      {
        title: "ので vs から (reason)",
        exampleA: {
          japanese: "雨が降っているので、行きません。",
          reading: "あめが ふっているので、いきません。",
          english: "Because it's raining, I won't go.",
          label: "Objective → ので",
        },
        exampleB: {
          japanese: "時間が ありませんから、タクシーで行きます。",
          reading: "じかんが ありませんから、タクシーで いきます。",
          english: "Because I don't have time, I'll go by taxi.",
          label: "Direct → から",
        },
        explanation: "Both give reasons. ので is slightly softer; から is more direct.",
        contrastGrammarId: "g-kara-reason",
      },
    ],
    reviewGrammarIds: ["g-kara-reason"],
    recall: {
      template: "雨が降っている ________、行きません。",
      answer: "ので",
      hint: "because (softer)",
    },
  },

  "g-to-conditional": {
    meaningConcept:
      "Dictionary form + と can mean \"when ~, (then) ~\" — a natural result or habitual outcome.",
    whenToUse:
      "Natural consequences: 春になると暖かくなります (When spring comes, it gets warm).",
    whenNotToUse:
      "Personal choices or one-time future events — other conditionals exist at higher levels.",
    nuance: "と conditional often describes what always happens as a result.",
    reviewGrammarIds: ["g-dictionary-form", "g-naru"],
    recall: {
      template: "春になる ________ 暖かくなります。",
      answer: "と",
      hint: "when (natural result)",
    },
  },

  "g-naru": {
    meaningConcept:
      "なる means \"become\" — い-adjective: drop い and add くなります; な-adjective or noun: add になります.",
    whenToUse:
      "Describing change: 寒くなります (it gets cold), 医者になります (become a doctor), 静かになります (become quiet).",
    whenNotToUse:
      "Attaching に to an い-adjective (暑いになる). Attaching く to a noun (先生くなります).",
    formation: [
      { from: "寒い", to: "寒くなります", note: "い-adj → くなります" },
      { from: "医者", to: "医者になります", note: "noun → になります" },
      { from: "静か", to: "静かになります", note: "な-adj → になります" },
    ],
    reviewGrammarIds: ["g-i-adjectives", "g-na-adjectives"],
    recall: { template: "寒く ________。", answer: "なりました", hint: "became cold" },
  },
};
