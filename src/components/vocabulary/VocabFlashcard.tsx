"use client";

import { useState } from "react";
import type { VocabularyItem } from "@/lib/types";
import { FuriganaText } from "@/components/FuriganaText";
import { JapaneseAudioButton } from "@/components/JapaneseAudioButton";
import { resolveFuriganaReading } from "@/lib/readings";
import { containsKanji } from "@/lib/furigana";

interface Props {
  word: VocabularyItem;
  saved: boolean;
  onToggleSave: () => void;
  onReveal?: () => void;
  revealed?: boolean;
  showRevealButton?: boolean;
}

export function VocabFlashcard({
  word,
  saved,
  onToggleSave,
  onReveal,
  revealed: controlledRevealed,
  showRevealButton = true,
}: Props) {
  const [localRevealed, setLocalRevealed] = useState(false);
  const revealed = controlledRevealed ?? localRevealed;

  const handleReveal = () => {
    setLocalRevealed(true);
    onReveal?.();
  };

  const showKanaLine =
    containsKanji(word.japanese) && word.kana !== word.japanese;

  return (
    <div className="animate-fade-up">
      <div className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={onToggleSave}
          aria-label={saved ? "Remove from My Vocabulary" : "Save word"}
          className={`absolute right-4 top-4 text-xl transition-colors ${
            saved
              ? "text-[var(--accent-warm)]"
              : "text-[var(--muted)] hover:text-[var(--accent-warm)]"
          }`}
        >
          {saved ? "★" : "☆"}
        </button>

        <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <p className="font-jp text-5xl sm:text-6xl leading-tight text-[var(--ink)]">
              <FuriganaText
                text={word.japanese}
                reading={containsKanji(word.japanese) ? word.kana : undefined}
                className="furi-hero"
              />
            </p>
            <JapaneseAudioButton
              text={word.japanese}
              ariaLabel={`Play pronunciation for ${word.japanese}`}
              size="lg"
              className="self-center"
            />
          </div>
          {showKanaLine && (
            <p className="mt-3 text-sm tracking-wide text-[var(--muted)]">
              {word.kana}
            </p>
          )}
          {!revealed && (
            <p className="mt-8 text-sm text-[var(--ink-soft)]">
              Think of the meaning, then reveal.
            </p>
          )}
        </div>

        {revealed && (
          <div className="animate-fade-up mt-2 space-y-5 border-t border-[var(--border)] pt-6">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
                Meaning
              </p>
              <p className="mt-2 text-xl text-[var(--ink)]">{word.english}</p>
            </div>
            {word.exampleSentence && (
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
                  Example
                </p>
                <div className="mt-2 flex items-start justify-center gap-1">
                  <p className="font-jp text-lg leading-relaxed text-[var(--ink)]">
                    <FuriganaText
                      text={word.exampleSentence}
                      reading={resolveFuriganaReading(
                        word.exampleSentence,
                        word.exampleSentenceReading
                      )}
                    />
                  </p>
                  <JapaneseAudioButton
                    text={word.exampleSentence}
                    ariaLabel="Play pronunciation for example sentence"
                    size="sm"
                    className="mt-0.5"
                  />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {word.exampleTranslation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {!revealed && showRevealButton && (
        <button
          type="button"
          onClick={handleReveal}
          className="btn-primary mt-5 w-full py-4 text-base"
        >
          Reveal
        </button>
      )}
    </div>
  );
}
