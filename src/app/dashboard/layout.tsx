"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/providers";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Dumbbell, Utensils, LineChart, UserCircle, Settings,
  MessageSquare, Trophy, Users, LogOut, Target, Menu, X, PanelLeftClose, PanelLeft,
} from "lucide-react";
import LogoMark from "@/components/LogoMark";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AuthProvider>
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col h-full bg-bg-secondary border-r border-border relative z-20 shrink-0 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo + collapse toggle */}
        <div className={cn("flex items-center", collapsed ? "flex-col gap-3 px-2 py-5" : "px-4 py-7 justify-between")}>
          <Link href="/dashboard" className={cn("flex items-center group", collapsed ? "justify-center" : "gap-3")}>
            <div className="h-9 w-9 rounded-lg bg-accent-coral/10 flex items-center justify-center group-hover:bg-accent-coral/20 transition-all shrink-0">
              <LogoMark size={20} />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold font-heading tracking-tight text-text-primary">Fitsync</span>
            )}
          </Link>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-black/[0.03] transition-all"
              title="Collapse sidebar">
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-black/[0.03] transition-all"
              title="Expand sidebar">
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {!collapsed && (
            <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-3">Main Menu</p>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}
                className={cn(
                  "flex items-center rounded-xl transition-all duration-200 group relative",
                  collapsed
                    ? "justify-center h-10 w-10 mx-auto"
                    : "gap-3 px-3 py-2.5 text-sm",
                  isActive
                    ? "bg-accent-coral/10 text-accent-coral font-semibold"
                    : "text-text-muted hover:bg-black/[0.03] hover:text-text-secondary"
                )}
                title={collapsed ? item.name : undefined}>
                {isActive && !collapsed && (
                  <motion.div layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-coral rounded-full" />
                )}
                {isActive && collapsed && (
                  <motion.div layoutId="nav-indicator-collapsed"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-coral rounded-full" />
                )}
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-accent-coral" : "")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User area */}
        <div className={cn("border-t border-border", collapsed ? "p-2" : "p-4")}>
          <div className={cn(
            "flex rounded-xl bg-bg-primary border border-border mb-2",
            collapsed ? "items-center justify-center h-10 w-10 mx-auto" : "items-center gap-3 px-3 py-2.5"
          )}>
            <div className="h-8 w-8 rounded-lg bg-accent-coral/20 flex items-center justify-center font-bold text-xs text-accent-coral shrink-0">
              AT
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary truncate">Athlete</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-accent-coral font-semibold">Active</span>
                  <span className="text-[9px] text-text-muted">· Lv.8</span>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "flex items-center rounded-xl text-text-muted hover:bg-red-50 hover:text-red-600 transition-all text-sm group",
              collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 w-full px-3 py-2.5"
            )}
            title={collapsed ? "Sign Out" : undefined}>
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoMark size={20} />
          <span className="text-lg font-bold font-heading tracking-tight text-text-primary">Fitsync</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-text-secondary hover:bg-bg-secondary transition-all">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-bg-primary border-r border-border transform transition-transform duration-300 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-6 py-7 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <LogoMark size={24} />
            <span className="text-xl font-bold font-heading tracking-tight text-text-primary">Fitsync</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-text-secondary hover:bg-bg-secondary transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm",
                  isActive
                    ? "bg-accent-coral/10 text-accent-coral font-semibold"
                    : "text-text-muted hover:bg-black/[0.03] hover:text-text-secondary"
                )}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-border">
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-600 transition-all text-sm">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto p-6 lg:p-10 pb-24 lg:pb-10">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="flex lg:hidden fixed bottom-0 left-0 right-0 bg-bg-primary/90 backdrop-blur-xl border-t border-border h-18 items-center justify-around px-2 z-40">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all relative ${
                isActive ? "text-accent-coral" : "text-text-muted"
              }`}>
              {isActive && (
                <motion.div layoutId="mobile-nav"
                  className="absolute -top-0.5 h-0.5 w-6 bg-accent-coral rounded-full" />
              )}
              <item.icon className={cn("h-5 w-5", isActive ? "scale-110" : "")} />
              <span className="text-[8px] uppercase tracking-wider font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
    </AuthProvider>
  );
}
