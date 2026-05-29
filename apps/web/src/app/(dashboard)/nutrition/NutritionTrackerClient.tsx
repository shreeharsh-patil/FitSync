"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Utensils,
  Droplets,
  Flame,
  Plus,
  Search,
  ChevronRight,
  Zap,
  Loader2,
  X,
  Compass,
  Smile,
  Camera,
  Scan,
  Sparkles,
  Info,
  Maximize2,
  CheckCircle2,
} from "lucide-react";
import { logMeal } from "@/lib/actions";
import { MealType } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NutritionTrackerClientProps {
  initialLogs: any[];
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

export function NutritionTrackerClient({ initialLogs, userId }: NutritionTrackerClientProps) {
  const [logs, setLogs] = useState<any[]>(initialLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  
  // AI Scanner state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  // Form state
  const [mealType, setMealType] = useState<MealType>("BREAKFAST");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const [isWaterLogging, setIsWaterLogging] = useState(false);

  const calorieTarget = 2400;
  const waterTarget = 3500;
  const proteinTarget = 180;
  const carbsTarget = 280;
  const fatTarget = 80;

  const totalCalories = logs.reduce((acc, log) => acc + log.totalCalories, 0);
  const totalWater = logs.reduce((acc, log) => acc + (log.waterMl || 0), 0);
  
  const totalProtein = logs.reduce((acc, log) => {
    const p = log.foodItems?.[0]?.protein || 0;
    return acc + p;
  }, 0);
  const totalCarbs = logs.reduce((acc, log) => {
    const c = log.foodItems?.[0]?.carbs || 0;
    return acc + c;
  }, 0);
  const totalFat = logs.reduce((acc, log) => {
    const f = log.foodItems?.[0]?.fat || 0;
    return acc + f;
  }, 0);

  const logWater = async (amount: number) => {
    setIsWaterLogging(true);
    const res = await logMeal(userId, {
      mealType: "SNACK",
      foodItems: [{ name: "Water Intake", qty: 1, unit: "serving", calories: 0, protein: 0, carbs: 0, fat: 0 }],
      totalCalories: 0,
      waterMl: amount,
      notes: "Logged hydration",
    });

    if (res.success) {
      setLogs((prev) => [
        {
          id: res.id,
          mealType: "SNACK" as MealType,
          totalCalories: 0,
          waterMl: amount,
          createdAt: new Date(),
          notes: "Logged hydration",
          foodItems: [{ name: "Water Intake", qty: 1, unit: "serving", calories: 0, protein: 0, carbs: 0, fat: 0 }]
        },
        ...prev,
      ]);
    }
    setIsWaterLogging(false);
  };

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsLogging(true);
    const foodItems = [
      {
        name,
        qty: 1,
        unit: "serving",
        calories,
        protein,
        carbs,
        fat,
      },
    ];

    const res = await logMeal(userId, {
      mealType,
      foodItems,
      totalCalories: calories,
      notes,
    });

    if (res.success) {
      setLogs((prev) => [
        {
          id: res.id,
          mealType,
          totalCalories: calories,
          foodItems,
          createdAt: new Date(),
          notes,
        },
        ...prev,
      ]);
      resetForm();
      setIsModalOpen(false);
    }
    setIsLogging(false);
  };

  const resetForm = () => {
    setName("");
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFat(0);
    setNotes("");
  };

  const startAiScan = () => {
    setIsScannerOpen(true);
    setIsScanning(true);
    setScanStep(0);
    
    // Simulate multi-step AI vision analysis
    setTimeout(() => setScanStep(1), 1000); // Feature extraction
    setTimeout(() => setScanStep(2), 2000); // Volumetric analysis
    setTimeout(() => setScanStep(3), 3000); // Database lookup
    
    setTimeout(() => {
      setIsScanning(false);
      // Simulate detection results
      setName("Grilled Salmon & Quinoa Power Bowl");
      setCalories(640);
      setProtein(42);
      setCarbs(48);
      setFat(22);
      setNotes("AI Detected: Salmon (200g), Quinoa (150g), Kale, Avocado.");
      
      setIsScannerOpen(false);
      setIsModalOpen(true);
    }, 4500);
  };

  const filteredLogs = logs.filter((l) => l.totalCalories > 0);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 relative"
    >
      {/* HUD Header for Quick Tracking */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] leading-none px-1">
            Fuel Matrix Synchronisation
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight text-white">Nutrition <span className="text-secondary">Ecosystem</span></h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
            <Button
              onClick={startAiScan}
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-accent/20 transition-all border border-accent/30 group"
            >
              <div className="h-7 w-7 rounded-xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Scan className="h-4 w-4" />
              </div>
              AI Smart Scan
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-secondary/20"
            >
              <Plus className="h-5 w-5 stroke-[3px]" />
              Manual Log
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Main Progression Analytics */}
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              icon={<Flame className="h-5 w-5 text-orange-400" />}
              label="Energy Balance"
              value={totalCalories.toLocaleString()}
              unit="kcal"
              target={`${calorieTarget}`}
              color="bg-orange-500"
              glowColor="shadow-orange-500/20"
              percentage={Math.min(100, (totalCalories / calorieTarget) * 100)}
            />
            <StatsCard
              icon={<Utensils className="h-5 w-5 text-secondary" />}
              label="Protein Load"
              value={totalProtein.toLocaleString()}
              unit="g"
              target={`${proteinTarget}`}
              color="bg-secondary"
              glowColor="shadow-secondary/20"
              percentage={Math.min(100, (totalProtein / proteinTarget) * 100)}
            />
            <StatsCard
              icon={<Droplets className="h-5 w-5 text-blue-400" />}
              label="Cellular Hydration"
              value={`${(totalWater / 1000).toFixed(1)}`}
              unit="L"
              target={`${(waterTarget / 1000).toFixed(1)}`}
              color="bg-blue-500"
              glowColor="shadow-blue-500/20"
              percentage={Math.min(100, (totalWater / waterTarget) * 100)}
            />
          </div>

          {/* Macro Breakdown Panel */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 glass border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center relative z-10">
                <h2 className="text-xl font-bold font-heading text-white">Macro Distribution</h2>
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <MacroCircle 
                  label="Protein" 
                  value={totalProtein} 
                  target={proteinTarget} 
                  color="var(--secondary)" 
                  unit="g"
                />
                <MacroCircle 
                  label="Carbohydrates" 
                  value={totalCarbs} 
                  target={carbsTarget} 
                  color="var(--accent)" 
                  unit="g"
                />
                <MacroCircle 
                  label="Healthy Fats" 
                  value={totalFat} 
                  target={fatTarget} 
                  color="#3b82f6" 
                  unit="g"
                />
              </div>
            </Card>
          </motion.div>

          {/* Meals Feed */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex justify-between items-center px-4">
              <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                Sync Logs
                <Sparkles className="h-4 w-4 text-secondary" />
              </h2>
            </div>

            <div className="space-y-4">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <MealItem
                    key={log.id}
                    name={log.foodItems?.[0]?.name || log.mealType}
                    calories={log.totalCalories}
                    protein={log.foodItems?.[0]?.protein || 0}
                    carbs={log.foodItems?.[0]?.carbs || 0}
                    fat={log.foodItems?.[0]?.fat || 0}
                    time={new Date(log.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    category={log.mealType}
                  />
                ))
              ) : (
                <Card className="p-16 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6 rounded-[3rem] bg-white/[0.01]">
                  <div className="h-20 w-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-muted-foreground border border-white/5 shadow-inner">
                    <Utensils className="h-10 w-10 opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-xl text-white">No nutrition logs detected</p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      Fuel your hypertrophy gains and synchronize your energy metrics for peak training success.
                    </p>
                  </div>
                  <Button onClick={() => setIsModalOpen(true)} variant="outline" className="font-bold rounded-xl h-11 px-8 border-white/10 hover:bg-white/5">
                    Start Your First Log
                  </Button>
                </Card>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8 lg:sticky lg:top-32">
          {/* Quick Hydration Widget */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 glass border-white/5 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <Droplets className="h-48 w-48 text-blue-400" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-bold font-heading text-white">Hydration HUD</h3>
                <p className="text-xs text-muted-foreground font-medium">Instant cellular hydration logging.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <Button
                  onClick={() => logWater(250)}
                  disabled={isWaterLogging}
                  variant="outline"
                  className="h-20 rounded-3xl border-white/5 bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/5 font-bold gap-3 flex flex-col items-center justify-center transition-all group/btn"
                >
                  <Droplets className="h-6 w-6 text-blue-400 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-widest">+250 mL</span>
                </Button>
                <Button
                  onClick={() => logWater(750)}
                  disabled={isWaterLogging}
                  variant="outline"
                  className="h-20 rounded-3xl border-white/5 bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/5 font-bold gap-3 flex flex-col items-center justify-center transition-all group/btn"
                >
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Droplets className="h-8 w-8 text-blue-500" />
                  </motion.div>
                  <span className="text-[10px] uppercase tracking-widest">+750 mL</span>
                </Button>
              </div>
              
              <AnimatePresence>
                {isWaterLogging && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center gap-2 text-[10px] text-secondary font-mono font-bold uppercase tracking-widest"
                  >
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Syncing Matrix...
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* AI Performance Tip */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 bg-gradient-to-br from-secondary/15 to-primary/20 border-secondary/25 border rounded-[3rem] relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="h-24 w-24 text-secondary" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30">
                  <Zap className="h-5 w-5 fill-secondary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white">AI Performance Insight</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold italic">
                  "Your protein distribution is peaking at the optimal anabolic window post-session. Maintaining this synchronicity will increase hypertrophic adaptation by estimated 8% over this cycle."
                </p>
                <div className="pt-2">
                  <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                    Grok Verified
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* AI Scanner Modal Simulation */}
      <AnimatePresence>
        {isScannerOpen && (
          <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl aspect-square sm:aspect-video bg-black/40 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-3xl"
            >
              {/* Viewfinder simulation */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="h-12 w-12 border-t-2 border-l-2 border-secondary rounded-tl-2xl" />
                  <div className="h-12 w-12 border-t-2 border-r-2 border-secondary rounded-tr-2xl" />
                </div>
                <div className="flex justify-between">
                  <div className="h-12 w-12 border-b-2 border-l-2 border-secondary rounded-bl-2xl" />
                  <div className="h-12 w-12 border-b-2 border-r-2 border-secondary rounded-br-2xl" />
                </div>
              </div>

              {/* Scanning line animation */}
              {isScanning && (
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent z-10 shadow-[0_0_20px_var(--secondary)]"
                />
              )}

              {/* Step indicator HUD */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                <div className="bg-slate-950/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 text-center space-y-2 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-secondary animate-spin" />
                    <span className="text-xl font-bold font-heading text-white tracking-tight">AI Vision Scanning...</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={scanStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-[10px] text-secondary font-mono font-bold uppercase tracking-[0.3em]"
                    >
                      {scanStep === 0 && "Initializing Hyper-Spectral Analysis"}
                      {scanStep === 1 && "Segmenting Nutrition Modules"}
                      {scanStep === 2 && "Calculating Macro Density Indices"}
                      {scanStep === 3 && "Synchronizing with Global Database"}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Mock camera image simulation */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-secondary/5 via-black to-accent/5" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center"
            >
              <p className="text-muted-foreground text-sm font-medium mb-4">Focus your meal within the matrix frame...</p>
              <Button 
                variant="ghost" 
                onClick={() => setIsScannerOpen(false)}
                className="text-white font-bold h-12 px-8 rounded-xl border border-white/10 hover:bg-white/5"
              >
                Abort Scan
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Log Meal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <Card className="w-full max-w-xl glass border-white/10 p-10 space-y-8 relative rounded-[3rem] shadow-3xl">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-bold font-heading text-white tracking-tight">Log Module</h3>
                    {name.includes("Power Bowl") && (
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Identified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Keep your calorie and macro synchronicity precise.</p>
                </div>

                <form onSubmit={handleLogMeal} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] px-2">
                        Category
                      </label>
                      <select
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value as MealType)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold text-white focus:outline-none focus:border-secondary/50 transition-all"
                      >
                        <option value="BREAKFAST" className="bg-[#0f172a]">Breakfast Protocol</option>
                        <option value="LUNCH" className="bg-[#0f172a]">Lunch Module</option>
                        <option value="DINNER" className="bg-[#0f172a]">Dinner Module</option>
                        <option value="SNACK" className="bg-[#0f172a]">Snack Buffer</option>
                      </select>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] px-2">
                        Module Name
                      </label>
                      <Input
                        required
                        placeholder="e.g. Hypertrophy Bowl"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold focus:border-secondary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-950/40 rounded-[2rem] border border-white/5">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] block text-center">Calories</label>
                      <Input
                        type="number"
                        value={calories || ""}
                        onChange={(e) => setCalories(parseFloat(e.target.value) || 0)}
                        className="h-12 bg-white/5 border-white/10 text-center font-mono font-bold text-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] block text-center">Protein (g)</label>
                      <Input
                        type="number"
                        value={protein || ""}
                        onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
                        className="h-12 bg-white/5 border-white/10 text-center font-mono font-bold text-secondary rounded-xl"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] block text-center">Carbs (g)</label>
                      <Input
                        type="number"
                        value={carbs || ""}
                        onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
                        className="h-12 bg-white/5 border-white/10 text-center font-mono font-bold text-accent rounded-xl"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] block text-center">Fat (g)</label>
                      <Input
                        type="number"
                        value={fat || ""}
                        onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
                        className="h-12 bg-white/5 border-white/10 text-center font-mono font-bold text-blue-400 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] px-2">
                      Nutrition Notes
                    </label>
                    <textarea
                      placeholder="High fiber, high density..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-secondary/50 text-white placeholder-muted-foreground transition-all"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 border-white/10 border h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                    >
                      Discard
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLogging}
                      className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl shadow-xl shadow-secondary/20 gap-3 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                        {isLogging ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Sync Log
                      </span>
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  unit,
  target,
  color,
  glowColor,
  percentage,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  target: string;
  color: string;
  glowColor: string;
  percentage: number;
}) {
  return (
    <Card className="p-7 glass border-white/5 rounded-[2.5rem] relative overflow-hidden shadow-2xl group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="h-12 w-12 rounded-2xl bg-background/50 flex items-center justify-center border border-white/5 shadow-inner">
          {icon}
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
            {label}
          </p>
          <p className="text-3xl font-extrabold font-heading text-white leading-none">
            {value} <span className="text-xs text-muted-foreground font-medium uppercase">{unit}</span>
          </p>
        </div>
      </div>
      <div className="space-y-3 relative z-10">
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">
          <span>{Math.round(percentage)}% Synchronized</span>
          <span>Goal: {target}</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn("h-full rounded-full transition-all duration-1000 shadow-lg", color, glowColor)}
          />
        </div>
      </div>
    </Card>
  );
}

function MacroCircle({ label, value, target, color, unit }: { label: string; value: number; target: number; color: string; unit: string }) {
  const percentage = Math.min(100, (value / target) * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full rotate-[-90deg]">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
            style={{ filter: `drop-shadow(0 0 5px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white leading-none">{value}</span>
          <span className="text-[8px] text-muted-foreground font-bold uppercase mt-1">{unit}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-secondary transition-colors">{label}</p>
        <p className="text-[9px] text-muted-foreground mt-1">Target: {target}{unit}</p>
      </div>
    </div>
  );
}

function MealItem({
  name,
  calories,
  protein,
  carbs,
  fat,
  time,
  category,
}: {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  category: string;
}) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, x: 5 }}
      className="flex items-center justify-between p-5 rounded-[2rem] glass border border-white/5 hover:border-secondary/20 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-5">
        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-secondary/10 group-hover:text-secondary group-hover:border-secondary/20 transition-all shadow-inner">
          <Utensils className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-white group-hover:text-secondary transition-colors">{name}</h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
              {category}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Synchronized at {time}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-10">
        <div className="hidden md:flex gap-6">
          <MacroPill label="P" value={protein} color="text-secondary" />
          <MacroPill label="C" value={carbs} color="text-accent" />
          <MacroPill label="F" value={fat} color="text-blue-400" />
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono font-bold text-lg text-white leading-none">{calories}</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">
            kcal
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MacroPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("text-[9px] font-bold uppercase", color)}>{label}</span>
      <span className="text-xs font-mono font-bold text-white/60">{value}g</span>
    </div>
  );
}
