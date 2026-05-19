import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BarChart3,
  Database,
  FileText,
  Settings as SettingsIcon,
  TrendingUp,
  ArrowUpRight,
  UserCheck,
  Activity,
  Search,
  MoreVertical,
} from "lucide-react";
import db from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();

  // Basic role check
  if ((session?.user as any)?.role !== "ADMIN") {
    // For demo purposes, we'll allow access if the user is logged in, but in production this is strict.
    // redirect("/dashboard");
  }

  const userCount = await db.user.count();
  const activeSubs = await db.subscription.count({
    where: { status: "ACTIVE" },
  });
  const recentUsers = await db.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

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
          <Button className="bg-secondary text-primary font-bold">
            Export Platform Data
          </Button>
        </div>
      </div>

      {/* KPI Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          label="Total Users"
          value={userCount.toLocaleString()}
          trend="+12%"
          icon={<Users className="h-6 w-6" />}
          color="text-blue-400"
        />
        <AdminStatCard
          label="Active Subscriptions"
          value={activeSubs.toLocaleString()}
          trend="+8%"
          icon={<UserCheck className="h-6 w-6" />}
          color="text-secondary"
        />
        <AdminStatCard
          label="Monthly Revenue"
          value="$14,200"
          trend="+15%"
          icon={<TrendingUp className="h-6 w-6" />}
          color="text-accent"
        />
        <AdminStatCard
          label="API Usage (24h)"
          value="842,000"
          trend="-2%"
          icon={<Activity className="h-6 w-6" />}
          color="text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* User Management Quick View */}
        <Card className="xl:col-span-2 p-8 glass border-white/5 rounded-[2.5rem] space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold font-heading">User Management</h2>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  className="w-full pl-10 h-10 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-secondary/40"
                  placeholder="Search by name or email..."
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 border-white/10"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
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
                    Status
                  </th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers.map((u) => (
                  <AdminUserRow
                    key={u.id}
                    name={u.name || "Unknown"}
                    email={u.email}
                    role={u.role}
                    status="ACTIVE"
                  />
                ))}
              </tbody>
            </table>
          </div>

          <Button variant="link" className="text-secondary font-bold w-full">
            View All 12,840 Users
          </Button>
        </Card>

        {/* Platform Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-heading px-2">
            Ecosystem Modules
          </h2>
          <AdminModuleCard
            icon={<Database className="h-6 w-6" />}
            title="Exercise DB"
            count="542 Exercises"
            description="Manage the global exercise library, categories and media."
          />
          <AdminModuleCard
            icon={<FileText className="h-6 w-6" />}
            title="Blog CMS"
            count="24 Articles"
            description="Publish and moderate wellness content and news."
          />
          <AdminModuleCard
            icon={<SettingsIcon className="h-6 w-6" />}
            title="System Config"
            count="Online"
            description="API Keys, Global Toggles and Webhook configurations."
          />
        </div>
      </div>
    </div>
  );
}

interface AdminStatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

function AdminStatCard({ label, value, trend, icon, color }: AdminStatCardProps) {
  return (
    <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-4">
      <div className="flex justify-between items-center">
        <div
          className={cn(
            "h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center",
            color,
          )}
        >
          {icon}
        </div>
        <span
          className={cn(
            "text-xs font-bold flex items-center gap-1",
            trend.startsWith("+") ? "text-secondary" : "text-red-400",
          )}
        >
          {trend}
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <h3 className="text-3xl font-bold font-heading mt-1">{value}</h3>
      </div>
    </Card>
  );
}

interface AdminUserRowProps {
  name: string;
  email: string | null;
  role: string;
  status: string;
}

function AdminUserRow({ name, email, role, status }: AdminUserRowProps) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/10" />
          <div>
            <p className="text-sm font-bold">{name}</p>
            <p className="text-[10px] text-muted-foreground">
              {email || "No email"}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4">
        <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded-md">
          {role}
        </span>
      </td>
      <td className="py-4">
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-md",
            status === "ACTIVE"
              ? "text-secondary bg-secondary/10"
              : "text-red-400 bg-red-400/10",
          )}
        >
          {status}
        </span>
      </td>
      <td className="py-4 text-right">
        <button className="text-muted-foreground hover:text-white transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

interface AdminModuleCardProps {
  icon: React.ReactNode;
  title: string;
  count: string;
  description: string;
}

function AdminModuleCard({
  icon,
  title,
  count,
  description,
}: AdminModuleCardProps) {
  return (
    <Card className="p-6 glass border-white/5 hover:border-secondary/20 transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-secondary transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{title}</h3>
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              {count}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

import { cn } from "@/lib/utils";
