import { getAdminAnalytics } from "@/lib/admin-actions";
import { AnalyticsClient } from "./AnalyticsClient";

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalytics();
  return <AnalyticsClient data={data} />;
}
