"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Trophy,
  Flame,
  Zap,
  Calendar,
  TrendingUp,
  Medal,
  Crown,
  Loader2,
  Dumbbell,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLeaderboard, getUserRank } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string | null;
  score: number;
  rank: number;
  details?: any;
}

type Period = "weekly" | "monthly" | "alltime";
type Category = "workouts" | "calories" | "streak" | "active_days";

const periods: { value: Period; label: string }[] = [
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
  { value: "alltime", label: "All Time" },
];

const categories: { value: Category; label: string; icon: any; color: string }[] = [
  { value: "workouts", label: "Most Workouts", icon: Dumbbell, color: "text-blue-400" },
  { value: "calories", label: "Most Calories", icon: Flame, color: "text-orange-400" },
  { value: "streak", label: "Longest Streak", icon: Zap, color: "text-yellow-400" },
  { value: "active_days", label: "Most Active Days", icon: Calendar, color: "text-green-400" },
];

function Podium({ top3, userId }: { top3: LeaderboardEntry[]; userId: string | null }) {
  const positions = [
    { rank: 2, height: "h-28", bg: "bg-gradient-to-t from-slate-600/50 to-slate-500/20", icon: Medal, color: "text-slate-300", delay: 0.2 },
    { rank: 1, height: "h-36", bg: "bg-gradient-to-t from-yellow-600/50 to-yellow-500/20", icon: Crown, color: "text-yellow-400", delay: 0 },
    { rank: 3, height: "h-20", bg: "bg-gradient-to-t from-amber-700/50 to-amber-600/20", icon: Award, color: "text-amber-500", delay: 0.4 },
  ];

  const sorted = positions.map((pos) => {
    const entry = top3.find((e) => e.rank === pos.rank);
    return { ...pos, entry };
  });

  return (
    <Card className="p-8 glass border-white/5 rounded-[2.5rem] overflow-hidden">
      <div className="flex items-end justify-center gap-4 md:gap-8 h-52">
        {sorted.map(({ rank, height, bg, icon: Icon, color, delay, entry }) => (
          <motion.div
            key={rank}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", damping: 12 }}
            className={cn(
              "flex flex-col items-center gap-3 relative",
              rank === 1 ? "order-2" : rank === 2 ? "order-1" : "order-3"
            )}
          >
            {entry ? (
              <>
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border-2",
                    rank === 1 ? "border-yellow-400 bg-yellow-500/20 text-yellow-400" :
                    rank === 2 ? "border-slate-400 bg-slate-500/20 text-slate-300" :
                    "border-amber-600 bg-amber-700/20 text-amber-500"
                  )}>
                    {entry.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-bold text-white truncate max-w-20 text-center leading-tight">
                    {entry.name}
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground">{entry.score}</span>
                  {entry.userId === userId && (
                    <span className="text-[8px] font-bold text-secondary uppercase">You</span>
                  )}
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ delay: delay + 0.3, duration: 0.5 }}
                  className={cn("w-16 rounded-t-2xl flex items-center justify-center relative overflow-hidden", height, bg)}
                >
                  <div className="absolute top-2">
                    <Icon className={cn("h-5 w-5", color)} />
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground text-xs">
                  ?
                </div>
                <span className="text-[10px] text-muted-foreground">Empty</span>
                <div className={cn("w-16 rounded-t-2xl bg-white/5", height)} />
              </>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function LeaderboardEntryRow({ entry, userId, index }: { entry: LeaderboardEntry; userId: string | null; index: number }) {
  const isUser = entry.userId === userId;
  const initials = entry.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div
        className={cn(
          "flex items-center gap-4 p-4 rounded-2xl border transition-all",
          isUser
            ? "bg-secondary/10 border-secondary/20 shadow-[inset_0_0_20px_rgba(0,201,167,0.05)]"
            : "bg-white/5 border-white/5 hover:border-white/10"
        )}
      >
        <div className={cn(
          "w-8 text-center font-bold text-sm",
          entry.rank === 1 ? "text-yellow-400" :
          entry.rank === 2 ? "text-slate-300" :
          entry.rank === 3 ? "text-amber-500" :
          "text-muted-foreground"
        )}>
          {entry.rank <= 3 ? (
            <motion.span
              animate={entry.rank === 1 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
            </motion.span>
          ) : (
            `#${entry.rank}`
          )}
        </div>

        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm border shrink-0",
          isUser ? "bg-secondary/20 border-secondary/30 text-secondary" : "bg-white/5 border-white/5 text-white"
        )}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("font-bold text-sm truncate", isUser ? "text-secondary" : "text-white")}>
              {entry.name}
            </span>
            {isUser && (
              <span className="text-[8px] font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
                You
              </span>
            )}
          </div>
          {entry.details?.streak && (
            <span className="text-[10px] text-muted-foreground">Current streak: {entry.details.streak} days</span>
          )}
        </div>

        <div className="text-right shrink-0">
          <p className={cn("font-bold text-sm", isUser ? "text-secondary" : "text-white")}>
            {entry.score.toLocaleString()}
          </p>
          <p className="text-[9px] text-muted-foreground font-medium">pts</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [category, setCategory] = useState<Category>("workouts");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard(period, category);
      setLeaderboard(data as LeaderboardEntry[]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [period, category]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (userId) {
      getUserRank(userId, period).then((rank) => setUserRank(rank as LeaderboardEntry));
    }
  }, [userId, period, leaderboard]);

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    } catch {}
  }

  const top3 = leaderboard.filter((e) => e.rank <= 3);
  const rest = leaderboard.filter((e) => e.rank > 3);
  const CategoryIcon = categories.find((c) => c.value === category)?.icon || Dumbbell;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight flex items-center gap-3 text-white">
          <Trophy className="h-8 w-8 text-yellow-400" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2">
          See where you stack up against the FitSync community.
        </p>
      </div>

      {/* Period Tabs */}
      <Card className="p-2 glass border-white/5 rounded-[2rem] inline-flex">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative",
              period === p.value
                ? "bg-secondary text-primary shadow-lg shadow-secondary/15"
                : "text-muted-foreground hover:text-white"
            )}
          >
            {p.label}
          </button>
        ))}
      </Card>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all",
                category === cat.value
                  ? "bg-secondary/10 text-secondary border-secondary/20 shadow-sm"
                  : "text-muted-foreground border-white/5 hover:border-white/20 hover:text-white bg-white/5"
              )}
            >
              <Icon className={cn("h-4 w-4", cat.color)} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      ) : (
        <>
          {/* Podium */}
          {top3.length > 0 && <Podium top3={top3} userId={userId} />}

          {/* User's Rank (Card) */}
          {userRank && userRank.rank > 3 && (
            <Card className="p-6 glass border-secondary/20 rounded-[2rem] bg-gradient-to-r from-secondary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center font-bold text-secondary border border-secondary/30">
                    {userRank.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{userRank.name}</p>
                    <p className="text-[10px] text-secondary font-bold uppercase">Your Rank</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-secondary">#{userRank.rank}</p>
                  <p className="text-xs text-muted-foreground">{userRank.score} pts</p>
                </div>
              </div>
            </Card>
          )}

          {/* Leaderboard List */}
          {leaderboard.length === 0 ? (
            <Card className="p-12 glass border-white/5 rounded-[2.5rem] text-center space-y-4">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-bold text-white">No data yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Start logging your workouts to appear on the leaderboard. Check back after your first session!
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <LeaderboardEntryRow key={entry.userId} entry={entry} userId={userId} index={index} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
