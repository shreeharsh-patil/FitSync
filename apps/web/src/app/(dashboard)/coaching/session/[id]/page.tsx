import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { SessionRoomClient } from "./SessionRoomClient";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rawSession = await db.coachingSession.findUnique({
    where: { id },
    include: {
      trainer: { select: { id: true, name: true, image: true } },
      client: { select: { id: true, name: true, image: true } },
    },
  });

  if (!rawSession) notFound();

  const isParticipant = rawSession.clientId === session.user.id || rawSession.trainerId === session.user.id;
  if (!isParticipant) redirect("/coaching");

  const coachingSession = {
    id: rawSession.id,
    trainerId: rawSession.trainerId,
    clientId: rawSession.clientId,
    startTime: rawSession.startTime.toISOString(),
    endTime: rawSession.endTime?.toISOString() ?? null,
    status: rawSession.status,
    sessionType: rawSession.sessionType,
    trainer: rawSession.trainer,
    client: rawSession.client,
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <SessionRoomClient session={coachingSession} userId={session.user.id} />
    </div>
  );
}
