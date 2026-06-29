"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { updateUserRole, deleteUser } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import {
  Shield,
  Dumbbell,
  Apple,
  FileText,
  CreditCard,
  Trash2,
  Save,
  Activity,
} from "lucide-react";

export function UserDetailClient({ user, activity }: { user: any; activity: any }) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const handleSaveRole = async () => {
    setSaving(true);
    const res = await updateUserRole(user.id, role);
    setSaving(false);
    if (res.success) {
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this user permanently? This action cannot be undone.")) return;
    const res = await deleteUser(user.id);
    if (res.success) {
      router.push("/admin/users");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
        <h2 className="text-lg font-bold font-heading flex items-center gap-2">
          <Shield className="h-4 w-4 text-secondary" />
          Role Management
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
              Current Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-secondary/40"
            >
              <option value="USER">User</option>
              <option value="TRAINER">Trainer</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <Button
            onClick={handleSaveRole}
            disabled={saving || role === user.role}
            className="w-full bg-secondary text-primary font-bold rounded-xl h-10"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Role"}
          </Button>
        </div>

        <div className="border-t border-white/5 pt-6">
          <h3 className="text-sm font-bold text-red-400 mb-3">Danger Zone</h3>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="w-full rounded-xl h-10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </Button>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Account Info</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-[9px]">{user.id.slice(0, 12)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email Verified</span>
              <span>{user.emailVerified ? new Date(user.emailVerified).toLocaleDateString() : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Public Profile</span>
              <span>{user.isPublic ? "Yes" : "No"}</span>
            </div>
            {user.stripeCustomerId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stripe Customer</span>
                <span className="font-mono text-[9px]">Linked</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="xl:col-span-2 space-y-6">
        {activity.workoutLogs.length > 0 && (
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-4">
            <h2 className="text-lg font-bold font-heading flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-secondary" />
              Recent Workouts
            </h2>
            <div className="space-y-2">
              {activity.workoutLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div>
                    <p className="text-xs font-bold">{new Date(log.logDate).toLocaleDateString()}</p>
                    <p className="text-[10px] text-muted-foreground">{log.durationMins ? `${log.durationMins} mins` : "No duration"}</p>
                  </div>
                  <span className="text-xs font-bold text-secondary">{log.caloriesBurned ? `${log.caloriesBurned} kcal` : "--"}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activity.nutritionLogs.length > 0 && (
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-4">
            <h2 className="text-lg font-bold font-heading flex items-center gap-2">
              <Apple className="h-4 w-4 text-accent" />
              Recent Meals
            </h2>
            <div className="space-y-2">
              {activity.nutritionLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div>
                    <p className="text-xs font-bold">
                      {new Date(log.logDate).toLocaleDateString()} - {log.mealType}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-accent">{log.totalCalories} kcal</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {user.subscriptions?.length > 0 && (
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-4">
            <h2 className="text-lg font-bold font-heading flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-secondary" />
              Subscriptions
            </h2>
            <div className="space-y-2">
              {user.subscriptions.map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div>
                    <p className="text-xs font-bold capitalize">{sub.plan} Plan</p>
                    <p className="text-[10px] text-muted-foreground">
                      {sub.status} — ends {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md",
                    sub.status === "ACTIVE" ? "text-secondary bg-secondary/10" : "text-muted-foreground bg-white/5"
                  )}>
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activity.posts.length > 0 ? (
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-4">
            <h2 className="text-lg font-bold font-heading flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Blog Posts
            </h2>
            <div className="space-y-2">
              {activity.posts.map((post: any) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div>
                    <p className="text-xs font-bold">{post.title}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md",
                    post.status === "PUBLISHED" ? "text-secondary bg-secondary/10" :
                    post.status === "DRAFT" ? "text-yellow-400 bg-yellow-400/10" : "text-muted-foreground bg-white/5"
                  )}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-8 glass border-white/5 rounded-[2.5rem]">
            <div className="text-center py-8">
              <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
