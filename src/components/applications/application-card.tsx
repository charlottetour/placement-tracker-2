"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, Calendar, FileCheck2 } from "lucide-react";
import { STATUS_HEX, type StatusKey } from "@/lib/constants";
import { formatDateShort, daysUntil } from "@/lib/utils";
import { PriorityStars } from "@/components/priority-stars";
import type { ApplicationWithRelations } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ApplicationCard({
  application,
  onClick,
}: {
  application: ApplicationWithRelations;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: application.id });
  const docsTotal = application.documents.length;
  const docsChecked = application.documents.filter((d) => d.checked).length;
  const days = daysUntil(application.deadlineAt);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={{
        transform: CSS.Translate.toString(transform),
        borderLeftColor: STATUS_HEX[application.status as StatusKey],
      }}
      className={cn(
        "card-surface cursor-pointer rounded-xl border-l-[3px] p-3.5 shadow-sm transition-shadow hover:shadow-md",
        isDragging && "opacity-40"
      )}
      data-status={application.status}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-tight">{application.company.name}</p>
        <PriorityStars value={application.priority} size={11} />
      </div>
      <p className="mt-0.5 line-clamp-1 text-xs text-[var(--muted)]">{application.title}</p>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-[var(--muted)]">
        {application.company.city && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {application.company.city}
          </span>
        )}
        {application.deadlineAt && (
          <span className={cn("flex items-center gap-1", days !== null && days <= 3 && days >= 0 && "text-amber-600 dark:text-amber-400", days !== null && days < 0 && "text-rose-600 dark:text-rose-400")}>
            <Calendar className="h-3 w-3" /> {formatDateShort(application.deadlineAt)}
          </span>
        )}
        {docsTotal > 0 && (
          <span className="flex items-center gap-1">
            <FileCheck2 className="h-3 w-3" /> {docsChecked}/{docsTotal}
          </span>
        )}
      </div>
    </div>
  );
}
