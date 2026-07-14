"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Clock, BarChart3, Plus, Zap, Loader2, X, Check } from "lucide-react";

interface Workout {
  _id: string;
  name: string;
  duration?: number;
  volume?: number;
  difficulty: string;
  exercises: { name: string; muscleGroup: string; sets: { reps: number; weight: number }[] }[];
  logDate: string;
}

const templates = [
  { name: "Upper Body Push", duration: 45, exercises: 6, difficulty: "Intermediate" },
  { name: "Leg Day", duration: 55, exercises: 5, difficulty: "Intermediate" },
  { name: "Full Body HIIT", duration: 30, exercises: 8, difficulty: "Beginner" },
  { name: "Pull + Core", duration: 40, exercises: 6, difficulty: "Beginner" },
];

const difficulties: Record<string, string> = {
  Beginner: "bg-success/10 text-success border-success/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-danger/10 text-danger border-danger/20",
};

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logName, setLogName] = useState("");
  const [logDuration, setLogDuration] = useState(30);
  const [logDifficulty, setLogDifficulty] = useState("beginner");
  const [logExercises, setLogExercises] = useState([{ name: "", muscleGroup: "", sets: [{ reps: 10, weight: 0 }] }]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchWorkouts = async () => {
    try {
      const res = await fetch("/api/workouts?limit=20");
      const json = await res.json();
      setWorkouts(json.workouts || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const addExercise = () => setLogExercises([...logExercises, { name: "", muscleGroup: "", sets: [{ reps: 10, weight: 0 }] }]);

  const updateExercise = (idx: number, field: string, value: string) => {
    const updated = [...logExercises];
    (updated as any)[idx][field] = value;
    setLogExercises(updated);
  };

  const handleLogWorkout = async () => {
    if (!logName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: logName, difficulty: logDifficulty, duration: logDuration, exercises: logExercises.filter((e) => e.name.trim()), isTemplate: false }),
      });
      if (res.ok) {
        setSuccessMsg("Workout logged!");
        setShowLogForm(false);
        setLogName("");
        setLogExercises([{ name: "", muscleGroup: "", sets: [{ reps: 10, weight: 0 }] }]);
        fetchWorkouts();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-1">
            <Dumbbell className="h-3.5 w-3.5" />Workout Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">Build & Track</h1>
        </div>
        <button onClick={() => setShowLogForm(!showLogForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-accent-hover transition-colors">
          {showLogForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showLogForm ? "Cancel" : "Log Workout"}
        </button>
      </motion.div>

      {showLogForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-surface-1 border border-border p-6 space-y-5">
          <h2 className="text-lg font-bold text-text-primary">Log a Workout</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Workout Name</label>
              <input value={logName} onChange={(e) => setLogName(e.target.value)} className="input" placeholder="e.g. Upper Body Push" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Duration (min)</label>
              <input type="number" value={logDuration} onChange={(e) => setLogDuration(parseInt(e.target.value) || 30)} className="input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Difficulty</label>
              <select value={logDifficulty} onChange={(e) => setLogDifficulty(e.target.value)} className="input">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-text-primary">Exercises</h3>
              <button onClick={addExercise} className="text-xs font-semibold text-accent hover:text-accent-hover">+ Add</button>
            </div>
            {logExercises.map((ex, idx) => (
              <div key={idx} className="flex gap-2 items-center p-3 rounded-lg bg-surface-2 border border-border">
                <input value={ex.name} onChange={(e) => updateExercise(idx, "name", e.target.value)} className="input flex-1 text-sm" placeholder="Exercise name" />
                <input value={ex.muscleGroup} onChange={(e) => updateExercise(idx, "muscleGroup", e.target.value)} className="input w-24 text-sm" placeholder="Muscle" />
                <input type="number" defaultValue={10} className="input w-14 text-sm text-center" placeholder="Reps" />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-3 border-t border-border">
            <button onClick={handleLogWorkout} disabled={saving || !logName.trim()}
              className="px-5 py-2 bg-accent text-white font-semibold text-sm rounded-lg disabled:opacity-50 flex items-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Workout"}
            </button>
          </div>
        </motion.div>
      )}

      {successMsg && (
        <div className="p-3 bg-success/10 border border-success/20 text-success rounded-lg text-sm font-semibold animate-fade-in">
          {successMsg}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-accent" />Quick Start Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((t, idx) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              className="rounded-lg bg-surface-1 border border-border p-4 hover:border-accent/30 transition-colors group cursor-pointer"
              onClick={() => { setLogName(t.name); setLogDuration(t.duration); setLogDifficulty(t.difficulty.toLowerCase()); setShowLogForm(true); }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-lg bg-surface-3 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-text-primary group-hover:text-accent transition-colors truncate">{t.name}</h3>
                  <p className="text-[10px] text-text-muted">{t.exercises} exercises</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-text-muted">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration} min</span>
                <span className={`px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider border ${difficulties[t.difficulty]}`}>
                  {t.difficulty}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-text-muted" />Recent Workouts
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
        ) : workouts.length === 0 ? (
          <div className="rounded-lg bg-surface-1 border border-border p-10 text-center text-text-muted text-sm">
            No workouts logged yet. Start your first session!
          </div>
        ) : (
          <div className="space-y-2">
            {workouts.map((w, idx) => (
              <motion.div key={w._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                className="rounded-lg bg-surface-1 border border-border p-3.5 hover:border-border-hover transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-surface-3 flex items-center justify-center text-text-muted">
                    <Dumbbell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-text-primary">{w.name}</p>
                    <p className="text-[10px] text-text-muted">
                      {new Date(w.logDate).toLocaleDateString()} · {w.duration || "\u2014"} min · {w.exercises?.length || 0} exercises
                    </p>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider border ${
                  difficulties[w.difficulty] || difficulties.Beginner
                }`}>
                  {w.difficulty}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
