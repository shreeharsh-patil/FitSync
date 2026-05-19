"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  height: z.number().min(50).max(300).optional(),
  weight: z.number().min(20).max(500).optional(),
  fitnessGoal: z.string().optional(),
  activityLevel: z.string().optional(),
});

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string).toLowerCase();
  const password = formData.get("password") as string;

  const validatedFields = RegisterSchema.safeParse({
    name,
    email,
    password,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already in use" };
    }

    await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Authentication failed" };
      }
    }
    throw error;
  }
}

export async function login(formData: FormData) {
  const email = (formData.get("email") as string).toLowerCase();
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Authentication failed" };
      }
    }
    throw error;
  }
}

export async function updateProfile(
  userId: string,
  data: z.infer<typeof ProfileSchema>,
) {
  const validatedFields = ProfileSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: validatedFields.data,
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: "Profile updated" };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function searchExercises(query: string) {
  try {
    const exercises = await db.exercise.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { muscleGroups: { hasSome: [query] } },
        ],
      },
      take: 10,
    });
    return exercises;
  } catch (error) {
    console.error("Exercise search error:", error);
    return [];
  }
}

import { Difficulty, MealType } from "@prisma/client";

export async function createWorkout(
  userId: string,
  data: {
    name: string;
    difficulty: Difficulty;
    daysPerWeek: number;
    exercises: {
      exerciseId: string;
      sets: number;
      reps: string;
      rest: number;
      order: number;
    }[];
  },
) {
  try {
    const workout = await db.workout.create({
      data: {
        userId,
        name: data.name,
        difficulty: data.difficulty,
        daysPerWeek: data.daysPerWeek,
        exercises: {
          create: data.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            restSec: ex.rest,
            order: ex.order,
          })),
        },
      },
    });
    revalidatePath("/workout");
    return { success: "Workout created", id: workout.id };
  } catch (error) {
    console.error("Workout creation error:", error);
    return { error: "Failed to create workout" };
  }
}

export async function getWorkouts(userId: string) {
  try {
    const workouts = await db.workout.findMany({
      where: { userId },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return workouts;
  } catch (error) {
    console.error("Fetch workouts error:", error);
    return [];
  }
}

export async function getNutritionLogs(userId: string, date: Date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await db.nutritionLog.findMany({
      where: {
        userId,
        logDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return logs;
  } catch (error) {
    console.error("Fetch nutrition logs error:", error);
    return [];
  }
}

export async function logMeal(
  userId: string,
  data: {
    mealType: MealType;
    foodItems: any;
    totalCalories: number;
    waterMl?: number;
    notes?: string;
  },
) {
  try {
    const log = await db.nutritionLog.create({
      data: {
        userId,
        logDate: new Date(),
        mealType: data.mealType,
        foodItems: data.foodItems,
        totalCalories: data.totalCalories,
        waterMl: data.waterMl || 0,
        notes: data.notes,
      },
    });
    revalidatePath("/nutrition");
    revalidatePath("/dashboard");
    return { success: "Meal logged", id: log.id };
  } catch (error) {
    console.error("Log meal error:", error);
    return { error: "Failed to log meal" };
  }
}

export async function getProgressEntries(userId: string) {
  try {
    const entries = await db.progressEntry.findMany({
      where: { userId },
      orderBy: { logDate: "desc" },
    });
    return entries;
  } catch (error) {
    console.error("Fetch progress entries error:", error);
    return [];
  }
}

export async function createProgressEntry(
  userId: string,
  data: {
    weight?: number;
    bodyFatPct?: number;
    measurements?: any;
    photoUrl?: string;
    notes?: string;
  },
) {
  try {
    const entry = await db.progressEntry.create({
      data: {
        userId,
        logDate: new Date(),
        weight: data.weight,
        bodyFatPct: data.bodyFatPct,
        measurements: data.measurements,
        photoUrl: data.photoUrl,
        notes: data.notes,
      },
    });

    // Also update the user's current weight
    if (data.weight) {
      await db.user.update({
        where: { id: userId },
        data: { weight: data.weight },
      });
    }

    revalidatePath("/progress");
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: "Progress logged", id: entry.id };
  } catch (error) {
    console.error("Log progress error:", error);
    return { error: "Failed to log progress" };
  }
}
