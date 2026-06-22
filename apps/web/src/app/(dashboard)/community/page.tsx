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
  let challenges: any[] = [];
  let joinedChallengeIds: string[] = [];

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

    const dbChallenges = await db.challenge.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const participation = await db.challengeParticipant.findMany({
      where: { userId: session.user.id },
    });
    joinedChallengeIds = participation.map(p => p.challengeId);

    challenges = dbChallenges.map(c => ({
      id: c.id,
      title: c.title,
      participantCount: c.participantCount,
    }));
  }

  const dbPosts = await db.post.findMany({
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const initialPosts = dbPosts.map((p) => ({
    id: p.id,
    author: p.user.name || "Athlete",
    role: p.user.fitnessGoal ? `${p.user.fitnessGoal.charAt(0).toUpperCase() + p.user.fitnessGoal.slice(1).toLowerCase()} Athlete` : "Standard Athlete",
    avatar: (p.user.name || "Athlete").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
    time: new Date(p.createdAt).toLocaleDateString() + " " + new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    content: p.content,
    likesCount: p.likesCount,
    commentsCount: p.commentsCount,
    isLikedByUser: false,
    comments: p.comments.map((c) => ({
      author: c.user.name || "Athlete",
      avatar: (c.user.name || "Athlete").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      content: c.content,
      time: new Date(c.createdAt).toLocaleDateString(),
    })),
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight flex items-center gap-3 text-white">
            <Users className="h-8 w-8 text-accent" />
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
        initialPosts={initialPosts}
        challenges={challenges}
        initialJoinedChallengeIds={joinedChallengeIds}
      />
    </div>
  );
}
