import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AchievementVaultClient } from "./AchievementVaultClient";

export default async function AchievementsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight text-white">
          Achievement <span className="text-secondary">Vault</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">
          Synchronize your milestones. View your platform rankings and unlocked performance badges.
        </p>
      </div>

      <AchievementVaultClient user={session.user} />
    </div>
  );
}
