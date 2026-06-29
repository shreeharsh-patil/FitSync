import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  Dumbbell,
  CreditCard,
  BarChart3,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!role || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 shrink-0 border-r border-white/5 bg-slate-900/60 backdrop-blur-xl flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-heading text-white">FitSync</h1>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
