"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/providers";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Dumbbell, Utensils, LineChart, UserCircle, Settings, Activity,
  MessageSquare, Trophy, Users, LogOut, ChevronRight, Award, Target,
} from "lucide-react";
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workout", href: "/dashboard/workout", icon: Dumbbell },
  { name: "Nutrition", href: "/dashboard/nutrition", icon: Utensils },
  { name: "Progress", href: "/dashboard/progress", icon: LineChart },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Challenges", href: "/dashboard/challenges", icon: Target },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { name: "AI Coach", href: "/dashboard/ai-coach", icon: MessageSquare },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const mobileNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workout", href: "/dashboard/workout", icon: Dumbbell },
  { name: "Eat", href: "/dashboard/nutrition", icon: Utensils },
  { name: "Progress", href: "/dashboard/progress", icon: LineChart },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-full w-72 bg-card/30 backdrop-blur-xl border-r border-white/5 relative z-20 shrink-0">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5, type: "spring" }}
              className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,201,167,0.1)]">
              <Activity className="h-6 w-6" />
            </motion.div>
            <span className="text-2xl font-bold font-heading tracking-tighter text-white">FitSync</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href) || false;
            return (
              <Link key={item.name} href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive ? "bg-secondary/10 text-secondary shadow-[inset_0_0_20px_rgba(0,201,167,0.05)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}>
                {isActive && <motion.div layoutId="nav-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-full shadow-[0_0_10px_rgba(0,201,167,0.5)]" />}
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-secondary" : "group-hover:text-foreground")} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="p-4 rounded-[2rem] bg-gradient-to-br from-primary/40 to-background border border-white/5 relative overflow-hidden group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary text-xs shadow-lg shadow-secondary/30">
                AT
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold truncate text-white">Athlete</span>
                <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Active Plan</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/10 border border-secondary/20">
                <span className="text-[10px] font-bold text-secondary">Lv.8</span>
              </div>
              <span className="text-[9px] text-muted-foreground font-semibold">Iron Athlete</span>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-3 w-full px-4 py-3 mt-3 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all group">
            <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm tracking-wide">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-mesh">
        <div className="max-w-7xl mx-auto p-6 lg:p-10 pb-24 lg:pb-10">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="flex lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-white/5 h-20 items-center justify-around px-4 z-40">
        {mobileNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href) || false;
          return (
            <Link key={item.name} href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all ${isActive ? "text-secondary font-bold" : "text-muted-foreground"}`}>
              {isActive && <motion.div layoutId="mobile-nav" className="absolute top-0 h-1 w-6 bg-secondary rounded-full shadow-[0_0_10px_rgba(0,201,167,0.5)]" />}
              <item.icon className={cn("h-5 w-5", isActive ? "text-secondary scale-110" : "")} />
              <span className="text-[9px] uppercase tracking-wider font-bold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
    </AuthProvider>
  );
}
