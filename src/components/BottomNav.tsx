"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Today" },
  { href: "/curriculum", label: "Path" },
  { href: "/progress", label: "Progress" },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/lesson") || pathname.startsWith("/auth")) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs tracking-wide transition-colors ${
                active
                  ? "text-[var(--ink)] font-medium"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              <span
                className={`h-1 w-1 rounded-full transition-opacity ${
                  active ? "bg-[var(--accent)] opacity-100" : "opacity-0"
                }`}
              />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
