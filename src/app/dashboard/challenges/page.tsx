"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Flame, Trophy, Users, Clock, Loader2 } from "lucide-react";

interface ChallengeData {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: { userId: string; progress: number }[];
}

const iconMap: Record<string, any> = {
  Flame, Target, Users, Trophy,
};

const colorMap = [
  { icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
  { icon: Target, color: "text-accent", bg: "bg-accent/10" },
  { icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10" },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((json) => { setChallenges(json.challenges || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const daysLeft = (endDate: string) => {
    const diff = new Date(endDate).getTime() - Date.now();
    return Math.max(1, Math.ceil(diff / 86400000));
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-orange-400 text-sm font-bold mb-1"><Target className="h-4 w-4" />Challenges</div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-white">Active Challenges</h1>
        <p className="text-muted-foreground mt-1">Compete and earn exclusive badges.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>
      ) : challenges.length === 0 ? (
        <div className="glass rounded-2xl border-white/5 p-16 text-center text-muted-foreground text-sm">
          No active challenges right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((c, idx) => {
            const icons = colorMap[idx % colorMap.length];
            return (
              <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="glass rounded-2xl border-white/5 p-6 hover:border-white/10 transition-all group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-2xl ${icons.bg} flex items-center justify-center ${icons.color}`}>
                    <icons.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-secondary transition-colors">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.participants?.length || 0} participants</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />{daysLeft(c.endDate)} days remaining
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
