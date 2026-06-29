import { getUsers } from "@/lib/admin-actions";
import { UsersClient } from "./UsersClient";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const search = sp.search || "";
  const role = sp.role || "ALL";

  const data = await getUsers(page, search, role);

  return <UsersClient initialData={data} searchParams={{ page, search, role }} />;
}
