"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  LineChart,
  Users,
  MessageSquare,
  Settings,
  Activity,
  LogOut,
  ChevronRight,
  UserCircle,
  Award,
  MessageCircle,
  Trophy,
  Target,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "Workout", href: "/workout", icon: Dumbbell },
  { name: "Nutrition", href: "/nutrition", icon: Utensils },
  { name: "Progress", href: "/progress", icon: LineChart },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Community", href: "/community", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "AI Coach", href: "/ai-coach", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

// 5 critical items for mobile navigation to prevent cluttering
const mobileNavItems = [
  { name: "Dash", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workout", href: "/workout", icon: Dumbbell },
  { name: "Eat", href: "/nutrition", icon: Utensils },
  { name: "Metrics", href: "/progress", icon: LineChart },
  { name: "Coach", href: "/ai-coach", icon: MessageSquare },
];

export function SideNavBar({ user }: { user?: any }) {
  const pathname = usePathname();

  const displayName = user?.name || "Athlete";
  const userInitials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AT";
  const fitnessGoalText = user?.fitnessGoal
    ? `${user.fitnessGoal.charAt(0).toUpperCase() + user.fitnessGoal.slice(1).toLowerCase()} Plan`
    : "Active Athlete";

  return (
    <>
      {/* 1. Desktop Side Navigation Bar (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col h-full w-72 bg-card/30 backdrop-blur-xl border-r border-white/5 relative z-20 shrink-0">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 group-hover:bg-secondary/20 transition-all shadow-[0_0_15px_rgba(0,201,167,0.1)] group-hover:shadow-[0_0_20px_rgba(0,201,167,0.3)]"
            >
              <Activity className="h-6 w-6" />
            </motion.div>
            <span className="text-2xl font-bold font-heading tracking-tighter text-white">
              FitSync
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Main Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href) || false;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-secondary/10 text-secondary shadow-[inset_0_0_20px_rgba(0,201,167,0.05)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-full shadow-[0_0_10px_rgba(0,201,167,0.5)]" 
                  />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-secondary" : "group-hover:text-foreground",
                  )}
                />
                <span className="font-bold text-sm tracking-wide">
                  {item.name}
                </span>
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                )}
                {/* Subtle hover sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </Link>
            );
          })}
        </nav>

        <div className="p-6 space-y-4">
          <Link href="/profile">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-[2rem] bg-gradient-to-br from-primary/40 to-background border border-white/5 relative overflow-hidden group hover:border-secondary/20 transition-all cursor-pointer shadow-lg"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="h-16 w-16 text-secondary" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary text-xs shadow-lg shadow-secondary/30 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">{userInitials}</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold truncate text-white">{displayName}</span>
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                    {fitnessGoalText}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm tracking-wide">Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2. Mobile Responsive Bottom Navigation Bar (Hidden on desktop) */}
      <div className="flex lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/85 backdrop-blur-xl border-t border-white/5 h-20 items-center justify-around px-4 z-40 pb-safe">
        {mobileNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href) || false;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                isActive ? "text-secondary font-bold" : "text-muted-foreground hover:text-white"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="mobile-active-indicator"
                  className="absolute top-0 h-1 w-6 bg-secondary rounded-full shadow-[0_0_10px_rgba(0,201,167,0.5)]" 
                />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive ? "text-secondary scale-110" : ""
                )}
              />
              <span className="text-[9px] uppercase tracking-wider font-bold">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
