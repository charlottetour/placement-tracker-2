import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  dotClassName,
}: {
  className?: string;
  children: React.ReactNode;
  dotClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        className
      )}
    >
      {dotClassName && <span className={cn("h-1.5 w-1.5 rounded-full", dotClassName)} />}
      {children}
    </span>
  );
}
