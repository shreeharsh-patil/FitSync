import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CommunityFeedClient } from "./CommunityFeedClient";
import { Users } from "lucide-react";
import db from "@/lib/db";

export default async function CommunityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let user = null;
  let otherUsers: any[] = [];
  let initialFollowingIds: string[] = [];

  if (session?.user?.id) {
    user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    const otherUsersRaw = await db.user.findMany({
      where: { id: { not: session.user.id } },
      take: 5,
    });

    otherUsers = otherUsersRaw.map(u => ({
      id: u.id,
      name: u.name || "Athlete",
      role: u.fitnessGoal ? `${u.fitnessGoal.charAt(0).toUpperCase() + u.fitnessGoal.slice(1).toLowerCase()} Athlete` : "Standard Athlete",
      avatar: (u.name || "Athlete").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
    }));

    const follows = await db.follows.findMany({
      where: { followerId: session.user.id }
    });
    initialFollowingIds = follows.map(f => f.followingId);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight flex items-center gap-3 text-white">
            <Users className="h-8 w-8 text-accent animate-pulse" />
            Community feed
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect, compete, and celebrate performance milestones with the FitSync family.
          </p>
        </div>
      </div>

      <CommunityFeedClient 
        user={user} 
        otherUsers={otherUsers}
        initialFollowingIds={initialFollowingIds}
      />
    </div>
  );
}

