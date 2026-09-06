import type { GrammarPoint } from "@/lib/types";

export const GRAMMAR_POINTS: GrammarPoint[] = [
  // ——— FOUNDATIONS ———
  {
    id: "g-word-order",
    title: "Basic word order",
    explanation:
      "Japanese sentences usually put the topic or subject near the start and the verb (or です) at the end. Particles mark each role, so word order is more flexible than English—but the polite ending almost always comes last.",
    pattern: "[Topic] は [Object] を [Verb] / [Topic] は [Noun] です",
    examples: [
      {
        japanese: "わたしはコーヒーを飲みます。",
        reading: "わたしは コーヒーを のみます。",
        english: "I drink coffee.",
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
      },
    ],
    notes: [
      "Time words often come near the beginning.",
      "Particles (は, を, に, etc.) tell you each word’s job.",
    ],
    commonMistakes: [
      "Putting the verb in the middle like English (I drink coffee → わたしは飲みますコーヒー is wrong).",
      "Leaving out particles and relying only on English-style word order.",
    ],
    prerequisiteIds: [],
  },
  {
    id: "g-desu",
    title: "です",
    explanation:
      "です is the polite “is/am/are” ending. Attach it after a noun (or after an i-adjective) to make a complete polite statement. It does not change for I, you, he, or she.",
    pattern: "[Noun] は [Noun/Adjective] です",
    examples: [
      {
        japanese: "わたしは学生です。",
        reading: "わたしは がくせいです。",
        english: "I am a student.",
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
      },
      {
        japanese: "たなかさんは先生です。",
        reading: "たなかさんは せんせいです。",
        english: "Tanaka is a teacher.",
      },
    ],
    notes: [
      "です comes at the end of the sentence.",
      "With i-adjectives you still add です for politeness (暑いです).",
    ],
    commonMistakes: [
      "Saying ですです or adding です after a polite verb (行きますです is wrong).",
      "Forgetting です and ending a polite sentence with only a bare noun.",
    ],
    prerequisiteIds: ["g-word-order"],
  },
  {
    id: "g-dewa-arimasen",
    title: "ではありません",
    explanation:
      "ではありません is the polite negative of です. Use it to say something “is not.” In casual speech you often hear じゃないです or じゃない.",
    pattern: "[Noun] は [Noun] ではありません",
    examples: [
      {
        japanese: "わたしは先生ではありません。",
        reading: "わたしは せんせいでは ありません。",
        english: "I am not a teacher.",
      },
      {
        japanese: "これはペンではありません。",
        reading: "これは ペンでは ありません。",
        english: "This is not a pen.",
      },
      {
        japanese: "今日は休みではありません。",
        reading: "きょうは やすみでは ありません。",
        english: "Today is not a day off.",
      },
    ],
    notes: [
      "ではありません can be shortened to じゃありません in speech.",
      "Do not use ではありません after a verb; verbs have their own negatives.",
    ],
    commonMistakes: [
      "Using ですない or ではないです without knowing the standard polite form.",
      "Placing ではありません before the noun instead of after it.",
    ],
    prerequisiteIds: ["g-desu"],
  },
  {
    id: "g-ka-questions",
    title: "か questions",
    explanation:
      "Add か at the end of a polite sentence to turn it into a yes/no question. Rising intonation helps, but か is the clear written marker. You do not rearrange word order like English does.",
    pattern: "[Statement] か",
    examples: [
      {
        japanese: "これは本ですか。",
        reading: "これは ほんですか。",
        english: "Is this a book?",
      },
      {
        japanese: "たなかさんは学生ですか。",
        reading: "たなかさんは がくせいですか。",
        english: "Is Tanaka a student?",
      },
      {
        japanese: "コーヒーを飲みますか。",
        reading: "コーヒーを のみますか。",
        english: "Will you drink coffee? / Do you drink coffee?",
      },
    ],
    notes: [
      "Answers often drop か and use はい or いいえ.",
      "Question words (何, どこ, だれ) still take か at the end.",
    ],
    commonMistakes: [
      "Moving words around like English (“Are you student?” order).",
      "Forgetting か in polite writing when a clear question is needed.",
    ],
    prerequisiteIds: ["g-desu"],
  },
  {
    id: "g-kore-sore-are",
    title: "これ・それ・あれ",
    explanation:
      "これ, それ, and あれ are standalone pronouns for “this/that/that over there.” これ = near the speaker, それ = near the listener, あれ = far from both. They stand alone as nouns—do not put another noun right after them.",
    pattern: "これ / それ / あれ は [Noun] です",
    examples: [
      {
        japanese: "これはペンです。",
        reading: "これは ペンです。",
        english: "This is a pen.",
      },
      {
        japanese: "それは何ですか。",
        reading: "それは なんですか。",
        english: "What is that?",
      },
      {
        japanese: "あれは学校です。",
        reading: "あれは がっこうです。",
        english: "That (over there) is a school.",
      },
    ],
    notes: [
      "Use これ/それ/あれ when pointing at a thing without naming it yet.",
      "For “this book,” use この本 instead (see この・その・あの).",
    ],
    commonMistakes: [
      "Saying これ本です instead of これは本です or この本です.",
      "Mixing up それ (near listener) and あれ (far from both).",
    ],
    prerequisiteIds: ["g-desu", "g-word-order"],
  },
  {
    id: "g-kono-sono-ano",
    title: "この・その・あの",
    explanation:
      "この, その, and あの come before a noun: “this ~,” “that ~,” “that ~ over there.” Same distance idea as これ/それ/あれ, but they must be followed by a noun.",
    pattern: "この / その / あの + [Noun]",
    examples: [
      {
        japanese: "この本はおもしろいです。",
        reading: "このほんは おもしろいです。",
        english: "This book is interesting.",
      },
      {
        japanese: "その人は誰ですか。",
        reading: "そのひとは だれですか。",
        english: "Who is that person?",
      },
      {
        japanese: "あの建物は病院です。",
        reading: "あのたてものは びょういんです。",
        english: "That building over there is a hospital.",
      },
    ],
    notes: [
      "この + noun; never この alone as the whole subject.",
      "どの + noun means “which ~” (どの本 = which book). It belongs to this same set: この・その・あの・どの.",
    ],
    commonMistakes: [
      "Using これ本 instead of この本.",
      "Using この without a noun after it.",
    ],
    prerequisiteIds: ["g-kore-sore-are"],
  },
  {
    id: "g-pronouns",
    title: "Personal pronouns",
    explanation:
      "Common polite pronouns include わたし (I), あなた (you—use carefully), and names + さん instead of “you.” Japanese often omits pronouns when the listener already knows who is meant.",
    pattern: "わたし / あなた / [Name] さん は …",
    examples: [
      {
        japanese: "わたしは日本人です。",
        reading: "わたしは にほんじんです。",
        english: "I am Japanese.",
      },
      {
        japanese: "たなかさんは医者です。",
        reading: "たなかさんは いしゃです。",
        english: "Tanaka is a doctor.",
      },
      {
        japanese: "かれは学生です。",
        reading: "かれは がくせいです。",
        english: "He is a student.",
      },
    ],
    notes: [
      "Prefer someone’s name + さん over あなた in many situations.",
      "Dropping わたし is natural when context is clear.",
    ],
    commonMistakes: [
      "Overusing あなた when a name would sound more natural.",
      "Always inserting わたし even when Japanese speakers would omit it.",
    ],
    prerequisiteIds: ["g-desu", "g-word-order"],
  },

  // ——— PARTICLES ———
  {
    id: "g-wa",
    title: "Particle は (topic)",
    explanation:
      "は (written は, pronounced “wa”) marks the topic—what the sentence is about. Think “As for X…” It often overlaps with English “subject,” but it highlights the theme of the sentence.",
    pattern: "[Topic] は [Comment]",
    examples: [
      {
        japanese: "わたしは学生です。",
        reading: "わたしは がくせいです。",
        english: "I am a student. (As for me, [I] am a student.)",
      },
      {
        japanese: "今日は暑いです。",
        reading: "きょうは あついです。",
        english: "Today is hot.",
      },
      {
        japanese: "コーヒーは飲みません。",
        reading: "コーヒーは のみません。",
        english: "I don’t drink coffee. (As for coffee…)",
      },
    ],
    notes: [
      "Spelling is は; pronunciation is “wa.”",
      "Contrast: は can imply “this, but not that.”",
    ],
    commonMistakes: [
      "Pronouncing it as “ha” when it is the topic particle.",
      "Confusing topic は with subject-marking が in every sentence.",
    ],
    prerequisiteIds: ["g-word-order"],
  },
  {
    id: "g-mo",
    title: "Particle も (also / too)",
    explanation:
      "も means “also” or “too.” It often replaces は or を on the item that is “also” true. If A is a student and B is too, B takes も.",
    pattern: "[Noun] も [Predicate]",
    examples: [
      {
        japanese: "わたしも学生です。",
        reading: "わたしも がくせいです。",
        english: "I am a student too.",
      },
      {
        japanese: "コーヒーも飲みます。",
        reading: "コーヒーも のみます。",
        english: "I drink coffee too.",
      },
      {
        japanese: "たなかさんも行きます。",
        reading: "たなかさんも いきます。",
        english: "Tanaka is going too.",
      },
    ],
    notes: [
      "も usually replaces は/を on that noun, not stacks as はも.",
      "何も〜ない means “nothing.”",
    ],
    commonMistakes: [
      "Saying はも together (わたしはも is wrong).",
      "Putting も at the end of the sentence like English “too.”",
    ],
    prerequisiteIds: ["g-wa"],
  },
  {
    id: "g-no",
    title: "Particle の (possession / linking)",
    explanation:
      "の links nouns. Most often it shows possession (“A’s B”) or describes a noun with another noun (“Japanese person,” “Tokyo station”). The main noun comes last.",
    pattern: "[Noun A] の [Noun B]",
    examples: [
      {
        japanese: "わたしの本です。",
        reading: "わたしの ほんです。",
        english: "It is my book.",
      },
      {
        japanese: "たなかさんの車です。",
        reading: "たなかさんの くるまです。",
        english: "It is Tanaka’s car.",
      },
      {
        japanese: "日本の食べ物が好きです。",
        reading: "にほんの たべものが すきです。",
        english: "I like Japanese food.",
      },
    ],
    notes: [
      "Order is owner → の → thing owned.",
      "の can also nominalize phrases at higher levels; at N5 focus on noun–noun linking.",
    ],
    commonMistakes: [
      "Reversing order (本のわたし for “my book”).",
      "Using の where a particle like が or を is needed.",
    ],
    prerequisiteIds: ["g-desu"],
  },
  {
    id: "g-wo",
    title: "Particle を (object)",
    explanation:
      "を (pronounced “o”) marks the direct object—the thing the action is done to. It comes right after that noun, before the verb.",
    pattern: "[Object] を [Verb]",
    examples: [
      {
        japanese: "本を読みます。",
        reading: "ほんを よみます。",
        english: "I read a book.",
      },
      {
        japanese: "コーヒーを飲みます。",
        reading: "コーヒーを のみます。",
        english: "I drink coffee.",
      },
      {
        japanese: "映画を見ました。",
        reading: "えいがを みました。",
        english: "I watched a movie.",
      },
    ],
    notes: [
      "Written を, spoken “o.”",
      "Some motion verbs use を for the place you pass through (公園を散歩します).",
    ],
    commonMistakes: [
      "Using は or が for a clear direct object that needs を.",
      "Putting を after the verb.",
    ],
    prerequisiteIds: ["g-word-order"],
  },
  {
    id: "g-ni",
    title: "Particle に (time / destination / existence)",
    explanation:
      "に marks points in time (“at 3:00”), destinations of movement (“to school”), and the location where someone/something exists (with あります/います). Think “to,” “at,” or “in” depending on the verb.",
    pattern: "[Time/Place] に [Verb]",
    examples: [
      {
        japanese: "三時に起きます。",
        reading: "さんじに おきます。",
        english: "I wake up at three o’clock.",
      },
      {
        japanese: "学校に行きます。",
        reading: "がっこうに いきます。",
        english: "I go to school.",
      },
      {
        japanese: "うちにいます。",
        reading: "うちに います。",
        english: "I am at home.",
      },
      {
        japanese: "友達に会います。",
        reading: "ともだちに あいます。",
        english: "I meet a friend.",
      },
    ],
    notes: [
      "Relative time words like 今日 and 毎日 often omit に.",
      "Compare で (place of action) vs に (existence / destination).",
    ],
    commonMistakes: [
      "Using で for “go to school” (学校で行きます is wrong).",
      "Adding に after 今日 / 明日 when it is not needed.",
    ],
    prerequisiteIds: ["g-word-order"],
  },
  {
    id: "g-de",
    title: "Particle で (place of action / means)",
    explanation:
      "で marks where an action happens (“study at the library”) or the means/tool (“go by train,” “write with a pen”). The action is performed there or with that thing.",
    pattern: "[Place/Means] で [Verb]",
    examples: [
      {
        japanese: "図書館で勉強します。",
        reading: "としょかんで べんきょうします。",
        english: "I study at the library.",
      },
      {
        japanese: "電車で行きます。",
        reading: "でんしゃで いきます。",
        english: "I go by train.",
      },
      {
        japanese: "日本語で話します。",
        reading: "にほんごで はなします。",
        english: "I speak in Japanese.",
      },
    ],
    notes: [
      "で = place of doing; に = place of being / going to.",
      "で also marks materials and causes in broader Japanese.",
    ],
    commonMistakes: [
      "Using に for “study at the library” (図書館に勉強します).",
      "Using で for simple existence (本が机であります).",
    ],
    prerequisiteIds: ["g-word-order"],
  },
  {
    id: "g-to",
    title: "Particle と (and / with)",
    explanation:
      "と connects nouns as “and” (A and B) when the list is complete. It also means “with” someone (talk with a friend). For incomplete “A, B, and so on,” N5 also uses や.",
    pattern: "[Noun] と [Noun] / [Person] と [Verb]",
    examples: [
      {
        japanese: "パンとミルクを買います。",
        reading: "パンと ミルクを かいます。",
        english: "I buy bread and milk.",
      },
      {
        japanese: "友達と映画を見ます。",
        reading: "ともだちと えいがを みます。",
        english: "I watch a movie with a friend.",
      },
      {
        japanese: "母と話します。",
        reading: "ははと はなします。",
        english: "I talk with my mother.",
      },
    ],
    notes: [
      "と between nouns = exhaustive “and.”",
      "Do not use と to join full sentences the English way; use て-form or から etc.",
    ],
    commonMistakes: [
      "Using と to connect verbs like English “and.”",
      "Listing people with と when you meant incomplete や.",
    ],
    prerequisiteIds: ["g-wo"],
  },
  {
    id: "g-e",
    title: "Particle へ (direction)",
    explanation:
      "へ (written へ, pronounced “e”) marks direction toward a place—“toward school,” “to Japan.” It overlaps with destination に; へ emphasizes direction, に is more common for arriving/going to a point.",
    pattern: "[Place] へ [Motion verb]",
    examples: [
      {
        japanese: "学校へ行きます。",
        reading: "がっこうへ いきます。",
        english: "I go to school.",
      },
      {
        japanese: "日本へ来ました。",
        reading: "にほんへ きました。",
        english: "I came to Japan.",
      },
      {
        japanese: "うちへ帰ります。",
        reading: "うちへ かえります。",
        english: "I go home.",
      },
    ],
    notes: [
      "Spelling へ, pronunciation “e.”",
      "に and へ are often interchangeable with 行く / 来る / 帰る.",
    ],
    commonMistakes: [
      "Pronouncing it as “he.”",
      "Using へ with existence verbs (へいます).",
    ],
    prerequisiteIds: ["g-word-order"],
  },
  {
    id: "g-kara",
    title: "Particle から (from)",
    explanation:
      "から means “from”—from a place, a time, or a starting point. Pair it with まで (“until”) for ranges like “from 9 to 5.”",
    pattern: "[Place/Time] から …",
    examples: [
      {
        japanese: "九時から勉強します。",
        reading: "くじから べんきょうします。",
        english: "I study from nine o’clock.",
      },
      {
        japanese: "うちから学校まで歩きます。",
        reading: "うちから がっこうまで あるきます。",
        english: "I walk from home to school.",
      },
      {
        japanese: "大阪から来ました。",
        reading: "おおさかから きました。",
        english: "I came from Osaka.",
      },
    ],
    notes: [
      "から after a full clause can mean “because” (see g-kara-reason).",
      "Starting point of movement or time is a core N5 use.",
    ],
    commonMistakes: [
      "Using に for “from” a place of origin.",
      "Confusing starting から with reason から without a clear clause.",
    ],
    prerequisiteIds: ["g-word-order"],
  },
  {
    id: "g-made",
    title: "Particle まで (until / as far as)",
    explanation:
      "まで means “until” or “as far as”—the end of a time span or the destination end of a route. Often pairs with から.",
    pattern: "[Place/Time] まで …",
    examples: [
      {
        japanese: "五時まで働きます。",
        reading: "ごじまで はたらきます。",
        english: "I work until five o’clock.",
      },
      {
        japanese: "駅まで歩きます。",
        reading: "えきまで あるきます。",
        english: "I walk as far as the station.",
      },
      {
        japanese: "明日まで待ってください。",
        reading: "あしたまで まってください。",
        english: "Please wait until tomorrow.",
      },
    ],
    notes: [
      "から…まで = from…to/until…",
      "までに means “by (a deadline)”—related but slightly different.",
    ],
    commonMistakes: [
      "Using まで when you mean “by” a deadline (までに).",
      "Putting まで before から in a range.",
    ],
    prerequisiteIds: ["g-kara"],
  },
  {
    id: "g-ga",
    title: "Particle が (subject / object of certain verbs)",
    explanation:
      "が marks the subject when you introduce or identify something, and it marks the object of verbs/adjectives like あります, わかります, 好き, 上手. Unlike topic は, が often highlights who/what specifically does or is involved.",
    pattern: "[Subject] が [Predicate] / [Noun] が 好きです",
    examples: [
      {
        japanese: "雨が降っています。",
        reading: "あめが ふっています。",
        english: "It is raining. (Rain is falling.)",
      },
      {
        japanese: "日本語がわかります。",
        reading: "にほんごが わかります。",
        english: "I understand Japanese.",
      },
      {
        japanese: "猫がいます。",
        reading: "ねこが います。",
        english: "There is a cat. / I have a cat.",
      },
    ],
    notes: [
      "好き / きらい / 上手 / 下手 take が for the thing liked or skilled at.",
      "が vs は is subtle; at N5 learn fixed patterns first.",
    ],
    commonMistakes: [
      "Using を with 好きです (本を好きです).",
      "Using は everywhere and never が with あります/います.",
    ],
    prerequisiteIds: ["g-wa"],
  },
  {
    id: "g-ya",
    title: "Particle や (and… among others)",
    explanation:
      "や lists nouns as examples—“A and B (and so on)”—without claiming the list is complete. Use と when the list is exact and finished.",
    pattern: "[Noun] や [Noun] (など)",
    examples: [
      {
        japanese: "りんごやバナナを買いました。",
        reading: "りんごや バナナを かいました。",
        english: "I bought apples and bananas (among other things).",
      },
      {
        japanese: "日本や中国に行きたいです。",
        reading: "にほんや ちゅうごくに いきたいです。",
        english: "I want to go to Japan and China (for example).",
      },
      {
        japanese: "机の上に本やペンが あります。",
        reading: "つくえのうえに ほんや ペンが あります。",
        english: "There are books and pens (etc.) on the desk.",
      },
    ],
    notes: [
      "など often follows a や list: AやBなど.",
      "や does not join verbs.",
    ],
    commonMistakes: [
      "Using や for a complete two-item list that should use と.",
      "Using や between clauses.",
    ],
    prerequisiteIds: ["g-to"],
  },

  // ——— VERBS ———
  {
    id: "g-masu",
    title: "ます form (polite present / future)",
    explanation:
      "The ます form is the polite non-past verb ending. It covers present habits and future actions (“I eat / I will eat”). Dictionary forms end in -u; the polite form ends in ます.",
    pattern: "[Verb stem] ます",
    examples: [
      {
        japanese: "毎日ご飯を食べます。",
        reading: "まいにち ごはんを たべます。",
        english: "I eat meals every day.",
      },
      {
        japanese: "明日学校に行きます。",
        reading: "あした がっこうに いきます。",
        english: "I will go to school tomorrow.",
      },
      {
        japanese: "日本語を勉強します。",
        reading: "にほんごを べんきょうします。",
        english: "I study Japanese.",
      },
    ],
    notes: [
      "Non-past: now/habit or future—context decides.",
      "Learn verb groups (ru-verbs, u-verbs, irregular) to conjugate reliably.",
    ],
    commonMistakes: [
      "Adding です after ます (行きますです).",
      "Using dictionary form in polite conversation by accident.",
    ],
    prerequisiteIds: ["g-dictionary-form"],
  },
  {
    id: "g-masen",
    title: "ません (polite negative)",
    explanation:
      "ません is the polite negative of ます. Use it for “do not” / “will not.”",
    pattern: "[Verb stem] ません",
    examples: [
      {
        japanese: "肉を食べません。",
        reading: "にくを たべません。",
        english: "I don’t eat meat.",
      },
      {
        japanese: "今日は行きません。",
        reading: "きょうは いきません。",
        english: "I won’t go today.",
      },
      {
        japanese: "コーヒーを飲みません。",
        reading: "コーヒーを のみません。",
        english: "I don’t drink coffee.",
      },
    ],
    notes: [
      "ませんです is nonstandard; use ません alone.",
      "Past negative is ませんでした.",
    ],
    commonMistakes: [
      "Saying ますせん or ないです on a polite verb stem incorrectly.",
      "Using ではありません for verb negation.",
    ],
    prerequisiteIds: ["g-masu"],
  },
  {
    id: "g-mashita",
    title: "ました (polite past)",
    explanation:
      "ました is the polite past: “did,” “went,” “ate.” Change ます → ました.",
    pattern: "[Verb stem] ました",
    examples: [
      {
        japanese: "昨日映画を見ました。",
        reading: "きのう えいがを みました。",
        english: "I watched a movie yesterday.",
      },
      {
        japanese: "朝ごはんを食べました。",
        reading: "あさごはんを たべました。",
        english: "I ate breakfast.",
      },
      {
        japanese: "日本に行きました。",
        reading: "にほんに いきました。",
        english: "I went to Japan.",
      },
    ],
    notes: [
      "ました covers completed actions in polite speech.",
      "For “have you ever…?” N5 later uses たことがあります.",
    ],
    commonMistakes: [
      "Using ですでした with verbs.",
      "Forgetting time words that make past meaning clear.",
    ],
    prerequisiteIds: ["g-masu"],
  },
  {
    id: "g-masen-deshita",
    title: "ませんでした (polite past negative)",
    explanation:
      "ませんでした means “did not.” It is the past negative of the polite verb.",
    pattern: "[Verb stem] ませんでした",
    examples: [
      {
        japanese: "昨日学校に行きませんでした。",
        reading: "きのう がっこうに いきませんでした。",
        english: "I didn’t go to school yesterday.",
      },
      {
        japanese: "朝ごはんを食べませんでした。",
        reading: "あさごはんを たべませんでした。",
        english: "I didn’t eat breakfast.",
      },
      {
        japanese: "手紙を書きませんでした。",
        reading: "てがみを かきませんでした。",
        english: "I didn’t write a letter.",
      },
    ],
    notes: ["Do not split it as ません でした with です after a different word."],
    commonMistakes: [
      "Using ませんでしたです.",
      "Using でした alone to negate a verb.",
    ],
    prerequisiteIds: ["g-masen", "g-mashita"],
  },
  {
    id: "g-dictionary-form",
    title: "Dictionary form & verb groups",
    explanation:
      "The dictionary form (plain non-past) is how verbs appear in dictionaries: 食べる, 行く, する. It is the base for most conjugations. Japanese verbs fall into three groups: る-verbs (食べる, 見る), う-verbs (書く, 飲む, 話す), and two irregulars (する, 来る). Watch for る-ending traps like 帰る, 入る, and 走る — they look like る-verbs but conjugate as う-verbs.",
    pattern: "[Verb dictionary form]",
    examples: [
      {
        japanese: "食べる",
        reading: "たべる",
        english: "to eat (plain · る-verb)",
      },
      {
        japanese: "書く",
        reading: "かく",
        english: "to write (plain · う-verb)",
      },
      {
        japanese: "毎日コーヒーを飲む。",
        reading: "まいにち コーヒーを のむ。",
        english: "I drink coffee every day. (casual)",
      },
    ],
    notes: [
      "Polite counterpart ends in ます.",
      "Irregulars: する → します, 来る → 来ます.",
      "帰る・入る・走る end in る but follow う-verb rules.",
    ],
    commonMistakes: [
      "Assuming every る-ending verb is a る-verb (帰る → 帰て ✗).",
      "Using dictionary form in formal situations where ます is expected.",
      "Confusing stem (食べ) with full dictionary form (食べる).",
    ],
    prerequisiteIds: ["g-word-order"],
  },
  {
    id: "g-nai-form",
    title: "Plain negative (ない-form)",
    explanation:
      "The ない-form is the plain negative: “don't / won't.” る-verbs drop る and add ない; う-verbs change the final u-sound syllable (飲む → 飲まない, 行く → 行かない). Irregulars: する → しない, 来る → 来ない. Add です for a polite but still plain-leaning negative (食べないです).",
    pattern: "[Verb ない-form]",
    examples: [
      {
        japanese: "肉を食べない。",
        reading: "にくを たべない。",
        english: "I don't eat meat. (plain)",
      },
      {
        japanese: "今日は行かない。",
        reading: "きょうは いかない。",
        english: "I won't go today. (plain)",
      },
      {
        japanese: "コーヒーを飲まないです。",
        reading: "コーヒーを のまないです。",
        english: "I don't drink coffee.",
      },
    ],
    notes: [
      "Base for ないでください and many grammar patterns.",
      "Same group rules as て-form and た-form endings.",
    ],
    commonMistakes: [
      "Using ません when the sentence needs plain negative (ない).",
      "る-verb mistake: 食べるない instead of 食べない.",
      "う-verb mistake: 飲むない instead of 飲まない.",
    ],
    prerequisiteIds: ["g-dictionary-form"],
  },
  {
    id: "g-ta-form",
    title: "Plain past (た-form)",
    explanation:
      "The た-form is the plain past: “did / went / ate.” Formation follows the same endings as て-form — only the final vowel changes (て → た, で → だ). Example: 食べて → 食べた, 飲んで → 飲んだ, 行って → 行った. Past negative: 食べなかった, 行かなかった (ない-form + かった).",
    pattern: "[Verb た-form] / [Verb なかった]",
    examples: [
      {
        japanese: "昨日映画を見た。",
        reading: "きのう えいがを みた。",
        english: "I watched a movie yesterday. (plain)",
      },
      {
        japanese: "朝ごはんを食べなかった。",
        reading: "あさごはんを たべなかった。",
        english: "I didn't eat breakfast. (plain)",
      },
      {
        japanese: "友達に会った。",
        reading: "ともだちに あった。",
        english: "I met a friend.",
      },
    ],
    notes: [
      "If you know the て-form, swap て→た or で→だ for the past.",
      "Polite past remains ました / ませんでした.",
    ],
    commonMistakes: [
      "Using た on the ます stem (食べますた).",
      "Forgetting う-verb sound changes (行く → 行った, not 行くた).",
    ],
    prerequisiteIds: ["g-nai-form"],
  },
  {
    id: "g-te-form",
    title: "て-form",
    explanation:
      "The て-form is a connector form of the verb used in requests (てください), ongoing actions (ている), permission (てもいい), and linking actions. Each verb group has conjugation rules (e.g. 見る → 見て, 書く → 書いて, 飲む → 飲んで).",
    pattern: "[Verb て-form] …",
    examples: [
      {
        japanese: "食べて",
        reading: "たべて",
        english: "eat (te-form)",
      },
      {
        japanese: "行って、買って、帰りました。",
        reading: "いって、かって、かえりました。",
        english: "I went, bought (something), and came home.",
      },
      {
        japanese: "ここで待って。",
        reading: "ここで まって。",
        english: "Wait here. (casual)",
      },
    ],
    notes: [
      "Memorize て-form charts by verb group.",
      "して and きて are the て-forms of する and 来る.",
    ],
    commonMistakes: [
      "Guessing て-forms without learning group rules (書く → 書て).",
      "Using ますて.",
    ],
    prerequisiteIds: ["g-ta-form"],
  },
  {
    id: "g-te-kudasai",
    title: "てください (please do)",
    explanation:
      "Verb て-form + ください is a polite request: “Please do ~.” Soften further with くださいませんか in careful speech.",
    pattern: "[Verb て-form] ください",
    examples: [
      {
        japanese: "座ってください。",
        reading: "すわってください。",
        english: "Please sit down.",
      },
      {
        japanese: "ゆっくり話してください。",
        reading: "ゆっくり はなしてください。",
        english: "Please speak slowly.",
      },
      {
        japanese: "これを見てください。",
        reading: "これを みてください。",
        english: "Please look at this.",
      },
    ],
    notes: [
      "ください alone also means “please give me” after a noun + を.",
      "Negative requests use ないでください.",
    ],
    commonMistakes: [
      "Using dictionary form + ください (食べるください).",
      "Using ます form + ください (食べますください).",
    ],
    prerequisiteIds: ["g-te-form"],
  },
  {
    id: "g-te-iru",
    title: "ている (ongoing / state)",
    explanation:
      "て-form + いる (polite ています) describes an action in progress (“is reading”) or a resulting state (“is married,” “knows”). Context tells which reading fits.",
    pattern: "[Verb て-form] います / いる",
    examples: [
      {
        japanese: "今、本を読んでいます。",
        reading: "いま、ほんを よんでいます。",
        english: "I am reading a book now.",
      },
      {
        japanese: "雨が降っています。",
        reading: "あめが ふっています。",
        english: "It is raining.",
      },
      {
        japanese: "東京に住んでいます。",
        reading: "とうきょうに すんでいます。",
        english: "I live in Tokyo.",
      },
    ],
    notes: [
      "住んでいる / 知っている are common “state” uses.",
      "Casual contraction: 〜てる.",
    ],
    commonMistakes: [
      "Using ます + いる (読みますいる).",
      "Forgetting が with weather subjects like 雨が降っている.",
    ],
    prerequisiteIds: ["g-te-form", "g-masu"],
  },

  // ——— ADJECTIVES ———
  {
    id: "g-i-adjectives",
    title: "い-adjectives",
    explanation:
      "い-adjectives end in い (高い, 面白い, 寒い) and can modify nouns directly or end a sentence with optional polite です. The final い is part of the word, not the particle い.",
    pattern: "[い-adjective] です / [い-adjective] + [Noun]",
    examples: [
      {
        japanese: "この本は面白いです。",
        reading: "このほんは おもしろいです。",
        english: "This book is interesting.",
      },
      {
        japanese: "大きい犬です。",
        reading: "おおきい いぬです。",
        english: "It is a big dog.",
      },
      {
        japanese: "今日は暑いです。",
        reading: "きょうは あついです。",
        english: "Today is hot.",
      },
    ],
    notes: [
      "いい (good) is irregular in some conjugations (よくない, よかった).",
      "きれい looks like an い-adjective but is a な-adjective.",
    ],
    commonMistakes: [
      "Treating きれい as an い-adjective (きれいです conjugations wrong).",
      "Dropping い when modifying a noun (高本).",
    ],
    prerequisiteIds: ["g-desu"],
  },
  {
    id: "g-i-adj-negative",
    title: "い-adjective negative",
    explanation:
      "To negate an い-adjective, drop the final い and add くない. Polite: くないです. Example: 高い → 高くない.",
    pattern: "[い-adj stem] くないです",
    examples: [
      {
        japanese: "このカバンは高くないです。",
        reading: "このカバンは たかくないです。",
        english: "This bag is not expensive.",
      },
      {
        japanese: "今日は寒くないです。",
        reading: "きょうは さむくないです。",
        english: "Today is not cold.",
      },
      {
        japanese: "その映画は面白くないです。",
        reading: "そのえいがは おもしろくないです。",
        english: "That movie is not interesting.",
      },
    ],
    notes: ["いい → よくない (irregular)."],
    commonMistakes: [
      "Saying 高いない or 高いではありません.",
      "Using くありません without knowing both くないです and くありません exist.",
    ],
    prerequisiteIds: ["g-i-adjectives"],
  },
  {
    id: "g-i-adj-past",
    title: "い-adjective past",
    explanation:
      "Past affirmative: drop い, add かった (です). 高い → 高かったです. Past negative: くなかったです.",
    pattern: "[い-adj stem] かったです / くなかったです",
    examples: [
      {
        japanese: "昨日は暑かったです。",
        reading: "きのうは あつかったです。",
        english: "Yesterday was hot.",
      },
      {
        japanese: "その本は面白かったです。",
        reading: "そのほんは おもしろかったです。",
        english: "That book was interesting.",
      },
      {
        japanese: "試験は難しくなかったです。",
        reading: "しけんは むずかしくなかったです。",
        english: "The exam was not difficult.",
      },
    ],
    notes: ["いい → よかった."],
    commonMistakes: [
      "Using 高いでした.",
      "Using でした after an unchanged い-adjective for past.",
    ],
    prerequisiteIds: ["g-i-adjectives", "g-i-adj-negative"],
  },
  {
    id: "g-na-adjectives",
    title: "な-adjectives",
    explanation:
      "な-adjectives (静かな, 元気な, 好きな) need な when they directly modify a noun. At the end of a polite sentence they take です like nouns—do not add い.",
    pattern: "[な-adjective] な [Noun] / [な-adjective] です",
    examples: [
      {
        japanese: "静かな部屋です。",
        reading: "しずかな へやです。",
        english: "It is a quiet room.",
      },
      {
        japanese: "彼は元気です。",
        reading: "かれは げんきです。",
        english: "He is energetic / well.",
      },
      {
        japanese: "きれいな花です。",
        reading: "きれいな はなです。",
        english: "It is a beautiful flower.",
      },
    ],
    notes: [
      "好き and きらい are な-adjectives and take が for the liked thing.",
      "No な before です: 静かです, not 静かなです.",
    ],
    commonMistakes: [
      "Saying 静かなです.",
      "Modifying a noun without な (静か部屋).",
    ],
    prerequisiteIds: ["g-desu"],
  },
  {
    id: "g-na-adj-negative",
    title: "な-adjective negative",
    explanation:
      "Negate な-adjectives like nouns: ではありません (or じゃないです). 静かです → 静かではありません.",
    pattern: "[な-adjective] ではありません",
    examples: [
      {
        japanese: "この町は静かではありません。",
        reading: "このまちは しずかでは ありません。",
        english: "This town is not quiet.",
      },
      {
        japanese: "今日は暇ではありません。",
        reading: "きょうは ひまでは ありません。",
        english: "I am not free today.",
      },
      {
        japanese: "彼は元気ではありません。",
        reading: "かれは げんきでは ありません。",
        english: "He is not well / not energetic.",
      },
    ],
    notes: ["Casual: 静かじゃない."],
    commonMistakes: [
      "Conjugating like い-adjectives (静かいない).",
      "Using な in the negative predicate (静かなではありません).",
    ],
    prerequisiteIds: ["g-na-adjectives", "g-dewa-arimasen"],
  },
  {
    id: "g-na-adj-past",
    title: "な-adjective past",
    explanation:
      "Past affirmative uses でした: 静かでした. Past negative: ではありませんでした.",
    pattern: "[な-adjective] でした / ではありませんでした",
    examples: [
      {
        japanese: "昨日は暇でした。",
        reading: "きのうは ひまでした。",
        english: "I was free yesterday.",
      },
      {
        japanese: "パーティーは静かでした。",
        reading: "パーティーは しずかでした。",
        english: "The party was quiet.",
      },
      {
        japanese: "彼は元気ではありませんでした。",
        reading: "かれは げんきでは ありませんでした。",
        english: "He was not well.",
      },
    ],
    notes: ["Same pattern as noun + でした."],
    commonMistakes: [
      "Using 静かかったです like an い-adjective.",
      "Using ですでした.",
    ],
    prerequisiteIds: ["g-na-adjectives", "g-na-adj-negative"],
  },

  // ——— CORE N5 ———
  {
    id: "g-suki",
    title: "好き / きらい",
    explanation:
      "好きです means “like”; きらいです means “dislike.” The thing you like takes が, not を. 好き and きらい are な-adjectives.",
    pattern: "[Noun] が 好きです / きらいです",
    examples: [
      {
        japanese: "猫が好きです。",
        reading: "ねこが すきです。",
        english: "I like cats.",
      },
      {
        japanese: "コーヒーが好きです。",
        reading: "コーヒーが すきです。",
        english: "I like coffee.",
      },
      {
        japanese: "早起きがきらいです。",
        reading: "はやおきが きらいです。",
        english: "I dislike getting up early.",
      },
      {
        japanese: "日本語の勉強が好きです。",
        reading: "にほんごの べんきょうが すきです。",
        english: "I like studying Japanese.",
      },
    ],
    notes: [
      "大好き / 大きらい intensify like/dislike.",
      "好きな + noun: 好きな食べ物.",
    ],
    commonMistakes: [
      "Using を with 好き (猫を好きです).",
      "Saying 好きします like a verb.",
    ],
    prerequisiteIds: ["g-ga", "g-desu", "g-na-adjectives"],
  },
  {
    id: "g-arimasu-imasu",
    title: "あります / います",
    explanation:
      "あります is for non-living things (books, events, possession of things). います is for living beings (people, animals). Both mean “there is / there are” or “have” in many contexts. The item takes が.",
    pattern: "[Thing] が あります / [Person/Animal] が います",
    examples: [
      {
        japanese: "机の上に本が あります。",
        reading: "つくえの うえに ほんが あります。",
        english: "There is a book on the desk.",
      },
      {
        japanese: "公園に子供がいます。",
        reading: "こうえんに こどもが います。",
        english: "There are children in the park.",
      },
      {
        japanese: "時間が ありません。",
        reading: "じかんが ありません。",
        english: "I don’t have time.",
      },
      {
        japanese: "兄弟がいます。",
        reading: "きょうだいが います。",
        english: "I have siblings.",
      },
    ],
    notes: [
      "Plants usually take あります.",
      "Negative: ありません / いません.",
    ],
    commonMistakes: [
      "Using います for inanimate objects (本がいます).",
      "Using あります for people (先生があります).",
    ],
    prerequisiteIds: ["g-ga", "g-masu"],
  },
  {
    id: "g-location-ni-arimasu",
    title: "Location に あります / います",
    explanation:
      "To say where something or someone is, use [Place] に + あります/います. Place words like 上 (on), 下 (under), 中 (inside) often appear with の: 机の上.",
    pattern: "[Place] に [Noun] が あります / います",
    examples: [
      {
        japanese: "銀行は駅の隣にあります。",
        reading: "ぎんこうは えきのとなりに あります。",
        english: "The bank is next to the station.",
      },
      {
        japanese: "猫は椅子の下にいます。",
        reading: "ねこは いすのしたに います。",
        english: "The cat is under the chair.",
      },
      {
        japanese: "教室の中に学生がいます。",
        reading: "きょうしつのなかに がくせいが います。",
        english: "There are students inside the classroom.",
      },
    ],
    notes: [
      "Topic は often marks the thing whose location you state.",
      "で is for where an action happens, not simple location of existence.",
    ],
    commonMistakes: [
      "Using で instead of に for existence location.",
      "Forgetting が on the existing thing when the sentence needs it.",
    ],
    prerequisiteIds: ["g-arimasu-imasu", "g-ni"],
  },
  {
    id: "g-time-expressions",
    title: "Time expressions",
    explanation:
      "Time words often come near the start of the sentence. Exact clock times take に (三時に). Words like 今日, 明日, 毎日 usually do not take に. Duration uses 〜時間 etc.",
    pattern: "[Time] (に) [Verb]",
    examples: [
      {
        japanese: "七時に起きます。",
        reading: "しちじに おきます。",
        english: "I wake up at seven.",
      },
      {
        japanese: "明日友達に会います。",
        reading: "あした ともだちに あいます。",
        english: "I will meet a friend tomorrow.",
      },
      {
        japanese: "週末は映画を見ます。",
        reading: "しゅうまつは えいがを みます。",
        english: "On weekends I watch movies.",
      },
    ],
    notes: [
      "月曜日に is common; 毎日に is not.",
      "から / まで build time ranges.",
    ],
    commonMistakes: [
      "Adding に after 今日 / 明日 / 毎日.",
      "Putting time only at the English position after the verb.",
    ],
    prerequisiteIds: ["g-ni", "g-masu"],
  },
  {
    id: "g-frequency",
    title: "Frequency adverbs",
    explanation:
      "Words like いつも (always), よく (often), ときどき (sometimes), あまり〜ない (not much), ぜんぜん〜ない (not at all) usually come before the verb. あまり and ぜんぜん need a negative ending.",
    pattern: "いつも / よく / ときどき / あまり〜ません",
    examples: [
      {
        japanese: "いつも朝ごはんを食べます。",
        reading: "いつも あさごはんを たべます。",
        english: "I always eat breakfast.",
      },
      {
        japanese: "ときどき映画を見ます。",
        reading: "ときどき えいがを みます。",
        english: "I sometimes watch movies.",
      },
      {
        japanese: "あまりコーヒーを飲みません。",
        reading: "あまり コーヒーを のみません。",
        english: "I don’t drink much coffee.",
      },
      {
        japanese: "ぜんぜんわかりません。",
        reading: "ぜんぜん わかりません。",
        english: "I don’t understand at all.",
      },
    ],
    notes: ["よく can also mean “well” (よくできました)."],
    commonMistakes: [
      "Using あまり or ぜんぜん with an affirmative verb.",
      "Placing frequency words after the verb like English.",
    ],
    prerequisiteIds: ["g-masu", "g-masen"],
  },
  {
    id: "g-counters",
    title: "Counters",
    explanation:
      "Japanese counts things with counter words after the number: 〜つ (general small objects), 〜人 (people), 〜本 (long objects), 〜枚 (flat objects), 〜歳 (age). Numbers often change pronunciation before counters (一人 = ひとり).",
    pattern: "[Number] + [Counter]",
    examples: [
      {
        japanese: "りんごを三つください。",
        reading: "りんごを みっつ ください。",
        english: "Three apples, please.",
      },
      {
        japanese: "学生が五人います。",
        reading: "がくせいが ごにん います。",
        english: "There are five students.",
      },
      {
        japanese: "ペンが二本あります。",
        reading: "ペンが にほん あります。",
        english: "There are two pens.",
      },
      {
        japanese: "紙を一枚ください。",
        reading: "かみを いちまい ください。",
        english: "One sheet of paper, please.",
      },
    ],
    notes: [
      "つ-counter is handy when you forget a specific counter.",
      "Learn common irregular readings (一人, 二人, 三つ…).",
    ],
    commonMistakes: [
      "Using bare English-style numbers without a counter when one is expected.",
      "Using 人 with the wrong reading (いちにん instead of ひとり for one person).",
    ],
    prerequisiteIds: ["g-wo", "g-arimasu-imasu"],
  },
  {
    id: "g-tai",
    title: "たい (want to)",
    explanation:
      "To say you want to do something, take the ます-stem and add たいです. It conjugates like an い-adjective (たくない, たかった). The object can take が or を.",
    pattern: "[Verb stem] たいです",
    examples: [
      {
        japanese: "日本に行きたいです。",
        reading: "にほんに いきたいです。",
        english: "I want to go to Japan.",
      },
      {
        japanese: "寿司が食べたいです。",
        reading: "すしが たべたいです。",
        english: "I want to eat sushi.",
      },
      {
        japanese: "今日は勉強したくないです。",
        reading: "きょうは べんきょうしたくないです。",
        english: "I don’t want to study today.",
      },
    ],
    notes: [
      "たい mainly expresses the speaker’s desire (or asks about the listener’s).",
      "For third persons, other patterns are preferred later.",
    ],
    commonMistakes: [
      "Adding たい to the full ます form (行きますたい).",
      "Using たいです on nouns without a verb (日本たいです).",
    ],
    prerequisiteIds: ["g-masu", "g-i-adjectives"],
  },
  {
    id: "g-mashou",
    title: "ましょう (let’s)",
    explanation:
      "ましょう is a polite “let’s ~” / “shall we ~” suggestion. Change ます → ましょう. ましょうか softens it to “shall we?”",
    pattern: "[Verb stem] ましょう (か)",
    examples: [
      {
        japanese: "一緒に食べましょう。",
        reading: "いっしょに たべましょう。",
        english: "Let’s eat together.",
      },
      {
        japanese: "そろそろ行きましょう。",
        reading: "そろそろ いきましょう。",
        english: "Let’s get going soon.",
      },
      {
        japanese: "コーヒーを飲みましょうか。",
        reading: "コーヒーを のみましょうか。",
        english: "Shall we drink coffee?",
      },
    ],
    notes: ["Casual equivalent often uses plain volitional (行こう)."],
    commonMistakes: [
      "Using ましょう for a solo decision about yourself only when ます is clearer.",
      "Saying ましょうです.",
    ],
    prerequisiteIds: ["g-masu"],
  },
  {
    id: "g-masenka",
    title: "ませんか (won't you / shall we)",
    explanation:
      "Verb stem + ませんか is a polite invitation: “Won't you ~?” / “Would you like to ~?” / “Shall we ~?” It sounds softer than a direct ましょう. Example: 映画を見ませんか → “Would you like to watch a movie?”",
    pattern: "[Verb stem] ませんか",
    examples: [
      {
        japanese: "一緒に行きませんか。",
        reading: "いっしょに いきませんか。",
        english: "Won't you go together? / Shall we go?",
      },
      {
        japanese: "映画を見ませんか。",
        reading: "えいがを みませんか。",
        english: "Would you like to watch a movie?",
      },
      {
        japanese: "お茶を飲みませんか。",
        reading: "おちゃを のみませんか。",
        english: "Would you like some tea?",
      },
    ],
    notes: [
      "Same shape as ません + か, but the meaning is an invitation, not “I won't.”",
      "ましょう = let's (speaker-led). ませんか = softer invite to the listener.",
    ],
    commonMistakes: [
      "Reading 行きませんか as “I won't go” without context.",
      "Using ません alone when inviting someone (行きません → statement, not invite).",
    ],
    prerequisiteIds: ["g-masen", "g-mashou"],
  },
  {
    id: "g-te-mo-ii",
    title: "てもいい (permission)",
    explanation:
      "て-form + もいいです means “it’s okay to ~” / permission. Asking: てもいいですか. The opposite pattern, てはいけません, states a prohibition (“must not ~”).",
    pattern: "[Verb て-form] もいいです",
    examples: [
      {
        japanese: "写真を撮ってもいいです。",
        reading: "しゃしんを とってもいいです。",
        english: "You may take photos.",
      },
      {
        japanese: "ここに座ってもいいですか。",
        reading: "ここに すわってもいいですか。",
        english: "May I sit here?",
      },
      {
        japanese: "窓を開けてもいいですよ。",
        reading: "まどを あけてもいいですよ。",
        english: "It’s okay to open the window.",
      },
    ],
    notes: [
      "てもいいです is the full form to learn — keep も whenever you speak or write politely.",
    ],
    commonMistakes: [
      "Attaching もいい to the ます form (食べますてもいいです).",
      "Using dictionary form + もいい.",
    ],
    prerequisiteIds: ["g-te-form", "g-ka-questions"],
  },
  {
    id: "g-te-wa-ikenai",
    title: "てはいけません (must not)",
    explanation:
      "て-form + はいけません states a rule or prohibition: “must not ~” / “not allowed to ~.” It is stronger than a request — it states what is forbidden. Question form: てはいけませんか (“Is it not allowed?”). Casual: てはいけない.",
    pattern: "[Verb て-form] はいけません",
    examples: [
      {
        japanese: "ここで写真を撮ってはいけません。",
        reading: "ここで しゃしんを とってはいけません。",
        english: "You must not take photos here.",
      },
      {
        japanese: "廊下を走ってはいけません。",
        reading: "ろうかを はしってはいけません。",
        english: "You must not run in the hallway.",
      },
      {
        japanese: "宿題を忘れてはいけません。",
        reading: "しゅくだいを わすれてはいけません。",
        english: "You must not forget your homework.",
      },
    ],
    notes: [
      "Opposite of てもいいです (permission).",
      "Rules, signs, and classroom instructions often use this pattern.",
    ],
    commonMistakes: [
      "Using てもいい for a prohibition.",
      "Using dictionary form + はいけません (食べるはいけません).",
    ],
    prerequisiteIds: ["g-te-mo-ii"],
  },
  {
    id: "g-naide-kudasai",
    title: "ないでください (please don’t)",
    explanation:
      "Plain negative ない-form + でください asks someone not to do something: “Please don’t ~.”",
    pattern: "[Verb ない-form] でください",
    examples: [
      {
        japanese: "心配しないでください。",
        reading: "しんぱいしないでください。",
        english: "Please don’t worry.",
      },
      {
        japanese: "ここで写真を撮らないでください。",
        reading: "ここで しゃしんを とらないでください。",
        english: "Please don’t take photos here.",
      },
      {
        japanese: "忘れないでください。",
        reading: "わすれないでください。",
        english: "Please don’t forget.",
      },
    ],
    notes: [
      "ない-form comes from the dictionary form (食べる → 食べない).",
      "Contrast with affirmative てください.",
    ],
    commonMistakes: [
      "Using ませんでください.",
      "Using てください with a negative meaning without ないで.",
    ],
    prerequisiteIds: ["g-te-kudasai", "g-nai-form"],
  },
  {
    id: "g-koto-ga-dekiru",
    title: "ことができる (can / be able to)",
    explanation:
      "Dictionary form + ことができます means “can do ~” / ability or possibility. A shorter cousin is the potential form (食べられます), also common at N5–N4.",
    pattern: "[Verb dictionary form] ことができます",
    examples: [
      {
        japanese: "漢字を読むことができます。",
        reading: "かんじを よむことが できます。",
        english: "I can read kanji.",
      },
      {
        japanese: "車を運転することができます。",
        reading: "くるまを うんてんすることが できます。",
        english: "I can drive a car.",
      },
      {
        japanese: "今日は行くことができません。",
        reading: "きょうは いくことが できません。",
        english: "I can’t go today.",
      },
    ],
    notes: [
      "こと turns the verb into a noun-like phrase.",
      "Negate with できません.",
    ],
    commonMistakes: [
      "Using ます form before こと (読みますことができる).",
      "Forgetting が before できます.",
    ],
    prerequisiteIds: ["g-dictionary-form", "g-ga"],
  },
  {
    id: "g-yori-hou-ga",
    title: "より / ほうが (comparisons)",
    explanation:
      "To compare, A より B のほうが [adjective] means “B is more ~ than A.” ほうが marks the winner of the comparison; より marks the one you compare against.",
    pattern: "[A] より [B] のほうが [Adjective]",
    examples: [
      {
        japanese: "電車よりバスのほうが安いです。",
        reading: "でんしゃより バスのほうが やすいです。",
        english: "Buses are cheaper than trains.",
      },
      {
        japanese: "夏より冬のほうが好きです。",
        reading: "なつより ふゆのほうが すきです。",
        english: "I like winter more than summer.",
      },
      {
        japanese: "この店のほうが静かです。",
        reading: "このみせのほうが しずかです。",
        english: "This shop is quieter (than another).",
      },
    ],
    notes: [
      "With verbs: 食べるほうがいいです = “It’s better to eat.”",
      "いちばん marks superlatives (“the most”).",
    ],
    commonMistakes: [
      "Reversing より and ほうが.",
      "Using English “than” word order without ほうが.",
    ],
    prerequisiteIds: ["g-i-adjectives", "g-no"],
  },
  {
    id: "g-kara-reason",
    title: "から (because)",
    explanation:
      "A full clause + から gives a reason: “because ~.” The reason clause comes first; the result follows. Polite speech often uses ます/です inside the から clause.",
    pattern: "[Reason clause] から、[Result]",
    examples: [
      {
        japanese: "寒いから、窓を閉めます。",
        reading: "さむいから、まどを しめます。",
        english: "Because it’s cold, I’ll close the window.",
      },
      {
        japanese: "病気ですから、今日は休みます。",
        reading: "びょうきですから、きょうは やすみます。",
        english: "Because I’m sick, I’ll take today off.",
      },
      {
        japanese: "時間が ありませんから、タクシーで行きます。",
        reading: "じかんが ありませんから、タクシーで いきます。",
        english: "Because I don’t have time, I’ll go by taxi.",
      },
    ],
    notes: [
      "Different from particle から “from.”",
      "ので is a softer “because / so.”",
    ],
    commonMistakes: [
      "Putting から at the very end with no following result when a full sentence was needed.",
      "Confusing place-from から with reason から.",
    ],
    prerequisiteIds: ["g-desu", "g-masu"],
  },
  {
    id: "g-kedo",
    title: "けど / が (but)",
    explanation:
      "けど (casual) and が (polite connector) join contrasting ideas: “but / however.” The first clause ends, then けど/が, then the contrast. Sentence-final けど can soften a request.",
    pattern: "[Clause A] けど / が、[Clause B]",
    examples: [
      {
        japanese: "高いですけど、買います。",
        reading: "たかいですけど、かいます。",
        english: "It’s expensive, but I’ll buy it.",
      },
      {
        japanese: "行きたいですが、時間が ありません。",
        reading: "いきたいですが、じかんが ありません。",
        english: "I want to go, but I don’t have time.",
      },
      {
        japanese: "すみませんけど、ちょっといいですか。",
        reading: "すみませんけど、ちょっと いいですか。",
        english: "Excuse me, but do you have a moment?",
      },
    ],
    notes: [
      "が here is a conjunction, not the subject particle.",
      "けれども is a more formal cousin of けど.",
    ],
    commonMistakes: [
      "Using particle が when you meant conjunction が (missing clause structure).",
      "Starting a polite contrast with bare でも every time when が fits better mid-sentence.",
    ],
    prerequisiteIds: ["g-desu", "g-masu"],
  },
  {
    id: "g-node",
    title: "ので (because / so)",
    explanation:
      "ので gives a reason in a softer, more explanatory tone than から. Attach it after plain forms or after です → ですので. Often translated “so / because.”",
    pattern: "[Reason] ので、[Result]",
    examples: [
      {
        japanese: "雨が降っているので、うちにいます。",
        reading: "あめが ふっているので、うちに います。",
        english: "It’s raining, so I’m staying home.",
      },
      {
        japanese: "明日テストなので、勉強します。",
        reading: "あした テストなので、べんきょうします。",
        english: "There’s a test tomorrow, so I’ll study.",
      },
      {
        japanese: "忙しいので、行けません。",
        reading: "いそがしいので、いけません。",
        english: "I’m busy, so I can’t go.",
      },
    ],
    notes: [
      "Noun / な-adjective + な + ので (病気なので).",
      "ので feels gentler and more objective than から in many contexts.",
    ],
    commonMistakes: [
      "Using ですので after an い-adjective (暑いですので—prefer 暑いので).",
      "Forgetting な after nouns before ので.",
    ],
    prerequisiteIds: ["g-kara-reason", "g-dictionary-form"],
  },
  {
    id: "g-to-conditional",
    title: "と (natural consequence)",
    explanation:
      "At N5, clause A と clause B can mean “when/if A, then B naturally happens.” B is a habitual or automatic result, not a sudden personal decision. Use dictionary/plain forms before と.",
    pattern: "[Plain clause] と、[Result]",
    examples: [
      {
        japanese: "ボタンを押すと、ドアが開きます。",
        reading: "ボタンを おすと、ドアが あきます。",
        english: "When you press the button, the door opens.",
      },
      {
        japanese: "春になると、暖かくなります。",
        reading: "はるに なると、あたたかく なります。",
        english: "When spring comes, it gets warm.",
      },
      {
        japanese: "この道をまっすぐ行くと、駅が あります。",
        reading: "この みちを まっすぐ いくと、えきが あります。",
        english: "If you go straight on this street, there’s a station.",
      },
    ],
    notes: [
      "Not the same as “and” particle と between nouns.",
      "Avoid using と for “if I feel like it, I’ll…”—that needs other conditionals later.",
    ],
    commonMistakes: [
      "Using ます form right before this と (押しますと).",
      "Confusing noun-linking と with conditional と.",
    ],
    prerequisiteIds: ["g-dictionary-form", "g-to"],
  },
  {
    id: "g-naru",
    title: "なる (to become)",
    explanation:
      "なる means “become.” With い-adjectives use 〜くなる (寒くなる). With nouns and な-adjectives use 〜になる (先生になる, 静かになる). Polite: なります.",
    pattern: "[い-adj stem] くなります / [Noun/な-adj] になります",
    examples: [
      {
        japanese: "寒くなりました。",
        reading: "さむく なりました。",
        english: "It became cold.",
      },
      {
        japanese: "医者になります。",
        reading: "いしゃに なります。",
        english: "I will become a doctor.",
      },
      {
        japanese: "日本語が上手になりました。",
        reading: "にほんごが じょうずに なりました。",
        english: "I became good at Japanese.",
      },
      {
        japanese: "二十歳になります。",
        reading: "はたちに なります。",
        english: "I will turn twenty.",
      },
    ],
    notes: [
      "したい → したくなる (come to want to).",
      "Do not say 高くなりますです.",
    ],
    commonMistakes: [
      "Using に with い-adjectives (暑いになる).",
      "Using く with nouns (先生くなります).",
    ],
    prerequisiteIds: ["g-i-adjectives", "g-na-adjectives", "g-ni", "g-masu"],
  },
];

export function getGrammarById(id: string): GrammarPoint | undefined {
  return GRAMMAR_POINTS.find((g) => g.id === id);
}
