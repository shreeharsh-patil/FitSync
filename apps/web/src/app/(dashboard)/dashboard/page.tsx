import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

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

  // Query user's workouts to find active routine
  const userWorkouts = await db.workout.findMany({
    where: { userId: session.user.id },
    take: 1,
  });
  const activeWorkoutId = userWorkouts[0]?.id;

  return (
    <div className="p-4 sm:p-8 space-y-8 sm:space-y-12">
      <DashboardClient user={user} activeWorkoutId={activeWorkoutId} />
    </div>
  );
}
