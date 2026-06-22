import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { getUserActivityAndStreak, getDashboardMetrics } from "@/lib/actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  const userWorkouts = await db.workout.findMany({
    where: { userId: session.user.id },
    take: 1,
  });
  const activeWorkoutId = userWorkouts[0]?.id;

  const streakDetails = await getUserActivityAndStreak(session.user.id);
  const metrics = await getDashboardMetrics(session.user.id);

  const allWorkoutLogs = await db.workoutLog.findMany({
    where: { userId: session.user.id },
    orderBy: { logDate: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-8 sm:space-y-12">
      <DashboardClient 
        user={user} 
        activeWorkoutId={activeWorkoutId} 
        streakDetails={streakDetails}
        metrics={metrics}
        workoutLogs={allWorkoutLogs}
      />
    </div>
  );
}
