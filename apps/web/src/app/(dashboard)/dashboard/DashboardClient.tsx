"use client";

import { useState, useEffect, useRef } from "react";
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
  Award,
  Compass,
  CheckCircle2,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createProgressEntry, searchExercises } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardClientProps {
  user: any;
  activeWorkoutId: string | undefined;
  streakDetails?: {
    streak: number;
    activeDates: string[];
  };
  metrics?: {
    weekVolumes: number[];
    weeklyVolume: number;
    monthlyVolume: number;
    yearlyVolume: number;
    todayCalories: number;
    activeRoutineName: string | null;
  };
  workoutLogs?: any[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

export function DashboardClient({ user, activeWorkoutId, streakDetails, metrics, workoutLogs }: DashboardClientProps) {
  const firstName = user.name?.split(" ")[0] || "Athlete";

  // Active chart filters
  const [activeTab, setActiveTab] = useState<"week" | "month" | "year">("week");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Search feature states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Challenge modal states
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [challengeJoined, setChallengeJoined] = useState(false);
  const [challengeCheckedItems, setChallengeCheckedItems] = useState<boolean[]>([false, false, false]);

  // PR Modal states
  const [isPrOpen, setIsPrOpen] = useState(false);
  const [isPrLogged, setIsPrLogged] = useState(false);
  const [prWeight, setPrWeight] = useState<number>(105);
  const [isPrSaving, setIsPrSaving] = useState(false);
  const [showPrCelebration, setShowPrCelebration] = useState(false);

  // Streak Calendar Modal state
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isStreakShared, setIsStreakShared] = useState(false);

  // Load persistent challenge state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedJoined = localStorage.getItem("fitsync_challenge_joined");
      if (savedJoined === "true") {
        setChallengeJoined(true);
      }
      const savedChecked = localStorage.getItem("fitsync_challenge_checked");
      if (savedChecked) {
        try {
          setChallengeCheckedItems(JSON.parse(savedChecked));
        } catch (e) {}
      }
    }
  }, []);

  // Handle click outside search autocomplete
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for exercises
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        const results = await searchExercises(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Active workout volumes mapped to percentages for chart
  const getChartConfig = () => {
    switch (activeTab) {
      case "month":
        return {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          values: [metrics?.monthlyVolume ? Math.round(metrics.monthlyVolume / 4) : 0, 0, 0, 0],
          unit: "kcal",
        };
      case "year":
        return {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          values: [metrics?.yearlyVolume ? Math.round(metrics.yearlyVolume) : 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          unit: "kcal",
        };
      case "week":
      default:
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: metrics?.weekVolumes || [0, 0, 0, 0, 0, 0, 0],
          unit: "kcal",
        };
    }
  };

  const chartData = getChartConfig();
  const maxVal = Math.max(...chartData.values, 1000);

  // Dynamic user streak counting
  const dynamicStreak = streakDetails?.streak !== undefined ? streakDetails.streak : 12;
  const finalActiveDates = streakDetails?.activeDates || [];

  // Search feature quick navigation links
  const quickShortcuts = [
    { name: "Workout Tracker", desc: "Launch and log your active routine", href: "/workout", icon: Dumbbell },
    { name: "Nutrition & Hydration", desc: "Log meals and add water count", href: "/nutrition", icon: Utensils },
    { name: "Progress Analytics", desc: "Track weight and view dynamic charts", href: "/progress", icon: TrendingUp },
    { name: "AI Performance Coach", desc: "Consult custom fitness insights", href: "/ai-coach", icon: Brain },
    { name: "Athlete Profile", desc: "Biological details & fitness targets", href: "/profile", icon: Scale },
    { name: "Community Leaderboard", desc: "Join challenges & view social feed", href: "/community", icon: Trophy },
  ];

  const filteredShortcuts = quickShortcuts.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerifyPr = async () => {
    setIsPrSaving(true);
    const res = await createProgressEntry(user.id, {
      weight: user.weight || undefined,
      notes: `Verified Bench Press PR: ${prWeight} kg!`,
    });

    if (res.success) {
      setShowPrCelebration(true);
      setTimeout(() => {
        setIsPrOpen(false);
        setIsPrLogged(true);
        setShowPrCelebration(false);
        setIsPrLogged(false);
      }, 2500);
    } else {
      alert("Failed to verify PR log");
    }
    setIsPrSaving(false);
  };

  const handleJoinChallenge = () => {
    setChallengeJoined(true);
    localStorage.setItem("fitsync_challenge_joined", "true");
    const initialChecked = [false, false, false];
    setChallengeCheckedItems(initialChecked);
    localStorage.setItem("fitsync_challenge_checked", JSON.stringify(initialChecked));
    setIsChallengeOpen(false);
  };

  const toggleChallengeCheck = (idx: number) => {
    const updated = [...challengeCheckedItems];
    updated[idx] = !updated[idx];
    setChallengeCheckedItems(updated);
    localStorage.setItem("fitsync_challenge_checked", JSON.stringify(updated));
  };

  const getChallengeProgress = () => {
    const checkedCount = challengeCheckedItems.filter(Boolean).length;
    return Math.round((checkedCount / 3) * 100);
  };

  const generatePast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      days.push({
        dateStr: `${yyyy}-${mm}-${dd}`,
        dayNum: d.getDate(),
        monthStr: d.toLocaleDateString("en-US", { month: "short" }),
        dayOfWeek: d.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    return days;
  };

  const handleShareStreak = () => {
    const text = `🔥 Shredding progressive overload protocols on FitSync! Dynamic Streak level at ${dynamicStreak} Days. Synchronize your body. Sync your life. ⚡`;
    navigator.clipboard.writeText(text);
    setIsStreakShared(true);
    setTimeout(() => setIsStreakShared(false), 2000);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 sm:space-y-12 relative"
    >
      {/* Background Orbs for Depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] glow-sphere opacity-20 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] glow-sphere opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />

      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight leading-none text-white">
            Good morning, <span className="text-secondary">{firstName}</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Your fitness ecosystem is synchronized and ready for progressive overload.
          </p>
        </div>

        {/* Dynamic Search & Streak */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto relative">
          <div ref={searchRef} className="relative w-full sm:w-80 z-40">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search features or exercises..."
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              className="pl-12 pr-4 h-13 bg-white/5 border-white/10 rounded-2xl placeholder:text-muted-foreground focus-visible:ring-secondary/40 text-white text-sm w-full transition-all focus:bg-slate-900/90 hover:bg-white/10"
            />

            {/* Glassmorphic Autocomplete Search Dropdown */}
            <AnimatePresence>
              {showSearchDropdown && (searchQuery.length > 0) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl z-50 max-h-[400px] overflow-y-auto space-y-5"
                >
                  
                  {/* 1. Filtered Quick Navigation Shortcuts */}
                  {filteredShortcuts.length > 0 && (
                    <div className="space-y-2.5">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
                        Navigation Shortcuts
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {filteredShortcuts.map((shortcut) => (
                          <Link key={shortcut.name} href={shortcut.href} onClick={function() { setShowSearchDropdown(false); }}>
                            <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group">
                              <div className="h-9 w-9 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/10 group-hover:scale-105 transition-transform">
                                 <shortcut.icon className="h-4.5 w-4.5" />
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-white group-hover:text-secondary transition-colors">
                                  {shortcut.name}
                                </p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">
                                  {shortcut.desc}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Debounced Exercise Database Searches */}
                  {searchQuery.trim().length > 2 && (
                    <div className="space-y-2.5 pt-2 border-t border-white/5">
                      <div className="flex justify-between items-center px-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Exercise Database
                        </p>
                        {isSearching && <Loader2 className="h-3 w-3 animate-spin text-secondary" />}
                      </div>

                      <div className="space-y-1.5">
                        {searchResults.length > 0 ? (
                          searchResults.map((ex) => (
                            <div
                              key={ex.id}
                              onClick={() => {
                                setSelectedExercise(ex);
                                setShowSearchDropdown(false);
                              }}
                              className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-secondary/20 hover:bg-secondary/5 cursor-pointer transition-all group"
                            >
                              <div className="text-left flex-1 min-w-0">
                                <p className="text-xs font-bold text-white group-hover:text-secondary transition-colors truncate">
                                  {ex.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[8px] bg-muted px-1.5 py-0.5 rounded font-bold text-muted-foreground uppercase tracking-wider">
                                    {ex.category}
                                  </span>
                                  <span className="text-[8px] text-muted-foreground">
                                    {(ex.muscleGroups || "").split(", ").slice(0, 2).join(", ")}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[10px] font-bold text-secondary hover:bg-secondary/15 rounded-xl transition-all"
                              >
                                Details
                              </Button>
                            </div>
                          ))
                        ) : (
                          !isSearching && (
                            <p className="text-center text-[11px] text-muted-foreground py-2">
                              No exercises matching "{searchQuery}"
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  
                  {searchQuery.trim().length <= 2 && (
                    <p className="text-center text-[9px] text-muted-foreground py-1 uppercase tracking-wider font-bold">
                      Type 3+ letters to search database...
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active Interactive Streak Flame */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsStreakModalOpen(true)}
            className="flex items-center gap-4 bg-secondary/15 hover:bg-secondary/20 cursor-pointer px-6 py-3.5 rounded-2xl border border-secondary/25 shadow-lg shadow-secondary/5 shrink-0 w-full sm:w-auto transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-primary shadow-inner relative z-10">
              <Flame className="h-5.5 w-5.5 fill-primary animate-pulse" />
            </div>
            <div className="flex flex-col text-left relative z-10">
              <span className="font-bold text-secondary text-lg leading-none font-mono">
                {dynamicStreak} Days
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-extrabold mt-1">
                Streak Level ⚡
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Primary Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <SummaryCard
          href={activeWorkoutId ? `/workout/${activeWorkoutId}` : "/workout/builder"}
          icon={<Dumbbell className="h-6 w-6 text-blue-400" />}
          label="Active Routine"
          value={metrics?.activeRoutineName || "No Plan"}
          subtext={activeWorkoutId ? "Click to start session" : "Click to build routine"}
          gradient="from-blue-500/10 to-transparent"
        />
        <SummaryCard
          href="/nutrition"
          icon={<Utensils className="h-6 w-6 text-secondary" />}
          label="Today's Calories"
          value={metrics?.todayCalories ? `${metrics.todayCalories.toLocaleString()} kcal` : "0 kcal"}
          subtext="Logged today"
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
          href="/workout"
          icon={<Trophy className="h-6 w-6 text-yellow-400" />}
          label="Weekly Volume"
          value={metrics?.weeklyVolume ? `${metrics.weeklyVolume.toLocaleString()} kcal` : "0 kcal"}
          subtext="This week"
          gradient="from-yellow-500/10 to-transparent"
        />
      </motion.div>

      {/* Main Charts & Coach Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        
        {/* Performance Analytics area chart widget */}
        <Card className="xl:col-span-2 p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden group shadow-xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
                Performance Analytics
                <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
              </h2>
              <p className="text-xs text-muted-foreground">
                Total weekly and monthly logged training volume.
              </p>
            </div>

            {/* Active Chart buttons */}
            <div className="flex bg-muted/40 p-1 rounded-xl border border-white/5 shrink-0 self-start sm:self-center">
              {(["week", "month", "year"] as const).map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveTab(tab);
                    setHoveredBarIndex(null);
                  }}
                  className={cn(
                    "text-xs h-8 px-4 rounded-lg font-bold capitalize transition-all",
                    activeTab === tab 
                      ? "bg-background text-secondary shadow-md border border-white/5" 
                      : "text-muted-foreground hover:text-white"
                  )}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="space-y-4 pt-4">
            <div className="h-[250px] w-full flex items-end justify-between px-2 sm:px-6 relative">
              {/* Dashed Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 text-[10px] text-muted-foreground/10 font-mono">
                <div className="border-b border-white/[0.05] w-full pt-6 flex justify-between"><span>PEAK</span><span></span></div>
                <div className="border-b border-white/[0.05] w-full flex justify-between"><span>MID</span><span></span></div>
                <div className="border-b border-white/[0.05] w-full flex justify-between"><span>REST</span><span></span></div>
              </div>

              {/* Bars */}
              <div className="relative w-full h-full flex items-end justify-around z-10 pb-6">
                {chartData.values.map((val, idx) => {
                  const percent = val > 0 ? (val / maxVal) * 100 : 0;
                  const label = chartData.labels[idx];
                  const isHovered = hoveredBarIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center group relative cursor-pointer"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      style={{ width: `${100 / chartData.values.length}%` }}
                    >
                      {/* Interactive Tooltip Bubble */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                            exit={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                            className="absolute bottom-[105%] left-1/2 bg-slate-950/95 border border-secondary/30 text-white rounded-2xl px-4 py-2 shadow-2xl z-30 pointer-events-none flex flex-col items-center min-w-[130px]"
                          >
                            <span className="text-[10px] uppercase font-bold text-secondary tracking-widest">{label}</span>
                            <span className="text-sm font-mono font-bold text-white mt-0.5">
                              {val > 0 ? `${val.toLocaleString()} kg` : "Rest Day"}
                            </span>
                            <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-bold">
                              {val > 0 ? "Total Volume" : "Active Recovery"}
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-secondary/30" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Glowing Bar */}
                      <motion.div
                        initial={{ height: 10 }}
                        animate={{ height: val > 0 ? `${percent * 1.5}px` : "10px" }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className={cn(
                          "w-4 sm:w-8 md:w-10 rounded-t-xl transition-all duration-500 relative shadow-lg shadow-black/10",
                          val > 0 
                            ? "bg-gradient-to-t from-secondary/40 to-secondary hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:to-white" 
                            : "bg-white/5 border border-dashed border-white/10 hover:bg-white/10"
                        )}
                        style={{ maxHeight: '180px', minHeight: '10px' }}
                      >
                        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity rounded-t-xl" />
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-around items-center border-t border-white/5 pt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground font-sans px-2">
              {chartData.labels.map((label, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "text-center transition-colors duration-300",
                    hoveredBarIndex === idx ? "text-secondary font-extrabold" : ""
                  )}
                  style={{ width: `${100 / chartData.labels.length}%` }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Dynamic Coach Insights Card (Positioned beautifully alongside) */}
        <Card className="p-8 bg-gradient-to-br from-accent/20 to-primary/25 border border-white/5 rounded-[2.5rem] relative overflow-hidden group shadow-xl flex flex-col justify-between min-h-[350px]">
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Zap className="h-36 w-36 text-accent fill-accent" />
          </div>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-accent/10 blur-3xl pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30 shadow-inner"
            >
              <Brain className="h-6 w-6" />
            </motion.div>
            <h3 className="text-xl font-bold font-heading text-white">AI Coach Insights</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
              {workoutLogs && workoutLogs.length > 0
                ? `You have logged ${workoutLogs.length} workout sessions. Keep up the consistency for optimal results. Visit the AI Coach for personalized advice.`
                : "Start logging your workouts to receive personalized AI coaching insights tailored to your training data."}
            </p>
          </div>
          
          <div className="space-y-3.5 pt-4 relative z-10">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-white bg-slate-950/40 p-2.5 border border-white/5 rounded-xl">
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span>{workoutLogs && workoutLogs.length > 0 ? `${workoutLogs.length} total sessions logged` : "Start your first workout"}</span>
            </div>
            <Link href="/ai-coach" className="block w-full">
              <Button
                variant="outline"
                className="w-full border-accent/25 hover:bg-accent/10 hover:text-white transition-all text-xs font-bold rounded-xl h-11 group"
              >
                Launch Coach Consult
                <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Action Center Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Action Center Controls */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold font-heading px-2 text-white">
            Action Center
          </h2>
          <Card className="p-6 sm:p-8 glass border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary via-accent to-secondary" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Leg Day Challenge Card */}
              <motion.div
                whileHover={{ y: -5 }}
                onClick={() => setIsChallengeOpen(true)}
                className={cn(
                  "flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/30 hover:bg-secondary/5 transition-all cursor-pointer group relative overflow-hidden",
                  challengeJoined && "border-secondary/20 bg-secondary/[0.02]"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/25 group-hover:scale-105 transition-transform">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-secondary transition-colors">
                      Leg Day Challenge
                    </p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                      {challengeJoined ? "Protocol Participating" : "Starts in 2 days"}
                    </p>
                  </div>
                </div>

                {challengeJoined && (
                  <div className="mt-4 space-y-2 text-left">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground">
                      <span>Progress bar</span>
                      <span className="text-secondary">{getChallengeProgress()}% Completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${getChallengeProgress()}%` }}
                        className="h-full bg-gradient-to-r from-secondary to-green-400 rounded-full transition-all duration-500" 
                      />
                    </div>
                    <span className="text-[8px] text-secondary font-bold uppercase tracking-wider block mt-1">
                      Check items inside to advance progress
                    </span>
                  </div>
                )}
              </motion.div>

              {/* PR Verification Card */}
              <motion.div
                whileHover={{ y: -5 }}
                onClick={() => setIsPrOpen(true)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent border border-accent/25 group-hover:scale-105 transition-transform">
                  <Trophy className="h-5 w-5 animate-bounce" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">
                    New PR Detected
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                    Verify Bench Press Log
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Start Routine Button */}
            {activeWorkoutId ? (
              <Link href={`/workout/${activeWorkoutId}`} className="block w-full">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl text-base shadow-xl shadow-secondary/10 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10 flex items-center justify-center">
                    Enter Live Workout Session
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            ) : (
              <Link href="/workout/builder" className="block w-full">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl text-base shadow-xl shadow-secondary/10 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10 flex items-center justify-center">
                    Create Personal Workout Plan
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            )}
          </Card>
        </div>

        {/* Quick Tips */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading px-2 text-white">
            Daily Motivation
          </h2>
          <Card className="p-8 bg-gradient-to-br from-indigo-900/35 to-slate-900 border border-white/5 rounded-[2.5rem] relative overflow-hidden group shadow-xl min-h-[220px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Award className="h-20 w-20 text-indigo-400" />
            </div>
            <div className="space-y-3.5 text-left relative z-10">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                <Compass className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Pro Tip</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                Consistency is the foundation of all progress. Log your workouts daily, track your nutrition, and prioritize recovery. Small wins compound into extraordinary results.
              </p>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {/* 1. Dynamic Exercise Details Drawer Modal */}
        {selectedExercise && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <Card className="w-full max-w-lg glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl text-left max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/20 shadow-inner">
                    <Dumbbell className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-white">{selectedExercise.name}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-secondary/20 text-secondary border border-secondary/30 px-2.5 py-1 rounded-xl">
                      {selectedExercise.category}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase bg-white/5 text-muted-foreground border border-white/10 px-2.5 py-1 rounded-xl">
                      {selectedExercise.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl text-left">
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Target Muscles</p>
                      <p className="text-xs font-bold text-white mt-1 capitalize">
                        {selectedExercise.muscleGroups}
                      </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl text-left">
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Equipment Needed</p>
                      <p className="text-xs font-bold text-white mt-1 capitalize">
                        {selectedExercise.equipment}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-left">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Execution Protocol</p>
                    <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                      {selectedExercise.instructions}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedExercise(null)}
                    className="flex-1 border-white/10 border h-12 rounded-2xl font-bold text-xs"
                  >
                    Close Details
                  </Button>
                  <Link href="/workout" className="flex-1">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-2xl text-xs shadow-lg shadow-secondary/15">
                      Launch Workout Logs
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* 2. Dynamic Streak Calendar Modal */}
        {isStreakModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <Card className="w-full max-w-lg glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl text-left">
                <button
                  onClick={() => setIsStreakModalOpen(false)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/25 shadow-inner">
                    <Flame className="h-6 w-6 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-white">Active Streak Calendar</h3>
                  <p className="text-xs text-muted-foreground">
                    Chronological activity logging mapped over your past 30 days of training.
                  </p>
                </div>

                {/* Streak Grid Calendar heat map */}
                <div className="bg-slate-900/65 border border-white/5 p-4 sm:p-6 rounded-[2rem] space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Streak Progress Calendar
                    </span>
                    <span className="text-xs font-mono font-bold text-secondary">
                      {dynamicStreak} Consecutive Days Logged
                    </span>
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-7 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {generatePast30Days().map((day) => {
                      const isActive = finalActiveDates.includes(day.dateStr);

                      return (
                        <div
                          key={day.dateStr}
                          title={`${day.monthStr} ${day.dayNum} (${day.dayOfWeek}) - ${isActive ? "Workout Logged! 🔥" : "No Activity Logged"}`}
                          className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl border aspect-square transition-all duration-300 relative group/cell hover:scale-105",
                            isActive
                              ? "bg-gradient-to-br from-orange-500/20 to-amber-500/25 border-orange-500/40 text-orange-400 shadow-md shadow-orange-500/5"
                              : "bg-white/5 border-white/5 text-muted-foreground"
                          )}
                        >
                          <span className="text-[8px] opacity-60 font-bold uppercase tracking-wider leading-none">
                            {day.dayOfWeek}
                          </span>
                          <span className="text-xs font-mono font-bold mt-1 text-white leading-none">
                            {day.dayNum}
                          </span>
                          {isActive && (
                            <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-1.5 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => setIsStreakModalOpen(false)}
                    className="flex-1 border-white/10 border h-12 rounded-2xl font-bold text-xs"
                  >
                    Close Calendar
                  </Button>
                  <Button
                    onClick={handleShareStreak}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-2xl text-xs shadow-lg shadow-secondary/15 flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    {isStreakShared ? "Copied Streak! ⚡" : "Share Streak Protocol"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* 3. Leg Day Challenge Modal */}
        {isChallengeOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <Card className="w-full max-w-md glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl text-left">
                <button
                  onClick={() => setIsChallengeOpen(false)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/25 shadow-inner">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-white">Leg Day Challenge</h3>
                  <p className="text-xs text-muted-foreground">Community accountability protocol.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed bg-white/[0.02] border border-white/5 p-5 rounded-2xl font-semibold">
                    <p>Join 1,204 active athletes in this high-intensity overload cycle. Perform any leg-focused routine twice a week for 30 consecutive days.</p>
                    <div className="flex justify-between text-[10px] font-mono font-bold text-white pt-3 border-t border-white/5">
                      <span>Start: May 25, 2026</span>
                      <span className="text-secondary">Tier: Active Athlete</span>
                    </div>
                  </div>

                  {/* Challenge Checklists if joined */}
                  {challengeJoined && (
                    <div className="space-y-3 p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 px-1">
                        Challenge Progress Checklist
                      </p>
                      <div className="space-y-2.5">
                        {[
                          "Complete 1 Heavy Squat Workout session",
                          "Record dynamic body weight in progress metrics",
                          "Consult AI coach for hamstring stretching logs"
                        ].map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => toggleChallengeCheck(idx)}
                            className="flex items-center gap-3 cursor-pointer group/item"
                          >
                            <div className={cn(
                              "h-5 w-5 rounded-lg border flex items-center justify-center transition-all",
                              challengeCheckedItems[idx] 
                                ? "bg-secondary border-secondary text-primary" 
                                : "border-white/20 hover:border-secondary/40 bg-white/5"
                            )}>
                              {challengeCheckedItems[idx] && <CheckCircle2 className="h-3.5 w-3.5 text-primary stroke-[3px]" />}
                            </div>
                            <span className={cn(
                              "text-xs font-semibold select-none transition-colors",
                              challengeCheckedItems[idx] ? "text-muted-foreground line-through" : "text-white group-hover/item:text-secondary"
                            )}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsChallengeOpen(false)}
                    className="flex-1 border-white/10 border h-12 rounded-2xl font-bold text-xs"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleJoinChallenge}
                    disabled={challengeJoined && getChallengeProgress() === 100}
                    className={cn(
                      "flex-1 font-bold h-12 rounded-2xl text-xs shadow-lg transition-all",
                      challengeJoined 
                        ? "bg-white/5 border border-white/10 text-muted-foreground cursor-default shadow-none" 
                        : "bg-secondary hover:bg-secondary/90 text-primary shadow-secondary/15"
                    )}
                  >
                    {challengeJoined ? "Protocol Joined" : "Join Challenge"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* 4. PR Verification Modal */}
        {isPrOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <Card className="w-full max-w-md glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl text-left overflow-hidden">
                
                {/* dynamic confetti/sparkles visual overlay */}
                <AnimatePresence>
                  {showPrCelebration && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center z-50 space-y-4"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-secondary/10 animate-pulse pointer-events-none" />
                      <motion.div 
                        initial={{ scale: 0.5, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="relative"
                      >
                        <div className="absolute -inset-4 rounded-full bg-accent/20 blur-xl animate-ping" />
                        <Trophy className="h-20 w-20 text-accent animate-bounce" />
                      </motion.div>
                      <div className="text-center space-y-2 relative z-10 px-6">
                        <h3 className="text-3xl font-extrabold font-heading text-white tracking-tight animate-pulse uppercase leading-none">
                          PR Locked In! 🚀🏋️‍♂️
                        </h3>
                        <p className="text-sm font-semibold text-secondary">
                          Bench Press Load set at {prWeight} kg!
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-normal mt-2 max-w-xs mx-auto">
                          A progressive overload record has been successfully logged to your progress charts. Complete synchronization.
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                          <Sparkles key={i} className={cn("h-5 w-5 text-accent animate-pulse", i % 2 === 0 ? "text-secondary" : "")} style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setIsPrOpen(false)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent border border-accent/25 shadow-inner mb-4 animate-bounce">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-white">New PR Detected</h3>
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
                    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 text-left">
                      <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                        Our performance matrices detected a possible 1-Rep Max Bench Press milestone. Confirm your logged load metric:
                      </p>
                      <div className="flex items-center gap-4 justify-center py-3 bg-slate-950/20 border border-white/5 rounded-xl">
                        <span className="text-xs font-bold text-white">Bench Press Load:</span>
                        <Input
                          type="number"
                          value={prWeight}
                          onChange={(e) => setPrWeight(parseFloat(e.target.value) || 0)}
                          className="w-24 text-center font-mono font-bold h-10 border-white/15 bg-white/5 rounded-xl text-sm focus-visible:ring-accent/40 focus:bg-slate-900/90 text-white"
                        />
                        <span className="text-xs font-bold text-muted-foreground">kg</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsPrOpen(false)}
                        className="flex-1 border-white/10 border h-12 rounded-2xl font-bold text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleVerifyPr}
                        disabled={isPrSaving}
                        className="flex-1 bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-2xl shadow-lg shadow-accent/15 text-xs gap-2"
                      >
                        {isPrSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                        Confirm PR
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
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
    <Link href={href} className="block group">
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="p-6 sm:p-8 glass border-white/5 rounded-[2.5rem] group-hover:border-white/15 group-hover:shadow-2xl transition-all relative overflow-hidden h-full flex flex-col justify-between text-left">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
              gradient
            )}
          />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-background/50 flex items-center justify-center border border-white/5 group-hover:border-white/10 group-hover:scale-105 transition-all shadow-inner">
                {icon}
              </div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-none">
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
          {/* Subtle line indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-secondary group-hover:w-full transition-all duration-500 opacity-50" />
        </Card>
      </motion.div>
    </Link>
  );
}
