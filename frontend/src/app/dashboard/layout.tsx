"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";
import { useAuth } from "@/lib/auth-context";
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
  const [userInfo, setUserInfo] = useState<{ name: string; level: number; xp: number } | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data._id) setUserInfo({ name: data.name, level: data.level || 1, xp: data.xp || 0 });
      })
      .catch(() => {});
  }, []);

  const { logout, user } = useAuth();

  // User info from auth context
  const displayName = user?.name || userInfo?.name || "Athlete";
  const displayLevel = userInfo?.level || 1;
  const displayXp = userInfo?.xp || 0;

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col h-full bg-surface-1 border-r border-border relative z-20 shrink-0 transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}>
        <div className={cn("flex items-center", collapsed ? "flex-col gap-3 px-2 py-5" : "px-4 py-5 justify-between")}>
          <Link href="/dashboard" className={cn("flex items-center group", collapsed ? "justify-center" : "")}>
            {collapsed ? (
              <span className="text-base font-black tracking-wider text-text-primary font-[family-name:var(--font-display)]">
                F<span className="text-accent">S</span>
              </span>
            ) : (
              <span className="text-lg font-black tracking-tighter text-text-primary font-[family-name:var(--font-display)]">
                Fit<span className="text-accent">Sync</span>
              </span>
            )}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-3 transition-all"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto custom-scrollbar mt-2">
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">Menu</p>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-150 group relative",
                  collapsed
                    ? "justify-center h-9 w-9 mx-auto"
                    : "gap-2.5 px-3 py-2 text-sm",
                  isActive
                    ? "bg-accent-dim text-accent font-semibold"
                    : "text-text-muted hover:bg-surface-2 hover:text-text-secondary"
                )}
                title={collapsed ? item.name : undefined}>
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-accent" : "")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={cn("border-t border-border", collapsed ? "p-2" : "p-3")}>
          <div className={cn(
            "flex rounded-lg bg-surface-2 border border-border mb-2",
            collapsed ? "items-center justify-center h-9 w-9 mx-auto" : "items-center gap-2.5 px-3 py-2"
          )}>
            <div className="h-7 w-7 rounded-md bg-accent-dim flex items-center justify-center font-bold text-[10px] text-accent shrink-0">
              {displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-text-primary truncate">{displayName}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-accent font-semibold">Active</span>
                  <span className="text-[9px] text-text-muted">Lv.{displayLevel}</span>
                </div>
              </div>
            )}
          </div>
          <button onClick={logout}
            className={cn(
              "flex items-center rounded-lg text-text-muted hover:bg-danger/10 hover:text-danger transition-all text-sm",
              collapsed ? "justify-center h-9 w-9 mx-auto" : "gap-2.5 w-full px-3 py-2"
            )}
            title={collapsed ? "Sign Out" : undefined}>
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-surface-0/95 backdrop-blur-xl border-b border-border">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-base font-black tracking-tighter text-text-primary">Fit<span className="text-accent">Sync</span></span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-text-secondary hover:bg-surface-2 transition-all">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-surface-1 border-r border-border transform transition-transform duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-lg font-black tracking-tighter text-text-primary font-[family-name:var(--font-display)]">Fit<span className="text-accent">Sync</span></span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-text-secondary hover:bg-surface-2 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm",
                  isActive
                    ? "bg-accent-dim text-accent font-semibold"
                    : "text-text-muted hover:bg-surface-2 hover:text-text-secondary"
                )}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 mt-3 border-t border-border">
            <button onClick={logout}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-text-muted hover:bg-danger/10 hover:text-danger transition-all text-sm">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8 pb-24 lg:pb-10">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="flex lg:hidden fixed bottom-0 left-0 right-0 bg-surface-1/95 backdrop-blur-xl border-t border-border h-[68px] items-center justify-around px-2 z-40 safe-area-bottom">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all relative min-w-[52px] ${
                isActive ? "text-accent" : "text-text-muted"
              }`}>
              {isActive && (
                <div className="absolute top-0 h-0.5 w-5 bg-accent rounded-full" />
              )}
              <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-[9px] uppercase tracking-wider font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
