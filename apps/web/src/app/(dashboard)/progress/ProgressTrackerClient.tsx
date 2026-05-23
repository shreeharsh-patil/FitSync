"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Scale,
  Ruler,
  Camera,
  Plus,
  ChevronRight,
  TrendingUp,
  X,
  Loader2,
  Calendar,
} from "lucide-react";
import { createProgressEntry } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface ProgressTrackerClientProps {
  initialEntries: any[];
  userId: string;
}

export function ProgressTrackerClient({ initialEntries, userId }: ProgressTrackerClientProps) {
  const [entries, setEntries] = useState<any[]>(initialEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  // Form State
  const [weight, setWeight] = useState<number>(0);
  const [bodyFat, setBodyFat] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const targetWeight = 75.0;

  // Derive metrics
  const latestEntry = entries[0];
  const firstEntry = entries[entries.length - 1];

  const currentWeightVal = latestEntry?.weight || 0;
  const startingWeightVal = firstEntry?.weight || 0;
  const remainingWeightVal = currentWeightVal > 0 ? currentWeightVal - targetWeight : 0;
  const trendVal = currentWeightVal > 0 && startingWeightVal > 0 ? currentWeightVal - startingWeightVal : 0;

  const handleLogMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return alert("Please enter weight");

    setIsLogging(true);

    const res = await createProgressEntry(userId, {
      weight,
      bodyFatPct: bodyFat || undefined,
      notes,
    });

    if (res.success) {
      const newEntry = {
        id: res.id,
        weight,
        bodyFatPct: bodyFat || null,
        logDate: new Date(),
        notes,
      };
      setEntries((prev) => [newEntry, ...prev]);
      setIsModalOpen(false);
      // Reset form
      setWeight(0);
      setBodyFat(0);
      setNotes("");
    } else {
      alert(res.error || "Failed to log progress metrics");
    }
    setIsLogging(false);
  };

  // Custom high-fidelity SVG chart coordinate mapping!
  // Sort entries chronologically to plot left-to-right
  const chronologicalEntries = [...entries].reverse();

  let svgPath = "";
  let circles: { cx: number; cy: number; weight: number; date: string }[] = [];

  if (chronologicalEntries.length > 1) {
    const width = 600;
    const height = 200;
    const weights = chronologicalEntries.map((e) => e.weight).filter(Boolean) as number[];
    const maxWeight = Math.max(...weights, targetWeight) + 2;
    const minWeight = Math.min(...weights, targetWeight) - 2;
    const weightRange = maxWeight - minWeight;

    const xStep = width / (chronologicalEntries.length - 1);

    const points = chronologicalEntries.map((entry, index) => {
      const x = index * xStep;
      // Invert Y because SVG coordinates start at top-left
      const y = height - ((entry.weight - minWeight) / weightRange) * (height - 40) - 20;
      return { cx: x, cy: y, weight: entry.weight || 0, date: new Date(entry.logDate).toLocaleDateString([], { month: "short", day: "numeric" }) };
    });

    // Build quadratic bezier path for smooth curved line!
    svgPath = `M ${points[0].cx} ${points[0].cy}`;
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].cx + points[i + 1].cx) / 2;
      const yc = (points[i].cy + points[i + 1].cy) / 2;
      svgPath += ` Q ${points[i].cx} ${points[i].cy}, ${xc} ${yc}`;
    }
    // Finish to final point
    const lastPt = points[points.length - 1];
    svgPath += ` L ${lastPt.cx} ${lastPt.cy}`;

    circles = points;
  }

  return (
    <div className="space-y-8 relative">
      {/* Header quick action triggers */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary hover:bg-secondary/90 text-primary font-bold gap-2 shadow-lg shadow-secondary/15"
        >
          <Plus className="h-4 w-4" />
          Log New Metrics
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Progression Chart */}
        <Card className="lg:col-span-2 p-10 glass border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <Scale className="h-64 w-64 text-secondary" />
          </div>

          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-inner">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading">Weight Transformation</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                  Target Goal: {targetWeight} kg
                </p>
              </div>
            </div>
          </div>

          {/* SVG Custom Line Chart */}
          <div className="h-[300px] w-full bg-background/30 rounded-[2rem] border border-white/5 flex items-end justify-between px-10 pb-12 relative group/chart overflow-hidden">
            {chronologicalEntries.length > 1 ? (
              <svg
                className="absolute inset-0 w-full h-full px-12 py-10 overflow-visible"
                viewBox="0 0 600 200"
                preserveAspectRatio="none"
              >
                {/* Neon Glow under line path */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(0,201,167,0.5)]"
                />

                {/* Plot points as circles */}
                {circles.map((pt, i) => (
                  <g key={i} className="group/dot cursor-pointer">
                    <circle
                      cx={pt.cx}
                      cy={pt.cy}
                      r="6"
                      fill="var(--secondary)"
                      className="transition-all group-hover/dot:r-8"
                    />
                    <circle
                      cx={pt.cx}
                      cy={pt.cy}
                      r="12"
                      fill="var(--secondary)"
                      className="opacity-0 group-hover/dot:opacity-20 transition-all"
                    />
                    {/* Hover text label */}
                    <text
                      x={pt.cx}
                      y={pt.cy - 16}
                      textAnchor="middle"
                      fill="white"
                      fontSize="9"
                      fontWeight="bold"
                      className="opacity-0 group-hover/dot:opacity-100 transition-opacity font-mono fill-white bg-black"
                    >
                      {pt.weight}kg
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-2">
                <TrendingUp className="h-10 w-10 text-muted-foreground animate-pulse" />
                <p className="font-bold text-sm">Need at least 2 metrics logged</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Log your current weight today to start plotting your custom transformation curve.
                </p>
              </div>
            )}

            {/* X-Axis dates */}
            {circles.length > 1 && (
              <div className="absolute inset-x-12 bottom-4 flex justify-between text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                {circles.map((pt, idx) => (
                  <span key={idx}>{pt.date}</span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <MetricSmall
              label="Starting Weight"
              value={startingWeightVal > 0 ? `${startingWeightVal.toFixed(1)} kg` : "--"}
              date={
                firstEntry
                  ? new Date(firstEntry.logDate).toLocaleDateString([], { month: "short", day: "numeric" })
                  : "No logs found"
              }
            />
            <MetricSmall
              label="Current Weight"
              value={currentWeightVal > 0 ? `${currentWeightVal.toFixed(1)} kg` : "--"}
              date={
                latestEntry
                  ? new Date(latestEntry.logDate).toLocaleDateString([], { month: "short", day: "numeric" })
                  : "No logs found"
              }
              trend={trendVal !== 0 ? `${trendVal > 0 ? "+" : ""}${trendVal.toFixed(1)} kg` : undefined}
              trendColor={trendVal <= 0 ? "text-secondary" : "text-accent"}
            />
            <MetricSmall
              label="Remaining Distance"
              value={remainingWeightVal > 0 ? `${remainingWeightVal.toFixed(1)} kg` : "0.0 kg"}
              date={`Target: ${targetWeight} kg`}
            />
          </div>
        </Card>

        {/* Body Measurements Card */}
        <div className="space-y-8">
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                <Ruler className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold font-heading">Body Metrics</h2>
            </div>

            <div className="space-y-4">
              <MeasurementItem label="Body Fat Percentage" value={latestEntry?.bodyFatPct ? `${latestEntry.bodyFatPct}%` : "--"} trend="Current" />
              <MeasurementItem label="Chest" value="104 cm" trend="Target: 106cm" />
              <MeasurementItem label="Waist" value="82 cm" trend="Target: 80cm" />
              <MeasurementItem label="Hips" value="96 cm" trend="Target: 94cm" />
            </div>
          </Card>
        </div>
      </div>

      {/* Log Metrics Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-heading">Log New Metrics</h3>
              <p className="text-xs text-muted-foreground">Keep your fitness progression history precise.</p>
            </div>

            <form onSubmit={handleLogMetrics} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Current Weight (kg)
                </label>
                <Input
                  required
                  type="number"
                  step="0.1"
                  placeholder="e.g. 78.4"
                  value={weight || ""}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="h-12 bg-white/5 border-white/10 font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Body Fat (%) - Optional
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 14.5"
                  value={bodyFat || ""}
                  onChange={(e) => setBodyFat(parseFloat(e.target.value) || 0)}
                  className="h-12 bg-white/5 border-white/10 font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Workout Progress Notes
                </label>
                <textarea
                  placeholder="Feeling leaner, strength is peaking..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-secondary/40 text-white placeholder-muted-foreground"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLogging}
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl shadow-lg shadow-secondary/10 gap-2"
                >
                  {isLogging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scale className="h-4 w-4" />}
                  Save Metrics
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function MetricSmall({
  label,
  value,
  date,
  trend,
  trendColor,
}: {
  label: string;
  value: string;
  date: string;
  trend?: string;
  trendColor?: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-xl font-bold font-heading text-white">{value}</p>
        {trend && <span className={cn("text-[10px] font-bold font-mono", trendColor)}>{trend}</span>}
      </div>
      <p className="text-[9px] text-muted-foreground mt-1 font-semibold">{date}</p>
    </div>
  );
}

function MeasurementItem({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-secondary/25 transition-all group">
      <div>
        <p className="text-sm font-bold text-white group-hover:text-secondary transition-colors">{label}</p>
        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">{trend}</p>
      </div>
      <span className="font-mono font-bold text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
        {value}
      </span>
    </div>
  );
}
