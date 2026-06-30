"use client";

import { useState, useEffect, useCallback } from "react";
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
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { searchExercises, createWorkout, generateWorkoutWithAI, getWorkoutTemplates, loadWorkoutTemplate } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Difficulty } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratingStep, setAiGeneratingStep] = useState(0);
  const [templates, setTemplates] = useState<{ id: string; name: string; description: string; difficulty: string; daysPerWeek: number }[]>([]);
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSelectedExercises((prev) => {
      const oldIndex = prev.findIndex((ex) => ex.id === active.id);
      const newIndex = prev.findIndex((ex) => ex.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated.map((ex, idx) => ({ ...ex, order: idx }));
    });
  }, []);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setAiGeneratingStep(1);
    
    // Simulate AI thinking steps for better UX
    const stepInterval = setInterval(() => {
      setAiGeneratingStep(prev => prev < 3 ? prev + 1 : prev);
    }, 1500);

    const result = await generateWorkoutWithAI(difficulty);
    
    clearInterval(stepInterval);
    
    if (result.success && result.exercises) {
      setName(result.name || `AI ${difficulty} Protocol`);
      setSelectedExercises(result.exercises.map((ex: any, idx: number) => ({
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
        exerciseId: ex.exerciseId,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        order: idx,
      })));
    } else {
      alert(result.error || "Failed to generate AI workout plan.");
    }
    setIsGenerating(false);
    setAiGeneratingStep(0);
  };

  useEffect(() => {
    getWorkoutTemplates().then(setTemplates);
  }, []);

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
    setSearchQuery("");
  };

  const handleLoadTemplate = async (templateId: string) => {
    setLoadingTemplate(templateId);
    const result = await loadWorkoutTemplate(templateId);
    if (result.success) {
      setName(result.name);
      setDifficulty(result.difficulty as Difficulty);
      if (result.daysPerWeek) setDaysPerWeek(result.daysPerWeek);
      setSelectedExercises(result.exercises.map((ex: any, idx: number) => ({
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
        exerciseId: ex.exerciseId,
        name: ex.name,
        sets: ex.sets,
        reps: String(ex.reps),
        rest: ex.rest,
        order: idx,
      })));
    } else {
      alert(result.error || "Failed to load template");
    }
    setLoadingTemplate(null);
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-24"
    >
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
        <div className="flex items-center gap-4">
          <Link href="/workout">
            <motion.div whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </motion.div>
          </Link>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] leading-none">
              Module Editor
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight text-white">
              Create Protocol
            </h1>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button
            variant="outline"
            className="border-white/5 hover:bg-white/10 font-bold rounded-2xl px-8 h-14"
          >
            Save Draft
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 md:flex-none">
            <Button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-2xl px-8 h-14 gap-2 shadow-xl shadow-secondary/20"
            >
              {isPublishing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Publish Protocol
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Main Builder Workspace */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-8 sm:p-12 glass border-white/5 rounded-[3rem] space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] pointer-events-none" />
            
            {/* Meta Configuration */}
            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-2">
                  Protocol Designation
                </label>
                <Input
                  placeholder="e.g. 12-Week Hypertrophy Architecture"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-16 text-xl sm:text-2xl font-bold bg-white/5 border-white/10 rounded-2xl focus:border-secondary/50 px-6 text-white placeholder:text-white/20 transition-all hover:bg-white/10"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-2">
                    Target Difficulty
                  </label>
                  <select 
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value as Difficulty)
                    }
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold appearance-none hover:bg-white/10 transition-colors text-white focus:outline-none focus:border-secondary/50"
                  >
                    <option value="BEGINNER" className="bg-[#0f172a] text-white">Beginner Level</option>
                    <option value="INTERMEDIATE" className="bg-[#0f172a] text-white">Intermediate Level</option>
                    <option value="ADVANCED" className="bg-[#0f172a] text-white">Advanced Elite</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-2">
                    Frequency (Days/Week)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="7"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold text-white text-lg focus:border-secondary/50 transition-all hover:bg-white/10"
                  />
                </div>
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-6 relative z-10 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  Training Modules
                  <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full">{selectedExercises.length}</span>
                </h2>
              </div>

              <div className="space-y-4 min-h-[300px]">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={selectedExercises.map((ex) => ex.id)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence mode="popLayout">
                      {selectedExercises.map((ex) => (
                        <SortableBuilderExerciseItem
                          key={ex.id}
                          exercise={ex}
                          onRemove={() => removeExercise(ex.id)}
                          onUpdate={(updates) => updateExercise(ex.id, updates)}
                        />
                      ))}
                    </AnimatePresence>
                  </SortableContext>
                </DndContext>

                {selectedExercises.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-48 border-white/10 border-dashed border-2 hover:border-secondary/30 bg-white/[0.02] hover:bg-white/[0.04] rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all group"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-secondary/20 group-hover:text-secondary group-hover:scale-110 transition-all">
                      <Plus className="h-6 w-6 text-muted-foreground group-hover:text-secondary" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-bold text-white">No modules added</p>
                      <p className="text-xs text-muted-foreground">Search the library to assemble your routine.</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8 lg:sticky lg:top-32">
          {/* AI Generation Widget */}
          <Card className="p-8 bg-gradient-to-br from-accent/20 to-slate-900 border-accent/30 border rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="h-32 w-32 text-accent fill-accent" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30 shadow-inner">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">AI Plan Architect</h3>
                  <p className="text-[10px] text-accent uppercase tracking-widest font-bold mt-0.5">Powered by Grok</p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Engage the AI neural network to instantly generate a scientifically-backed protocol based on your selected difficulty and frequency.
              </p>
              
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-slate-950/60 rounded-2xl border border-accent/30 space-y-3"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                      <span>Synthesizing Modules</span>
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </div>
                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: `${(aiGeneratingStep / 3) * 100}%` }}
                        className="h-full bg-accent transition-all duration-1000"
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground text-center animate-pulse">
                      {aiGeneratingStep === 1 && "Analyzing biomechanical loads..."}
                      {aiGeneratingStep === 2 && "Balancing macro-cycles..."}
                      {aiGeneratingStep === 3 && "Finalizing rep protocols..."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleAIGenerate}
                      className="bg-accent hover:bg-accent/90 text-white font-bold w-full rounded-xl h-14 shadow-lg shadow-accent/20 gap-2 transition-all group/btn"
                    >
                      <Zap className="h-5 w-5 fill-white group-hover/btn:scale-110 transition-transform" />
                      Generate AI Protocol
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Templates Widget */}
          {templates.length > 0 && (
            <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6 shadow-2xl">
              <div className="space-y-2">
                <h2 className="text-xl font-bold font-heading text-white">
                  Workout Templates
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  Start from a proven template and customize.
                </p>
              </div>
              <div className="space-y-3">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-secondary/30 hover:bg-secondary/5 group transition-all cursor-pointer"
                    onClick={() => handleLoadTemplate(t.id)}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm font-bold text-white group-hover:text-secondary transition-colors truncate">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{t.description}</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-secondary">{t.difficulty}</span>
                        <span className="text-[9px] font-bold text-muted-foreground">{t.daysPerWeek}d/wk</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={loadingTemplate === t.id}
                      className="h-8 w-8 shrink-0 rounded-xl bg-white/5 hover:bg-secondary hover:text-primary transition-all shadow-sm"
                    >
                      {loadingTemplate === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Database Search Widget */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6 shadow-2xl">
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-heading text-white">
                Exercise Database
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Search 500+ movements to add manually.
              </p>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
              <Input
                placeholder="Search movements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/5 border-white/10 rounded-2xl h-14 text-sm font-bold text-white focus:border-secondary/50 focus:bg-slate-900 transition-all hover:bg-white/10"
              />
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {isSearching ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-secondary/30 hover:bg-secondary/5 group transition-all"
                  >
                    <span className="text-sm font-bold text-white group-hover:text-secondary transition-colors truncate pr-2">{ex.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => addExercise(ex)}
                      className="h-8 w-8 shrink-0 rounded-xl bg-white/5 hover:bg-secondary hover:text-primary transition-all shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : searchQuery.length > 2 ? (
                <div className="text-center space-y-2 py-8 opacity-50">
                  <Search className="h-8 w-8 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-widest">No exercises found</p>
                </div>
              ) : (
                <div className="text-center space-y-2 py-8 opacity-50">
                  <Sparkles className="h-8 w-8 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-widest">Type to search matrix</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function SortableBuilderExerciseItem({
  exercise,
  onRemove,
  onUpdate,
}: {
  exercise: SelectedExercise;
  onRemove: () => void;
  onUpdate: (updates: Partial<SelectedExercise>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto" as any,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-secondary/20 hover:bg-white/[0.05] group transition-all relative overflow-hidden shadow-lg"
    >
      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="h-5 w-5 text-muted-foreground/30 cursor-grab active:cursor-grabbing shrink-0 hover:text-white transition-colors focus:outline-none"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg font-heading text-white group-hover:text-secondary transition-colors truncate">{exercise.name}</h4>
          
          <div className="flex flex-wrap items-center gap-4 mt-3">
             <div className="flex items-center gap-2 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/5">
               <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Sets</span>
               <input 
                  type="number" 
                  value={exercise.sets} 
                  onChange={(e) => onUpdate({ sets: parseInt(e.target.value) || 0 })}
                  className="w-10 bg-transparent border-none text-center text-sm font-bold text-white focus:ring-0 focus:outline-none p-0"
               />
             </div>
             <div className="flex items-center gap-2 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/5">
               <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Reps</span>
               <input 
                  type="text" 
                  value={exercise.reps} 
                  onChange={(e) => onUpdate({ reps: e.target.value })}
                  className="w-16 bg-transparent border-none text-center text-sm font-bold text-white focus:ring-0 focus:outline-none p-0"
               />
             </div>
             <div className="flex items-center gap-2 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/5">
               <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Rest</span>
               <input 
                  type="number" 
                  value={exercise.rest} 
                  onChange={(e) => onUpdate({ rest: parseInt(e.target.value) || 0 })}
                  className="w-10 bg-transparent border-none text-center text-sm font-bold text-white focus:ring-0 focus:outline-none p-0"
               />
               <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">s</span>
             </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:ml-auto self-end sm:self-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 border border-transparent transition-all group/trash"
        >
          <Trash2 className="h-5 w-5 group-hover/trash:scale-110 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
