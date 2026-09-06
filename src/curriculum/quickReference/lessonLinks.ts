/** Maps lesson concept IDs to Quick Reference deep links */
export const LESSON_REFERENCE_LINKS: Record<
  string,
  { href: string; label: string }
> = {
  "c-dictionary-form": { href: "/reference/verbs#verb-groups", label: "verb groups" },
  "c-masu": { href: "/reference/verbs#verb-forms", label: "polite forms" },
  "c-past-tense": { href: "/reference/verbs#verb-forms", label: "past tense forms" },
  "c-plain-forms": { href: "/reference/verbs#nai-form", label: "plain forms" },
  "c-te-form": { href: "/reference/verbs#te-ta-form", label: "て-form" },
  "c-te-kudasai": { href: "/reference/verbs#form-uses", label: "〜てください" },
  "c-te-iru": { href: "/reference/verbs#form-uses", label: "〜ています" },
  "c-permission": { href: "/reference/verbs#form-uses", label: "permission & prohibition" },
  "c-i-adjectives": { href: "/reference/adjectives#i-adj", label: "い-adjectives" },
  "c-i-adj-forms": { href: "/reference/adjectives#i-adj", label: "い-adjective forms" },
  "c-na-adjectives": { href: "/reference/adjectives#na-adj", label: "な-adjectives" },
  "c-na-adj-forms": { href: "/reference/adjectives#na-adj", label: "な-adjective forms" },
  "c-particle-wa": { href: "/reference/particles#particle-table", label: "は" },
  "c-particle-ga": { href: "/reference/particles#particle-table", label: "が" },
  "c-particle-wo": { href: "/reference/particles#particle-table", label: "を" },
  "c-particle-ni": { href: "/reference/particles#ni-vs-de", label: "に" },
  "c-particle-e": { href: "/reference/particles#ni-vs-he", label: "へ" },
  "c-particle-de": { href: "/reference/particles#ni-vs-de", label: "で" },
  "c-particle-to": { href: "/reference/particles#particle-table", label: "と" },
  "c-particle-kara": { href: "/reference/particles#particle-table", label: "から" },
  "c-particle-made": { href: "/reference/particles#particle-table", label: "まで" },
  "c-particle-no": { href: "/reference/particles#particle-table", label: "の" },
  "c-particle-mo": { href: "/reference/particles#particle-table", label: "も" },
  "c-tai": { href: "/reference/grammar#tai-desu", label: "〜たいです" },
  "c-mashou": { href: "/reference/grammar#mashou-gram", label: "invitations" },
  "c-existence": { href: "/reference/grammar#arimasu", label: "あります/います" },
  "c-ability": { href: "/reference/grammar#dekiru", label: "できます" },
  "c-prohibition": { href: "/reference/grammar#naide-kudasai", label: "ないでください" },
  "c-frequency": { href: "/reference/grammar#frequency", label: "frequency words" },
  "c-location": { href: "/reference/grammar#ni-arimasu", label: "location" },
  "c-suki": { href: "/reference/grammar#suki", label: "好き/嫌い" },
};

export function referenceLinkForConcept(
  conceptId: string
): { href: string; label: string } | null {
  return LESSON_REFERENCE_LINKS[conceptId] ?? null;
}
