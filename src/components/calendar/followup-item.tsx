"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { toggleFollowUp } from "@/lib/actions";
import type { FollowUp, Application, Company } from "@prisma/client";

type Row = FollowUp & { application: Application & { company: Company } };

export function FollowUpItem({ followUp }: { followUp: Row }) {
  const router = useRouter();
  return (
    <li className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] px-3 py-2.5">
      <Checkbox
        checked={followUp.done}
        onCheckedChange={async (v) => {
          await toggleFollowUp(followUp.id, v === true);
          router.refresh();
        }}
      />
      <div className="min-w-0 flex-1">
        <Link href={`/candidatures?open=${followUp.applicationId}`} className="text-sm font-medium hover:text-[var(--accent)]">
          Relancer {followUp.application.company.name}
        </Link>
        <p className="truncate text-xs text-[var(--muted)]">
          {followUp.application.title} · prévu le {formatDate(followUp.dueAt)}
          {followUp.note ? ` · ${followUp.note}` : ""}
        </p>
      </div>
    </li>
  );
}
