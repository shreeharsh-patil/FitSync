"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Loader2,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
  Check,
  Apple,
  Utensils,
  Sun,
  Moon,
  Coffee,
  Cookie,
  RefreshCw,
  ListChecks,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { generateMealPlanAction, regenerateMealPlanDay } from "@/lib/actions";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MEAL_ICONS: Record<string, any> = {
  BREAKFAST: Coffee,
  LUNCH: Sun,
  DINNER: Moon,
  SNACK: Cookie,
};

const DIET_TYPES = [
  { value: "balanced", label: "Balanced" },
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "low-carb", label: "Low Carb" },
  { value: "high-protein", label: "High Protein" },
];

const PREFERENCE_OPTIONS = [
  "Chicken", "Fish", "Beef", "Pork", "Eggs", "Tofu",
  "Rice", "Pasta", "Potatoes", "Quinoa", "Oats",
  "Broccoli", "Spinach", "Kale", "Avocado", "Berries",
  "Cheese", "Greek Yogurt", "Almonds", "Peanut Butter",
];

const ALLERGY_OPTIONS = [
  "Dairy", "Eggs", "Gluten", "Peanuts", "Tree Nuts",
  "Soy", "Fish", "Shellfish", "Sesame", "Lactose",
];

interface MealPlanClientProps {
  userId: string;
  initialPlans: any[];
}

