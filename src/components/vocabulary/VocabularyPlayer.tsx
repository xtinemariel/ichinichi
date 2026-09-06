"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { VocabRating, VocabStudyCard } from "@/lib/types";
import { getVocabById } from "@/curriculum/vocabulary";
import { useApp } from "@/components/AppProvider";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import { VocabFlashcard } from "@/components/vocabulary/VocabFlashcard";
import { VocabRatingBar } from "@/components/vocabulary/VocabRatingBar";

interface Props {
  cards: VocabStudyCard[];
  title?: string;
  onComplete: () => void;
}

export function VocabularyPlayer({ cards, title = "Vocabulary", onComplete }: Props) {
  const router = useRouter();
  const { recordVocabRating, toggleSavedVocab, isVocabSaved } = useApp();
  const [index, setIndex] = useState(0);
  const [flashRevealed, setFlashRevealed] = useState(false);
  const [awaitingRating, setAwaitingRating] = useState(false);
  const [exerciseAnswered, setExerciseAnswered] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [finished, setFinished] = useState(false);

  const card = cards[index];
  const word = card ? getVocabById(card.vocabId) : undefined;
  const progressLabel = `${Math.min(index + 1, cards.length)} / ${cards.length}`;

  const isFlashcard = card?.kind === "flashcard";

  const handleRate = useCallback(
    (rating: VocabRating) => {
      if (!card) return;
      recordVocabRating(
        card.vocabId,
        rating,
        card.exercise?.isProduction ?? false
      );
      setFlashRevealed(false);
      setAwaitingRating(false);
      setExerciseAnswered(false);

      if (index >= cards.length - 1) {
        setFinished(true);
        return;
      }
      setIndex((i) => i + 1);
    },
    [card, cards.length, index, recordVocabRating]
  );

  const handleExerciseResult = useCallback(() => {
    setExerciseAnswered(true);
    setAwaitingRating(true);
  }, []);

  const saved = word ? isVocabSaved(word.id) : false;

  const completionMessage = useMemo(() => {
    if (cards.length === 0) return "No words in this session.";
    return `You reviewed ${cards.length} word${cards.length === 1 ? "" : "s"}.`;
  }, [cards.length]);

  if (finished || !card || !word) {
    return (
      <div className="mx-auto max-w-lg px-5 pb-28 pt-10">
        <div className="animate-fade-up rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
          <p className="font-display text-2xl text-[var(--ink)]">
            {cards.length === 0 ? "Nothing to practice" : "Session complete"}
          </p>
          <p className="mt-3 text-[var(--ink-soft)]">{completionMessage}</p>
          <button
            type="button"
            onClick={onComplete}
            className="btn-primary mt-8 w-full"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 pb-28 pt-6">
      <header className="mb-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowExit(true)}
          className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          Exit
        </button>
        <div className="text-center">
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
            {title}
          </p>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{progressLabel}</p>
        </div>
        <div className="w-10" />
      </header>

      <div className="mb-4 h-1 overflow-hidden rounded-full bg-[var(--progress-track)]">
        <div
          className="h-full rounded-full bg-[var(--progress-fill)] transition-all duration-300"
          style={{ width: `${((index + (awaitingRating ? 1 : 0)) / cards.length) * 100}%` }}
        />
      </div>

      {isFlashcard ? (
        <>
          <VocabFlashcard
            word={word}
            saved={saved}
            onToggleSave={() => toggleSavedVocab(word.id)}
            revealed={flashRevealed}
            onReveal={() => {
              setFlashRevealed(true);
              setAwaitingRating(true);
            }}
            showRevealButton={!flashRevealed}
          />
          {awaitingRating && flashRevealed && (
            <div className="mt-6">
              <VocabRatingBar onRate={handleRate} />
            </div>
          )}
        </>
      ) : (
        <>
          {card.exercise && !exerciseAnswered && (
            <ExerciseRenderer
              exercise={card.exercise}
              mode="practice"
              onResult={() => handleExerciseResult()}
            />
          )}
          {card.exercise && exerciseAnswered && awaitingRating && (
            <div className="mt-6 space-y-4">
              <VocabFlashcard
                word={word}
                saved={saved}
                onToggleSave={() => toggleSavedVocab(word.id)}
                revealed
                showRevealButton={false}
              />
              <VocabRatingBar onRate={handleRate} />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={showExit}
        title="Leave practice?"
        description="Your progress on completed cards is saved. Remaining cards will wait for next time."
        confirmLabel="Leave"
        onConfirm={() => {
          setShowExit(false);
          router.push("/vocabulary");
        }}
        onCancel={() => setShowExit(false)}
      />
    </div>
  );
}
