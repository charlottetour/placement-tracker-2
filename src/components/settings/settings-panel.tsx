"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Sun, Moon, Laptop, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getExportData, resetAllData } from "@/lib/actions";

const THEME_OPTIONS = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
  { value: "system", label: "Système", icon: Laptop },
];

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR/client theme mismatch guard
    setMounted(true);
  }, []);

  async function handleExport() {
    const data = await getExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stagetrack-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export téléchargé");
  }

  async function handleReset() {
    if (!confirm("Cette action supprimera définitivement toutes tes candidatures, entreprises et contacts. Continuer ?")) return;
    setPending(true);
    try {
      await resetAllData();
      toast.success("Toutes les données ont été supprimées");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = mounted && theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-colors",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border-subtle)] text-[var(--muted)] hover:bg-[var(--surface-hover)]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-4 py-3">
            <div>
              <p className="text-sm font-medium">Exporter mes données</p>
              <p className="text-xs text-[var(--muted)]">Télécharge une copie JSON de toutes tes candidatures.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" /> Exporter
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-rose-200 px-4 py-3 dark:border-rose-500/30">
            <div>
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Réinitialiser toutes les données</p>
              <p className="text-xs text-[var(--muted)]">Supprime définitivement toutes les entreprises, candidatures et contacts.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleReset} disabled={pending}>
              <Trash2 className="h-3.5 w-3.5" /> Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
