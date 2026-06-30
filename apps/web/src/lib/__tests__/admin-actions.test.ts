import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDb = {
  user: { count: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  subscription: { count: vi.fn(), aggregate: vi.fn(), findMany: vi.fn() },
  exercise: { count: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  blogPost: { count: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  workoutLog: { findMany: vi.fn() },
  nutritionLog: { findMany: vi.fn() },
};

vi.mock("@/lib/db", () => ({ default: mockDb }));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const { auth } = await import("@/auth");

const {
  getAdminStats,
  updateUserRole,
  deleteUser,
  createPost,
  updatePost,
  deletePost,
  createExercise,
  updateExercise,
  deleteExercise,
  getAdminAnalytics,
  getUsers,
  getPosts,
  getExercises,
  getSubscriptions,
  getUserById,
  getUserActivity,
} = await import("@/lib/admin-actions");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getAdminStats", () => {
  it("returns aggregated stats", async () => {
    mockDb.user.count.mockResolvedValue(100);
    mockDb.subscription.count.mockResolvedValue(25);
    mockDb.exercise.count.mockResolvedValue(50);
    mockDb.blogPost.count.mockResolvedValue(30);
    mockDb.subscription.aggregate.mockResolvedValue({ _sum: { id: false } });
    mockDb.subscription.findMany.mockResolvedValue(
      Array.from({ length: 25 }, (_, i) => ({ id: `sub${i + 1}`, status: "ACTIVE" })),
    );
    mockDb.user.findMany.mockResolvedValue([
      { id: "1", name: "Test", email: "test@test.com", role: "USER", image: null, createdAt: new Date() },
    ]);
    mockDb.user.count.mockResolvedValue(100);

    const stats = await getAdminStats();
    expect(stats.totalUsers).toBe(100);
    expect(stats.activeSubscriptions).toBe(25);
    expect(stats.totalExercises).toBe(50);
    expect(stats.totalPosts).toBe(30);
    expect(stats.monthlyRevenue).toBe(25 * 29.99);
    expect(stats.recentUsers).toHaveLength(1);
  });

  it("returns zeros on error", async () => {
    mockDb.user.count.mockRejectedValue(new Error("DB error"));
    const stats = await getAdminStats();
    expect(stats.totalUsers).toBe(0);
  });
});

describe("updateUserRole", () => {
  it("updates user role successfully", async () => {
    const result = await updateUserRole("user1", "ADMIN");
    expect(result.success).toBe("User role updated");
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: "user1" },
      data: { role: "ADMIN" },
    });
  });

  it("returns error for invalid role", async () => {
    const result = await updateUserRole("user1", "INVALID" as any);
    expect(result.error).toBe("Invalid role");
  });
});

describe("deleteUser", () => {
  it("deletes user successfully", async () => {
    mockDb.user.delete.mockResolvedValue({ id: "user1" });
    const result = await deleteUser("user1");
    expect(result.success).toBe("User deleted");
  });
});

describe("createPost", () => {
  it("creates a post when authenticated", async () => {
    (auth as any).mockResolvedValue({ user: { id: "admin1" } });
    mockDb.blogPost.create.mockResolvedValue({ id: "post1" });

    const result = await createPost({
      title: "Test Post",
      slug: "test-post",
      excerpt: "An excerpt",
      content: "Full content",
      category: "Wellness",
    });

    expect(result.success).toBe("Post created");
    expect(result.id).toBe("post1");
    expect(mockDb.blogPost.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ authorId: "admin1", title: "Test Post" }),
    });
  });

  it("returns error when unauthenticated", async () => {
    (auth as any).mockResolvedValue(null);
    const result = await createPost({
      title: "Test",
      slug: "test",
      excerpt: "Excerpt",
      content: "Content",
      category: "Wellness",
    });
    expect(result.error).toBe("Unauthorized");
  });

  it("returns error for invalid fields", async () => {
    (auth as any).mockResolvedValue({ user: { id: "admin1" } });
    const result = await createPost({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
    });
    expect(result.error).toContain("Invalid fields");
  });
});

