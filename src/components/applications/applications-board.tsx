"use client";

import * as React from "react";
import { Table2, KanbanSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiltersBar, DEFAULT_FILTERS, type Filters } from "@/components/applications/filters-bar";
import { ApplicationsTable } from "@/components/applications/applications-table";
import { KanbanBoard } from "@/components/applications/kanban-board";
import { ApplicationDetailDialog } from "@/components/applications/application-detail-dialog";
import { QuickAddButton } from "@/components/applications/quick-add-button";
import type { ApplicationWithRelations, CompanyOption } from "@/lib/types";

export function ApplicationsBoard({
  applications,
  companies,
  openId,
}: {
  applications: ApplicationWithRelations[];
  companies: CompanyOption[];
  openId: string | null;
}) {
  const [view, setView] = React.useState<"table" | "kanban">("kanban");
  const [filters, setFilters] = React.useState<Filters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = React.useState<string | null>(openId);

  const sectors = React.useMemo(
    () => Array.from(new Set(companies.map((c) => c.sector).filter(Boolean))) as string[],
    [companies]
  );
  const cities = React.useMemo(
    () => Array.from(new Set(companies.map((c) => c.city).filter(Boolean))) as string[],
    [companies]
  );

  const filtered = React.useMemo(() => {
    let list = applications.filter((a) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!a.company.name.toLowerCase().includes(q) && !a.title.toLowerCase().includes(q)) return false;
      }
      if (filters.status !== "ALL" && a.status !== filters.status) return false;
      if (filters.applicationType !== "ALL" && a.applicationType !== filters.applicationType) return false;
      if (filters.sector !== "ALL" && a.company.sector !== filters.sector) return false;
      if (filters.city !== "ALL" && a.company.city !== filters.city) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (filters.sortBy) {
        case "deadline":
          if (!a.deadlineAt) return 1;
          if (!b.deadlineAt) return -1;
          return a.deadlineAt.getTime() - b.deadlineAt.getTime();
        case "discovered":
          return (b.discoveredAt?.getTime() ?? 0) - (a.discoveredAt?.getTime() ?? 0);
        case "priority":
          return b.priority - a.priority;
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });
    return list;
  }, [applications, filters]);

  const selectedApp = selectedId ? applications.find((a) => a.id === selectedId) ?? null : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={view} onValueChange={(v) => setView(v as "table" | "kanban")}>
          <TabsList>
            <TabsTrigger value="kanban" className="flex items-center gap-1.5">
              <KanbanSquare className="h-3.5 w-3.5" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-1.5">
              <Table2 className="h-3.5 w-3.5" /> Tableau
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <QuickAddButton />
      </div>

      <FiltersBar filters={filters} onChange={setFilters} sectors={sectors} cities={cities} />

      <p className="text-xs text-[var(--muted)]">
        {filtered.length} candidature{filtered.length !== 1 ? "s" : ""}
      </p>

      {view === "kanban" ? (
        <KanbanBoard applications={filtered} onCardClick={setSelectedId} />
      ) : (
        <ApplicationsTable applications={filtered} onRowClick={setSelectedId} />
      )}

      <ApplicationDetailDialog application={selectedApp} onClose={() => setSelectedId(null)} />
    </div>
  );
}
