"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { STATUS_HEX, type StatusKey } from "@/lib/constants";

export function StatusPieChart({ data }: { data: { key: string; name: string; value: number }[] }) {
  if (data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-sm text-[var(--muted)]">Aucune donnée encore</div>;
  }
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2} strokeWidth={0}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={STATUS_HEX[entry.key as StatusKey]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid flex-1 grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
        {data.map((entry) => (
          <li key={entry.key} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: STATUS_HEX[entry.key as StatusKey] }} />
            <span className="flex-1 truncate text-[var(--muted)]">{entry.name}</span>
            <span className="font-medium">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
