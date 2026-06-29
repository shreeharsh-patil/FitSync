/**
 * FitSync AI Engine Integration
 * Configured to work out-of-the-box with Grok Free API or OpenAI API,
 * with a high-fidelity local fallback if no credentials are provided.
 */

const GROK_API_KEY = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY || "";
const GROK_BASE_URL = process.env.GROK_BASE_URL || "https://api.x.ai/v1";
const GROK_MODEL = process.env.GROK_MODEL || "grok-beta"; // Or grok-2

// Intelligent static replies based on context keywords
const SIMULATED_REPLIES = [
  {
    keywords: ["sore", "pain", "hurt", "recovery"],
    response: "Active recovery is key! Focus on promoting blood flow without high tension. I recommend: \n1. Cat-Cow Stretch (2 sets of 10)\n2. Child's Pose (Hold 30s, 2 sets)\n3. Bird Dog (2 sets of 10)\n4. Low-intensity walking for 10-15 minutes.",
  },
  {
    keywords: ["bench", "press", "chest", "push-up"],
    response: "For bench press and chest development, progressive overload is critical. If you are stuck at a plateau, consider adjusting your grip width, increasing rest times to 3 minutes, or adding lateral deltoid work to stabilize the shoulder girdle.",
  },
  {
    keywords: ["squat", "leg", "quads", "glutes"],
    response: "Squats are the foundation of leg development. Ensure you are hitting depth (hip crease below patella) and driving through the mid-foot. If your knees cave in, try cueing 'corkscrewing' your feet into the floor.",
  },
  {
    keywords: ["meal", "eat", "protein", "diet", "nutrition"],
    response: "To support hypertrophy, aim for 1.6 to 2.2 grams of protein per kilogram of bodyweight. Focus on high-quality sources like chicken breast, eggs, salmon, or tofu, and synchronize your meals to eat within 2 hours of a workout.",
  },
];

export async function askAICoach(userMessage: string, history: { role: "user" | "assistant"; content: string }[] = []) {
  if (!GROK_API_KEY) {
    // Return high-fidelity simulated response
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate thinking latency

    const messageLower = userMessage.toLowerCase();
    for (const reply of SIMULATED_REPLIES) {
      if (reply.keywords.some((k) => messageLower.includes(k))) {
        return reply.response;
      }
    }

    return "That's a great fitness question! Keep tracking your workout logs and nutrition metrics daily. Consistency is 90% of the game. Let me know if you need specific exercise advice, form tips, or calorie target calculations!";
  }

  try {
    const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional athletic performance coach and registered dietitian on the FitSync platform. Your coaching style is encouraging, highly data-informed, and direct. You are writing to a Gen Z audience, so keep it extremely clean, energetic, and professional.",
          },
          ...history,
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Grok API response error:", errorText);
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm having trouble formulating an answer right now. Keep pushing!";
  } catch (error) {
    console.error("AI Coach Fetch Error:", error);
    return "I hit a glitch syncing with the AI matrix, but your consistency is what matters! Let's keep training.";
  }
}

