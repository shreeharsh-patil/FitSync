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

    return { success: true, email, password };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong" };
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

export async function updateNotificationPreferences(
  userId: string,
  preferences: { workouts: boolean; hydration: boolean; community: boolean; aiDeloads: boolean }
) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { notificationPreferences: JSON.stringify(preferences) },
    });
    revalidatePath("/settings");
    return { success: "Notification preferences updated" };
  } catch (error) {
    console.error("Update notification preferences error:", error);
    return { error: "Failed to update notification preferences" };
  }
}

export async function sendSupportTicket(
  userId: string,
  data: { subject: string; message: string }
) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    await db.notification.create({
      data: {
        userId,
        type: "support_ticket",
        data: JSON.stringify({
          subject: data.subject,
          message: data.message,
          userName: user?.name,
          userEmail: user?.email,
        }),
      },
    });

    revalidatePath("/settings");
    return { success: "Support ticket submitted successfully! We'll get back to you soon." };
  } catch (error) {
    console.error("Support ticket error:", error);
    return { error: "Failed to submit support ticket" };
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

// ─── Trainer Profile & Discovery Actions ───────────────────────────────

export async function getTrainers(filters?: {
  specialty?: string;
  minRating?: number;
  maxPrice?: number;
  search?: string;
}) {
  try {
    const where: any = {
      user: { role: "TRAINER" },
    };
    if (filters?.specialty) {
      where.specialties = { contains: filters.specialty };
    }
    if (filters?.minRating) {
      where.rating = { gte: filters.minRating };
    }
    if (filters?.maxPrice) {
      where.hourlyRate = { lte: filters.maxPrice };
    }
    if (filters?.search) {
      where.OR = [
        { bio: { contains: filters.search } },
        { specialties: { contains: filters.search } },
        { user: { name: { contains: filters.search } } },
      ];
    }
    const trainers = await db.trainerProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true, avatarUrl: true } },
        packages: { where: { isActive: true }, take: 3 },
        _count: { select: { testimonials: true, followers: true } },
      },
      orderBy: { rating: "desc" },
    });
    return trainers;
  } catch (error) {
    console.error("Get trainers error:", error);
    return [];
  }
}

export async function getTrainer(id: string) {
  try {
    const trainer = await db.trainerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, image: true, avatarUrl: true, bio: true } },
        packages: { where: { isActive: true }, orderBy: { price: "asc" } },
        testimonials: {
          include: { user: { select: { id: true, name: true, image: true, avatarUrl: true } } },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        timeSlots: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
        _count: { select: { testimonials: true, followers: true } },
      },
    });
    return trainer;
  } catch (error) {
    console.error("Get trainer error:", error);
    return null;
  }
}

export async function followTrainer(userId: string, trainerId: string) {
  try {
    await db.trainerFollow.create({
      data: { userId, trainerId },
    });
    revalidatePath("/trainers");
    revalidatePath(`/trainer/${trainerId}`);
    return { success: true };
  } catch (error) {
    console.error("Follow trainer error:", error);
    return { success: false, error: "Failed to follow trainer" };
  }
}

export async function unfollowTrainer(userId: string, trainerId: string) {
  try {
    await db.trainerFollow.delete({
      where: { userId_trainerId: { userId, trainerId } },
    });
    revalidatePath("/trainers");
    revalidatePath(`/trainer/${trainerId}`);
    return { success: true };
  } catch (error) {
    console.error("Unfollow trainer error:", error);
    return { success: false, error: "Failed to unfollow trainer" };
  }
}

export async function getTrainerStats(trainerId: string) {
  try {
    const [totalBookings, completedBookings, totalRevenue, clientCount] = await Promise.all([
      db.booking.count({ where: { package: { trainerId } } }),
      db.booking.count({ where: { package: { trainerId }, status: "COMPLETED" } }),
      db.booking.aggregate({
        where: { package: { trainerId }, status: "COMPLETED" },
        _sum: { package: { select: { price: true } } },
      }),
      db.booking.groupBy({
        by: ["userId"],
        where: { package: { trainerId } },
      }),
    ]);
    return {
      totalBookings,
      completedBookings,
      totalRevenue: (totalRevenue as any)?._sum?.package?.price || 0,
      clientCount: clientCount.length,
      completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
    };
  } catch (error) {
    console.error("Get trainer stats error:", error);
    return null;
  }
}

export async function createTrainingPackage(
  trainerId: string,
  data: { name: string; description?: string; sessions: number; price: number; durationWeeks: number }
) {
  try {
    await db.trainingPackage.create({
      data: { ...data, trainerId },
    });
    revalidatePath(`/trainer/${trainerId}`);
    revalidatePath("/trainer/dashboard");
    return { success: "Package created" };
  } catch (error) {
    console.error("Create package error:", error);
    return { error: "Failed to create package" };
  }
}

export async function getTrainingPackages(trainerId: string) {
  try {
    const packages = await db.trainingPackage.findMany({
      where: { trainerId },
      orderBy: { createdAt: "desc" },
    });
    return packages;
  } catch (error) {
    console.error("Get packages error:", error);
    return [];
  }
}

