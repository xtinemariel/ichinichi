"use client";

import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/lib/types";
import { checkAnswer } from "@/lessons/generator";
import { FuriganaText } from "@/components/FuriganaText";
import { resolveFuriganaReading } from "@/lib/readings";

interface Props {
  exercise: Exercise;
  mode: "practice" | "assessment";
  onResult: (correct: boolean, userAnswer: string) => void;
  /** Practice: after wrong answer, parent may inject a retry */
  onNeedRetry?: () => void;
}

export function ExerciseRenderer({
  exercise,
  mode,
  onResult,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [ordered, setOrdered] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>(exercise.tokens ?? []);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);

  const rightOptions = useMemo(() => {
    if (!exercise.matchingPairs) return [];
    return shuffle(exercise.matchingPairs.map((p) => p.right));
  }, [exercise.id, exercise.matchingPairs]);

  useEffect(() => {
    setSelected(null);
    setOrdered([]);
    setRemaining(exercise.tokens ?? []);
    setRevealed(false);
    setWasCorrect(null);
    setMatches({});
    setActiveLeft(null);
  }, [exercise.id, exercise.tokens]);

  const submit = (answer: string) => {
    if (revealed) return;
    const correct = checkAnswer(exercise, answer);
    setWasCorrect(correct);
    setRevealed(true);
    const delay = mode === "assessment" ? (correct ? 700 : 1100) : correct ? 800 : 1600;
    setTimeout(() => onResult(correct, answer), delay);
  };

  const isChoice =
    exercise.type === "multiple_choice" ||
    exercise.type === "jp_to_en" ||
    exercise.type === "en_to_jp" ||
    exercise.type === "kana_recognition" ||
    exercise.type === "kana_select" ||
    exercise.type === "conjugation" ||
    (exercise.type === "reading" && Boolean(exercise.options));

  const largeJpOptions =
    exercise.type === "kana_select" ||
    exercise.type === "en_to_jp" ||
    exercise.type === "conjugation";

  return (
    <div className="animate-fade-up space-y-6">
      {exercise.passage && (
        <div className="rounded-sm border border-[var(--line)] bg-[var(--wash)] px-4 py-5">
          <p className="font-jp text-lg leading-relaxed text-[var(--ink)]">
            <FuriganaText
              text={exercise.passage}
              reading={resolveFuriganaReading(
                exercise.passage,
                exercise.passageReading
              )}
            />
          </p>
        </div>
      )}

      <div className="space-y-3">
        {exercise.promptJapanese && (
          <p className="font-jp text-5xl sm:text-6xl tracking-wide text-[var(--ink)] text-center">
            <FuriganaText
              text={exercise.promptJapanese}
              reading={resolveFuriganaReading(
                exercise.promptJapanese,
                exercise.promptReading
              )}
              className="furi-hero"
            />
          </p>
        )}
        {exercise.promptReading &&
          !resolveFuriganaReading(
            exercise.promptJapanese ?? "",
            exercise.promptReading
          ) && (
          <p className="text-center text-sm text-[var(--muted)]">
            {exercise.promptReading}
          </p>
        )}
        <p className="text-center text-[var(--ink-soft)] leading-relaxed">
          {exercise.prompt}
        </p>
        {mode === "practice" && exercise.hint && !revealed && (
          <p className="text-center text-xs text-[var(--muted)]">
            Hint: {exercise.hint}
          </p>
        )}
      </div>

      {isChoice && exercise.options && (
        <div
          className={
            largeJpOptions
              ? "grid grid-cols-2 gap-2"
              : "grid gap-2"
          }
        >
          {exercise.options.map((opt) => {
            const isSel = selected === opt.label;
            let styles =
              "border-[var(--line)] bg-[var(--paper)] hover:border-[var(--accent-soft)]";
            if (revealed && opt.label === exercise.correctAnswer) {
              styles =
                "border-[var(--accent)] bg-[var(--accent-wash)] text-[var(--ink)]";
            } else if (revealed && isSel && !wasCorrect) {
              styles = "border-[var(--danger)] bg-[var(--danger-wash)]";
            } else if (isSel) {
              styles = "border-[var(--accent)] bg-[var(--wash)]";
            }
            return (
              <button
                key={opt.id}
                type="button"
                disabled={revealed}
                onClick={() => {
                  setSelected(opt.label);
                  submit(opt.label);
                }}
                className={`w-full rounded-sm border px-4 py-3.5 text-left transition-all ${styles} ${
                  largeJpOptions ? "font-jp text-xl text-center" : "text-[15px]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {exercise.type === "word_ordering" && (
        <div className="space-y-4">
          <div className="flex min-h-[3.5rem] flex-wrap gap-2 rounded-sm border border-dashed border-[var(--line)] bg-[var(--wash)] p-3">
            {ordered.length === 0 && (
              <span className="text-sm text-[var(--muted)]">
                Tap tiles below to build the sentence
              </span>
            )}
            {ordered.map((tok, i) => (
              <button
                key={`${tok}-${i}`}
                type="button"
                disabled={revealed}
                onClick={() => {
                  setOrdered((o) => o.filter((_, idx) => idx !== i));
                  setRemaining((r) => [...r, tok]);
                }}
                className="rounded-sm border border-[var(--accent-soft)] bg-[var(--paper)] px-3 py-2 font-jp text-base"
              >
                {tok}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {remaining.map((tok, i) => (
              <button
                key={`${tok}-r-${i}`}
                type="button"
                disabled={revealed}
                onClick={() => {
                  setRemaining((r) => r.filter((_, idx) => idx !== i));
                  setOrdered((o) => [...o, tok]);
                }}
                className="rounded-sm border border-[var(--line)] bg-[var(--paper)] px-3 py-2 font-jp text-base hover:border-[var(--accent)]"
              >
                {tok}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={ordered.length === 0 || revealed}
            onClick={() => submit(ordered.join(""))}
            className="btn-primary w-full"
          >
            Check
          </button>
        </div>
      )}

      {exercise.type === "matching" && exercise.matchingPairs && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              {exercise.matchingPairs.map((p) => (
                <button
                  key={p.left}
                  type="button"
                  disabled={revealed || Boolean(matches[p.left])}
                  onClick={() => setActiveLeft(p.left)}
                  className={`w-full rounded-sm border px-3 py-2.5 font-jp text-left text-base ${
                    activeLeft === p.left
                      ? "border-[var(--accent)] bg-[var(--accent-wash)]"
                      : matches[p.left]
                        ? "border-[var(--accent-soft)] bg-[var(--wash)] opacity-70"
                        : "border-[var(--line)]"
                  }`}
                >
                  {p.left}
                  {matches[p.left] && (
                    <span className="mt-1 block text-xs text-[var(--muted)] font-sans">
                      → {matches[p.left]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {rightOptions.map((right) => {
                const used = Object.values(matches).includes(right);
                return (
                  <button
                    key={right}
                    type="button"
                    disabled={revealed || used || !activeLeft}
                    onClick={() => {
                      if (!activeLeft) return;
                      setMatches((m) => ({ ...m, [activeLeft]: right }));
                      setActiveLeft(null);
                    }}
                    className={`w-full rounded-sm border px-3 py-2.5 text-left text-sm ${
                      used
                        ? "border-[var(--line)] opacity-40"
                        : "border-[var(--line)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {right}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            disabled={
              revealed ||
              Object.keys(matches).length < (exercise.matchingPairs?.length ?? 0)
            }
            onClick={() => {
              const answer = Object.entries(matches)
                .map(([l, r]) => `${l}=${r}`)
                .sort()
                .join("|");
              submit(answer);
            }}
            className="btn-primary w-full"
          >
            Check matches
          </button>
        </div>
      )}

      {revealed && (
        <div
          className={`animate-fade-up rounded-sm border px-4 py-3 text-sm ${
            wasCorrect
              ? "border-[var(--accent-soft)] bg-[var(--accent-wash)]"
              : "border-[var(--danger)]/30 bg-[var(--danger-wash)]"
          }`}
        >
          <p className="font-medium">
            {wasCorrect ? "Correct" : "Not quite"}
          </p>
          {!wasCorrect && (
            <p className="mt-1 text-[var(--ink-soft)]">
              Answer:{" "}
              <span className="font-jp">{exercise.correctAnswer}</span>
            </p>
          )}
          {exercise.explanation && (
            <p className="mt-2 text-[var(--muted)] leading-relaxed whitespace-pre-line">
              {exercise.explanation}
            </p>
          )}
          {mode === "practice" && !wasCorrect && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              We&apos;ll give you another similar one after this.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
