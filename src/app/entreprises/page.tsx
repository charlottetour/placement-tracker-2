import { prisma } from "@/lib/prisma";
import { CompaniesGrid } from "@/components/companies/companies-grid";
import { CreateCompanyButton } from "@/components/companies/create-company-button";

export const dynamic = "force-dynamic";

export default async function EntreprisesPage() {
  const companies = await prisma.company.findMany({
    include: { applications: { select: { status: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Entreprises</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{companies.length} entreprise{companies.length !== 1 ? "s" : ""} suivie{companies.length !== 1 ? "s" : ""}</p>
        </div>
        <CreateCompanyButton />
      </div>
      <CompaniesGrid companies={companies} />
    </div>
  );
}
