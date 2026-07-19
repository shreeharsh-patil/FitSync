"use client";

import { useState, useEffect } from "react";
import {
  Dumbbell, Utensils, LineChart, Trophy, Activity, Zap, ArrowRight, Flame, Target, Loader2, Sparkles,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  user: { name: string; level: number; xp: number; streak: number };
  stats: { totalWorkouts: number; weeklyWorkouts: number; totalMeals: number; totalPosts: number; totalVolume: number };
  dailyNutrition: { calories: number; protein: number; carbs: number; fat: number };
  recentWorkouts: { name: string; duration: number; volume: number; logDate: string; difficulty: string }[];
}

const quickActions = [
  { label: "Log Workout", icon: Dumbbell, href: "/dashboard/workout" },
  { label: "Track Meal", icon: Utensils, href: "/dashboard/nutrition" },
  { label: "View Progress", icon: LineChart, href: "/dashboard/progress" },
  { label: "Join Challenge", icon: Target, href: "/dashboard/challenges" },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => { if (!cancelled) { setData(json); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return "Today";
    if (diff < 172800000) return "Yesterday";
    return `${Math.floor(diff / 86400000)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  const streakLabel = data?.user?.streak ? `${data.user.streak} days` : "0 days";

  const statCards = [
    { label: "Workouts", value: data?.stats?.totalWorkouts?.toString() || "0", sub: `+${data?.stats?.weeklyWorkouts || 0} this week`, icon: Dumbbell, color: "text-accent" },
    { label: "Calories", value: data?.dailyNutrition?.calories ? data.dailyNutrition.calories.toLocaleString() : "0", sub: "Today's intake", icon: Activity, color: "text-text-primary" },
    { label: "Streak", value: streakLabel, sub: data?.user?.streak ? "Keep going!" : "Start today!", icon: Flame, color: "text-success" },
    { label: "Posts", value: (data?.stats?.totalPosts || 0).toString(), sub: "Community posts", icon: Trophy, color: "text-text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-1">
            <Zap className="h-3.5 w-3.5" />Welcome back, {data?.user?.name || "Athlete"}
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-text-primary font-[family-name:var(--font-display)]">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-dim border border-accent/20">
            <Zap className="h-3 w-3 text-accent" />
            <span className="text-xs font-bold text-accent">Lv.{data?.user?.level || 1}</span>
          </div>
          <div className="h-1.5 w-20 rounded-full bg-surface-3 overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${Math.min(((data?.user?.xp || 0) % 1000) / 10, 100)}%` }} />
          </div>
          <span className="text-[10px] text-text-muted font-semibold">{data?.user?.xp || 0} XP</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, idx) => (
          <div key={stat.label}
            className="rounded-lg bg-surface-1 border border-border p-4 hover:border-border-hover transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-8 w-8 rounded-md bg-surface-3 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-text-muted" />
              </div>
              <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">{stat.sub}</span>
            </div>
            <p className={`text-xl font-black tracking-tighter ${stat.color} font-[family-name:var(--font-display)]`}>{stat.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold text-text-primary">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="p-3.5 rounded-lg border border-border bg-surface-1 hover:bg-surface-2 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-surface-3 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm text-text-primary">{action.label}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-text-primary">Recent Activity</h2>
          <div className="rounded-lg bg-surface-1 border border-border overflow-hidden">
            {data?.recentWorkouts?.length ? (
              <div className="divide-y divide-border">
                {data.recentWorkouts.map((w, idx) => (
                  <div key={`${w.name}-${idx}`}
                    className="flex items-center justify-between px-4 py-3.5 hover:bg-surface-2 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-surface-3 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                        <Dumbbell className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-text-primary group-hover:text-accent transition-colors">{w.name}</p>
                        <p className="text-[11px] text-text-muted">{formatDate(w.logDate)} · {w.duration || "\u2014"} min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">{w.volume ? `${(w.volume / 1000).toFixed(1)}k` : "\u2014"}</p>
                      <p className="text-[9px] text-text-muted uppercase tracking-wider">Volume</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted text-sm">No workouts yet. Start your first session!</div>
            )}
          </div>

          {/* XP Card */}
          <div className="rounded-lg bg-surface-1 border border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent-dim flex items-center justify-center text-accent">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Level {data?.user?.level || 1}</p>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <div className="h-1 w-24 rounded-full bg-surface-3 overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${Math.min(((data?.user?.xp || 0) % 1000) / 10, 100)}%` }} />
                  </div>
                  <span className="text-[10px] text-text-muted font-semibold">{data?.user?.xp || 0} XP</span>
                </div>
              </div>
            </div>
            <Link href="/dashboard/profile" className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors">
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Get Started Banner */}
      {(!data?.stats?.totalWorkouts || data.stats.totalWorkouts === 0) && (
        <div className="rounded-lg bg-accent-dim border border-accent/20 p-5 md:p-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Ready to start your journey?</h3>
              <p className="text-text-secondary text-sm mt-0.5">Log your first workout or track a meal.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/workout" className="px-5 py-2 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent-hover transition-colors">
                Start Workout
              </Link>
              <Link href="/dashboard/nutrition" className="px-5 py-2 border border-border text-text-secondary font-medium text-sm rounded-lg hover:bg-surface-2 transition-colors">
                Track Meal
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
