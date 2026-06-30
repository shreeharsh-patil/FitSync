"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  FileText,
} from "lucide-react";

export function AnalyticsClient({ data }: { data: {
  labels: string[];
  users: number[];
  revenue: number[];
  workouts: number[];
  posts: number[];
}}) {
  const [activeChart, setActiveChart] = useState<"users" | "revenue" | "workouts" | "posts">("users");

  const charts = {
    users: { label: "New Users", color: "text-blue-400", barColor: "bg-blue-400/40" },
    revenue: { label: "Revenue", color: "text-secondary", barColor: "bg-secondary/40" },
    workouts: { label: "Workouts", color: "text-accent", barColor: "bg-accent/40" },
    posts: { label: "Blog Posts", color: "text-yellow-400", barColor: "bg-yellow-400/40" },
  };

  const currentValues = data[activeChart] || [];
  const maxVal = Math.max(...currentValues, 1);

  const totalUsers = data.users.reduce((a, b) => a + b, 0);
  const totalRevenue = data.revenue.reduce((a, b) => a + b, 0);
  const totalWorkouts = data.workouts.reduce((a, b) => a + b, 0);
  const totalPosts = data.posts.reduce((a, b) => a + b, 0);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform performance metrics over the last 6 months.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 glass border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">New Users (6mo)</p>
              <p className="text-xl font-bold font-heading">{totalUsers}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 glass border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Revenue (6mo)</p>
              <p className="text-xl font-bold font-heading">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 glass border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Workouts (6mo)</p>
              <p className="text-xl font-bold font-heading">{totalWorkouts}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 glass border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Posts (6mo)</p>
              <p className="text-xl font-bold font-heading">{totalPosts}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Monthly Trends
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {charts[activeChart].label} over the last 6 months
            </p>
          </div>
          <div className="flex bg-muted/40 p-1 rounded-xl border border-white/5">
            {Object.entries(charts).map(([key, chart]) => (
              <button
                key={key}
                onClick={() => setActiveChart(key as "users" | "revenue" | "workouts" | "posts")}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  activeChart === key
                    ? "bg-background text-secondary shadow-md border border-white/5"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {chart.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] w-full flex items-end justify-between gap-2 px-4 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-b border-white/[0.03] w-full" />
            ))}
          </div>
          {data.labels.map((label, idx) => {
            const val = currentValues[idx] || 0;
            const percent = (val / maxVal) * 100;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 relative z-10 h-full justify-end pb-8">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground">{val}</span>
                </div>
                <div
                  className={cn("w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer", charts[activeChart].barColor)}
                  style={{ height: `${Math.max(percent, 2)}%`, minHeight: "4px" }}
                />
                <span className="text-[8px] text-muted-foreground mt-2 font-bold uppercase tracking-wider text-center">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 glass border-white/5 rounded-[2rem]">
          <h3 className="text-sm font-bold font-heading mb-4">Monthly User Growth</h3>
          <div className="space-y-3">
            {data.labels.map((label, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400/60 rounded-full"
                      style={{ width: `${(data.users[idx] / Math.max(...data.users, 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold w-8 text-right">{data.users[idx]}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6 glass border-white/5 rounded-[2rem]">
          <h3 className="text-sm font-bold font-heading mb-4">Monthly Revenue</h3>
          <div className="space-y-3">
            {data.labels.map((label, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary/60 rounded-full"
                      style={{ width: `${(data.revenue[idx] / Math.max(...data.revenue, 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold w-16 text-right">${data.revenue[idx].toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6 glass border-white/5 rounded-[2rem]">
          <h3 className="text-sm font-bold font-heading mb-4">Workouts Logged</h3>
          <div className="space-y-3">
            {data.labels.map((label, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent/60 rounded-full"
                      style={{ width: `${(data.workouts[idx] / Math.max(...data.workouts, 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold w-8 text-right">{data.workouts[idx]}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
