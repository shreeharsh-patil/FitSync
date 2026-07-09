"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Dumbbell, Utensils, LineChart, Trophy, Activity, Zap, ArrowRight, Flame, Target, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  user: { name: string; level: number; xp: number; streak: number };
  stats: { totalWorkouts: number; weeklyWorkouts: number; totalMeals: number; totalPosts: number; totalVolume: number };
  dailyNutrition: { calories: number; protein: number; carbs: number; fat: number };
  recentWorkouts: { name: string; duration: number; volume: number; logDate: string; difficulty: string }[];
}

const quickActions = [
  { label: "Log Workout", icon: Dumbbell, href: "/dashboard/workout", color: "bg-accent/10 text-accent border-accent/20" },
  { label: "Track Meal", icon: Utensils, href: "/dashboard/nutrition", color: "bg-secondary/10 text-secondary border-secondary/20" },
  { label: "View Progress", icon: LineChart, href: "/dashboard/progress", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { label: "Join Challenge", icon: Target, href: "/dashboard/challenges", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
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
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  const streakLabel = data?.user?.streak ? `${data.user.streak} days` : "0 days";

  const statCards = [
    { label: "Workouts", value: data?.stats?.totalWorkouts?.toString() || "0", change: `+${data?.stats?.weeklyWorkouts || 0} this week`, icon: Dumbbell, color: "text-accent", bg: "bg-accent/10" },
    { label: "Calories", value: data?.dailyNutrition?.calories ? data.dailyNutrition.calories.toLocaleString() : "0", change: "Today's intake", icon: Activity, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Streak", value: streakLabel, change: data?.user?.streak ? "Keep going!" : "Start today!", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Achievements", value: (data?.stats?.totalPosts || 0).toString(), change: "Community posts", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-secondary text-sm font-bold mb-1">
            <Zap className="h-4 w-4" />Welcome back, {data?.user?.name || "Athlete"}
          </div>
          <h1 className="text-4xl font-bold font-heading tracking-tight text-white">Your Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your performance, nutrition, and goals all in one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20">
            <Zap className="h-4 w-4 text-secondary" />
            <span className="text-sm font-bold text-secondary">Lv.{data?.user?.level || 1}</span>
          </div>
          <div className="h-2 w-32 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-secondary to-accent" />
          </div>
          <span className="text-xs text-muted-foreground font-bold">{data?.user?.xp || 0} XP</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}
            className="glass rounded-2xl border-white/5 p-6 hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{stat.change}</span>
            </div>
            <p className="text-3xl font-bold font-heading text-white">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions + Recent Workouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-secondary" />Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, idx) => (
              <Link key={action.label} href={action.href}>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}
                  className={`p-4 rounded-2xl border ${action.color} hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-between group`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-inherit flex items-center justify-center">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm">{action.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-accent" />Recent Activity
          </h2>
          <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
            <div className="divide-y divide-white/5">
              {data?.recentWorkouts?.length ? data.recentWorkouts.map((w, idx) => (
                <motion.div key={`${w.name}-${idx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}
                  className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <Dumbbell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white group-hover:text-accent transition-colors">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(w.logDate)} · {w.duration || "—"} min</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-heading text-white">{w.volume ? `${(w.volume / 1000).toFixed(1)}k` : "—"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Volume</p>
                  </div>
                </motion.div>
              )) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No workouts yet. Start your first session!
                </div>
              )}
            </div>
          </div>

          {/* XP Card */}
          <div className="glass rounded-2xl border-white/5 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Level {data?.user?.level || 1}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-2 w-32 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-[30%] rounded-full bg-secondary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold">{data?.user?.xp || 0} XP</span>
                </div>
              </div>
            </div>
            <Link href="/dashboard/profile">
              <button className="text-xs font-bold text-secondary hover:underline">View Profile</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Get Started Banner */}
      {(!data?.stats?.totalWorkouts || data.stats.totalWorkouts === 0) && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary/10 via-accent/5 to-primary/20 border border-secondary/20 p-8">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold font-heading text-white">Ready to start your journey?</h3>
              <p className="text-muted-foreground mt-1">Log your first workout or track a meal to see your progress take shape.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard/workout">
                <button className="px-6 py-3 bg-secondary text-primary font-bold rounded-xl hover:shadow-lg hover:shadow-secondary/20 transition-all">
                  Start Workout
                </button>
              </Link>
              <Link href="/dashboard/nutrition">
                <button className="px-6 py-3 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
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