export async function bookSession(
  userId: string,
  trainerId: string,
  packageId: string,
  dateTime: Date
) {
  try {
    const booking = await db.booking.create({
      data: { userId, packageId, dateTime, status: "PENDING" },
    });

    // Mark the time slot as booked (approximate matching by hour)
    const hour = dateTime.getHours().toString().padStart(2, "0");
    const timeStr = `${hour}:00`;
    const dayOfWeek = dateTime.getDay();
    await db.timeSlot.updateMany({
      where: { trainerId, dayOfWeek, startTime: timeStr, isBooked: false },
      data: { isBooked: true },
    });

    revalidatePath(`/trainer/${trainerId}`);
    revalidatePath("/trainer/dashboard");
    return { success: "Session booked", id: booking.id };
  } catch (error) {
    console.error("Book session error:", error);
    return { error: "Failed to book session" };
  }
}

export async function getClientList(trainerId: string) {
  try {
    const bookings = await db.booking.findMany({
      where: { package: { trainerId } },
      include: {
        user: { select: { id: true, name: true, image: true, avatarUrl: true, fitnessGoal: true } },
        package: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Deduplicate by userId and include their latest booking/progress
    const clientMap = new Map<string, any>();
    for (const b of bookings) {
      if (!clientMap.has(b.userId)) {
        const progress = await db.progressEntry.findFirst({
          where: { userId: b.userId },
          orderBy: { logDate: "desc" },
        });
        clientMap.set(b.userId, {
          user: b.user,
          package: b.package,
          lastSession: b.dateTime,
          status: b.status,
          latestProgress: progress,
          bookingCount: 1,
        });
      } else {
        const entry = clientMap.get(b.userId);
        entry.bookingCount++;
        if (b.dateTime > entry.lastSession) {
          entry.lastSession = b.dateTime;
          entry.status = b.status;
        }
      }
    }
    return Array.from(clientMap.values());
  } catch (error) {
    console.error("Get client list error:", error);
    return [];
  }
}

export async function addTestimonial(
  trainerId: string,
  userId: string,
  content: string,
  rating: number
) {
  try {
    const testimonial = await db.testimonial.create({
      data: { trainerId, userId, content, rating },
    });

    // Update trainer rating
    const stats = await db.testimonial.aggregate({
      where: { trainerId },
      _avg: { rating: true },
      _count: true,
    });
    await db.trainerProfile.update({
      where: { id: trainerId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count,
      },
    });

    revalidatePath(`/trainer/${trainerId}`);
    return { success: "Review added", id: testimonial.id };
  } catch (error) {
    console.error("Add testimonial error:", error);
    return { error: "Failed to add review" };
  }
}

export async function getTrainerByUserId(userId: string) {
  try {
    const profile = await db.trainerProfile.findUnique({
      where: { userId },
      include: {
        packages: { orderBy: { createdAt: "desc" } },
        timeSlots: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
        _count: { select: { testimonials: true, followers: true } },
      },
    });
    return profile;
  } catch (error) {
    console.error("Get trainer by userId error:", error);
    return null;
  }
}

export async function updateTrainerProfile(
  trainerId: string,
  data: {
    bio?: string;
    specialties?: string;
    certifications?: string;
    experience?: number;
    hourlyRate?: number;
    isAvailable?: boolean;
  }
) {
  try {
    await db.trainerProfile.update({
      where: { id: trainerId },
      data,
    });
    revalidatePath("/trainer/dashboard");
    return { success: "Profile updated" };
  } catch (error) {
    console.error("Update trainer profile error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function createTimeSlot(
  trainerId: string,
  data: { dayOfWeek: number; startTime: string; endTime: string }
) {
  try {
    await db.timeSlot.create({
      data: { ...data, trainerId },
    });
    revalidatePath("/trainer/dashboard");
    return { success: "Time slot created" };
  } catch (error) {
    console.error("Create time slot error:", error);
    return { error: "Failed to create time slot" };
  }
}

export async function deleteTimeSlot(slotId: string) {
  try {
    await db.timeSlot.delete({ where: { id: slotId } });
    revalidatePath("/trainer/dashboard");
    return { success: "Time slot deleted" };
  } catch (error) {
    console.error("Delete time slot error:", error);
    return { error: "Failed to delete time slot" };
  }
}

export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    await db.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    revalidatePath("/trainer/dashboard");
    return { success: "Booking updated" };
  } catch (error) {
    console.error("Update booking error:", error);
    return { error: "Failed to update booking" };
  }
}

export async function getTrainerBookings(trainerId: string) {
  try {
    const bookings = await db.booking.findMany({
      where: { package: { trainerId } },
      include: {
        user: { select: { id: true, name: true, image: true, avatarUrl: true } },
        package: true,
      },
      orderBy: { dateTime: "desc" },
      take: 50,
    });
    return bookings;
  } catch (error) {
    console.error("Get bookings error:", error);
    return [];
  }
}

export async function getUserFollowsTrainer(userId: string, trainerId: string) {
  try {
    const follow = await db.trainerFollow.findUnique({
      where: { userId_trainerId: { userId, trainerId } },
    });
    return !!follow;
  } catch {
    return false;
  }
}

export async function getTrainerPublicWorkouts(trainerId: string) {
  try {
    const profile = await db.trainerProfile.findUnique({
      where: { id: trainerId },
      select: { userId: true },
    });
    if (!profile) return [];
    const workouts = await db.workout.findMany({
      where: { userId: profile.userId, isPublic: true },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return workouts;
  } catch (error) {
    console.error("Get public workouts error:", error);
    return [];
  }
}

import {
  generateTOTPSecret,
  verifyTOTPToken,
  generateBackupCodes,
  getTOTPURI,
  getQRDataURL,
} from "@/lib/twofactor";
import {
  generateVerificationToken,
  sendVerificationEmail,
  verifyEmailToken,
} from "@/lib/email";

export async function setupTwoFactor(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user || !user.email) {
      return { error: "User not found" };
    }

    if (user.twoFactorEnabled) {
      return { error: "Two-factor authentication is already enabled" };
    }

    const secret = generateTOTPSecret();
    const backupCodes = generateBackupCodes();

    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
        twoFactorBackupCodes: JSON.stringify(backupCodes),
      },
    });

    const uri = getTOTPURI(secret, user.email);
    const qrUrl = getQRDataURL(uri);

    return {
      success: true,
      secret,
      qrUrl,
      uri,
      backupCodes,
    };
  } catch (error) {
    console.error("Setup 2FA error:", error);
    return { error: "Failed to setup two-factor authentication" };
  }
}

