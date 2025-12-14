"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AppHeader.module.css";

/* Custom hook — this part was already fine */
function useNow(tickMs = 1000) {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);

  return now;
}

export function AppHeader({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const now = useNow(1000);

  /* ✅ Hooks MUST be here */
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (searchOpen) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [searchOpen]);

  const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/book", label: "Book" },
    { href: "/rooms", label: "Rooms" },
    { href: "/report", label: "Report" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.hamburger}
          onClick={onOpenDrawer}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className={styles.brand}>
          <div className={styles.brandTitle}>MESS C</div>
          <div className={styles.brandSub}>Front Desk Console</div>
        </div>

        <nav className={styles.nav}>
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navActive : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={styles.right}>
        <div className={styles.clock} suppressHydrationWarning>
          {mounted
            ? now.toLocaleString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "—"}
        </div>

        <div
          className={`${styles.searchWrap} ${
            searchOpen ? styles.searchOpen : ""
          }`}
        >
          <button
            className={styles.searchBtn}
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            ⌕
          </button>

          <input
            ref={inputRef}
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rooms, guests, folios…"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchOpen(false);
                setQuery("");
              }
            }}
          />
        </div>

        <button className={styles.avatar} aria-label="User menu">
          A
        </button>
      </div>
    </header>
  );
}
