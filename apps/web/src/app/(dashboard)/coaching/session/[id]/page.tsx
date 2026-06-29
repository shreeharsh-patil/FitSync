import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { SessionRoomClient } from "./SessionRoomClient";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const coachingSession = await db.coachingSession.findUnique({
    where: { id },
    include: {
      trainer: { select: { id: true, name: true, image: true } },
      client: { select: { id: true, name: true, image: true } },
    },
  });

  if (!coachingSession) notFound();

  const isParticipant = coachingSession.clientId === session.user.id || coachingSession.trainerId === session.user.id;
  if (!isParticipant) redirect("/coaching");

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <SessionRoomClient session={coachingSession} userId={session.user.id} />
    </div>
  );
}
