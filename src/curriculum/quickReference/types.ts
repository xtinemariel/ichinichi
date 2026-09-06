export type ReferenceCategory = "verbs" | "adjectives" | "particles" | "grammar";

export interface ReferenceCategoryMeta {
  id: ReferenceCategory;
  title: string;
  description: string;
  href: string;
}

export interface JpLine {
  japanese: string;
  reading?: string;
  english?: string;
}

export interface ReferenceTableRow {
  cells: Array<string | JpLine>;
}

export interface ReferenceTable {
  headers: string[];
  rows: ReferenceTableRow[];
  /** First columns rendered with font-jp */
  jpColumns?: number[];
}

export interface ReferenceGrammarEntry {
  id: string;
  pattern: string;
  meaning: string;
  form?: string;
  example: JpLine;
  negative?: JpLine;
  note?: string;
  group?: string;
  searchTerms?: string[];
}

export interface ReferenceCompare {
  id: string;
  title: string;
  items: Array<{
    label: string;
    summary: string;
    example: JpLine;
  }>;
  note?: string;
}

export interface ReferenceSection {
  id: string;
  title: string;
  intro?: string;
  searchTerms?: string[];
}

export interface ReferenceSearchHit {
  id: string;
  category: ReferenceCategory;
  categoryLabel: string;
  title: string;
  snippet: string;
  href: string;
  score: number;
}
