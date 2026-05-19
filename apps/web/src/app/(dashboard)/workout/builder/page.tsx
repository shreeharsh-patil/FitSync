import { auth } from "@/auth";
import { WorkoutBuilder } from "@/components/workout/WorkoutBuilder";
import { redirect } from "next/navigation";

export default async function WorkoutBuilderPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return <WorkoutBuilder userId={session.user.id} />;
}
