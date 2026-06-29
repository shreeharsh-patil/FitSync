import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTrainers } from "@/lib/actions";
import { TrainersClient } from "./TrainersClient";

export default async function TrainersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const trainers = await getTrainers();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <TrainersClient trainers={trainers} currentUserId={session.user.id} />
    </div>
  );
}
