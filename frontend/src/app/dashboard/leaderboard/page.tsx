"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Loader2 } from "lucide-react";

interface LeaderEntry { rank: number; id: string; name: string; xp: number; level: number; streak: number; }

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((json) => { setLeaders(json.leaders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getBadge = (rank: number) => {
    if (rank === 1) return "\uD83E\uDD47";
    if (rank === 2) return "\uD83E\uDD48";
    if (rank === 3) return "\uD83E\uDD49";
    return "";
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-1"><Trophy className="h-4 w-4" />Leaderboard</div>
        <h1 className="text-3xl md:text-4xl font-black font-[family-name:var(--font-display)] tracking-tighter text-text-primary">Top Athletes</h1>
        <p className="text-text-secondary text-sm mt-1">Ranked by total XP earned.</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : leaders.length === 0 ? (
        <div className="rounded-lg bg-surface-2 border border-border p-16 text-center text-text-muted text-sm">
          No athletes on the leaderboard yet.
        </div>
      ) : (
        <div className="rounded-lg bg-surface-2 border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {leaders.map((leader) => (
              <motion.div key={leader.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-5 hover:bg-surface-1 transition-colors">
                <span className="w-8 text-center font-bold text-lg">
                  {getBadge(leader.rank) || <span className="text-text-muted">{leader.rank}</span>}
                </span>
                <div className="h-10 w-10 rounded-full bg-accent-dim flex items-center justify-center text-sm font-bold text-accent">
                  {getInitials(leader.name)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-text-primary">{leader.name}</p>
                  <p className="text-xs text-text-muted">Level {leader.level} · {leader.streak} day streak</p>
                </div>
                <div className="text-right">
                  <p className="font-black font-[family-name:var(--font-display)] text-accent">{leader.xp.toLocaleString()}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
