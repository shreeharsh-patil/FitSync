"use client";

import { useState } from "react";
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
} from "lucide-react";
import { logMeal } from "@/lib/actions";
import { MealType } from "@prisma/client";

interface NutritionTrackerClientProps {
  initialLogs: any[];
  userId: string;
}

export function NutritionTrackerClient({ initialLogs, userId }: NutritionTrackerClientProps) {
  const [logs, setLogs] = useState<any[]>(initialLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  // Form state
  const [mealType, setMealType] = useState<MealType>("BREAKFAST");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [notes, setNotes] = useState("");

  // Search query
  const [searchQuery, setSearchQuery] = useState("");
  const [isWaterLogging, setIsWaterLogging] = useState(false);

  const calorieTarget = 2400;
  const waterTarget = 3500;

  const totalCalories = logs.reduce((acc, log) => acc + log.totalCalories, 0);
  const totalWater = logs.reduce((acc, log) => acc + (log.waterMl || 0), 0);

  // Quick calorie additions
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
      // Optimistically append local log
      setLogs((prev) => [
        ...prev,
        {
          id: res.id,
          mealType: "SNACK" as MealType,
          totalCalories: 0,
          waterMl: amount,
          createdAt: new Date(),
          notes: "Logged hydration",
        },
      ]);
    } else {
      alert("Failed to log hydration");
    }
    setIsWaterLogging(false);
  };

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Please enter a meal name");

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
        ...prev,
        {
          id: res.id,
          mealType,
          totalCalories: calories,
          foodItems,
          createdAt: new Date(),
          notes,
        },
      ]);
      // Reset form
      setName("");
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
      setNotes("");
      setIsModalOpen(false);
    } else {
      alert(res.error || "Failed to log meal");
    }
    setIsLogging(false);
  };

  const filteredLogs = logs.filter((l) => l.totalCalories > 0);

  return (
    <div className="space-y-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              icon={<Flame className="h-5 w-5 text-orange-500" />}
              label="Calories"
              value={totalCalories.toLocaleString()}
              target={`${calorieTarget} kcal`}
              color="bg-orange-500 animate-pulse"
              percentage={Math.min(100, (totalCalories / calorieTarget) * 100)}
            />
            <StatsCard
              icon={<Utensils className="h-5 w-5 text-secondary" />}
              label="Hydration Progress"
              value={`${totalWater.toLocaleString()} mL`}
              target={`${waterTarget} mL`}
              color="bg-secondary"
              percentage={Math.min(100, (totalWater / waterTarget) * 100)}
            />
            <StatsCard
              icon={<Droplets className="h-5 w-5 text-blue-500" />}
              label="Water intake"
              value={`${(totalWater / 1000).toFixed(1)} L`}
              target={`${(waterTarget / 1000).toFixed(1)} L`}
              color="bg-blue-500"
              percentage={Math.min(100, (totalWater / waterTarget) * 100)}
            />
          </div>

          {/* Meals Feed */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-heading">Logged Meals Today</h2>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-secondary hover:bg-secondary/90 text-primary font-bold gap-2"
              >
                <Plus className="h-4 w-4" />
                Log Custom Meal
              </Button>
            </div>

            <div className="space-y-3">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <MealItem
                    key={log.id}
                    name={log.foodItems?.[0]?.name || log.mealType}
                    calories={log.totalCalories}
                    time={new Date(log.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    category={log.mealType}
                  />
                ))
              ) : (
                <Card className="p-10 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                    <Utensils className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold">No meals logged today</p>
                    <p className="text-sm text-muted-foreground">Fuel your hypertrophy gains and record your calories.</p>
                  </div>
                  <Button onClick={() => setIsModalOpen(true)} variant="outline" size="sm" className="font-bold">
                    Log Your First Meal
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Quick Log Hydration and AI suggestions */}
        <div className="space-y-8">
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading">Quick Water Tracker</h3>
              <p className="text-xs text-muted-foreground">Add to your cellular hydration metrics instantly.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => logWater(250)}
                disabled={isWaterLogging}
                variant="outline"
                className="h-16 rounded-2xl border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 font-bold gap-2 group transition-all"
              >
                <Droplets className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                +250 mL
              </Button>
              <Button
                onClick={() => logWater(750)}
                disabled={isWaterLogging}
                variant="outline"
                className="h-16 rounded-2xl border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 font-bold gap-2 group transition-all"
              >
                <Droplets className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform animate-pulse" />
                +750 mL
              </Button>
            </div>
            {isWaterLogging && (
              <div className="flex justify-center text-xs text-secondary font-mono animate-pulse">
                Saving water logs to DB...
              </div>
            )}
          </Card>

          <Card className="p-6 bg-secondary/10 border-secondary/20 border relative overflow-hidden group cursor-pointer rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Utensils className="h-24 w-24 text-secondary" />
            </div>
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold text-sm uppercase tracking-wider">
                <Zap className="h-4 w-4 fill-secondary" />
                AI Smart Macros
              </div>
              <h3 className="text-lg font-bold font-heading">Hydration and Hypertrophy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Aiming for 180g of protein today is excellent. Hydration fuels cell volume, expanding training performance. Drink up!
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Log Meal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="w-full max-w-lg glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-heading">Log Custom Meal</h3>
              <p className="text-xs text-muted-foreground">Add details to register calories and macros in your log.</p>
            </div>

            <form onSubmit={handleLogMeal} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Meal Category
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:border-secondary/40"
                >
                  <option value="BREAKFAST" className="bg-[#0f172a] text-white" style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>Breakfast</option>
                  <option value="LUNCH" className="bg-[#0f172a] text-white" style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>Lunch</option>
                  <option value="DINNER" className="bg-[#0f172a] text-white" style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>Dinner</option>
                  <option value="SNACK" className="bg-[#0f172a] text-white" style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>Snack</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Meal / Food Item Name
                </label>
                <Input
                  required
                  placeholder="e.g. Scrambled Eggs & Avocado Toast"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-white/5 border-white/10 focus:border-secondary/40"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Calories (kcal)
                  </label>
                  <Input
                    type="number"
                    value={calories || ""}
                    onChange={(e) => setCalories(parseFloat(e.target.value) || 0)}
                    className="h-12 bg-white/5 border-white/10 text-center font-mono font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Protein (g)
                  </label>
                  <Input
                    type="number"
                    value={protein || ""}
                    onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
                    className="h-12 bg-white/5 border-white/10 text-center font-mono font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Carbs (g)
                  </label>
                  <Input
                    type="number"
                    value={carbs || ""}
                    onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
                    className="h-12 bg-white/5 border-white/10 text-center font-mono font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Fat (g)
                  </label>
                  <Input
                    type="number"
                    value={fat || ""}
                    onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
                    className="h-12 bg-white/5 border-white/10 text-center font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Optional Notes
                </label>
                <textarea
                  placeholder="e.g. Post-workout breakfast"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-20 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-secondary/40 text-white placeholder-muted-foreground"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLogging}
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl shadow-lg shadow-secondary/10 gap-2"
                >
                  {isLogging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Utensils className="h-4 w-4" />}
                  Save Meal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  target,
  color,
  percentage,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  target: string;
  color: string;
  percentage: number;
}) {
  return (
    <Card className="p-6 glass border-white/5 rounded-[2rem]">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-background/50 flex items-center justify-center border border-white/5 shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl font-bold font-heading text-white">{value}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>Progress</span>
          <span>Target: {target}</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

function MealItem({
  name,
  calories,
  time,
  category,
}: {
  name: string;
  calories: number;
  time: string;
  category: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl glass border border-white/5 hover:border-secondary/20 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
          <Utensils className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white group-hover:text-secondary transition-colors">{name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {category} • {time}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-sm text-white">{calories} kcal</p>
        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
          Logged
        </p>
      </div>
    </div>
  );
}