export async function generateMealPlan(preferences: {
  goal: string;
  calories: number;
  preferences: string[];
  allergies: string[];
  dietType: string;
}) {
  const FALLBACK_PLANS: Record<string, any[]> = {
    cut: [
      {
        dayOfWeek: 0,
        meals: [
          { mealType: "BREAKFAST", name: "Egg White Omelette with Spinach", calories: 320, protein: 35, carbs: 12, fat: 14, ingredients: "4 egg whites, 1 cup spinach, 1 tbsp olive oil, 1 slice whole wheat toast" },
          { mealType: "LUNCH", name: "Grilled Chicken Salad", calories: 420, protein: 40, carbs: 18, fat: 20, ingredients: "150g chicken breast, 2 cups mixed greens, 1/2 avocado, 1 tbsp vinaigrette" },
          { mealType: "DINNER", name: "Baked Salmon with Asparagus", calories: 480, protein: 42, carbs: 15, fat: 25, ingredients: "170g salmon, 1 cup asparagus, 1 tbsp lemon butter, 1/2 cup quinoa" },
          { mealType: "SNACK", name: "Greek Yogurt & Berries", calories: 150, protein: 18, carbs: 16, fat: 2, ingredients: "150g Greek yogurt, 1/2 cup mixed berries" },
        ],
        totalCalories: 1370
      },
      {
        dayOfWeek: 1,
        meals: [
          { mealType: "BREAKFAST", name: "Protein Smoothie Bowl", calories: 350, protein: 35, carbs: 30, fat: 10, ingredients: "1 scoop whey, 1 banana, 1/2 cup oats, 1 cup almond milk" },
          { mealType: "LUNCH", name: "Turkey Lettuce Wraps", calories: 380, protein: 38, carbs: 14, fat: 18, ingredients: "150g turkey breast, 4 lettuce cups, 1/4 cup hummus, tomato slices" },
          { mealType: "DINNER", name: "Lean Beef Stir-fry", calories: 500, protein: 45, carbs: 22, fat: 22, ingredients: "150g lean beef strips, 1 cup broccoli, 1 cup bell peppers, 1 tbsp soy sauce" },
          { mealType: "SNACK", name: "Cottage Cheese & Peach", calories: 140, protein: 16, carbs: 14, fat: 2, ingredients: "100g cottage cheese, 1 peach" },
        ],
        totalCalories: 1370
      },
      {
        dayOfWeek: 2,
        meals: [
          { mealType: "BREAKFAST", name: "Scrambled Eggs & Avocado", calories: 340, protein: 28, carbs: 10, fat: 22, ingredients: "2 eggs, 1/2 avocado, 1 slice rye bread" },
          { mealType: "LUNCH", name: "Tuna Salad with Greens", calories: 390, protein: 42, carbs: 12, fat: 18, ingredients: "160g tuna, 2 cups arugula, cherry tomatoes, 1 tbsp olive oil" },
          { mealType: "DINNER", name: "Lemon Herb Chicken Thighs", calories: 470, protein: 40, carbs: 20, fat: 24, ingredients: "150g chicken thigh, roasted zucchini, 1/2 cup brown rice" },
          { mealType: "SNACK", name: "Protein Bar", calories: 180, protein: 15, carbs: 20, fat: 6, ingredients: "1 protein bar (30g protein)" },
        ],
        totalCalories: 1380
      },
      {
        dayOfWeek: 3,
        meals: [
          { mealType: "BREAKFAST", name: "Overnight Oats & Whey", calories: 370, protein: 32, carbs: 40, fat: 8, ingredients: "1/2 cup oats, 1 scoop whey, 1/2 cup milk, 1 tbsp peanut butter" },
          { mealType: "LUNCH", name: "Grilled Shrimp Caesar", calories: 410, protein: 44, carbs: 14, fat: 18, ingredients: "150g shrimp, romaine lettuce, 2 tbsp light Caesar dressing" },
          { mealType: "DINNER", name: "Cod with Roasted Veggies", calories: 460, protein: 40, carbs: 18, fat: 22, ingredients: "180g cod, 1 cup roasted Brussels sprouts, 1 tbsp olive oil" },
          { mealType: "SNACK", name: "Apple & Almond Butter", calories: 160, protein: 6, carbs: 24, fat: 8, ingredients: "1 apple, 1 tbsp almond butter" },
        ],
        totalCalories: 1400
      },
      {
        dayOfWeek: 4,
        meals: [
          { mealType: "BREAKFAST", name: "Veggie Frittata", calories: 330, protein: 30, carbs: 14, fat: 18, ingredients: "3 eggs, 1/2 cup mushrooms, 1/2 cup onion, 1 tbsp cheese" },
          { mealType: "LUNCH", name: "Chicken & Quinoa Bowl", calories: 440, protein: 42, carbs: 26, fat: 16, ingredients: "140g chicken, 1/2 cup quinoa, 1 cup kale, 1/4 cup chickpeas" },
          { mealType: "DINNER", name: "Turkey Meatballs with Zoodles", calories: 490, protein: 44, carbs: 16, fat: 24, ingredients: "150g ground turkey, 2 zucchinis spiralized, 1/2 cup marinara" },
          { mealType: "SNACK", name: "Celery with PB", calories: 130, protein: 6, carbs: 12, fat: 8, ingredients: "3 celery stalks, 1 tbsp peanut butter" },
        ],
        totalCalories: 1390
      },
      {
        dayOfWeek: 5,
        meals: [
          { mealType: "BREAKFAST", name: "Protein Pancakes", calories: 360, protein: 35, carbs: 32, fat: 10, ingredients: "1 scoop protein powder, 1/2 cup oats, 1 egg, 1/4 cup berries" },
          { mealType: "LUNCH", name: "Salmon Salad Wrap", calories: 430, protein: 38, carbs: 20, fat: 20, ingredients: "120g salmon, 1 whole wheat wrap, mixed greens, light dressing" },
          { mealType: "DINNER", name: "Lean Pork Chop & Green Beans", calories: 480, protein: 42, carbs: 16, fat: 26, ingredients: "150g pork chop, 1 cup green beans, 1 sweet potato (small)" },
          { mealType: "SNACK", name: "Casein Pudding", calories: 150, protein: 20, carbs: 10, fat: 3, ingredients: "1 scoop casein, 1/2 cup milk" },
        ],
        totalCalories: 1420
      },
      {
        dayOfWeek: 6,
        meals: [
          { mealType: "BREAKFAST", name: "Eggs & Turkey Bacon", calories: 350, protein: 30, carbs: 12, fat: 20, ingredients: "2 eggs, 3 slices turkey bacon, 1 slice whole grain toast" },
          { mealType: "LUNCH", name: "Grilled Chicken Wrap", calories: 400, protein: 40, carbs: 22, fat: 16, ingredients: "150g chicken, 1 tortilla, lettuce, tomato, light mayo" },
          { mealType: "DINNER", name: "Beef & Broccoli Stir-fry", calories: 510, protein: 46, carbs: 24, fat: 22, ingredients: "160g lean beef, 1.5 cups broccoli, 2 tbsp teriyaki sauce" },
          { mealType: "SNACK", name: "Protein Shake", calories: 120, protein: 24, carbs: 4, fat: 2, ingredients: "1 scoop whey, 1 cup water" },
        ],
        totalCalories: 1380
      }
    ],
    bulk: [
      {
        dayOfWeek: 0,
        meals: [
          { mealType: "BREAKFAST", name: "Mass Gainer Oatmeal", calories: 650, protein: 40, carbs: 85, fat: 16, ingredients: "1 cup oats, 2 scoops whey, 2 tbsp peanut butter, 1 banana, 1 cup milk" },
          { mealType: "LUNCH", name: "Chicken Rice Bowl", calories: 720, protein: 55, carbs: 80, fat: 18, ingredients: "200g chicken breast, 1.5 cups white rice, 1 cup mixed veggies, 1 tbsp olive oil" },
          { mealType: "DINNER", name: "Steak & Sweet Potato", calories: 780, protein: 58, carbs: 65, fat: 28, ingredients: "200g sirloin steak, 2 sweet potatoes, 1 cup asparagus, 1 tbsp butter" },
          { mealType: "SNACK", name: "Mass Shake", calories: 450, protein: 35, carbs: 50, fat: 12, ingredients: "2 scoops mass gainer, 1 cup milk, 1 banana, 1 tbsp peanut butter" },
        ],
        totalCalories: 2600
      },
      {
        dayOfWeek: 1,
        meals: [
          { mealType: "BREAKFAST", name: "Egg & Bagel Stack", calories: 620, protein: 38, carbs: 72, fat: 18, ingredients: "3 eggs, 1 bagel, 2 slices cheese, 2 slices turkey" },
          { mealType: "LUNCH", name: "Salmon Pasta Bowl", calories: 750, protein: 48, carbs: 82, fat: 22, ingredients: "180g salmon, 200g pasta, 1/2 cup cream sauce, spinach" },
          { mealType: "DINNER", name: "Chicken Thighs & Rice", calories: 740, protein: 52, carbs: 70, fat: 26, ingredients: "200g chicken thighs, 1.5 cups jasmine rice, roasted carrots" },
          { mealType: "SNACK", name: "Cottage Cheese & Almonds", calories: 380, protein: 32, carbs: 18, fat: 22, ingredients: "250g cottage cheese, 30g almonds, 1 tbsp honey" },
        ],
        totalCalories: 2490
      },
      {
        dayOfWeek: 2,
        meals: [
          { mealType: "BREAKFAST", name: "French Toast Protein Style", calories: 640, protein: 42, carbs: 78, fat: 14, ingredients: "4 slices whole wheat, 2 eggs, 1 scoop whey, 1 tbsp maple syrup" },
          { mealType: "LUNCH", name: "Beef Burrito Bowl", calories: 780, protein: 50, carbs: 85, fat: 24, ingredients: "180g ground beef, 1 cup rice, beans, cheese, salsa" },
          { mealType: "DINNER", name: "Turkey Burgers & Wedges", calories: 720, protein: 54, carbs: 60, fat: 26, ingredients: "200g turkey patty, 2 potato wedges, 1/2 cup coleslaw" },
          { mealType: "SNACK", name: "Chocolate Milk & Peanuts", calories: 360, protein: 20, carbs: 40, fat: 14, ingredients: "2 cups chocolate milk, 30g peanuts" },
        ],
        totalCalories: 2500
      },
      {
        dayOfWeek: 3,
        meals: [
          { mealType: "BREAKFAST", name: "Protein Crepes", calories: 610, protein: 44, carbs: 65, fat: 16, ingredients: "2 crepes, 2 scoops protein, 1/2 cup berries, Greek yogurt" },
          { mealType: "LUNCH", name: "Tuna Melt on Rye", calories: 700, protein: 52, carbs: 60, fat: 24, ingredients: "200g tuna, 2 slices rye, cheese, 1 tbsp mayo" },
          { mealType: "DINNER", name: "Pork Tenderloin & Mash", calories: 760, protein: 56, carbs: 72, fat: 24, ingredients: "200g pork tenderloin, 2 potatoes mashed, gravy" },
          { mealType: "SNACK", name: "Trail Mix & Yogurt", calories: 420, protein: 18, carbs: 48, fat: 20, ingredients: "1/2 cup trail mix, 150g Greek yogurt" },
        ],
        totalCalories: 2490
      },
      {
        dayOfWeek: 4,
        meals: [
          { mealType: "BREAKFAST", name: "Breakfast Burrito", calories: 660, protein: 40, carbs: 70, fat: 22, ingredients: "3 eggs, 1 tortilla, cheese, salsa, 1/2 avocado" },
          { mealType: "LUNCH", name: "Chicken Alfredo", calories: 740, protein: 50, carbs: 74, fat: 26, ingredients: "180g chicken, 200g fettuccine, 1/2 cup Alfredo sauce" },
          { mealType: "DINNER", name: "Lamb Chops & Couscous", calories: 790, protein: 52, carbs: 68, fat: 30, ingredients: "200g lamb chops, 1 cup couscous, roasted peppers" },
          { mealType: "SNACK", name: "PB&J on Whole Wheat", calories: 380, protein: 14, carbs: 52, fat: 16, ingredients: "2 slices bread, 2 tbsp PB, 1 tbsp jam" },
        ],
        totalCalories: 2570
      },
      {
        dayOfWeek: 5,
        meals: [
          { mealType: "BREAKFAST", name: "Ham & Cheese Omelette", calories: 630, protein: 44, carbs: 40, fat: 30, ingredients: "3 eggs, 50g ham, 30g cheese, 1 slice toast" },
          { mealType: "LUNCH", name: "Teriyaki Chicken Rice", calories: 760, protein: 52, carbs: 88, fat: 18, ingredients: "200g chicken, 1.5 cups rice, teriyaki sauce, bok choy" },
          { mealType: "DINNER", name: "Baked Cod & Risotto", calories: 720, protein: 48, carbs: 74, fat: 20, ingredients: "200g cod, 1 cup risotto, lemon butter sauce" },
          { mealType: "SNACK", name: "Mixed Nuts & Dried Fruit", calories: 400, protein: 12, carbs: 46, fat: 22, ingredients: "40g mixed nuts, 40g dried fruit" },
        ],
        totalCalories: 2510
      },
      {
        dayOfWeek: 6,
        meals: [
          { mealType: "BREAKFAST", name: "Steak & Eggs", calories: 680, protein: 52, carbs: 30, fat: 36, ingredients: "150g steak, 3 eggs, 1 hash brown" },
          { mealType: "LUNCH", name: "Chicken Quesadilla", calories: 730, protein: 48, carbs: 64, fat: 28, ingredients: "180g chicken, 2 tortillas, cheese, salsa, sour cream" },
          { mealType: "DINNER", name: "BBQ Ribs & Corn", calories: 810, protein: 54, carbs: 70, fat: 32, ingredients: "250g ribs, 1 corn on cob, 1/2 cup baked beans" },
          { mealType: "SNACK", name: "Ice Cream & Protein", calories: 350, protein: 20, carbs: 56, fat: 8, ingredients: "1 scoop protein ice cream, 1 scoop whey" },
        ],
        totalCalories: 2570
      }
    ],
    maintain: [
      {
        dayOfWeek: 0,
        meals: [
          { mealType: "BREAKFAST", name: "Granola & Greek Yogurt", calories: 420, protein: 28, carbs: 52, fat: 12, ingredients: "1 cup Greek yogurt, 1/2 cup granola, 1/2 cup berries" },
          { mealType: "LUNCH", name: "Chicken Fajita Bowl", calories: 520, protein: 44, carbs: 48, fat: 16, ingredients: "150g chicken, peppers, onions, 1 cup rice, 1/4 avocado" },
          { mealType: "DINNER", name: "Grilled Fish Tacos", calories: 540, protein: 38, carbs: 52, fat: 18, ingredients: "140g white fish, 3 corn tortillas, cabbage slaw, lime" },
          { mealType: "SNACK", name: "Hummus & Veggie Sticks", calories: 220, protein: 12, carbs: 24, fat: 10, ingredients: "1/4 cup hummus, carrot & cucumber sticks" },
        ],
        totalCalories: 1700
      },
      {
        dayOfWeek: 1,
        meals: [
          { mealType: "BREAKFAST", name: "Avocado Toast & Egg", calories: 400, protein: 22, carbs: 38, fat: 20, ingredients: "1 slice sourdough, 1/2 avocado, 1 poached egg" },
          { mealType: "LUNCH", name: "Miso Salmon Bowl", calories: 530, protein: 40, carbs: 50, fat: 18, ingredients: "140g salmon, 1 cup sushi rice, edamame, seaweed" },
          { mealType: "DINNER", name: "Chicken Pesto Pasta", calories: 560, protein: 42, carbs: 56, fat: 20, ingredients: "150g chicken, 150g pasta, 2 tbsp pesto, cherry tomatoes" },
          { mealType: "SNACK", name: "Cheese & Crackers", calories: 210, protein: 12, carbs: 20, fat: 12, ingredients: "30g cheese, 6 whole grain crackers" },
        ],
        totalCalories: 1700
      },
      {
        dayOfWeek: 2,
        meals: [
          { mealType: "BREAKFAST", name: "Berry Smoothie Bowl", calories: 380, protein: 24, carbs: 56, fat: 8, ingredients: "1 cup mixed berries, 1 scoop protein, 1/2 cup oats, 1 cup milk" },
          { mealType: "LUNCH", name: "Mediterranean Wrap", calories: 510, protein: 34, carbs: 48, fat: 18, ingredients: "150g chicken, 1 wrap, hummus, olives, cucumber" },
          { mealType: "DINNER", name: "Shrimp Scampi", calories: 550, protein: 38, carbs: 52, fat: 18, ingredients: "160g shrimp, 150g linguine, garlic, lemon, 1 tbsp butter" },
          { mealType: "SNACK", name: "Apple & Cheese", calories: 200, protein: 10, carbs: 24, fat: 8, ingredients: "1 apple, 1 cheese stick" },
        ],
        totalCalories: 1640
      },
      {
        dayOfWeek: 3,
        meals: [
          { mealType: "BREAKFAST", name: "Ricotta Pancakes", calories: 410, protein: 28, carbs: 48, fat: 12, ingredients: "1/2 cup ricotta, 2 eggs, 1/2 cup flour, maple syrup" },
          { mealType: "LUNCH", name: "Thai Chicken Salad", calories: 500, protein: 38, carbs: 32, fat: 22, ingredients: "150g chicken, mixed greens, peanut dressing, cashews" },
          { mealType: "DINNER", name: "Beef Stir-fry Noodles", calories: 570, protein: 40, carbs: 60, fat: 18, ingredients: "140g beef, 200g noodles, mixed vegetables, soy sauce" },
          { mealType: "SNACK", name: "Rice Cakes & Avocado", calories: 180, protein: 4, carbs: 22, fat: 10, ingredients: "2 rice cakes, 1/4 avocado" },
        ],
        totalCalories: 1660
      },
      {
        dayOfWeek: 4,
        meals: [
          { mealType: "BREAKFAST", name: "Chia Pudding", calories: 360, protein: 20, carbs: 38, fat: 16, ingredients: "3 tbsp chia seeds, 1 cup coconut milk, 1 tbsp honey, berries" },
          { mealType: "LUNCH", name: "Turkey Club Sandwich", calories: 520, protein: 40, carbs: 44, fat: 18, ingredients: "150g turkey, 3 slices bread, lettuce, tomato, light mayo" },
          { mealType: "DINNER", name: "Baked Chicken & Veggies", calories: 540, protein: 44, carbs: 34, fat: 22, ingredients: "170g chicken breast, roasted broccoli, carrots, 1 tbsp olive oil" },
          { mealType: "SNACK", name: "Hard-Boiled Eggs", calories: 160, protein: 14, carbs: 2, fat: 10, ingredients: "2 hard-boiled eggs, salt & pepper" },
        ],
        totalCalories: 1580
      },
      {
        dayOfWeek: 5,
        meals: [
          { mealType: "BREAKFAST", name: "Banana Oat Muffins", calories: 390, protein: 18, carbs: 60, fat: 10, ingredients: "2 muffins (oat, banana, protein powder)" },
          { mealType: "LUNCH", name: "Greek Salad with Chicken", calories: 490, protein: 40, carbs: 20, fat: 26, ingredients: "150g chicken, feta, olives, cucumber, tomato, vinaigrette" },
          { mealType: "DINNER", name: "Lamb & Lentil Stew", calories: 560, protein: 42, carbs: 48, fat: 20, ingredients: "150g lamb, 1/2 cup lentils, carrots, celery, broth" },
          { mealType: "SNACK", name: "Edamame", calories: 180, protein: 16, carbs: 14, fat: 8, ingredients: "1 cup steamed edamame, sea salt" },
        ],
        totalCalories: 1620
      },
      {
        dayOfWeek: 6,
        meals: [
          { mealType: "BREAKFAST", name: "Egg Muffin Cups", calories: 370, protein: 26, carbs: 18, fat: 22, ingredients: "3 eggs, spinach, 1/4 cup cheese, baked in muffin tin" },
          { mealType: "LUNCH", name: "Poke Bowl", calories: 540, protein: 36, carbs: 60, fat: 16, ingredients: "140g ahi tuna, 1 cup sushi rice, avocado, cucumber, soy sauce" },
          { mealType: "DINNER", name: "Herb Roasted Chicken & Potatoes", calories: 560, protein: 46, carbs: 48, fat: 20, ingredients: "180g chicken leg, 1 cup roast potatoes, rosemary, garlic" },
          { mealType: "SNACK", name: "Dark Chocolate & Almonds", calories: 200, protein: 6, carbs: 16, fat: 14, ingredients: "20g dark chocolate, 20g almonds" },
        ],
        totalCalories: 1670
      }
    ]
  };

  const goalKey = preferences.goal?.toLowerCase() || "maintain";

  if (!GROK_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return FALLBACK_PLANS[goalKey] || FALLBACK_PLANS.maintain;
  }

  try {
    const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional registered dietitian. Respond ONLY with a valid JSON array of 7 day meal plans. No introductory or concluding remarks, no backticks, no markdown. Just JSON.",
          },
          {
            role: "user",
            content: `Create a 7-day meal plan for ${preferences.goal} goal at ${preferences.calories} calories. Dietary preferences: ${preferences.preferences.join(", ")}. Allergies: ${preferences.allergies.join(", ")}. Diet type: ${preferences.dietType}. Return a JSON array of 7 objects, each with: dayOfWeek (0-6), meals (array of {mealType: "BREAKFAST"|"LUNCH"|"DINNER"|"SNACK", name, calories, protein, carbs, fat, ingredients}), totalCalories.`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    const cleanedText = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Meal plan API error, using fallback:", error);
    return FALLBACK_PLANS[goalKey] || FALLBACK_PLANS.maintain;
  }
}

