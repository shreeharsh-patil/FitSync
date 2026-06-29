import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const { askAICoach, generateAIWorkout } = await import("@/lib/openai");

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("GROK_API_KEY", "");
});

describe("askAICoach", () => {
  it("returns simulated response when no API key is set", async () => {
    const reply = await askAICoach("My chest hurts after bench press");
    expect(reply).toContain("Active recovery");
    expect(reply).toContain("Cat-Cow Stretch");
  });

  it("returns generic response for unmatched keywords", async () => {
    const reply = await askAICoach("What is the best way to stay fit?");
    expect(reply).toContain("great fitness question");
  });

  it("makes fetch call when API key is set", async () => {
    vi.stubEnv("GROK_API_KEY", "test-key");

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
    vi.stubEnv("GROK_API_KEY", "test-key");

    mockFetch.mockRejectedValue(new Error("Network error"));

    const reply = await askAICoach("How do I improve my squat?");
    expect(reply).toContain("glitch");
  });
});

describe("generateAIWorkout", () => {
  it("returns preset plan when no API key is set", async () => {
    const plan = await generateAIWorkout("BEGINNER", []);
    expect(plan).toHaveLength(4);
    expect(plan[0].name).toBe("Push-up");
    expect(plan[0].sets).toBe(3);
  });

  it("returns intermediate preset", async () => {
    const plan = await generateAIWorkout("INTERMEDIATE", []);
    expect(plan[0].name).toBe("Pull-up");
  });

  it("returns advanced preset", async () => {
    const plan = await generateAIWorkout("ADVANCED", []);
    expect(plan[0].name).toBe("Deadlift");
  });

  it("returns beginner preset for unknown difficulty", async () => {
    const plan = await generateAIWorkout("UNKNOWN", []);
    expect(plan[0].name).toBe("Push-up");
  });

  it("makes API call when key is set", async () => {
    vi.stubEnv("GROK_API_KEY", "test-key");

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

  it("falls back to preset on API failure", async () => {
    vi.stubEnv("GROK_API_KEY", "test-key");

    mockFetch.mockRejectedValue(new Error("API error"));

    const plan = await generateAIWorkout("BEGINNER", []);
    expect(plan[0].name).toBe("Push-up");
  });
});
