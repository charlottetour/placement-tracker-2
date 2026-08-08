"use client";

import * as React from "react";
import Link from "next/link";
import { Search, MapPin, Globe, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { STATUS_META, type StatusKey } from "@/lib/constants";

type CompanyRow = {
  id: string;
  name: string;
  sector: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  applications: { status: string }[];
};

export function CompaniesGrid({ companies }: { companies: CompanyRow[] }) {
  const [search, setSearch] = React.useState("");

  const filtered = companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une entreprise..." className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="card-surface flex h-40 items-center justify-center rounded-2xl text-sm text-[var(--muted)]">
          Aucune entreprise trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const active = c.applications.filter((a) => STATUS_META[a.status as StatusKey]?.isActive).length;
            const accepted = c.applications.filter((a) => a.status === "ACCEPTE").length;
            return (
              <Link
                key={c.id}
                href={`/entreprises/${c.id}`}
                className="card-surface group rounded-2xl p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  {accepted > 0 && <span className="text-lg">🎉</span>}
                </div>
                <h3 className="mt-3 font-semibold group-hover:text-[var(--accent)]">{c.name}</h3>
                {c.sector && <p className="text-xs text-[var(--muted)]">{c.sector}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                  {c.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {c.city}
                      {c.country ? `, ${c.country}` : ""}
                    </span>
                  )}
                  {c.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Site web
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-[var(--surface-hover)] px-2 py-1 font-medium">
                    {c.applications.length} candidature{c.applications.length !== 1 ? "s" : ""}
                  </span>
                  {active > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                      {active} en cours
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
