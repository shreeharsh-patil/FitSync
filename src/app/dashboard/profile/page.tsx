"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserCircle, Award, Zap, Flame, Dumbbell, Utensils, LineChart, Settings,
  Medal, Target, Calendar, Loader2, Sparkles
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  _id: string; name: string; email: string; image?: string; fitnessGoal?: string;
  activityLevel?: string; height?: number; weight?: number; bio?: string;
  xp: number; level: number; streak: number; longestStreak: number; createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user").then((res) => res.json()).then((json) => { setUser(json); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent-coral" /></div>;
  }

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "AT";

  const stats = [
    { label: "Level", value: user?.level?.toString() || "1", icon: Award, color: "text-accent-coral", bg: "bg-accent-coral/10" },
    { label: "XP Earned", value: user?.xp?.toLocaleString() || "0", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Streak", value: user?.streak ? `${user.streak} days` : "0", icon: Flame, color: "text-accent-coral", bg: "bg-accent-coral/10" },
    { label: "Best Streak", value: user?.longestStreak ? `${user.longestStreak} days` : "0", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-bg-card border border-border p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-accent-coral/15 flex items-center justify-center text-2xl font-bold text-accent-coral">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-accent-coral border-4 border-white flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-heading text-text-primary">{user?.name || "Athlete"}</h1>
            <p className="text-text-secondary text-sm">{user?.email}</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-coral/10 border border-accent-coral/20">
                <Medal className="h-3.5 w-3.5 text-accent-coral" />
                <span className="text-sm font-semibold text-accent-coral">Level {user?.level || 1}</span>
              </div>
              {user?.fitnessGoal && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                  {user.fitnessGoal}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Calendar className="h-3 w-3" />
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
              </span>
            </div>
          </div>
          <Link href="/dashboard/settings">
            <button className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all flex items-center gap-2">
              <Settings className="h-3.5 w-3.5" />Edit Profile
            </button>
          </Link>
        </div>
      </motion.div>

      {/* XP Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl bg-bg-card border border-border p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-accent-coral/15 flex items-center justify-center text-accent-coral">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-text-primary">Level {user?.level || 1}</h2>
              <p className="text-sm text-text-muted mt-0.5">{user?.xp || 0} XP earned</p>
              <div className="mt-2 h-1.5 w-48 max-w-full rounded-full bg-bg-secondary overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(((user?.xp || 0) % 1000) / 10, 100)}%` }} transition={{ duration: 1 }}
                  className="h-full rounded-full bg-accent-coral" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center"><p className="text-xl font-bold font-heading text-accent-coral">{user?.level || 1}</p><p className="text-[8px] text-text-muted font-semibold uppercase tracking-wider">Level</p></div>
            <div className="text-center"><p className="text-xl font-bold font-heading text-amber-600">{user?.xp || 0}</p><p className="text-[8px] text-text-muted font-semibold uppercase tracking-wider">Total XP</p></div>
            <div className="text-center"><p className="text-xl font-bold font-heading text-accent-coral">{user?.streak || 0}</p><p className="text-[8px] text-text-muted font-semibold uppercase tracking-wider">Day Streak</p></div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + idx * 0.03 }}
            className="rounded-xl bg-bg-card border border-border p-4 text-center hover:border-border-hover transition-all">
            <div className={`h-9 w-9 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mx-auto mb-2`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold font-heading text-text-primary">{stat.value}</p>
            <p className="text-[8px] text-text-muted font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Profile Details */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        className="rounded-2xl bg-bg-card border border-border p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-bold font-heading text-text-primary">Profile Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Fitness Goal", value: user?.fitnessGoal || "Not set" },
            { label: "Activity Level", value: user?.activityLevel || "Not set" },
            { label: "Height", value: user?.height ? `${user.height} cm` : "Not set" },
            { label: "Weight", value: user?.weight ? `${user.weight} kg` : "Not set" },
          ].map((field) => (
            <div key={field.label} className="p-4 rounded-xl bg-bg-secondary border border-border">
              <p className="text-[8px] text-text-muted font-semibold uppercase tracking-wider">{field.label}</p>
              <p className="text-sm font-semibold text-text-primary mt-1">{field.value}</p>
            </div>
          ))}
        </div>
        {user?.bio && (
          <div className="p-4 rounded-xl bg-bg-secondary border border-border">
            <p className="text-[8px] text-text-muted font-semibold uppercase tracking-wider">Bio</p>
            <p className="text-sm text-text-primary mt-1">{user.bio}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
