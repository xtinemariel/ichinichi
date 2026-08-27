import { createClient, type InsForgeClient } from "@insforge/sdk";

let client: InsForgeClient | null = null;

export function isInsforgeConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_INSFORGE_URL &&
      process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
  );
}

/** Browser InsForge client (anon key). Safe to call from client components. */
export function getInsforge(): InsForgeClient | null {
  if (typeof window === "undefined") return null;
  if (!isInsforgeConfigured()) return null;
  if (!client) {
    client = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    });
  }
  return client;
}
