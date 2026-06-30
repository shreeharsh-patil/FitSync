type HealthDataType = "STEPS" | "HEART_RATE" | "SLEEP" | "CALORIES" | "WORKOUT" | "WEIGHT";

interface NormalizedDataPoint {
  source: string;
  dataType: HealthDataType;
  value: number;
  unit: string;
  startTime: Date;
  endTime?: Date;
  metadata?: Record<string, unknown>;
}

interface IntegrationProvider {
  name: string;
  displayName: string;
  connect(): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date }>;
  disconnect(): Promise<void>;
  syncData(since: Date): Promise<NormalizedDataPoint[]>;
  refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date }>;
}

const APPLE_HEALTH_CLIENT_ID = process.env.APPLE_HEALTH_CLIENT_ID || "";
const GOOGLE_FIT_CLIENT_ID = process.env.GOOGLE_FIT_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID || "";
const GARMIN_CLIENT_ID = process.env.GARMIN_CLIENT_ID || "";
const WHOOP_CLIENT_ID = process.env.WHOOP_CLIENT_ID || "";

async function fetchFromApi(url: string, headers: Record<string, string>): Promise<any> {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`API returned ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

const appleHealthProvider: IntegrationProvider = {
  name: "APPLE_HEALTH",
  displayName: "Apple Health",

  async connect() {
    if (!APPLE_HEALTH_CLIENT_ID) {
      throw new Error("Apple Health integration requires APPLE_HEALTH_CLIENT_ID environment variable");
    }
    throw new Error("Apple Health uses iOS HealthKit API — requires a native iOS app. Sync from iPhone via FitSync mobile app.");
  },

  async disconnect() {},

  async syncData(since: Date) {
    throw new Error("Apple Health sync requires the FitSync iOS app. Configure APPLE_HEALTH_CLIENT_ID and use the mobile client.");
  },

  async refreshToken() {
    throw new Error("Apple Health does not support server-side token refresh.");
  },
};

const googleFitProvider: IntegrationProvider = {
  name: "GOOGLE_FIT",
  displayName: "Google Fit",

  async connect() {
    if (!GOOGLE_FIT_CLIENT_ID) {
      throw new Error("Google Fit requires GOOGLE_FIT_CLIENT_ID environment variable. Set up OAuth 2.0 credentials in Google Cloud Console.");
    }
    return {
      accessToken: "",
      refreshToken: "",
      expiresAt: new Date(Date.now() + 3600000),
    };
  },

  async disconnect() {},

  async syncData(since: Date) {
    if (!GOOGLE_FIT_CLIENT_ID) {
      throw new Error("Google Fit requires GOOGLE_FIT_CLIENT_ID. Configure it in your environment variables.");
    }
    const accessToken = process.env.GOOGLE_FIT_ACCESS_TOKEN || "";
    if (!accessToken) {
      throw new Error("No Google Fit access token. Connect your Google account first.");
    }

    const data: NormalizedDataPoint[] = [];
    const endTime = new Date();
    const startTimeMs = since.getTime();
    const endTimeMs = endTime.getTime();

    try {
      const datasets = await fetchFromApi(
        `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
        {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      );

      if (datasets.bucket) {
        for (const bucket of datasets.bucket) {
          for (const ds of bucket.dataset) {
            for (const point of ds.point || []) {
              const dataType = ds.dataSourceId?.includes("step_count") ? "STEPS" :
                ds.dataSourceId?.includes("heart_rate") ? "HEART_RATE" :
                ds.dataSourceId?.includes("calories") ? "CALORIES" : null;
              if (dataType && point.value?.[0]) {
                data.push({
                  source: "GOOGLE_FIT",
                  dataType,
                  value: parseFloat(point.value[0].fpVal || point.value[0].intVal),
                  unit: dataType === "STEPS" ? "steps" : dataType === "HEART_RATE" ? "bpm" : "kcal",
                  startTime: new Date(parseInt(point.startTimeNanos) / 1000000),
                  endTime: new Date(parseInt(point.endTimeNanos) / 1000000),
                });
              }
            }
          }
        }
      }
    } catch {
      throw new Error("Failed to fetch Google Fit data. Check that your OAuth token has the fitness fitness.activity.read scope.");
    }

    return data;
  },

  async refreshToken() {
    throw new Error("Google Fit token refresh requires server-side OAuth client secret. Implement a refresh route with your GOOGLE_FIT_CLIENT_SECRET.");
  },
};

