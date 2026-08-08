"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, Briefcase, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { QuickAddButton } from "@/components/applications/quick-add-button";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR/client theme mismatch guard
    setMounted(true);
  }, []);
  if (!mounted) return <div className="h-9 w-9" />;
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)]"
      aria-label="Basculer le thème"
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function NavLinks({ onNavigate, alertCount }: { onNavigate?: () => void; alertCount: number }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {item.href === "/calendrier" && alertCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                {alertCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children, alertCount = 0 }: { children: React.ReactNode; alertCount?: number }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface)] py-5 md:flex">
        <div className="mb-6 flex items-center gap-2 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">StageTrack</span>
        </div>
        <NavLinks alertCount={alertCount} />
        <div className="px-3 pt-2">
          <QuickAddButton className="w-full" />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[var(--surface)] py-5 animate-fade-in">
            <div className="mb-6 flex items-center justify-between px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">StageTrack</span>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-[var(--surface-hover)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} alertCount={alertCount} />
            <div className="px-3 pt-2">
              <QuickAddButton className="w-full" />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--background)]/80 px-4 backdrop-blur md:px-8">
          <button
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-hover)] md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            {alertCount > 0 && (
              <Link
                href="/calendrier"
                className="flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
              >
                <Bell className="h-3.5 w-3.5" />
                {alertCount} relance{alertCount > 1 ? "s" : ""}
              </Link>
            )}
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
