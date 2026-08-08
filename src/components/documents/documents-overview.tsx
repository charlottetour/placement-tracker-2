"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { toggleDocument, addDocument } from "@/lib/actions";
import type { ApplicationWithRelations } from "@/lib/types";

export function DocumentsOverview({ applications }: { applications: ApplicationWithRelations[] }) {
  const router = useRouter();
  const sorted = [...applications].sort((a, b) => {
    const pctA = a.documents.length ? a.documents.filter((d) => d.checked).length / a.documents.length : 1;
    const pctB = b.documents.length ? b.documents.filter((d) => d.checked).length / b.documents.length : 1;
    return pctA - pctB;
  });

  if (applications.length === 0) {
    return (
      <div className="card-surface flex h-40 items-center justify-center rounded-2xl text-sm text-[var(--muted)]">
        Aucune candidature active pour le moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {sorted.map((app) => (
        <ApplicationDocumentsCard key={app.id} application={app} onChange={() => router.refresh()} />
      ))}
    </div>
  );
}

function ApplicationDocumentsCard({
  application,
  onChange,
}: {
  application: ApplicationWithRelations;
  onChange: () => void;
}) {
  const [newLabel, setNewLabel] = React.useState("");
  const total = application.documents.length;
  const checked = application.documents.filter((d) => d.checked).length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <div className="card-surface rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/entreprises/${application.companyId}`} className="text-sm font-semibold hover:text-[var(--accent)]">
            {application.company.name}
          </Link>
          <p className="text-xs text-[var(--muted)]">{application.title}</p>
        </div>
        <StatusBadge status={application.status} className="shrink-0" />
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium">
            {checked} / {total} documents préparés
          </span>
          <span className="text-[var(--muted)]">{pct}%</span>
        </div>
        <Progress value={pct} />
      </div>

      <ul className="mt-3 space-y-1.5">
        {application.documents.map((doc) => (
          <li key={doc.id} className="flex items-center gap-2.5">
            <Checkbox
              checked={doc.checked}
              onCheckedChange={async (v) => {
                await toggleDocument(doc.id, v === true);
                onChange();
              }}
            />
            <span className={doc.checked ? "text-sm text-[var(--muted)] line-through" : "text-sm"}>{doc.label}</span>
          </li>
        ))}
      </ul>

      <form
        className="mt-3 flex gap-2"
        action={async () => {
          if (!newLabel.trim()) return;
          await addDocument(application.id, newLabel.trim());
          setNewLabel("");
          onChange();
        }}
      >
        <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Ajouter un document" className="h-8 text-xs" />
        <Button type="submit" size="icon" variant="subtle" className="h-8 w-8">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
