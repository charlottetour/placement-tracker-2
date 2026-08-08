import { STATUS_META, type StatusKey } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = STATUS_META[status as StatusKey] ?? STATUS_META.A_RECHERCHER;
  return (
    <Badge className={`${meta.tone} ${className ?? ""}`} dotClassName={meta.dot}>
      {meta.label}
    </Badge>
  );
}
