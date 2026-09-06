import type { VocabStudyCard } from "@/lib/types";

const SESSION_KEY = "ichinichi-vocab-session-v1";

export function saveVocabSession(cards: VocabStudyCard[], title: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ cards, title }));
}

export function loadVocabSession(): {
  cards: VocabStudyCard[];
  title: string;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { cards: VocabStudyCard[]; title: string };
  } catch {
    return null;
  }
}

export function clearVocabSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
