"use client";

import * as React from "react";
import { Calendar, FileCheck2, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { PriorityStars } from "@/components/priority-stars";
import { ApplicationDetailDialog } from "@/components/applications/application-detail-dialog";
import { QuickAddButton } from "@/components/applications/quick-add-button";
import { formatDate } from "@/lib/utils";
import type { ApplicationWithRelations } from "@/lib/types";

export function CompanyApplicationsList({
  applications,
  companyId,
}: {
  applications: ApplicationWithRelations[];
  companyId: string;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = applications.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Candidatures ({applications.length})</h2>
        <QuickAddButton defaultCompanyId={companyId} className="h-8 px-3 text-xs" />
      </div>

      {applications.length === 0 ? (
        <div className="card-surface flex h-24 items-center justify-center rounded-2xl text-sm text-[var(--muted)]">
          Aucune candidature pour cette entreprise encore.
        </div>
      ) : (
        <ul className="space-y-2">
          {applications.map((app) => {
            const docsTotal = app.documents.length;
            const docsChecked = app.documents.filter((d) => d.checked).length;
            return (
              <li key={app.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(app.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedId(app.id);
                  }}
                  className="card-surface flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl p-4 text-left transition-shadow hover:shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{app.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                      {app.deadlineAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(app.deadlineAt)}
                        </span>
                      )}
                      {docsTotal > 0 && (
                        <span className="flex items-center gap-1">
                          <FileCheck2 className="h-3 w-3" /> {docsChecked}/{docsTotal}
                        </span>
                      )}
                      <PriorityStars value={app.priority} size={11} />
                    </div>
                  </div>
                  <StatusBadge status={app.status} className="shrink-0" />
                  <ChevronRight className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ApplicationDetailDialog application={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
