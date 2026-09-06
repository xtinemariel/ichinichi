"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthScreen } from "@/components/auth/AuthScreen";

function AuthPageInner() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "login" ? "login" : "signup";
  return <AuthScreen key={mode} initialMode={mode} />;
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <AuthPageInner />
    </Suspense>
  );
}
