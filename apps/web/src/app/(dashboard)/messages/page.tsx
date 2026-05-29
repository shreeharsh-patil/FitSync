import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MessagesClient } from "./MessagesClient";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      <div className="space-y-2 shrink-0">
        <h1 className="text-4xl sm:text-5xl font-bold font-heading tracking-tight text-white">
          Direct <span className="text-secondary">Messages</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">
          Real-time synchronized communications with your training network.
        </p>
      </div>

      <MessagesClient user={session.user} />
    </div>
  );
}
