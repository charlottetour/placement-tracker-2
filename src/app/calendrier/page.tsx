import Link from "next/link";
import { AlertTriangle, Bell, CalendarClock, Users2 } from "lucide-react";
import { getCalendarData } from "@/lib/calendar-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowUpItem } from "@/components/calendar/followup-item";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, daysUntil } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CalendrierPage() {
  const { overdueFollowUps, upcomingFollowUps, overdueDeadlines, upcomingDeadlines, interviews } = await getCalendarData();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendrier &amp; Relances</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Deadlines, entretiens et relances à ne pas manquer.</p>
      </div>

      {overdueFollowUps.length + overdueDeadlines.length > 0 && (
        <Card className="border-rose-200 dark:border-rose-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" /> En retard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {overdueDeadlines.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 dark:border-rose-500/20 dark:bg-rose-500/10">
                  <div>
                    <Link href={`/candidatures?open=${a.id}`} className="text-sm font-medium hover:underline">
                      {a.company.name} — {a.title}
                    </Link>
                    <p className="text-xs text-[var(--muted)]">Deadline dépassée le {formatDate(a.deadlineAt)}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
              {overdueFollowUps.map((f) => (
                <FollowUpItem key={f.id} followUp={f} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[var(--accent)]" /> Relances à venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingFollowUps.length === 0 ? (
              <p className="py-6 text-center text-sm text-[var(--muted)]">Aucune relance planifiée.</p>
            ) : (
              <ul className="space-y-2">
                {upcomingFollowUps.map((f) => (
                  <FollowUpItem key={f.id} followUp={f} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-[var(--accent)]" /> Deadlines à venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="py-6 text-center text-sm text-[var(--muted)]">Aucune deadline à venir.</p>
            ) : (
              <ul className="space-y-2">
                {upcomingDeadlines.map((a) => {
                  const days = daysUntil(a.deadlineAt);
                  return (
                    <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] px-3 py-2.5">
                      <div>
                        <Link href={`/candidatures?open=${a.id}`} className="text-sm font-medium hover:text-[var(--accent)]">
                          {a.company.name} — {a.title}
                        </Link>
                        <p className={cn("text-xs text-[var(--muted)]", days !== null && days <= 3 && "font-medium text-amber-600 dark:text-amber-400")}>
                          {formatDate(a.deadlineAt)} · dans {days}j
                        </p>
                      </div>
                      <StatusBadge status={a.status} />
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-fuchsia-500" /> Entretiens en cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          {interviews.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--muted)]">Aucun entretien en cours.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {interviews.map((a) => (
                <li key={a.id} className="rounded-xl border border-[var(--border-subtle)] px-3 py-2.5">
                  <Link href={`/candidatures?open=${a.id}`} className="text-sm font-medium hover:text-[var(--accent)]">
                    {a.company.name}
                  </Link>
                  <p className="text-xs text-[var(--muted)]">{a.title}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
