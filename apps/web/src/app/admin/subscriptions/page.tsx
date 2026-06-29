import { getSubscriptions } from "@/lib/admin-actions";
import { SubscriptionsClient } from "./SubscriptionsClient";

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const status = sp.status || "ALL";

  const data = await getSubscriptions(page, status);

  return <SubscriptionsClient initialData={data} />;
}
