"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, Trophy, Salad, Target, Users, Sparkles, ArrowUpDown } from "lucide-react";

export type FeedCategory = "all" | "workouts" | "nutrition" | "achievements" | "challenges";
export type FeedSort = "latest" | "popular" | "trending";
export type FeedScope = "following" | "for-you";

interface FeedFiltersProps {
  category: FeedCategory;
  sort: FeedSort;
  scope: FeedScope;
  onCategoryChange: (c: FeedCategory) => void;
  onSortChange: (s: FeedSort) => void;
  onScopeChange: (s: FeedScope) => void;
}

const categories: { key: FeedCategory; label: string; icon: typeof Flame }[] = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "workouts", label: "Workouts", icon: Flame },
  { key: "nutrition", label: "Nutrition", icon: Salad },
  { key: "achievements", label: "Achievements", icon: Trophy },
  { key: "challenges", label: "Challenges", icon: Target },
];

export function FeedFilters({ category, sort, scope, onCategoryChange, onSortChange, onScopeChange }: FeedFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={category === key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onCategoryChange(key)}
            className={cn(
              "gap-2 rounded-xl font-bold text-xs h-8 transition-all",
              category === key
                ? "shadow-lg shadow-secondary/15"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
          <button
            onClick={() => onScopeChange("following")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
              scope === "following"
                ? "bg-secondary text-primary shadow-sm"
                : "text-muted-foreground hover:text-white"
            )}
          >
            <Users className="h-3 w-3" />
            Following
          </button>
          <button
            onClick={() => onScopeChange("for-you")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
              scope === "for-you"
                ? "bg-secondary text-primary shadow-sm"
                : "text-muted-foreground hover:text-white"
            )}
          >
            <Sparkles className="h-3 w-3" />
            For You
          </button>
        </div>

        <div className="flex gap-1.5">
          {(["latest", "popular", "trending"] as FeedSort[]).map((s) => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                sort === s
                  ? "text-secondary bg-secondary/10"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              <ArrowUpDown className="h-3 w-3" />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
