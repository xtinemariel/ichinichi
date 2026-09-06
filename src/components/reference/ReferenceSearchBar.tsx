"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { searchReference } from "@/curriculum/quickReference/search";

interface Props {
  autoFocus?: boolean;
  initialQuery?: string;
}

export function ReferenceSearchBar({ autoFocus, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => searchReference(query), [query]);

  return (
    <div className="relative">
      <label htmlFor="ref-search" className="sr-only">
        Search Quick Reference
      </label>
      <input
        id="ref-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search verbs, particles, grammar…"
        autoFocus={autoFocus}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
      />
      {query.trim().length > 0 && results.length > 0 && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface-raised)] shadow-sm max-h-72 overflow-y-auto">
          {results.map((hit) => (
            <li key={`${hit.category}-${hit.id}`}>
              <Link
                href={hit.href}
                className="block px-4 py-3 hover:bg-[var(--surface-subtle)] transition-colors"
                onClick={() => setQuery("")}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-[var(--ink)]">{hit.title}</span>
                  <span className="shrink-0 text-xs text-[var(--muted)]">{hit.categoryLabel}</span>
                </div>
                <p className="mt-0.5 text-xs text-[var(--ink-soft)] line-clamp-1">{hit.snippet}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {query.trim().length > 1 && results.length === 0 && (
        <p className="absolute z-30 mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
          No matches — try て, を, たい, or negative
        </p>
      )}
    </div>
  );
}
