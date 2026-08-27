import type { UserState } from "@/lib/types";
import {
  createDefaultUserState,
  loadUserState,
  saveUserState,
} from "@/lib/storage";
import { getInsforge } from "@/lib/insforge";
import { repairCurriculumState } from "@/engine/recommend";

export type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
};

function normalizeState(raw: unknown, userId: string): UserState {
  const base = createDefaultUserState();
  if (!raw || typeof raw !== "object") {
    return { ...base, userId };
  }
  const parsed = raw as Partial<UserState>;
  return repairCurriculumState({
    ...base,
    ...parsed,
    userId,
    preferences: {
      ...base.preferences,
      ...(parsed.preferences ?? {}),
    },
    progress: parsed.progress ?? {},
    conceptStatus: parsed.conceptStatus ?? {},
    completedLessons: parsed.completedLessons ?? [],
    knowledgeChecks: parsed.knowledgeChecks ?? [],
    recentLessonConceptIds: parsed.recentLessonConceptIds ?? [],
  });
}

function guestHasProgress(state: UserState): boolean {
  return (
    state.lessonsCompleted > 0 ||
    state.completedLessons.length > 0 ||
    state.knowledgeChecks.length > 0 ||
    Object.keys(state.progress).length > 0 ||
    Object.keys(state.conceptStatus).length > 0
  );
}

function displayName(user: {
  email?: string | null;
  profile?: { name?: string | null } | null;
}): string | null {
  return user.profile?.name ?? user.email ?? null;
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const insforge = getInsforge();
  if (!insforge) return null;
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) return null;
  return {
    id: data.user.id,
    email: data.user.email,
    name: displayName(data.user),
  };
}

export async function fetchCloudProgress(
  userId: string
): Promise<UserState | null> {
  const insforge = getInsforge();
  if (!insforge) return null;
  const { data, error } = await insforge.database
    .from("user_progress")
    .select("state")
    .eq("user_id", userId)
    .limit(1);
  if (error || !data || data.length === 0) return null;
  const row = data[0] as { state?: unknown };
  return normalizeState(row.state, userId);
}

export async function upsertCloudProgress(state: UserState): Promise<void> {
  const insforge = getInsforge();
  if (!insforge || !state.userId || state.userId === "local-user") return;

  const existing = await insforge.database
    .from("user_progress")
    .select("user_id")
    .eq("user_id", state.userId)
    .limit(1);

  if (existing.error) {
    console.error("Failed to read progress:", existing.error.message);
    return;
  }

  if (existing.data && existing.data.length > 0) {
    const { error } = await insforge.database
      .from("user_progress")
      .update({ state })
      .eq("user_id", state.userId);
    if (error) console.error("Failed to update progress:", error.message);
    return;
  }

  const { error } = await insforge.database
    .from("user_progress")
    .insert([{ user_id: state.userId, state }]);
  if (error) console.error("Failed to insert progress:", error.message);
}

/**
 * After login/signup: prefer existing cloud progress; otherwise migrate guest.
 */
export async function loadOrMigrateProgress(
  user: AuthUser
): Promise<UserState> {
  const guest = loadUserState();
  const cloud = await fetchCloudProgress(user.id);

  if (cloud) {
    const next = { ...cloud, userId: user.id };
    saveUserState(next);
    return next;
  }

  const migrated = {
    ...guest,
    userId: user.id,
  };
  saveUserState(migrated);
  if (guestHasProgress(guest)) {
    await upsertCloudProgress(migrated);
  } else {
    await upsertCloudProgress(migrated);
  }
  return migrated;
}

export async function persistProgress(state: UserState): Promise<void> {
  saveUserState(state);
  if (state.userId && state.userId !== "local-user") {
    await upsertCloudProgress(state);
  }
}

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<
  | { user: AuthUser; needsVerification: false }
  | { email: string; needsVerification: true }
> {
  const insforge = getInsforge();
  if (!insforge) throw new Error("InsForge is not configured");

  const { data, error } = await insforge.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  if (data?.requireEmailVerification) {
    return { email, needsVerification: true };
  }

  const user = data?.user;
  if (!user?.id) throw new Error("Sign up succeeded but no user returned");
  return {
    user: {
      id: user.id,
      email: user.email,
      name: displayName(user),
    },
    needsVerification: false,
  };
}

export async function verifySignupEmail(
  email: string,
  otp: string
): Promise<AuthUser> {
  const insforge = getInsforge();
  if (!insforge) throw new Error("InsForge is not configured");

  const { data, error } = await insforge.auth.verifyEmail({ email, otp });
  if (error) throw new Error(error.message);

  const user = data?.user;
  if (user?.id) {
    return {
      id: user.id,
      email: user.email,
      name: displayName(user),
    };
  }

  const current = await getCurrentAuthUser();
  if (current) return current;
  throw new Error("Email verified, but session was not created. Please log in.");
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const insforge = getInsforge();
  if (!insforge) throw new Error("InsForge is not configured");

  const { data, error } = await insforge.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  const user = data?.user;
  if (!user?.id) throw new Error("Sign in succeeded but no user returned");
  return {
    id: user.id,
    email: user.email,
    name: displayName(user),
  };
}

export async function signOutAuth(): Promise<void> {
  const insforge = getInsforge();
  if (!insforge) return;
  await insforge.auth.signOut();
}
