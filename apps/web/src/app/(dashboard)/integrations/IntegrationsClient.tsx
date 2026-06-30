"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

const PROVIDER_META: Record<string, { name: string; icon: string; description: string; color: string }> = {
  APPLE_HEALTH: { name: "Apple Health", icon: "🍎", description: "Sync steps, heart rate, sleep, and workouts from Apple Health", color: "from-pink-500 to-red-500" },
  GOOGLE_FIT: { name: "Google Fit", icon: "🏃", description: "Import activity, heart rate, and nutrition data from Google Fit", color: "from-blue-500 to-green-500" },
  FITBIT: { name: "Fitbit", icon: "⌚", description: "Track sleep, steps, heart rate, and exercise from Fitbit", color: "from-teal-500 to-cyan-500" },
  GARMIN: { name: "Garmin Connect", icon: "📟", description: "Sync running, cycling, swimming, and health data from Garmin", color: "from-gray-600 to-gray-500" },
  WHOOP: { name: "WHOOP", icon: "🩸", description: "Import recovery, strain, sleep, and health metrics from WHOOP", color: "from-purple-600 to-purple-500" },
};

interface IntegrationStatus {
  provider: string;
  isConnected: boolean;
  lastSyncAt: string | null;
  connectedAt: string | null;
}

interface IntegrationsClientProps {
  userId: string;
  initialStatuses: IntegrationStatus[];
}

export function IntegrationsClient({ userId, initialStatuses }: IntegrationsClientProps) {
  const [statuses, setStatuses] = useState<IntegrationStatus[]>(initialStatuses);
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = useCallback((provider: string, updates: Partial<IntegrationStatus>) => {
    setStatuses((prev) => prev.map((s) => (s.provider === provider ? { ...s, ...updates } : s)));
  }, []);

  const handleConnect = async (provider: string) => {
    setLoading(provider);
    try {
      const { connectIntegration } = await import("@/lib/actions");
      const result = await connectIntegration(userId, provider);
      if (result.success) {
        updateStatus(provider, { isConnected: true, connectedAt: new Date().toISOString() });
      }
    } catch {
      // silently fail
    }
    setLoading(null);
  };

  const handleDisconnect = async (provider: string) => {
    setLoading(provider);
    try {
      const { disconnectIntegration } = await import("@/lib/actions");
      const result = await disconnectIntegration(userId, provider);
      if (result.success) {
        updateStatus(provider, { isConnected: false, lastSyncAt: null, connectedAt: null });
      }
    } catch {
      // silently fail
    }
    setLoading(null);
  };

  const handleSync = async (provider: string) => {
    setLoading(provider);
    try {
      const { syncIntegration } = await import("@/lib/actions");
      const result = await syncIntegration(userId, provider);
      if (result.success) {
        updateStatus(provider, { lastSyncAt: new Date().toISOString() });
      }
    } catch {
      // silently fail
    }
    setLoading(null);
  };

  return (
    <div className="grid gap-4">
      {Object.entries(PROVIDER_META).map(([key, meta]) => {
        const status = statuses.find((s) => s.provider === key);
        const isConnected = status?.isConnected ?? false;
        const isLoading = loading === key;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-card p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl`}>
                  {meta.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{meta.name}</h3>
                  <p className="text-sm text-muted-foreground">{meta.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-slate-500"}`} />
                <span className="text-xs text-muted-foreground">{isConnected ? "Connected" : "Not connected"}</span>
              </div>
            </div>

            {isConnected && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {status?.lastSyncAt && (
                  <span>Last synced: {new Date(status.lastSyncAt).toLocaleDateString()}</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <button
                    onClick={() => handleSync(key)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isLoading ? "Working..." : "Sync Now"}
                  </button>
                  <button
                    onClick={() => handleDisconnect(key)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 text-destructive px-4 py-2 text-sm font-medium hover:bg-destructive/5 disabled:opacity-50"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnect(key)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
