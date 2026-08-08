"use client";

import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_META, STATUS_ORDER, APPLICATION_TYPE_META } from "@/lib/constants";

export type Filters = {
  search: string;
  status: string;
  applicationType: string;
  sector: string;
  city: string;
  sortBy: "deadline" | "discovered" | "priority" | "updated";
};

export const DEFAULT_FILTERS: Filters = {
  search: "",
  status: "ALL",
  applicationType: "ALL",
  sector: "ALL",
  city: "ALL",
  sortBy: "updated",
};

export function FiltersBar({
  filters,
  onChange,
  sectors,
  cities,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  sectors: string[];
  cities: string[];
}) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <Input
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Rechercher une entreprise, un poste..."
          className="pl-9"
        />
      </div>

      <Select value={filters.status} onValueChange={(v) => set("status", v)}>
        <SelectTrigger className="w-auto min-w-[140px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tous les statuts</SelectItem>
          {STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_META[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.applicationType} onValueChange={(v) => set("applicationType", v)}>
        <SelectTrigger className="w-auto min-w-[140px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tous les types</SelectItem>
          {Object.entries(APPLICATION_TYPE_META).map(([key, meta]) => (
            <SelectItem key={key} value={key}>
              {meta.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {sectors.length > 0 && (
        <Select value={filters.sector} onValueChange={(v) => set("sector", v)}>
          <SelectTrigger className="w-auto min-w-[130px]">
            <SelectValue placeholder="Secteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les secteurs</SelectItem>
            {sectors.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {cities.length > 0 && (
        <Select value={filters.city} onValueChange={(v) => set("city", v)}>
          <SelectTrigger className="w-auto min-w-[130px]">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les villes</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={filters.sortBy} onValueChange={(v) => set("sortBy", v as Filters["sortBy"])}>
        <SelectTrigger className="w-auto min-w-[160px]">
          <ArrowUpDown className="h-3.5 w-3.5 text-[var(--muted)]" />
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated">Dernière mise à jour</SelectItem>
          <SelectItem value="deadline">Deadline</SelectItem>
          <SelectItem value="discovered">Date de découverte</SelectItem>
          <SelectItem value="priority">Priorité</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
