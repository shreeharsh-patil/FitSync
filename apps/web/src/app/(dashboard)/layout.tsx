import { SideNavBar } from "@/components/layout/side-nav-bar";
import { auth } from "@/auth";
import db from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let user = null;
  
  if (session?.user?.id) {
    user = await db.user.findUnique({
      where: { id: session.user.id },
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNavBar user={user} />
      <main className="flex-1 overflow-y-auto bg-background/50 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-background pointer-events-none -z-10" />
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

