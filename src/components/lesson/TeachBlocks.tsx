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
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-5 py-8 text-center">
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
        <div className="border-l-2 border-[var(--accent)] pl-4 py-1 space-y-2">
          <p className="font-jp text-2xl sm:text-3xl text-[var(--ink)] leading-snug">
            <FuriganaText
              text={block.japanese}
              reading={block.reading}
              highlight={block.highlight}
            />
          </p>
          <p className="text-[var(--ink-soft)]">{block.english}</p>
          {block.breakdown && block.breakdown.length > 0 && (
            <div className="mt-2 space-y-1 rounded-md bg-[var(--surface-subtle)] px-3 py-2 text-sm">
              {block.breakdown.map((p) => (
                <div key={p.jp} className="flex justify-between gap-3">
                  <span className="font-jp text-[var(--ink)]">{p.jp}</span>
                  <span className="text-[var(--muted)]">{p.en}</span>
                </div>
              ))}
            </div>
          )}
          {block.note && (
            <p className="text-sm text-[var(--muted)] italic">{block.note}</p>
          )}
        </div>
      );
    case "discovery":
      return (
        <div className="space-y-4 rounded-md border border-[var(--accent-soft)] bg-[var(--primary-soft)]/70 px-4 py-5">
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--accent)]">
            Notice the pattern
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[var(--muted)] mb-1">Before</p>
              <p className="font-jp text-xl text-[var(--ink)]">
                <FuriganaText text={block.before.japanese} reading={block.before.reading} />
              </p>
              <p className="text-sm text-[var(--ink-soft)]">{block.before.english}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)] mb-1">New</p>
              <p className="font-jp text-xl text-[var(--ink)]">
                <FuriganaText text={block.after.japanese} reading={block.after.reading} />
              </p>
              <p className="text-sm text-[var(--ink-soft)]">{block.after.english}</p>
            </div>
          </div>
          <div className="border-t border-[var(--accent-soft)] pt-3">
            <p className="font-medium text-[var(--ink)]">{block.question}</p>
            <p className="mt-1 font-jp text-lg text-[var(--accent)]">{block.change}</p>
            <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">{block.insight}</p>
          </div>
        </div>
      );
    case "formation":
      return (
        <div className="space-y-2">
          {block.title && (
            <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
              {block.title}
            </p>
          )}
          <div className="space-y-2">
            {block.rows.map((row, i) => (
              <div
                key={`${row.from}-${i}`}
                className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
              >
                <span className="font-jp text-lg text-[var(--ink-soft)]">{row.from}</span>
                <span className="text-[var(--muted)]">→</span>
                <span className="font-jp text-lg text-[var(--accent)]">{row.to}</span>
                {row.note && (
                  <span className="ml-auto text-xs text-[var(--muted)]">{row.note}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    case "contrast":
      return (
        <div className="space-y-3 rounded-md border border-[var(--secondary)]/25 bg-[var(--secondary-soft)]/65 px-4 py-4">
          <p className="font-medium text-[var(--ink)]">{block.title}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-[var(--surface)] px-3 py-3">
              {block.exampleA.label && (
                <p className="text-xs text-[var(--muted)] mb-1">{block.exampleA.label}</p>
              )}
              <p className="font-jp text-lg text-[var(--ink)]">
                <FuriganaText
                  text={block.exampleA.japanese}
                  reading={block.exampleA.reading}
                />
              </p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{block.exampleA.english}</p>
            </div>
            <div className="rounded-md bg-[var(--surface)] px-3 py-3">
              {block.exampleB.label && (
                <p className="text-xs text-[var(--muted)] mb-1">{block.exampleB.label}</p>
              )}
              <p className="font-jp text-lg text-[var(--ink)]">
                <FuriganaText
                  text={block.exampleB.japanese}
                  reading={block.exampleB.reading}
                />
              </p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{block.exampleB.english}</p>
            </div>
          </div>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed">{block.explanation}</p>
        </div>
      );
    case "dialogue":
      return (
        <div className="space-y-3 rounded-md border border-[var(--info)]/25 bg-[var(--info-soft)]/45 px-4 py-4">
          {block.title && (
            <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
              {block.title}
            </p>
          )}
          {block.lines.map((line, i) => (
            <div key={i} className="flex gap-3">
              <span className="shrink-0 font-medium text-[var(--accent)] w-6">
                {line.speaker}
              </span>
              <div>
                <p className="font-jp text-lg text-[var(--ink)]">
                  <FuriganaText text={line.japanese} reading={line.reading} />
                </p>
                <p className="text-sm text-[var(--ink-soft)]">{line.english}</p>
              </div>
            </div>
          ))}
        </div>
      );
    case "breakdown":
      return (
        <div className="space-y-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
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
        <div className="rounded-md border border-[var(--accent-soft)] bg-[var(--primary-soft)] px-4 py-4 text-[var(--text-primary)]">
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--primary)]">
            {block.label}
          </p>
          <p className="mt-2 font-jp text-xl text-[var(--text-primary)]">
            {block.value}
          </p>
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--surface)]">
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
          ? "border-[var(--error)]/30 bg-[var(--error-soft)]"
          : block.variant === "remember"
            ? "border-[var(--accent-warm)]/30 bg-[var(--accent-warm-soft)]"
            : "border-[var(--accent-soft)] bg-[var(--primary-soft)]";
      return (
        <div className={`rounded-md border px-4 py-3 ${styles}`}>
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
