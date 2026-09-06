import { REFERENCE_CATEGORIES } from "./categories";
import { ADJ_SEARCH_SECTIONS } from "./adjectives";
import { GRAMMAR_GROUPS, GRAMMAR_SEARCH_SECTIONS, SENTENCE_PATTERNS } from "./grammar";
import { PARTICLE_SEARCH_SECTIONS, PARTICLE_TABLE } from "./particles";
import type { ReferenceCategory, ReferenceSearchHit } from "./types";
import { VERB_FORM_USES, VERB_SEARCH_SECTIONS } from "./verbs";

interface SearchDoc {
  id: string;
  category: ReferenceCategory;
  title: string;
  terms: string[];
  snippet: string;
  href: string;
}

function flattenGrammar(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const group of GRAMMAR_GROUPS) {
    for (const entry of group.entries) {
      docs.push({
        id: entry.id,
        category: "grammar",
        title: entry.pattern,
        terms: [
          entry.pattern,
          entry.meaning,
          entry.form ?? "",
          entry.example.japanese,
          entry.example.english ?? "",
          ...(entry.searchTerms ?? []),
          group.title,
        ].filter(Boolean),
        snippet: entry.meaning,
        href: `/reference/grammar#${entry.id}`,
      });
    }
  }
  for (const sp of SENTENCE_PATTERNS) {
    docs.push({
      id: `sp-${sp.pattern}`,
      category: "grammar",
      title: sp.pattern,
      terms: [sp.pattern, sp.example.japanese, sp.example.english ?? "", "sentence", "template"],
      snippet: sp.example.english ?? sp.pattern,
      href: "/reference/grammar#sentence-patterns",
    });
  }
  for (const sec of GRAMMAR_SEARCH_SECTIONS) {
    docs.push({
      id: sec.id,
      category: "grammar",
      title: sec.title,
      terms: sec.terms,
      snippet: sec.title,
      href: `/reference/grammar#${sec.id}`,
    });
  }
  return docs;
}

function flattenVerbs(): SearchDoc[] {
  const docs: SearchDoc[] = VERB_SEARCH_SECTIONS.map((sec) => ({
    id: sec.id,
    category: "verbs" as const,
    title: sec.title,
    terms: sec.terms,
    snippet: sec.title,
    href: `/reference/verbs#${sec.id}`,
  }));
  for (const use of VERB_FORM_USES) {
    docs.push({
      id: use.id,
      category: "verbs",
      title: use.pattern,
      terms: [use.pattern, use.meaning, use.example.japanese, ...(use.searchTerms ?? [])],
      snippet: use.meaning,
      href: `/reference/verbs#form-uses`,
    });
  }
  return docs;
}

function flattenAdjectives(): SearchDoc[] {
  return ADJ_SEARCH_SECTIONS.map((sec) => ({
    id: sec.id,
    category: "adjectives" as const,
    title: sec.title,
    terms: sec.terms,
    snippet: sec.title,
    href: `/reference/adjectives#${sec.id}`,
  }));
}

function flattenParticles(): SearchDoc[] {
  const docs: SearchDoc[] = PARTICLE_TABLE.map((p) => ({
    id: `particle-${p.particle}`,
    category: "particles" as const,
    title: `${p.particle} — ${p.use.split("—")[0].trim()}`,
    terms: [p.particle, p.use, p.example.japanese, p.example.english, ...(p.searchTerms ?? [])],
    snippet: p.use,
    href: `/reference/particles#particle-table`,
  }));
  for (const sec of PARTICLE_SEARCH_SECTIONS) {
    if (!docs.some((d) => d.id === sec.id)) {
      docs.push({
        id: sec.id,
        category: "particles",
        title: sec.title,
        terms: sec.terms,
        snippet: sec.title,
        href: `/reference/particles#${sec.id}`,
      });
    }
  }
  return docs;
}

const SEARCH_INDEX: SearchDoc[] = [
  ...flattenVerbs(),
  ...flattenAdjectives(),
  ...flattenParticles(),
  ...flattenGrammar(),
];

function scoreMatch(query: string, doc: SearchDoc): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  let score = 0;
  if (doc.title.toLowerCase().includes(q)) score += 10;
  for (const term of doc.terms) {
    const t = term.toLowerCase();
    if (t === q) score += 20;
    else if (t.includes(q)) score += 5;
    else if (q.length >= 2 && t.startsWith(q)) score += 3;
  }
  return score;
}

export function searchReference(query: string, limit = 12): ReferenceSearchHit[] {
  const q = query.trim();
  if (!q) return [];

  const hits: ReferenceSearchHit[] = [];
  for (const doc of SEARCH_INDEX) {
    const score = scoreMatch(q, doc);
    if (score <= 0) continue;
    const cat = REFERENCE_CATEGORIES.find((c) => c.id === doc.category);
    hits.push({
      id: doc.id,
      category: doc.category,
      categoryLabel: cat?.title ?? doc.category,
      title: doc.title,
      snippet: doc.snippet,
      href: doc.href,
      score,
    });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

export { SEARCH_INDEX };
