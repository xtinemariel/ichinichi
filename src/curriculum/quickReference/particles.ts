import type { ReferenceCompare, ReferenceTable } from "./types";

export interface ParticleEntry {
  particle: string;
  use: string;
  example: { japanese: string; reading?: string; english: string };
  searchTerms?: string[];
}

export const PARTICLE_TABLE: ParticleEntry[] = [
  {
    particle: "は",
    use: "Topic — what the sentence is about",
    example: {
      japanese: "私は学生です。",
      reading: "わたしは がくせいです。",
      english: "I am a student. (As for me, I'm a student.)",
    },
    searchTerms: ["wa", "topic"],
  },
  {
    particle: "が",
    use: "Subject marker; introduces new info; with います/あります",
    example: {
      japanese: "猫がいます。",
      reading: "ねこが います。",
      english: "There is a cat.",
    },
    searchTerms: ["ga", "subject", "existence"],
  },
  {
    particle: "を",
    use: "Direct object — what the verb acts on",
    example: {
      japanese: "水を飲みます。",
      reading: "みずを のみます。",
      english: "I drink water.",
    },
    searchTerms: ["wo", "o", "object"],
  },
  {
    particle: "に",
    use: "Time, destination, existence location, indirect target",
    example: {
      japanese: "七時に起きます。",
      reading: "しちじに おきます。",
      english: "I wake up at seven.",
    },
    searchTerms: ["ni", "time", "destination"],
  },
  {
    particle: "で",
    use: "Place where an action happens; means/method",
    example: {
      japanese: "学校で勉強します。",
      reading: "がっこうで べんきょうします。",
      english: "I study at school.",
    },
    searchTerms: ["de", "location", "place of action"],
  },
  {
    particle: "へ",
    use: "Direction toward (written へ, pronounced え)",
    example: {
      japanese: "日本へ行きます。",
      reading: "にほんへ いきます。",
      english: "I go to Japan.",
    },
    searchTerms: ["he", "e", "direction"],
  },
  {
    particle: "と",
    use: "With someone; complete list of nouns",
    example: {
      japanese: "友達と行きます。",
      reading: "ともだちと いきます。",
      english: "I go with a friend.",
    },
    searchTerms: ["to", "with", "and"],
  },
  {
    particle: "の",
    use: "Possession; noun modifier",
    example: {
      japanese: "私の本です。",
      reading: "わたしの ほんです。",
      english: "It is my book.",
    },
    searchTerms: ["no", "possession"],
  },
  {
    particle: "も",
    use: "Also, too",
    example: {
      japanese: "私も学生です。",
      reading: "わたしも がくせいです。",
      english: "I am also a student.",
    },
    searchTerms: ["mo", "also", "too"],
  },
  {
    particle: "から",
    use: "From (starting point); because",
    example: {
      japanese: "九時からです。",
      reading: "くじからです。",
      english: "It is from nine o'clock.",
    },
    searchTerms: ["kara", "from", "because"],
  },
  {
    particle: "まで",
    use: "Until; as far as",
    example: {
      japanese: "五時までです。",
      reading: "ごじまでです。",
      english: "It is until five o'clock.",
    },
    searchTerms: ["made", "until"],
  },
];

export const PARTICLE_COMPARISONS: ReferenceCompare[] = [
  {
    id: "ni-vs-de",
    title: "に vs で",
    items: [
      {
        label: "に",
        summary: "Destination, time, existence location, indirect target",
        example: {
          japanese: "学校に行きます。",
          reading: "がっこうに いきます。",
          english: "I go to school.",
        },
      },
      {
        label: "で",
        summary: "Place where an action happens; by what means",
        example: {
          japanese: "学校で勉強します。",
          reading: "がっこうで べんきょうします。",
          english: "I study at school.",
        },
      },
    ],
    note: "に marks where you go or when something happens. で marks where you do something.",
  },
  {
    id: "wa-vs-ga",
    title: "は vs が",
    items: [
      {
        label: "は",
        summary: "Topic — the frame for the sentence; often already known",
        example: {
          japanese: "田中さんは学生です。",
          reading: "たなかさんは がくせいです。",
          english: "Tanaka is a student. (talking about Tanaka)",
        },
      },
      {
        label: "が",
        summary: "Identifies who/what — often new or emphasized information",
        example: {
          japanese: "だれが学生ですか。田中さんが学生です。",
          reading: "だれが がくせいですか。たなかさんが がくせいです。",
          english: "Who is the student? Tanaka is.",
        },
      },
    ],
    note: "は sets the topic. が often marks the doer or the thing that exists (猫がいます). Both can feel like “subject” in English — focus on topic vs. new identification.",
  },
  {
    id: "ni-vs-he",
    title: "に vs へ",
    items: [
      {
        label: "に",
        summary: "Destination or arrival point — most common for “go to”",
        example: {
          japanese: "学校に行きます。",
          reading: "がっこうに いきます。",
          english: "I go to school.",
        },
      },
      {
        label: "へ",
        summary: "Direction toward — emphasizes the path/heading",
        example: {
          japanese: "日本へ行きます。",
          reading: "にほんへ いきます。",
          english: "I head toward Japan.",
        },
      },
    ],
    note: "With 行く/来る/帰る, に and へ are often interchangeable. へ sounds slightly more directional.",
  },
  {
    id: "de-vs-wo-movement",
    title: "で vs を (movement)",
    items: [
      {
        label: "で (means)",
        summary: "By what means / vehicle",
        example: {
          japanese: "バスで行きます。",
          reading: "バスで いきます。",
          english: "I go by bus.",
        },
      },
      {
        label: "を (through)",
        summary: "Space moved through (common N5 pattern)",
        example: {
          japanese: "公園を歩きます。",
          reading: "こうえんを あるきます。",
          english: "I walk through the park.",
        },
      },
    ],
  },
];

export const PARTICLE_SEARCH_SECTIONS = [
  { id: "particle-table", title: "Particle quick table", terms: ["particle", "は", "が", "を", "に", "で", "へ", "と", "の", "も", "から", "まで"] },
  ...PARTICLE_COMPARISONS.map((c) => ({
    id: c.id,
    title: c.title,
    terms: [c.title, ...c.items.map((i) => i.label)],
  })),
];
