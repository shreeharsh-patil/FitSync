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
  Activity,
  LogOut,
  ChevronRight
} from "lucide-react"
import { signOut } from "next-auth/react"

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
    <div className="flex flex-col h-full w-72 bg-card/30 backdrop-blur-xl border-r border-white/5 relative z-20">
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold font-heading tracking-tighter">FitSync</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5">
        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-secondary/10 text-secondary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-full" />
              )}
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-secondary" : "group-hover:text-foreground"
              )} />
              <span className="font-bold text-sm tracking-wide">{item.name}</span>
              {isActive && (
                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 space-y-4">
        <div className="p-4 rounded-[2rem] bg-gradient-to-br from-primary/40 to-background border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="h-16 w-16 text-secondary" />
           </div>
           <div className="flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary text-xs shadow-lg shadow-secondary/20">
                AR
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">Alex Rivers</span>
                <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Premium Plan</span>
              </div>
           </div>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-sm tracking-wide">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
