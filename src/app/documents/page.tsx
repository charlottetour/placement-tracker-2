import { prisma } from "@/lib/prisma";
import { DocumentsOverview } from "@/components/documents/documents-overview";
import { STATUS_ORDER, STATUS_META } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const activeStatuses = STATUS_ORDER.filter((s) => STATUS_META[s].isActive);

  const applications = await prisma.application.findMany({
    where: { status: { in: activeStatuses } },
    include: {
      company: true,
      documents: { orderBy: { order: "asc" } },
      followUps: true,
      interactions: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const totalDocs = applications.reduce((sum, a) => sum + a.documents.length, 0);
  const checkedDocs = applications.reduce((sum, a) => sum + a.documents.filter((d) => d.checked).length, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {checkedDocs} / {totalDocs} documents préparés sur tes candidatures actives.
        </p>
      </div>
      <DocumentsOverview applications={applications} />
    </div>
  );
}
