import type {
  GrammarMistake,
  GrammarPedagogy,
  GrammarPoint,
} from "@/lib/types";
import { EXTENDED_PEDAGOGY } from "@/curriculum/grammarPedagogyExtended";

/**
 * Rich pedagogy overlays for N5 grammar.
 * Depth = guided discovery + formation + contrast + production, not paragraph count.
 */
const PEDAGOGY: Record<string, GrammarPedagogy> = {
  ...EXTENDED_PEDAGOGY,
  "g-tai": {
    discovery: {
      before: {
        japanese: "日本に行きます。",
        reading: "にほんに いきます。",
        english: "I go to Japan.",
      },
      after: {
        japanese: "日本に行きたいです。",
        reading: "にほんに いきたいです。",
        english: "I want to go to Japan.",
      },
      question: "What changed?",
      change: "行きます → 行きたいです",
      insight:
        "The verb changes into the 〜たい form to express wanting to do something. Drop ます, add たいです.",
    },
    meaningConcept:
      "〜たいです expresses what the speaker wants to do — a personal desire, not a plan or invitation.",
    whenToUse:
      "Talking about your own wishes: travel plans, food cravings, weekend activities, hobbies.",
    whenNotToUse:
      "Inviting someone else (use 〜ませんか). Describing what a third person wants (other patterns at higher levels).",
    nuance:
      "Polite with です. Casual: 行きたい. The object can take either を or が — 寿司を食べたいです and 寿司が食べたいです are both correct, and が adds a little more focus on the thing you want.",
    formation: [
      { from: "行きます", to: "行きたいです", note: "go → want to go" },
      { from: "食べます", to: "食べたいです", note: "eat → want to eat" },
      { from: "飲みます", to: "飲みたいです", note: "drink → want to drink" },
      { from: "見ます", to: "見たいです", note: "watch → want to watch" },
    ],
    richExamples: [
      {
        japanese: "映画を見たいです。",
        reading: "えいがを みたいです。",
        english: "I want to watch a movie.",
        highlight: "見たいです",
        breakdown: [
          { jp: "映画", en: "movie" },
          { jp: "を", en: "object" },
          { jp: "見たいです", en: "want to watch" },
        ],
      },
      {
        japanese: "寿司を食べたいです。",
        reading: "すしを たべたいです。",
        english: "I want to eat sushi.",
        highlight: "食べたいです",
      },
      {
        japanese: "週末、何をしたいですか。",
        reading: "しゅうまつ、なにを したいですか。",
        english: "What do you want to do this weekend?",
        note: "A natural question to make plans with friends.",
      },
      {
        japanese: "今日は勉強したくないです。",
        reading: "きょうは べんきょうしたくないです。",
        english: "I don't want to study today.",
        highlight: "たくない",
        note: "たい conjugates like an い-adjective: たくない, たかった.",
      },
    ],
    contrasts: [
      {
        title: "〜たいです vs 〜ませんか",
        exampleA: {
          japanese: "映画を見たいです。",
          reading: "えいがを みたいです。",
          english: "I want to watch a movie.",
          label: "My desire",
        },
        exampleB: {
          japanese: "映画を見ませんか。",
          reading: "えいがを みませんか。",
          english: "Would you like to watch a movie?",
          label: "Invitation",
        },
        explanation:
          "〜たいです describes what you want. 〜ませんか invites someone to do something together.",
      },
      {
        title: "〜たいです vs 〜が好きです",
        exampleA: {
          japanese: "ラーメンを食べたいです。",
          english: "I want to eat ramen.",
          label: "Want to do (now)",
        },
        exampleB: {
          japanese: "ラーメンが好きです。",
          english: "I like ramen.",
          label: "General preference",
        },
        explanation:
          "好き describes a general liking. たい expresses wanting to do something right now or soon.",
        contrastGrammarId: "g-suki",
      },
    ],
    dialogue: {
      title: "Making weekend plans",
      lines: [
        {
          speaker: "A",
          japanese: "週末、何をしたいですか。",
          reading: "しゅうまつ、なにを したいですか。",
          english: "What do you want to do this weekend?",
        },
        {
          speaker: "B",
          japanese: "映画を見たいです。",
          reading: "えいがを みたいです。",
          english: "I want to watch a movie.",
        },
        {
          speaker: "A",
          japanese: "じゃあ、一緒に見ませんか。",
          reading: "じゃあ、いっしょに みませんか。",
          english: "Then, shall we watch one together?",
        },
        {
          speaker: "B",
          japanese: "いいですね！",
          english: "Sounds good!",
        },
      ],
    },
    mistakes: [
      {
        wrong: "日本に行きますたいです。",
        right: "日本に行きたいです。",
        note: "Remove ます before adding たい — use the verb stem, not the full ます form.",
      },
      {
        wrong: "日本たいです。",
        right: "日本に行きたいです。",
        note: "たい attaches to a verb, never straight onto a noun. Add the verb you mean — here, 行き.",
      },
    ],
    reviewGrammarIds: ["g-masu", "g-wo"],
    recall: {
      template: "日本に ________ です。",
      answer: "行きたい",
      hint: "want to go",
    },
  },

  "g-masu": {
    discovery: {
      before: {
        japanese: "食べる",
        english: "eat (dictionary form)",
      },
      after: {
        japanese: "食べます",
        english: "eat / will eat (polite)",
      },
      question: "What changed?",
      change: "食べる → 食べます",
      insight:
        "Dictionary form becomes polite by changing the ending to ます. This is how you speak politely in daily life.",
    },
    meaningConcept:
      "〜ます is the polite present/future verb ending — habits, regular actions, and future plans.",
    whenToUse: "Polite conversation: daily routines, school, work, talking to strangers.",
    whenNotToUse:
      "Casual talk with close friends (dictionary form). Already-polite sentences (don't add です after ます).",
    formation: [
      { from: "食べる", to: "食べます" },
      { from: "飲む", to: "飲みます" },
      { from: "行く", to: "行きます" },
      { from: "する", to: "します" },
      { from: "来る", to: "来ます" },
    ],
    richExamples: [
      {
        japanese: "毎日ご飯を食べます。",
        reading: "まいにち ごはんを たべます。",
        english: "I eat meals every day.",
        highlight: "食べます",
        breakdown: [
          { jp: "毎日", en: "every day" },
          { jp: "ご飯を", en: "meal (object)" },
          { jp: "食べます", en: "eat" },
        ],
      },
      {
        japanese: "明日学校に行きます。",
        reading: "あした がっこうに いきます。",
        english: "I will go to school tomorrow.",
        highlight: "行きます",
        note: "ます covers both habits and future — context tells you which.",
      },
      {
        japanese: "日本語を勉強します。",
        reading: "にほんごを べんきょうします。",
        english: "I study Japanese.",
      },
    ],
    mistakes: [
      {
        wrong: "行きますです",
        right: "行きます",
        note: "ます is already polite — never add です after it.",
      },
    ],
    reviewGrammarIds: ["g-dictionary-form", "g-wo"],
    recall: { template: "コーヒーを ________。", answer: "飲みます", hint: "drink (polite)" },
  },

  "g-masen": {
    discovery: {
      before: {
        japanese: "コーヒーを飲みます。",
        reading: "コーヒーを のみます。",
        english: "I drink coffee.",
      },
      after: {
        japanese: "コーヒーを飲みません。",
        reading: "コーヒーを のみません。",
        english: "I don't drink coffee.",
      },
      question: "What changed?",
      change: "飲みます → 飲みません",
      insight: "ます becomes ません for polite negative — \"do not\" or \"will not.\"",
    },
    meaningConcept: "〜ません is the polite negative of ます.",
    whenToUse: "Saying you don't do something, won't go, don't eat, etc.",
    formation: [
      { from: "食べます", to: "食べません" },
      { from: "飲みます", to: "飲みません" },
      { from: "行きます", to: "行きません" },
    ],
    contrasts: [
      {
        title: "〜ません vs 〜ませんか",
        exampleA: {
          japanese: "行きません。",
          english: "I won't go.",
          label: "Negative statement",
        },
        exampleB: {
          japanese: "一緒に行きませんか。",
          reading: "いっしょに いきませんか。",
          english: "Won't you go together? / Shall we go?",
          label: "Invitation",
        },
        explanation:
          "Same form, different meaning! ませんか at the end turns a negative into a polite invitation.",
      },
    ],
    reviewGrammarIds: ["g-masu"],
    recall: { template: "今日は行き ________。", answer: "ません", hint: "won't go" },
  },

  "g-mashita": {
    discovery: {
      before: {
        japanese: "映画を見ます。",
        reading: "えいがを みます。",
        english: "I watch a movie.",
      },
      after: {
        japanese: "映画を見ました。",
        reading: "えいがを みました。",
        english: "I watched a movie.",
      },
      question: "What changed?",
      change: "見ます → 見ました",
      insight: "ます → ました marks something that already happened.",
    },
    formation: [
      { from: "食べます", to: "食べました" },
      { from: "飲みます", to: "飲みました" },
      { from: "行きます", to: "行きました" },
      { from: "見ます", to: "見ました" },
    ],
    richExamples: [
      {
        japanese: "昨日映画を見ました。",
        reading: "きのう えいがを みました。",
        english: "I watched a movie yesterday.",
        highlight: "見ました",
      },
      {
        japanese: "朝ごはんを食べました。",
        reading: "あさごはんを たべました。",
        english: "I ate breakfast.",
      },
    ],
    reviewGrammarIds: ["g-masu"],
    recall: { template: "昨日、日本に行き ________。", answer: "ました", hint: "went (past)" },
  },

  "g-desu": {
    discovery: {
      before: {
        japanese: "わたしは学生",
        english: "I [am a] student (incomplete)",
      },
      after: {
        japanese: "わたしは学生です。",
        reading: "わたしは がくせいです。",
        english: "I am a student.",
      },
      question: "What was added?",
      change: "学生 → 学生です",
      insight:
        "です completes a polite statement. It means \"is/am/are\" and always comes at the end.",
    },
    meaningConcept:
      "です is the polite copula — it links a topic to a description (noun or adjective).",
    whenToUse: "Introducing yourself, describing things, stating facts politely.",
    whenNotToUse: "After a verb in ます form (行きますです is wrong). After ではありません's verb slot.",
    formation: [
      { from: "学生", to: "学生です" },
      { from: "暑い", to: "暑いです" },
      { from: "先生", to: "先生です" },
    ],
    richExamples: [
      {
        japanese: "わたしは学生です。",
        reading: "わたしは がくせいです。",
        english: "I am a student.",
        breakdown: [
          { jp: "わたしは", en: "I (topic)" },
          { jp: "学生", en: "student" },
          { jp: "です", en: "am (polite)" },
        ],
      },
      {
        japanese: "これは本です。",
        reading: "これは ほんです。",
        english: "This is a book.",
      },
      {
        japanese: "今日は暑いです。",
        reading: "きょうは あついです。",
        english: "Today is hot.",
        note: "い-adjectives keep their form and add です for politeness.",
      },
    ],
    mistakes: [
      {
        wrong: "わたしは学生ですです",
        right: "わたしは学生です",
        note: "Only one です at the end.",
      },
    ],
    reviewGrammarIds: ["g-wa"],
    recall: { template: "わたしは学生 ________。", answer: "です", hint: "am (polite)" },
  },

  "g-wa": {
    meaningConcept:
      "は marks the topic — what the sentence is about. Think \"As for X…\"",
    whenToUse:
      "Introducing yourself, setting the scene, contrasting (コーヒーは飲みません = as for coffee, I don't drink it).",
    whenNotToUse:
      "When introducing new information the listener doesn't know — が is often better for \"who/what\" focus.",
    nuance: "Written は, pronounced \"wa\" (not \"ha\") when it's the topic particle.",
    richExamples: [
      {
        japanese: "わたしは学生です。",
        reading: "わたしは がくせいです。",
        english: "I am a student.",
        highlight: "は",
        breakdown: [
          { jp: "わたしは", en: "I (topic)" },
          { jp: "学生です", en: "am a student" },
        ],
      },
      {
        japanese: "今日は暑いです。",
        reading: "きょうは あついです。",
        english: "Today is hot.",
        highlight: "は",
      },
      {
        japanese: "コーヒーは飲みません。",
        reading: "コーヒーは のみません。",
        english: "I don't drink coffee.",
        note: "は can imply contrast: coffee, but maybe tea is fine.",
      },
    ],
    contrasts: [
      {
        title: "は (topic) vs が (subject/focus)",
        exampleA: {
          japanese: "わたしは学生です。",
          english: "I am a student.",
          label: "Topic: about me",
        },
        exampleB: {
          japanese: "だれが学生ですか。",
          reading: "だれが がくせいですか。",
          english: "Who is the student?",
          label: "Focus: who?",
        },
        explanation:
          "は sets the topic. が highlights the subject or answers \"who/what\" questions.",
        contrastGrammarId: "g-ga",
      },
    ],
    mistakes: [
      {
        wrong: "わたしがは学生です",
        right: "わたしは学生です",
        note: "Don't stack は and が on the same word.",
      },
    ],
    recall: { template: "わたし ________ 学生です。", answer: "は", hint: "topic particle" },
  },

  "g-ga": {
    meaningConcept:
      "が marks the grammatical subject or introduces new information — often answers \"who?\" or \"what?\"",
    whenToUse:
      "First mention of something, describing what exists (本がある), likes/dislikes (猫が好き), ability.",
    contrasts: [
      {
        title: "は vs が",
        exampleA: {
          japanese: "わたしは田中です。",
          english: "I am Tanaka. (topic: me)",
          label: "は",
        },
        exampleB: {
          japanese: "だれが田中ですか。",
          english: "Who is Tanaka?",
          label: "が",
        },
        explanation: "は = topic you're talking about. が = specific focus or new info.",
        contrastGrammarId: "g-wa",
      },
    ],
    richExamples: [
      {
        japanese: "猫が好きです。",
        reading: "ねこが すきです。",
        english: "I like cats.",
        highlight: "が",
        note: "The thing you like takes が, not を.",
      },
      {
        japanese: "時間が ありません。",
        reading: "じかんが ありません。",
        english: "I don't have time.",
        highlight: "が",
      },
    ],
    reviewGrammarIds: ["g-wa"],
    recall: { template: "猫 ________ 好きです。", answer: "が", hint: "thing liked" },
  },

  "g-wo": {
    meaningConcept: "を marks the direct object — what the action happens to.",
    whenToUse: "Before verbs: eating, drinking, reading, watching, buying.",
    nuance: "Written を, pronounced \"o\" (not \"wo\"). Some motion verbs use を for the path passed through.",
    formation: [
      { from: "コーヒー 飲みます", to: "コーヒーを飲みます", note: "add を before verb" },
      { from: "本 読みます", to: "本を読みます" },
    ],
    richExamples: [
      {
        japanese: "コーヒーを飲みます。",
        reading: "コーヒーを のみます。",
        english: "I drink coffee.",
        highlight: "を",
        breakdown: [
          { jp: "コーヒーを", en: "coffee (object)" },
          { jp: "飲みます", en: "drink" },
        ],
      },
      {
        japanese: "日本語を勉強します。",
        reading: "にほんごを べんきょうします。",
        english: "I study Japanese.",
      },
    ],
    contrasts: [
      {
        title: "を (object) vs が (with 好き)",
        exampleA: {
          japanese: "寿司を食べます。",
          english: "I eat sushi.",
          label: "Action → を",
        },
        exampleB: {
          japanese: "寿司が好きです。",
          english: "I like sushi.",
          label: "Feeling → が",
        },
        explanation: "Verbs take を for the object. 好き takes が.",
        contrastGrammarId: "g-suki",
      },
    ],
    reviewGrammarIds: ["g-masu"],
    recall: { template: "コーヒー ________ 飲みます。", answer: "を", hint: "object particle" },
  },

  "g-ni": {
    meaningConcept:
      "に marks direction (to), time (at/on), location of existence, and indirect objects.",
    whenToUse: "Going to a place, meeting at a time, something exists at a location.",
    whenNotToUse: "Where an action takes place — で is used for action location.",
    richExamples: [
      {
        japanese: "学校に行きます。",
        reading: "がっこうに いきます。",
        english: "I go to school.",
        highlight: "に",
        note: "Destination → に",
      },
      {
        japanese: "七時に起きます。",
        reading: "しちじに おきます。",
        english: "I wake up at seven.",
        highlight: "に",
        note: "Specific time → に",
      },
    ],
    contrasts: [
      {
        title: "に (destination/time) vs で (action location)",
        exampleA: {
          japanese: "学校に行きます。",
          english: "I go to school.",
          label: "Direction → に",
        },
        exampleB: {
          japanese: "学校で勉強します。",
          english: "I study at school.",
          label: "Action place → で",
        },
        explanation: "に = where you're going. で = where the action happens.",
        contrastGrammarId: "g-de",
      },
    ],
    reviewGrammarIds: ["g-masu"],
    recall: { template: "学校 ________ 行きます。", answer: "に", hint: "destination" },
  },

  "g-de": {
    meaningConcept:
      "で marks where an action happens, the means/tool used, or the reason in some patterns.",
    whenToUse: "Studying at school, eating at a restaurant, going by train.",
    contrasts: [
      {
        title: "で (action) vs に (destination)",
        exampleA: {
          japanese: "レストランで食べます。",
          english: "I eat at a restaurant.",
          label: "Action location → で",
        },
        exampleB: {
          japanese: "レストランに行きます。",
          english: "I go to a restaurant.",
          label: "Destination → に",
        },
        explanation: "で = where something happens. に = where you're headed.",
        contrastGrammarId: "g-ni",
      },
    ],
    richExamples: [
      {
        japanese: "図書館で勉強します。",
        reading: "としょかんで べんきょうします。",
        english: "I study at the library.",
        highlight: "で",
      },
      {
        japanese: "電車で行きます。",
        reading: "でんしゃで いきます。",
        english: "I go by train.",
        highlight: "で",
        note: "で also marks means/method.",
      },
    ],
    reviewGrammarIds: ["g-ni"],
    recall: { template: "図書館 ________ 勉強します。", answer: "で", hint: "action location" },
  },

  "g-arimasu-imasu": {
    discovery: {
      before: {
        japanese: "本が あります。",
        reading: "ほんが あります。",
        english: "There is a book.",
      },
      after: {
        japanese: "子供がいます。",
        reading: "こどもが います。",
        english: "There are children.",
      },
      question: "What's different?",
      change: "あります → います",
      insight:
        "あります for non-living things. います for living things (people, animals).",
    },
    meaningConcept:
      "あります/います express existence or possession. The thing that exists takes が.",
    formation: [
      { from: "本 + ある", to: "本が あります", note: "things" },
      { from: "人 + いる", to: "人がいます", note: "people/animals" },
    ],
    richExamples: [
      {
        japanese: "机の上に本が あります。",
        reading: "つくえの うえに ほんが あります。",
        english: "There is a book on the desk.",
        highlight: "あります",
      },
      {
        japanese: "公園に子供がいます。",
        reading: "こうえんに こどもが います。",
        english: "There are children in the park.",
        highlight: "います",
      },
    ],
    mistakes: [
      {
        wrong: "本がいます",
        right: "本が あります",
        note: "Books are not alive — use あります.",
      },
      {
        wrong: "先生があります",
        right: "先生がいます",
        note: "People use います, not あります.",
      },
    ],
    reviewGrammarIds: ["g-ga"],
    recall: { template: "公園に子供が ________。", answer: "います", hint: "there are (living)" },
  },

  "g-suki": {
    meaningConcept:
      "好きです expresses liking something. きらいです expresses disliking. Both use が for the thing liked/disliked.",
    whenToUse: "Food, hobbies, activities, people you like.",
    whenNotToUse:
      "Wanting to do something right now — use 〜たいです instead.",
    richExamples: [
      {
        japanese: "猫が好きです。",
        reading: "ねこが すきです。",
        english: "I like cats.",
        highlight: "が好き",
        breakdown: [
          { jp: "猫が", en: "cats (focus)" },
          { jp: "好きです", en: "like" },
        ],
      },
      {
        japanese: "コーヒーが好きです。",
        reading: "コーヒーが すきです。",
        english: "I like coffee.",
      },
    ],
    contrasts: [
      {
        title: "〜が好きです vs 〜たいです",
        exampleA: {
          japanese: "ラーメンが好きです。",
          english: "I like ramen.",
          label: "General like",
        },
        exampleB: {
          japanese: "ラーメンを食べたいです。",
          english: "I want to eat ramen.",
          label: "Want to do",
        },
        explanation: "好き = general preference. たい = want to do something now.",
        contrastGrammarId: "g-tai",
      },
    ],
    mistakes: [
      {
        wrong: "猫を好きです",
        right: "猫が好きです",
        note: "The thing you like takes が, not を.",
      },
      {
        wrong: "寿司を好きします",
        right: "寿司が好きです",
        note: "好き is a な-adjective, not a verb — don't add します.",
      },
    ],
    reviewGrammarIds: ["g-ga", "g-desu"],
    recall: { template: "猫 ________ 好きです。", answer: "が", hint: "particle for likes" },
  },

  "g-i-adjectives": {
    discovery: {
      before: {
        japanese: "今日は暑い",
        reading: "きょうは あつい",
        english: "Today is hot (casual)",
      },
      after: {
        japanese: "今日は暑いです。",
        reading: "きょうは あついです。",
        english: "Today is hot. (polite)",
      },
      question: "What was added?",
      change: "暑い → 暑いです",
      insight: "い-adjectives end in い. Add です for polite speech — the い stays.",
    },
    formation: [
      { from: "暑い", to: "暑いです" },
      { from: "寒い", to: "寒いです" },
      { from: "おいしい", to: "おいしいです" },
    ],
    richExamples: [
      {
        japanese: "この映画はおもしろいです。",
        reading: "このえいがは おもしろいです。",
        english: "This movie is interesting.",
        highlight: "おもしろい",
      },
      {
        japanese: "日本語は難しいです。",
        reading: "にほんごは むずかしいです。",
        english: "Japanese is difficult.",
      },
    ],
    reviewGrammarIds: ["g-desu"],
    recall: { template: "今日は暑い ________。", answer: "です", hint: "polite ending" },
  },

  "g-ka-questions": {
    discovery: {
      before: {
        japanese: "これは本です。",
        reading: "これは ほんです。",
        english: "This is a book.",
      },
      after: {
        japanese: "これは本ですか。",
        reading: "これは ほんですか。",
        english: "Is this a book?",
      },
      question: "What was added?",
      change: "です → ですか",
      insight:
        "Add か at the end to turn a statement into a yes/no question. Word order stays the same.",
    },
    meaningConcept:
      "か turns a polite statement into a yes/no question. No word reordering like English.",
    whenToUse: "Asking polite yes/no questions.",
    whenNotToUse:
      "Casual questions often drop か and use rising intonation alone.",
    richExamples: [
      {
        japanese: "たなかさんは学生ですか。",
        reading: "たなかさんは がくせいですか。",
        english: "Is Tanaka a student?",
        highlight: "か",
      },
      {
        japanese: "コーヒーを飲みますか。",
        reading: "コーヒーを のみますか。",
        english: "Will you drink coffee?",
      },
    ],
    reviewGrammarIds: ["g-desu", "g-masu"],
    recall: { template: "これは本です ________。", answer: "か", hint: "question marker" },
  },

  "g-mashou": {
    meaningConcept:
      "ましょう is a polite suggestion — \"let's ~\" or \"shall we ~.\"",
    whenToUse: "Making plans with others, suggesting an activity.",
    formation: [
      { from: "食べます", to: "食べましょう" },
      { from: "行きます", to: "行きましょう" },
      { from: "行きましょう", to: "行きましょうか", note: "softer: \"shall we?\"" },
    ],
    richExamples: [
      {
        japanese: "一緒に食べましょう。",
        reading: "いっしょに たべましょう。",
        english: "Let's eat together.",
        highlight: "ましょう",
      },
      {
        japanese: "コーヒーを飲みましょうか。",
        reading: "コーヒーを のみましょうか。",
        english: "Shall we drink coffee?",
        highlight: "ましょうか",
      },
    ],
    contrasts: [
      {
        title: "ましょう (let's) vs たいです (I want)",
        exampleA: {
          japanese: "映画を見ましょう。",
          english: "Let's watch a movie.",
          label: "Suggestion to others",
        },
        exampleB: {
          japanese: "映画を見たいです。",
          english: "I want to watch a movie.",
          label: "My desire",
        },
        explanation: "ましょう invites others. たい describes your own want.",
        contrastGrammarId: "g-tai",
      },
      {
        title: "ましょう (let's) vs ませんか (would you like to)",
        exampleA: {
          japanese: "一緒に行きましょう。",
          reading: "いっしょに いきましょう。",
          english: "Let's go together.",
          label: "Speaker-led suggestion",
        },
        exampleB: {
          japanese: "一緒に行きませんか。",
          reading: "いっしょに いきませんか。",
          english: "Won't you go together? / Shall we go?",
          label: "Softer invitation",
        },
        explanation:
          "ましょう states \"let's.\" ませんか invites the listener more softly.",
        contrastGrammarId: "g-masenka",
      },
    ],
    reviewGrammarIds: ["g-masu"],
    recall: { template: "一緒に食べ ________。", answer: "ましょう", hint: "let's eat" },
  },

  "g-masenka": {
    meaningConcept:
      "ませんか is a polite invitation — \"Won't you ~?\" / \"Would you like to ~?\"",
    whenToUse:
      "Inviting someone to do something together: 映画を見ませんか, お茶を飲みませんか.",
    whenNotToUse:
      "Plain negative statements — 行きません means \"I won't go,\" not an invitation.",
    formation: [
      { from: "行きます", to: "行きませんか", note: "invitation" },
      { from: "見ます", to: "見ませんか" },
      { from: "飲みます", to: "飲みませんか" },
    ],
    richExamples: [
      {
        japanese: "映画を見ませんか。",
        reading: "えいがを みませんか。",
        english: "Would you like to watch a movie?",
        highlight: "見ませんか",
      },
      {
        japanese: "一緒に行きませんか。",
        reading: "いっしょに いきませんか。",
        english: "Won't you go together?",
        highlight: "行きませんか",
      },
    ],
    contrasts: [
      {
        title: "〜ません vs 〜ませんか",
        exampleA: {
          japanese: "行きません。",
          english: "I won't go.",
          label: "Negative statement",
        },
        exampleB: {
          japanese: "一緒に行きませんか。",
          reading: "いっしょに いきませんか。",
          english: "Won't you go together?",
          label: "Invitation",
        },
        explanation:
          "Same ending shape — か at the end turns it into a polite invitation.",
        contrastGrammarId: "g-masen",
      },
    ],
    reviewGrammarIds: ["g-masen", "g-mashou"],
    recall: {
      template: "映画を見 ________ か。",
      answer: "ません",
      hint: "would you like to watch",
    },
  },

  "g-e": {
    meaningConcept:
      "へ marks direction toward a place — \"toward school,\" \"to Japan.\" It emphasizes the path or direction you're heading.",
    whenToUse:
      "With motion verbs (行く, 来る, 帰る) to show where you're headed: 学校へ行きます, 日本へ来ました.",
    whenNotToUse:
      "With existence verbs (います, あります). For most everyday \"go to\" sentences, に is more common.",
    nuance:
      "Written へ, pronounced \"e\" (not \"he\"). に and へ are often interchangeable with 行く / 来る / 帰る — へ emphasizes direction; に focuses on the destination.",
    richExamples: [
      {
        japanese: "学校へ行きます。",
        reading: "がっこうへ いきます。",
        english: "I go to school.",
        highlight: "へ",
        breakdown: [
          { jp: "学校へ", en: "toward school" },
          { jp: "行きます", en: "go" },
        ],
      },
      {
        japanese: "日本へ来ました。",
        reading: "にほんへ きました。",
        english: "I came to Japan.",
        highlight: "へ",
      },
      {
        japanese: "うちへ帰ります。",
        reading: "うちへ かえります。",
        english: "I go home.",
        highlight: "へ",
        note: "帰る (return) pairs naturally with へ — heading homeward.",
      },
    ],
    contrasts: [
      {
        title: "へ (direction) vs に (destination)",
        exampleA: {
          japanese: "日本へ行きます。",
          english: "I go toward Japan.",
          label: "Direction → へ",
        },
        exampleB: {
          japanese: "日本に行きます。",
          english: "I go to Japan.",
          label: "Destination → に",
        },
        explanation:
          "At N5 they often mean the same thing. へ highlights direction; に is the default for \"go to\" a place.",
        contrastGrammarId: "g-ni",
      },
    ],
    mistakes: [
      {
        wrong: "学校へいます",
        right: "学校にいます",
        note: "へ marks direction of movement, not where something exists. Use に with います.",
      },
      {
        wrong: "日本へ勉強します。",
        right: "日本で勉強します。",
        note: "へ needs a motion verb. For where an action happens, use で.",
      },
    ],
    reviewGrammarIds: ["g-ni", "g-masu"],
    recall: { template: "学校 ________ 行きます。", answer: "へ", hint: "direction particle" },
  },
};

