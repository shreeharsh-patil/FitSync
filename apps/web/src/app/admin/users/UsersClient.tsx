"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  Trash2,
  ArrowUpDown,
  MoreVertical,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { updateUserRole, deleteUser } from "@/lib/admin-actions";

interface UsersClientProps {
  initialData: {
    users: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  searchParams: {
    page: number;
    search: string;
    role: string;
  };
}

export function UsersClient({ initialData }: UsersClientProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialData.page);

  const fetchUsers = useCallback(async (p: number, s: string, r: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (s) params.set("search", s);
    if (r && r !== "ALL") params.set("role", r);
    router.push(`/admin/users?${params.toString()}`);

    const res = await fetch(`/admin/api/users?${params.toString()}`);
    const json = await res.json();
    setData(json);
    setPage(p);
    setLoading(false);
  }, [router]);

  // We need an API route for client-side fetching
  // Let's use a direct import approach instead
  const handleSearch = useCallback(async () => {
    setLoading(true);
    const res = await getUsers(1, search, role);
    setData(res);
    setPage(1);
    setLoading(false);
  }, [search, role]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateUserRole(userId, newRole);
    const res = await getUsers(page, search, role);
    setData(res);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    await deleteUser(userId);
    const res = await getUsers(page, search, role);
    setData(res);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage platform users, roles and permissions.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 h-10 bg-white/5 border-white/10 rounded-xl text-sm focus:outline-none focus:border-secondary/40"
          />
        </div>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); }}
          className="h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-muted-foreground focus:outline-none focus:border-secondary/40"
        >
          <option value="ALL">All Roles</option>
          <option value="USER">User</option>
          <option value="TRAINER">Trainer</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <Button onClick={handleSearch} disabled={loading} className="h-10 bg-secondary text-primary font-bold rounded-xl">
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subs</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Workouts</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Posts</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Joined</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.users.map((u: any) => (
                <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/users/${u.id}`} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {u.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{u.name || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground">{u.email || "No email"}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-lg",
                      u.role === "ADMIN" || u.role === "SUPER_ADMIN"
                        ? "bg-accent/10 text-accent"
                        : u.role === "TRAINER"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-white/5 text-muted-foreground"
                    )}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">{u._count?.subscriptions || 0}</td>
                  <td className="p-4 text-xs text-muted-foreground">{u._count?.workoutLogs || 0}</td>
                  <td className="p-4 text-xs text-muted-foreground">{u._count?.blogPosts || 0}</td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <select
                        value={u.role}
                        onChange={async (e) => {
                          const res = await updateUserRole(u.id, e.target.value);
                          if (res.success) {
                            const refreshed = await getUsers(page, search, role);
                            setData(refreshed);
                          }
                        }}
                        className="h-7 px-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-muted-foreground focus:outline-none"
                      >
                        <option value="USER">USER</option>
                        <option value="TRAINER">TRAINER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                      <button
                        onClick={async () => {
                          if (!confirm("Delete this user?")) return;
                          const res = await deleteUser(u.id);
                          if (res.success) {
                            const refreshed = await getUsers(page, search, role);
                            setData(refreshed);
                          }
                        }}
                        className="h-7 w-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                      >
                        <UserCog className="h-3 w-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {data.users.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {data.users.length} of {data.total} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={async () => {
                const res = await getUsers(page - 1, search, role);
                setData(res);
                setPage(page - 1);
              }}
              className="border-white/10 h-8 rounded-xl"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground font-bold px-2">
              Page {page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              onClick={async () => {
                const res = await getUsers(page + 1, search, role);
                setData(res);
                setPage(page + 1);
              }}
              className="border-white/10 h-8 rounded-xl"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

async function getUsers(page: number, search: string, role: string) {
  const mod = await import("@/lib/admin-actions");
  const res = await mod.getUsers(page, search, role);
  return res;
}
