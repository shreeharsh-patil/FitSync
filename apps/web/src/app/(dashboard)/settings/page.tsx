import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
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

  const subscription = await db.subscription.findFirst({
    where: { userId: session.user.id, status: "active" },
    orderBy: { currentPeriodEnd: "desc" },
  });

  const billingHistory = await db.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  let notificationPreferences = { workouts: true, hydration: true, community: false, aiDeloads: true };
  try {
    if (user.notificationPreferences) {
      notificationPreferences = JSON.parse(user.notificationPreferences);
    }
  } catch {}

  return (
    <SettingsClient
      user={user}
      subscription={subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      } : null}
      billingHistory={billingHistory.map(s => ({
        date: s.createdAt.toISOString(),
        plan: s.plan,
        amount: s.status === "active" ? "$9.99" : "$0.00",
      }))}
      notificationPreferences={notificationPreferences}
    />
  );
}
