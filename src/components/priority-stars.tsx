"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function PriorityStars({
  value,
  onChange,
  size = 14,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={(e) => {
            e.stopPropagation();
            onChange?.(value === i ? 0 : i);
          }}
          className={cn("transition-transform", onChange && "hover:scale-110")}
        >
          <Star
            size={size}
            className={i <= value ? "fill-amber-400 text-amber-400" : "text-[var(--border-subtle)]"}
          />
        </button>
      ))}
    </div>
  );
}
