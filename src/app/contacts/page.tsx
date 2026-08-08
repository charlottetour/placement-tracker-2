import { prisma } from "@/lib/prisma";
import { ContactsList } from "@/components/contacts/contacts-list";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    include: { company: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {contacts.length} contact{contacts.length !== 1 ? "s" : ""} enregistré{contacts.length !== 1 ? "s" : ""} au total.
        </p>
      </div>
      <ContactsList contacts={contacts} />
    </div>
  );
}
