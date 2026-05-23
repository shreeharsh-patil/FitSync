import { auth } from "@/auth";
import { getNutritionLogs } from "@/lib/actions";
import { redirect } from "next/navigation";
import { NutritionTrackerClient } from "./NutritionTrackerClient";

export default async function NutritionPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const logs = await getNutritionLogs(session.user.id, new Date());

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight">
          Nutrition Tracking
        </h1>
        <p className="text-muted-foreground mt-2">
          Fuel your performance and track your macros in real-time.
        </p>
      </div>

      <NutritionTrackerClient initialLogs={logs} userId={session.user.id} />
    </div>
  );
}
