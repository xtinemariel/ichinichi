import type { KanaItem } from "@/lib/types";

const h = (
  character: string,
  romaji: string,
  row: string
): KanaItem => ({
  id: `h-${romaji}`,
  character,
  romaji,
  type: "hiragana",
  row,
});

const k = (
  character: string,
  romaji: string,
  row: string
): KanaItem => ({
  id: `k-${romaji}`,
  character,
  romaji,
  type: "katakana",
  row,
});

export const HIRAGANA: KanaItem[] = [
  // Vowels
  h("あ", "a", "vowels"),
  h("い", "i", "vowels"),
  h("う", "u", "vowels"),
  h("え", "e", "vowels"),
  h("お", "o", "vowels"),
  // K
  h("か", "ka", "k"),
  h("き", "ki", "k"),
  h("く", "ku", "k"),
  h("け", "ke", "k"),
  h("こ", "ko", "k"),
  // S
  h("さ", "sa", "s"),
  h("し", "shi", "s"),
  h("す", "su", "s"),
  h("せ", "se", "s"),
  h("そ", "so", "s"),
  // T
  h("た", "ta", "t"),
  h("ち", "chi", "t"),
  h("つ", "tsu", "t"),
  h("て", "te", "t"),
  h("と", "to", "t"),
  // N
  h("な", "na", "n"),
  h("に", "ni", "n"),
  h("ぬ", "nu", "n"),
  h("ね", "ne", "n"),
  h("の", "no", "n"),
  // H
  h("は", "ha", "h"),
  h("ひ", "hi", "h"),
  h("ふ", "fu", "h"),
  h("へ", "he", "h"),
  h("ほ", "ho", "h"),
  // M
  h("ま", "ma", "m"),
  h("み", "mi", "m"),
  h("む", "mu", "m"),
  h("め", "me", "m"),
  h("も", "mo", "m"),
  // Y
  h("や", "ya", "y"),
  h("ゆ", "yu", "y"),
  h("よ", "yo", "y"),
  // R
  h("ら", "ra", "r"),
  h("り", "ri", "r"),
  h("る", "ru", "r"),
  h("れ", "re", "r"),
  h("ろ", "ro", "r"),
  // W + N
  h("わ", "wa", "w"),
  h("を", "wo", "w"),
  h("ん", "n", "n-final"),
  // Dakuten — G
  h("が", "ga", "g"),
  h("ぎ", "gi", "g"),
  h("ぐ", "gu", "g"),
  h("げ", "ge", "g"),
  h("ご", "go", "g"),
  // Dakuten — Z
  h("ざ", "za", "z"),
  h("じ", "ji", "z"),
  h("ず", "zu", "z"),
  h("ぜ", "ze", "z"),
  h("ぞ", "zo", "z"),
  // Dakuten — D
  h("だ", "da", "d"),
  h("ぢ", "dji", "d"),
  h("づ", "dzu", "d"),
  h("で", "de", "d"),
  h("ど", "do", "d"),
  // Dakuten — B
  h("ば", "ba", "b"),
  h("び", "bi", "b"),
  h("ぶ", "bu", "b"),
  h("べ", "be", "b"),
  h("ぼ", "bo", "b"),
  // Handakuten — P
  h("ぱ", "pa", "p"),
  h("ぴ", "pi", "p"),
  h("ぷ", "pu", "p"),
  h("ぺ", "pe", "p"),
  h("ぽ", "po", "p"),
  // Yoon
  h("きゃ", "kya", "yoon"),
  h("きゅ", "kyu", "yoon"),
  h("きょ", "kyo", "yoon"),
  h("しゃ", "sha", "yoon"),
  h("しゅ", "shu", "yoon"),
  h("しょ", "sho", "yoon"),
  h("ちゃ", "cha", "yoon"),
  h("ちゅ", "chu", "yoon"),
  h("ちょ", "cho", "yoon"),
  h("にゃ", "nya", "yoon"),
  h("にゅ", "nyu", "yoon"),
  h("にょ", "nyo", "yoon"),
  h("ひゃ", "hya", "yoon"),
  h("ひゅ", "hyu", "yoon"),
  h("ひょ", "hyo", "yoon"),
  h("みゃ", "mya", "yoon"),
  h("みゅ", "myu", "yoon"),
  h("みょ", "myo", "yoon"),
  h("りゃ", "rya", "yoon"),
  h("りゅ", "ryu", "yoon"),
  h("りょ", "ryo", "yoon"),
  h("ぎゃ", "gya", "yoon"),
  h("ぎゅ", "gyu", "yoon"),
  h("ぎょ", "gyo", "yoon"),
  h("じゃ", "ja", "yoon"),
  h("じゅ", "ju", "yoon"),
  h("じょ", "jo", "yoon"),
  h("びゃ", "bya", "yoon"),
  h("びゅ", "byu", "yoon"),
  h("びょ", "byo", "yoon"),
  h("ぴゃ", "pya", "yoon"),
  h("ぴゅ", "pyu", "yoon"),
  h("ぴょ", "pyo", "yoon"),
  // Special
  h("っ", "small-tsu", "special"),
];

