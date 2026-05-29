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
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 relative"
    >
      {/* Header quick action triggers */}
      <div className="flex justify-end gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 px-8 rounded-xl gap-2 shadow-xl shadow-secondary/15"
          >
            <Plus className="h-5 w-5" />
            Log New Metrics
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Progression Chart */}
        <Card className="lg:col-span-2 p-10 glass border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <Scale className="h-64 w-64 text-secondary" />
          </div>

          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-inner">
                <Scale className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading text-white">Weight Transformation</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">
                  Target Goal: {targetWeight} kg
                </p>
              </div>
            </div>
          </div>

          {/* SVG Custom Line Chart */}
          <div className="h-[350px] w-full bg-slate-950/40 rounded-[2.5rem] border border-white/5 flex items-end justify-between px-10 pb-12 relative group/chart overflow-hidden shadow-inner">
            {chronologicalEntries.length > 1 ? (
              <svg
                className="absolute inset-0 w-full h-full px-12 py-12 overflow-visible"
                viewBox="0 0 600 200"
                preserveAspectRatio="none"
              >
                {/* Gradient Fill under path */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d={svgPath}
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_15px_rgba(0,201,167,0.5)]"
                />

                {/* Plot points as circles */}
                {circles.map((pt, i) => (
                  <motion.g 
                    key={i} 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="group/dot cursor-pointer"
                  >
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
                    <text
                      x={pt.cx}
                      y={pt.cy - 18}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      className="opacity-0 group-hover/dot:opacity-100 transition-opacity font-mono"
                    >
                      {pt.weight}kg
                    </text>
                  </motion.g>
                ))}
              </svg>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                  <TrendingUp className="h-8 w-8 text-muted-foreground animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-lg text-white">Need at least 2 metrics logged</p>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Log your current weight today to start plotting your custom transformation curve.
                  </p>
                </div>
              </div>
            )}

            {/* X-Axis labels */}
            {circles.length > 1 && (
              <div className="absolute inset-x-12 bottom-5 flex justify-between text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
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
              icon={<TrendingUp className="h-4 w-4 text-blue-400" />}
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
              icon={<Scale className="h-4 w-4 text-secondary" />}
            />
            <MetricSmall
              label="To Goal"
              value={remainingWeightVal > 0 ? `${remainingWeightVal.toFixed(1)} kg` : "Goal Achieved!"}
              date={`Target: ${targetWeight} kg`}
              icon={<Calendar className="h-4 w-4 text-accent" />}
            />
          </div>
        </Card>

        {/* Body Measurements Card */}
        <div className="space-y-8">
          <Card className="p-8 glass border-white/5 rounded-[3rem] space-y-8 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 shadow-inner">
                <Ruler className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold font-heading text-white">Body Metrics</h2>
            </div>

            <div className="space-y-4 relative z-10">
              <MeasurementItem label="Body Fat Percentage" value={latestEntry?.bodyFatPct ? `${latestEntry.bodyFatPct}%` : "--"} trend="Current Matrix" />
              <MeasurementItem label="Chest Circumference" value="104 cm" trend="Target: 106cm" />
              <MeasurementItem label="Waist Line" value="82 cm" trend="Target: 80cm" />
              <MeasurementItem label="Hips Protocol" value="96 cm" trend="Target: 94cm" />
            </div>
            
            <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold text-xs uppercase tracking-widest mt-4">
              Update All Body Dimensions
            </Button>
          </Card>
          
          <Card className="p-8 bg-gradient-to-br from-secondary/10 to-primary/20 border border-white/5 rounded-[3rem] shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30">
                <Camera className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Progress Photos</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Visual transformation is the ultimate metric. Upload photos to synchronize with your weight logs.
              </p>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-11 rounded-xl shadow-lg shadow-secondary/10 text-xs">
                Launch Photo Vault
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Log Metrics Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <Card className="w-full max-w-md glass border-white/10 p-10 space-y-8 relative rounded-[3rem] shadow-2xl">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-2">
                  <h3 className="text-3xl font-bold font-heading text-white">Log Metrics</h3>
                  <p className="text-sm text-muted-foreground">Keep your fitness progression history precise.</p>
                </div>

                <form onSubmit={handleLogMetrics} className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-1">
                      Current Weight (kg)
                    </label>
                    <Input
                      required
                      type="number"
                      step="0.1"
                      placeholder="e.g. 78.4"
                      value={weight || ""}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="h-14 bg-white/5 border-white/10 font-mono font-bold text-lg focus:border-secondary/50 rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-1">
                      Body Fat (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 14.5"
                      value={bodyFat || ""}
                      onChange={(e) => setBodyFat(parseFloat(e.target.value) || 0)}
                      className="h-14 bg-white/5 border-white/10 font-mono font-bold text-lg focus:border-secondary/50 rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.3em] px-1">
                      Analysis Notes
                    </label>
                    <textarea
                      placeholder="Feeling leaner, strength is peaking..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-secondary/50 text-white placeholder-muted-foreground transition-all"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 border-white/10 border h-14 rounded-2xl font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLogging}
                      className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl shadow-xl shadow-secondary/20 gap-2"
                    >
                      {isLogging ? <Loader2 className="h-5 w-5 animate-spin" /> : <Scale className="h-5 w-5" />}
                      Sync Metrics
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MetricSmall({
  label,
  value,
  date,
  trend,
  trendColor,
  icon,
}: {
  label: string;
  value: string;
  date: string;
  trend?: string;
  trendColor?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-background/50 border border-white/5 group-hover:border-white/10 transition-colors">
          {icon}
        </div>
        <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-[0.2em]">
          {label}
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold font-heading text-white">{value}</p>
        {trend && <span className={cn("text-xs font-bold font-mono", trendColor)}>{trend}</span>}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-wider">{date}</p>
    </div>
  );
}

function MeasurementItem({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-secondary/20 hover:bg-secondary/5 transition-all group cursor-default"
    >
      <div>
        <p className="text-sm font-bold text-white group-hover:text-secondary transition-colors">{label}</p>
        <p className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-bold mt-1">{trend}</p>
      </div>
      <span className="font-mono font-bold text-base bg-slate-950/40 px-4 py-2 rounded-xl border border-white/5 group-hover:border-secondary/30 transition-colors text-white">
        {value}
      </span>
    </motion.div>
  );
}
