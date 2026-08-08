import { prisma } from "@/lib/prisma";
import { ApplicationsBoard } from "@/components/applications/applications-board";

export const dynamic = "force-dynamic";

export default async function CandidaturesPage({
  searchParams,
}: {
  searchParams: Promise<{ open?: string }>;
}) {
  const { open } = await searchParams;

  const applications = await prisma.application.findMany({
    include: {
      company: true,
      documents: { orderBy: { order: "asc" } },
      followUps: { orderBy: { dueAt: "asc" } },
      interactions: { orderBy: { occurredAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const companies = await prisma.company.findMany({
    select: { id: true, name: true, sector: true, city: true, country: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Candidatures</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Toutes tes candidatures, en vue tableau ou Kanban.</p>
      </div>
      <ApplicationsBoard applications={applications} companies={companies} openId={open ?? null} />
    </div>
  );
}
