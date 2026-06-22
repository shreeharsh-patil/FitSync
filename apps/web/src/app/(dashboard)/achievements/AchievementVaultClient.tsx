"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  Flame,
  Trophy,
  Zap,
  Target,
  Users,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AchievementVaultClientProps {
  user: any;
  dbUser: any;
  achievements: any[];
  streak: number;
}

const BADGE_DEFINITIONS = [
  { type: "first_workout", name: "First Steps", desc: "Completed your first workout session.", icon: Zap, color: "text-secondary", bgColor: "bg-secondary/15", borderColor: "border-secondary/30" },
  { type: "five_workouts", name: "Getting Serious", desc: "Completed 5 workout sessions.", icon: Trophy, color: "text-yellow-400", bgColor: "bg-yellow-500/15", borderColor: "border-yellow-500/30" },
  { type: "ten_workouts", name: "Dedicated Athlete", desc: "Completed 10 workout sessions.", icon: Award, color: "text-accent", bgColor: "bg-accent/15", borderColor: "border-accent/30" },
  { type: "first_meal", name: "Fuel Up", desc: "Logged your first meal.", icon: Sparkles, color: "text-green-400", bgColor: "bg-green-500/15", borderColor: "border-green-500/30" },
  { type: "streak_3", name: "Consistency Spark", desc: "Maintained a 3-day workout streak.", icon: Flame, color: "text-orange-400", bgColor: "bg-orange-500/15", borderColor: "border-orange-500/30" },
  { type: "streak_7", name: "Full Week", desc: "Maintained a 7-day workout streak.", icon: Target, color: "text-blue-400", bgColor: "bg-blue-500/15", borderColor: "border-blue-500/30" },
  { type: "streak_30", name: "Monthly Warrior", desc: "Maintained a 30-day workout streak.", icon: Flame, color: "text-red-400", bgColor: "bg-red-500/15", borderColor: "border-red-500/30" },
  { type: "first_post", name: "Social Butterfly", desc: "Made your first community post.", icon: Users, color: "text-purple-400", bgColor: "bg-purple-500/15", borderColor: "border-purple-500/30" },
  { type: "weight_logged", name: "Metric Tracker", desc: "Logged your body weight for the first time.", icon: TrendingUp, color: "text-cyan-400", bgColor: "bg-cyan-500/15", borderColor: "border-cyan-500/30" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
} as const;

export function AchievementVaultClient({ user, dbUser, achievements, streak }: AchievementVaultClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "performance" | "consistency" | "social">("all");

  const unlockedTypes = new Set(achievements.map((a: any) => a.badgeType));
  const unlockedCount = achievements.length;

  const badges = BADGE_DEFINITIONS.map((def, idx) => {
    const unlocked = unlockedTypes.has(def.type);
    const achievementData = achievements.find((a: any) => a.badgeType === def.type);
    return {
      id: String(idx),
      name: def.name,
      desc: def.desc,
      category: idx < 3 ? "performance" : idx < 6 ? "consistency" : "social",
      unlocked,
      unlockedDate: achievementData ? new Date(achievementData.earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
      progress: unlocked ? 100 : 0,
      icon: def.icon,
      color: def.color,
      bgColor: def.bgColor,
      borderColor: def.borderColor,
    };
  });

  const filteredBadges = badges.filter(
    (b) => selectedCategory === "all" || b.category === selectedCategory
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 pb-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-gradient-to-br from-secondary/20 to-slate-900 border-secondary/30 border-[2px] rounded-[3rem] h-full relative overflow-hidden group shadow-2xl shadow-secondary/5">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-secondary/15 blur-3xl rounded-full animate-pulse" />
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-[1.5rem] bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/30 shadow-inner">
                  <Flame className="h-8 w-8 animate-pulse fill-secondary" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none">
                    Athlete: {user?.name || dbUser?.name || "You"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-extrabold font-heading text-white tracking-tighter">{streak} Days</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Active Training Streak</p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                  {streak >= 30 ? "Legendary Status" : streak >= 7 ? "Consistent Athlete" : streak >= 3 ? "Building Momentum" : "Start Your Streak"}
                </p>
                <div className="h-1.5 w-full bg-black/40 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
                    className="h-full bg-secondary" 
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-8 glass border-white/5 rounded-[3rem] h-full relative overflow-hidden group shadow-2xl">
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-[1.5rem] bg-accent/15 flex items-center justify-center text-accent border border-accent/30 shadow-inner">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Platform</p>
                  <p className="text-2xl font-bold text-white mt-1">Personal</p>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-extrabold font-heading text-white tracking-tighter">
                  {unlockedCount === 0 ? "Getting Started" : unlockedCount >= 5 ? "Elite" : "Rising"}
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  {unlockedCount} Badge{unlockedCount !== 1 ? "s" : ""} Unlocked
                </p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={cn("h-2 flex-1 rounded-full", i <= Math.ceil((unlockedCount / BADGE_DEFINITIONS.length) * 5) ? "bg-accent" : "bg-white/5")} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-8 glass border-white/5 rounded-[3rem] h-full relative overflow-hidden group shadow-2xl">
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-[1.5rem] bg-yellow-500/15 flex items-center justify-center text-yellow-400 border border-yellow-500/30 shadow-inner">
                  <Award className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Unlocked</p>
                  <p className="text-2xl font-bold text-white mt-1">{unlockedCount}/{BADGE_DEFINITIONS.length}</p>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-extrabold font-heading text-white tracking-tighter">
                  {unlockedCount >= 7 ? "Platinum" : unlockedCount >= 4 ? "Gold" : unlockedCount >= 2 ? "Silver" : "Bronze"} Tier
                </h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Achievement Protocol</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={cn("h-2 flex-1 rounded-full", i <= Math.ceil((unlockedCount / BADGE_DEFINITIONS.length) * 5) ? "bg-yellow-500" : "bg-white/5")} />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-8">
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            Badges
            <Sparkles className="h-5 w-5 text-secondary" />
          </h2>

          <div className="flex bg-muted/40 p-1.5 rounded-2xl border border-white/5">
            {(["all", "performance", "consistency", "social"] as const).map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "text-[10px] h-9 px-6 rounded-xl font-extrabold uppercase tracking-widest transition-all",
                  selectedCategory === cat 
                    ? "bg-background text-secondary shadow-lg border border-white/5" 
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBadges.map((badge) => (
              <motion.div
                key={badge.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={cn(
                  "p-8 glass border-white/5 rounded-[3rem] h-full relative overflow-hidden transition-all duration-500 group cursor-pointer",
                  badge.unlocked ? "hover:border-secondary/30 hover:bg-white/[0.04]" : "opacity-60 grayscale-[0.5]"
                )}>
                  {!badge.unlocked && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
                      <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2">
                        <Lock className="h-6 w-6 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Locked</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6 relative z-10">
                    <div className={cn(
                      "h-20 w-20 rounded-[2rem] flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6",
                      badge.bgColor,
                      badge.borderColor,
                      badge.color
                    )}>
                      <badge.icon className="h-10 w-10" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors leading-tight">
                          {badge.name}
                        </h3>
                        {badge.unlocked && (
                          <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {badge.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      {badge.unlocked ? (
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            Unlocked {badge.unlockedDate || "Recently"}
                          </span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/5">
                            <Share2 className="h-4 w-4 text-secondary" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-1">
                            <span className="text-muted-foreground">Keep Training</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
