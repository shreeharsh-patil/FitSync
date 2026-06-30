import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getIntegrationStatus } from "@/lib/actions";
import { IntegrationsClient } from "./IntegrationsClient";

export const metadata = {
  title: "Integrations",
  description: "Connect your wearable devices and health platforms",
};

export default async function IntegrationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [statuses] = await Promise.all([getIntegrationStatus(session.user.id)]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect your wearable devices and health platforms</p>
      </div>
      <IntegrationsClient userId={session.user.id} initialStatuses={statuses} />
    </div>
  );
}
