"use client";

import {
  buildFuriganaSegments,
  readingForFurigana,
} from "@/lib/furigana";

interface Props {
  text: string;
  reading?: string | null;
  className?: string;
  /** Highlight a substring (surface text) while keeping furigana */
  highlight?: string;
}

export function FuriganaText({
  text,
  reading,
  className,
  highlight,
}: Props) {
  const furi = readingForFurigana(text, reading);
  const segments = buildFuriganaSegments(text, furi);
  const showRuby = Boolean(furi);

  if (!showRuby && !highlight) {
    return <span className={className}>{text}</span>;
  }

  if (!showRuby && highlight) {
    return (
      <span className={className}>
        <Highlighted text={text} highlight={highlight} />
      </span>
    );
  }

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        const inner = highlight ? (
          <Highlighted text={seg.text} highlight={highlight} />
        ) : (
          seg.text
        );
        if (!seg.furigana) {
          return <span key={i}>{inner}</span>;
        }
        return (
          <ruby key={i}>
            {inner}
            <rp>(</rp>
            <rt>{seg.furigana}</rt>
            <rp>)</rp>
          </ruby>
        );
      })}
    </span>
  );
}

function Highlighted({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  const idx = text.indexOf(highlight);
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[var(--accent)] underline decoration-2 underline-offset-4">
        {highlight}
      </span>
      {text.slice(idx + highlight.length)}
    </>
  );
}
