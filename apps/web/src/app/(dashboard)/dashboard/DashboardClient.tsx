"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Flame,
  Trophy,
  TrendingUp,
  Calendar,
  ArrowRight,
  Dumbbell,
  Utensils,
  Zap,
  Search,
  Brain,
  X,
  Scale,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createProgressEntry } from "@/lib/actions";

interface DashboardClientProps {
  user: any;
  activeWorkoutId: string | undefined;
}

export function DashboardClient({ user, activeWorkoutId }: DashboardClientProps) {
  const firstName = user.name?.split(" ")[0] || "Athlete";

  // Active chart filters
  const [activeTab, setActiveTab] = useState<"week" | "month" | "year">("week");

  // Challenge modal states
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [isChallengeJoined, setIsChallengeJoined] = useState(false);

  // PR Modal states
  const [isPrOpen, setIsPrOpen] = useState(false);
  const [isPrLogged, setIsPrLogged] = useState(false);
  const [prWeight, setPrWeight] = useState<number>(100);
  const [isPrSaving, setIsPrSaving] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  const getChartData = () => {
    switch (activeTab) {
      case "month":
        return [40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 88];
      case "year":
        return [85, 60, 95, 75, 88, 92];
      case "week":
      default:
        return [60, 45, 80, 50, 85, 60, 95];
    }
  };

  const handleVerifyPr = async () => {
    setIsPrSaving(true);
    // Log bench press PR metric into the DB progress table
    const res = await createProgressEntry(user.id, {
      weight: user.weight || undefined, // Keep current weight
      notes: `Verified Bench Press PR: ${prWeight} kg!`,
    });

    if (res.success) {
      setIsPrLogged(true);
      setTimeout(() => {
        setIsPrOpen(false);
        setIsPrLogged(false);
      }, 1500);
    } else {
      alert("Failed to verify PR log");
    }
    setIsPrSaving(false);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight leading-none text-white">
            Good morning, <span className="text-secondary">{firstName}</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Your fitness ecosystem is synchronized and ready for progressive overload.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white/5 border-white/10 rounded-2xl placeholder:text-muted-foreground focus-visible:ring-secondary/40 text-white text-sm"
            />
          </div>
          <div className="flex items-center gap-4 bg-secondary/15 px-6 py-3 rounded-2xl border border-secondary/20 shadow-lg shadow-secondary/5 shrink-0">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-primary">
              <Flame className="h-5 w-5 fill-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-secondary text-lg leading-none">
                12 Days
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                Streak Level
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          href={activeWorkoutId ? `/workout/${activeWorkoutId}` : "/workout/builder"}
          icon={<Dumbbell className="h-6 w-6 text-blue-400" />}
          label="Active Routine"
          value="Upper Body A"
          subtext={activeWorkoutId ? "Click to start session" : "Click to build routine"}
          gradient="from-blue-500/10 to-transparent"
        />
        <SummaryCard
          href="/nutrition"
          icon={<Utensils className="h-6 w-6 text-secondary" />}
          label="Energy Balance"
          value="1,240 kcal"
          subtext="Remaining today"
          gradient="from-secondary/10 to-transparent"
        />
        <SummaryCard
          href="/progress"
          icon={<TrendingUp className="h-6 w-6 text-accent" />}
          label="Body Weight"
          value={user.weight ? `${user.weight} kg` : "--"}
          subtext="Current recorded weight"
          gradient="from-accent/10 to-transparent"
        />
        <SummaryCard
          href="/community"
          icon={<Trophy className="h-6 w-6 text-yellow-400" />}
          label="Platform Rank"
          value="Top 5%"
          subtext="Community Leaderboard"
          gradient="from-yellow-500/10 to-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Analytics chart widget */}
        <Card className="lg:col-span-2 p-6 sm:p-10 glass border-white/5 rounded-[3rem] space-y-10 relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
            <TrendingUp className="h-64 w-64 text-secondary" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-heading text-white">
                Performance Analytics
              </h2>
              <p className="text-xs text-muted-foreground">
                Volume and frequency over your dynamic calendar window.
              </p>
            </div>

            {/* Active Chart buttons */}
            <div className="flex bg-muted/50 p-1 rounded-xl border border-white/5 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("week")}
                className={`text-xs h-8 px-4 rounded-lg font-bold transition-all ${
                  activeTab === "week" ? "bg-background text-secondary shadow-sm" : "text-muted-foreground hover:text-white"
                }`}
              >
                Week
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("month")}
                className={`text-xs h-8 px-4 rounded-lg font-bold transition-all ${
                  activeTab === "month" ? "bg-background text-secondary shadow-sm" : "text-muted-foreground hover:text-white"
                }`}
              >
                Month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("year")}
                className={`text-xs h-8 px-4 rounded-lg font-bold transition-all ${
                  activeTab === "year" ? "bg-background text-secondary shadow-sm" : "text-muted-foreground hover:text-white"
                }`}
              >
                Year
              </Button>
            </div>
          </div>

          <div className="h-[350px] w-full bg-background/30 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group/chart">
            {/* Dynamic Animated Bars */}
            <div className="absolute inset-x-12 bottom-0 flex items-end justify-around h-full opacity-35 group-hover/chart:opacity-55 transition-opacity">
              {getChartData().map((h, i) => (
                <div
                  key={i}
                  className="w-4 sm:w-8 bg-gradient-to-t from-secondary/80 to-secondary rounded-t-xl transition-all duration-700 hover:from-secondary hover:to-white"
                  style={{ height: `${h}%` }}
                >
                  <div className="w-full h-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-t-xl" />
                </div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6 sm:p-8 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl max-w-sm mx-4">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30">
                <Zap className="h-6 w-6 text-secondary animate-pulse" />
              </div>
              <h3 className="font-bold text-lg text-white">AI Coach Insights</h3>
              <p className="text-xs text-muted-foreground leading-normal">
                Your progressive overload is peaking. Consider executing a recovery deload cycle soon.
              </p>
              <Link href="/progress" className="inline-block pt-1">
                <Button
                  variant="link"
                  className="text-secondary font-bold p-0 flex items-center gap-2 hover:translate-x-1 transition-transform"
                >
                  View Full Metrics
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Action Center Sidebar */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading px-2 text-white">
              Action Center
            </h2>
            <Card className="p-6 sm:p-8 glass border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-accent to-secondary" />

              <div className="space-y-4">
                {/* Leg Day Challenge Card */}
                <div
                  onClick={() => setIsChallengeOpen(true)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/30 hover:bg-secondary/5 transition-all cursor-pointer group"
                >
                  <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/35 group-hover:scale-105 transition-transform">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-secondary transition-colors">Leg Day Challenge</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                      {isChallengeJoined ? "Participating" : "Starts in 2 days"}
                    </p>
                  </div>
                </div>

                {/* PR Verification Card */}
                <div
                  onClick={() => setIsPrOpen(true)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer group"
                >
                  <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent border border-accent/35 group-hover:scale-105 transition-transform">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">New PR Detected</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                      Verify Bench Press
                    </p>
                  </div>
                </div>
              </div>

              {/* Start Routine Button */}
              {activeWorkoutId ? (
                <Link href={`/workout/${activeWorkoutId}`} className="block w-full">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl text-base shadow-xl shadow-secondary/10 group">
                    Enter Live Session
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href="/workout/builder" className="block w-full">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl text-base shadow-xl shadow-secondary/10 group">
                    Create Workout Plan
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-accent/25 to-primary/25 border border-white/5 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="h-32 w-32 text-accent fill-accent" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30 shadow-inner">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white">Pro Insights</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                You are 15% more likely to hit your targets when you train before 10 AM. Your sleep metrics suggest tomorrow is a peak strength day!
              </p>
              <Link href="/ai-coach" className="inline-block pt-1">
                <Button
                  variant="link"
                  className="p-0 h-auto text-accent font-bold uppercase tracking-widest text-[9px] hover:text-accent/80 transition-colors"
                >
                  Explore Recovery Protocols
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Leg Day Challenge Modal */}
      {isChallengeOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl">
            <button
              onClick={() => setIsChallengeOpen(false)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-inner mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading">Leg Day Challenge</h3>
              <p className="text-xs text-muted-foreground">Community accountability protocol.</p>
            </div>

            <div className="space-y-4 font-medium text-sm text-muted-foreground leading-relaxed bg-white/[0.02] border border-white/5 p-4 rounded-xl">
              <p>Join 1,204 active athletes in this high-intensity overload cycle. Perform any leg-focused routine twice a week for 30 consecutive days.</p>
              <div className="flex justify-between text-xs font-mono font-bold text-white pt-2 border-t border-white/5">
                <span>Start: May 25, 2026</span>
                <span>Tier: Premium Only</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsChallengeOpen(false)}
                className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsChallengeJoined(true);
                  setIsChallengeOpen(false);
                }}
                disabled={isChallengeJoined}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl shadow-lg shadow-secondary/15"
              >
                {isChallengeJoined ? "Already Joined" : "Join Challenge"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* PR Verification Modal */}
      {isPrOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl">
            <button
              onClick={() => setIsPrOpen(false)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 shadow-inner mb-4 animate-bounce">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading">New PR Detected</h3>
              <p className="text-xs text-muted-foreground">Verify and log your milestone metric.</p>
            </div>

            {isPrLogged ? (
              <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-xl text-center space-y-2 text-secondary">
                <Sparkles className="h-8 w-8 mx-auto animate-pulse" />
                <p className="font-bold text-base">Bench Press PR Verified!</p>
                <p className="text-xs text-muted-foreground">Logged metrics to progress history sheets.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                  <p className="text-xs text-muted-foreground leading-normal">
                    Our performance matrices detected a possible 1-Rep Max Bench Press milestone. Confirm your logged load metric:
                  </p>
                  <div className="flex items-center gap-4 justify-center py-2">
                    <span className="text-sm font-bold">Bench Press Load:</span>
                    <Input
                      type="number"
                      value={prWeight}
                      onChange={(e) => setPrWeight(parseFloat(e.target.value) || 0)}
                      className="w-24 text-center font-mono font-bold h-10 border-white/10"
                    />
                    <span className="text-sm font-bold text-muted-foreground">kg</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsPrOpen(false)}
                    className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerifyPr}
                    disabled={isPrSaving}
                    className="flex-1 bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-accent/15 gap-2"
                  >
                    {isPrSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                    Confirm PR
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  subtext,
  gradient,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  gradient: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="p-6 sm:p-8 glass border-white/5 rounded-[2.5rem] hover:border-white/15 hover:shadow-xl transition-all group relative overflow-hidden h-full flex flex-col justify-between">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            gradient,
          )}
        />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-background/50 flex items-center justify-center border border-white/5 group-hover:border-white/10 group-hover:scale-105 transition-all shadow-inner">
              {icon}
            </div>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
              {label}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xl sm:text-2xl font-bold font-heading group-hover:text-secondary transition-colors tracking-tight text-white leading-none">
              {value}
            </p>
            <p className="text-xs text-muted-foreground font-medium">{subtext}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
