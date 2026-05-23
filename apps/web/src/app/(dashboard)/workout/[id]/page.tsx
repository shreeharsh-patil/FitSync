import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ActiveWorkoutTracker } from "./ActiveWorkoutTracker";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkoutDetailPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const workout = await db.workout.findUnique({
    where: { id: resolvedParams.id },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!workout) {
    notFound();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <ActiveWorkoutTracker workout={workout} userId={session.user.id} />
    </div>
  );
}
