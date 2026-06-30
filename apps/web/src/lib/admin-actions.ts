"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";

export async function getAdminStats() {
  try {
    const [
      totalUsers,
      activeSubscriptions,
      totalExercises,
      totalPosts,
      totalRevenue,
      recentUsers,
    ] = await Promise.all([
      db.user.count(),
      db.subscription.count({ where: { status: "ACTIVE" } }),
      db.exercise.count(),
      db.blogPost.count(),
      db.subscription.aggregate({
        _count: true,
        where: { status: "ACTIVE" },
      }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
        },
      }),
    ]);

    const subscriptions = await db.subscription.findMany({
      where: { status: "ACTIVE" },
    });
    const monthlyRevenue = subscriptions.length * 29.99;
    const totalSubRevenue = subscriptions.length * 29.99;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await db.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    return {
      totalUsers,
      activeSubscriptions,
      totalExercises,
      totalPosts: totalPosts,
      monthlyRevenue,
      totalSubRevenue,
      newUsers,
      recentUsers: JSON.parse(JSON.stringify(recentUsers)),
    };
  } catch (error) {
    console.error("getAdminStats error:", error);
    return {
      totalUsers: 0,
      activeSubscriptions: 0,
      totalExercises: 0,
      totalPosts: 0,
      monthlyRevenue: 0,
      totalSubRevenue: 0,
      newUsers: 0,
      recentUsers: [],
    };
  }
}

const UpdateRoleSchema = z.object({
  role: z.enum(["USER", "TRAINER", "ADMIN", "SUPER_ADMIN"]),
});

export async function updateUserRole(userId: string, role: string) {
  try {
    const validated = UpdateRoleSchema.safeParse({ role });
    if (!validated.success) {
      return { error: "Invalid role" };
    }

    await db.user.update({
      where: { id: userId },
      data: { role: validated.data.role as any },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/users/" + userId);
    return { success: "User role updated" };
  } catch (error) {
    console.error("updateUserRole error:", error);
    return { error: "Failed to update role" };
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.user.delete({ where: { id: userId } });
    revalidatePath("/admin/users");
    return { success: "User deleted" };
  } catch (error) {
    console.error("deleteUser error:", error);
    return { error: "Failed to delete user" };
  }
}

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  featuredImageUrl: z.string().optional(),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  readingTimeMins: z.number().optional(),
});

export async function createPost(data: z.infer<typeof PostSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validated = PostSchema.safeParse(data);
    if (!validated.success) {
      return { error: "Invalid fields: " + JSON.stringify(validated.error.flatten().fieldErrors) };
    }

    const post = await db.blogPost.create({
      data: {
        authorId: session.user.id,
        title: validated.data.title,
        slug: validated.data.slug,
        excerpt: validated.data.excerpt,
        content: validated.data.content,
        category: validated.data.category,
        featuredImageUrl: validated.data.featuredImageUrl,
        tags: validated.data.tags,
        metaTitle: validated.data.metaTitle,
        metaDescription: validated.data.metaDescription,
        status: (validated.data.status as any) || "DRAFT",
        readingTimeMins: validated.data.readingTimeMins,
        publishedAt: validated.data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/blog");
    return { success: "Post created", id: post.id };
  } catch (error) {
    console.error("createPost error:", error);
    return { error: "Failed to create post" };
  }
}

export async function updatePost(id: string, data: z.infer<typeof PostSchema>) {
  try {
    const validated = PostSchema.safeParse(data);
    if (!validated.success) {
      return { error: "Invalid fields" };
    }

    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) return { error: "Post not found" };

    const updateData: any = { ...validated.data };
    if (validated.data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    await db.blogPost.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/admin/blog/" + id + "/edit");
    return { success: "Post updated" };
  } catch (error) {
    console.error("updatePost error:", error);
    return { error: "Failed to update post" };
  }
}

export async function deletePost(id: string) {
  try {
    await db.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blog");
    return { success: "Post deleted" };
  } catch (error) {
    console.error("deletePost error:", error);
    return { error: "Failed to delete post" };
  }
}

const ExerciseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["STRENGTH", "CARDIO", "FLEXIBILITY", "BALANCE"]),
  muscleGroups: z.string().min(1, "Muscle groups is required"),
  equipment: z.string().min(1, "Equipment is required"),
  instructions: z.string().min(1, "Instructions is required"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  videoUrl: z.string().optional(),
  gifUrl: z.string().optional(),
});

export async function createExercise(data: z.infer<typeof ExerciseSchema>) {
  try {
    const validated = ExerciseSchema.safeParse(data);
    if (!validated.success) {
      return { error: "Invalid fields" };
    }

    const exercise = await db.exercise.create({
      data: validated.data,
    });

    revalidatePath("/admin/exercises");
    return { success: "Exercise created", id: exercise.id };
  } catch (error) {
    console.error("createExercise error:", error);
    return { error: "Failed to create exercise" };
  }
}

