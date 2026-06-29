"use client";

import { Card } from "@/components/ui/card";

export function PostSkeleton() {
  return (
    <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-4 animate-pulse">
      <div className="flex gap-3 items-center">
        <div className="h-10 w-10 rounded-xl bg-white/10" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-3 w-24 rounded bg-white/5" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-3/4 rounded bg-white/5" />
      </div>
      <div className="h-20 w-full rounded-2xl bg-white/5" />
      <div className="flex gap-6 pt-2 border-t border-white/5">
        <div className="h-4 w-16 rounded bg-white/5" />
        <div className="h-4 w-16 rounded bg-white/5" />
        <div className="h-4 w-16 rounded bg-white/5 ml-auto" />
      </div>
    </Card>
  );
}
