import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { TeamsClient } from "./TeamsClient";
import { getTeams } from "@/lib/corporate";

export default async function TeamsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true },
  });
  if (!user) redirect("/login");

  const orgMember = await db.orgMember.findFirst({
    where: { userId: user.id },
    include: { organization: true, team: true },
  });

  if (!orgMember) redirect("/corporate");

  const teams = await getTeams(orgMember.orgId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight">Team Management</h1>
        <p className="text-muted-foreground mt-2">{orgMember.organization.name}</p>
      </div>

      <TeamsClient
        teams={teams}
        orgId={orgMember.orgId}
        currentTeamId={orgMember.teamId}
        userId={user.id}
      />
    </div>
  );
}
