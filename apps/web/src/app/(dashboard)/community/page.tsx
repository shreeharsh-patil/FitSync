import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CommunityFeedClient } from "./CommunityFeedClient";
import { Users } from "lucide-react";

export default async function CommunityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight flex items-center gap-3 text-white">
            <Users className="h-8 w-8 text-accent animate-pulse" />
            Community feed
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect, compete, and celebrate performance milestones with the FitSync family.
          </p>
        </div>
      </div>

      <CommunityFeedClient />
    </div>
  );
}
