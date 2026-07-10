import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Workout } from "@/lib/models/Workout";
import { Nutrition } from "@/lib/models/Nutrition";
import { unstable_noStore as noStore } from "next/cache";

const responses: Record<string, (name: string) => string> = {
  "workout": (name) =>
    `Let's optimize your workout split, ${name}! Based on your profile and training history, here's what I recommend:

**Upper/Lower Split (4 days/week)**
- Day 1: Upper Push — Bench Press (4×8-10), Overhead Press (3×10), Lateral Raises (3×15)
- Day 2: Lower — Squats (4×6-8), RDLs (3×8-10), Walking Lunges (3×12)
- Day 3: Upper Pull — Pull-ups (4×8), Barbell Rows (3×10), Face Pulls (3×15)
- Day 4: Lower Power — Deadlifts (4×5), Leg Press (3×10), Calf Raises (4×12)

Track progressive overload by adding 2.5kg or 1 rep per movement weekly.`,

  "meal": (name) =>
    `Great question about meal planning, ${name}! Here's a tailored cutting meal plan at ~2,000 kcal:

**Meal Plan: High Protein Cut**
🥣 **Breakfast (7am)** — 3 eggs + 40g oats + 200ml skim milk = 420 kcal, 32g P
🥗 **Lunch (12pm)** — 180g chicken breast + 100g quinoa + broccoli = 520 kcal, 48g P
🥜 **Snack (4pm)** — 30g whey protein + 1 apple + 15g almonds = 280 kcal, 28g P
🐟 **Dinner (7pm)** — 200g salmon + 150g sweet potato + asparagus = 580 kcal, 42g P
🥛 **Before Bed** — 200g Greek yogurt = 200 kcal, 20g P

**Target: 170g Protein · 180g Carbs · 55g Fat**
Stay hydrated — aim for 3L water daily!`,

  "recovery": (name) =>
    `Recovery is crucial for gains, ${name}! Based on best practices, here's your recovery protocol:

**Active Recovery Protocol**
🛌 **Sleep** — Target 7-9 hours. Your HRV benefits most from consistent sleep/wake times.
🧘 **Mobility** — 10-min morning flow: hip circles, thoracic rotations, ankle mobility
🚶 **Zone 2 Cardio** — 30 min brisk walk or light jog (heart rate 120-140 bpm)
💧 **Hydration** — 3L water minimum. Add electrolytes if you sweat heavily.
🥩 **Post-Workout Nutrition** — 30-40g protein + carbs within 2 hours of training

**Warning Signs to Deload:**
- Persistent fatigue despite adequate sleep
- Decline in performance for 2+ consecutive sessions
- Elevated resting heart rate (+5 bpm from baseline)
- Mood changes or lack of motivation`,

  "macros": (name) =>
    `Here's your macro calculation, ${name}!

**TDEE Estimation**
Based on standard formulas, here are your targets:

**💪 Muscle Gain (Surplus +300 kcal)**
- Calories: ~2,800 kcal
- Protein: 175g (2g per kg bodyweight)
- Carbs: 315g (45% of calories)
- Fat: 75g (25% of calories)

**🔥 Fat Loss (Deficit -400 kcal)**
- Calories: ~2,100 kcal
- Protein: 175g (preserve muscle mass)
- Carbs: 210g (40% of calories)
- Fat: 70g (30% of calories)

**♻️ Maintenance**
- Calories: ~2,500 kcal
- Protein: 150g
- Carbs: 280g
- Fat: 75g

Track your weight weekly and adjust calories by ±100-200 based on progress!`,

  "default": (name) =>
    `Thanks for your question, ${name}! Here's what I can help with:

💪 **Workout optimization** — Split advice, exercise selection, progressive overload
🥗 **Nutrition planning** — Meal plans, macro targets, cutting/bulking guidance
🛌 **Recovery protocols** — Sleep optimization, mobility, deload strategies
📊 **Progress tracking** — Goal setting, milestone planning, plateau busters

Could you be more specific? Try one of the suggested questions above!`,
};

function matchIntent(message: string): string {
  const lower = message.toLowerCase();
  if (/\b(workout|split|exercise|routine|train|gym|lift)\b/.test(lower)) return "workout";
  if (/\b(meal|eat|food|diet|nutrition|cutting|bulking|calorie|protein|macro)\b/.test(lower)) return "meal";
  if (/\b(recovery|rest|sleep|deload|mobility|stretch|fatigue)\b/.test(lower)) return "recovery";
  if (/\b(macro|calorie|protein|carbs|fat|tdee)\b/.test(lower)) return "macros";
  return "default";
}

export async function POST(req: Request) {
  try {
    noStore(); // Don't cache AI responses
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await connectDB();

    // Gather user context for personalized responses
    const user = await User.findById(session.user.id).lean();
    const recentWorkouts = await Workout.find({ userId: session.user.id })
      .sort({ logDate: -1 })
      .limit(3)
      .lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMeals = await Nutrition.find({
      userId: session.user.id,
      logDate: { $gte: today },
    }).lean();

    const dailyCalories = todayMeals.reduce((sum, m) => sum + (m.totalCalories || 0), 0);

    const intent = matchIntent(message);
    const name = user?.name || "Athlete";
    const context = `Name: ${name}, Level: ${user?.level || 1}, XP: ${user?.xp || 0}, Recent workouts: ${recentWorkouts.length}, Today's calories: ${dailyCalories}`;

    let response = responses[intent]?.(name) || responses.default(name);

    // Add personal context when available
    if (recentWorkouts.length > 0 && intent === "workout") {
      response += `\n\n---\n📊 **Your Recent Activity**: You've completed ${recentWorkouts.length} recent workouts. Keep the momentum going!`;
    }
    if (dailyCalories > 0 && intent === "meal") {
      response += `\n\n---\n📋 **Today's Nutrition**: You've logged ${dailyCalories.toLocaleString()} kcal so far today.`;
    }

    return NextResponse.json({
      response,
      context,
    });
  } catch (error) {
    console.error("AI Coach error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