const fitbitProvider: IntegrationProvider = {
  name: "FITBIT",
  displayName: "Fitbit",

  async connect() {
    if (!FITBIT_CLIENT_ID) {
      throw new Error("Fitbit requires FITBIT_CLIENT_ID. Register an app at dev.fitbit.com.");
    }
    return {
      accessToken: "",
      refreshToken: "",
      expiresAt: new Date(Date.now() + 28800000),
    };
  },

  async disconnect() {},

  async syncData(since: Date) {
    if (!FITBIT_CLIENT_ID) {
      throw new Error("Fitbit requires FITBIT_CLIENT_ID. Configure it in your environment variables.");
    }
    const accessToken = process.env.FITBIT_ACCESS_TOKEN || "";
    if (!accessToken) {
      throw new Error("No Fitbit access token. Connect your Fitbit account first.");
    }

    const data: NormalizedDataPoint[] = [];
    const today = new Date().toISOString().split("T")[0];
    const baseDate = since.toISOString().split("T")[0];

    try {
      const [activities, sleep, heartRate] = await Promise.all([
        fetchFromApi(
          `https://api.fitbit.com/1/user/-/activities/steps/date/${baseDate}/${today}.json`,
          { Authorization: `Bearer ${accessToken}` }
        ),
        fetchFromApi(
          `https://api.fitbit.com/1.2/user/-/sleep/date/${baseDate}/${today}.json`,
          { Authorization: `Bearer ${accessToken}` }
        ),
        fetchFromApi(
          `https://api.fitbit.com/1/user/-/activities/heart/date/${today}/1d/1sec.json`,
          { Authorization: `Bearer ${accessToken}` }
        ).catch(() => null),
      ]);

      for (const day of activities?.["activities-steps"] || []) {
        data.push({
          source: "FITBIT",
          dataType: "STEPS",
          value: parseInt(day.value) || 0,
          unit: "steps",
          startTime: new Date(day.dateTime),
        });
      }

      for (const day of sleep?.sleep || []) {
        data.push({
          source: "FITBIT",
          dataType: "SLEEP",
          value: Math.round((day.minutesAsleep || 0) + (day.minutesRestless || 0)),
          unit: "minutes",
          startTime: new Date(day.startTime),
          endTime: new Date(day.endTime),
          metadata: { efficiency: day.efficiency, timeAwake: day.minutesAwake },
        });
      }
    } catch {
      throw new Error("Failed to fetch Fitbit data. Ensure your access token has the appropriate scopes (activity, sleep, heartrate).");
    }

    return data;
  },

  async refreshToken() {
    throw new Error("Fitbit token refresh requires FITBIT_CLIENT_SECRET. Implement a server-side OAuth refresh route.");
  },
};

