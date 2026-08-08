import Link from "next/link";
import {
  Briefcase,
  Send,
  Users2,
  Trophy,
  XCircle,
  Bell,
  FileWarning,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPieChart } from "@/components/dashboard/status-pie-chart";
import { SectorBarChart } from "@/components/dashboard/sector-bar-chart";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  const firstName = "Charlotte";
  const hasApplications = data.total > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bonjour {firstName}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {hasApplications
              ? `Tu as ${data.enCours} candidature${data.enCours > 1 ? "s" : ""} en cours sur ${data.total} au total.`
              : "Ajoute ta première candidature pour démarrer ton suivi."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total" value={data.total} icon={Briefcase} />
        <StatCard label="En cours" value={data.enCours} icon={TrendingUp} tone="warning" />
        <StatCard label="Envoyées" value={data.envoyees} icon={Send} />
        <StatCard label="Entretiens" value={data.entretiens} icon={Users2} tone="warning" />
        <StatCard label="Acceptées" value={data.acceptees} icon={Trophy} tone="positive" />
        <StatCard label="Refusées" value={data.refusees} icon={XCircle} tone="negative" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card-surface flex items-center gap-3 rounded-2xl p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-none">{data.relancesDues}</p>
            <p className="text-xs text-[var(--muted)]">relance{data.relancesDues > 1 ? "s" : ""} à effectuer</p>
          </div>
        </div>
        <div className="card-surface flex items-center gap-3 rounded-2xl p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
            <FileWarning className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-none">{data.documentsAPreparer}</p>
            <p className="text-xs text-[var(--muted)]">document{data.documentsAPreparer > 1 ? "s" : ""} à préparer</p>
          </div>
        </div>
        <div className="card-surface flex items-center gap-3 rounded-2xl p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-none">{data.tauxReponse}%</p>
            <p className="text-xs text-[var(--muted)]">taux de réponse</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" /> À faire aujourd&apos;hui
            </CardTitle>
            <span className="text-xs text-[var(--muted)]">{data.todos.length} tâche{data.todos.length > 1 ? "s" : ""}</span>
          </CardHeader>
          <CardContent>
            {data.todos.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--muted)]">
                🎉 Rien d&apos;urgent aujourd&apos;hui. Continue comme ça !
              </p>
            ) : (
              <ul className="divide-y divide-[var(--border-subtle)]">
                {data.todos.map((todo) => (
                  <li key={todo.id}>
                    <Link
                      href={todo.href}
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-[var(--surface-hover)] rounded-lg px-2 -mx-2"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2 w-2 rounded-full ${todo.urgent ? "bg-rose-500" : "bg-amber-400"}`}
                        />
                        <div>
                          <p className="text-sm font-medium">{todo.label}</p>
                          <p className="text-xs text-[var(--muted)]">
                            {todo.kind} · {todo.sub}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[var(--muted)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Candidatures récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentApplications.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--muted)]">Aucune candidature pour le moment.</p>
            ) : (
              <ul className="space-y-3">
                {data.recentApplications.map((app) => (
                  <li key={app.id}>
                    <Link
                      href={`/entreprises/${app.companyId}`}
                      className="flex items-center justify-between gap-2 rounded-lg -mx-2 px-2 py-1.5 hover:bg-[var(--surface-hover)]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{app.company.name}</p>
                        <p className="truncate text-xs text-[var(--muted)]">{app.title}</p>
                      </div>
                      <StatusBadge status={app.status} className="shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={data.statusDistribution} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Candidatures par secteur</CardTitle>
          </CardHeader>
          <CardContent>
            <SectorBarChart data={data.sectorDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
