"use client";

import * as React from "react";
import { DndContext, DragOverlay, useDroppable, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { STATUS_META, STATUS_ORDER, type StatusKey } from "@/lib/constants";
import { ApplicationCard } from "@/components/applications/application-card";
import type { ApplicationWithRelations } from "@/lib/types";
import { cn } from "@/lib/utils";
import { setApplicationStatus } from "@/lib/actions";
import { toast } from "sonner";

function Column({
  status,
  applications,
  onCardClick,
}: {
  status: StatusKey;
  applications: ApplicationWithRelations[];
  onCardClick: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const meta = STATUS_META[status];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-2xl bg-[var(--surface-hover)]/60 p-2.5 transition-colors",
        isOver && "bg-[var(--accent-soft)]"
      )}
    >
      <div className="mb-2 flex items-center justify-between px-1.5">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
          <h3 className="text-xs font-semibold">{meta.label}</h3>
        </div>
        <span className="rounded-full bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted)]">
          {applications.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-0.5 pb-1" style={{ minHeight: 80 }}>
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} onClick={() => onCardClick(app.id)} />
        ))}
        {applications.length === 0 && (
          <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-[var(--border-subtle)] text-[11px] text-[var(--muted)]">
            Vide
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  applications,
  onCardClick,
}: {
  applications: ApplicationWithRelations[];
  onCardClick: (id: string) => void;
}) {
  const [items, setItems] = React.useState(applications);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resync local drag state after server revalidation
    setItems(applications);
  }, [applications]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const newStatus = String(over.id) as StatusKey;
    const app = items.find((a) => a.id === active.id);
    if (!app || app.status === newStatus) return;

    setItems((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a)));
    try {
      await setApplicationStatus(app.id, newStatus);
      toast.success(`${app.company.name} → ${STATUS_META[newStatus].label}`);
    } catch {
      setItems((prev) => prev.map((a) => (a.id === app.id ? { ...a, status: app.status } : a)));
      toast.error("Impossible de mettre à jour le statut");
    }
  }

  const activeApp = activeId ? items.find((a) => a.id === activeId) : null;

  return (
    <DndContext id="kanban-board" sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STATUS_ORDER.map((status) => (
          <Column
            key={status}
            status={status}
            applications={items.filter((a) => a.status === status)}
            onCardClick={onCardClick}
          />
        ))}
      </div>
      <DragOverlay>{activeApp ? <ApplicationCard application={activeApp} onClick={() => {}} /> : null}</DragOverlay>
    </DndContext>
  );
}
