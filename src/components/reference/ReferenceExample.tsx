"use client";

import { FuriganaText } from "@/components/FuriganaText";
import type { JpLine } from "@/curriculum/quickReference/types";

interface Props {
  example: JpLine;
  compact?: boolean;
}

export function ReferenceExample({ example, compact }: Props) {
  return (
    <div className={`border-l-2 border-[var(--accent-soft)] pl-3 ${compact ? "py-0.5" : "py-1"}`}>
      <p className={`font-jp text-[var(--ink)] leading-snug ${compact ? "text-lg" : "text-xl"}`}>
        <FuriganaText text={example.japanese} reading={example.reading} />
      </p>
      {example.english && (
        <p className="mt-1 text-sm text-[var(--muted)]">{example.english}</p>
      )}
    </div>
  );
}
