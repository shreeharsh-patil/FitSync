import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { CorporateDashboardClient } from "./CorporateDashboardClient";
import { getCorporateDashboard, getDepartmentLeaderboard } from "@/lib/corporate";

export default async function CorporatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true },
  });
  if (!user) redirect("/login");

  const orgMember = await db.orgMember.findFirst({
    where: { userId: user.id },
    include: { organization: true, team: true },
  });

  if (!orgMember) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight">Corporate Wellness</h1>
          <p className="text-muted-foreground mt-2">Company-wide fitness tracking and team challenges.</p>
        </div>
        <CorporateDashboardClient org={null} dashboard={null} leaderboard={null} userId={user.id} />
      </div>
    );
  }

  const dashboard = await getCorporateDashboard(orgMember.orgId);
  const leaderboard = await getDepartmentLeaderboard(orgMember.orgId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight">{orgMember.organization.name}</h1>
        <p className="text-muted-foreground mt-2">Corporate Wellness Platform</p>
      </div>

      <CorporateDashboardClient
        org={orgMember}
        dashboard={dashboard}
        leaderboard={leaderboard}
        userId={user.id}
      />
    </div>
  );
}
