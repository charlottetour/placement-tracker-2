"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_DOCUMENT_LABELS } from "@/lib/constants";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/candidatures");
  revalidatePath("/entreprises");
  revalidatePath("/contacts");
  revalidatePath("/documents");
  revalidatePath("/calendrier");
}

function toDate(value: FormDataEntryValue | null | undefined) {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  return new Date(value);
}

function toStr(value: FormDataEntryValue | null | undefined) {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

// ---------- Reads (server actions callable from client components) ----------

export async function getCompanyOptions() {
  return prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}

export async function getExportData() {
  const companies = await prisma.company.findMany({
    include: {
      contacts: true,
      applications: { include: { documents: true, followUps: true, interactions: true } },
    },
  });
  return { exportedAt: new Date().toISOString(), companies };
}

export async function resetAllData() {
  await prisma.interaction.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.documentItem.deleteMany();
  await prisma.application.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  revalidateAll();
}

// ---------- Companies ----------

export async function createCompany(input: {
  name: string;
  sector?: string | null;
  city?: string | null;
  country?: string | null;
  website?: string | null;
  notes?: string | null;
}) {
  const company = await prisma.company.create({ data: { name: input.name, sector: input.sector, city: input.city, country: input.country, website: input.website, notes: input.notes } });
  revalidateAll();
  return company;
}

export async function updateCompany(id: string, formData: FormData) {
  await prisma.company.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? ""),
      sector: toStr(formData.get("sector")),
      city: toStr(formData.get("city")),
      country: toStr(formData.get("country")),
      website: toStr(formData.get("website")),
      notes: toStr(formData.get("notes")),
    },
  });
  revalidatePath(`/entreprises/${id}`);
  revalidateAll();
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({ where: { id } });
  revalidateAll();
}

// ---------- Contacts ----------

export async function createContact(formData: FormData) {
  const companyId = String(formData.get("companyId"));
  await prisma.contact.create({
    data: {
      companyId,
      firstName: String(formData.get("firstName") ?? ""),
      lastName: toStr(formData.get("lastName")),
      role: toStr(formData.get("role")),
      email: toStr(formData.get("email")),
      linkedin: toStr(formData.get("linkedin")),
      phone: toStr(formData.get("phone")),
      type: toStr(formData.get("type")) ?? "AUTRE",
      notes: toStr(formData.get("notes")),
      lastContactedAt: toDate(formData.get("lastContactedAt")),
    },
  });
  revalidatePath(`/entreprises/${companyId}`);
  revalidatePath("/contacts");
}

export async function updateContact(id: string, formData: FormData) {
  const contact = await prisma.contact.update({
    where: { id },
    data: {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: toStr(formData.get("lastName")),
      role: toStr(formData.get("role")),
      email: toStr(formData.get("email")),
      linkedin: toStr(formData.get("linkedin")),
      phone: toStr(formData.get("phone")),
      type: toStr(formData.get("type")) ?? "AUTRE",
      notes: toStr(formData.get("notes")),
      lastContactedAt: toDate(formData.get("lastContactedAt")),
    },
  });
  revalidatePath(`/entreprises/${contact.companyId}`);
  revalidatePath("/contacts");
}

export async function deleteContact(id: string, companyId: string) {
  await prisma.contact.delete({ where: { id } });
  revalidatePath(`/entreprises/${companyId}`);
  revalidatePath("/contacts");
}

// ---------- Applications ----------

export async function createApplication(input: {
  companyId?: string;
  newCompanyName?: string;
  newCompanySector?: string;
  newCompanyCity?: string;
  title: string;
  applicationType: string;
  link?: string;
  deadlineAt?: string;
}) {
  let companyId = input.companyId;
  if (!companyId && input.newCompanyName) {
    const company = await prisma.company.create({
      data: { name: input.newCompanyName, sector: input.newCompanySector || null, city: input.newCompanyCity || null },
    });
    companyId = company.id;
  }
  if (!companyId) throw new Error("Entreprise requise");

  const application = await prisma.application.create({
    data: {
      companyId,
      title: input.title,
      applicationType: input.applicationType,
      link: input.link || null,
      deadlineAt: input.deadlineAt ? new Date(input.deadlineAt) : null,
      discoveredAt: new Date(),
      status: "A_RECHERCHER",
      documents: {
        create: DEFAULT_DOCUMENT_LABELS.map((label, i) => ({ label, order: i })),
      },
      interactions: {
        create: { type: "NOTE", content: "Candidature créée." },
      },
    },
  });
  revalidateAll();
  revalidatePath(`/entreprises/${companyId}`);
  return application;
}

