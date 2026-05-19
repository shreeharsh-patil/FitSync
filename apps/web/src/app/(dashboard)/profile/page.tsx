import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Mail, Activity, Target, Edit3, Settings } from "lucide-react";
import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-8 space-y-12 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 w-full rounded-[2.5rem] bg-gradient-to-r from-secondary/20 via-accent/20 to-primary/20 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-6 px-8 -mt-20 relative z-10">
          <div className="h-40 w-40 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-2xl relative group">
            <div className="h-full w-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "Avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-white/50" />
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Edit3 className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="flex-1 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold font-heading tracking-tight">
                {user.name || "Alex Athlete"}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5 font-bold gap-2"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <h2 className="text-2xl font-bold font-heading">About Me</h2>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-muted-foreground leading-relaxed">
                {user.bio ||
                  "No bio provided yet. Tell the community about your fitness journey!"}
              </p>
            </div>
          </Card>

          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-bold font-heading">Current Goals</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                  Primary Goal
                </p>
                <p className="text-xl font-bold font-heading mt-2">
                  {user.fitnessGoal || "Not Set"}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                  Activity Level
                </p>
                <p className="text-xl font-bold font-heading mt-2">
                  {user.activityLevel || "Not Set"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-6 w-6 text-accent" />
              <h2 className="text-xl font-bold font-heading">Body Metrics</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold text-muted-foreground">
                  Height
                </span>
                <span className="text-lg font-bold font-heading">
                  {user.height ? `${user.height} cm` : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold text-muted-foreground">
                  Current Weight
                </span>
                <span className="text-lg font-bold font-heading">
                  {user.weight ? `${user.weight} kg` : "--"}
                </span>
              </div>
            </div>

            <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold rounded-xl mt-4">
              Update Metrics
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
