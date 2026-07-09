"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCircle, Award, Zap, Flame, Dumbbell, Utensils, LineChart, Users, Settings, Medal, Target, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image?: string;
  fitnessGoal?: string;
  activityLevel?: string;
  height?: number;
  weight?: number;
  bio?: string;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((json) => { setUser(json); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "AT";

  const stats = [
    { label: "Level", value: user?.level?.toString() || "1", icon: Award, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "XP Earned", value: user?.xp?.toLocaleString() || "0", icon: Zap, color: "text-accent", bg: "bg-accent/10" },
    { label: "Streak", value: user?.streak ? `${user.streak} days` : "0", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Best Streak", value: user?.longestStreak ? `${user.longestStreak} days` : "0", icon: Target, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  return (
    <div className="space-y-10">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[2rem] border-white/5 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-3xl font-bold text-primary shadow-2xl shadow-secondary/30">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-secondary border-4 border-background flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-heading text-white">{user?.name || "Athlete"}</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
                <Medal className="h-4 w-4 text-secondary" />
                <span className="text-sm font-bold text-secondary">Level {user?.level || 1}</span>
              </div>
              {user?.fitnessGoal && (
                <span className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm font-bold">
                  {user.fitnessGoal}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
              </span>
            </div>
          </div>
          <Link href="/dashboard/settings">
            <button className="px-5 py-2.5 border border-white/10 rounded-xl text-sm font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
              <Settings className="h-4 w-4" />Edit Profile
            </button>
          </Link>
        </div>
      </motion.div>

      {/* XP Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="glass rounded-[2rem] border-white/5 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Level {user?.level || 1}</h2>
              <p className="text-sm text-muted-foreground mt-1">{user?.xp || 0} XP earned</p>
              <div className="mt-3 h-2 w-64 max-w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(((user?.xp || 0) % 1000) / 10, 100)}%` }} transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-secondary to-accent" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold font-heading text-secondary">{user?.level || 1}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-heading text-accent">{user?.xp || 0}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Total XP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-heading text-orange-400">{user?.streak || 0}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Day Streak</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.03 }}
            className="glass rounded-xl border-white/5 p-4 text-center hover:border-white/10 transition-all">
            <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mx-auto mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold font-heading text-white">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Profile Details */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-[2rem] border-white/5 p-8 space-y-6">
        <h2 className="text-xl font-bold font-heading text-white">Profile Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Fitness Goal", value: user?.fitnessGoal || "Not set" },
            { label: "Activity Level", value: user?.activityLevel || "Not set" },
            { label: "Height", value: user?.height ? `${user.height} cm` : "Not set" },
            { label: "Weight", value: user?.weight ? `${user.weight} kg` : "Not set" },
          ].map((field) => (
            <div key={field.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{field.label}</p>
              <p className="text-sm font-bold text-white mt-1">{field.value}</p>
            </div>
          ))}
        </div>
        {user?.bio && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Bio</p>
            <p className="text-sm text-white mt-1">{user.bio}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
