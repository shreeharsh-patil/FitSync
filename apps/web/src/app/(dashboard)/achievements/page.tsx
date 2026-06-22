import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { getUserActivityAndStreak, getUserAchievements } from "@/lib/actions";
import { AchievementVaultClient } from "./AchievementVaultClient";

export default async function AchievementsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  const achievements = await getUserAchievements(session.user.id);
  const streakData = await getUserActivityAndStreak(session.user.id);

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight text-white">
          Achievement <span className="text-secondary">Vault</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">
          Track your unlocked badges and performance milestones.
        </p>
      </div>

      <AchievementVaultClient 
        user={session.user} 
        dbUser={user}
        achievements={achievements}
        streak={streakData.streak}
      />
    </div>
  );
}
