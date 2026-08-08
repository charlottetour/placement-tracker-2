"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createCompany } from "@/lib/actions";

export function CreateCompanyButton() {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      await createCompany({
        name: String(formData.get("name") ?? ""),
        sector: String(formData.get("sector") ?? "") || null,
        city: String(formData.get("city") ?? "") || null,
        country: String(formData.get("country") ?? "") || null,
        website: String(formData.get("website") ?? "") || null,
        notes: String(formData.get("notes") ?? "") || null,
      });
      toast.success("Entreprise ajoutée");
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
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Nouvelle entreprise
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle entreprise</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-3">
          <div>
            <Label>Nom</Label>
            <Input name="name" required placeholder="Ex : Airbus" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Secteur</Label>
              <Input name="sector" placeholder="Ex : Aéronautique" />
            </div>
            <div>
              <Label>Site web</Label>
              <Input name="website" placeholder="https://" />
            </div>
            <div>
              <Label>Ville</Label>
              <Input name="city" placeholder="Ex : Toulouse" />
            </div>
            <div>
              <Label>Pays</Label>
              <Input name="country" placeholder="Ex : France" />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea name="notes" rows={3} />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Ajout..." : "Ajouter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
