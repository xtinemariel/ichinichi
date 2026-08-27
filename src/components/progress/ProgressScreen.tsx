"use client";

import { useApp } from "@/components/AppProvider";
import { formatMinutes } from "@/lib/dates";

export function ProgressScreen() {
  const {
    state,
    categoryProgress,
    weakAreas,
    strongAreas,
    setDailyGoal,
    resetProgress,
    lessonsToday,
  } = useApp();

  return (
    <div className="mx-auto max-w-lg px-5 pb-28 pt-10 animate-fade-up">
      <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
        Progress
      </p>
      <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Your N5 journey
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <Stat label="Overall" value={`${categoryProgress.overall}%`} />
        <Stat label="Streak" value={`${state.streak} day${state.streak === 1 ? "" : "s"}`} />
        <Stat label="Lessons" value={`${state.lessonsCompleted}`} />
        <Stat label="Study time" value={formatMinutes(state.totalStudyMinutes)} />
      </div>

      <section className="mt-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
          By skill
        </p>
        <div className="mt-4 space-y-3">
          {(
            [
              ["Vocabulary", categoryProgress.vocabulary],
              ["Grammar", categoryProgress.grammar],
              ["Kana", categoryProgress.kana],
              ["Kanji", categoryProgress.kanji],
              ["Reading", categoryProgress.reading],
              ["Listening", categoryProgress.listening],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{label}</span>
                <span className="tabular-nums text-[var(--muted)]">{value}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {weakAreas.length > 0 && (
        <section className="mt-12">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            You should review
          </p>
          <ol className="mt-4 space-y-2">
            {weakAreas.map((area, i) => (
              <li key={area} className="flex gap-3 text-sm text-[var(--ink-soft)]">
                <span className="text-[var(--muted)]">{i + 1}.</span>
                {area}
              </li>
            ))}
          </ol>
        </section>
      )}

      {strongAreas.length > 0 && (
        <section className="mt-12">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            You&apos;re strong at
          </p>
          <ul className="mt-4 space-y-2">
            {strongAreas.map((area) => (
              <li key={area} className="text-sm text-[var(--ink-soft)]">
                <span className="mr-2 text-[var(--accent)]">✓</span>
                {area}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12 border-t border-[var(--line)] pt-8">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
          Daily goal
        </p>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Today: {lessonsToday} / {state.preferences.dailyGoalLessons} lessons
        </p>
        <div className="mt-4 flex gap-2">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setDailyGoal(n)}
              className={`flex-1 rounded-sm border py-3 text-sm transition-colors ${
                state.preferences.dailyGoalLessons === n
                  ? "border-[var(--accent)] bg-[var(--accent-wash)] text-[var(--ink)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent-soft)]"
              }`}
            >
              {n * 20} min
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          if (
            confirm(
              "Reset all progress? This cannot be undone."
            )
          ) {
            resetProgress();
          }
        }}
        className="mt-16 w-full py-3 text-xs text-[var(--muted)] hover:text-[var(--danger)]"
      >
        Reset progress
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--line)] bg-[var(--wash)] px-4 py-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-display text-2xl text-[var(--ink)]">{value}</p>
    </div>
  );
}