export async function verifyTwoFactorToken(userId: string, token: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user || !user.twoFactorSecret) {
      return { error: "Two-factor authentication not set up" };
    }

    if (user.twoFactorEnabled) {
      return { error: "Two-factor authentication is already enabled" };
    }

    const valid = verifyTOTPToken(user.twoFactorSecret, token);
    if (!valid) {
      return { error: "Invalid verification code" };
    }

    await db.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return { success: "Two-factor authentication enabled" };
  } catch (error) {
    console.error("Verify 2FA token error:", error);
    return { error: "Failed to verify code" };
  }
}

export async function disableTwoFactor(userId: string, password: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true, twoFactorEnabled: true },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (!user.twoFactorEnabled) {
      return { error: "Two-factor authentication is not enabled" };
    }

    if (user.passwordHash) {
      const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordsMatch) {
        return { error: "Incorrect password" };
      }
    }

    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        twoFactorEnabled: false,
        twoFactorBackupCodes: null,
      },
    });

    return { success: "Two-factor authentication disabled" };
  } catch (error) {
    console.error("Disable 2FA error:", error);
    return { error: "Failed to disable two-factor authentication" };
  }
}

export async function verifyTwoFactorLogin(userId: string, token: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorBackupCodes: true },
    });

    if (!user || !user.twoFactorSecret) {
      return { error: "Two-factor authentication not configured" };
    }

    if (verifyTOTPToken(user.twoFactorSecret, token)) {
      return { success: true };
    }

    if (user.twoFactorBackupCodes) {
      const codes: string[] = JSON.parse(user.twoFactorBackupCodes);
      const idx = codes.indexOf(token);
      if (idx !== -1) {
        codes.splice(idx, 1);
        await db.user.update({
          where: { id: userId },
          data: { twoFactorBackupCodes: JSON.stringify(codes) },
        });
        return { success: true };
      }
    }

    return { error: "Invalid verification code" };
  } catch (error) {
    console.error("Verify 2FA login error:", error);
    return { error: "Failed to verify code" };
  }
}

export async function sendVerificationEmailAction(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, emailVerified: true },
    });

    if (!user || !user.email) {
      return { error: "User not found or no email on account" };
    }

    if (user.emailVerified) {
      return { error: "Email already verified" };
    }

    const token = await generateVerificationToken(userId, user.email);
    await sendVerificationEmail(user.email, token);

    return { success: "Verification email sent" };
  } catch (error) {
    console.error("Send verification email error:", error);
    return { error: "Failed to send verification email" };
  }
}

export async function verifyEmail(token: string, email: string) {
  try {
    const result = await verifyEmailToken(token, email);
    if (!result) {
      return { error: "Invalid or expired verification token" };
    }
    return { success: "Email verified successfully" };
  } catch (error) {
    console.error("Verify email error:", error);
    return { error: "Failed to verify email" };
  }
}

export async function generateMealPlanAction(
  userId: string,
  preferences: {
    name?: string;
    goal: string;
    calories: number;
    preferences: string[];
    allergies: string[];
    dietType: string;
  }
) {
  try {
    const { generateMealPlan } = await import("@/lib/openai");
    const days = await generateMealPlan(preferences);

    const planName = preferences.name || `${preferences.goal.charAt(0).toUpperCase() + preferences.goal.slice(1)} Meal Protocol`;

    const mealPlan = await db.mealPlan.create({
      data: {
        userId,
        name: planName,
        goal: preferences.goal,
        calories: preferences.calories,
        preferences: JSON.stringify(preferences.preferences),
        allergies: JSON.stringify(preferences.allergies),
        dietType: preferences.dietType,
        days: {
          create: days.map((day: any) => ({
            dayOfWeek: day.dayOfWeek,
            meals: JSON.stringify(day.meals),
            totalCalories: day.totalCalories,
          })),
        },
      },
      include: { days: true },
    });

    revalidatePath("/nutrition/ai-meal-plan");
    return { success: true, mealPlan };
  } catch (error) {
    console.error("Generate meal plan error:", error);
    return { error: "Failed to generate meal plan" };
  }
}

