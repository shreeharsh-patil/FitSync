"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, TrendingUp, Award, Flame, Activity, Loader2, Zap, Weight } from "lucide-react";

interface ProgressEntry {
  _id: string;
  weight?: number;
  logDate: string;
}

interface ProgressData {
  entries: ProgressEntry[];
  stats: { totalWorkouts: number; totalVolume: number; totalCalories: number };
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [newWeight, setNewWeight] = useState(70);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => res.json())
      .then((json) => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleLogWeight = async () => {
    setSaving(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: newWeight }),
      });
      setShowWeightForm(false);
      const res = await fetch("/api/progress");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  const weightEntries = data?.entries?.filter((e) => e.weight) || [];
  const latestWeight = weightEntries[0]?.weight;
  const earliestWeight = weightEntries[weightEntries.length - 1]?.weight;
  const weightChange = latestWeight && earliestWeight ? (earliestWeight - latestWeight).toFixed(1) : "0";

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-blue-400 text-sm font-bold mb-1"><LineChart className="h-4 w-4" />Analytics</div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-white">Progress & Metrics</h1>
        <p className="text-muted-foreground mt-1">Track your transformation over time.</p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl border-white/5 p-5">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Workouts</p>
          <p className="text-3xl font-bold font-heading text-white mt-1">{data?.stats?.totalWorkouts || 0}</p>
        </div>
        <div className="glass rounded-2xl border-white/5 p-5">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Volume</p>
          <p className="text-3xl font-bold font-heading text-white mt-1">{data?.stats?.totalVolume ? `${(data.stats.totalVolume / 1000).toFixed(1)}k` : "0"}</p>
          <span className="text-xs text-accent font-bold">kg lifted</span>
        </div>
        <div className="glass rounded-2xl border-white/5 p-5">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Current Weight</p>
          <p className="text-3xl font-bold font-heading text-white mt-1">{latestWeight || "—"}</p>
          <span className="text-xs text-secondary font-bold">kg</span>
        </div>
        <div className="glass rounded-2xl border-white/5 p-5">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Weight Change</p>
          <p className={`text-3xl font-bold font-heading mt-1 ${Number(weightChange) > 0 ? "text-secondary" : "text-muted-foreground"}`}>
            {weightChange !== "0" ? `${Number(weightChange) > 0 ? "-" : "+"}${Math.abs(Number(weightChange))}` : "0"}
          </p>
          <span className="text-xs text-muted-foreground font-bold">kg total</span>
        </div>
      </motion.div>

      {/* Weight Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-[2rem] border-white/5 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />Weight Tracking
          </h2>
          <button onClick={() => setShowWeightForm(!showWeightForm)}
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1">
            <Zap className="h-3 w-3" />Log Weight
          </button>
        </div>

        {showWeightForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
            <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
              className="w-24 h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-center text-lg font-bold" />
            <span className="text-sm text-muted-foreground">kg</span>
            <button onClick={handleLogWeight} disabled={saving}
              className="px-6 py-2 bg-secondary text-primary font-bold rounded-xl text-sm">
              {saving ? "..." : "Save"}
            </button>
          </motion.div>
        )}

        {weightEntries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No weight entries yet. Start tracking!</div>
        ) : (
          <div className="h-52 flex items-end justify-between gap-2">
            {[...weightEntries].reverse().slice(-12).map((entry, idx) => {
              const maxW = Math.max(...weightEntries.map((e) => e.weight || 0), 1);
              const h = ((entry.weight || 0) / maxW) * 100;
              return (
                <div key={entry._id} className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[9px] text-muted-foreground mb-1">{entry.weight}</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }}
                    transition={{ delay: 0.3 + idx * 0.03, duration: 0.4 }}
                    className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-secondary to-accent" />
                  <span className="text-[8px] text-muted-foreground mt-1">{new Date(entry.logDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Total Workouts Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass rounded-[2rem] border-white/5 p-8">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-8">
          <Activity className="h-5 w-5 text-accent" />Total Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-white/5">
            <p className="text-4xl font-bold font-heading text-accent">{data?.stats?.totalWorkouts || 0}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-2">Workouts</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5">
            <p className="text-4xl font-bold font-heading text-secondary">{data?.stats?.totalVolume ? `${(data.stats.totalVolume / 1000).toFixed(1)}k` : "0"}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-2">kg Volume</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5">
            <p className="text-4xl font-bold font-heading text-yellow-400">{data?.stats?.totalCalories ? (data.stats.totalCalories / 1000).toFixed(1) + "k" : "0"}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-2">Calories Burned</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
