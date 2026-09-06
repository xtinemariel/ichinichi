interface Props {
  title: string;
  body: string;
  variant?: "tip" | "remember" | "warn";
}

export function ReferenceCallout({ title, body, variant = "tip" }: Props) {
  const styles =
    variant === "warn"
      ? "border-[var(--error)]/25 bg-[var(--error-soft)]"
      : variant === "remember"
        ? "border-[var(--accent-warm)]/25 bg-[var(--accent-warm-soft)]"
        : "border-[var(--accent-soft)]/40 bg-[var(--primary-soft)]/60";

  return (
    <div className={`rounded-md border px-4 py-3 ${styles}`}>
      <p className="text-xs tracking-[0.12em] uppercase text-[var(--muted)]">{title}</p>
      <p className="mt-1.5 text-sm text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">
        {body}
      </p>
    </div>
  );
}
