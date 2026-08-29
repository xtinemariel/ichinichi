"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = "default",
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--overlay)] px-4 pb-6 pt-20 sm:items-center sm:py-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-sm rounded-md border border-[var(--border)] bg-[var(--surface-raised)] p-5"
      >
        <h2
          id="confirm-dialog-title"
          className="font-display text-xl text-[var(--text-primary)]"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-description"
          className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]"
        >
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn-ghost"
            onClick={onCancel}
            autoFocus
          >
            Cancel
          </button>
          <button
            type="button"
            className={
              tone === "danger"
                ? "inline-flex items-center justify-center rounded-md border border-[var(--error)] bg-[var(--error)] px-5 py-3 text-sm font-medium text-[var(--on-primary)] hover:opacity-90"
                : "btn-primary"
            }
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
