const GROK_API_KEY = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY || "";
const GROK_BASE_URL = process.env.GROK_BASE_URL || "https://api.x.ai/v1";
const GROK_MODEL = process.env.GROK_MODEL || "grok-beta";

export async function askAICoach(userMessage: string, history: { role: "user" | "assistant"; content: string }[] = []) {
  if (!GROK_API_KEY) {
    return "AI Coach requires a GROK_API_KEY or OPENAI_API_KEY environment variable. Configure it in your .env.local file.";
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
  if (!GROK_API_KEY) {
    return { error: "Meal planning requires a GROK_API_KEY or OPENAI_API_KEY environment variable. Configure it in your .env.local file." };
  }

  const goalKey = preferences.goal?.toLowerCase() || "maintain";

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
    console.error("Meal plan API error:", error);
    return { error: "Failed to generate meal plan. Please try again later." };
  }
}

export async function generateAIWorkout(difficulty: string, availableExercises: string[]) {
  if (!GROK_API_KEY) {
    return { error: "AI workout generation requires a GROK_API_KEY or OPENAI_API_KEY environment variable. Configure it in your .env.local file." };
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
    const cleanedText = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Workout generation API error:", error);
    return { error: "Failed to generate workout. Please try again later." };
  }
}
