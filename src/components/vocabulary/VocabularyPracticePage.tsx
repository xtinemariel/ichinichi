"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearVocabSession,
  loadVocabSession,
} from "@/lib/vocabSession";
import { VocabularyPlayer } from "@/components/vocabulary/VocabularyPlayer";
import type { VocabStudyCard } from "@/lib/types";

export function VocabularyPracticePage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    cards: VocabStudyCard[];
    title: string;
  } | null>(null);

  useEffect(() => {
    const loaded = loadVocabSession();
    if (!loaded || loaded.cards.length === 0) {
      router.replace("/vocabulary");
      return;
    }
    setSession(loaded);
  }, [router]);

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[var(--muted)]">
        Loading practice…
      </div>
    );
  }

  return (
    <VocabularyPlayer
      cards={session.cards}
      title={session.title}
      onComplete={() => {
        clearVocabSession();
        router.push("/vocabulary");
      }}
    />
  );
}
