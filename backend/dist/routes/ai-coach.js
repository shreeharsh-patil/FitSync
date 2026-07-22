"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const Workout_1 = require("../models/Workout");
const Nutrition_1 = require("../models/Nutrition");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const responses = {
    workout: (name) => `Let's optimize your workout split, ${name}! Based on your profile and training history, here's what I recommend:\n\n**Upper/Lower Split (4 days/week)**\n- Day 1: Upper Push — Bench Press (4×8-10), Overhead Press (3×10), Lateral Raises (3×15)\n- Day 2: Lower — Squats (4×6-8), RDLs (3×8-10), Walking Lunges (3×12)\n- Day 3: Upper Pull — Pull-ups (4×8), Barbell Rows (3×10), Face Pulls (3×15)\n- Day 4: Lower Power — Deadlifts (4×5), Leg Press (3×10), Calf Raises (4×12)\n\nTrack progressive overload by adding 2.5kg or 1 rep per movement weekly.`,
    meal: (name) => `Great question about meal planning, ${name}! Here's a tailored cutting meal plan at ~2,000 kcal:\n\n**Meal Plan: High Protein Cut**\n🥣 **Breakfast (7am)** — 3 eggs + 40g oats + 200ml skim milk = 420 kcal, 32g P\n🥗 **Lunch (12pm)** — 180g chicken breast + 100g quinoa + broccoli = 520 kcal, 48g P\n🥜 **Snack (4pm)** — 30g whey protein + 1 apple + 15g almonds = 280 kcal, 28g P\n🐟 **Dinner (7pm)** — 200g salmon + 150g sweet potato + asparagus = 580 kcal, 42g P\n🥛 **Before Bed** — 200g Greek yogurt = 200 kcal, 20g P\n\n**Target: 170g Protein · 180g Carbs · 55g Fat**\nStay hydrated — aim for 3L water daily!`,
    recovery: (name) => `Recovery is crucial for gains, ${name}! Based on best practices, here's your recovery protocol:\n\n**Active Recovery Protocol**\n🛌 **Sleep** — Target 7-9 hours. Your HRV benefits most from consistent sleep/wake times.\n🧘 **Mobility** — 10-min morning flow: hip circles, thoracic rotations, ankle mobility\n🚶 **Zone 2 Cardio** — 30 min brisk walk or light jog (heart rate 120-140 bpm)\n💧 **Hydration** — 3L water minimum. Add electrolytes if you sweat heavily.\n🥩 **Post-Workout Nutrition** — 30-40g protein + carbs within 2 hours of training\n\n**Warning Signs to Deload:**\n- Persistent fatigue despite adequate sleep\n- Decline in performance for 2+ consecutive sessions\n- Elevated resting heart rate (+5 bpm from baseline)\n- Mood changes or lack of motivation`,
    macros: (name) => `Here's your macro calculation, ${name}!\n\n**TDEE Estimation**\nBased on standard formulas, here are your targets:\n\n**💪 Muscle Gain (Surplus +300 kcal)**\n- Calories: ~2,800 kcal\n- Protein: 175g (2g per kg bodyweight)\n- Carbs: 315g (45% of calories)\n- Fat: 75g (25% of calories)\n\n**🔥 Fat Loss (Deficit -400 kcal)**\n- Calories: ~2,100 kcal\n- Protein: 175g (preserve muscle mass)\n- Carbs: 210g (40% of calories)\n- Fat: 70g (30% of calories)\n\n**♻️ Maintenance**\n- Calories: ~2,500 kcal\n- Protein: 150g\n- Carbs: 280g\n- Fat: 75g\n\nTrack your weight weekly and adjust calories by ±100-200 based on progress!`,
    default: (name) => `Thanks for your question, ${name}! Here's what I can help with:\n\n💪 **Workout optimization** — Split advice, exercise selection, progressive overload\n🥗 **Nutrition planning** — Meal plans, macro targets, cutting/bulking guidance\n🛌 **Recovery protocols** — Sleep optimization, mobility, deload strategies\n📊 **Progress tracking** — Goal setting, milestone planning, plateau busters\n\nCould you be more specific? Try one of the suggested questions above!`,
};
function matchIntent(message) {
    const lower = message.toLowerCase();
    if (/\b(workout|split|exercise|routine|train|gym|lift)\b/.test(lower))
        return "workout";
    if (/\b(meal|eat|food|diet|nutrition|cutting|bulking|calorie|protein|macro)\b/.test(lower))
        return "meal";
    if (/\b(recovery|rest|sleep|deload|mobility|stretch|fatigue)\b/.test(lower))
        return "recovery";
    if (/\b(macro|calorie|protein|carbs|fat|tdee)\b/.test(lower))
        return "macros";
    return "default";
}
// POST /api/ai-coach
router.post("/", auth_1.authenticate, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message?.trim())
            return res.status(400).json({ success: false, error: "Message is required" });
        await (0, db_1.connectDB)();
        const user = await User_1.User.findById(req.user.userId).lean();
        const recentWorkouts = await Workout_1.Workout.find({ userId: req.user.userId }).sort({ logDate: -1 }).limit(3).lean();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayMeals = await Nutrition_1.Nutrition.find({ userId: req.user.userId, logDate: { $gte: today } }).lean();
        const dailyCalories = todayMeals.reduce((sum, m) => sum + (m.totalCalories || 0), 0);
        const intent = matchIntent(message);
        const name = user?.name || "Athlete";
        let response = responses[intent]?.(name) || responses.default(name);
        if (recentWorkouts.length > 0 && intent === "workout") {
            response += `\n\n---\n📊 **Your Recent Activity**: You've completed ${recentWorkouts.length} recent workouts. Keep the momentum going!`;
        }
        if (dailyCalories > 0 && intent === "meal") {
            response += `\n\n---\n📋 **Today's Nutrition**: You've logged ${dailyCalories.toLocaleString()} kcal so far today.`;
        }
        res.json({ success: true, data: { response, context: `Name: ${name}, Level: ${user?.level || 1}` } });
    }
    catch (err) {
        console.error("AI Coach error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=ai-coach.js.map