const garminProvider: IntegrationProvider = {
  name: "GARMIN",
  displayName: "Garmin",

  async connect() {
    if (!GARMIN_CLIENT_ID) {
      throw new Error("Garmin requires GARMIN_CLIENT_ID. Register an app at developer.garmin.com.");
    }
    return {
      accessToken: "",
      refreshToken: "",
      expiresAt: new Date(Date.now() + 3600000),
    };
  },

  async disconnect() {},

  async syncData(since: Date) {
    if (!GARMIN_CLIENT_ID) {
      throw new Error("Garmin requires GARMIN_CLIENT_ID. Configure it in your environment variables.");
    }
    const accessToken = process.env.GARMIN_ACCESS_TOKEN || "";
    if (!accessToken) {
      throw new Error("No Garmin access token. Connect your Garmin account first.");
    }

    const data: NormalizedDataPoint[] = [];
    const uploadDate = new Date().toISOString().split("T")[0];

    try {
      const activities = await fetchFromApi(
        `https://apis.garmin.com/wellness-api/rest/activities?uploadDate=${uploadDate}`,
        { Authorization: `Bearer ${accessToken}` }
      );

      for (const activity of activities || []) {
        data.push({
          source: "GARMIN",
          dataType: "WORKOUT",
          value: activity.durationInMinutes || 0,
          unit: "minutes",
          startTime: new Date(activity.startTimeInSeconds * 1000),
          endTime: new Date((activity.startTimeInSeconds + (activity.durationInMinutes || 0) * 60) * 1000),
          metadata: {
            type: activity.activityType || "Unknown",
            distance: activity.distanceInMeters ? activity.distanceInMeters / 1000 : undefined,
            caloriesBurned: activity.calories,
          },
        });
      }
    } catch {
      throw new Error("Failed to fetch Garmin data. Verify your Garmin Developer API credentials and scopes.");
    }

    return data;
  },

  async refreshToken() {
    throw new Error("Garmin token refresh requires GARMIN_CLIENT_SECRET. Implement a server-side OAuth refresh route.");
  },
};

const whoopProvider: IntegrationProvider = {
  name: "WHOOP",
  displayName: "Whoop",

  async connect() {
    if (!WHOOP_CLIENT_ID) {
      throw new Error("Whoop requires WHOOP_CLIENT_ID. Register an app at developer.whoop.com.");
    }
    return {
      accessToken: "",
      refreshToken: "",
      expiresAt: new Date(Date.now() + 86400000),
    };
  },

  async disconnect() {},

  async syncData(since: Date) {
    if (!WHOOP_CLIENT_ID) {
      throw new Error("Whoop requires WHOOP_CLIENT_ID. Configure it in your environment variables.");
    }
    const accessToken = process.env.WHOOP_ACCESS_TOKEN || "";
    if (!accessToken) {
      throw new Error("No Whoop access token. Connect your Whoop account first.");
    }

    const data: NormalizedDataPoint[] = [];
    const start = since.toISOString();
    const end = new Date().toISOString();

    try {
      const [cycles, recovery] = await Promise.all([
        fetchFromApi(
          `https://api.prod.whoop.com/developer/v1/cycle?start=${start}&end=${end}&limit=25`,
          { Authorization: `Bearer ${accessToken}` }
        ),
        fetchFromApi(
          `https://api.prod.whoop.com/developer/v1/recovery?start=${start}&end=${end}&limit=25`,
          { Authorization: `Bearer ${accessToken}` }
        ),
      ]);

      for (const cycle of cycles?.records || []) {
        data.push({
          source: "WHOOP",
          dataType: "SLEEP",
          value: Math.round((cycle.sleepMeasurement?.totalSleepDurationMs || 0) / 60000),
          unit: "minutes",
          startTime: new Date(cycle.start),
          endTime: new Date(cycle.end),
          metadata: {
            sleepScore: cycle.score?.sleepScore?.score,
            recovery: cycle.score?.recoveryScore?.score,
            strain: cycle.score?.strainScore?.strain,
          },
        });
      }

      for (const rec of recovery?.records || []) {
        data.push({
          source: "WHOOP",
          dataType: "HEART_RATE",
          value: rec.score?.restingHeartRate || 0,
          unit: "bpm",
          startTime: new Date(rec.createdAt),
          metadata: { hrv: rec.score?.hrv },
        });
      }
    } catch {
      throw new Error("Failed to fetch Whoop data. Verify your Whoop API credentials and scopes.");
    }

    return data;
  },

  async refreshToken() {
    throw new Error("Whoop token refresh requires WHOOP_CLIENT_SECRET. Implement a server-side OAuth refresh route.");
  },
};

export const providers: Record<string, IntegrationProvider> = {
  APPLE_HEALTH: appleHealthProvider,
  GOOGLE_FIT: googleFitProvider,
  FITBIT: fitbitProvider,
  GARMIN: garminProvider,
  WHOOP: whoopProvider,
};

export function getProvider(name: string): IntegrationProvider | undefined {
  return providers[name];
}

export type { NormalizedDataPoint, HealthDataType, IntegrationProvider };