export const KATAKANA: KanaItem[] = [
  // Vowels
  k("ア", "a", "vowels"),
  k("イ", "i", "vowels"),
  k("ウ", "u", "vowels"),
  k("エ", "e", "vowels"),
  k("オ", "o", "vowels"),
  // K
  k("カ", "ka", "k"),
  k("キ", "ki", "k"),
  k("ク", "ku", "k"),
  k("ケ", "ke", "k"),
  k("コ", "ko", "k"),
  // S
  k("サ", "sa", "s"),
  k("シ", "shi", "s"),
  k("ス", "su", "s"),
  k("セ", "se", "s"),
  k("ソ", "so", "s"),
  // T
  k("タ", "ta", "t"),
  k("チ", "chi", "t"),
  k("ツ", "tsu", "t"),
  k("テ", "te", "t"),
  k("ト", "to", "t"),
  // N
  k("ナ", "na", "n"),
  k("ニ", "ni", "n"),
  k("ヌ", "nu", "n"),
  k("ネ", "ne", "n"),
  k("ノ", "no", "n"),
  // H
  k("ハ", "ha", "h"),
  k("ヒ", "hi", "h"),
  k("フ", "fu", "h"),
  k("ヘ", "he", "h"),
  k("ホ", "ho", "h"),
  // M
  k("マ", "ma", "m"),
  k("ミ", "mi", "m"),
  k("ム", "mu", "m"),
  k("メ", "me", "m"),
  k("モ", "mo", "m"),
  // Y
  k("ヤ", "ya", "y"),
  k("ユ", "yu", "y"),
  k("ヨ", "yo", "y"),
  // R
  k("ラ", "ra", "r"),
  k("リ", "ri", "r"),
  k("ル", "ru", "r"),
  k("レ", "re", "r"),
  k("ロ", "ro", "r"),
  // W + N
  k("ワ", "wa", "w"),
  k("ヲ", "wo", "w"),
  k("ン", "n", "n-final"),
  // Dakuten — G
  k("ガ", "ga", "g"),
  k("ギ", "gi", "g"),
  k("グ", "gu", "g"),
  k("ゲ", "ge", "g"),
  k("ゴ", "go", "g"),
  // Dakuten — Z
  k("ザ", "za", "z"),
  k("ジ", "ji", "z"),
  k("ズ", "zu", "z"),
  k("ゼ", "ze", "z"),
  k("ゾ", "zo", "z"),
  // Dakuten — D
  k("ダ", "da", "d"),
  k("ヂ", "dji", "d"),
  k("ヅ", "dzu", "d"),
  k("デ", "de", "d"),
  k("ド", "do", "d"),
  // Dakuten — B
  k("バ", "ba", "b"),
  k("ビ", "bi", "b"),
  k("ブ", "bu", "b"),
  k("ベ", "be", "b"),
  k("ボ", "bo", "b"),
  // Handakuten — P
  k("パ", "pa", "p"),
  k("ピ", "pi", "p"),
  k("プ", "pu", "p"),
  k("ペ", "pe", "p"),
  k("ポ", "po", "p"),
  // Yoon
  k("キャ", "kya", "yoon"),
  k("キュ", "kyu", "yoon"),
  k("キョ", "kyo", "yoon"),
  k("シャ", "sha", "yoon"),
  k("シュ", "shu", "yoon"),
  k("ショ", "sho", "yoon"),
  k("チャ", "cha", "yoon"),
  k("チュ", "chu", "yoon"),
  k("チョ", "cho", "yoon"),
  k("ニャ", "nya", "yoon"),
  k("ニュ", "nyu", "yoon"),
  k("ニョ", "nyo", "yoon"),
  k("ヒャ", "hya", "yoon"),
  k("ヒュ", "hyu", "yoon"),
  k("ヒョ", "hyo", "yoon"),
  k("ミャ", "mya", "yoon"),
  k("ミュ", "myu", "yoon"),
  k("ミョ", "myo", "yoon"),
  k("リャ", "rya", "yoon"),
  k("リュ", "ryu", "yoon"),
  k("リョ", "ryo", "yoon"),
  k("ギャ", "gya", "yoon"),
  k("ギュ", "gyu", "yoon"),
  k("ギョ", "gyo", "yoon"),
  k("ジャ", "ja", "yoon"),
  k("ジュ", "ju", "yoon"),
  k("ジョ", "jo", "yoon"),
  k("ビャ", "bya", "yoon"),
  k("ビュ", "byu", "yoon"),
  k("ビョ", "byo", "yoon"),
  k("ピャ", "pya", "yoon"),
  k("ピュ", "pyu", "yoon"),
  k("ピョ", "pyo", "yoon"),
  // Special
  k("ッ", "small-tsu", "special"),
  k("ー", "chouon", "special"),
];

export const ALL_KANA = [...HIRAGANA, ...KATAKANA];

export function getKanaById(id: string): KanaItem | undefined {
  return ALL_KANA.find((k) => k.id === id);
}

export function getKanaByRow(
  type: "hiragana" | "katakana",
  row: string
): KanaItem[] {
  const source = type === "hiragana" ? HIRAGANA : KATAKANA;
  return source.filter((k) => k.row === row);
}
