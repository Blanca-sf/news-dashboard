"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="bg-[var(--color-paper)] border-b border-[var(--color-border)] sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-2xl tracking-tight text-[var(--color-ink)]">
            Dispatch
          </Link>
          <AuthButton />
        </div>
        <nav className="flex gap-6 mt-4 font-mono-label text-xs uppercase tracking-wider">
          <Link
            href="/"
            className={`pb-2 border-b-2 transition ${
              pathname === "/" ? "border-[var(--color-accent)] text-[var(--color-ink)]" : "border-transparent text-[var(--color-ink)]/50 hover:text-[var(--color-ink)]"
            }`}
          >
            Top Stories
          </Link>
          <Link
            href="/favoritos"
            className={`pb-2 border-b-2 transition ${
              pathname === "/favoritos" ? "border-[var(--color-accent)] text-[var(--color-ink)]" : "border-transparent text-[var(--color-ink)]/50 hover:text-[var(--color-ink)]"
            }`}
          >
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}