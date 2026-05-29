"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Search,
  Zap,
  Save,
  ChevronLeft,
  GripVertical,
  Trash2,
  Settings,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { searchExercises, createWorkout } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Difficulty } from "@prisma/client";

interface WorkoutBuilderProps {
  userId: string;
}

interface SelectedExercise {
  id: string;
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  order: number;
}

export function WorkoutBuilder({ userId }: WorkoutBuilderProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("BEGINNER");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        const results = await searchExercises(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const addExercise = (exercise: { id: string; name: string }) => {
    const newEx: SelectedExercise = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      exerciseId: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: "10-12",
      rest: 60,
      order: selectedExercises.length,
    };
    setSelectedExercises([...selectedExercises, newEx]);
  };

  const removeExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter((ex) => ex.id !== id));
  };

  const updateExercise = (id: string, updates: Partial<SelectedExercise>) => {
    setSelectedExercises(
      selectedExercises.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)),
    );
  };

  const handlePublish = async () => {
    if (!name) return alert("Please enter a plan name");
    if (selectedExercises.length === 0) return alert("Please add at least one exercise");

    setIsPublishing(true);
    const result = await createWorkout(userId, {
      name,
      difficulty,
      daysPerWeek,
      exercises: selectedExercises.map((ex, index) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        order: index,
      })),
    });

    if (result.success) {
      router.push("/workout");
    } else {
      alert(result.error);
    }
    setIsPublishing(false);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <Link href="/workout">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/5"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold font-heading tracking-tight">
              Create New Plan
            </h1>
            <p className="text-muted-foreground mt-2">
              Design your perfect training routine with precision.
            </p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            variant="outline"
            className="border-white/5 hover:bg-white/5 font-bold rounded-xl px-8 h-12"
          >
            Save Draft
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl px-8 h-12 gap-2 shadow-lg shadow-secondary/10"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Publish Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Builder Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-10 glass border-white/5 rounded-[3rem] space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Plan Name
                </label>
                <Input
                  placeholder="e.g. 12-Week Hypertrophy Protocol"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-16 text-2xl font-bold bg-white/5 border-white/5 rounded-2xl focus:border-secondary/40 px-6"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Difficulty
                  </label>
                  <select 
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value as Difficulty)
                    }
                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-4 text-sm font-bold appearance-none hover:bg-white/10 transition-colors text-white"
                  >
                    <option value="BEGINNER" className="bg-[#0f172a] text-white" style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>Beginner</option>
                    <option value="INTERMEDIATE" className="bg-[#0f172a] text-white" style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>Intermediate</option>
                    <option value="ADVANCED" className="bg-[#0f172a] text-white" style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Days Per Week
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="7"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-heading">Exercises</h2>
              </div>

              <div className="space-y-4">
                {selectedExercises.map((ex) => (
                  <BuilderExerciseItem
                    key={ex.id}
                    exercise={ex}
                    onRemove={() => removeExercise(ex.id)}
                    onUpdate={(updates) => updateExercise(ex.id, updates)}
                  />
                ))}
              </div>

              {selectedExercises.length === 0 && (
                <div
                  className="w-full h-32 border-white/5 border-dashed border-2 hover:border-secondary/20 hover:bg-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-2 group transition-all"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground">
                    Search and add exercises from the library
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Search & Sidebar */}
        <div className="space-y-8">
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-heading">
                Exercise Library
              </h2>
              <p className="text-xs text-muted-foreground">
                Find and add exercises to your plan.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/5 rounded-xl h-12"
              />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {isSearching ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-secondary" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-secondary/20 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">{ex.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => addExercise(ex)}
                      className="h-6 w-6 rounded-lg hover:bg-secondary/10 hover:text-secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : searchQuery.length > 2 ? (
                <p className="text-center text-xs text-muted-foreground py-4">No exercises found</p>
              ) : (
                <p className="text-center text-xs text-muted-foreground py-4">Start typing to search...</p>
              )}
            </div>
          </Card>

          <Card className="p-8 bg-secondary/10 border-secondary/20 border rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="h-24 w-24 text-secondary fill-secondary" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-bold font-heading">
                AI Plan Assistant
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Let our AI analyze your goals and generate a
                scientifically-backed plan for you.
              </p>
              <Button className="bg-secondary text-primary font-bold w-full rounded-xl h-12 shadow-lg shadow-secondary/10">
                Generate with AI
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BuilderExerciseItem({
  exercise,
  onRemove,
  onUpdate,
}: {
  exercise: SelectedExercise;
  onRemove: () => void;
  onUpdate: (updates: Partial<SelectedExercise>) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-secondary/10 group transition-all relative overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
      <GripVertical className="h-5 w-5 text-muted-foreground/40 cursor-move shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold font-heading truncate">{exercise.name}</h4>
        <div className="flex items-center gap-4 mt-2">
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-muted-foreground uppercase">Sets</span>
             <input 
                type="number" 
                value={exercise.sets} 
                onChange={(e) => onUpdate({ sets: parseInt(e.target.value) })}
                className="w-12 bg-white/5 border border-white/10 rounded px-1 text-xs font-bold"
             />
           </div>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-muted-foreground uppercase">Reps</span>
             <input 
                type="text" 
                value={exercise.reps} 
                onChange={(e) => onUpdate({ reps: e.target.value })}
                className="w-16 bg-white/5 border border-white/10 rounded px-1 text-xs font-bold"
             />
           </div>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-muted-foreground uppercase">Rest</span>
             <input 
                type="number" 
                value={exercise.rest} 
                onChange={(e) => onUpdate({ rest: parseInt(e.target.value) })}
                className="w-12 bg-white/5 border border-white/10 rounded px-1 text-xs font-bold"
             />
             <span className="text-[10px] font-bold text-muted-foreground uppercase">s</span>
           </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
