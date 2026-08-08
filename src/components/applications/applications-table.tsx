"use client";

import { MapPin, FileCheck2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { PriorityStars } from "@/components/priority-stars";
import { APPLICATION_TYPE_META, type ApplicationTypeKey } from "@/lib/constants";
import { formatDate, daysUntil, cn } from "@/lib/utils";
import type { ApplicationWithRelations } from "@/lib/types";

export function ApplicationsTable({
  applications,
  onRowClick,
}: {
  applications: ApplicationWithRelations[];
  onRowClick: (id: string) => void;
}) {
  if (applications.length === 0) {
    return (
      <div className="card-surface flex h-40 items-center justify-center rounded-2xl text-sm text-[var(--muted)]">
        Aucune candidature ne correspond à ces filtres.
      </div>
    );
  }

  return (
    <div className="card-surface overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-left text-xs text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Entreprise</th>
              <th className="px-4 py-3 font-medium">Poste</th>
              <th className="px-4 py-3 font-medium">Lieu</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Deadline</th>
              <th className="px-4 py-3 font-medium">Dossier</th>
              <th className="px-4 py-3 font-medium">Priorité</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const days = daysUntil(app.deadlineAt);
              const docsTotal = app.documents.length;
              const docsChecked = app.documents.filter((d) => d.checked).length;
              return (
                <tr
                  key={app.id}
                  onClick={() => onRowClick(app.id)}
                  className="cursor-pointer border-b border-[var(--border-subtle)] last:border-0 transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <td className="px-4 py-3 font-medium">{app.company.name}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-[var(--muted)]">{app.title}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {app.company.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {app.company.city}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {APPLICATION_TYPE_META[app.applicationType as ApplicationTypeKey]?.label ?? app.applicationType}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-[var(--muted)]",
                      days !== null && days <= 3 && days >= 0 && "text-amber-600 dark:text-amber-400 font-medium",
                      days !== null && days < 0 && "text-rose-600 dark:text-rose-400 font-medium"
                    )}
                  >
                    {formatDate(app.deadlineAt) ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {docsTotal > 0 ? (
                      <span className="flex items-center gap-1">
                        <FileCheck2 className="h-3.5 w-3.5" /> {docsChecked}/{docsTotal}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <PriorityStars value={app.priority} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
