"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Search, PlayCircle, Clock, BarChart3, Plus, Zap, Filter, Loader2, X, Check } from "lucide-react";

interface Workout {
  _id: string;
  name: string;
  duration?: number;
  volume?: number;
  difficulty: string;
  exercises: { name: string; muscleGroup: string; sets: { reps: number; weight: number }[] }[];
  logDate: string;
}

const exerciseDb = [
  { name: "Push-up", muscle: "Chest", difficulty: "Beginner", sets: "3-4", reps: "10-20" },
  { name: "Squat", muscle: "Legs", difficulty: "Beginner", sets: "3-5", reps: "8-12" },
  { name: "Pull-up", muscle: "Back", difficulty: "Intermediate", sets: "3-4", reps: "5-12" },
  { name: "Deadlift", muscle: "Back/Legs", difficulty: "Advanced", sets: "3-5", reps: "5-8" },
  { name: "Bench Press", muscle: "Chest", difficulty: "Intermediate", sets: "3-5", reps: "8-12" },
  { name: "Overhead Press", muscle: "Shoulders", difficulty: "Intermediate", sets: "3-4", reps: "8-12" },
  { name: "Barbell Row", muscle: "Back", difficulty: "Intermediate", sets: "3-4", reps: "8-12" },
  { name: "Lunges", muscle: "Legs", difficulty: "Beginner", sets: "3-4", reps: "10-15" },
  { name: "Plank", muscle: "Core", difficulty: "Beginner", sets: "3-4", reps: "30-60s" },
  { name: "Dumbbell Curl", muscle: "Biceps", difficulty: "Beginner", sets: "3-4", reps: "10-15" },
  { name: "Tricep Dip", muscle: "Triceps", difficulty: "Intermediate", sets: "3-4", reps: "8-15" },
  { name: "Lat Pulldown", muscle: "Back", difficulty: "Beginner", sets: "3-4", reps: "10-12" },
];

const templates = [
  { name: "Upper Body Push", duration: 45, exercises: 6, difficulty: "Intermediate" },
  { name: "Leg Day", duration: 55, exercises: 5, difficulty: "Intermediate" },
  { name: "Full Body HIIT", duration: 30, exercises: 8, difficulty: "Beginner" },
  { name: "Pull + Core", duration: 40, exercises: 6, difficulty: "Beginner" },
];

const difficulties: Record<string, string> = {
  Beginner: "bg-secondary/10 text-secondary border-secondary/20",
  Intermediate: "bg-accent/10 text-accent border-accent/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function WorkoutPage() {
  const [search, setSearch] = useState("");
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
    } catch (e) {
      console.error("Failed to fetch workouts", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const filtered = exerciseDb.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.muscle.toLowerCase().includes(search.toLowerCase())
  );

  const addExercise = () => {
    setLogExercises([...logExercises, { name: "", muscleGroup: "", sets: [{ reps: 10, weight: 0 }] }]);
  };

  const updateExercise = (idx: number, field: string, value: string) => {
    const updated = [...logExercises];
    (updated as any)[idx][field] = value;
    setLogExercises(updated);
  };

  const handleLogWorkout = async () => {
    if (!logName.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: logName,
        difficulty: logDifficulty,
        duration: logDuration,
        exercises: logExercises.filter((e) => e.name.trim()),
        isTemplate: false,
      };
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccessMsg("Workout logged successfully!");
        setShowLogForm(false);
        setLogName("");
        setLogExercises([{ name: "", muscleGroup: "", sets: [{ reps: 10, weight: 0 }] }]);
        fetchWorkouts();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      console.error("Failed to log workout", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent text-sm font-bold mb-1"><Dumbbell className="h-4 w-4" />Workout Center</div>
          <h1 className="text-4xl font-bold font-heading tracking-tight text-white">Build & Track</h1>
          <p className="text-muted-foreground mt-1">Choose a template or build your own routine.</p>
        </div>
        <button onClick={() => setShowLogForm(!showLogForm)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:shadow-lg hover:shadow-accent/20 transition-all">
          {showLogForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showLogForm ? "Cancel" : "Log Workout"}
        </button>
      </motion.div>

      {/* Log Workout Form */}
      {showLogForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] border-white/5 p-8 space-y-6">
          <h2 className="text-xl font-bold font-heading text-white">Log a Workout</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Workout Name</label>
              <input value={logName} onChange={(e) => setLogName(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-accent/40" placeholder="e.g. Upper Body Push" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duration (min)</label>
              <input type="number" value={logDuration} onChange={(e) => setLogDuration(parseInt(e.target.value) || 30)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-accent/40" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Difficulty</label>
              <select value={logDifficulty} onChange={(e) => setLogDifficulty(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-accent/40">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Exercises</h3>
              <button onClick={addExercise} className="text-xs font-bold text-accent hover:underline">+ Add Exercise</button>
            </div>
            {logExercises.map((ex, idx) => (
              <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                <input value={ex.name} onChange={(e) => updateExercise(idx, "name", e.target.value)}
                  className="flex-1 h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-accent/40" placeholder="Exercise name" />
                <input value={ex.muscleGroup} onChange={(e) => updateExercise(idx, "muscleGroup", e.target.value)}
                  className="w-28 h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-accent/40" placeholder="Muscle group" />
                <input type="number" defaultValue={10}
                  className="w-16 h-10 bg-white/5 border border-white/10 rounded-lg px-2 text-sm text-white text-center" placeholder="Reps" />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button onClick={handleLogWorkout} disabled={saving || !logName.trim()}
              className="px-8 py-3 bg-accent text-white font-bold rounded-xl disabled:opacity-50 transition-all flex items-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Workout"}
            </button>
          </div>
        </motion.div>
      )}

      {successMsg && (
        <div className="p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl text-sm font-bold animate-fade-in">
          {successMsg}
        </div>
      )}

      {/* Templates */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2"><Zap className="h-5 w-5 text-accent" />Quick Start Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((t, idx) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="glass rounded-2xl border-white/5 p-5 hover:border-accent/30 transition-all group cursor-pointer"
              onClick={() => { setLogName(t.name); setLogDuration(t.duration); setLogDifficulty(t.difficulty.toLowerCase()); setShowLogForm(true); }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-white group-hover:text-accent transition-colors">{t.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{t.exercises} exercises</p>
                </div>
                <PlayCircle className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration} min</span>
                <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${difficulties[t.difficulty]}`}>{t.difficulty}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2"><BarChart3 className="h-5 w-5 text-secondary" />Recent Workouts</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-secondary" /></div>
        ) : workouts.length === 0 ? (
          <div className="glass rounded-2xl border-white/5 p-12 text-center text-muted-foreground text-sm">
            No workouts logged yet. Start your first session above!
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((w, idx) => (
              <motion.div key={w._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                className="glass rounded-xl border-white/5 p-5 hover:border-white/10 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{w.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(w.logDate).toLocaleDateString()} · {w.duration || "—"} min · {w.exercises?.length || 0} exercises
                    </p>
                  </div>
                </div>
                <span className={`text-[8px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${difficulties[w.difficulty] || difficulties.Beginner}`}>
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
