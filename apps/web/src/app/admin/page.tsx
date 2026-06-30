import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BarChart3,
  Database,
  FileText,
  TrendingUp,
  ArrowUpRight,
  UserCheck,
  Activity,
  Search,
  MoreVertical,
  DollarSign,
  Dumbbell,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAdminStats } from "@/lib/admin-actions";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="p-8 space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Platform governance and ecosystem health monitoring.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5 font-bold"
          >
            System Status: <span className="text-secondary ml-2">Healthy</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          trend={`+${stats.newUsers}`}
          icon={<Users className="h-6 w-6" />}
          color="text-blue-400"
        />
        <AdminStatCard
          label="Active Subscriptions"
          value={stats.activeSubscriptions.toLocaleString()}
          trend={`+${Math.round((stats.activeSubscriptions / Math.max(stats.totalUsers, 1)) * 100)}%`}
          icon={<UserCheck className="h-6 w-6" />}
          color="text-secondary"
        />
        <AdminStatCard
          label="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          trend="Active"
          icon={<DollarSign className="h-6 w-6" />}
          color="text-accent"
        />
        <AdminStatCard
          label="Exercise Library"
          value={stats.totalExercises.toLocaleString()}
          trend={`${stats.totalPosts} Posts`}
          icon={<Database className="h-6 w-6" />}
          color="text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 p-8 glass border-white/5 rounded-[2.5rem] space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold font-heading">User Management</h2>
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5 font-bold text-xs h-9"
              >
                View All Users
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    User
                  </th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Role
                  </th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Joined
                  </th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentUsers.map((u: any) => (
                  <AdminUserRow
                    key={u.id}
                    id={u.id}
                    name={u.name || "Unknown"}
                    email={u.email}
                    role={u.role}
                    createdAt={u.createdAt}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <Link href="/admin/users" className="block w-full">
            <Button variant="link" className="text-secondary font-bold w-full">
              View All {stats.totalUsers.toLocaleString()} Users
            </Button>
          </Link>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-heading px-2">
            Ecosystem Modules
          </h2>
          <AdminModuleCard
            icon={<Dumbbell className="h-6 w-6" />}
            title="Exercise DB"
            count={`${stats.totalExercises} Exercises`}
            description="Manage the global exercise library, categories and media."
            href="/admin/exercises"
          />
          <AdminModuleCard
            icon={<FileText className="h-6 w-6" />}
            title="Blog CMS"
            count={`${stats.totalPosts} Articles`}
            description="Publish and moderate wellness content and news."
            href="/admin/blog"
          />
          <AdminModuleCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Analytics"
            count="Reports"
            description="View platform metrics, user growth and revenue."
            href="/admin/analytics"
          />
          <AdminModuleCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Subscriptions"
            count={`${stats.activeSubscriptions} Active`}
            description="Manage plans and view billing overview."
            href="/admin/subscriptions"
          />
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ label, value, trend, icon, color }: {
  label: string; value: string; trend: string; icon: React.ReactNode; color: string;
}) {
  return (
    <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-4">
      <div className="flex justify-between items-center">
        <div className={cn("h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center", color)}>
          {icon}
        </div>
        <span className={cn("text-xs font-bold flex items-center gap-1", trend.startsWith("-") ? "text-red-400" : "text-secondary")}>
          {trend}
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <h3 className="text-3xl font-bold font-heading mt-1">{value}</h3>
      </div>
    </Card>
  );
}

function AdminUserRow({ id, name, email, role, createdAt }: {
  id: string; name: string; email: string | null; role: string; createdAt: Date;
}) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="py-4">
        <Link href={`/admin/users/${id}`} className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold">{name}</p>
            <p className="text-[10px] text-muted-foreground">{email || "No email"}</p>
          </div>
        </Link>
      </td>
      <td className="py-4">
        <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded-md">{role}</span>
      </td>
      <td className="py-4">
        <span className="text-[10px] text-muted-foreground">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </td>
      <td className="py-4 text-right">
        <Link href={`/admin/users/${id}`}>
          <button className="text-muted-foreground hover:text-white transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </Link>
      </td>
    </tr>
  );
}

function AdminModuleCard({ icon, title, count, description, href }: {
  icon: React.ReactNode; title: string; count: string; description: string; href: string;
}) {
  return (
    <Link href={href}>
      <Card className="p-6 glass border-white/5 hover:border-secondary/20 transition-all group cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-secondary transition-colors">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{title}</h3>
              <span className="text-[10px] font-bold uppercase text-muted-foreground">{count}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
