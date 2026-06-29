import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

const mockDb = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  workout: {
    create: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
  },
  nutritionLog: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  exercise: {
    findMany: vi.fn(),
  },
  workoutLog: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  progressEntry: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  follows: {
    create: vi.fn(),
    delete: vi.fn(),
  },
  post: {
    create: vi.fn(),
    update: vi.fn(),
  },
  comment: {
    create: vi.fn(),
  },
  message: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  notification: {
    create: vi.fn(),
  },
  achievement: {
    findMany: vi.fn(),
  },
};

vi.mock("@/lib/db", () => ({
  default: mockDb,
}));

vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    type = "CredentialsSignin";
    constructor() {
      super("Auth error");
    }
  },
}));

vi.mock("@/auth", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@prisma/client", () => ({
  Difficulty: { BEGINNER: "BEGINNER", INTERMEDIATE: "INTERMEDIATE", ADVANCED: "ADVANCED" },
  MealType: { BREAKFAST: "BREAKFAST", LUNCH: "LUNCH", DINNER: "DINNER", SNACK: "SNACK" },
}));

const {
  register,
  login,
  createWorkout,
  getWorkouts,
  logMeal,
  getNutritionLogs,
} = await import("@/lib/actions");

function formDataFromObj(obj: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    fd.append(key, value);
  }
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("register", () => {
  it("returns error for invalid fields", async () => {
    const fd = formDataFromObj({ name: "A", email: "bad", password: "12" });
    const result = await register(fd);
    expect(result).toEqual({ error: "Invalid fields" });
  });

  it("returns error if email already exists", async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: "1", email: "test@test.com" });
    const fd = formDataFromObj({ name: "Test", email: "test@test.com", password: "password123" });
    const result = await register(fd);
    expect(result).toEqual({ error: "Email already in use" });
  });

  it("creates user and returns success", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    mockDb.user.create.mockResolvedValue({ id: "1", name: "Test", email: "test@test.com" });
    vi.spyOn(bcrypt, "hash").mockResolvedValue("hashed" as never);

    const fd = formDataFromObj({ name: "Test", email: "test@test.com", password: "password123" });
    const result = await register(fd);
    expect(result.success).toBe(true);
    expect(result.email).toBe("test@test.com");
  });
});

describe("login", () => {
  it("calls signIn with credentials", async () => {
    const { signIn } = await import("@/auth");
    const fd = formDataFromObj({ email: "test@test.com", password: "password123" });
    await login(fd);
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "test@test.com",
      password: "password123",
      redirectTo: "/dashboard",
    });
  });
});

describe("createWorkout", () => {
  it("creates a workout successfully", async () => {
    const workoutData = {
      userId: "user1",
      name: "Test Workout",
      difficulty: "BEGINNER" as const,
      daysPerWeek: 3,
      exercises: [
        { exerciseId: "ex1", sets: 3, reps: "10", rest: 60, order: 1 },
      ],
    };

    mockDb.workout.create.mockResolvedValue({ id: "w1", ...workoutData });

    const result = await createWorkout(workoutData.userId, workoutData as any);
    expect(result.success).toBe("Workout created");
    expect(result.id).toBe("w1");
    expect(mockDb.workout.create).toHaveBeenCalledWith({
      data: {
        userId: "user1",
        name: "Test Workout",
        difficulty: "BEGINNER",
        daysPerWeek: 3,
        exercises: {
          create: [
            { exerciseId: "ex1", sets: 3, reps: "10", restSec: 60, order: 1 },
          ],
        },
      },
    });
  });

  it("returns error on failure", async () => {
    mockDb.workout.create.mockRejectedValue(new Error("DB error"));
    const result = await createWorkout("user1", { name: "Test", difficulty: "BEGINNER", daysPerWeek: 3, exercises: [] } as any);
    expect(result).toEqual({ error: "Failed to create workout" });
  });
});

describe("getWorkouts", () => {
  it("returns workouts for user", async () => {
    const workouts = [
      {
        id: "w1",
        userId: "user1",
        name: "Test",
        difficulty: "BEGINNER",
        daysPerWeek: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        description: null,
        tags: null,
        exercises: [
          {
            id: "we1",
            workoutId: "w1",
            exerciseId: "ex1",
            sets: 3,
            reps: "10",
            restSec: 60,
            order: 1,
            createdAt: new Date(),
            exercise: {
              id: "ex1",
              name: "Push-up",
              category: "STRENGTH",
              muscleGroups: "chest",
              equipment: "bodyweight",
              instructions: "do it",
              difficulty: "BEGINNER",
              isCustom: false,
              createdBy: null,
              createdAt: new Date(),
              videoUrl: null,
              gifUrl: null,
            },
          },
        ],
      },
    ];
    mockDb.workout.findMany.mockResolvedValue(workouts);

    const result = await getWorkouts("user1");
    expect(result).toEqual(workouts);
  });

  it("returns empty array on error", async () => {
    mockDb.workout.findMany.mockRejectedValue(new Error("DB error"));
    const result = await getWorkouts("user1");
    expect(result).toEqual([]);
  });
});

describe("logMeal", () => {
  it("logs a meal successfully", async () => {
    const now = new Date();
    vi.useFakeTimers();
    vi.setSystemTime(now);

    mockDb.nutritionLog.create.mockResolvedValue({ id: "n1" });

    const result = await logMeal("user1", {
      mealType: "LUNCH" as const,
      foodItems: [{ name: "Chicken", calories: 300 }],
      totalCalories: 300,
      waterMl: 250,
      notes: "Good meal",
    });

    expect(result.success).toBe("Meal logged");
    expect(result.id).toBe("n1");
    expect(mockDb.nutritionLog.create).toHaveBeenCalledWith({
      data: {
        userId: "user1",
        logDate: now,
        mealType: "LUNCH",
        foodItems: [{ name: "Chicken", calories: 300 }],
        totalCalories: 300,
        waterMl: 250,
        notes: "Good meal",
      },
    });

    vi.useRealTimers();
  });

  it("returns error on failure", async () => {
    mockDb.nutritionLog.create.mockRejectedValue(new Error("DB error"));
    const result = await logMeal("user1", {
      mealType: "LUNCH",
      foodItems: [],
      totalCalories: 0,
    } as any);
    expect(result).toEqual({ error: "Failed to log meal" });
  });
});

describe("getNutritionLogs", () => {
  it("returns nutrition logs for user on a date", async () => {
    const date = new Date("2024-01-15");
    const logs = [
      {
        id: "n1",
        userId: "user1",
        logDate: date,
        mealType: "BREAKFAST",
        foodItems: "[]",
        totalCalories: 500,
        waterMl: 0,
        notes: null,
        createdAt: new Date(),
      },
    ];
    mockDb.nutritionLog.findMany.mockResolvedValue(logs);

    const result = await getNutritionLogs("user1", date);
    expect(result).toEqual(logs);
    expect(mockDb.nutritionLog.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user1",
        logDate: {
          gte: expect.any(Date),
          lte: expect.any(Date),
        },
      },
      orderBy: { createdAt: "asc" },
    });
  });

  it("returns empty array on error", async () => {
    mockDb.nutritionLog.findMany.mockRejectedValue(new Error("DB error"));
    const result = await getNutritionLogs("user1", new Date());
    expect(result).toEqual([]);
  });
});
