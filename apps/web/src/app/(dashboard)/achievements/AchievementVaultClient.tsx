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
  Star,
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

export function AchievementVaultClient({ user }: AchievementVaultClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "performance" | "consistency" | "social">("all");

  const badges = [
    {
      id: "1",
      name: "Standard Overload",
      desc: "Completed 5 consecutive workouts with increased load.",
      category: "performance",
      unlocked: true,
      unlockedDate: "May 24, 2026",
      icon: Zap,
      color: "text-secondary",
      bgColor: "bg-secondary/15",
      borderColor: "border-secondary/30",
    },
    {
      id: "2",
      name: "Centurion Club",
      desc: "Logged over 100 sets in a single training week.",
      category: "performance",
      unlocked: true,
      unlockedDate: "May 18, 2026",
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/15",
      borderColor: "border-yellow-500/30",
    },
    {
      id: "3",
      name: "Early Riser Protocol",
      desc: "Complete 10 workouts before 07:00 AM.",
      category: "consistency",
      unlocked: false,
      progress: 70,
      icon: Target,
      color: "text-blue-400",
      bgColor: "bg-blue-500/15",
      borderColor: "border-blue-500/30",
    },
    {
      id: "4",
      name: "Social Catalyst",
      desc: "Your training logs reached 500+ athlete likes.",
      category: "social",
      unlocked: true,
      unlockedDate: "May 12, 2026",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/15",
      borderColor: "border-purple-500/30",
    },
    {
      id: "5",
      name: "Hypertrophy Master",
      desc: "Achieve a calculated volume of 500,000kg in a month.",
      category: "performance",
      unlocked: false,
      progress: 35,
      icon: Award,
      color: "text-accent",
      bgColor: "bg-accent/15",
      borderColor: "border-accent/30",
    },
    {
      id: "6",
      name: "Cellular Synchronicity",
      desc: "Maintain perfect macro ratios for 14 consecutive days.",
      category: "consistency",
      unlocked: true,
      unlockedDate: "May 28, 2026",
      icon: Sparkles,
      color: "text-green-400",
      bgColor: "bg-green-500/15",
      borderColor: "border-green-500/30",
    },
  ];

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
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Streak HUD */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 bg-gradient-to-br from-secondary/20 to-slate-900 border-secondary/30 border-[2px] rounded-[3rem] h-full relative overflow-hidden group shadow-2xl shadow-secondary/5">
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-secondary/15 blur-3xl rounded-full animate-pulse" />
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-[1.5rem] bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/30 shadow-inner">
                  <Flame className="h-8 w-8 animate-pulse fill-secondary" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Multiplier</p>
                  <p className="text-2xl font-bold text-white mt-1">1.5x XP</p>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-extrabold font-heading text-white tracking-tighter">12 Days</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Active Training Streak</p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">3 Days to Next Level Up</p>
                <div className="h-1.5 w-full bg-black/40 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    className="h-full bg-secondary" 
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Platform Ranking HUD */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 glass border-white/5 rounded-[3rem] h-full relative overflow-hidden group shadow-2xl">
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-[1.5rem] bg-accent/15 flex items-center justify-center text-accent border border-accent/30 shadow-inner">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Platform</p>
                  <p className="text-2xl font-bold text-white mt-1">Global</p>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-extrabold font-heading text-white tracking-tighter">Top 5%</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Athlete Performance Rank</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Points</p>
                  <p className="text-lg font-bold text-white">12,450</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/30" />
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Rank</p>
                  <p className="text-lg font-bold text-white">#1,204</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Badge Count HUD */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 glass border-white/5 rounded-[3rem] h-full relative overflow-hidden group shadow-2xl">
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="h-14 w-14 rounded-[1.5rem] bg-yellow-500/15 flex items-center justify-center text-yellow-400 border border-yellow-500/30 shadow-inner">
                  <Award className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Unlocked</p>
                  <p className="text-2xl font-bold text-white mt-1">18/45</p>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-extrabold font-heading text-white tracking-tighter">Gold Tier</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Achievement Protocol</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={cn("h-2 flex-1 rounded-full", i <= 3 ? "bg-yellow-500" : "bg-white/5")} />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Badges Filter & Grid */}
      <div className="space-y-8">
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
            Unlocked Badges
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
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Locked Module</span>
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
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Unlocked {badge.unlockedDate}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/5">
                            <Share2 className="h-4 w-4 text-secondary" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-1">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="text-secondary">{badge.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-[70%]" style={{ width: `${badge.progress}%` }} />
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

      {/* Platform Milestones Timeline */}
      <motion.div variants={itemVariants} className="space-y-8">
        <h2 className="text-2xl font-bold font-heading text-white px-4">
          Synchronicity Timeline
        </h2>
        <Card className="p-10 glass border-white/5 rounded-[3rem] relative overflow-hidden">
          <div className="space-y-12 relative z-10">
            <TimelineItem 
              date="Today, 08:30 AM"
              title="Hypertrophy Protocol Executed"
              desc="Successfully logged Upper Body A session with a total volume of 18,500 kg."
              icon={Flame}
              color="text-secondary"
            />
            <TimelineItem 
              date="Yesterday"
              title="Metric Sync: Weight transformation"
              desc="Recorded current body weight at 78.4kg. Trend indicates optimized caloric deficit."
              icon={Target}
              color="text-accent"
            />
            <TimelineItem 
              date="May 26, 2026"
              title="Social Matrix Connection"
              desc="Your 'Bench Press PR' post reached 100+ athlete views in the community feed."
              icon={Users}
              color="text-blue-400"
            />
            <TimelineItem 
              date="May 24, 2026"
              title="Standard Overload Badge Unlocked"
              desc="Achieved for maintaining progressive overload indices across 5 target modules."
              icon={Award}
              isLast
              color="text-yellow-400"
            />
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function TimelineItem({ 
  date, 
  title, 
  desc, 
  icon: Icon, 
  isLast = false,
  color,
}: { 
  date: string; 
  title: string; 
  desc: string; 
  icon: any; 
  isLast?: boolean;
  color: string;
}) {
  return (
    <div className="flex gap-8 relative group">
      {!isLast && (
        <div className="absolute left-[27px] top-10 bottom-[-48px] w-0.5 bg-white/5 group-hover:bg-secondary/20 transition-colors" />
      )}
      <div className={cn(
        "h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative z-10 group-hover:border-secondary/30 transition-all shadow-inner",
        color
      )}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2 pt-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{date}</p>
        <h4 className="text-xl font-bold text-white group-hover:text-secondary transition-colors">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium max-w-2xl">{desc}</p>
      </div>
    </div>
  );
}