export function AIMealPlanClient({ userId, initialPlans }: MealPlanClientProps) {
  const [step, setStep] = useState<"wizard" | "plan" | "saved">("wizard");
  const [goal, setGoal] = useState("maintain");
  const [calories, setCalories] = useState(2200);
  const [dietType, setDietType] = useState("balanced");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [planName, setPlanName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>(initialPlans);
  const [isSaving, setIsSaving] = useState(false);

  const togglePreference = (item: string) => {
    setSelectedPreferences((p) =>
      p.includes(item) ? p.filter((x) => x !== item) : [...p, item]
    );
  };

  const toggleAllergy = (item: string) => {
    setSelectedAllergies((a) =>
      a.includes(item) ? a.filter((x) => x !== item) : [...a]
    );
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setGeneratingStep(1);

    const stepInterval = setInterval(() => {
      setGeneratingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2000);

    const result = await generateMealPlanAction(userId, {
      name: planName,
      goal,
      calories,
      preferences: selectedPreferences,
      allergies: selectedAllergies,
      dietType,
    });

    clearInterval(stepInterval);

    if (result.success && result.mealPlan) {
      setCurrentPlan(result.mealPlan);
      setCurrentDay(0);
      setStep("plan");
    }

    setIsGenerating(false);
    setGeneratingStep(0);
  };

  const handleRegenerateDay = async (dayIndex: number) => {
    if (!currentPlan) return;

    setRegeneratingDay(dayIndex);
    const day = currentPlan.days[dayIndex];
    if (!day) return;

    const result = await regenerateMealPlanDay(day.id, {
      goal,
      calories,
      preferences: selectedPreferences,
      allergies: selectedAllergies,
      dietType,
    });

    if (result.success && result.day) {
      const updatedDays = [...currentPlan.days];
      updatedDays[dayIndex] = {
        ...day,
        meals: JSON.stringify(result.day.meals),
        totalCalories: result.day.totalCalories,
      };
      setCurrentPlan({ ...currentPlan, days: updatedDays });
    }

    setRegeneratingDay(null);
  };

  const savePlan = async () => {
    if (!currentPlan) return;
    setIsSaving(true);

    setSavedPlans((prev) => [currentPlan, ...prev]);
    setStep("saved");
    setIsSaving(false);
  };

  const startNew = () => {
    setStep("wizard");
    setCurrentPlan(null);
    setCurrentDay(0);
  };

  const generateAnother = () => {
    setStep("wizard");
    setCurrentPlan(null);
    setCurrentDay(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {step === "wizard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-10">
            <Card className="p-8 sm:p-12 glass border-white/5 rounded-[3rem] space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] pointer-events-none" />

              <div className="space-y-8 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-2">
                    Plan Name
                  </label>
                  <Input
                    placeholder="e.g. Summer Shred Protocol"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="h-16 text-xl font-bold bg-white/5 border-white/10 rounded-2xl focus:border-secondary/50 px-6 text-white placeholder:text-white/20 hover:bg-white/10"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-2">
                    Fitness Goal
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "cut", label: "Cut", desc: "Calorie deficit", icon: "⬇️" },
                      { value: "bulk", label: "Bulk", desc: "Calorie surplus", icon: "⬆️" },
                      { value: "maintain", label: "Maintain", desc: "Balanced calories", icon: "➡️" },
                    ].map((g) => (
                      <motion.button
                        key={g.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setGoal(g.value)}
                        className={cn(
                          "p-6 rounded-[2rem] border-2 text-left transition-all",
                          goal === g.value
                            ? "border-secondary bg-secondary/10 shadow-lg shadow-secondary/10"
                            : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                        )}
                      >
                        <span className="text-2xl mb-2 block">{g.icon}</span>
                        <p className="font-bold text-white text-lg">{g.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold">{g.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-2">
                    Daily Calorie Target
                  </label>
                  <div className="flex items-center gap-6 p-6 bg-slate-950/40 rounded-[2rem] border border-white/5">
                    <input
                      type="range"
                      min="1200"
                      max="4000"
                      step="50"
                      value={calories}
                      onChange={(e) => setCalories(parseInt(e.target.value))}
                      className="flex-1 h-2 appearance-none bg-white/10 rounded-full accent-secondary cursor-pointer"
                    />
                    <span className="font-mono font-bold text-2xl text-secondary min-w-[80px] text-right">{calories}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">kcal</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-2">
                    Diet Type
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {DIET_TYPES.map((d) => (
                      <motion.button
                        key={d.value}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setDietType(d.value)}
                        className={cn(
                          "px-5 py-3 rounded-2xl border text-sm font-bold transition-all",
                          dietType === d.value
                            ? "border-secondary bg-secondary/10 text-secondary"
                            : "border-white/5 bg-white/[0.02] text-muted-foreground hover:text-white hover:border-white/20"
                        )}
                      >
                        {d.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 sm:p-12 glass border-white/5 rounded-[3rem] space-y-10 shadow-2xl">
              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                  <Check className="h-3 w-3 text-secondary" />
                  Food Preferences
                </label>
                <div className="flex flex-wrap gap-3">
                  {PREFERENCE_OPTIONS.map((item) => (
                    <motion.button
                      key={item}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => togglePreference(item)}
                      className={cn(
                        "px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all",
                        selectedPreferences.includes(item)
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-white/5 bg-white/[0.02] text-muted-foreground hover:text-white hover:border-white/20"
                      )}
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                  <span className="text-red-400 text-xs">⚠</span>
                  Allergies & Restrictions
                </label>
                <div className="flex flex-wrap gap-3">
                  {ALLERGY_OPTIONS.map((item) => (
                    <motion.button
                      key={item}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleAllergy(item)}
                      className={cn(
                        "px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all",
                        selectedAllergies.includes(item)
                          ? "border-red-500/50 bg-red-500/10 text-red-400"
                          : "border-white/5 bg-white/[0.02] text-muted-foreground hover:text-white hover:border-white/20"
                      )}
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-8 lg:sticky lg:top-32">
            <Card className="p-8 bg-gradient-to-br from-secondary/20 to-slate-900 border-secondary/30 border rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="h-32 w-32 text-secondary" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30">
                    <ChefHat className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white">AI Meal Architect</h3>
                    <p className="text-[10px] text-secondary uppercase tracking-widest font-bold mt-0.5">Powered by Grok</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                  Generate a complete 7-day meal plan with macros per meal, tailored to your goals, preferences, and dietary restrictions.
                </p>

                <div className="p-4 bg-slate-950/60 rounded-2xl border border-secondary/20 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <ListChecks className="h-4 w-4 text-secondary" />
                    <span className="text-white">Plan includes:</span>
                  </div>
                  <ul className="text-[10px] text-muted-foreground space-y-1.5 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-secondary" /> 7 days of meals
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-secondary" /> 4 meals per day
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-secondary" /> Full macro breakdown
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-secondary" /> Ingredient lists
                    </li>
                  </ul>
                </div>

                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-slate-950/60 rounded-2xl border border-secondary/30 space-y-3"
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-secondary uppercase tracking-widest">
                        <span>Crafting Your Plan</span>
                        <Loader2 className="h-3 w-3 animate-spin" />
                      </div>
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${(generatingStep / 3) * 100}%` }}
                          className="h-full bg-secondary transition-all duration-1000"
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground text-center animate-pulse">
                        {generatingStep === 0 && "Analyzing nutritional requirements..."}
                        {generatingStep === 1 && "Designing meal architecture..."}
                        {generatingStep === 2 && "Calculating micro-nutrient density..."}
                        {generatingStep === 3 && "Finalizing macro distribution..."}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={generatePlan}
                        disabled={!goal || !calories}
                        className="bg-secondary hover:bg-secondary/90 text-primary font-bold w-full rounded-xl h-14 shadow-lg shadow-secondary/20 gap-2"
                      >
                        <Sparkles className="h-5 w-5" />
                        Generate Meal Plan
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {savedPlans.length > 0 && (
              <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-4 shadow-2xl">
                <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                  <Save className="h-4 w-4 text-secondary" />
                  Saved Plans
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {savedPlans.map((plan: any) => (
                    <div key={plan.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                      <p className="font-bold text-white truncate">{plan.name}</p>
                      <p className="text-[9px] text-muted-foreground mt-1">
                        {plan.goal} · {plan.calories} kcal · {plan.dietType}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {step === "plan" && currentPlan && (
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={generateAnother}
                className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div>
                <h2 className="text-3xl font-bold font-heading text-white">{currentPlan.name || "AI Meal Plan"}</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                  {goal.charAt(0).toUpperCase() + goal.slice(1)} · {calories} kcal/day · {dietType}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={savePlan}
                disabled={isSaving}
                className="border-white/10 hover:bg-white/10 font-bold rounded-2xl h-14 px-6 gap-2"
              >
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Save Plan
              </Button>
              <Button
                onClick={generateAnother}
                className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-2xl h-14 px-6 gap-2 shadow-xl shadow-secondary/20"
              >
                <RefreshCw className="h-5 w-5" />
                Generate New
              </Button>
            </div>
          </div>

          <Card className="p-8 glass border-white/5 rounded-[3rem] shadow-2xl">
            <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
              {currentPlan.days.map((day: any, idx: number) => (
                <motion.button
                  key={day.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentDay(idx)}
                  className={cn(
                    "shrink-0 px-6 py-4 rounded-2xl border-2 text-left transition-all min-w-[120px]",
                    currentDay === idx
                      ? "border-secondary bg-secondary/10"
                      : "border-white/5 bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    {idx === 0 ? "Today" : `Day ${idx + 1}`}
                  </p>
                  <p className="text-sm font-bold text-white mt-1">{DAY_NAMES[idx]}</p>
                  <p className="text-[10px] text-secondary font-mono font-bold mt-1">
                    {day.totalCalories} kcal
                  </p>
                </motion.button>
              ))}
            </div>
          </Card>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {currentPlan.days[currentDay] && (() => {
                const day = currentPlan.days[currentDay];
                const meals = typeof day.meals === "string" ? JSON.parse(day.meals) : day.meals;
                return meals.map((meal: any, mealIdx: number) => {
                  const Icon = MEAL_ICONS[meal.mealType] || Utensils;
                  return (
                    <Card key={mealIdx} className="p-6 glass border-white/5 rounded-[2.5rem] space-y-4 shadow-xl relative overflow-hidden group hover:border-secondary/20 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                              {meal.mealType}
                            </p>
                            <p className="font-bold text-white text-base">{meal.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-lg text-secondary">{meal.calories}</p>
                          <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">kcal</p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 bg-slate-950/40 rounded-2xl border border-white/5">
                        <MacroBadge label="P" value={`${meal.protein}g`} color="text-secondary" />
                        <MacroBadge label="C" value={`${meal.carbs}g`} color="text-accent" />
                        <MacroBadge label="F" value={`${meal.fat}g`} color="text-blue-400" />
                      </div>

                      {meal.ingredients && (
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          {meal.ingredients}
                        </p>
                      )}
                    </Card>
                  );
                });
              })()}
            </motion.div>
          </AnimatePresence>

          <Card className="p-6 glass border-white/5 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-accent" />
                <span className="text-sm font-bold text-white">Need a different day?</span>
              </div>
              <Button
                variant="outline"
                onClick={() => handleRegenerateDay(currentDay)}
                disabled={regeneratingDay === currentDay}
                className="border-white/10 hover:bg-white/10 font-bold rounded-2xl gap-2"
              >
                {regeneratingDay === currentDay ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Regenerate {DAY_NAMES[currentDay]}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {step === "saved" && (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="h-24 w-24 rounded-[2.5rem] bg-secondary/20 flex items-center justify-center border-2 border-secondary shadow-xl shadow-secondary/20"
          >
            <Save className="h-12 w-12 text-secondary" />
          </motion.div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold font-heading text-white">Plan Saved!</h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your AI-generated meal plan has been saved. Access it anytime from the saved plans panel.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={startNew}
              className="border-white/10 hover:bg-white/10 font-bold rounded-2xl h-14 px-8"
            >
              View All Plans
            </Button>
            <Button
              onClick={generateAnother}
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-2xl h-14 px-8 gap-2 shadow-xl shadow-secondary/20"
            >
              <Sparkles className="h-5 w-5" />
              Create Another
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function MacroBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("text-[10px] font-bold uppercase", color)}>{label}</span>
      <span className="text-xs font-mono font-bold text-white/60">{value}</span>
    </div>
  );
}
