"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Clock,
  Play,
  Square,
  Flame,
  Zap,
  Check,
  RotateCcw,
  Dumbbell,
  ChevronLeft,
  Loader2,
  BellRing,
  Trophy,
  ArrowRight,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Share2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logWorkoutSession } from "@/lib/actions";
import { PoseDetection } from "@/components/workout/PoseDetection";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ActiveWorkoutTrackerProps {
  workout: any;
  userId: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

export function ActiveWorkoutTracker({ workout, userId }: ActiveWorkoutTrackerProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState(0);
  const [restDuration, setRestDuration] = useState(60); // Default 60s
  const [isResting, setIsResting] = useState(false);

  // Exercises logging state
  const [loggedExercises, setLoggedExercises] = useState<any[]>([]);
  const [totalVolume, setTotalVolume] = useState(0);

  // Form check state
  const [formCheckExercise, setFormCheckExercise] = useState<string | null>(null);
  const [formCheckScores, setFormCheckScores] = useState<Record<string, number>>({});

  // Initialize tracking data
  useEffect(() => {
    if (workout?.exercises) {
      const formatted = workout.exercises.map((ex: any) => {
        const setArray = Array.from({ length: ex.sets }).map((_, i) => ({
          setNumber: i + 1,
          weight: 0,
          reps: parseInt(ex.reps) || 10,
          completed: false,
        }));
        return {
          exerciseId: ex.exercise.id,
          name: ex.exercise.name,
          restSec: ex.restSec,
          sets: setArray,
        };
      });
      setLoggedExercises(formatted);
    }
  }, [workout]);

  // Real-time volume calculation
  useEffect(() => {
    const volume = loggedExercises.reduce((acc, ex) => {
      const exVolume = ex.sets.reduce((sAcc: number, set: any) => {
        if (set.completed) {
          return sAcc + (set.weight * set.reps);
        }
        return sAcc;
      }, 0);
      return acc + exVolume;
    }, 0);
    setTotalVolume(volume);
  }, [loggedExercises]);

  // Stopwatch ticking
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Rest Timer ticking
  useEffect(() => {
    let restInterval: any = null;
    if (isResting && restSeconds > 0) {
      restInterval = setInterval(() => {
        setRestSeconds((prev) => prev - 1);
      }, 1000);
    } else if (restSeconds === 0 && isResting) {
      setIsResting(false);
      // Play a subtle notification sound (simulated with visual pulse)
    }
    return () => clearInterval(restInterval);
  }, [isResting, restSeconds]);

  const startSession = () => {
    setIsActive(true);
  };

  const handleSetToggle = (exIdx: number, setIdx: number) => {
    const updated = [...loggedExercises];
    const targetSet = updated[exIdx].sets[setIdx];
    const isCompleted = !targetSet.completed;
    targetSet.completed = isCompleted;

    setLoggedExercises(updated);

    // Trigger Rest Timer on set completion
    if (isCompleted) {
      const restTime = updated[exIdx].restSec || 60;
      setRestDuration(restTime);
      setRestSeconds(restTime);
      setIsResting(true);
    }
  };

  const handleSetWeightChange = (exIdx: number, setIdx: number, val: number) => {
    const updated = [...loggedExercises];
    updated[exIdx].sets[setIdx].weight = val;
    setLoggedExercises(updated);
  };

  const handleSetRepsChange = (exIdx: number, setIdx: number, val: number) => {
    const updated = [...loggedExercises];
    updated[exIdx].sets[setIdx].reps = val;
    setLoggedExercises(updated);
  };

  const handleFormCheckComplete = (summary: { avgFormScore: number }) => {
    if (formCheckExercise) {
      setFormCheckScores((prev) => ({ ...prev, [formCheckExercise]: summary.avgFormScore }));
    }
    setFormCheckExercise(null);
  };

  const finishSession = async () => {
    setIsSaving(true);
    setIsActive(false);

    const exercisePayload = loggedExercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      sets: ex.sets
        .filter((s: any) => s.completed)
        .map((s: any) => ({
          reps: String(s.reps),
          weight: s.weight,
          restSec: ex.restSec,
        })),
    })).filter((ex) => ex.sets.length > 0);

    const durationMins = Math.max(1, Math.round(seconds / 60));
    const caloriesBurned = Math.round(durationMins * 6.5);

    const res = await logWorkoutSession(userId, {
      workoutId: workout.id,
      durationMins,
      caloriesBurned,
      notes,
      exercises: exercisePayload,
    });

    if (res.success) {
      router.push("/workout");
    } else {
      alert(res.error || "Failed to log workout session.");
      setIsSaving(false);
    }
  };

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, "0") + ":" : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 relative pb-32"
    >
      {/* Background Decor */}
      <div className="fixed inset-0 kinetic-grid opacity-10 pointer-events-none -z-10" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] glow-sphere opacity-10 pointer-events-none" />

      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="flex items-center gap-6">
          <Link href="/workout">
            <motion.div whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </motion.div>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] leading-none">
                Live Performance Matrix
              </span>
              {isActive && (
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight text-white">{workout.name}</h1>
          </div>
        </div>

        {/* Dynamic HUD (Heads Up Display) Widgets */}
        {isActive && (
          <div className="flex flex-wrap items-center gap-4">
            {/* Timer HUD */}
            <div className="flex items-center gap-4 bg-slate-950/60 backdrop-blur-xl px-6 py-3 rounded-[1.5rem] border border-secondary/20 shadow-xl shadow-secondary/5">
              <Clock className="h-5 w-5 text-secondary animate-pulse" />
              <div className="flex flex-col">
                <span className="font-mono font-bold text-secondary text-2xl leading-none">
                  {formatTime(seconds)}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                  Session Clock
                </span>
              </div>
            </div>

            {/* Volume HUD */}
            <div className="flex items-center gap-4 bg-slate-950/60 backdrop-blur-xl px-6 py-3 rounded-[1.5rem] border border-accent/20 shadow-xl shadow-accent/5">
              <Zap className="h-5 w-5 text-accent" />
              <div className="flex flex-col">
                <span className="font-mono font-bold text-white text-2xl leading-none">
                  {totalVolume.toLocaleString()} <span className="text-xs text-accent">kg</span>
                </span>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                  Peak Volume
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Primary Session Workspace */}
      <AnimatePresence mode="wait">
        {!isActive ? (
          <motion.div
            key="pre-session"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="flex flex-col items-center justify-center pt-20"
          >
            <Card className="p-12 sm:p-20 glass border-white/5 rounded-[4rem] space-y-10 text-center max-w-2xl w-full relative overflow-hidden group shadow-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/5 opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
              
              <div className="relative z-10 space-y-8">
                <motion.div 
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="h-24 w-24 rounded-[2.5rem] bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/25 mx-auto shadow-2xl"
                >
                  <Dumbbell className="h-12 w-12" />
                </motion.div>
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">Ready to Synchronize?</h2>
                  <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                    Protocol ready with <span className="text-secondary font-bold">{workout.exercises.length} targeting modules</span>. Start the matrix to enable real-time tracking.
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={startSession}
                      size="lg"
                      className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-16 h-20 text-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,201,167,0.3)] group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10 flex items-center gap-3">
                        <Play className="h-6 w-6 fill-primary" />
                        Initialize Session
                      </span>
                    </Button>
                  </motion.div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em]">
                    Estimated duration: 45-60 minutes
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="active-session"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start"
          >
            {/* Exercises Logging Flow */}
            <div className={cn("lg:col-span-2 space-y-10 transition-all duration-500", isFocusMode && "lg:col-span-3 max-w-4xl mx-auto w-full")}>
              
              {/* Focus Mode Toggle */}
              <div className="flex justify-between items-center px-4">
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  Training Flow
                  <Sparkles className="h-4 w-4 text-secondary" />
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white gap-2 bg-white/5 rounded-xl border border-white/5"
                >
                  {isFocusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  {isFocusMode ? "Exit Focus Mode" : "Focus Mode"}
                </Button>
              </div>

              {loggedExercises.map((ex, exIdx) => (
                <motion.div
                  key={ex.exerciseId}
                  variants={itemVariants}
                >
                  <Card className={cn(
                    "p-8 glass border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden transition-all duration-500",
                    ex.sets.every((s: any) => s.completed) && "border-secondary/30 bg-secondary/[0.02]"
                  )}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-secondary transition-colors">
                          <Dumbbell className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold font-heading text-white">{ex.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-extrabold uppercase bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-lg">
                              Target Routine
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              Rest: {ex.restSec || 60}s
                            </span>
                            {formCheckScores[ex.name] && (
                              <span className="text-[10px] font-bold uppercase bg-accent/20 text-accent border border-accent/30 px-2 py-0.5 rounded-lg">
                                Form: {formCheckScores[ex.name]}%
                              </span>
                            )}
                            <button
                              onClick={() => setFormCheckExercise(ex.name)}
                              className="text-[10px] font-bold uppercase text-accent hover:text-accent/80 underline underline-offset-4 decoration-accent/30 hover:decoration-accent/60 transition-all"
                            >
                              Form Check
                            </button>
                          </div>
                        </div>
                      </div>

                      {ex.sets.every((s: any) => s.completed) && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2 text-secondary bg-secondary/15 px-4 py-2 rounded-2xl border border-secondary/25"
                        >
                          <Check className="h-4 w-4 stroke-[3px]" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Exercise Protocol Complete</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Logging Grid */}
                    <div className="space-y-4 relative z-10">
                      {/* Labels */}
                      <div className="grid grid-cols-12 gap-6 text-[10px] font-extrabold uppercase text-muted-foreground tracking-[0.2em] px-4">
                        <span className="col-span-2 text-center">Set</span>
                        <span className="col-span-4 text-center">Load (kg)</span>
                        <span className="col-span-4 text-center">Reps</span>
                        <span className="col-span-2 text-center">Status</span>
                      </div>

                      <div className="space-y-3">
                        {ex.sets.map((set: any, setIdx: number) => (
                          <motion.div
                            key={set.setNumber}
                            whileHover={{ x: 5 }}
                            className={cn(
                              "grid grid-cols-12 gap-6 items-center p-4 rounded-[1.5rem] border transition-all duration-300",
                              set.completed
                                ? "bg-secondary/10 border-secondary/40 shadow-lg shadow-secondary/5"
                                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05]"
                            )}
                          >
                            <span className={cn(
                              "col-span-2 font-mono font-bold text-center text-lg",
                              set.completed ? "text-secondary" : "text-muted-foreground"
                            )}>
                              {String(set.setNumber).padStart(2, "0")}
                            </span>
                            
                            <div className="col-span-4 flex justify-center">
                              <Input
                                type="number"
                                placeholder="0"
                                value={set.weight || ""}
                                onChange={(e) =>
                                  handleSetWeightChange(exIdx, setIdx, parseFloat(e.target.value) || 0)
                                }
                                className="h-12 w-full max-w-[100px] text-center bg-slate-950/40 border-white/10 rounded-xl text-lg font-mono font-bold text-white focus:border-secondary/50 focus:bg-slate-900 transition-all"
                                disabled={set.completed}
                              />
                            </div>

                            <div className="col-span-4 flex justify-center">
                              <Input
                                type="number"
                                placeholder="10"
                                value={set.reps || ""}
                                onChange={(e) =>
                                  handleSetRepsChange(exIdx, setIdx, parseInt(e.target.value) || 0)
                                }
                                className="h-12 w-full max-w-[100px] text-center bg-slate-950/40 border-white/10 rounded-xl text-lg font-mono font-bold text-white focus:border-secondary/50 focus:bg-slate-900 transition-all"
                                disabled={set.completed}
                              />
                            </div>

                            <div className="col-span-2 flex justify-center">
                              <motion.div whileTap={{ scale: 0.8 }}>
                                <Checkbox
                                  checked={set.completed}
                                  onCheckedChange={() => handleSetToggle(exIdx, setIdx)}
                                  className="h-8 w-8 rounded-xl border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=checked]:text-primary shadow-xl transition-all"
                                />
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Exercise Note Indicator */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        <Info className="h-3.5 w-3.5 text-secondary" />
                        Target Difficulty: {workout.difficulty}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-secondary">
                        EST. LOAD: {ex.sets.reduce((a:number, b:any) => a + (b.weight * b.reps), 0).toLocaleString()} kg
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Session Sidebar HUD */}
            {!isFocusMode && (
              <div className="space-y-8 sticky top-32">
                
                {/* Active Rest Timer Widget */}
                <AnimatePresence>
                  {isResting && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                      <Card className="p-8 bg-gradient-to-br from-secondary/20 to-slate-900 border-secondary/40 border-[2px] rounded-[3rem] space-y-6 relative overflow-hidden shadow-2xl shadow-secondary/10">
                        <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-secondary/20 blur-3xl rounded-full animate-pulse" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="h-12 w-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30 shadow-inner">
                            <BellRing className="h-6 w-6 animate-bounce" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold font-heading text-secondary leading-none">Rest Active</h3>
                            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.3em] mt-1.5">
                              Cellular Recovery Mode
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between items-baseline font-mono text-white">
                            <span className="text-5xl font-extrabold tracking-tighter">{restSeconds}s</span>
                            <span className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
                              of {restDuration}s
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: `${(restSeconds / restDuration) * 100}%` }}
                                className="h-full bg-gradient-to-r from-secondary to-white transition-all duration-1000"
                              />
                            </div>
                            <div className="flex justify-between text-[8px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                              <span>Depletion</span>
                              <span>Ready</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          onClick={() => setRestSeconds(0)}
                          className="w-full h-11 border-secondary/30 hover:bg-secondary/10 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
                        >
                          Skip Rest Protocol
                        </Button>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Session Post-Process HUD */}
                <Card className="p-8 glass border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden shadow-2xl">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-heading text-white">Session Sync</h3>
                    <p className="text-xs text-muted-foreground">Finalize training data into the ecosystem.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] px-2 flex justify-between">
                        Tactical Notes
                        <span className="text-secondary opacity-50 italic">Optional</span>
                      </label>
                      <textarea
                        placeholder="Peak strength on bench... stabilization indices stable..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-secondary/50 text-white placeholder-muted-foreground transition-all focus:bg-slate-900/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Est. Calories</p>
                        <p className="text-lg font-bold font-mono text-white mt-1">~{Math.round(Math.max(1, seconds / 60) * 6.5)}</p>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Modules Done</p>
                        <p className="text-lg font-bold font-mono text-white mt-1">
                          {loggedExercises.filter(ex => ex.sets.every((s:any) => s.completed)).length}/{workout.exercises.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={finishSession}
                        disabled={isSaving}
                        className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-16 rounded-2xl text-base shadow-xl shadow-secondary/20 gap-3 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        {isSaving ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <Check className="h-6 w-6 stroke-[3px]" />
                        )}
                        <span className="relative z-10">Sync Final Session</span>
                      </Button>
                    </motion.div>
                    
                    <Button
                      onClick={() => {
                        if (confirm("Cancel this active training protocol? All session-local metrics will be purged.")) {
                          setIsActive(false);
                          setSeconds(0);
                        }
                      }}
                      variant="ghost"
                      className="w-full h-12 rounded-2xl hover:bg-red-500/10 hover:text-red-500 font-bold text-[11px] uppercase tracking-widest text-muted-foreground transition-colors"
                    >
                      Terminate Matrix
                    </Button>
                  </div>
                </Card>

                {/* Performance Tip */}
                <div className="p-6 bg-accent/10 border border-accent/20 rounded-[2rem] flex items-start gap-4">
                  <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold italic">
                    "Consistent logging of rest periods increases progressive overload accuracy by 14% across high-performance athlete cohorts."
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD for Focus Mode */}
      {isFocusMode && isActive && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-slate-950/80 backdrop-blur-2xl border border-white/10 p-4 px-10 rounded-full shadow-3xl"
        >
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-secondary" />
            <span className="font-mono font-bold text-white text-xl">{formatTime(seconds)}</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex items-center gap-4">
            <Zap className="h-5 w-5 text-accent" />
            <span className="font-mono font-bold text-white text-xl">{totalVolume.toLocaleString()} kg</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <Button 
            onClick={() => setIsFocusMode(false)}
            className="bg-white/5 hover:bg-white/10 text-white font-bold h-10 px-6 rounded-xl border border-white/5 text-[10px] uppercase tracking-widest"
          >
            Exit Focus
          </Button>
          <Button 
            onClick={finishSession}
            className="bg-secondary text-primary font-bold h-10 px-6 rounded-xl text-[10px] uppercase tracking-widest"
          >
            Finish
          </Button>
        </motion.div>
      )}

      {/* Form Check Modal */}
      <AnimatePresence>
        {formCheckExercise && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg relative"
            >
              <button
                onClick={() => setFormCheckExercise(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white z-10 p-2"
              >
                <X className="h-6 w-6" />
              </button>
              <PoseDetection
                exerciseName={formCheckExercise}
                onSessionComplete={handleFormCheckComplete}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
