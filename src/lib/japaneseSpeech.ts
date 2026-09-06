/**
 * Lightweight Japanese TTS via the Web Speech API.
 * Safe to import in client components; no-ops when unavailable (SSR, unsupported browsers).
 */

const JAPANESE_LANG = "ja-JP";

export type JapaneseSpeechCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
};

let activeText: string | null = null;
let speechGeneration = 0;
const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((fn) => fn());
}

function setActiveText(text: string | null) {
  activeText = text;
  notifySubscribers();
}

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  if (!("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

export function isJapaneseSpeechSupported(): boolean {
  return getSynth() !== null;
}

export function getActiveJapaneseSpeech(): string | null {
  return activeText;
}

export function subscribeJapaneseSpeech(callback: () => void): () => void {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function findJapaneseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  return (
    voices.find((v) => v.lang === "ja-JP") ??
    voices.find((v) => v.lang.startsWith("ja-JP")) ??
    voices.find((v) => v.lang.startsWith("ja"))
  );
}

function loadVoices(synth: SpeechSynthesis): SpeechSynthesisVoice[] {
  const voices = synth.getVoices();
  if (voices.length > 0) return voices;

  // Trigger lazy voice loading (required on some mobile browsers).
  synth.getVoices();
  return synth.getVoices();
}

export function cancelJapaneseSpeech(): void {
  const synth = getSynth();
  if (!synth) return;
  speechGeneration += 1;
  synth.cancel();
  setActiveText(null);
}

/**
 * Speak Japanese text. Cancels any in-progress speech first.
 * Returns false when TTS is unavailable or text is empty.
 */
export function speakJapanese(
  text: string,
  callbacks?: JapaneseSpeechCallbacks
): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  const synth = getSynth();
  if (!synth) return false;

  cancelJapaneseSpeech();
  const generation = speechGeneration;

  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = JAPANESE_LANG;

  const voice = findJapaneseVoice(loadVoices(synth));
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    if (generation !== speechGeneration) return;
    setActiveText(trimmed);
    callbacks?.onStart?.();
  };

  const finish = (cb?: () => void) => {
    if (generation !== speechGeneration) return;
    setActiveText(null);
    cb?.();
  };

  utterance.onend = () => finish(callbacks?.onEnd);
  utterance.onerror = () => finish(callbacks?.onError);

  try {
    synth.speak(utterance);
    // Safari sometimes leaves synthesis paused until resumed.
    if (synth.paused) {
      synth.resume();
    }
    return true;
  } catch {
    setActiveText(null);
    return false;
  }
}
