import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AICoachClient } from "./AICoachClient";
import { Bot } from "lucide-react";

export default async function AICoachPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight flex items-center gap-3">
            <Bot className="h-8 w-8 text-secondary animate-pulse" />
            FitSync AI Coach
          </h1>
          <p className="text-muted-foreground mt-2">
            Your 24/7 intelligent performance and dietary advisor, powered by Grok.
          </p>
        </div>
      </div>

      <AICoachClient />
    </div>
  );
}