export async function updateApplication(id: string, formData: FormData) {
  const current = await prisma.application.findUniqueOrThrow({ where: { id } });
  const newStatus = toStr(formData.get("status")) ?? current.status;

  const data: Record<string, unknown> = {
    title: String(formData.get("title") ?? current.title),
    applicationType: toStr(formData.get("applicationType")) ?? current.applicationType,
    link: toStr(formData.get("link")),
    notes: toStr(formData.get("notes")),
    tags: toStr(formData.get("tags")),
    status: newStatus,
    discoveredAt: toDate(formData.get("discoveredAt")) ?? current.discoveredAt,
    deadlineAt: toDate(formData.get("deadlineAt")),
    sentAt: toDate(formData.get("sentAt")),
  };
  const priority = formData.get("priority");
  if (priority !== null) data.priority = Number(priority);

  await prisma.application.update({ where: { id }, data });

  if (newStatus !== current.status) {
    await prisma.interaction.create({
      data: {
        applicationId: id,
        type: "STATUS_CHANGE",
        content: `Statut changé.`,
      },
    });
  }

  revalidateAll();
  revalidatePath(`/entreprises/${current.companyId}`);
}

export async function setApplicationStatus(id: string, status: string) {
  const application = await prisma.application.update({ where: { id }, data: { status } });
  await prisma.interaction.create({
    data: { applicationId: id, type: "STATUS_CHANGE", content: `Statut changé.` },
  });
  revalidateAll();
  revalidatePath(`/entreprises/${application.companyId}`);
  return application;
}

export async function setApplicationPriority(id: string, priority: number) {
  const application = await prisma.application.update({ where: { id }, data: { priority } });
  revalidateAll();
  return application;
}

export async function deleteApplication(id: string) {
  const application = await prisma.application.findUniqueOrThrow({ where: { id } });
  await prisma.application.delete({ where: { id } });
  revalidateAll();
  revalidatePath(`/entreprises/${application.companyId}`);
}

export async function duplicateApplication(id: string) {
  const original = await prisma.application.findUniqueOrThrow({ where: { id }, include: { documents: true } });
  const copy = await prisma.application.create({
    data: {
      companyId: original.companyId,
      title: `${original.title} (copie)`,
      applicationType: original.applicationType,
      link: original.link,
      status: "A_RECHERCHER",
      priority: original.priority,
      tags: original.tags,
      discoveredAt: new Date(),
      documents: {
        create: original.documents.map((d, i) => ({ label: d.label, order: i })),
      },
    },
  });
  revalidateAll();
  return copy;
}

// ---------- Documents ----------

export async function addDocument(applicationId: string, label: string, link?: string) {
  await prisma.documentItem.create({ data: { applicationId, label, link: link || null } });
  revalidateAll();
}

export async function toggleDocument(id: string, checked: boolean) {
  const doc = await prisma.documentItem.update({ where: { id }, data: { checked } });
  revalidateAll();
  return doc;
}

export async function updateDocumentLink(id: string, link: string) {
  await prisma.documentItem.update({ where: { id }, data: { link: link || null } });
  revalidateAll();
}

export async function deleteDocument(id: string) {
  await prisma.documentItem.delete({ where: { id } });
  revalidateAll();
}

// ---------- Follow-ups ----------

export async function createFollowUp(applicationId: string, dueAt: string, note?: string) {
  await prisma.followUp.create({ data: { applicationId, dueAt: new Date(dueAt), note: note || null } });
  await prisma.interaction.create({
    data: { applicationId, type: "FOLLOWUP", content: `Relance planifiée.` },
  });
  revalidateAll();
}

export async function toggleFollowUp(id: string, done: boolean) {
  await prisma.followUp.update({ where: { id }, data: { done } });
  revalidateAll();
}

export async function deleteFollowUp(id: string) {
  await prisma.followUp.delete({ where: { id } });
  revalidateAll();
}

// ---------- Interactions ----------

export async function addInteraction(applicationId: string, type: string, content: string) {
  await prisma.interaction.create({ data: { applicationId, type, content } });
  revalidateAll();
}
