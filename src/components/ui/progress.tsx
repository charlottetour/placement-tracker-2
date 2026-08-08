import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]", className)}>
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
