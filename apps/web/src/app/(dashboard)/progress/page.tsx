import { auth } from "@/auth";
import { getProgressEntries } from "@/lib/actions";
import { redirect } from "next/navigation";
import { ProgressTrackerClient } from "./ProgressTrackerClient";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const entries = await getProgressEntries(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight">
          Progress Tracking
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualise your transformation and celebrate every consistency win.
        </p>
      </div>

      <ProgressTrackerClient initialEntries={entries} userId={session.user.id} />
    </div>
  );
}
