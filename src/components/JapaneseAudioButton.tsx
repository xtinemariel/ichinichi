"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  cancelJapaneseSpeech,
  getActiveJapaneseSpeech,
  isJapaneseSpeechSupported,
  speakJapanese,
  subscribeJapaneseSpeech,
} from "@/lib/japaneseSpeech";

type Size = "sm" | "md" | "lg";

interface Props {
  /** Japanese text to speak (kanji/kana surface form, not furigana or English). */
  text: string;
  /** Accessible label; defaults to "Play pronunciation for {text}". */
  ariaLabel?: string;
  size?: Size;
  className?: string;
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-base min-h-9 min-w-9",
  md: "text-lg min-h-11 min-w-11",
  lg: "text-xl min-h-11 min-w-11",
};

export function JapaneseAudioButton({
  text,
  ariaLabel,
  size = "sm",
  className = "",
}: Props) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isJapaneseSpeechSupported());
  }, []);

  const activeText = useSyncExternalStore(
    subscribeJapaneseSpeech,
    getActiveJapaneseSpeech,
    () => null
  );

  const trimmed = text.trim();
  const speaking = activeText === trimmed;

  useEffect(() => {
    return () => {
      if (getActiveJapaneseSpeech() === trimmed) {
        cancelJapaneseSpeech();
      }
    };
  }, [trimmed]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      if (!supported || !trimmed) return;

      if (speaking) {
        cancelJapaneseSpeech();
        return;
      }

      speakJapanese(trimmed);
    },
    [supported, trimmed, speaking]
  );

  if (!supported || !trimmed) return null;

  const label = ariaLabel ?? `Play pronunciation for ${trimmed}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={speaking}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:pointer-events-none disabled:opacity-40 ${
        speaking ? "text-[var(--primary)]" : ""
      } ${SIZE_CLASSES[size]} ${className}`}
    >
      <span aria-hidden="true" className="leading-none select-none">
        {speaking ? "🔉" : "🔊"}
      </span>
    </button>
  );
}