describe("createExercise", () => {
  it("creates exercise successfully", async () => {
    mockDb.exercise.create.mockResolvedValue({ id: "ex1" });
    const result = await createExercise({
      name: "Push-up",
      category: "STRENGTH",
      muscleGroups: "Chest",
      equipment: "Bodyweight",
      instructions: "Do it",
      difficulty: "BEGINNER",
    });
    expect(result.success).toBe("Exercise created");
    expect(result.id).toBe("ex1");
  });

  it("returns error for invalid fields", async () => {
    const result = await createExercise({ name: "", category: "STRENGTH", muscleGroups: "", equipment: "", instructions: "", difficulty: "BEGINNER" });
    expect(result.error).toBe("Invalid fields");
  });
});

describe("getUsers", () => {
  it("returns paginated users", async () => {
    mockDb.user.findMany.mockResolvedValue([{ id: "1", name: "User", email: "u@test.com", role: "USER", image: null, createdAt: new Date(), _count: { subscriptions: 0, workoutLogs: 0, blogPosts: 0 } }]);
    mockDb.user.count.mockResolvedValue(1);
    const result = await getUsers(1, "", "ALL");
    expect(result.users).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it("returns empty on error", async () => {
    mockDb.user.findMany.mockRejectedValue(new Error("error"));
    const result = await getUsers(1, "", "ALL");
    expect(result.users).toEqual([]);
  });
});

describe("getPosts", () => {
  it("returns paginated posts", async () => {
    mockDb.blogPost.findMany.mockResolvedValue([{ id: "p1", title: "Post", slug: "post", status: "PUBLISHED", author: { id: "1", name: "Author" } }]);
    mockDb.blogPost.count.mockResolvedValue(1);
    const result = await getPosts(1, "ALL");
    expect(result.posts).toHaveLength(1);
  });
});

describe("getExercises", () => {
  it("searches exercises by name", async () => {
    mockDb.exercise.findMany.mockResolvedValue([{ id: "ex1", name: "Push-up", category: "STRENGTH", difficulty: "BEGINNER" }]);
    mockDb.exercise.count.mockResolvedValue(1);
    const result = await getExercises(1, "push", "ALL");
    expect(result.exercises).toHaveLength(1);
  });
});

describe("getSubscriptions", () => {
  it("returns paginated subscriptions", async () => {
    mockDb.subscription.findMany.mockResolvedValue([{ id: "s1", plan: "PREMIUM", status: "ACTIVE", currentPeriodEnd: new Date(), createdAt: new Date(), userId: "u1", user: { id: "u1", name: "User", email: "u@t.com" } }]);
    mockDb.subscription.count.mockResolvedValue(1);
    const result = await getSubscriptions(1, "ALL");
    expect(result.subscriptions).toHaveLength(1);
  });
});

describe("getUserById", () => {
  it("returns user with related counts", async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: "u1", name: "User", _count: { subscriptions: 1, workoutLogs: 2, blogPosts: 0, nutritionLogs: 0, progressEntries: 0 }, subscriptions: [] });
    const result = await getUserById("u1");
    expect(result?.id).toBe("u1");
  });

  it("returns null on error", async () => {
    mockDb.user.findUnique.mockRejectedValue(new Error("error"));
    const result = await getUserById("u1");
    expect(result).toBeNull();
  });
});

describe("getUserActivity", () => {
  it("returns user activity", async () => {
    mockDb.workoutLog.findMany.mockResolvedValue([{ id: "wl1", logDate: new Date(), durationMins: 45, caloriesBurned: 300 }]);
    mockDb.nutritionLog.findMany.mockResolvedValue([]);
    mockDb.blogPost.findMany.mockResolvedValue([]);
    const result = await getUserActivity("u1");
    expect(result.workoutLogs).toHaveLength(1);
    expect(result.nutritionLogs).toEqual([]);
  });
});

describe("getAdminAnalytics", () => {
  it("returns monthly analytics data", async () => {
    mockDb.user.findMany.mockResolvedValue([{ createdAt: new Date() }]);
    mockDb.subscription.findMany.mockResolvedValue([{ createdAt: new Date(), plan: "PREMIUM" }]);
    mockDb.workoutLog.findMany.mockResolvedValue([{ logDate: new Date(), durationMins: 30 }]);
    mockDb.blogPost.findMany.mockResolvedValue([{ createdAt: new Date() }]);

    const result = await getAdminAnalytics();
    expect(result.labels.length).toBeGreaterThan(0);
    expect(result.users.length).toBeGreaterThan(0);
  });
});
