"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ExternalLink, Trash2, Copy, Plus, Building2, StickyNote, Bell, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { PriorityStars } from "@/components/priority-stars";
import { StatusBadge } from "@/components/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { STATUS_META, STATUS_ORDER, APPLICATION_TYPE_META, INTERACTION_TYPE_META } from "@/lib/constants";
import { formatDate, toInputDate } from "@/lib/utils";
import type { ApplicationWithRelations } from "@/lib/types";
import {
  updateApplication,
  setApplicationStatus,
  setApplicationPriority,
  deleteApplication,
  duplicateApplication,
  toggleDocument,
  addDocument,
  deleteDocument,
  createFollowUp,
  toggleFollowUp,
  deleteFollowUp,
  addInteraction,
  updateDocumentLink,
} from "@/lib/actions";

export function ApplicationDetailDialog({
  application,
  onClose,
}: {
  application: ApplicationWithRelations | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  if (!application) return null;
  const app = application;
  const docsTotal = app.documents.length;
  const docsChecked = app.documents.filter((d) => d.checked).length;
  const docsPct = docsTotal > 0 ? Math.round((docsChecked / docsTotal) * 100) : 0;

  function refresh() {
    router.refresh();
  }

  async function run(fn: () => Promise<unknown>, successMsg?: string) {
    setPending(true);
    try {
      await fn();
      if (successMsg) toast.success(successMsg);
      refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={!!application} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between pr-6">
            <div>
              <DialogTitle className="text-lg">{app.title}</DialogTitle>
              <Link
                href={`/entreprises/${app.companyId}`}
                className="mt-1 flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
              >
                <Building2 className="h-3.5 w-3.5" /> {app.company.name}
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="Dupliquer"
                onClick={() => run(() => duplicateApplication(app.id), "Candidature dupliquée")}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Supprimer"
                onClick={() => {
                  if (confirm("Supprimer cette candidature ?")) {
                    run(() => deleteApplication(app.id), "Candidature supprimée");
                    onClose();
                  }
                }}
              >
                <Trash2 className="h-4 w-4 text-rose-500" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Select
            value={app.status}
            onValueChange={(v) => run(() => setApplicationStatus(app.id, v), "Statut mis à jour")}
          >
            <SelectTrigger className="w-auto">
              <StatusBadge status={app.status} />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PriorityStars
            value={app.priority}
            size={16}
            onChange={(v) => run(() => setApplicationPriority(app.id, v))}
          />
          {app.link && (
            <a
              href={app.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Voir l&apos;offre
            </a>
          )}
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="documents">
              Documents {docsTotal > 0 && `(${docsChecked}/${docsTotal})`}
            </TabsTrigger>
            <TabsTrigger value="followups">
              Relances {app.followUps.filter((f) => !f.done).length > 0 && `(${app.followUps.filter((f) => !f.done).length})`}
            </TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <form
              action={(fd) => run(() => updateApplication(app.id, fd), "Candidature mise à jour")}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Intitulé du poste</Label>
                  <Input name="title" defaultValue={app.title} />
                </div>
                <div>
                  <Label>Type de candidature</Label>
                  <select
                    name="applicationType"
                    defaultValue={app.applicationType}
                    className="flex h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--accent)]"
                  >
                    {Object.entries(APPLICATION_TYPE_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Lien de l&apos;offre</Label>
                <Input name="link" defaultValue={app.link ?? ""} placeholder="https://" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Découverte</Label>
                  <Input type="date" name="discoveredAt" defaultValue={toInputDate(app.discoveredAt)} />
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input type="date" name="deadlineAt" defaultValue={toInputDate(app.deadlineAt)} />
                </div>
                <div>
                  <Label>Envoi</Label>
                  <Input type="date" name="sentAt" defaultValue={toInputDate(app.sentAt)} />
                </div>
              </div>

              <div>
                <Label>Tags (séparés par des virgules)</Label>
                <Input name="tags" defaultValue={app.tags ?? ""} placeholder="ex: prioritaire, finance, remote" />
              </div>

              <div>
                <Label>Notes personnelles</Label>
                <Textarea name="notes" defaultValue={app.notes ?? ""} rows={4} />
              </div>

              <input type="hidden" name="status" value={app.status} />
              <Button type="submit" disabled={pending} className="w-full">
                Enregistrer
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="documents" className="mt-4 space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">
                  {docsChecked} / {docsTotal} documents préparés
                </span>
                <span className="text-[var(--muted)]">{docsPct}%</span>
              </div>
              <Progress value={docsPct} />
            </div>

            <ul className="space-y-2">
              {app.documents.map((doc) => (
                <DocumentRow key={doc.id} doc={doc} onChange={refresh} />
              ))}
            </ul>

            <AddDocumentForm applicationId={app.id} onAdded={refresh} />
          </TabsContent>

          <TabsContent value="followups" className="mt-4 space-y-4">
            <ul className="space-y-2">
              {app.followUps.length === 0 && (
                <p className="py-6 text-center text-sm text-[var(--muted)]">Aucune relance planifiée.</p>
              )}
              {app.followUps.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={f.done}
                      onCheckedChange={(v) => run(() => toggleFollowUp(f.id, v === true))}
                    />
                    <div>
                      <p className={f.done ? "text-sm line-through text-[var(--muted)]" : "text-sm font-medium"}>
                        {formatDate(f.dueAt)}
                      </p>
                      {f.note && <p className="text-xs text-[var(--muted)]">{f.note}</p>}
                    </div>
                  </div>
                  <button onClick={() => run(() => deleteFollowUp(f.id))} className="text-[var(--muted)] hover:text-rose-500">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <AddFollowUpForm applicationId={app.id} onAdded={refresh} />
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {app.interactions.length === 0 && (
                <p className="py-6 text-center text-sm text-[var(--muted)]">Aucun historique pour le moment.</p>
              )}
              {app.interactions.map((i) => (
                <li key={i.id} className="flex gap-3 border-l-2 border-[var(--border-subtle)] pl-3">
                  <div>
                    <p className="text-sm">{i.content}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {INTERACTION_TYPE_META[i.type]?.label ?? i.type} · {formatDate(i.occurredAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <AddNoteForm applicationId={app.id} onAdded={refresh} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function DocumentRow({ doc, onChange }: { doc: ApplicationWithRelations["documents"][number]; onChange: () => void }) {
  const [editingLink, setEditingLink] = React.useState(false);
  const [link, setLink] = React.useState(doc.link ?? "");

  return (
    <li className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] px-3 py-2.5">
      <Checkbox
        checked={doc.checked}
        onCheckedChange={async (v) => {
          await toggleDocument(doc.id, v === true);
          onChange();
        }}
      />
      <span className={doc.checked ? "flex-1 text-sm line-through text-[var(--muted)]" : "flex-1 text-sm"}>
        {doc.label}
      </span>
      {editingLink ? (
        <form
          className="flex items-center gap-1"
          action={async () => {
            await updateDocumentLink(doc.id, link);
            setEditingLink(false);
            onChange();
          }}
        >
          <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Lien du fichier" className="h-7 w-40 text-xs" />
          <button type="submit" className="text-[var(--accent)]">
            <Check className="h-4 w-4" />
          </button>
        </form>
      ) : doc.link ? (
        <a href={doc.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-[var(--accent)] hover:underline">
          Voir le fichier
        </a>
      ) : (
        <button onClick={() => setEditingLink(true)} className="text-xs text-[var(--muted)] hover:text-[var(--accent)]">
          + lien
        </button>
      )}
      <button
        onClick={async () => {
          await deleteDocument(doc.id);
          onChange();
        }}
        className="text-[var(--muted)] hover:text-rose-500"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  );
}

function AddDocumentForm({ applicationId, onAdded }: { applicationId: string; onAdded: () => void }) {
  const [label, setLabel] = React.useState("");
  return (
    <form
      className="flex gap-2"
      action={async () => {
        if (!label.trim()) return;
        await addDocument(applicationId, label.trim());
        setLabel("");
        onAdded();
      }}
    >
      <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ajouter un document (ex: Autre certificat)" />
      <Button type="submit" size="icon" variant="subtle">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}

function AddFollowUpForm({ applicationId, onAdded }: { applicationId: string; onAdded: () => void }) {
  const [date, setDate] = React.useState("");
  const [note, setNote] = React.useState("");
  return (
    <form
      className="flex gap-2"
      action={async () => {
        if (!date) return;
        await createFollowUp(applicationId, date, note);
        setDate("");
        setNote("");
        onAdded();
      }}
    >
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" required />
      <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optionnel)" />
      <Button type="submit" size="icon" variant="subtle">
        <Bell className="h-4 w-4" />
      </Button>
    </form>
  );
}

function AddNoteForm({ applicationId, onAdded }: { applicationId: string; onAdded: () => void }) {
  const [content, setContent] = React.useState("");
  return (
    <form
      className="flex gap-2"
      action={async () => {
        if (!content.trim()) return;
        await addInteraction(applicationId, "NOTE", content.trim());
        setContent("");
        onAdded();
      }}
    >
      <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Ajouter une note à l'historique" />
      <Button type="submit" size="icon" variant="subtle">
        <StickyNote className="h-4 w-4" />
      </Button>
    </form>
  );
}
