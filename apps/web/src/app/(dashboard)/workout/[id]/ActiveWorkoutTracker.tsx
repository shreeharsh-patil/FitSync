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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logWorkoutSession } from "@/lib/actions";

interface ActiveWorkoutTrackerProps {
  workout: any;
  userId: string;
}

export function ActiveWorkoutTracker({ workout, userId }: ActiveWorkoutTrackerProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState(0);
  const [restDuration, setRestDuration] = useState(60); // Default 60s
  const [isResting, setIsResting] = useState(false);

  // Exercises logging state
  // Map our workout structure into a stateful logging format
  const [loggedExercises, setLoggedExercises] = useState<any[]>([]);

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
    } else if (restSeconds === 0) {
      setIsResting(false);
      clearInterval(restInterval);
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

  const finishSession = async () => {
    setIsSaving(true);
    setIsActive(false);

    // Format logged data for the JSONB DB structure
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
    // Estimate ~6.5 calories per minute for resistance training
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

  // Stopwatch formatted string
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, "0") + ":" : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Link href="/workout">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
              Active Plan Routine
            </span>
            <h1 className="text-4xl font-bold font-heading tracking-tight">{workout.name}</h1>
          </div>
        </div>

        {/* Stopwatch widget */}
        {isActive && (
          <div className="flex items-center gap-4 bg-secondary/15 px-6 py-3 rounded-2xl border border-secondary/20 shadow-lg shadow-secondary/5">
            <Clock className="h-5 w-5 text-secondary animate-pulse" />
            <div className="flex flex-col">
              <span className="font-mono font-bold text-secondary text-2xl leading-none">
                {formatTime(seconds)}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                Active Workout Duration
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Routine Layout */}
      {!isActive ? (
        <Card className="p-10 glass border-white/5 rounded-[3rem] space-y-8 text-center max-w-2xl mx-auto py-16">
          <div className="h-20 w-20 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 mx-auto shadow-inner">
            <Dumbbell className="h-10 w-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading">Ready to Sync Your Routine?</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              This routine has <span className="text-secondary font-bold">{workout.exercises.length} exercises</span>. Start the active timer to enable inline logging, stopwatch metrics, and custom rest timers.
            </p>
          </div>
          <Button
            onClick={startSession}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-12 h-16 text-lg rounded-2xl shadow-xl shadow-secondary/15 group"
          >
            <Play className="mr-2 h-5 w-5 fill-primary group-hover:scale-110 transition-transform" />
            Start Active Session
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exercises Logging Panel */}
          <div className="lg:col-span-2 space-y-6">
            {loggedExercises.map((ex, exIdx) => (
              <Card key={ex.exerciseId} className="p-6 glass border-white/5 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold font-heading text-lg text-white">{ex.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md">
                    Rest: {ex.restSec || 60}s
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Set log headings */}
                  <div className="grid grid-cols-12 gap-4 text-[9px] font-bold uppercase text-muted-foreground px-2">
                    <span className="col-span-2 text-center">Set</span>
                    <span className="col-span-4 text-center">Weight (kg)</span>
                    <span className="col-span-4 text-center">Reps</span>
                    <span className="col-span-2 text-center">Done</span>
                  </div>

                  {ex.sets.map((set: any, setIdx: number) => (
                    <div
                      key={set.setNumber}
                      className={`grid grid-cols-12 gap-4 items-center p-2 rounded-xl border transition-all ${
                        set.completed
                          ? "bg-secondary/10 border-secondary/20 text-secondary"
                          : "bg-white/[0.02] border-white/5 text-foreground"
                      }`}
                    >
                      <span className="col-span-2 font-mono font-bold text-center">
                        {set.setNumber}
                      </span>
                      <div className="col-span-4 flex justify-center">
                        <Input
                          type="number"
                          placeholder="0"
                          value={set.weight || ""}
                          onChange={(e) =>
                            handleSetWeightChange(exIdx, setIdx, parseFloat(e.target.value) || 0)
                          }
                          className="h-9 w-20 text-center bg-background/50 border-white/10 rounded-lg text-sm font-bold text-white focus:border-secondary/40"
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
                          className="h-9 w-20 text-center bg-background/50 border-white/10 rounded-lg text-sm font-bold text-white focus:border-secondary/40"
                          disabled={set.completed}
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Checkbox
                          checked={set.completed}
                          onCheckedChange={() => handleSetToggle(exIdx, setIdx)}
                          className="h-5 w-5 border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:text-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Session Overview and Rest Timer panel */}
          <div className="space-y-6">
            {/* Rest Timer Widget */}
            {isResting && (
              <Card className="p-6 bg-secondary/10 border-secondary/30 border rounded-[2rem] space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30">
                    <BellRing className="h-5 w-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary text-sm">Rest Period Active</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
                      Recovery Phase
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline font-mono text-white">
                    <span className="text-3xl font-bold">{restSeconds}s</span>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                      / {restDuration}s planned
                    </span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-1000"
                      style={{ width: `${(restSeconds / restDuration) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Session Notes & Finishing */}
            <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading">Session Details</h3>
                <p className="text-xs text-muted-foreground">Add details to save in your workout log.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Session Notes
                </label>
                <textarea
                  placeholder="How did this routine feel? Bench PR felt stable..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-secondary/40 text-white placeholder-muted-foreground"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={finishSession}
                  disabled={isSaving}
                  className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl text-base shadow-xl shadow-secondary/10 gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                  Finish and Log Session
                </Button>
                <Button
                  onClick={() => {
                    if (confirm("Cancel this active training session? Your progress won't be saved.")) {
                      setIsActive(false);
                      setSeconds(0);
                    }
                  }}
                  variant="ghost"
                  className="w-full hover:bg-red-500/10 hover:text-red-500 font-bold h-12 rounded-2xl"
                >
                  <Square className="mr-2 h-4 w-4 fill-none" />
                  Cancel Session
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
