"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CONTACT_TYPE_META } from "@/lib/constants";
import { createContact, updateContact } from "@/lib/actions";
import { toInputDate } from "@/lib/utils";
import type { Contact } from "@prisma/client";

export function ContactFormDialog({
  companyId,
  contact,
  trigger,
}: {
  companyId: string;
  contact?: Contact;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const router = useRouter();
  const isEdit = !!contact;

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("companyId", companyId);
    try {
      if (isEdit) {
        await updateContact(contact.id, formData);
        toast.success("Contact mis à jour");
      } else {
        await createContact(formData);
        toast.success("Contact ajouté");
      }
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
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Contact
        </Button>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le contact" : "Nouveau contact"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Prénom</Label>
              <Input name="firstName" defaultValue={contact?.firstName} required />
            </div>
            <div>
              <Label>Nom</Label>
              <Input name="lastName" defaultValue={contact?.lastName ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Poste</Label>
              <Input name="role" defaultValue={contact?.role ?? ""} placeholder="Ex : Chargée de recrutement" />
            </div>
            <div>
              <Label>Type de contact</Label>
              <select
                name="type"
                defaultValue={contact?.type ?? "AUTRE"}
                className="flex h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--accent)]"
              >
                {Object.entries(CONTACT_TYPE_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" defaultValue={contact?.email ?? ""} />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input name="phone" defaultValue={contact?.phone ?? ""} />
            </div>
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input name="linkedin" defaultValue={contact?.linkedin ?? ""} placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <Label>Dernier contact le</Label>
            <Input type="date" name="lastContactedAt" defaultValue={toInputDate(contact?.lastContactedAt)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea name="notes" defaultValue={contact?.notes ?? ""} rows={3} />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Enregistrement..." : isEdit ? "Enregistrer" : "Ajouter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