/**
 * Short, term-free description of what each grammar point does.
 * Used to build meaning questions where exactly one option can be right,
 * so labels must stay mutually distinct.
 */
const FUNCTION_LABELS: Record<string, string> = {
  "g-word-order": "Places the verb at the end of the sentence",
  "g-desu": "Politely says that something is or equals something else",
  "g-dewa-arimasen": "Politely denies that something is something else",
  "g-ka-questions": "Turns a statement into a yes/no question",
  "g-kore-sore-are": "Points at a thing without naming it",
  "g-kono-sono-ano": "Points at a thing while naming it",
  "g-pronouns": "Refers to people such as I, you, or him",
  "g-wa": "Marks the topic — what the sentence is about",
  "g-mo": "Adds the idea of also or too",
  "g-no": "Links two nouns to show possession",
  "g-wo": "Marks the direct object of an action",
  "g-ni": "Marks a destination or a point in time",
  "g-de": "Marks where an action takes place",
  "g-to": "Joins nouns as a complete list, or means with someone",
  "g-e": "Marks the direction you are heading toward",
  "g-kara": "Marks a starting point",
  "g-made": "Marks an ending point",
  "g-ga": "Introduces new information or identifies who",
  "g-ya": "Lists a few nouns as examples, implying more",
  "g-masu": "Politely states a habit or future action",
  "g-masen": "Politely says you do not do something",
  "g-mashita": "Politely says something already happened",
  "g-masen-deshita": "Politely denies that something happened before",
  "g-dictionary-form": "Gives the plain base form and verb group rules",
  "g-nai-form": "States that something is not done, in plain form",
  "g-ta-form": "States that something already happened, in plain form",
  "g-te-form": "Connects verbs so other patterns can attach",
  "g-te-kudasai": "Politely asks someone to do something",
  "g-te-iru": "Describes an action in progress right now",
  "g-i-adjectives": "Describes a noun with a word ending in い",
  "g-i-adj-negative": "Denies a description made with an い word",
  "g-i-adj-past": "Says how something was, using an い word",
  "g-na-adjectives": "Describes a noun with a word that needs な",
  "g-na-adj-negative": "Denies a description made with a な word",
  "g-na-adj-past": "Says how something was, using a な word",
  "g-suki": "Says what you like or dislike",
  "g-arimasu-imasu": "Says that something or someone exists",
  "g-location-ni-arimasu": "Says where something or someone is",
  "g-time-expressions": "Says when something happens",
  "g-frequency": "Says how often something happens",
  "g-counters": "Counts objects using the right counting word",
  "g-tai": "Says what the speaker wants to do",
  "g-mashou": "Suggests doing something together",
  "g-masenka": "Politely invites someone to do something",
  "g-te-mo-ii": "Gives or asks for permission",
  "g-te-wa-ikenai": "States that something is not allowed",
  "g-naide-kudasai": "Politely asks someone to refrain from acting",
  "g-koto-ga-dekiru": "Says that someone is able to do something",
  "g-yori-hou-ga": "Compares two things and says which is more",
  "g-kara-reason": "Gives a direct reason for something",
  "g-kedo": "Connects two ideas that contrast",
  "g-node": "Gives a softer, more objective explanation",
  "g-to-conditional": "Says one thing naturally follows another",
  "g-naru": "Says that something changes into another state",
};

