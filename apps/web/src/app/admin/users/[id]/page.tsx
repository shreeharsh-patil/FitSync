import { getUserById, getUserActivity } from "@/lib/admin-actions";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Mail,
  Calendar,
  Shield,
  Activity,
  Dumbbell,
  Apple,
  FileText,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { UserDetailClient } from "./UserDetailClient";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();

  const activity = await getUserActivity(id);

  return (
    <div className="p-8 space-y-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors font-bold"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Users
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold text-white">
          {user.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-heading">{user.name || "Unknown User"}</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              {user.email || "No email"}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-lg",
              user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                ? "bg-accent/10 text-accent"
                : user.role === "TRAINER"
                ? "bg-secondary/10 text-secondary"
                : "bg-white/5 text-muted-foreground"
            )}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Dumbbell} label="Workouts" value={user._count?.workoutLogs || 0} />
        <StatCard icon={Apple} label="Meals Logged" value={user._count?.nutritionLogs || 0} />
        <StatCard icon={FileText} label="Blog Posts" value={user._count?.blogPosts || 0} />
        <StatCard icon={CreditCard} label="Subscriptions" value={user._count?.subscriptions || 0} />
      </div>

      <UserDetailClient user={user} activity={activity} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <Card className="p-5 glass border-white/5 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="text-xl font-bold font-heading mt-0.5">{value}</p>
        </div>
      </div>
    </Card>
  );
}
