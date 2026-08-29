/** Prints how the app segments given surface/reading pairs. Usage: node … "surface|reading" … */
import { buildFuriganaSegments } from "@/lib/furigana";

for (const arg of process.argv.slice(2)) {
  const [surface, reading] = arg.split("|");
  const segs = buildFuriganaSegments(surface, reading);
  const rendered = segs
    .map((s) => (s.furigana ? `${s.text}[${s.furigana}]` : s.text))
    .join("");
  console.log(`${surface}  +  ${reading}\n   ${rendered}\n`);
}
