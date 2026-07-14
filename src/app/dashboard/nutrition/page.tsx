"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Utensils, Apple, Coffee, Beef, Plus, Sparkles, Droplets, Loader2, CheckCircle } from "lucide-react";

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

const mealIcons: Record<string, { icon: any; bg: string; color: string }> = {
  breakfast: { icon: Coffee, bg: "bg-amber-500/10", color: "text-amber-400" },
  lunch: { icon: Beef, bg: "bg-blue-500/10", color: "text-blue-400" },
  dinner: { icon: Utensils, bg: "bg-purple-500/10", color: "text-purple-400" },
  snack: { icon: Apple, bg: "bg-success/10", color: "text-success" },
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

  const fetchMeals = async (signal?: AbortSignal) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/nutrition?date=${today}`, { signal });
      const json = await res.json();
      setMeals(json.meals || []);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const abort = new AbortController();
    fetchMeals(abort.signal);
    return () => abort.abort();
  }, []);

  const dailyTotals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.totalCalories || 0;
      acc.protein += meal.totalProtein || 0;
      acc.carbs += meal.totalCarbs || 0;
      acc.fat += meal.totalFat || 0;
      acc.waterMl += meal.waterMl || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, waterMl: 0 }
  );

  const handleAddMeal = async () => {
    if (!foodName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealType, foodItems: [{ name: foodName, calories: foodCalories, protein: foodProtein, carbs: foodCarbs, fat: foodFat }], waterMl: waterAmount }),
      });
      if (res.ok) {
        setSuccessMsg("Meal added!");
        setShowAddForm(false);
        setFoodName(""); setFoodCalories(0); setFoodProtein(0); setFoodCarbs(0); setFoodFat(0); setWaterAmount(0);
        fetchMeals();
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const mealsByType = ["breakfast", "lunch", "dinner", "snack"].map((type) => {
    const meal = meals.find((m) => m.mealType === type);
    const iconData = mealIcons[type] || mealIcons.snack;
    return { name: type.charAt(0).toUpperCase() + type.slice(1), type, meal, ...iconData };
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-1">
            <Utensils className="h-3.5 w-3.5" />Nutrition Center
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">Fuel Your Body</h1>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold text-sm rounded-lg transition-colors hover:bg-accent-hover">
          {showAddForm ? null : <Plus className="h-4 w-4" />}
          {showAddForm ? "Cancel" : "Add Meal"}
        </button>
      </motion.div>

      {successMsg && (
        <div className="p-3 bg-success/10 border border-success/20 text-success rounded-lg text-sm font-semibold animate-fade-in flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />{successMsg}
        </div>
      )}

      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-surface-1 border border-border p-6 space-y-5">
          <h2 className="text-lg font-bold text-text-primary">Quick Add Meal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Meal Type</label>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="input">
                <option value="breakfast">Breakfast</option><option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option><option value="snack">Snack</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Food Name</label>
              <input value={foodName} onChange={(e) => setFoodName(e.target.value)} className="input" placeholder="e.g. Chicken breast" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Calories</label>
              <input type="number" value={foodCalories || ""} onChange={(e) => setFoodCalories(parseInt(e.target.value) || 0)} className="input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Protein (g)</label>
              <input type="number" value={foodProtein || ""} onChange={(e) => setFoodProtein(parseInt(e.target.value) || 0)} className="input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Carbs (g)</label>
              <input type="number" value={foodCarbs || ""} onChange={(e) => setFoodCarbs(parseInt(e.target.value) || 0)} className="input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Fat (g)</label>
              <input type="number" value={foodFat || ""} onChange={(e) => setFoodFat(parseInt(e.target.value) || 0)} className="input" />
            </div>
          </div>
          <div className="flex justify-end pt-3 border-t border-border">
            <button onClick={handleAddMeal} disabled={saving || !foodName.trim()}
              className="px-5 py-2 bg-accent text-white font-semibold text-sm rounded-lg disabled:opacity-50 flex items-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {saving ? "Saving..." : "Log Meal"}
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(macroGoals).map(([key, target], idx) => {
          const current = (dailyTotals as any)[key] || 0;
          const pct = Math.min((current / target) * 100, 100);
          const colorMap: Record<string, string> = { calories: "bg-accent", protein: "bg-success", carbs: "bg-amber-400", fat: "bg-blue-400" };
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              className="rounded-lg bg-surface-1 border border-border p-3.5">
              <p className="text-[9px] text-text-muted font-semibold uppercase tracking-wider mb-1.5">{key}</p>
              <div className="flex items-end gap-1.5">
                <span className="text-xl font-extrabold text-text-primary">{current}</span>
                <span className="text-[11px] text-text-muted mb-0.5">/ {target}</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-surface-3 overflow-hidden">
                <div className={`h-full rounded-full ${colorMap[key]}`} style={{ width: `${pct}%` }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-text-primary">Today's Meals</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
        ) : (
          <div className="space-y-2">
            {mealsByType.map((mealData, idx) => (
              <motion.div key={mealData.type} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                className="rounded-lg bg-surface-1 border border-border p-3.5 hover:border-border-hover transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${mealData.bg} flex items-center justify-center ${mealData.color}`}>
                    <mealData.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-text-primary">{mealData.name}</h3>
                    {mealData.meal ? (
                      <div className="flex items-center gap-2.5 mt-0.5">
                        {[
                          { label: "kcal", value: mealData.meal.totalCalories, color: "text-accent" },
                          { label: "P", value: `${mealData.meal.totalProtein}g`, color: "text-success" },
                          { label: "C", value: `${mealData.meal.totalCarbs}g`, color: "text-amber-400" },
                          { label: "F", value: `${mealData.meal.totalFat}g`, color: "text-blue-400" },
                        ].map((m) => (
                          <span key={m.label} className="text-[10px] font-semibold">
                            <span className={m.color}>{m.value}</span>
                            <span className="text-text-muted"> {m.label}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-text-muted mt-0.5">Not logged yet</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        className="rounded-lg bg-surface-1 border border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Water Intake</p>
            <p className="text-lg font-extrabold text-blue-400">
              {(dailyTotals.waterMl / 1000).toFixed(1)}L <span className="text-xs text-text-muted font-normal">/ 2.5L</span>
            </p>
          </div>
        </div>
        <div className="h-1.5 w-24 rounded-full bg-surface-3 overflow-hidden">
          <div className="h-full rounded-full bg-blue-400" style={{ width: `${Math.min((dailyTotals.waterMl / 2500) * 100, 100)}%` }} />
        </div>
      </motion.div>
    </div>
  );
}