export async function getMealPlans(userId: string) {
  try {
    const plans = await db.mealPlan.findMany({
      where: { userId },
      include: { days: true },
      orderBy: { createdAt: "desc" },
    });
    return plans;
  } catch (error) {
    console.error("Get meal plans error:", error);
    return [];
  }
}

export async function regenerateMealPlanDay(dayId: string, preferences: {
  goal: string;
  calories: number;
  preferences: string[];
  allergies: string[];
  dietType: string;
}) {
  try {
    const { generateMealPlan } = await import("@/lib/openai");
    const days = await generateMealPlan(preferences);

    const existingDay = await db.mealPlanDay.findUnique({ where: { id: dayId } });
    if (!existingDay) return { error: "Day not found" };

    const newDayData = days[existingDay.dayOfWeek] || days[0];

    await db.mealPlanDay.update({
      where: { id: dayId },
      data: {
        meals: JSON.stringify(newDayData.meals),
        totalCalories: newDayData.totalCalories,
      },
    });

    revalidatePath("/nutrition/ai-meal-plan");
    return { success: true, day: newDayData };
  } catch (error) {
    console.error("Regenerate day error:", error);
    return { error: "Failed to regenerate day" };
  }
}

export async function getWorkoutRecommendationsAction(userId: string) {
  try {
    const recentLogs = await db.workoutLog.findMany({
      where: { userId },
      orderBy: { logDate: "desc" },
      take: 30,
    });

    const summaries = recentLogs.map((log) => {
      const exercises = typeof log.exercises === "string" ? JSON.parse(log.exercises) : log.exercises;
      return {
        exerciseName: exercises?.[0]?.exerciseName || "Exercise",
        sets: exercises?.map((e: any) => ({
          reps: e.reps || 10,
          weight: e.weight || 0,
          restSec: e.restSec || 60,
        })) || [{ reps: 10, weight: 0, restSec: 60 }],
        logDate: log.logDate,
      };
    });

    const { getWorkoutRecommendations } = await import("@/lib/workout-recommendations");
    const recommendations = getWorkoutRecommendations(summaries);

    return { success: true, ...recommendations };
  } catch (error) {
    console.error("Get workout recommendations error:", error);
    return { error: "Failed to generate recommendations" };
  }
}

