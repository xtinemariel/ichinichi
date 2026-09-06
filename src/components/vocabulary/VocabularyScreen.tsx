"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import {
  buildVocabSession,
  getVocabSessionSummary,
  getVocabStudyStatus,
  getVocabThemes,
  labelForVocabStatus,
  VOCAB_THEME_LABELS,
  type VocabSessionMode,
} from "@/engine/vocabulary";
import {
  getVocabById,
  getVocabByIds,
  getVocabByTheme,
} from "@/curriculum/vocabulary";
import { FuriganaText } from "@/components/FuriganaText";
import { containsKanji } from "@/lib/furigana";
import type { UserState } from "@/lib/types";
import { saveVocabSession } from "@/lib/vocabSession";

type View = "home" | "browse" | "saved" | "theme";

export function VocabularyScreen() {
  const router = useRouter();
  const { state, toggleSavedVocab, isVocabSaved } = useApp();
  const [view, setView] = useState<View>("home");
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const summary = useMemo(() => getVocabSessionSummary(state), [state]);
  const themes = useMemo(() => getVocabThemes(), []);

  const startSession = (mode: VocabSessionMode, theme?: string) => {
    const cards = buildVocabSession(state, { mode, theme });
    if (cards.length === 0) return;
    const title =
      mode === "theme" && theme
        ? (VOCAB_THEME_LABELS[theme] ?? "Vocabulary")
        : mode === "saved"
          ? "My Vocabulary"
          : mode === "new"
            ? "New Words"
            : "Today's Practice";
    saveVocabSession(cards, title);
    router.push("/vocabulary/practice");
  };

  if (view === "saved") {
    return (
      <VocabShell title="My Vocabulary" onBack={() => setView("home")}>
        {state.savedVocabularyIds.length === 0 ? (
          <EmptyCard message="Save words with ☆ during practice to build your personal word bank." />
        ) : (
          <>
            <button
              type="button"
              onClick={() => startSession("saved")}
              className="btn-primary mb-5 w-full"
            >
              Practice saved words
            </button>
            <WordList
              words={getVocabByIds(state.savedVocabularyIds)}
              state={state}
              onToggleSave={toggleSavedVocab}
              isSaved={isVocabSaved}
            />
          </>
        )}
      </VocabShell>
    );
  }

  if (view === "browse") {
    return (
      <VocabShell title="Categories" onBack={() => setView("home")}>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.theme}
              type="button"
              onClick={() => {
                setActiveTheme(theme.theme);
                setView("theme");
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-left transition-colors hover:border-[var(--primary)]/40"
            >
              <p className="text-sm font-medium text-[var(--ink)]">
                {theme.label}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {theme.count} words
              </p>
            </button>
          ))}
        </div>
      </VocabShell>
    );
  }

  if (view === "theme" && activeTheme) {
    const label = VOCAB_THEME_LABELS[activeTheme] ?? activeTheme;
    return (
      <VocabShell
        title={label}
        onBack={() => {
          setActiveTheme(null);
          setView("browse");
        }}
      >
        <button
          type="button"
          onClick={() => startSession("theme", activeTheme)}
          className="btn-primary mb-5 w-full"
        >
          Practice {label.toLowerCase()}
        </button>
        <WordList
          words={getVocabByTheme(activeTheme)}
          state={state}
          onToggleSave={toggleSavedVocab}
          isSaved={isVocabSaved}
        />
      </VocabShell>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 pb-28 pt-10">
      <header className="animate-fade-up">
        <p className="font-display text-sm tracking-[0.25em] text-[var(--accent)]">
          語彙
        </p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">
          Vocabulary
        </h1>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          Build your N5 word foundation with flashcards and spaced review.
        </p>
      </header>

      <section className="animate-fade-up mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
          Today&apos;s Practice
        </p>
        {summary.caughtUp ? (
          <>
            <p className="mt-3 text-xl text-[var(--ink)]">
              You&apos;re all caught up!
            </p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {summary.newCount > 0
                ? `${summary.newCount} new words available when you want to learn more.`
                : `${summary.masteredCount} words mastered so far.`}
            </p>
            {summary.newCount > 0 && (
              <button
                type="button"
                onClick={() => startSession("new")}
                className="btn-primary mt-5 w-full"
              >
                Learn new words
              </button>
            )}
          </>
        ) : (
          <>
            <p className="mt-3 text-xl text-[var(--ink)]">
              {summary.readyCount} words ready
            </p>
            <div className="mt-4 flex gap-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">New</p>
                <p className="text-lg text-[var(--ink)]">
                  {Math.min(5, summary.newCount)}
                </p>
              </div>
              <div>
                <p className="text-[var(--muted)]">Review</p>
                <p className="text-lg text-[var(--ink)]">{summary.reviewCount}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => startSession("practice")}
              className="btn-primary mt-5 w-full"
            >
              Start practice
            </button>
          </>
        )}
      </section>

      <section className="animate-fade-up mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setView("browse")}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-4 text-left"
        >
          <p className="text-sm font-medium text-[var(--ink)]">Categories</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {summary.totalWords} N5-oriented words
          </p>
        </button>
        <button
          type="button"
          onClick={() => setView("saved")}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-4 text-left"
        >
          <p className="text-sm font-medium text-[var(--ink)]">My Vocabulary</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {summary.savedCount} saved
          </p>
        </button>
      </section>

      <p className="animate-fade-up mt-6 text-xs leading-relaxed text-[var(--muted)]">
        A curated beginner set based on common N5 study vocabulary — not an
        official JLPT word list.
      </p>
    </div>
  );
}

function VocabShell({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg px-5 pb-28 pt-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        ← Back
      </button>
      <h1 className="font-display text-2xl text-[var(--ink)]">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-8 text-center text-sm text-[var(--ink-soft)]">
      {message}
    </div>
  );
}

function WordList({
  words,
  state,
  onToggleSave,
  isSaved,
}: {
  words: NonNullable<ReturnType<typeof getVocabById>>[];
  state: UserState;
  onToggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
}) {
  return (
    <ul className="space-y-2">
      {words.map((word) => {
        const status = getVocabStudyStatus(state.progress[word.id]);
        return (
          <li
            key={word.id}
            className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-jp text-lg text-[var(--ink)]">
                <FuriganaText
                  text={word.japanese}
                  reading={containsKanji(word.japanese) ? word.kana : undefined}
                />
              </p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{word.english}</p>
              <p className="mt-1 text-[10px] tracking-wide uppercase text-[var(--muted)]">
                {labelForVocabStatus(status)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleSave(word.id)}
              aria-label={isSaved(word.id) ? "Unsave" : "Save"}
              className={`shrink-0 text-lg ${
                isSaved(word.id)
                  ? "text-[var(--accent-warm)]"
                  : "text-[var(--muted)]"
              }`}
            >
              {isSaved(word.id) ? "★" : "☆"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
