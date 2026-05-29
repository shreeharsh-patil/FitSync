import React, { useState } from "react";
import { 
  Flame, 
  Droplet, 
  Plus, 
  Minus, 
  Sparkles, 
  Apple, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Info
} from "lucide-react";

export default function NutritionHub({ 
  calorieIntake, 
  setCalorieIntake, 
  hydrationLogs, 
  addHydration, 
  setShowMealScanner, 
  userProfile,
  loggedMeals,
  triggerToast
}) {
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddForm, setQuickAddForm] = useState({
    name: "",
    calories: 300,
    protein: 20,
    carbs: 35,
    fats: 10,
    type: "Snack"
  });

  const dailyCalorieGoal = 2400; // Mock goal
  const caloriePercent = Math.min(100, Math.round((calorieIntake / dailyCalorieGoal) * 100));

  // Compute accumulated macros from logged meals
  const totalProtein = loggedMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = loggedMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFats = loggedMeals.reduce((sum, m) => sum + (m.fats || 0), 0);

  const proteinGoal = Math.round(userProfile.weight * 2.0); // 2g per kg
  const carbsGoal = 250;
  const fatsGoal = 75;

  const proteinPercent = Math.min(100, Math.round((totalProtein / proteinGoal) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / carbsGoal) * 100));
  const fatsPercent = Math.min(100, Math.round((totalFats / fatsGoal) * 100));

  const filteredMeals = selectedMealType === "all" 
    ? loggedMeals 
    : loggedMeals.filter(m => m.type.toLowerCase() === selectedMealType.toLowerCase());

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickAddForm.name.trim()) return;

    const newMeal = {
      id: loggedMeals.length + 1,
      name: quickAddForm.name,
      calories: parseInt(quickAddForm.calories) || 0,
      protein: parseInt(quickAddForm.protein) || 0,
      carbs: parseInt(quickAddForm.carbs) || 0,
      fats: parseInt(quickAddForm.fats) || 0,
      type: quickAddForm.type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-'
    };

    setCalorieIntake(prev => prev + newMeal.calories);
    loggedMeals.unshift(newMeal); // Prepend to share list reference
    triggerToast(`🥗 Logged: ${newMeal.name} (+${newMeal.calories} kcal)`);
    setShowQuickAddModal(false);
    setQuickAddForm({
      name: "",
      calories: 300,
      protein: 20,
      carbs: 35,
      fats: 10,
      type: "Snack"
    });
  };

  return (
    <div className="flex flex-col gap-lg animate-fade-in text-on-surface">
      
      {/* Banner and Scanner CTA */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <div className="lg:col-span-2 bg-gradient-to-br from-surface-container-high/80 to-surface-container-low/80 backdrop-blur-xl rounded-2xl border border-white/10 p-md flex flex-col sm:flex-row justify-between items-center relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-fixed/5 rounded-full blur-[60px] pointer-events-none -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="space-y-sm text-left">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3 fill-primary-fixed" />
              Ecosystem Feature
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-display-sm text-white">AI-Powered Nutrition Companion</h2>
            <p className="text-xs text-on-surface-variant max-w-[480px] leading-relaxed">
              Take photos of your meals using the AI Meal Scanner. Computer vision models isolate boundaries, calculate volume, and automatically log accurate macros directly into your daily totals.
            </p>
          </div>
          <button 
            onClick={() => setShowMealScanner(true)}
            className="mt-4 sm:mt-0 px-6 py-4 bg-primary-fixed text-on-primary-fixed font-bold hover:bg-white active:scale-95 transition-all text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary-fixed/10 shrink-0 glow-lime cursor-pointer"
          >
            Open AI Scanner
          </button>
        </div>

        {/* Quick Summary Gauge Card */}
        <div className="bg-surface-container-high/60 backdrop-blur-xl rounded-xl border border-white/10 p-md flex flex-col justify-between shadow-lg">
          <div className="flex justify-between items-start mb-sm">
            <div>
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Calorie Budget</p>
              <div className="flex items-baseline gap-xs">
                <span className="font-stat-value text-3xl font-bold text-primary">{calorieIntake}</span>
                <span className="font-label-md text-xs text-on-surface-variant">/ {dailyCalorieGoal} kcal</span>
              </div>
            </div>
            
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-white/5" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeWidth="4"></circle>
                <circle className="text-primary-fixed transition-all duration-1000" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeDasharray="150.8" strokeDashoffset={150.8 - (150.8 * caloriePercent) / 100} strokeLinecap="round" strokeWidth="4"></circle>
              </svg>
              <span className="absolute font-label-sm text-[10px] text-primary font-bold">{caloriePercent}%</span>
            </div>
          </div>

          <div className="w-full bg-white/5 rounded-lg p-sm border border-white/5 mt-sm flex items-center justify-between text-xs">
            <span className="text-on-surface-variant font-medium">Goal Status</span>
            <span className={calorieIntake > dailyCalorieGoal ? "text-error font-bold" : "text-primary-fixed font-bold"}>
              {calorieIntake > dailyCalorieGoal ? `${calorieIntake - dailyCalorieGoal} kcal Over` : `${dailyCalorieGoal - calorieIntake} kcal Remaining`}
            </span>
          </div>
        </div>
      </section>

      {/* Main Hydration and Macros Split row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Hydration Widget (4 cols) */}
        <div className="lg:col-span-4 glass-card p-lg rounded-2xl flex flex-col justify-between min-h-[460px] relative overflow-hidden">
          {/* Animated background bubbles */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/10 to-transparent pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-center border-b border-white/5 pb-sm mb-md">
              <div className="flex items-center gap-xs">
                <Droplet className="h-5 w-5 text-secondary-fixed-dim fill-secondary-fixed-dim" />
                <h3 className="font-display-sm text-sm font-bold uppercase tracking-wider text-white">Hydration Tracker</h3>
              </div>
              <button 
                onClick={() => addHydration(1)}
                className="w-7 h-7 bg-secondary-container/20 text-secondary-container rounded-full flex items-center justify-center hover:bg-secondary-container hover:text-primary transition-all active:scale-90 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-6 relative">
              {/* Thermos flask glass mockup */}
              <div className="w-24 h-48 border-2 border-white/10 rounded-3xl p-1 relative overflow-hidden bg-background/55 shadow-inner">
                {/* Water Level */}
                <div 
                  style={{ height: `${(hydrationLogs.glassesLog / 8) * 100}%` }}
                  className="absolute bottom-1 left-1 right-1 bg-gradient-to-t from-cyan-600 to-secondary-fixed-dim rounded-2xl transition-all duration-700 ease-out flex items-center justify-center overflow-hidden"
                >
                  {/* Wave bubble reflections */}
                  <div className="absolute inset-x-0 top-0 h-4 bg-white/20 animate-pulse rounded-full blur-[2px]" />
                  {hydrationLogs.glassesLog >= 4 && (
                    <span className="text-[10px] font-bold text-cyan-950/70 select-none animate-pulse">
                      {Math.round((hydrationLogs.glassesLog / 8) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Liters Display */}
              <div className="text-center mt-md">
                <span className="font-stat-value text-3xl font-bold text-white">{(hydrationLogs.glassesLog * 0.25).toFixed(2)}</span>
                <span className="text-xs text-on-surface-variant font-medium ml-1">Liters</span>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{hydrationLogs.glassesLog} / 8 glasses completed</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-md mt-sm flex items-center justify-between text-xs text-on-surface-variant">
            <span>Last log: {hydrationLogs.lastLogTime}</span>
            <span>Next reminder: {hydrationLogs.nextReminderTime}</span>
          </div>
        </div>

        {/* Macros Breakdown Card (8 cols) */}
        <div className="lg:col-span-8 glass-card p-lg rounded-2xl min-h-[460px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-white/5 pb-sm mb-lg">
              <div className="flex items-center gap-xs">
                <Apple className="h-5 w-5 text-primary-fixed" />
                <h3 className="font-display-sm text-sm font-bold uppercase tracking-wider text-white">Macros Budget Breakdown</h3>
              </div>
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase">Target Split: 40/30/30</span>
            </div>

            {/* Micro layout meters */}
            <div className="space-y-lg">
              {/* Protein Bar */}
              <div className="space-y-xs">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed"></span> Protein
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    <strong className="text-primary-fixed">{totalProtein}g</strong> / {proteinGoal}g ({proteinPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-primary-fixed rounded-full transition-all duration-700 glow-lime" style={{ width: `${proteinPercent}%` }}></div>
                </div>
              </div>

              {/* Carbs Bar */}
              <div className="space-y-xs">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary-container"></span> Carbohydrates
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    <strong className="text-secondary-container">{totalCarbs}g</strong> / {carbsGoal}g ({carbsPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-secondary-container rounded-full transition-all duration-700" style={{ width: `${carbsPercent}%` }}></div>
                </div>
              </div>

              {/* Fats Bar */}
              <div className="space-y-xs">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span> Lipids / Fats
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    <strong className="text-tertiary-fixed-dim">{totalFats}g</strong> / {fatsGoal}g ({fatsPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-tertiary-fixed-dim rounded-full transition-all duration-700" style={{ width: `${fatsPercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* Macro Distribution Ratio bar */}
            <div className="mt-xl bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2.5">Today's Macro Intake Ratio</p>
              
              {/* Stacked macro progress line */}
              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${totalProtein + totalCarbs + totalFats === 0 ? 33 : (totalProtein / (totalProtein + totalCarbs + totalFats)) * 100}%` }}
                  className="bg-primary-fixed h-full transition-all duration-500" 
                  title="Protein"
                />
                <div 
                  style={{ width: `${totalProtein + totalCarbs + totalFats === 0 ? 33 : (totalCarbs / (totalProtein + totalCarbs + totalFats)) * 100}%` }}
                  className="bg-secondary-container h-full transition-all duration-500 border-l border-surface" 
                  title="Carbs"
                />
                <div 
                  style={{ width: `${totalProtein + totalCarbs + totalFats === 0 ? 34 : (totalFats / (totalProtein + totalCarbs + totalFats)) * 100}%` }}
                  className="bg-tertiary-fixed-dim h-full transition-all duration-500 border-l border-surface" 
                  title="Fats"
                />
              </div>

              <div className="flex justify-between mt-3 text-[9px] text-on-surface-variant font-bold uppercase">
                <span className="text-primary-fixed">Protein</span>
                <span className="text-secondary-container">Carbs</span>
                <span className="text-tertiary-fixed-dim">Fats</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-md mt-lg flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Targets are calculated based on your weight of {userProfile.weight}kg.
            </span>
          </div>
        </div>
      </section>

      {/* Logged Meals List Section */}
      <section className="glass-card rounded-2xl overflow-hidden mt-md">
        <div className="p-md md:p-lg border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
          <div>
            <h4 className="font-headline-lg text-sm md:text-lg text-primary font-bold">Food Log Details</h4>
            <p className="text-[10px] text-on-surface-variant uppercase mt-0.5 tracking-wider font-semibold">Today's Calorie Log</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter Pill */}
            <div className="flex bg-surface-container-high/40 p-1 rounded-lg border border-white/5">
              {["all", "breakfast", "lunch", "dinner", "snack"].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedMealType(t)}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedMealType === t 
                      ? "bg-primary-fixed text-on-primary-fixed"
                      : "text-on-surface-variant hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowQuickAddModal(true)}
              className="px-4 py-2 bg-secondary-container/20 border border-secondary-container/30 hover:bg-secondary-container hover:text-primary transition-all text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer ml-auto shrink-0"
            >
              + Quick Log
            </button>
          </div>
        </div>

        {/* Meal cards list */}
        <div className="divide-y divide-white/5">
          {filteredMeals.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              <Apple className="w-8 h-8 mx-auto mb-2 text-on-surface-variant/40" />
              <p className="text-xs">No meals logged for this selection.</p>
            </div>
          ) : (
            filteredMeals.map(meal => (
              <div key={meal.id} className="p-md md:p-lg flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-highest overflow-hidden border border-white/5 shrink-0">
                    <img src={meal.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} alt="Meal preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-label-md text-sm text-primary font-bold">{meal.name}</h5>
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">
                      {meal.type} • {meal.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-lg text-right shrink-0">
                  <div className="hidden sm:flex gap-sm text-[10px] text-on-surface-variant font-medium">
                    <span>P: <strong className="text-primary">{meal.protein}g</strong></span>
                    <span>C: <strong className="text-primary">{meal.carbs}g</strong></span>
                    <span>F: <strong className="text-primary">{meal.fats}g</strong></span>
                  </div>
                  <div>
                    <span className="font-label-md text-sm text-primary-fixed font-bold">+{meal.calories}</span>
                    <span className="text-[9px] text-on-surface-variant font-bold ml-0.5">kcal</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quick Add Custom Meal Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-container-high/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-lg animate-fade-in relative text-on-surface">
            <button 
              onClick={() => setShowQuickAddModal(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-on-surface-variant hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <div className="flex justify-between items-center mb-lg border-b border-white/5 pb-sm">
              <h3 className="font-headline-lg text-md md:text-lg text-primary font-bold">Quick Log Custom Food</h3>
            </div>

            <form onSubmit={handleQuickAdd} className="flex flex-col gap-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Meal Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Oatmeal with Whey and Almonds"
                  value={quickAddForm.name} 
                  onChange={(e) => setQuickAddForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Total Calories (kcal)</label>
                  <input 
                    type="number" 
                    value={quickAddForm.calories} 
                    onChange={(e) => setQuickAddForm(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Meal Type</label>
                  <select 
                    value={quickAddForm.type} 
                    onChange={(e) => setQuickAddForm(prev => ({ ...prev, type: e.target.value }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-on-surface-variant font-semibold">Protein (g)</label>
                  <input 
                    type="number" 
                    value={quickAddForm.protein} 
                    onChange={(e) => setQuickAddForm(prev => ({ ...prev, protein: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-2 py-2 text-xs text-primary focus:outline-none focus:border-primary-fixed text-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-on-surface-variant font-semibold">Carbs (g)</label>
                  <input 
                    type="number" 
                    value={quickAddForm.carbs} 
                    onChange={(e) => setQuickAddForm(prev => ({ ...prev, carbs: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-2 py-2 text-xs text-primary focus:outline-none focus:border-primary-fixed text-center"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-on-surface-variant font-semibold">Fats (g)</label>
                  <input 
                    type="number" 
                    value={quickAddForm.fats} 
                    onChange={(e) => setQuickAddForm(prev => ({ ...prev, fats: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-2 py-2 text-xs text-primary focus:outline-none focus:border-primary-fixed text-center"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 mt-lg bg-primary-fixed text-on-primary-fixed hover:bg-white transition-all font-bold rounded-lg shadow-lg text-xs uppercase tracking-widest cursor-pointer">
                Log Food Intake
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
