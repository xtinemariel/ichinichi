"use client";

import type { TeachBlock } from "@/lib/types";
import { FuriganaText } from "@/components/FuriganaText";

export function TeachBlocks({ blocks }: { blocks: TeachBlock[] }) {
  return (
    <div className="space-y-6 animate-fade-up">
      {blocks.map((block, i) => (
        <TeachBlockView key={`${block.kind}-${i}`} block={block} />
      ))}
    </div>
  );
}

function TeachBlockView({ block }: { block: TeachBlock }) {
  switch (block.kind) {
    case "heading":
      return (
        <h2 className="font-display text-3xl leading-tight text-[var(--ink)]">
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className="text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">
          {block.text}
        </p>
      );
    case "hero_character":
      return (
        <div className="rounded-sm border border-[var(--line)] bg-[var(--wash)] px-5 py-8 text-center">
          <p className="font-jp text-7xl sm:text-8xl text-[var(--ink)] tracking-wide">
            {block.furigana ? (
              <FuriganaText
                text={block.character}
                reading={block.furigana}
                className="furi-hero"
              />
            ) : (
              block.character
            )}
          </p>
          <p className="mt-4 text-sm tracking-[0.2em] uppercase text-[var(--muted)]">
            {block.furigana ? "Meaning" : "Sound"}
          </p>
          <p className="mt-1 font-display text-2xl text-[var(--accent)]">
            {block.sound}
          </p>
          {block.romaji && (
            <p className="mt-1 text-sm text-[var(--muted)]">{block.romaji}</p>
          )}
          {block.note && block.note !== block.sound && (
            <p className="mt-3 text-sm text-[var(--ink-soft)]">{block.note}</p>
          )}
        </div>
      );
    case "example":
      return (
        <div className="border-l-2 border-[var(--accent)] pl-4 py-1">
          <p className="font-jp text-2xl sm:text-3xl text-[var(--ink)] leading-snug">
            <FuriganaText
              text={block.japanese}
              reading={block.reading}
              highlight={block.highlight}
            />
          </p>
          <p className="mt-1 text-[var(--ink-soft)]">{block.english}</p>
        </div>
      );
    case "breakdown":
      return (
        <div className="space-y-2 rounded-sm border border-[var(--line)] bg-[var(--paper)] px-4 py-4">
          {block.title && (
            <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
              {block.title}
            </p>
          )}
          {block.parts.map((p) => (
            <div
              key={p.jp}
              className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] py-2 last:border-0"
            >
              <span className="font-jp text-lg text-[var(--ink)]">{p.jp}</span>
              <span className="text-sm text-[var(--muted)] text-right">{p.en}</span>
            </div>
          ))}
        </div>
      );
    case "pattern":
      return (
        <div className="rounded-sm bg-[var(--ink)] px-4 py-4 text-[var(--paper)]">
          <p className="text-xs tracking-[0.15em] uppercase opacity-70">
            {block.label}
          </p>
          <p className="mt-2 font-jp text-xl">{block.value}</p>
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-sm border border-[var(--line)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--wash)] text-left text-xs tracking-wide text-[var(--muted)]">
                {block.headers.map((h) => (
                  <th key={h} className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-[var(--line)]">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-3 py-2.5 ${ci === 0 || ci === 1 ? "font-jp text-base" : "text-[var(--ink-soft)]"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout": {
      const styles =
        block.variant === "mistake"
          ? "border-[var(--danger)]/25 bg-[var(--danger-wash)]"
          : block.variant === "remember"
            ? "border-[var(--accent-soft)] bg-[var(--accent-wash)]"
            : "border-[var(--line)] bg-[var(--wash)]";
      return (
        <div className={`rounded-sm border px-4 py-3 ${styles}`}>
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
            {block.title}
          </p>
          <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">
            {block.body}
          </p>
        </div>
      );
    }
    case "vocab_row":
      return (
        <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] py-3">
          <div>
            <p className="font-jp text-2xl text-[var(--ink)]">
              <FuriganaText text={block.japanese} reading={block.reading} />
            </p>
          </div>
          <p className="text-sm text-[var(--ink-soft)] text-right">{block.english}</p>
        </div>
      );
    default:
      return null;
  }
}
