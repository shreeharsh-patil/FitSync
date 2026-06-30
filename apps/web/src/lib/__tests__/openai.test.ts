import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

async function loadModule(apiKey?: string) {
  vi.resetModules();
  if (apiKey) {
    vi.stubEnv("GROK_API_KEY", apiKey);
  } else {
    vi.stubEnv("GROK_API_KEY", "");
  }
  return await import("@/lib/openai");
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("askAICoach", () => {
  it("returns config error when no API key is set", async () => {
    const { askAICoach } = await loadModule();
    const reply = await askAICoach("My chest hurts after bench press");
    expect(reply).toContain("GROK_API_KEY");
  });

  it("makes fetch call when API key is set", async () => {
    const { askAICoach } = await loadModule("test-key");

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Here is your coaching advice." } }],
      }),
    });

    const reply = await askAICoach("How do I improve my squat?", []);
    expect(reply).toBe("Here is your coaching advice.");
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("returns fallback message on API error", async () => {
    const { askAICoach } = await loadModule("test-key");

    mockFetch.mockRejectedValue(new Error("Network error"));

    const reply = await askAICoach("How do I improve my squat?");
    expect(reply).toContain("glitch");
  });
});

describe("generateAIWorkout", () => {
  it("returns config error when no API key is set", async () => {
    const { generateAIWorkout } = await loadModule();
    const plan = await generateAIWorkout("BEGINNER", []);
    expect(plan).toEqual({ error: expect.stringContaining("GROK_API_KEY") });
  });

  it("makes API call when key is set", async () => {
    const { generateAIWorkout } = await loadModule("test-key");

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify([
              { name: "Custom Exercise", sets: 4, reps: "10", rest: 90 },
            ]),
          },
        }],
      }),
    });

    const plan = await generateAIWorkout("BEGINNER", ["Custom Exercise"]);
    expect(plan).toHaveLength(1);
    expect(plan[0].name).toBe("Custom Exercise");
  });

  it("returns error on API failure", async () => {
    const { generateAIWorkout } = await loadModule("test-key");

    mockFetch.mockRejectedValue(new Error("API error"));

    const plan = await generateAIWorkout("BEGINNER", []);
    expect(plan).toEqual({ error: expect.any(String) });
  });
});

describe("generateMealPlan", () => {
  it("returns config error when no API key is set", async () => {
    const { generateMealPlan } = await loadModule();
    const plan = await generateMealPlan({
      goal: "cut",
      calories: 2000,
      preferences: [],
      allergies: [],
      dietType: "standard",
    });
    expect(plan).toEqual({ error: expect.stringContaining("GROK_API_KEY") });
  });

  it("makes API call when key is set", async () => {
    const { generateMealPlan } = await loadModule("test-key");

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify([
              { dayOfWeek: 0, meals: [], totalCalories: 2000 },
            ]),
          },
        }],
      }),
    });

    const plan = await generateMealPlan({
      goal: "cut",
      calories: 2000,
      preferences: [],
      allergies: [],
      dietType: "standard",
    });
    expect(plan).toHaveLength(1);
    expect(plan[0].totalCalories).toBe(2000);
  });

  it("returns error on API failure", async () => {
    const { generateMealPlan } = await loadModule("test-key");

    mockFetch.mockRejectedValue(new Error("API error"));

    const plan = await generateMealPlan({
      goal: "cut",
      calories: 2000,
      preferences: [],
      allergies: [],
      dietType: "standard",
    });
    expect(plan).toEqual({ error: expect.any(String) });
  });
});