export function getFunctionLabel(grammarId: string): string | undefined {
  return FUNCTION_LABELS[grammarId];
}

/** Merge explicit pedagogy with sensible defaults from base grammar data */
export function getGrammarPedagogy(grammar: GrammarPoint): GrammarPedagogy {
  const explicit = PEDAGOGY[grammar.id] ?? {};
  const mistakes =
    explicit.mistakes ??
    grammar.commonMistakes.slice(0, 3).map((m) => parseMistake(m));

  const { whenToUse, whenNotToUse, nuance } = inferUsageFields(grammar, explicit);

  return {
    meaningConcept: explicit.meaningConcept ?? grammar.explanation.split(".")[0] + ".",
    whenToUse,
    whenNotToUse: explicit.whenNotToUse ?? whenNotToUse,
    nuance,
    formation: explicit.formation,
    discovery: explicit.discovery,
    contrasts: explicit.contrasts,
    dialogue: explicit.dialogue,
    richExamples:
      explicit.richExamples ??
      grammar.examples.map((ex, i) => ({
        ...ex,
        note:
          i === grammar.examples.length - 1
            ? pickUsageNote(grammar.notes)
            : undefined,
      })),
    mistakes,
    reviewGrammarIds:
      explicit.reviewGrammarIds ?? grammar.prerequisiteIds.slice(0, 3),
    recall: explicit.recall,
  };
}

