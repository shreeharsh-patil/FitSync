import { getPosts } from "@/lib/admin-actions";
import { BlogClient } from "./BlogClient";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const status = sp.status || "ALL";

  const data = await getPosts(page, status);

  return <BlogClient initialData={data} />;
}
