"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateCompany, deleteCompany } from "@/lib/actions";
import type { Company } from "@prisma/client";

export function EditCompanyDialog({ company }: { company: Company }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      await updateCompany(company.id, formData);
      toast.success("Entreprise mise à jour");
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
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil className="h-3.5 w-3.5" /> Modifier
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l&apos;entreprise</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-3">
          <div>
            <Label>Nom</Label>
            <Input name="name" defaultValue={company.name} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Secteur</Label>
              <Input name="sector" defaultValue={company.sector ?? ""} />
            </div>
            <div>
              <Label>Site web</Label>
              <Input name="website" defaultValue={company.website ?? ""} />
            </div>
            <div>
              <Label>Ville</Label>
              <Input name="city" defaultValue={company.city ?? ""} />
            </div>
            <div>
              <Label>Pays</Label>
              <Input name="country" defaultValue={company.country ?? ""} />
            </div>
          </div>
          <div>
            <Label>Notes générales</Label>
            <Textarea name="notes" defaultValue={company.notes ?? ""} rows={4} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={pending}>
              {pending ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={async () => {
                if (confirm(`Supprimer ${company.name} et toutes ses candidatures/contacts ?`)) {
                  await deleteCompany(company.id);
                  toast.success("Entreprise supprimée");
                  router.push("/entreprises");
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
