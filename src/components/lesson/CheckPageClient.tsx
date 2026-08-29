"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { KnowledgeCheckPlayer } from "@/components/lesson/KnowledgeCheckPlayer";
import { KnowledgeCheckResult } from "@/components/lesson/KnowledgeCheckResult";
import { generateLesson } from "@/lessons/generator";

export function CheckPageClient() {
  const router = useRouter();
  const [confirmingExit, setConfirmingExit] = useState(false);
  const {
    state,
    knowledgeCheck,
    startKnowledgeCheck,
    completeKnowledgeCheck,
    clearKnowledgeCheck,
    continueAfterPass,
    continueAnyway,
    startQuickReview,
    startLesson,
  } = useApp();

  if (knowledgeCheck?.result) {
    return (
      <KnowledgeCheckResult
        title={knowledgeCheck.check.title}
        score={knowledgeCheck.result.score}
        total={knowledgeCheck.result.total}
        outcome={knowledgeCheck.result.outcome}
        missedContentIds={knowledgeCheck.result.missedContentIds}
        onPassContinue={() => {
          continueAfterPass();
          router.push("/");
        }}
        onQuickReview={() => {
          startQuickReview();
          router.push("/lesson");
        }}
        onContinueAnyway={() => {
          continueAnyway();
          router.push("/");
        }}
        onStartLesson={() => {
          const conceptId = knowledgeCheck.check.conceptId;
          const lesson = generateLesson(conceptId, state);
          clearKnowledgeCheck();
          startLesson(lesson);
          router.push("/lesson");
        }}
      />
    );
  }

  if (knowledgeCheck?.check) {
    return (
      <>
        <KnowledgeCheckPlayer
          check={knowledgeCheck.check}
          onComplete={completeKnowledgeCheck}
          onExit={() => setConfirmingExit(true)}
        />
        <ConfirmDialog
          open={confirmingExit}
          title="Leave this knowledge check?"
          description="Your answers in this check won’t be saved."
          confirmLabel="Leave check"
          tone="danger"
          onCancel={() => setConfirmingExit(false)}
          onConfirm={() => {
            setConfirmingExit(false);
            clearKnowledgeCheck();
            router.push("/");
          }}
        />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
      <p className="text-[var(--muted)]">No knowledge check in progress.</p>
      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          startKnowledgeCheck();
        }}
      >
        Check my knowledge
      </button>
      <button
        type="button"
        className="text-sm text-[var(--muted)]"
        onClick={() => router.push("/")}
      >
        Back home
      </button>
    </div>
  );
}
