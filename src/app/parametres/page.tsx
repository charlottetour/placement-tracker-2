import { SettingsPanel } from "@/components/settings/settings-panel";

export default function ParametresPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Personnalise ton expérience StageTrack.</p>
      </div>
      <SettingsPanel />
    </div>
  );
}
