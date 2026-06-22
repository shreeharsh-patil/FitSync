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
          { name: { contains: query } },
          { muscleGroups: { contains: query } },
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

export async function logWorkoutSession(
  userId: string,
  data: {
    workoutId?: string;
    durationMins: number;
    caloriesBurned: number;
    notes?: string;
    exercises: any;
  }
) {
  try {
    const log = await db.workoutLog.create({
      data: {
        userId,
        workoutId: data.workoutId,
        logDate: new Date(),
        startTime: new Date(Date.now() - data.durationMins * 60000),
        endTime: new Date(),
        durationMins: data.durationMins,
        caloriesBurned: data.caloriesBurned,
        notes: data.notes,
        exercises: data.exercises,
      },
    });

    revalidatePath("/workout");
    revalidatePath("/dashboard");
    return { success: "Workout logged", id: log.id };
  } catch (error) {
    console.error("Log workout session error:", error);
    return { error: "Failed to log workout session" };
  }
}

export async function askGrokCoach(
  userMessage: string,
  history: { role: "user" | "assistant"; content: string }[]
) {
  try {
    const { askAICoach } = await import("@/lib/openai");
    const reply = await askAICoach(userMessage, history);
    return { success: true, reply };
  } catch (error) {
    console.error("Grok Coach Action Error:", error);
    return { success: false, error: "AI Coach was unable to connect." };
  }
}

export async function getUserActivityAndStreak(userId: string) {
  try {
    const logs = await db.workoutLog.findMany({
      where: { userId },
      select: { logDate: true },
      orderBy: { logDate: "desc" },
    });

    const uniqueDates = Array.from(
      new Set(
        logs.map((log) => {
          const date = new Date(log.logDate);
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, "0");
          const dd = String(date.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        })
      )
    ).sort((a, b) => b.localeCompare(a));

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yyyyY = yesterday.getFullYear();
    const mmY = String(yesterday.getMonth() + 1).padStart(2, "0");
    const ddY = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayStr = `${yyyyY}-${mmY}-${ddY}`;

    let streak = 0;
    const latestLogDate = uniqueDates[0];

    if (latestLogDate === todayStr || latestLogDate === yesterdayStr) {
      let expectedDate = new Date(latestLogDate === todayStr ? today : yesterday);
      for (const dateStr of uniqueDates) {
        const yStr = expectedDate.getFullYear();
        const mStr = String(expectedDate.getMonth() + 1).padStart(2, "0");
        const dStr = String(expectedDate.getDate()).padStart(2, "0");
        const currentExpectedStr = `${yStr}-${mStr}-${dStr}`;

        if (dateStr === currentExpectedStr) {
          streak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      streak,
      activeDates: uniqueDates,
    };
  } catch (error) {
    console.error("GetUserActivityAndStreak Error:", error);
    return {
      streak: 0,
      activeDates: [],
    };
  }
}

export async function followUser(followerId: string, followingId: string) {
  try {
    await db.follows.create({
      data: {
        followerId,
        followingId,
      },
    });
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("Follow user error:", error);
    return { success: false, error: "Failed to follow user" };
  }
}

export async function unfollowUser(followerId: string, followingId: string) {
  try {
    await db.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("Unfollow user error:", error);
    return { success: false, error: "Failed to unfollow user" };
  }
}

export async function updateUserSettings(
  userId: string,
  data: { name?: string; username?: string; bio?: string; isPublic?: boolean }
) {
  try {
    if (data.username) {
      const existing = await db.user.findUnique({
        where: { username: data.username.toLowerCase() },
      });
      if (existing && existing.id !== userId) {
        return { error: "Username is already taken" };
      }
    }

    await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        username: data.username ? data.username.toLowerCase() : undefined,
        bio: data.bio,
        isPublic: data.isPublic,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: "Account information updated successfully!" };
  } catch (error) {
    console.error("Update settings error:", error);
    return { error: "Failed to update account preferences" };
  }
}

export async function updateUserPassword(
  userId: string,
  data: { currentPassword?: string; newPassword?: string }
) {
  try {
    if (!data.currentPassword || !data.newPassword) {
      return { error: "Current and new password are required" };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.passwordHash) {
      return { error: "User account not configured with credentials login" };
    }

    const passwordsMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!passwordsMatch) {
      return { error: "Incorrect current password" };
    }

    if (data.newPassword.length < 6) {
      return { error: "New password must be at least 6 characters" };
    }

    const hashed = await bcrypt.hash(data.newPassword, 12);
    await db.user.update({
      where: { id: userId },
      data: { passwordHash: hashed },
    });

    return { success: "Password updated successfully!" };
  } catch (error) {
    console.error("Password update error:", error);
    return { error: "Failed to update password security credentials" };
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    await db.user.delete({
      where: { id: userId },
    });
    return { success: "Account deleted successfully." };
  } catch (error) {
    console.error("Account deletion error:", error);
    return { error: "Failed to delete account" };
  }
}

