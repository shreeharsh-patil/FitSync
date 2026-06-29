import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import {
  getTrainer,
  getUserFollowsTrainer,
  getTrainerPublicWorkouts,
} from "@/lib/actions";
import { TrainerProfileClient } from "./TrainerProfileClient";

export default async function TrainerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const trainer = await getTrainer(params.id);
  if (!trainer) notFound();

  const isFollowing = await getUserFollowsTrainer(
    session.user.id,
    params.id
  );
  const publicWorkouts = await getTrainerPublicWorkouts(params.id);

  // Check if user has already reviewed
  const existingReview = await db.testimonial.findFirst({
    where: { trainerId: params.id, userId: session.user.id },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <TrainerProfileClient
        trainer={trainer}
        currentUserId={session.user.id}
        isFollowing={isFollowing}
        publicWorkouts={publicWorkouts}
        existingReview={existingReview}
      />
    </div>
  );
}
