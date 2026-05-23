import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Flame,
  Trophy,
  TrendingUp,
  Calendar,
  ArrowRight,
  Dumbbell,
  Utensils,
  Zap,
  Search,
  Brain,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
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

  const firstName = user.name?.split(" ")[0] || "Athlete";

  // Query user's workouts to find active routine
  const userWorkouts = await db.workout.findMany({
    where: { userId: session.user.id },
    take: 1,
  });
  const activeWorkoutId = userWorkouts[0]?.id;

  return (
    <div className="p-8 space-y-12">
      {/* Header with Search and Stats */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold font-heading tracking-tight leading-tight">
            Good morning, <span className="text-secondary">{firstName}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Your fitness ecosystem is synchronized and ready.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              className="pl-10 h-12 bg-card/50 border-white/5 rounded-2xl"
            />
          </div>
          <div className="flex items-center gap-4 bg-secondary/10 px-6 py-3 rounded-2xl border border-secondary/20 shadow-lg shadow-secondary/5">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-primary">
              <Flame className="h-5 w-5 fill-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-secondary text-lg leading-none">
                12 Days
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Current Streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={<Dumbbell className="h-6 w-6 text-blue-400" />}
          label="Next Session"
          value="Upper Body A"
          subtext="Today • 5:30 PM"
          gradient="from-blue-500/10 to-transparent"
        />
        <SummaryCard
          icon={<Utensils className="h-6 w-6 text-secondary" />}
          label="Energy Balance"
          value="1,240 kcal"
          subtext="Remaining today"
          gradient="from-secondary/10 to-transparent"
        />
        <SummaryCard
          icon={<TrendingUp className="h-6 w-6 text-accent" />}
          label="Body Weight"
          value={user.weight ? `${user.weight} kg` : "--"}
          subtext="Current recorded weight"
          gradient="from-accent/10 to-transparent"
        />
        <SummaryCard
          icon={<Trophy className="h-6 w-6 text-yellow-400" />}
          label="Rank"
          value="Top 5%"
          subtext="Community Leaderboard"
          gradient="from-yellow-500/10 to-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Analytics */}
        <Card className="lg:col-span-2 p-10 glass border-white/5 rounded-[3rem] space-y-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <TrendingUp className="h-64 w-64 text-secondary" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-heading">
                Performance Analytics
              </h2>
              <p className="text-sm text-muted-foreground">
                Volume and frequency over the last 30 days.
              </p>
            </div>
            <div className="flex bg-muted/50 p-1 rounded-xl border border-white/5">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-4 rounded-lg bg-background shadow-sm font-bold"
              >
                Week
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-4 rounded-lg text-muted-foreground hover:text-foreground font-bold"
              >
                Month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-4 rounded-lg text-muted-foreground hover:text-foreground font-bold"
              >
                Year
              </Button>
            </div>
          </div>

          <div className="h-[350px] w-full bg-background/30 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group/chart">
            <div className="absolute inset-x-12 bottom-0 flex items-end justify-around h-full opacity-30 group-hover/chart:opacity-50 transition-opacity">
              {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95].map((h, i) => (
                <div
                  key={i}
                  className="w-8 bg-gradient-to-t from-secondary/80 to-secondary rounded-t-xl transition-all duration-700 delay-[i*50ms]"
                  style={{ height: `${h}%` }}
                >
                  <div className="w-full h-full bg-white/10 opacity-0 group-hover/chart:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4 text-center p-8 bg-background/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-secondary animate-pulse" />
              </div>
              <h3 className="font-bold text-lg">AI Insight Available</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your training volume is peaking. Consider a deload week to
                optimize recovery.
              </p>
              <Link href="/progress" className="inline-block">
                <Button
                  variant="link"
                  className="text-secondary font-bold p-0 flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                >
                  View Full Report
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Action Center */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading px-2">
              Action Center
            </h2>
            <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-accent to-secondary" />
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/20 transition-all cursor-pointer group">
                  <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Leg Day Challenge</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      Starts in 2 days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all cursor-pointer group">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">New PR Detected</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      Verify Bench Press
                    </p>
                  </div>
                </div>
              </div>
              {activeWorkoutId ? (
                <Link href={`/workout/${activeWorkoutId}`} className="block w-full">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl text-lg shadow-xl shadow-secondary/10 group">
                    Enter Live Session
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href="/workout/builder" className="block w-full">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl text-lg shadow-xl shadow-secondary/10 group">
                    Create Workout Plan
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-accent/20 to-primary/20 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="h-32 w-32 text-accent" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-heading">Pro Insights</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You are 15% more likely to hit your targets when you train
                before 10 AM. Your sleep data suggests tomorrow is a peak day.
              </p>
              <Link href="/ai-coach" className="inline-block">
                <Button
                  variant="link"
                  className="p-0 h-auto text-accent font-bold uppercase tracking-widest text-[10px] hover:text-accent/80 transition-colors"
                >
                  Explore Recovery Protocols
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  subtext,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  gradient: string;
}) {
  return (
    <Card className="p-8 glass border-white/5 rounded-[2.5rem] hover:border-white/10 transition-all group relative overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          gradient,
        )}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-background/50 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all group-hover:scale-110 shadow-inner">
            {icon}
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
            {label}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold font-heading group-hover:text-secondary transition-colors tracking-tight">
            {value}
          </p>
          <p className="text-xs text-muted-foreground font-medium">{subtext}</p>
        </div>
      </div>
    </Card>
  );
}

import { cn } from "@/lib/utils";
