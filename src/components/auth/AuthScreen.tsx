"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";

type Mode = "signup" | "login" | "verify";

export function AuthScreen({
  initialMode = "signup",
}: {
  initialMode?: "signup" | "login";
}) {
  const router = useRouter();
  const { signUp, signIn, verifyEmail, authConfigured } = useApp();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  if (!authConfigured) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10">
        <h1 className="font-display text-3xl text-[var(--ink)]">
          Save your progress
        </h1>
        <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
          InsForge is not configured yet. Add{" "}
          <code className="text-sm">NEXT_PUBLIC_INSFORGE_URL</code> and{" "}
          <code className="text-sm">NEXT_PUBLIC_INSFORGE_ANON_KEY</code> to{" "}
          <code className="text-sm">.env.local</code>.
        </p>
        <button
          type="button"
          className="btn-primary mt-8"
          onClick={() => router.push("/")}
        >
          Continue as Guest
        </button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "verify") {
        await verifyEmail(email.trim(), otp.trim());
        router.push("/");
        return;
      }
      if (mode === "signup") {
        const result = await signUp(email.trim(), password);
        if (result === "needs_verification") {
          setMode("verify");
          setInfo("Enter the 6-digit code we sent to your email.");
          return;
        }
        router.push("/");
        return;
      }
      await signIn(email.trim(), password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10">
      <p className="font-display text-sm tracking-[0.25em] text-[var(--accent)]">
        一日
      </p>
      <h1 className="mt-4 font-display text-3xl text-[var(--ink)] leading-tight">
        {mode === "login"
          ? "Log in"
          : mode === "verify"
            ? "Verify your email"
            : "Save your progress"}
      </h1>
      <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">
        {mode === "verify"
          ? "We sent a verification code to your email."
          : "Create an account to save your Japanese learning progress."}
      </p>

      <form onSubmit={submit} className="mt-10 space-y-4">
        <label className="block">
          <span className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mode === "verify"}
            className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-3 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
          />
        </label>

        {mode !== "verify" ? (
          <label className="block">
            <span className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-3 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            />
          </label>
        ) : (
          <label className="block">
            <span className="text-xs tracking-[0.15em] uppercase text-[var(--muted)]">
              Verification code
            </span>
            <input
              type="text"
              inputMode="numeric"
              required
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-2 w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-3 text-[var(--ink)] outline-none focus:border-[var(--accent)] tracking-[0.3em]"
              placeholder="000000"
            />
          </label>
        )}

        {info && (
          <p className="text-sm text-[var(--info)] leading-relaxed">{info}</p>
        )}
        {error && (
          <p className="text-sm text-[var(--danger)] leading-relaxed">{error}</p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy
            ? "Please wait…"
            : mode === "login"
              ? "Log In"
              : mode === "verify"
                ? "Verify & continue"
                : "Create Account"}
        </button>
      </form>

      <div className="mt-8 space-y-3 text-center text-sm">
        {mode === "signup" && (
          <button
            type="button"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
          >
            Already have an account? Log In
          </button>
        )}
        {mode === "login" && (
          <button
            type="button"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
          >
            Need an account? Create Account
          </button>
        )}
        <div>
          <button
            type="button"
            className="text-[var(--muted)] hover:text-[var(--ink-soft)]"
            onClick={() => router.push("/")}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
