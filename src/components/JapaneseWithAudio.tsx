"use client";

import { JapaneseAudioButton } from "@/components/JapaneseAudioButton";

type Size = "sm" | "md" | "lg";

interface Props {
  /** Japanese surface text passed to TTS (not furigana or English). */
  text: string;
  ariaLabel?: string;
  size?: Size;
  align?: "start" | "center";
  className?: string;
  children: React.ReactNode;
}

export function JapaneseWithAudio({
  text,
  ariaLabel,
  size = "sm",
  align = "start",
  className = "",
  children,
}: Props) {
  const alignClass =
    align === "center" ? "items-center justify-center" : "items-start";

  return (
    <div className={`flex gap-1 ${alignClass} ${className}`}>
      <div className="min-w-0">{children}</div>
      <JapaneseAudioButton
        text={text}
        ariaLabel={ariaLabel}
        size={size}
        className={`shrink-0 ${align === "start" ? "mt-0.5" : "self-center"}`}
      />
    </div>
  );
}
