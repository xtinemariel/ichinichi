/** Prints a generated lesson as a learner would see it, with furigana applied. */
import { generateLesson } from "@/lessons/generator";
import { createDefaultUserState } from "@/lib/storage";
import { buildFuriganaSegments } from "@/lib/furigana";
import { resolveFuriganaReading } from "@/lib/readings";

const ruby = (jp?: string, reading?: string) => {
  if (!jp) return "";
  const r = resolveFuriganaReading(jp, reading);
  return buildFuriganaSegments(jp, r)
    .map((s) => (s.furigana ? `${s.text}[${s.furigana}]` : s.text))
    .join("");
};

const conceptId = process.argv[2] ?? "c-tai-form";
const lesson = generateLesson(conceptId, createDefaultUserState());

console.log(`\n████ ${lesson.title} — ${lesson.subtitle}`);
console.log(lesson.description);

for (const phase of lesson.phases) {
  console.log(`\n──────── ${phase.kind.toUpperCase()}: ${phase.title} (${phase.mode})`);
  for (const b of phase.teachBlocks ?? []) {
    switch (b.kind) {
      case "heading": console.log(`\n## ${b.text}`); break;
      case "paragraph": console.log(b.text); break;
      case "example":
        console.log(`  • ${ruby(b.japanese, b.reading)}`);
        console.log(`    ${b.english}`);
        if (b.breakdown) for (const p of b.breakdown) console.log(`      ${p.jp} = ${p.en}`);
        if (b.note) console.log(`    note: ${b.note}`);
        break;
      case "pattern": console.log(`  [pattern] ${b.label}: ${b.value}`); break;
      case "callout": console.log(`  [${b.variant}] ${b.title}: ${b.body}`); break;
      case "discovery":
        console.log(`  BEFORE ${ruby(b.before.japanese, b.before.reading)} — ${b.before.english}`);
        console.log(`  AFTER  ${ruby(b.after.japanese, b.after.reading)} — ${b.after.english}`);
        console.log(`  Q: ${b.question}  ${b.change}`);
        console.log(`  → ${b.insight}`);
        break;
      case "formation":
        console.log(`  [formation] ${b.title ?? ""}`);
        for (const r of b.rows) console.log(`     ${r.from} → ${r.to}${r.note ? ` (${r.note})` : ""}`);
        break;
      case "contrast":
        console.log(`  [contrast] ${b.title}`);
        console.log(`     A ${ruby(b.exampleA.japanese, b.exampleA.reading)} — ${b.exampleA.english}`);
        console.log(`     B ${ruby(b.exampleB.japanese, b.exampleB.reading)} — ${b.exampleB.english}`);
        console.log(`     ${b.explanation}`);
        break;
      case "dialogue":
        console.log(`  [dialogue] ${b.title ?? ""}`);
        for (const l of b.lines) console.log(`     ${l.speaker}: ${ruby(l.japanese, l.reading)} — ${l.english}`);
        break;
      case "table":
        for (const r of b.rows) console.log(`     ${r.join(" | ")}`);
        break;
      default: console.log(`  [${(b as { kind: string }).kind}]`);
    }
  }
  for (const ex of phase.exercises) {
    console.log(`\n  ? (${ex.type}) ${ex.prompt}`);
    if (ex.promptJapanese) console.log(`    ${ruby(ex.promptJapanese, ex.promptReading)}`);
    if (ex.passage) console.log(`    passage: ${ruby(ex.passage)}`);
    if (ex.tokens) console.log(`    tiles: ${ex.tokens.join(" / ")}`);
    for (const o of ex.options ?? []) {
      console.log(`      ${o.label === ex.correctAnswer ? "✔" : " "} ${o.label}`);
    }
    if (!ex.options?.length) console.log(`      answer: ${ex.correctAnswer}`);
    if (ex.explanation) console.log(`    why: ${ex.explanation}`);
  }
}

console.log(`\n──────── NOTES`);
for (const r of lesson.notes.remember) console.log(`  • ${r}`);
for (const m of lesson.notes.commonMistakes) {
  console.log(m.right ? `  ❌ ${m.wrong}  ✅ ${m.right}` : `  ⚠️ ${m.wrong}`);
  console.log(`     ${m.note}`);
}
