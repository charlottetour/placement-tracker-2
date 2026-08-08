"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactCard } from "@/components/contacts/contact-card";
import { CONTACT_TYPE_META } from "@/lib/constants";
import type { Contact } from "@prisma/client";

type ContactRow = Contact & { company: { id: string; name: string } };

export function ContactsList({ contacts }: { contacts: ContactRow[] }) {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("ALL");

  const filtered = contacts.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName ?? ""} ${c.company.name}`.toLowerCase();
    if (search && !fullName.includes(search.toLowerCase())) return false;
    if (type !== "ALL" && c.type !== type) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un contact ou une entreprise..." className="pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-auto min-w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les types</SelectItem>
            {Object.entries(CONTACT_TYPE_META).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="card-surface flex h-32 items-center justify-center rounded-2xl text-sm text-[var(--muted)]">
          Aucun contact trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.id}>
              <Link href={`/entreprises/${c.companyId}`} className="mb-1 block text-xs text-[var(--muted)] hover:text-[var(--accent)]">
                {c.company.name} →
              </Link>
              <ContactCard contact={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
