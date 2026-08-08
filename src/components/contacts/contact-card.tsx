"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Phone, Link2, Trash2 } from "lucide-react";
import { CONTACT_TYPE_META, type ContactTypeKey } from "@/lib/constants";
import { formatDate, initials } from "@/lib/utils";
import { deleteContact } from "@/lib/actions";
import { ContactFormDialog } from "@/components/contacts/contact-form-dialog";
import type { Contact } from "@prisma/client";

export function ContactCard({ contact, companyName }: { contact: Contact; companyName?: string }) {
  const router = useRouter();
  const fullName = `${contact.firstName} ${contact.lastName ?? ""}`.trim();

  return (
    <div className="card-surface rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
            {initials(fullName)}
          </div>
          <div>
            <p className="text-sm font-semibold">{fullName}</p>
            {contact.role && <p className="text-xs text-[var(--muted)]">{contact.role}</p>}
            {companyName && <p className="text-xs text-[var(--muted)]">{companyName}</p>}
          </div>
        </div>
        <span className="rounded-full bg-[var(--surface-hover)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
          {CONTACT_TYPE_META[contact.type as ContactTypeKey]?.label ?? contact.type}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-xs text-[var(--muted)]">
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-[var(--accent)]">
            <Mail className="h-3 w-3" /> {contact.email}
          </a>
        )}
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-[var(--accent)]">
            <Phone className="h-3 w-3" /> {contact.phone}
          </a>
        )}
        {contact.linkedin && (
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[var(--accent)]">
            <Link2 className="h-3 w-3" /> Profil LinkedIn
          </a>
        )}
      </div>

      {contact.lastContactedAt && (
        <p className="mt-2 text-[11px] text-[var(--muted)]">Dernier contact : {formatDate(contact.lastContactedAt)}</p>
      )}
      {contact.notes && <p className="mt-2 text-xs text-[var(--foreground)]/80">{contact.notes}</p>}

      <div className="mt-3 flex items-center gap-2">
        <ContactFormDialog
          companyId={contact.companyId}
          contact={contact}
          trigger={<button className="text-xs text-[var(--accent)] hover:underline">Modifier</button>}
        />
        <button
          onClick={async () => {
            if (confirm("Supprimer ce contact ?")) {
              await deleteContact(contact.id, contact.companyId);
              toast.success("Contact supprimé");
              router.refresh();
            }
          }}
          className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-rose-500"
        >
          <Trash2 className="h-3 w-3" /> Supprimer
        </button>
      </div>
    </div>
  );
}
