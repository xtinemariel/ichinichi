/** Prints every common-mistake pair the app will show, for direction review. */
import { GRAMMAR_POINTS } from "@/curriculum/grammar";
import { getGrammarPedagogy } from "@/curriculum/grammarPedagogy";

let pairs = 0;
let cautions = 0;

for (const g of GRAMMAR_POINTS) {
  const p = getGrammarPedagogy(g);
  const list = p.mistakes ?? [];
  if (!list.length) continue;
  console.log(`\n── ${g.id}  (${g.title})   pattern: ${g.pattern}`);
  for (const m of list) {
    if (m.right) {
      pairs += 1;
      console.log(`   ❌ ${m.wrong}`);
      console.log(`   ✅ ${m.right}`);
    } else {
      cautions += 1;
      console.log(`   ⚠️  ${m.wrong}`);
    }
    if (m.note) console.log(`      ${m.note}`);
  }
}

console.log(`\n\nTotal: ${pairs} corrected pairs, ${cautions} cautions.`);