export async function generateAIWorkout(difficulty: string, availableExercises: string[]) {
  const PRESET_PLANS: Record<string, any[]> = {
    BEGINNER: [
      { name: "Push-up", sets: 3, reps: "10-12", rest: 60 },
      { name: "Squat", sets: 3, reps: "15", rest: 60 },
      { name: "Plank", sets: 3, reps: "30s", rest: 45 },
      { name: "Running", sets: 1, reps: "10m", rest: 0 }
    ],
    INTERMEDIATE: [
      { name: "Pull-up", sets: 4, reps: "8-10", rest: 90 },
      { name: "Push-up", sets: 3, reps: "20", rest: 60 },
      { name: "Squat", sets: 4, reps: "12-15", rest: 60 },
      { name: "Plank", sets: 3, reps: "60s", rest: 60 }
    ],
    ADVANCED: [
      { name: "Deadlift", sets: 4, reps: "5", rest: 120 },
      { name: "Pull-up", sets: 4, reps: "12", rest: 90 },
      { name: "Squat", sets: 4, reps: "8-10", rest: 90 },
      { name: "Push-up", sets: 4, reps: "25", rest: 60 }
    ]
  };

  if (!GROK_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate thinking latency
    return PRESET_PLANS[difficulty] || PRESET_PLANS.BEGINNER;
  }

  try {
    const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional athletic performance system. Respond ONLY with a valid JSON array of objects representing a workout routine. No introductory or concluding remarks, no backticks, no markdown. Just JSON.",
          },
          {
            role: "user",
            content: `Create a ${difficulty} workout plan choosing from these exercises: ${availableExercises.join(", ")}. Return a JSON array matching this format: [{"name": "Exercise Name", "sets": 3, "reps": "12", "rest": 60}]. Ensure exact exercise names.`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    // Clean up potential markdown formatting block if AI returned it despite the system prompt
    const cleanedText = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Workout generation API error, using preset fallback:", error);
    return PRESET_PLANS[difficulty] || PRESET_PLANS.BEGINNER;
  }
}

