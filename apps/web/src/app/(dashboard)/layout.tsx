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
    <div className="flex h-screen overflow-hidden bg-background selection:bg-secondary selection:text-primary">
      <SideNavBar user={user} />
      <main className="flex-1 overflow-y-auto bg-background/50 relative">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 kinetic-grid opacity-20 pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none -z-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] glow-sphere opacity-20 pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] glow-sphere opacity-10 pointer-events-none -z-10" />
        
        <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24 lg:pb-8 relative z-10">{children}</div>
      </main>
    </div>
  );
}

