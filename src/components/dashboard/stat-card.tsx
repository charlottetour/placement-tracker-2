import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  suffix,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "default" | "positive" | "negative" | "warning";
  suffix?: string;
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-[var(--accent-soft)] text-[var(--accent)]",
    positive: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    negative: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  };
  return (
    <div className="card-surface rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", toneClasses[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">
        {value}
        {suffix && <span className="ml-1 text-sm font-normal text-[var(--muted)]">{suffix}</span>}
      </div>
    </div>
  );
}
