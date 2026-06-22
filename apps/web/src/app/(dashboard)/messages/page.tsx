import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MessagesClient } from "./MessagesClient";
import db from "@/lib/db";
import { getConversations } from "@/lib/actions";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const conversations = await getConversations(session.user.id);

  const allUsers = await db.user.findMany({
    where: { id: { not: session.user.id } },
    select: { id: true, name: true, fitnessGoal: true },
    take: 20,
  });

  const contacts = allUsers.map((u) => ({
    id: u.id,
    name: u.name || "Athlete",
    role: u.fitnessGoal
      ? `${u.fitnessGoal.charAt(0).toUpperCase() + u.fitnessGoal.slice(1).toLowerCase()} Athlete`
      : "Athlete",
    avatar: (u.name || "Athlete").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "A",
    status: "offline" as const,
    lastMessage: conversations.find((c) => c.id === u.id)?.lastMessage || undefined,
    unread: false,
  }));

  return (
    <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      <div className="space-y-2 shrink-0">
        <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight text-white">
          Direct <span className="text-secondary">Messages</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">
          Real-time communications with your training network.
        </p>
      </div>

      <MessagesClient user={session.user} contacts={contacts} currentUserId={session.user.id} />
    </div>
  );
}
