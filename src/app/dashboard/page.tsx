"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        <Loader2 className="h-8 w-8 animate-spin text-accent-coral" />
      </div>
    );
  }

  const streakLabel = data?.user?.streak ? `${data.user.streak} days` : "0 days";

  const statCards = [
    {
      label: "Workouts", value: data?.stats?.totalWorkouts?.toString() || "0",
      change: `+${data?.stats?.weeklyWorkouts || 0} this week`, icon: Dumbbell,
    },
    {
      label: "Calories", value: data?.dailyNutrition?.calories ? data.dailyNutrition.calories.toLocaleString() : "0",
      change: "Today's intake", icon: Activity,
    },
    {
      label: "Streak", value: streakLabel, change: data?.user?.streak ? "Keep going!" : "Start today!",
      icon: Flame,
    },
    {
      label: "Achievements", value: (data?.stats?.totalPosts || 0).toString(),
      change: "Community posts", icon: Trophy,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent-coral text-sm font-semibold mb-1">
            <Zap className="h-4 w-4" />Welcome back, {data?.user?.name || "Athlete"}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-text-primary">Your Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">Track your performance, nutrition, and goals.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-coral/10 border border-accent-coral/20">
            <Zap className="h-3.5 w-3.5 text-accent-coral" />
            <span className="text-sm font-semibold text-accent-coral">Lv.{data?.user?.level || 1}</span>
          </div>
          <div className="h-1.5 w-24 rounded-full bg-bg-secondary overflow-hidden">
            <div className="h-full w-[65%] rounded-full bg-accent-coral" />
          </div>
          <span className="text-[10px] text-text-muted font-semibold">{data?.user?.xp || 0} XP</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + idx * 0.05 }}
            className="rounded-xl bg-bg-card border border-border p-5 hover:border-border-hover transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-accent-coral/10 flex items-center justify-center text-accent-coral">
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">{stat.change}</span>
            </div>
            <p className="stat-value text-2xl text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-bold font-heading text-text-primary flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent-coral" />Quick Actions
          </h2>
          <div className="space-y-2.5">
            {quickActions.map((action, idx) => (
              <Link key={action.label} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.04 }}
                  className="p-4 rounded-xl border border-border bg-bg-primary hover:bg-bg-secondary transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-accent-coral/10 flex items-center justify-center text-accent-coral">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm text-text-primary">{action.label}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-text-muted group-hover:text-accent-coral group-hover:translate-x-1 transition-all" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold font-heading text-text-primary flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-accent-coral" />Recent Activity
          </h2>
          <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
            {data?.recentWorkouts?.length ? (
              <div className="divide-y divide-border">
                {data.recentWorkouts.map((w, idx) => (
                  <motion.div key={`${w.name}-${idx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.03 }}
                    className="flex items-center justify-between p-5 hover:bg-bg-secondary transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-accent-coral/10 flex items-center justify-center text-accent-coral">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-text-primary group-hover:text-accent-coral transition-colors">{w.name}</p>
                        <p className="text-xs text-text-muted">{formatDate(w.logDate)} · {w.duration || "\u2014"} min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold font-heading text-text-primary">{w.volume ? `${(w.volume / 1000).toFixed(1)}k` : "\u2014"}</p>
                      <p className="text-[9px] text-text-muted uppercase tracking-wider">Volume</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted text-sm">No workouts yet. Start your first session!</div>
            )}
          </div>

          {/* XP Card */}
          <div className="rounded-xl bg-bg-card border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-accent-coral/15 flex items-center justify-center text-accent-coral">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Level {data?.user?.level || 1}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="h-1.5 w-28 rounded-full bg-bg-secondary overflow-hidden">
                    <div className="h-full w-[30%] rounded-full bg-accent-coral" />
                  </div>
                  <span className="text-[10px] text-text-muted font-semibold">{data?.user?.xp || 0} XP</span>
                </div>
              </div>
            </div>
            <Link href="/dashboard/profile">
              <button className="text-xs font-semibold text-accent-coral hover:underline">View Profile</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Get Started Banner */}
      {(!data?.stats?.totalWorkouts || data.stats.totalWorkouts === 0) && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-2xl bg-accent-coral/5 border border-accent-coral/20 p-6 md:p-8"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold font-heading text-text-primary">Ready to start your journey?</h3>
              <p className="text-text-secondary text-sm mt-1">Log your first workout or track a meal.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard/workout">
                <button className="px-5 py-2.5 bg-accent-coral text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-accent-coral/20 transition-all">
                  Start Workout
                </button>
              </Link>
              <Link href="/dashboard/nutrition">
                <button className="px-5 py-2.5 border border-border text-text-primary font-semibold text-sm rounded-xl hover:bg-bg-secondary transition-all">
                  Track Meal
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
