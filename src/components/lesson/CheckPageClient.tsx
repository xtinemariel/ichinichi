"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { KnowledgeCheckPlayer } from "@/components/lesson/KnowledgeCheckPlayer";
import { KnowledgeCheckResult } from "@/components/lesson/KnowledgeCheckResult";
import { generateLesson } from "@/lessons/generator";

export function CheckPageClient() {
  const router = useRouter();
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
      <KnowledgeCheckPlayer
        check={knowledgeCheck.check}
        onComplete={completeKnowledgeCheck}
        onExit={() => {
          if (confirm("Leave this knowledge check?")) {
            clearKnowledgeCheck();
            router.push("/");
          }
        }}
      />
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
