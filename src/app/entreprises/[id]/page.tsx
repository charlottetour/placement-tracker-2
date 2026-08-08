import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, MapPin, Building2, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EditCompanyDialog } from "@/components/companies/edit-company-dialog";
import { CompanyApplicationsList } from "@/components/companies/company-applications-list";
import { ContactCard } from "@/components/contacts/contact-card";
import { ContactFormDialog } from "@/components/contacts/contact-form-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { INTERACTION_TYPE_META } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { createdAt: "desc" } },
      applications: {
        include: {
          company: true,
          documents: { orderBy: { order: "asc" } },
          followUps: { orderBy: { dueAt: "asc" } },
          interactions: { orderBy: { occurredAt: "desc" } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!company) notFound();

  const timeline = company.applications
    .flatMap((a) => a.interactions.map((i) => ({ ...i, applicationTitle: a.title })))
    .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    .slice(0, 20);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link href="/entreprises" className="text-xs text-[var(--muted)] hover:text-[var(--accent)]">
          ← Toutes les entreprises
        </Link>
      </div>

      <div className="card-surface rounded-2xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{company.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
                {company.sector && <span>{company.sector}</span>}
                {company.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {company.city}
                    {company.country ? `, ${company.country}` : ""}
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[var(--accent)] hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" /> Site web
                  </a>
                )}
              </div>
            </div>
          </div>
          <EditCompanyDialog company={company} />
        </div>
        {company.notes && (
          <p className="mt-4 rounded-xl bg-[var(--surface-hover)] p-3 text-sm text-[var(--foreground)]/90">{company.notes}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CompanyApplicationsList applications={company.applications} companyId={company.id} />

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Historique des interactions</h2>
            </div>
            <Card>
              <CardContent className="pt-5">
                {timeline.length === 0 ? (
                  <p className="py-6 text-center text-sm text-[var(--muted)]">Aucun historique encore.</p>
                ) : (
                  <ul className="space-y-3">
                    {timeline.map((i) => (
                      <li key={i.id} className="flex gap-3 border-l-2 border-[var(--border-subtle)] pl-3">
                        <div>
                          <p className="text-sm">{i.content}</p>
                          <p className="text-xs text-[var(--muted)]">
                            {INTERACTION_TYPE_META[i.type]?.label ?? i.type} · {i.applicationTitle} · {formatDate(i.occurredAt)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Contacts ({company.contacts.length})</h2>
            <ContactFormDialog companyId={company.id} />
          </div>
          {company.contacts.length === 0 ? (
            <div className="card-surface flex h-24 items-center justify-center rounded-2xl text-sm text-[var(--muted)]">
              Aucun contact enregistré.
            </div>
          ) : (
            <div className="space-y-3">
              {company.contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          )}

          {company.applications.some((a) => a.link) && (
            <div>
              <h2 className="mb-2 text-sm font-semibold">Liens utiles</h2>
              <ul className="space-y-1.5">
                {company.applications
                  .filter((a) => a.link)
                  .map((a) => (
                    <li key={a.id}>
                      <a
                        href={a.link!}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> {a.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
