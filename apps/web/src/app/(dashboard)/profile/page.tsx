import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileTrackerClient } from "./ProfileTrackerClient";

export default async function ProfilePage() {
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight">
          Athlete Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your biological specifications, metrics, and goals.
        </p>
      </div>

      <ProfileTrackerClient user={user} />
    </div>
  );
}
