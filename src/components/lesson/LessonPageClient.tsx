"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { CompletionScreen } from "@/components/lesson/CompletionScreen";
import { SaveProgressPrompt } from "@/components/auth/SaveProgressPrompt";
import { recommendLesson } from "@/engine/recommend";

export function LessonPageClient() {
  const router = useRouter();
  const {
    activeLesson,
    lastCompletion,
    completeLesson,
    clearCompletion,
    startLesson,
    discardLesson,
    state,
    showSavePrompt,
    dismissSavePrompt,
    isGuest,
  } = useApp();

  if (lastCompletion) {
    return (
      <CompletionScreen
        record={lastCompletion.record}
        struggledLabels={lastCompletion.struggledLabels}
        lessonNotes={lastCompletion.notes}
        onDone={() => {
          clearCompletion();
          if (isGuest && showSavePrompt) {
            // Keep prompt flag; home/lesson will show it via dedicated gate
            router.push("/?save=1");
            return;
          }
          router.push("/");
        }}
        onAnother={(mode) => {
          clearCompletion();
          const rec = recommendLesson(state, mode);
          startLesson(rec.lesson);
        }}
      />
    );
  }

  if (isGuest && showSavePrompt && !activeLesson) {
    return (
      <SaveProgressPrompt
        onLater={() => {
          dismissSavePrompt();
          router.push("/");
        }}
      />
    );
  }

  if (!activeLesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
        <p className="text-[var(--muted)]">No lesson in progress.</p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            startLesson();
          }}
        >
          Start today’s lesson
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

  return (
    <LessonPlayer
      lesson={activeLesson}
      onComplete={(result) => completeLesson(result, activeLesson)}
      onExit={() => {
        if (
          confirm(
            "Leave this lesson? Progress in this session won’t be saved."
          )
        ) {
          discardLesson();
          router.push("/");
        }
      }}
    />
  );
}
