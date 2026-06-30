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

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hoursAgo(hours: number): Date {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
}

const appleHealthProvider: IntegrationProvider = {
  name: "APPLE_HEALTH",
  displayName: "Apple Health",

  async connect() {
    await new Promise((r) => setTimeout(r, 800));
    return {
      accessToken: "mock_ah_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_ah_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
  },

  async disconnect() {
    await new Promise((r) => setTimeout(r, 300));
  },

  async syncData(since: Date) {
    await new Promise((r) => setTimeout(r, 1200));
    const data: NormalizedDataPoint[] = [];
    const now = new Date();

    for (let d = new Date(since); d < now; d.setDate(d.getDate() + 1)) {
      data.push({
        source: "APPLE_HEALTH",
        dataType: "STEPS",
        value: randomBetween(5000, 15000),
        unit: "steps",
        startTime: new Date(d),
        endTime: new Date(d.setHours(23, 59, 59)),
      });
      data.push({
        source: "APPLE_HEALTH",
        dataType: "HEART_RATE",
        value: randomBetween(60, 80),
        unit: "bpm",
        startTime: new Date(d),
      });
      data.push({
        source: "APPLE_HEALTH",
        dataType: "CALORIES",
        value: randomBetween(1800, 2800),
        unit: "kcal",
        startTime: new Date(d),
        endTime: new Date(d.setHours(23, 59, 59)),
      });
      data.push({
        source: "APPLE_HEALTH",
        dataType: "SLEEP",
        value: randomBetween(360, 540),
        unit: "minutes",
        startTime: new Date(d),
        endTime: new Date(d.setHours(8, 0, 0)),
        metadata: { deepSleep: randomBetween(60, 120), remSleep: randomBetween(60, 100) },
      });
      data.push({
        source: "APPLE_HEALTH",
        dataType: "WEIGHT",
        value: 70 + Math.random() * 5,
        unit: "kg",
        startTime: new Date(d),
      });
      if (Math.random() > 0.6) {
        data.push({
          source: "APPLE_HEALTH",
          dataType: "WORKOUT",
          value: randomBetween(30, 90),
          unit: "minutes",
          startTime: hoursAgo(randomBetween(1, 48)),
          endTime: hoursAgo(randomBetween(0, 1)),
          metadata: { type: "Running", caloriesBurned: randomBetween(200, 600) },
        });
      }
    }
    return data;
  },

  async refreshToken() {
    return {
      accessToken: "mock_ah_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_ah_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
  },
};

const googleFitProvider: IntegrationProvider = {
  name: "GOOGLE_FIT",
  displayName: "Google Fit",

  async connect() {
    await new Promise((r) => setTimeout(r, 700));
    return {
      accessToken: "mock_gf_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_gf_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
  },

  async disconnect() {
    await new Promise((r) => setTimeout(r, 300));
  },

  async syncData(since: Date) {
    await new Promise((r) => setTimeout(r, 1000));
    const data: NormalizedDataPoint[] = [];
    const now = new Date();

    for (let d = new Date(since); d < now; d.setDate(d.getDate() + 1)) {
      data.push({
        source: "GOOGLE_FIT",
        dataType: "STEPS",
        value: randomBetween(6000, 18000),
        unit: "steps",
        startTime: new Date(d),
        endTime: new Date(d.setHours(23, 59, 59)),
      });
      data.push({
        source: "GOOGLE_FIT",
        dataType: "HEART_RATE",
        value: randomBetween(58, 85),
        unit: "bpm",
        startTime: new Date(d),
      });
      data.push({
        source: "GOOGLE_FIT",
        dataType: "CALORIES",
        value: randomBetween(1900, 3000),
        unit: "kcal",
        startTime: new Date(d),
        endTime: new Date(d.setHours(23, 59, 59)),
      });
      if (Math.random() > 0.5) {
        data.push({
          source: "GOOGLE_FIT",
          dataType: "WORKOUT",
          value: randomBetween(20, 120),
          unit: "minutes",
          startTime: hoursAgo(randomBetween(1, 72)),
          endTime: hoursAgo(randomBetween(0, 2)),
          metadata: { type: "Walking", caloriesBurned: randomBetween(100, 400) },
        });
      }
    }
    return data;
  },

  async refreshToken() {
    return {
      accessToken: "mock_gf_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_gf_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
  },
};

const fitbitProvider: IntegrationProvider = {
  name: "FITBIT",
  displayName: "Fitbit",

  async connect() {
    await new Promise((r) => setTimeout(r, 900));
    return {
      accessToken: "mock_fb_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_fb_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
  },

  async disconnect() {
    await new Promise((r) => setTimeout(r, 300));
  },

  async syncData(since: Date) {
    await new Promise((r) => setTimeout(r, 1500));
    const data: NormalizedDataPoint[] = [];
    const now = new Date();

    for (let d = new Date(since); d < now; d.setDate(d.getDate() + 1)) {
      data.push({
        source: "FITBIT",
        dataType: "STEPS",
        value: randomBetween(7000, 20000),
        unit: "steps",
        startTime: new Date(d),
        endTime: new Date(d.setHours(23, 59, 59)),
      });
      data.push({
        source: "FITBIT",
        dataType: "HEART_RATE",
        value: randomBetween(55, 90),
        unit: "bpm",
        startTime: new Date(d),
        metadata: { resting: randomBetween(55, 65), max: randomBetween(160, 190) },
      });
      data.push({
        source: "FITBIT",
        dataType: "SLEEP",
        value: randomBetween(300, 600),
        unit: "minutes",
        startTime: new Date(d),
        endTime: new Date(d.setHours(8, 30, 0)),
        metadata: { efficiency: randomBetween(80, 95), timeAwake: randomBetween(5, 30) },
      });
      data.push({
        source: "FITBIT",
        dataType: "CALORIES",
        value: randomBetween(1700, 2900),
        unit: "kcal",
        startTime: new Date(d),
        endTime: new Date(d.setHours(23, 59, 59)),
      });
    }
    return data;
  },

  async refreshToken() {
    return {
      accessToken: "mock_fb_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_fb_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
  },
};

const garminProvider: IntegrationProvider = {
  name: "GARMIN",
  displayName: "Garmin",

  async connect() {
    await new Promise((r) => setTimeout(r, 600));
    return {
      accessToken: "mock_gr_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_gr_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
  },

  async disconnect() {
    await new Promise((r) => setTimeout(r, 300));
  },

  async syncData(since: Date) {
    await new Promise((r) => setTimeout(r, 1100));
    const data: NormalizedDataPoint[] = [];
    const now = new Date();

    for (let d = new Date(since); d < now; d.setDate(d.getDate() + 1)) {
      data.push({
        source: "GARMIN",
        dataType: "STEPS",
        value: randomBetween(8000, 22000),
        unit: "steps",
        startTime: new Date(d),
        endTime: new Date(d.setHours(23, 59, 59)),
      });
      data.push({
        source: "GARMIN",
        dataType: "HEART_RATE",
        value: randomBetween(50, 75),
        unit: "bpm",
        startTime: new Date(d),
      });
      data.push({
        source: "GARMIN",
        dataType: "WORKOUT",
        value: randomBetween(40, 150),
        unit: "minutes",
        startTime: hoursAgo(randomBetween(1, 48)),
        endTime: hoursAgo(randomBetween(0, 1)),
        metadata: { type: "Cycling", distance: randomBetween(5, 40), caloriesBurned: randomBetween(300, 800) },
      });
    }
    return data;
  },

  async refreshToken() {
    return {
      accessToken: "mock_gr_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_gr_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
  },
};

const whoopProvider: IntegrationProvider = {
  name: "WHOOP",
  displayName: "Whoop",

  async connect() {
    await new Promise((r) => setTimeout(r, 750));
    return {
      accessToken: "mock_wp_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_wp_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
  },

  async disconnect() {
    await new Promise((r) => setTimeout(r, 300));
  },

  async syncData(since: Date) {
    await new Promise((r) => setTimeout(r, 1300));
    const data: NormalizedDataPoint[] = [];
    const now = new Date();

    for (let d = new Date(since); d < now; d.setDate(d.getDate() + 1)) {
      data.push({
        source: "WHOOP",
        dataType: "HEART_RATE",
        value: randomBetween(55, 82),
        unit: "bpm",
        startTime: new Date(d),
        metadata: { resting: randomBetween(45, 58), hrv: randomBetween(30, 80) },
      });
      data.push({
        source: "WHOOP",
        dataType: "SLEEP",
        value: randomBetween(360, 600),
        unit: "minutes",
        startTime: new Date(d),
        endTime: new Date(d.setHours(8, 0, 0)),
        metadata: {
          sleepScore: randomBetween(60, 100),
          recovery: randomBetween(40, 95),
          strain: randomBetween(5, 20),
        },
      });
      data.push({
        source: "WHOOP",
        dataType: "CALORIES",
        value: randomBetween(2000, 3200),
        unit: "kcal",
        startTime: new Date(d),
        endTime: new Date(d.setHours(23, 59, 59)),
      });
    }
    return data;
  },

  async refreshToken() {
    return {
      accessToken: "mock_wp_access_" + Math.random().toString(36).slice(2),
      refreshToken: "mock_wp_refresh_" + Math.random().toString(36).slice(2),
      expiresAt: new Date(Date.now() + 86400000 * 30),
    };
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
