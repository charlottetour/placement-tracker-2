import type { Prisma } from "@prisma/client";

export type ApplicationWithRelations = Prisma.ApplicationGetPayload<{
  include: { company: true; documents: true; followUps: true; interactions: true };
}>;

export type CompanyOption = { id: string; name: string; sector: string | null; city: string | null; country: string | null };
