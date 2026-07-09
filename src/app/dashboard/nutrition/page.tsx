"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Utensils, Apple, Coffee, Beef, Plus, Sparkles, Droplets, Zap, Loader2 } from "lucide-react";

interface MealType {
  _id: string;
  mealType: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterMl: number;
  foodItems: { name: string; calories: number; protein: number; carbs: number; fat: number }[];
  logDate: string;
}

const mealIcons: Record<string, { icon: any; color: string; bg: string }> = {
  breakfast: { icon: Coffee, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  lunch: { icon: Beef, color: "text-accent", bg: "bg-accent/10" },
  dinner: { icon: Utensils, color: "text-blue-400", bg: "bg-blue-400/10" },
  snack: { icon: Apple, color: "text-secondary", bg: "bg-secondary/10" },
};

const macroGoals = { calories: 2200, protein: 160, carbs: 220, fat: 70 };

export default function NutritionPage() {
  const [meals, setMeals] = useState<MealType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mealType, setMealType] = useState("breakfast");
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState(0);
  const [foodProtein, setFoodProtein] = useState(0);
  const [foodCarbs, setFoodCarbs] = useState(0);
  const [foodFat, setFoodFat] = useState(0);
  const [waterAmount, setWaterAmount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchMeals = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/nutrition?date=${today}`);
      const json = await res.json();
      setMeals(json.meals || []);
    } catch (e) {
      console.error("Failed to fetch meals", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeals(); }, []);

  interface DailyTotals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    waterMl: number;
    [key: string]: number;
  }

  const dailyTotals: DailyTotals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.totalCalories || 0;
      acc.protein += meal.totalProtein || 0;
      acc.carbs += meal.totalCarbs || 0;
      acc.fat += meal.totalFat || 0;
      acc.waterMl += meal.waterMl || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, waterMl: 0 } as DailyTotals
  );

  const handleAddMeal = async () => {
    if (!foodName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType,
          foodItems: [{ name: foodName, calories: foodCalories, protein: foodProtein, carbs: foodCarbs, fat: foodFat }],
          waterMl: waterAmount,
        }),
      });
      if (res.ok) {
        setSuccessMsg("Meal added!");
        setShowAddForm(false);
        setFoodName("");
        setFoodCalories(0);
        setFoodProtein(0);
        setFoodCarbs(0);
        setFoodFat(0);
        setWaterAmount(0);
        fetchMeals();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      console.error("Failed to add meal", e);
    } finally {
      setSaving(false);
    }
  };

  const mealsByType = ["breakfast", "lunch", "dinner", "snack"].map((type) => {
    const meal = meals.find((m) => m.mealType === type);
    const iconData = mealIcons[type] || mealIcons.snack;
    return {
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      meal,
      icon: iconData.icon,
      color: iconData.color,
      bg: iconData.bg,
    };
  });

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-secondary text-sm font-bold mb-1"><Utensils className="h-4 w-4" />Nutrition Center</div>
          <h1 className="text-4xl font-bold font-heading tracking-tight text-white">Fuel Your Body</h1>
          <p className="text-muted-foreground mt-1">Track your macros and log your meals.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-accent text-primary font-bold rounded-xl transition-all hover:shadow-lg group">
          {showAddForm ? null : <Plus className="h-4 w-4" />}
          {showAddForm ? "Cancel" : "Add Meal"}
        </button>
      </motion.div>

      {successMsg && (
        <div className="p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl text-sm font-bold animate-fade-in">{successMsg}</div>
      )}

      {/* Add Meal Form */}
      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] border-white/5 p-8 space-y-6">
          <h2 className="text-xl font-bold font-heading text-white">Quick Add Meal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Meal Type</label>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-secondary/40">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Food Name</label>
              <input value={foodName} onChange={(e) => setFoodName(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-secondary/40" placeholder="e.g. Chicken breast" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Calories</label>
              <input type="number" value={foodCalories || ""} onChange={(e) => setFoodCalories(parseInt(e.target.value) || 0)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-secondary/40" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Protein (g)</label>
              <input type="number" value={foodProtein || ""} onChange={(e) => setFoodProtein(parseInt(e.target.value) || 0)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-secondary/40" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Carbs (g)</label>
              <input type="number" value={foodCarbs || ""} onChange={(e) => setFoodCarbs(parseInt(e.target.value) || 0)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-secondary/40" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fat (g)</label>
              <input type="number" value={foodFat || ""} onChange={(e) => setFoodFat(parseInt(e.target.value) || 0)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-secondary/40" />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button onClick={handleAddMeal} disabled={saving || !foodName.trim()}
              className="px-8 py-3 bg-secondary text-primary font-bold rounded-xl disabled:opacity-50 transition-all flex items-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {saving ? "Saving..." : "Log Meal"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Macro Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(macroGoals).map(([key, target], idx) => {
          const current = dailyTotals[key] || 0;
          const pct = Math.min((current / target) * 100, 100);
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="glass rounded-2xl border-white/5 p-5">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">{key}</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold font-heading text-white">{current}</span>
                <span className="text-sm text-muted-foreground mb-1">/ {target}</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full ${key === "calories" ? "bg-accent" : key === "protein" ? "bg-secondary" : key === "carbs" ? "bg-blue-400" : "bg-yellow-400"}`}
                  style={{ width: `${pct}%` }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Meal Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2"><Droplets className="h-5 w-5 text-blue-400" />Today's Meals</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-secondary" /></div>
        ) : (
          <div className="space-y-3">
            {mealsByType.map((mealData, idx) => (
              <motion.div key={mealData.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="glass rounded-2xl border-white/5 p-5 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl ${mealData.bg} flex items-center justify-center ${mealData.color}`}>
                      <mealData.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{mealData.name}</h3>
                      </div>
                      {mealData.meal ? (
                        <div className="flex items-center gap-4 mt-1">
                          {[
                            { label: "kcal", value: mealData.meal.totalCalories, color: "text-accent" },
                            { label: "P", value: `${mealData.meal.totalProtein}g`, color: "text-secondary" },
                            { label: "C", value: `${mealData.meal.totalCarbs}g`, color: "text-blue-400" },
                            { label: "F", value: `${mealData.meal.totalFat}g`, color: "text-yellow-400" },
                          ].map((m) => (
                            <span key={m.label} className="text-[10px] font-bold">
                              <span className={m.color}>{m.value}</span>
                              <span className="text-muted-foreground"> {m.label}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">Not logged yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Water Intake */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl border-white/5 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Water Intake</p>
            <p className="text-2xl font-bold font-heading text-blue-400">{(dailyTotals.waterMl / 1000).toFixed(1)}L <span className="text-sm text-muted-foreground font-normal">/ 2.5L</span></p>
          </div>
        </div>
        <div className="h-3 w-32 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-blue-400" style={{ width: `${Math.min((dailyTotals.waterMl / 2500) * 100, 100)}%` }} />
        </div>
      </motion.div>
    </div>
  );
}
