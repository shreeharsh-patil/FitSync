import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { CoachingClient } from "./CoachingClient";

export default async function CoachingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true },
  });
  if (!user) redirect("/login");

  const rawSessions = await db.coachingSession.findMany({
    where: {
      OR: [{ clientId: user.id }, { trainerId: user.id }],
    },
    include: {
      trainer: { select: { id: true, name: true, image: true } },
      client: { select: { id: true, name: true, image: true } },
    },
    orderBy: { startTime: "desc" },
    take: 20,
  });

  const sessions = rawSessions.map((s) => ({
    id: s.id,
    trainerId: s.trainerId,
    clientId: s.clientId,
    startTime: s.startTime.toISOString(),
    endTime: s.endTime?.toISOString() ?? null,
    status: s.status,
    sessionType: s.sessionType,
    trainer: s.trainer,
    client: s.client,
  }));

  const trainers = await db.user.findMany({
    where: { role: "TRAINER" },
    select: { id: true, name: true, image: true },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight">Live Coaching</h1>
        <p className="text-muted-foreground mt-2">Schedule and join one-on-one coaching sessions with expert trainers.</p>
      </div>

      <CoachingClient sessions={sessions} trainers={trainers} userId={user.id} userRole={user.role} />
    </div>
  );
}
