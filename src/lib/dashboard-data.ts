import { prisma } from "@/lib/prisma";
import { STATUS_META, STATUS_ORDER, type StatusKey } from "@/lib/constants";

export async function getDashboardData() {
  const applications = await prisma.application.findMany({
    include: { company: true, documents: true, followUps: true },
    orderBy: { updatedAt: "desc" },
  });

  const total = applications.length;
  const activeApps = applications.filter((a) => STATUS_META[a.status as StatusKey]?.isActive);
  const enCours = activeApps.length;
  const envoyees = applications.filter((a) => a.sentAt !== null).length;
  const entretiens = applications.filter((a) => a.status === "ENTRETIEN").length;
  const acceptees = applications.filter((a) => a.status === "ACCEPTE").length;
  const refusees = applications.filter((a) => a.status === "REFUSE" || a.status === "ABANDONNE").length;

  const relancesEnAttente = applications.flatMap((a) => a.followUps.filter((f) => !f.done).map((f) => ({ ...f, application: a })));
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const relancesDues = relancesEnAttente.filter((f) => f.dueAt <= endOfToday);

  const documentsAPreparer = activeApps.reduce((sum, a) => sum + a.documents.filter((d) => !d.checked).length, 0);

  const statusDistribution = STATUS_ORDER.map((status) => ({
    key: status,
    name: STATUS_META[status].label,
    value: applications.filter((a) => a.status === status).length,
    color: STATUS_META[status].dot,
  })).filter((s) => s.value > 0);

  const sectorMap = new Map<string, number>();
  for (const a of applications) {
    const sector = a.company.sector?.trim() || "Non renseigné";
    sectorMap.set(sector, (sectorMap.get(sector) ?? 0) + 1);
  }
  const sectorDistribution = Array.from(sectorMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const tauxReponse = envoyees > 0 ? Math.round(((entretiens + acceptees + refusees) / envoyees) * 100) : 0;

  // "À faire aujourd'hui"
  type Todo = { id: string; kind: string; label: string; sub: string; date: Date | null; urgent: boolean; href: string };
  const todos: Todo[] = [];

  for (const a of activeApps) {
    if (a.deadlineAt && !a.sentAt) {
      const days = Math.round((a.deadlineAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 3) {
        todos.push({
          id: `deadline-${a.id}`,
          kind: "Deadline",
          label: `Envoyer la candidature — ${a.company.name}`,
          sub: days < 0 ? `Deadline dépassée (${Math.abs(days)}j)` : days === 0 ? "Deadline aujourd'hui" : `Deadline dans ${days}j`,
          date: a.deadlineAt,
          urgent: days <= 0,
          href: `/candidatures?open=${a.id}`,
        });
      }
    }
  }

  for (const f of relancesDues) {
    const days = Math.round((f.dueAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    todos.push({
      id: `followup-${f.id}`,
      kind: "Relance",
      label: `Relancer ${f.application.company.name}`,
      sub: days < 0 ? `En retard de ${Math.abs(days)}j` : "À faire aujourd'hui",
      date: f.dueAt,
      urgent: true,
      href: `/candidatures?open=${f.applicationId}`,
    });
  }

  for (const a of activeApps) {
    if ((a.status === "DOSSIER_EN_PREPARATION" || a.status === "PRET_A_ENVOYER") && a.documents.some((d) => !d.checked)) {
      const missing = a.documents.filter((d) => !d.checked).length;
      todos.push({
        id: `docs-${a.id}`,
        kind: "Documents",
        label: `Compléter le dossier — ${a.company.name}`,
        sub: `${missing} document${missing > 1 ? "s" : ""} manquant${missing > 1 ? "s" : ""}`,
        date: a.deadlineAt,
        urgent: false,
        href: `/candidatures?open=${a.id}`,
      });
    }
  }

  for (const a of activeApps) {
    if (a.status === "ENTRETIEN") {
      todos.push({
        id: `interview-${a.id}`,
        kind: "Entretien",
        label: `Préparer l'entretien — ${a.company.name}`,
        sub: a.title,
        date: a.deadlineAt,
        urgent: false,
        href: `/candidatures?open=${a.id}`,
      });
    }
  }

  todos.sort((a, b) => {
    if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
    if (a.date && b.date) return a.date.getTime() - b.date.getTime();
    return 0;
  });

  return {
    total,
    enCours,
    envoyees,
    entretiens,
    acceptees,
    refusees,
    documentsAPreparer,
    relancesDues: relancesDues.length,
    relancesEnAttente: relancesEnAttente.length,
    tauxReponse,
    statusDistribution,
    sectorDistribution,
    todos: todos.slice(0, 8),
    recentApplications: applications.slice(0, 6),
  };
}
