"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  LineChart, 
  Users, 
  MessageSquare, 
  Settings,
  Activity
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workout", href: "/workout", icon: Dumbbell },
  { name: "Nutrition", href: "/nutrition", icon: Utensils },
  { name: "Progress", href: "/progress", icon: LineChart },
  { name: "Community", href: "/community", icon: Users },
  { name: "AI Coach", href: "/ai-coach", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function SideNavBar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border/40">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-secondary" />
          <span className="text-xl font-bold font-heading tracking-tighter">FitSync</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-secondary/10 text-secondary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive ? "text-secondary" : "group-hover:text-foreground"
              )} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1 h-4 bg-secondary rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border/40">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 glass">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-bold text-primary text-xs">
            AR
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">Alex Rivers</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Premium</span>
          </div>
        </div>
      </div>
    </div>
  )
}
