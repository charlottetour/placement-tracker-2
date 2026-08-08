import { prisma } from "@/lib/prisma";

export async function getCalendarData() {
  const followUps = await prisma.followUp.findMany({
    where: { done: false },
    include: { application: { include: { company: true } } },
    orderBy: { dueAt: "asc" },
  });

  const applications = await prisma.application.findMany({
    where: { deadlineAt: { not: null }, status: { notIn: ["ACCEPTE", "REFUSE", "ABANDONNE"] } },
    include: { company: true },
    orderBy: { deadlineAt: "asc" },
  });

  const interviews = await prisma.application.findMany({
    where: { status: "ENTRETIEN" },
    include: { company: true },
    orderBy: { updatedAt: "desc" },
  });

  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const overdueFollowUps = followUps.filter((f) => f.dueAt <= endOfToday);
  const upcomingFollowUps = followUps.filter((f) => f.dueAt > endOfToday);

  const overdueDeadlines = applications.filter((a) => a.deadlineAt! <= endOfToday && !a.sentAt);
  const upcomingDeadlines = applications.filter((a) => a.deadlineAt! > endOfToday);

  return { overdueFollowUps, upcomingFollowUps, overdueDeadlines, upcomingDeadlines, interviews };
}
