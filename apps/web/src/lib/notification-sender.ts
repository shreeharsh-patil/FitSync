import "server-only";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

const webpush = require("web-push");

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJLEjX9h8IHEHbw2sMk2cH8U7WqTf4EhH-YkGE";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:support@fitsync.app";

if (VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  data?: Record<string, unknown>;
  actions?: { action: string; title: string }[];
}

export async function sendPushNotification(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: PushNotificationPayload,
) {
  if (!VAPID_PRIVATE_KEY) return { error: "VAPID_PRIVATE_KEY not configured" };

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        ...payload,
        icon: payload.icon || "/icon.png",
        badge: payload.badge || "/badge.png",
        data: { url: payload.url || "/dashboard", ...payload.data },
      }),
    );
    return { success: true };
  } catch (err: any) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      await db.pushSubscription.deleteMany({
        where: { endpoint: subscription.endpoint },
      });
      return { error: "Subscription expired", expired: true };
    }
    return { error: err.message };
  }
}

export async function sendPushToUser(
  userId: string,
  payload: PushNotificationPayload,
) {
  const subscriptions = await db.pushSubscription.findMany({
    where: { userId },
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      ),
    ),
  );

  return {
    sent: results.filter((r) => r.status === "fulfilled" && (r.value as any).success).length,
    failed: results.filter((r) => r.status === "rejected" || !(r.value as any).success).length,
  };
}

export async function sendPushToAllUsers(
  payload: PushNotificationPayload,
) {
  const subscriptions = await db.pushSubscription.findMany();

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      ),
    ),
  );

  return {
    sent: results.filter((r) => r.status === "fulfilled" && (r.value as any).success).length,
    total: subscriptions.length,
  };
}

export async function triggerWorkoutReminder(userId: string, workoutName: string) {
  const payload: PushNotificationPayload = {
    title: "💪 Workout Reminder",
    body: `Time to crush your "${workoutName}" session!`,
    url: "/workout",
    tag: "fitsync-workout-reminder",
    data: { type: "workout_reminder" },
  };
  return sendPushToUser(userId, payload);
}

export async function triggerHydrationReminder(userId: string) {
  const payload: PushNotificationPayload = {
    title: "💧 Hydration Alert",
    body: "Don't forget to hydrate! Log your water intake.",
    url: "/nutrition",
    tag: "fitsync-hydration",
    data: { type: "hydration" },
  };
  return sendPushToUser(userId, payload);
}

export async function triggerAchievementNotification(userId: string, badgeName: string) {
  const payload: PushNotificationPayload = {
    title: "🏆 Achievement Unlocked",
    body: `You earned the "${badgeName}" badge!`,
    url: "/profile",
    tag: "fitsync-achievement",
    data: { type: "achievement" },
  };
  revalidatePath("/");
  return sendPushToUser(userId, payload);
}

export async function triggerWorkoutStreakNotification(userId: string, streakDays: number) {
  const payload: PushNotificationPayload = {
    title: "🔥 Streak Alert",
    body: `You're on a ${streakDays}-day workout streak! Keep it going.`,
    url: "/workout",
    tag: "fitsync-streak",
    data: { type: "streak" },
  };
  return sendPushToUser(userId, payload);
}
