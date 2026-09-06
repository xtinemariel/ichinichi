"use client";

import { FuriganaText } from "@/components/FuriganaText";
import type { JpLine, ReferenceTable } from "@/curriculum/quickReference/types";

interface Props {
  table: ReferenceTable;
  compact?: boolean;
}

export function ReferenceTableView({ table, compact }: Props) {
  const jpCols = new Set(table.jpColumns ?? [0, 1]);

  return (
    <div className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full min-w-[280px] text-sm">
        <thead>
          <tr className="bg-[var(--wash)] text-left text-xs tracking-wide text-[var(--muted)]">
            {table.headers.map((h) => (
              <th key={h} className="px-3 py-2.5 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-[var(--line)]">
              {row.cells.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-3 py-2.5 align-top ${
                    jpCols.has(ci)
                      ? "font-jp text-base text-[var(--ink)] whitespace-nowrap"
                      : "text-[var(--ink-soft)]"
                  } ${compact ? "py-2" : ""}`}
                >
                  <CellContent cell={cell} jp={jpCols.has(ci)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CellContent({ cell, jp }: { cell: string | JpLine; jp: boolean }) {
  if (typeof cell === "string") {
    return jp ? <span className="font-jp">{cell}</span> : <span>{cell}</span>;
  }
  return (
    <span className="block space-y-0.5">
      <FuriganaText
        text={cell.japanese}
        reading={cell.reading}
        className={jp ? "font-jp text-[var(--ink)]" : undefined}
      />
      {cell.english && (
        <span className="block text-xs text-[var(--muted)] font-sans">{cell.english}</span>
      )}
    </span>
  );
}
