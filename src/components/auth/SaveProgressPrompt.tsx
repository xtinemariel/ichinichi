"use client";

import { useRouter } from "next/navigation";

interface Props {
  onLater: () => void;
}

export function SaveProgressPrompt({ onLater }: Props) {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10 animate-fade-up">
      <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
        Lesson complete
      </p>
      <h1 className="mt-4 font-display text-3xl text-[var(--ink)] leading-tight">
        Want to save your progress?
      </h1>
      <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">
        Create a free account and pick up where you left off on any device.
      </p>
      <div className="mt-auto space-y-3">
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => router.push("/auth")}
        >
          Create Account
        </button>
        <button type="button" className="btn-ghost w-full" onClick={onLater}>
          Maybe Later
        </button>
      </div>
    </div>
  );
}
