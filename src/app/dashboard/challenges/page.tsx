"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Flame, Trophy, Users, Clock, Loader2, CheckCircle } from "lucide-react";

interface ChallengeData {
  _id: string; name: string; description: string; startDate: string; endDate: string;
  participants: { userId: string; progress: number }[];
}

const colorMap = [
  { icon: Flame, color: "text-accent", bg: "bg-accent-dim" },
  { icon: Target, color: "text-success", bg: "bg-success/10" },
  { icon: Users, color: "text-accent", bg: "bg-accent-dim" },
  { icon: Trophy, color: "text-accent", bg: "bg-accent-dim" },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [joinedMsg, setJoinedMsg] = useState("");

  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((json) => { setChallenges(json.challenges || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const daysLeft = (endDate: string) => Math.max(1, Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000));

  const handleJoin = async (challengeId: string) => {
    setJoining(challengeId);
    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      });
      if (res.ok) {
        setJoinedMsg(challengeId);
        const json = await res.json();
        setChallenges((prev) => prev.map((c) => c._id === challengeId ? json : c));
        setTimeout(() => setJoinedMsg(""), 2000);
      }
    } catch (e) { console.error(e); }
    finally { setJoining(null); }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-1"><Target className="h-4 w-4" />Challenges</div>
        <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] tracking-tight text-text-primary">Active Challenges</h1>
        <p className="text-text-secondary text-sm mt-2">Compete and earn exclusive badges.</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : challenges.length === 0 ? (
        <div className="rounded-lg bg-surface-2 border border-border p-16 text-center text-text-muted text-sm">
          No active challenges right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((c, idx) => {
            const iconData = colorMap[idx % colorMap.length];
            return (
              <motion.div key={c._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                className="rounded-lg bg-surface-2 border border-border p-5 hover:border-border-hover transition-all group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`h-11 w-11 rounded-lg ${iconData.bg} flex items-center justify-center ${iconData.color}`}>
                    <iconData.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-text-primary group-hover:text-accent transition-colors">{c.name}</h3>
                    <p className="text-xs text-text-muted">{c.participants?.length || 0} participants</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Clock className="h-3 w-3" />{daysLeft(c.endDate)} days remaining
                  </div>
                  <button
                    onClick={() => handleJoin(c._id)}
                    disabled={joining === c._id}
                    className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {joining === c._id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : joinedMsg === c._id ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Users className="h-3 w-3" />
                    )}
                    {joinedMsg === c._id ? "Joined!" : "Join"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