export async function generateWorkoutWithAI(difficulty: Difficulty) {
  try {
    const dbExercises = await db.exercise.findMany();
    const exerciseNames = dbExercises.map((e) => e.name);

    const { generateAIWorkout } = await import("@/lib/openai");
    const aiPlan = await generateAIWorkout(difficulty, exerciseNames);

    const formattedExercises = aiPlan.map((item: any) => {
      const match = dbExercises.find(
        (e) => e.name.toLowerCase() === item.name.toLowerCase()
      );
      if (match) {
        return {
          exerciseId: match.id,
          name: match.name,
          sets: item.sets || 3,
          reps: String(item.reps || "10"),
          rest: item.rest || 60,
        };
      }
      return null;
    }).filter(Boolean);

    return {
      success: true,
      exercises: formattedExercises,
      name: `AI ${difficulty.charAt(0) + difficulty.slice(1).toLowerCase()} Protocol`
    };
  } catch (error) {
    console.error("AI Workout Generation Error:", error);
    return { error: "Failed to generate AI plan." };
  }
}

export async function createPostAction(userId: string, content: string) {
  try {
    const post = await db.post.create({
      data: {
        userId,
        content,
      },
      include: {
        user: true,
      },
    });
    revalidatePath("/community");
    return { success: true, post };
  } catch (error) {
    console.error("Create post error:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function createCommentAction(userId: string, postId: string, content: string) {
  try {
    const comment = await db.comment.create({
      data: {
        userId,
        postId,
        content,
      },
      include: {
        user: true,
      },
    });
    
    await db.post.update({
      where: { id: postId },
      data: {
        commentsCount: { increment: 1 },
      },
    });

    revalidatePath("/community");
    return { success: true, comment };
  } catch (error) {
    console.error("Create comment error:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function toggleLikePostAction(postId: string, increment: boolean) {
  try {
    await db.post.update({
      where: { id: postId },
      data: {
        likesCount: {
          increment: increment ? 1 : -1,
        },
      },
    });
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("Like toggle error:", error);
    return { success: false };
  }
}

export async function getConversations(userId: string) {
  try {
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const contactMap = new Map<string, { name: string; lastMessage: string; time: Date }>();

    for (const msg of messages) {
      const contactId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const contactName = msg.senderId === userId ? (msg.receiver.name || "Athlete") : (msg.sender.name || "Athlete");

      if (!contactMap.has(contactId)) {
        contactMap.set(contactId, {
          name: contactName,
          lastMessage: msg.content,
          time: msg.createdAt,
        });
      }
    }

    return Array.from(contactMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      lastMessage: data.lastMessage,
      time: data.time.toISOString(),
    }));
  } catch (error) {
    console.error("Get conversations error:", error);
    return [];
  }
}

export async function getMessages(userId: string, contactId: string) {
  try {
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return messages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      senderName: msg.senderId === userId ? "Me" : "Contact",
      receiverId: msg.receiverId,
      content: msg.content,
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: msg.senderId === userId,
    }));
  } catch (error) {
    console.error("Get messages error:", error);
    return [];
  }
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  try {
    const msg = await db.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    revalidatePath("/messages");
    return { success: true, message: msg };
  } catch (error) {
    console.error("Send message error:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function getDashboardMetrics(userId: string) {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const weekLogs = await db.workoutLog.findMany({
      where: { userId, logDate: { gte: startOfWeek } },
    });
    const monthLogs = await db.workoutLog.findMany({
      where: { userId, logDate: { gte: startOfMonth } },
    });
    const yearLogs = await db.workoutLog.findMany({
      where: { userId, logDate: { gte: startOfYear } },
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekVolumes = dayNames.map((_, idx) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + idx);
      const dayStr = day.toISOString().split("T")[0];
      const logs = weekLogs.filter((l) => l.logDate.toISOString().split("T")[0] === dayStr);
      return logs.reduce((sum, l) => sum + (l.caloriesBurned || 0), 0);
    });

    const weeklyVolume = weekVolumes.reduce((a, b) => a + b, 0);
    const monthlyVolume = monthLogs.reduce((sum, l) => sum + (l.caloriesBurned || 0), 0);
    const yearlyVolume = yearLogs.reduce((sum, l) => sum + (l.caloriesBurned || 0), 0);

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayLogs = await db.nutritionLog.findMany({
      where: { userId, logDate: { gte: todayStart } },
    });
    const todayCalories = todayLogs.reduce((sum, l) => sum + l.totalCalories, 0);

    const workout = await db.workout.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return {
      weekVolumes,
      weeklyVolume,
      monthlyVolume,
      yearlyVolume,
      todayCalories,
      activeRoutineName: workout?.name || null,
    };
  } catch (error) {
    console.error("Get dashboard metrics error:", error);
    return {
      weekVolumes: [0, 0, 0, 0, 0, 0, 0],
      weeklyVolume: 0,
      monthlyVolume: 0,
      yearlyVolume: 0,
      todayCalories: 0,
      activeRoutineName: null,
    };
  }
}

export async function getUserAchievements(userId: string) {
  try {
    const achievements = await db.achievement.findMany({
      where: { userId },
      orderBy: { earnedAt: "desc" },
    });
    return achievements;
  } catch (error) {
    console.error("Get achievements error:", error);
    return [];
  }
}


