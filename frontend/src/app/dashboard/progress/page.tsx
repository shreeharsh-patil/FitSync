"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, TrendingUp, Award, Activity, Loader2, Zap } from "lucide-react";

interface ProgressEntry { _id: string; weight?: number; logDate: string; }
interface ProgressData { entries: ProgressEntry[]; stats: { totalWorkouts: number; totalVolume: number; totalCalories: number }; }

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [newWeight, setNewWeight] = useState(70);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/progress").then((res) => res.json()).then((json) => { setData(json); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleLogWeight = async () => {
    setSaving(true);
    try {
      await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ weight: newWeight }) });
      setShowWeightForm(false);
      const res = await fetch("/api/progress");
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  const weightEntries = data?.entries?.filter((e) => e.weight) || [];
  const latestWeight = weightEntries[0]?.weight;
  const earliestWeight = weightEntries[weightEntries.length - 1]?.weight;
  const weightChange = latestWeight && earliestWeight ? (earliestWeight - latestWeight).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-1"><LineChart className="h-4 w-4" />Analytics</div>
        <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] tracking-tight text-text-primary">Progress & Metrics</h1>
        <p className="text-text-secondary text-sm mt-1">Track your transformation over time.</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Workouts", value: data?.stats?.totalWorkouts || 0 },
          { label: "Total Volume", value: data?.stats?.totalVolume ? `${(data.stats.totalVolume / 1000).toFixed(1)}k kg` : "0" },
          { label: "Current Weight", value: latestWeight ? `${latestWeight} kg` : "\u2014" },
          { label: "Weight Change", value: weightChange !== "0" ? `${Number(weightChange) > 0 ? "-" : "+"}${Math.abs(Number(weightChange))} kg` : "0" },
        ].map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + idx * 0.04 }}
            className="rounded-lg bg-surface-2 border border-border p-5">
            <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-extrabold font-[family-name:var(--font-display)] mt-1 text-text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Weight Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-lg bg-surface-2 border border-border p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold font-[family-name:var(--font-display)] text-text-primary flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />Weight Tracking
          </h2>
          <button onClick={() => setShowWeightForm(!showWeightForm)}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
            <Zap className="h-3 w-3" />Log Weight
          </button>
        </div>

        {showWeightForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-surface-1 border border-border flex items-center gap-4">
            <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
              className="input w-24 text-center text-lg font-bold" />
            <span className="text-sm text-text-muted">kg</span>
            <button onClick={handleLogWeight} disabled={saving}
              className="px-5 py-2 bg-accent text-white font-bold rounded-lg text-sm">{saving ? "..." : "Save"}</button>
          </motion.div>
        )}

        {weightEntries.length === 0 ? (
          <div className="text-center py-12 text-text-muted text-sm">No weight entries yet. Start tracking!</div>
        ) : (
          <div className="h-48 flex items-end justify-between gap-2">
            {[...weightEntries].reverse().slice(-12).map((entry, idx) => {
              const maxW = Math.max(...weightEntries.map((e) => e.weight || 0), 1);
              const h = ((entry.weight || 0) / maxW) * 100;
              return (
                <div key={entry._id} className="flex flex-col items-center flex-1 h-full justify-end">
                  <span className="text-[8px] text-text-muted mb-1">{entry.weight}</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.2 + idx * 0.03, duration: 0.4 }}
                    className="w-full max-w-[28px] rounded-t-lg bg-accent" />
                  <span className="text-[7px] text-text-muted mt-1">{new Date(entry.logDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Total Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-lg bg-surface-2 border border-border p-6 md:p-8">
        <h2 className="text-base font-bold font-[family-name:var(--font-display)] text-text-primary flex items-center gap-2 mb-6">
          <Activity className="h-4 w-4 text-text-secondary" />Total Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: data?.stats?.totalWorkouts || 0, label: "Workouts" },
            { value: data?.stats?.totalVolume ? `${(data.stats.totalVolume / 1000).toFixed(1)}k` : "0", label: "kg Volume" },
            { value: data?.stats?.totalCalories ? `${(data.stats.totalCalories / 1000).toFixed(1)}k` : "0", label: "Calories Burned" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-lg bg-surface-1 border border-border">
              <p className="text-3xl font-extrabold font-[family-name:var(--font-display)] text-accent">{stat.value}</p>
              <p className="text-[10px] text-text-muted uppercase font-semibold tracking-wider mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