export async function analyzeMealPhoto(imageData: string) {
  try {
    const GROK_API_KEY = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY || "";
    const GROK_BASE_URL = process.env.GROK_BASE_URL || "https://api.x.ai/v1";

    if (!GROK_API_KEY) {
      await new Promise((r) => setTimeout(r, 2000));

      return {
        success: true,
        items: [
          { name: "Grilled Chicken Breast", confidence: 0.94, calories: 220, protein: 42, carbs: 0, fat: 5, servingSize: "170g" },
          { name: "Steamed Broccoli", confidence: 0.88, calories: 55, protein: 4, carbs: 11, fat: 1, servingSize: "150g" },
          { name: "Brown Rice", confidence: 0.91, calories: 216, protein: 5, carbs: 45, fat: 2, servingSize: "1 cup cooked" },
          { name: "Olive Oil Dressing", confidence: 0.76, calories: 120, protein: 0, carbs: 0, fat: 14, servingSize: "1 tbsp" },
        ],
        totalCalories: 611,
        totalProtein: 51,
        totalCarbs: 56,
        totalFat: 22,
      };
    }

    const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROK_MODEL || "grok-beta",
        messages: [
          {
            role: "system",
            content: "You are a computer vision nutrition analysis system. Analyze the food in this image (described by the user) and respond ONLY with valid JSON. No markdown, no backticks.",
          },
          {
            role: "user",
            content: `Analyze this meal photo and identify each food item with confidence score and nutritional values. Return a JSON object: { items: [{ name: string, confidence: number 0-1, calories: number, protein: number, carbs: number, fat: number, servingSize: string }], totalCalories: number, totalProtein: number, totalCarbs: number, totalFat: number }. Image data: ${imageData.substring(0, 500)}`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    const cleanedText = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    return { success: true, ...JSON.parse(cleanedText) };
  } catch (error) {
    console.error("Analyze meal photo error:", error);
    return { error: "Failed to analyze meal photo" };
  }
}

export async function analyzeExerciseForm(videoFrame: string) {
  try {
    const GROK_API_KEY = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY || "";
    const GROK_BASE_URL = process.env.GROK_BASE_URL || "https://api.x.ai/v1";

    if (!GROK_API_KEY) {
      await new Promise((r) => setTimeout(r, 1500));

      return {
        success: true,
        exercise: "Squat",
        formScore: 72,
        feedback: [
          { type: "warning", message: "Chest is dropping forward — keep upper back tight and chest up" },
          { type: "error", message: "Depth is slightly above parallel — aim to break parallel for full ROM" },
          { type: "success", message: "Knee tracking is good — staying in line with toes" },
        ],
        repCount: 8,
        suggestions: "Widen stance slightly and focus on pushing knees out. Brace core before each rep.",
      };
    }

    const response = await fetch(`${GROK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROK_MODEL || "grok-beta",
        messages: [
          {
            role: "system",
            content: "You are a biomechanical form analysis AI. Respond ONLY with valid JSON. No markdown, no backticks.",
          },
          {
            role: "user",
            content: `Analyze this exercise form from a video frame. Identify the exercise, form score (0-100), and provide feedback. Return JSON: { exercise: string, formScore: number, feedback: [{ type: "success"|"warning"|"error", message: string }], repCount: number, suggestions: string }. Frame data: ${videoFrame.substring(0, 500)}`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    const cleanedText = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    return { success: true, ...JSON.parse(cleanedText) };
  } catch (error) {
    console.error("Analyze exercise form error:", error);
    return { error: "Failed to analyze exercise form" };
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



export async function getFeed(
  userId: string,
  cursor?: string,
  limit: number = 10,
  filter?: { category?: string; sort?: string; scope?: string }
) {
  try {
    const where: any = {};

    if (filter?.scope === "following") {
      const follows = await db.follows.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = follows.map((f) => f.followingId);
      where.userId = { in: [...followingIds, userId] };
    }

    if (filter?.category && filter.category !== "all") {
      const categoryMap: Record<string, string> = {
        workouts: "workout",
        nutrition: "nutrition",
        achievements: "achievement",
        challenges: "challenge",
      };
      const prefix = categoryMap[filter.category];
      if (prefix) {
        where.content = { startsWith: `/${prefix}` };
      }
    }

    const orderBy: any =
      filter?.sort === "popular"
        ? { likesCount: "desc" }
        : filter?.sort === "trending"
          ? [{ likesCount: "desc" }, { commentsCount: "desc" }]
          : { createdAt: "desc" };

    const posts = await db.post.findMany({
      where,
      include: {
        user: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
          take: 3,
        },
      },
      orderBy,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = posts.length > limit;
    const items = posts.slice(0, limit).map((p) => ({
      id: p.id,
      author: p.user.name || "Athlete",
      role: p.user.fitnessGoal
        ? `${p.user.fitnessGoal.charAt(0).toUpperCase() + p.user.fitnessGoal.slice(1).toLowerCase()} Athlete`
        : "Standard Athlete",
      avatar: (p.user.name || "Athlete").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
      time: new Date(p.createdAt).toLocaleDateString() + " " + new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: p.content,
      mediaUrls: p.mediaUrls ? JSON.parse(p.mediaUrls) : [],
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
      isLikedByUser: false,
      comments: p.comments.map((c) => ({
        author: c.user.name || "Athlete",
        avatar: (c.user.name || "Athlete").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
        content: c.content,
        time: new Date(c.createdAt).toLocaleDateString(),
      })),
      userId: p.userId,
    }));

    return { posts: items, hasMore, nextCursor: hasMore ? items[items.length - 1]?.id : null };
  } catch (error) {
    console.error("Get feed error:", error);
    return { posts: [], hasMore: false, nextCursor: null };
  }
}

export async function getFeedPosts(userId: string, page: number = 1, filter?: any) {
  return getFeed(userId, undefined, page * 10, filter);
}

export async function uploadPostImage(userId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    return { success: true, url: dataUri };
  } catch (error) {
    console.error("Upload image error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function deletePost(postId: string) {
  try {
    await db.comment.deleteMany({ where: { postId } });
    await db.post.delete({ where: { id: postId } });
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("Delete post error:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

export async function getTrendingPosts(userId: string) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const posts = await db.post.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      include: { user: true },
      orderBy: [{ likesCount: "desc" }, { commentsCount: "desc" }],
      take: 10,
    });

    return posts.map((p) => ({
      id: p.id,
      author: p.user.name || "Athlete",
      content: p.content,
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
      time: new Date(p.createdAt).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Get trending posts error:", error);
    return [];
  }
}

export async function shareWorkout(userId: string, workoutId: string, content: string) {
  try {
    const workout = await db.workout.findUnique({
      where: { id: workoutId },
      include: { exercises: true },
    });

    if (!workout) return { success: false, error: "Workout not found" };

    const postContent = `/workout ${content || `Just completed ${workout.name}!`}`;
    const workoutCard = {
      name: workout.name,
      meta: `${workout.daysPerWeek} days/week \u2022 ${workout.difficulty}`,
      exercises: workout.exercises.length,
    };

    const post = await db.post.create({
      data: {
        userId,
        content: postContent,
        mediaUrls: JSON.stringify([]),
      },
      include: { user: true },
    });

    revalidatePath("/community");
    return { success: true, post, workoutCard };
  } catch (error) {
    console.error("Share workout error:", error);
    return { success: false, error: "Failed to share workout" };
  }
}

export async function createPostWithMedia(userId: string, content: string, mediaUrls: string[]) {
  try {
    const post = await db.post.create({
      data: {
        userId,
        content,
        mediaUrls: JSON.stringify(mediaUrls),
      },
      include: { user: true },
    });
    revalidatePath("/community");
    return { success: true, post };
  } catch (error) {
    console.error("Create post with media error:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function getNotificationCount(userId: string) {
  try {
    const count = await db.notification.count({
      where: { userId, isRead: false },
    });
    return count;
  } catch (error) {
    console.error("Get notification count error:", error);
    return 0;
  }
}

export async function markNotificationsRead(userId: string) {
  try {
    await db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getUserOnlineStatus(userId: string) {
  return { online: false };
}

// ─── Challenge Actions ─────────────────────────────────────────────────

export async function getChallenges(filters?: { type?: string; difficulty?: string; duration?: string }) {
  try {
    const challenges = await db.challenge.findMany({
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, avatarUrl: true, image: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    return challenges
      .map((c) => {
        const rules = (() => { try { return JSON.parse(c.rules); } catch { return {}; } })();
        const durationDays = Math.ceil((c.endDate.getTime() - c.startDate.getTime()) / (1000 * 60 * 60 * 24));
        const status = c.endDate < now ? "completed" : c.startDate > now ? "upcoming" : "active";
        const type = rules.type || "custom";
        const difficulty = rules.difficulty || "BEGINNER";

        let matches = true;
        if (filters?.type && filters.type !== "all" && type !== filters.type) matches = false;
        if (filters?.difficulty && filters.difficulty !== "all" && difficulty !== filters.difficulty) matches = false;
        if (filters?.duration && filters.duration !== "all") {
          if (filters.duration === "short" && durationDays > 14) matches = false;
          else if (filters.duration === "medium" && (durationDays <= 14 || durationDays > 30)) matches = false;
          else if (filters.duration === "long" && durationDays <= 30) matches = false;
        }

        if (!matches) return null;

        return {
          id: c.id,
          title: c.title,
          startDate: c.startDate.toISOString(),
          endDate: c.endDate.toISOString(),
          rules,
          participantCount: c.participantCount,
          createdAt: c.createdAt.toISOString(),
          durationDays,
          status,
          type,
          difficulty,
          participants: c.participants.map((p) => ({
            id: p.userId,
            name: p.user.name || "Athlete",
            avatar: p.user.avatarUrl || p.user.image || null,
            progress: (() => { try { return JSON.parse(p.progress); } catch { return {}; } })(),
            rank: p.rank,
            joinedAt: p.joinedAt.toISOString(),
          })),
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Get challenges error:", error);
    return [];
  }
}

export async function getChallenge(id: string) {
  try {
    const challenge = await db.challenge.findUnique({
      where: { id },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, avatarUrl: true, image: true } } },
          orderBy: [{ rank: { sort: "asc", nulls: "last" } }, { joinedAt: "asc" }],
        },
      },
    });

    if (!challenge) return null;

    const rules = (() => { try { return JSON.parse(challenge.rules); } catch { return {}; } })();
    return {
      id: challenge.id,
      title: challenge.title,
      startDate: challenge.startDate.toISOString(),
      endDate: challenge.endDate.toISOString(),
      rules,
      participantCount: challenge.participantCount,
      createdAt: challenge.createdAt.toISOString(),
      participants: challenge.participants.map((p) => ({
        id: p.userId,
        name: p.user.name || "Athlete",
        avatar: p.user.avatarUrl || p.user.image || null,
        progress: (() => { try { return JSON.parse(p.progress); } catch { return {}; } })(),
        rank: p.rank,
        joinedAt: p.joinedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Get challenge error:", error);
    return null;
  }
}

export async function joinChallenge(userId: string, challengeId: string) {
  try {
    const existing = await db.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });
    if (existing) return { error: "Already joined this challenge" };

    await db.challengeParticipant.create({
      data: { challengeId, userId, progress: JSON.stringify({}) },
    });

    await db.challenge.update({
      where: { id: challengeId },
      data: { participantCount: { increment: 1 } },
    });

    revalidatePath("/challenges");
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("Join challenge error:", error);
    return { error: "Failed to join challenge" };
  }
}

export async function leaveChallenge(userId: string, challengeId: string) {
  try {
    await db.challengeParticipant.delete({
      where: { challengeId_userId: { challengeId, userId } },
    });

    await db.challenge.update({
      where: { id: challengeId },
      data: { participantCount: { decrement: 1 } },
    });

    revalidatePath("/challenges");
    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("Leave challenge error:", error);
    return { error: "Failed to leave challenge" };
  }
}

export async function updateChallengeProgress(userId: string, challengeId: string, progress: any) {
  try {
    await db.challengeParticipant.update({
      where: { challengeId_userId: { challengeId, userId } },
      data: { progress: JSON.stringify(progress) },
    });

    revalidatePath("/challenges");
    return { success: true };
  } catch (error) {
    console.error("Update challenge progress error:", error);
    return { error: "Failed to update progress" };
  }
}

export async function createChallenge(data: {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  goal: string;
}) {
  try {
    const challenge = await db.challenge.create({
      data: {
        title: data.title,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        rules: JSON.stringify({
          type: data.type,
          difficulty: data.difficulty,
          description: data.description,
          goal: data.goal,
        }),
      },
    });

    revalidatePath("/challenges");
    return { success: true, id: challenge.id };
  } catch (error) {
    console.error("Create challenge error:", error);
    return { error: "Failed to create challenge" };
  }
}

// ─── Leaderboard Actions ───────────────────────────────────────────────

export async function getLeaderboard(period: string, category: string) {
  try {
    const now = new Date();
    let startDate: Date | null = null;

    if (period === "weekly") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === "monthly") {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    }

    const dateFilter = startDate ? { logDate: { gte: startDate } } : {};

    const users = await db.user.findMany({
      where: { isPublic: true },
      select: { id: true, name: true, avatarUrl: true, image: true },
    });

    const leaderboard: { userId: string; name: string; avatar: string | null; score: number; details?: any }[] = [];

    for (const user of users) {
      let score = 0;
      let details: any = {};

      const logs = await db.workoutLog.findMany({
        where: { userId: user.id, ...dateFilter },
      });

      if (category === "workouts") {
        score = logs.length;
      } else if (category === "calories") {
        score = logs.reduce((sum, l) => sum + (l.caloriesBurned || 0), 0);
      } else if (category === "streak") {
        const uniqueDates = Array.from(
          new Set(logs.map((l) => l.logDate.toISOString().split("T")[0]))
        ).sort((a, b) => b.localeCompare(a));

        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
          let expected = new Date(uniqueDates[0] === todayStr ? today : yesterday);
          for (const dateStr of uniqueDates) {
            const expectedStr = expected.toISOString().split("T")[0];
            if (dateStr === expectedStr) { score++; expected.setDate(expected.getDate() - 1); }
            else break;
          }
        }
        details.streak = score;
      } else if (category === "active_days") {
        const uniqueDates = new Set(logs.map((l) => l.logDate.toISOString().split("T")[0]));
        score = uniqueDates.size;
      }

      leaderboard.push({ userId: user.id, name: user.name || "Athlete", avatar: user.avatarUrl || user.image || null, score, details });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard.map((entry, i) => ({ ...entry, rank: i + 1 }));
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return [];
  }
}

export async function getUserRank(userId: string, period: string) {
  try {
    const leaderboard = await getLeaderboard(period, "workouts");
    return leaderboard.find((entry) => entry.userId === userId) || null;
  } catch (error) {
    console.error("Get user rank error:", error);
    return null;
  }
}

// === RECIPE ACTIONS ===

export async function createRecipe(
  userId: string,
  data: {
    name: string;
    description?: string;
    ingredients: { name: string; qty: number; unit: string; calories: number; protein: number; carbs: number; fat: number }[];
    instructions?: string;
    prepTime?: number;
    cookTime?: number;
    servings: number;
    imageUrl?: string;
    isPublic?: boolean;
  },
) {
  try {
    const totalCalories = data.ingredients.reduce((s, i) => s + i.calories, 0);
    const totalProtein = data.ingredients.reduce((s, i) => s + i.protein, 0);
    const totalCarbs = data.ingredients.reduce((s, i) => s + i.carbs, 0);
    const totalFat = data.ingredients.reduce((s, i) => s + i.fat, 0);

    const recipe = await db.recipe.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        ingredients: JSON.stringify(data.ingredients),
        instructions: data.instructions,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        imageUrl: data.imageUrl,
        isPublic: data.isPublic ?? false,
      },
    });
    revalidatePath("/nutrition/recipes");
    return { success: true, recipe };
  } catch (error) {
    console.error("Create recipe error:", error);
    return { error: "Failed to create recipe" };
  }
}

export async function getRecipes(userId: string, search?: string) {
  try {
    const recipes = await db.recipe.findMany({
      where: {
        OR: [
          { userId },
          { isPublic: true },
        ],
        ...(search ? {
          name: { contains: search },
        } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return recipes.map((r) => ({
      ...r,
      ingredients: JSON.parse(r.ingredients),
    }));
  } catch (error) {
    console.error("Get recipes error:", error);
    return [];
  }
}

export async function getRecipe(id: string) {
  try {
    const recipe = await db.recipe.findUnique({ where: { id } });
    if (!recipe) return null;
    return {
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
    };
  } catch (error) {
    console.error("Get recipe error:", error);
    return null;
  }
}

export async function deleteRecipe(id: string) {
  try {
    await db.recipe.delete({ where: { id } });
    revalidatePath("/nutrition/recipes");
    return { success: true };
  } catch (error) {
    console.error("Delete recipe error:", error);
    return { error: "Failed to delete recipe" };
  }
}

export async function updateRecipe(
  id: string,
  data: {
    name?: string;
    description?: string;
    ingredients?: { name: string; qty: number; unit: string; calories: number; protein: number; carbs: number; fat: number }[];
    instructions?: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    imageUrl?: string;
    isPublic?: boolean;
  },
) {
  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.instructions !== undefined) updateData.instructions = data.instructions;
    if (data.prepTime !== undefined) updateData.prepTime = data.prepTime;
    if (data.cookTime !== undefined) updateData.cookTime = data.cookTime;
    if (data.servings !== undefined) updateData.servings = data.servings;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

    if (data.ingredients) {
      updateData.ingredients = JSON.stringify(data.ingredients);
      updateData.calories = data.ingredients.reduce((s, i) => s + i.calories, 0);
      updateData.protein = data.ingredients.reduce((s, i) => s + i.protein, 0);
      updateData.carbs = data.ingredients.reduce((s, i) => s + i.carbs, 0);
      updateData.fat = data.ingredients.reduce((s, i) => s + i.fat, 0);
    }

    const recipe = await db.recipe.update({ where: { id }, data: updateData });
    revalidatePath("/nutrition/recipes");
    return { success: true, recipe };
  } catch (error) {
    console.error("Update recipe error:", error);
    return { error: "Failed to update recipe" };
  }
}

// === MEAL PLAN ACTIONS ===

export async function createMealPlan(
  userId: string,
  data: {
    name: string;
    weekStart: string;
    days: { date: string; meals: { mealType: MealType; recipeId: string; servings: number }[] }[];
  },
) {
  try {
    const mealPlan = await db.mealPlan.create({
      data: {
        userId,
        name: data.name,
        weekStart: new Date(data.weekStart),
        days: JSON.stringify(data.days),
      },
    });
    revalidatePath("/nutrition/meal-plans");
    return { success: true, mealPlan };
  } catch (error) {
    console.error("Create meal plan error:", error);
    return { error: "Failed to create meal plan" };
  }
}

export async function getMealPlans(userId: string) {
  try {
    const plans = await db.mealPlan.findMany({
      where: { userId },
      orderBy: { weekStart: "desc" },
    });
    return plans.map((p) => ({
      ...p,
      days: JSON.parse(p.days),
    }));
  } catch (error) {
    console.error("Get meal plans error:", error);
    return [];
  }
}

export async function getMealPlan(id: string) {
  try {
    const plan = await db.mealPlan.findUnique({ where: { id } });
    if (!plan) return null;
    const days = JSON.parse(plan.days) as { date: string; meals: { mealType: MealType; recipeId: string; servings: number }[] }[];

    const recipeIds = days.flatMap((d) => d.meals.map((m) => m.recipeId));
    const recipes = await db.recipe.findMany({
      where: { id: { in: recipeIds } },
    });
    const recipeMap = Object.fromEntries(
      recipes.map((r) => [r.id, { ...r, ingredients: JSON.parse(r.ingredients) }]),
    );

    return {
      ...plan,
      days: days.map((d) => ({
        ...d,
        meals: d.meals.map((m) => ({
          ...m,
          recipe: recipeMap[m.recipeId] || null,
        })),
      })),
    };
  } catch (error) {
    console.error("Get meal plan error:", error);
    return null;
  }
}

export async function deleteMealPlan(id: string) {
  try {
    await db.mealPlan.delete({ where: { id } });
    revalidatePath("/nutrition/meal-plans");
    return { success: true };
  } catch (error) {
    console.error("Delete meal plan error:", error);
    return { error: "Failed to delete meal plan" };
  }
}

// === BARCODE ACTIONS ===

const MOCK_BARCODE_DB: Record<string, { name: string; calories: number; protein: number; carbs: number; fat: number; servingSize: string }> = {
  "5901234123457": { name: "Whey Protein Isolate", calories: 120, protein: 25, carbs: 3, fat: 1, servingSize: "1 scoop (30g)" },
  "4012345678901": { name: "Organic Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 2.5, servingSize: "1 packet (40g)" },
  "8712345678902": { name: "Chicken Breast (Raw)", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g" },
  "1234567890123": { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8, servingSize: "1 cup cooked (185g)" },
  "9876543210987": { name: "Mixed Nuts", calories: 170, protein: 5, carbs: 6, fat: 15, servingSize: "1/4 cup (30g)" },
  "5551234567890": { name: "Greek Yogurt Plain", calories: 100, protein: 17, carbs: 6, fat: 0.7, servingSize: "1 container (170g)" },
  "4449876543210": { name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: "1/2 avocado (100g)" },
  "3335678901234": { name: "Sweet Potato", calories: 112, protein: 2, carbs: 26, fat: 0.1, servingSize: "1 medium (150g)" },
};

export async function scanBarcode(barcode: string) {
  try {
    await new Promise((r) => setTimeout(r, 600));
    const item = MOCK_BARCODE_DB[barcode];
    if (!item) {
      return { error: "Product not found in database", item: null };
    }
    return { success: true, item };
  } catch (error) {
    console.error("Barcode scan error:", error);
    return { error: "Failed to scan barcode" };
  }
}

// === MACRO TARGET ACTIONS ===

export async function updateMacroTargets(
  userId: string,
  targets: { dayOfWeek?: number; calories: number; protein: number; carbs: number; fat: number }[],
) {
  try {
    for (const target of targets) {
      await db.macroTarget.upsert({
        where: {
          userId_dayOfWeek: {
            userId,
            dayOfWeek: target.dayOfWeek ?? -1,
          },
        },
        update: {
          calories: target.calories,
          protein: target.protein,
          carbs: target.carbs,
          fat: target.fat,
        },
        create: {
          userId,
          dayOfWeek: target.dayOfWeek ?? null,
          calories: target.calories,
          protein: target.protein,
          carbs: target.carbs,
          fat: target.fat,
        },
      });
    }
    revalidatePath("/nutrition");
    return { success: true };
  } catch (error) {
    console.error("Update macro targets error:", error);
    return { error: "Failed to update macro targets" };
  }
}

export async function getMacroTargets(userId: string) {
  try {
    const targets = await db.macroTarget.findMany({
      where: { userId },
    });
    return targets;
  } catch (error) {
    console.error("Get macro targets error:", error);
    return [];
  }
}


