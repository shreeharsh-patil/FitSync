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