export async function updateExercise(id: string, data: z.infer<typeof ExerciseSchema>) {
  try {
    const validated = ExerciseSchema.safeParse(data);
    if (!validated.success) {
      return { error: "Invalid fields" };
    }

    await db.exercise.update({
      where: { id },
      data: validated.data,
    });

    revalidatePath("/admin/exercises");
    return { success: "Exercise updated" };
  } catch (error) {
    console.error("updateExercise error:", error);
    return { error: "Failed to update exercise" };
  }
}

export async function deleteExercise(id: string) {
  try {
    await db.exercise.delete({ where: { id } });
    revalidatePath("/admin/exercises");
    return { success: "Exercise deleted" };
  } catch (error) {
    console.error("deleteExercise error:", error);
    return { error: "Failed to delete exercise" };
  }
}

export async function getAdminAnalytics() {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const users = await db.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const subscriptions = await db.subscription.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, plan: true },
    });

    const workoutLogs = await db.workoutLog.findMany({
      where: { logDate: { gte: sixMonthsAgo } },
      select: { logDate: true, durationMins: true },
    });

    const posts = await db.blogPost.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const monthlyData: Record<string, { users: number; revenue: number; workouts: number; posts: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyData[key] = { users: 0, revenue: 0, workouts: 0, posts: 0 };
    }

    for (const u of users) {
      const d = new Date(u.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyData[key]) monthlyData[key].users++;
    }

    for (const s of subscriptions) {
      const d = new Date(s.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyData[key]) monthlyData[key].revenue += 29.99;
    }

    for (const w of workoutLogs) {
      const d = new Date(w.logDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyData[key]) monthlyData[key].workouts++;
    }

    for (const p of posts) {
      const d = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyData[key]) monthlyData[key].posts++;
    }

    const months = Object.keys(monthlyData).sort();
    const labels = months.map((m) => {
      const [y, mo] = m.split("-");
      const date = new Date(parseInt(y), parseInt(mo) - 1);
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    });

    return {
      labels,
      users: months.map((m) => monthlyData[m].users),
      revenue: months.map((m) => monthlyData[m].revenue),
      workouts: months.map((m) => monthlyData[m].workouts),
      posts: months.map((m) => monthlyData[m].posts),
    };
  } catch (error) {
    console.error("getAdminAnalytics error:", error);
    return { labels: [], users: [], revenue: [], workouts: [], posts: [] };
  }
}

export async function getUsers(
  page: number = 1,
  search: string = "",
  role?: string,
  status?: string
) {
  const pageSize = 20;
  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role && role !== "ALL") {
      where.role = role as any;
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              subscriptions: true,
              workoutLogs: true,
              blogPosts: true,
            },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    return {
      users: JSON.parse(JSON.stringify(users)),
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("getUsers error:", error);
    return { users: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getPosts(page: number = 1, status?: string) {
  const pageSize = 20;
  try {
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status as any;
    }

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      }),
      db.blogPost.count({ where }),
    ]);

    return {
      posts: JSON.parse(JSON.stringify(posts)),
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("getPosts error:", error);
    return { posts: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getExercises(page: number = 1, search: string = "", category?: string) {
  const pageSize = 20;
  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { muscleGroups: { contains: search } },
      ];
    }
    if (category && category !== "ALL") {
      where.category = category as any;
    }

    const [exercises, total] = await Promise.all([
      db.exercise.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      db.exercise.count({ where }),
    ]);

    return {
      exercises: JSON.parse(JSON.stringify(exercises)),
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("getExercises error:", error);
    return { exercises: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getSubscriptions(page: number = 1, status?: string) {
  const pageSize = 20;
  try {
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const [subscriptions, total] = await Promise.all([
      db.subscription.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      db.subscription.count({ where }),
    ]);

    return {
      subscriptions: JSON.parse(JSON.stringify(subscriptions)),
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("getSubscriptions error:", error);
    return { subscriptions: [], total: 0, page: 1, totalPages: 0 };
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            subscriptions: true,
            workoutLogs: true,
            blogPosts: true,
            nutritionLogs: true,
            progressEntries: true,
          },
        },
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("getUserById error:", error);
    return null;
  }
}

export async function getUserActivity(userId: string) {
  try {
    const [workoutLogs, nutritionLogs, posts] = await Promise.all([
      db.workoutLog.findMany({
        where: { userId },
        orderBy: { logDate: "desc" },
        take: 20,
        select: { id: true, logDate: true, durationMins: true, caloriesBurned: true },
      }),
      db.nutritionLog.findMany({
        where: { userId },
        orderBy: { logDate: "desc" },
        take: 20,
        select: { id: true, logDate: true, mealType: true, totalCalories: true },
      }),
      db.blogPost.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, title: true, status: true, createdAt: true },
      }),
    ]);

    return {
      workoutLogs: JSON.parse(JSON.stringify(workoutLogs)),
      nutritionLogs: JSON.parse(JSON.stringify(nutritionLogs)),
      posts: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error) {
    console.error("getUserActivity error:", error);
    return { workoutLogs: [], nutritionLogs: [], posts: [] };
  }
}
