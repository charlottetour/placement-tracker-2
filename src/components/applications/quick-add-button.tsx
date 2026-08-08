"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APPLICATION_TYPE_META } from "@/lib/constants";
import { createApplication, getCompanyOptions } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function QuickAddButton({ className, defaultCompanyId }: { className?: string; defaultCompanyId?: string }) {
  const [open, setOpen] = React.useState(false);
  const [companies, setCompanies] = React.useState<{ id: string; name: string }[]>([]);
  const [mode, setMode] = React.useState<"existing" | "new">(defaultCompanyId ? "existing" : "new");
  const [companyId, setCompanyId] = React.useState(defaultCompanyId ?? "");
  const [applicationType, setApplicationType] = React.useState("OFFRE");
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (open) {
      getCompanyOptions().then((data) => {
        setCompanies(data);
        if (!defaultCompanyId && data.length > 0) {
          setMode("existing");
          setCompanyId(data[0].id);
        }
      });
    }
  }, [open, defaultCompanyId]);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      await createApplication({
        companyId: mode === "existing" ? companyId : undefined,
        newCompanyName: mode === "new" ? String(formData.get("newCompanyName") ?? "") : undefined,
        newCompanySector: mode === "new" ? String(formData.get("newCompanySector") ?? "") : undefined,
        newCompanyCity: mode === "new" ? String(formData.get("newCompanyCity") ?? "") : undefined,
        title: String(formData.get("title") ?? ""),
        applicationType,
        link: String(formData.get("link") ?? ""),
        deadlineAt: String(formData.get("deadlineAt") ?? ""),
      });
      toast.success("Candidature ajoutée");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button className={cn(className)} onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Nouvelle candidature
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle candidature</DialogTitle>
        </DialogHeader>
        <form
          action={(fd) => handleSubmit(fd)}
          className="space-y-4"
        >
          <div>
            <Label>Entreprise</Label>
            {companies.length > 0 && (
              <div className="mb-2 flex gap-1 rounded-lg bg-[var(--surface-hover)] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMode("existing")}
                  className={cn("flex-1 rounded-md py-1", mode === "existing" && "bg-[var(--surface)] shadow-sm")}
                >
                  Existante
                </button>
                <button
                  type="button"
                  onClick={() => setMode("new")}
                  className={cn("flex-1 rounded-md py-1", mode === "new" && "bg-[var(--surface)] shadow-sm")}
                >
                  Nouvelle
                </button>
              </div>
            )}
            {mode === "existing" ? (
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Input name="newCompanyName" placeholder="Nom de l'entreprise" required className="col-span-2" />
                <Input name="newCompanySector" placeholder="Secteur (optionnel)" />
                <Input name="newCompanyCity" placeholder="Ville (optionnel)" />
              </div>
            )}
          </div>

          <div>
            <Label>Intitulé du poste / stage</Label>
            <Input name="title" placeholder="Ex : Stage Finance Intern" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type de candidature</Label>
              <Select value={applicationType} onValueChange={setApplicationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(APPLICATION_TYPE_META).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deadline (optionnel)</Label>
              <Input type="date" name="deadlineAt" />
            </div>
          </div>

          <div>
            <Label>Lien de l&apos;offre (optionnel)</Label>
            <Input name="link" placeholder="https://" />
          </div>

          <Button type="submit" className="w-full" disabled={pending || (mode === "existing" && !companyId)}>
            {pending ? "Ajout..." : "Ajouter la candidature"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
