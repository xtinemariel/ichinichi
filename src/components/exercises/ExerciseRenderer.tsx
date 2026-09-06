"use client";

import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/types";
import { checkAnswer } from "@/lessons/generator";
import { FuriganaText } from "@/components/FuriganaText";
import { JapaneseWithAudio } from "@/components/JapaneseWithAudio";
import { resolveFuriganaReading } from "@/lib/readings";
import { useApp } from "@/components/AppProvider";

interface Props {
  exercise: Exercise;
  mode: "practice" | "assessment";
  onResult: (correct: boolean, userAnswer: string) => void;
  allowRetry?: boolean;
}

export function ExerciseRenderer({
  exercise,
  mode,
  onResult,
  allowRetry = false,
}: Props) {
  const { toggleSavedVocab, isVocabSaved } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [ordered, setOrdered] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>(exercise.tokens ?? []);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);

  const rightOptions = useMemo(() => {
    if (!exercise.matchingPairs) return [];
    return shuffle(exercise.matchingPairs.map((p) => p.right));
  }, [exercise.matchingPairs]);

  const submit = (answer: string) => {
    if (revealed) return;
    const correct = checkAnswer(exercise, answer);
    setWasCorrect(correct);
    setSubmittedAnswer(answer);
    setRevealed(true);
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

  const vocabId =
    exercise.contentType === "vocabulary" ? exercise.contentId : undefined;
  const vocabSaved = vocabId ? isVocabSaved(vocabId) : false;

  const showPromptAudio =
    Boolean(exercise.promptJapanese) &&
    !["jp_to_en", "kana_recognition", "kana_select", "reading"].includes(
      exercise.type
    );

  return (
    <div className="animate-fade-up space-y-6">
      {exercise.passage && (
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-5">
          <JapaneseWithAudio
            text={exercise.passage}
            ariaLabel="Play pronunciation for reading passage"
          >
            <p className="font-jp text-lg leading-relaxed text-[var(--ink)]">
              <FuriganaText
                text={exercise.passage}
                reading={resolveFuriganaReading(
                  exercise.passage,
                  exercise.passageReading
                )}
              />
            </p>
          </JapaneseWithAudio>
        </div>
      )}

      <div className="space-y-3">
        {exercise.promptJapanese && (
          showPromptAudio ? (
            <JapaneseWithAudio
              text={exercise.promptJapanese}
              ariaLabel={`Play pronunciation for ${exercise.promptJapanese}`}
              size="lg"
              align="center"
              className="justify-center"
            >
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
            </JapaneseWithAudio>
          ) : (
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
          )
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
              "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent-soft)] hover:bg-[var(--surface-raised)]";
            if (revealed && opt.label === exercise.correctAnswer) {
              styles =
                "border-[var(--success)] bg-[var(--success-soft)] text-[var(--text-primary)]";
            } else if (revealed && isSel && !wasCorrect) {
              styles = "border-[var(--error)] bg-[var(--error-soft)]";
            } else if (isSel) {
              styles =
                "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text-primary)]";
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
                className={`w-full rounded-md border px-4 py-3.5 text-left transition-all ${styles} ${
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
          <div className="flex min-h-[3.5rem] flex-wrap gap-2 rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-3">
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
                className="rounded-md border border-[var(--accent-soft)] bg-[var(--primary-soft)] px-3 py-2 font-jp text-base"
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
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-jp text-base hover:border-[var(--primary)] hover:bg-[var(--surface-raised)]"
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
                  className={`w-full rounded-md border px-3 py-2.5 font-jp text-left text-base ${
                    activeLeft === p.left
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : matches[p.left]
                        ? "border-[var(--accent-soft)] bg-[var(--surface-subtle)] opacity-70"
                        : "border-[var(--border)] bg-[var(--surface)]"
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
                    className={`w-full rounded-md border px-3 py-2.5 text-left text-sm ${
                      used
                        ? "border-[var(--border)] opacity-40"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]"
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
          className={`animate-fade-up rounded-md border px-4 py-3 text-sm ${
            wasCorrect
              ? "border-[var(--success)]/40 bg-[var(--success-soft)]"
              : "border-[var(--error)]/40 bg-[var(--error-soft)]"
          }`}
        >
          <p className="font-medium">
            {wasCorrect ? "✓ Correct" : "✕ Not quite"}
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
          {vocabId && (
            <button
              type="button"
              onClick={() => toggleSavedVocab(vocabId)}
              className={`mt-3 text-sm ${
                vocabSaved
                  ? "text-[var(--accent-warm)]"
                  : "text-[var(--muted)] hover:text-[var(--accent-warm)]"
              }`}
            >
              {vocabSaved ? "★ Saved to My Vocabulary" : "☆ Save to My Vocabulary"}
            </button>
          )}
          {mode === "practice" && allowRetry && !wasCorrect && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              We&apos;ll give you another similar one after this.
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              if (wasCorrect === null || submittedAnswer === null) return;
              onResult(wasCorrect, submittedAnswer);
            }}
            className="btn-primary mt-3 w-full"
          >
            Continue
          </button>
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
