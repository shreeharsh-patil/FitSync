import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AIMealPlanClient } from "./AIMealPlanClient";
import { getMealPlans } from "@/lib/actions";

export default async function AIMealPlanPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const mealPlans = await getMealPlans(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight">
          AI Meal Planning
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate personalized weekly meal plans powered by AI.
        </p>
      </div>

      <AIMealPlanClient userId={session.user.id} initialPlans={mealPlans} />
    </div>
  );
}