function isPronunciationNote(note: string): boolean {
  return /spelling|pronunciation|pronounc/i.test(note);
}

function isWhenNotNote(note: string): boolean {
  return /^(do not|don't|never|not use|cannot|can't)/i.test(note);
}

function isCasualOrPronunciationNote(note: string): boolean {
  return /casual|speech|shorten|contraction|pronounced|spelling|pronunciation|informal|written/i.test(
    note
  );
}

function isUsageNote(note: string): boolean {
  if (isPronunciationNote(note) || isWhenNotNote(note) || isCasualOrPronunciationNote(note)) {
    return false;
  }
  return /use|when|often|pair|contrast|interchange|overlap|means|marks|before|after|comes|lists|joins|negat|past|frequency|count|permission|reason|compare|become/i.test(
    note
  );
}

function pickUsageNote(notes?: string[]): string | undefined {
  if (!notes?.length) return undefined;
  return notes.find((n) => isUsageNote(n)) ?? notes.find((n) => !isPronunciationNote(n) && !isWhenNotNote(n));
}

function inferUsageFields(
  grammar: GrammarPoint,
  explicit: GrammarPedagogy
): { whenToUse?: string; whenNotToUse?: string; nuance?: string } {
  const notes = grammar.notes ?? [];
  const pronunciationNote = notes.find(isPronunciationNote);
  const usageNote = notes.find((n) => isUsageNote(n));
  const whenNotNote = notes.find(isWhenNotNote);
  const casualNote = notes.find(
    (n) => isCasualOrPronunciationNote(n) && !isPronunciationNote(n)
  );

  // An authored nuance already says everything intended; appending inferred
  // notes on top of it just repeats the same point in different words.
  const nuance = explicit.nuance
    ? explicit.nuance
    : [
        pronunciationNote,
        casualNote,
        notes.find(
          (n) =>
            !isPronunciationNote(n) &&
            n !== usageNote &&
            n !== whenNotNote &&
            !isCasualOrPronunciationNote(n)
        ),
      ]
        .filter(Boolean)
        .join(" ") || notes[1];

  return {
    whenToUse: explicit.whenToUse ?? usageNote ?? notes.find((n) => !isPronunciationNote(n) && !isWhenNotNote(n)),
    whenNotToUse: explicit.whenNotToUse ?? whenNotNote,
    nuance,
  };
}

const JAPANESE_CHAR = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/u;

function tidy(s: string): string {
  return s
    .trim()
    .replace(/^[「『]|[」』]$/g, "")
    .replace(/\s*(?:is\s+)?wrong\.?$/i, "")
    .replace(/[.。]$/, "")
    .trim();
}

/**
 * Turns a prose "common mistake" line into something displayable.
 *
 * Only the "X instead of Y" shape states its direction unambiguously, so it is
 * the only shape promoted to a ❌/✅ pair. A parenthetical can be either the
 * error ("学校で行きます is wrong") or the fix ("までに"), and an arrow shows the
 * learner's faulty transformation rather than a correction — guessing either
 * way risks presenting correct Japanese as a mistake, so those stay as
 * verbatim cautions.
 */
function parseMistake(text: string): GrammarMistake {
  const instead = text.match(
    /([^\s(（,]*[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF][^\s(（,]*)\s+instead of\s+([^\s.。,)）]+)/i
  );
  if (instead && JAPANESE_CHAR.test(instead[2])) {
    return {
      wrong: tidy(instead[1]),
      right: tidy(instead[2]),
      note: text,
    };
  }

  return { wrong: text, note: "" };
}
