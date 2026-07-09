"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Loader2 } from "lucide-react";

interface LeaderEntry {
  rank: number;
  id: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
}

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
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold mb-1"><Trophy className="h-4 w-4" />Leaderboard</div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-white">Top Athletes</h1>
        <p className="text-muted-foreground mt-1">Ranked by total XP earned.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>
      ) : leaders.length === 0 ? (
        <div className="glass rounded-[2rem] border-white/5 p-16 text-center text-muted-foreground text-sm">
          No athletes on the leaderboard yet.
        </div>
      ) : (
        <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
          <div className="divide-y divide-white/5">
            {leaders.map((leader) => (
              <motion.div key={leader.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors">
                <span className={`w-8 text-center font-bold text-lg ${leader.rank <= 3 ? "text-2xl" : "text-muted-foreground"}`}>
                  {getBadge(leader.rank) || leader.rank}
                </span>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-sm font-bold text-primary">
                  {getInitials(leader.name)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{leader.name}</p>
                  <p className="text-xs text-muted-foreground">Level {leader.level} · {leader.streak} day streak</p>
                </div>
                <div className="text-right">
                  <p className="font-bold font-heading text-secondary">{leader.xp.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
