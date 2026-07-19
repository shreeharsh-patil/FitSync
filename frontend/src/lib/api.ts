const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, signal } = options;

  const token = typeof window !== "undefined" ? localStorage.getItem("fitsync_token") : null;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    signal,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const json = await res.json();

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("fitsync_token");
      window.location.href = "/login";
    }
    throw new Error(json.error || "An error occurred");
  }

  return json.data;
}

// ─── Auth API ───
export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    request<{ token: string; user: any }>("/auth/signup", { method: "POST", body: data }),
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: any }>("/auth/login", { method: "POST", body: data }),
  me: () => request<any>("/auth/me"),
};

// ─── User API ───
export const userApi = {
  getProfile: () => request<any>("/users/me"),
  updateProfile: (data: any) => request<any>("/users/me", { method: "PUT", body: data }),
  updateIntegrations: (integration: string, enabled: boolean) =>
    request<any>("/users/integrations", { method: "PUT", body: { integration, enabled } }),
};

// ─── Workout API ───
export const workoutApi = {
  list: (params?: { page?: number; limit?: number }) =>
    request<any[]>(`/workouts?${new URLSearchParams(params as any)}`),
  create: (data: any) => request<any>("/workouts", { method: "POST", body: data }),
};

// ─── Nutrition API ───
export const nutritionApi = {
  list: (date?: string, signal?: AbortSignal) =>
    request<{ meals: any[]; dailyTotals: any }>(`/nutrition${date ? `?date=${date}` : ""}`, { signal }),
  create: (data: any) => request<any>("/nutrition", { method: "POST", body: data }),
};

// ─── Posts API ───
export const postApi = {
  list: () => request<any[]>("/posts"),
  create: (content: string) => request<any>("/posts", { method: "POST", body: { content } }),
  like: (id: string) => request<{ likes: number; liked: boolean }>(`/posts/${id}/like`, { method: "POST" }),
  comment: (id: string, content: string) =>
    request<any>(`/posts/${id}/comment`, { method: "POST", body: { content } }),
};

// ─── Challenges API ───
export const challengeApi = {
  list: () => request<any[]>("/challenges"),
  join: (challengeId: string) =>
    request<any>("/challenges", { method: "POST", body: { challengeId } }),
  create: (data: any) => request<any>("/challenges", { method: "POST", body: data }),
};

// ─── Progress API ───
export const progressApi = {
  list: (limit?: number) => request<{ entries: any[]; stats: any }>(`/progress?limit=${limit || 50}`),
  create: (data: any) => request<any>("/progress", { method: "POST", body: data }),
};

// ─── Dashboard API ───
export const dashboardApi = {
  get: () => request<any>("/dashboard"),
};

// ─── AI Coach API ───
export const aiCoachApi = {
  chat: (message: string) =>
    request<{ response: string; context: string }>("/ai-coach", { method: "POST", body: { message } }),
};

// ─── Leaderboard API ───
export const leaderboardApi = {
  list: () => request<any[]>("/leaderboard"),
};
