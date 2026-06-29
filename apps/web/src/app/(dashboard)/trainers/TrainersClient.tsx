"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  DollarSign,
  Users,
  Sparkles,
  Dumbbell,
  Heart,
  HeartPulse,
  Activity,
  Zap,
  User,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Strength", icon: Dumbbell, color: "text-blue-400" },
  { name: "Cardio", icon: Heart, color: "text-red-400" },
  { name: "Flexibility", icon: Activity, color: "text-purple-400" },
  { name: "HIIT", icon: Zap, color: "text-orange-400" },
  { name: "Yoga", icon: HeartPulse, color: "text-pink-400" },
  { name: "Weight Loss", icon: Users, color: "text-green-400" },
];

interface TrainersClientProps {
  trainers: any[];
  currentUserId: string;
}

export function TrainersClient({ trainers, currentUserId }: TrainersClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "price-low" | "price-high">("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);

  const featuredTrainers = useMemo(
    () => trainers.filter((t) => t.rating >= 4.5).slice(0, 3),
    [trainers]
  );

  const filteredTrainers = useMemo(() => {
    let result = [...trainers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.user?.name?.toLowerCase().includes(q) ||
          t.specialties?.toLowerCase().includes(q) ||
          t.bio?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((t) =>
        (t.specialties || "").toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (maxPrice < 200) {
      result = result.filter(
        (t) => !t.hourlyRate || t.hourlyRate <= maxPrice
      );
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => (a.hourlyRate || 999) - (b.hourlyRate || 999));
        break;
      case "price-high":
        result.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
        break;
    }

    return result;
  }, [trainers, search, selectedCategory, maxPrice, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-white">
          Find Your Trainer
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover expert coaches to elevate your fitness journey.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 h-13 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-muted-foreground focus-visible:ring-secondary/40"
          />
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="border-white/10 hover:bg-white/5 rounded-xl font-bold gap-2 h-13"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[2.5rem] glass border border-white/10 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-heading text-white">Filters</h3>
            <Button
              onClick={() => {
                setSelectedCategory(null);
                setMaxPrice(200);
                setSortBy("rating");
              }}
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-white"
            >
              Reset All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Sort By
              </label>
              <div className="flex gap-2">
                {(["rating", "price-low", "price-high"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    onClick={() => setSortBy(s)}
                    variant="ghost"
                    className={cn(
                      "text-xs rounded-xl font-bold",
                      sortBy === s
                        ? "bg-secondary/10 text-secondary border border-secondary/20"
                        : "text-muted-foreground hover:text-white border border-transparent"
                    )}
                  >
                    {s === "rating" ? "Top Rated" : s === "price-low" ? "Lowest Price" : "Highest Price"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Max Price: ${maxPrice}
              </label>
              <input
                type="range"
                min={0}
                max={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-secondary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>$0</span>
                <span>$200+</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Browser */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
            }
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all",
              selectedCategory === cat.name
                ? "bg-secondary/10 border-secondary/30 text-secondary"
                : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
            )}
          >
            <cat.icon className={cn("h-4 w-4", cat.color)} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Featured Trainers */}
      {featuredTrainers.length > 0 && !search && !selectedCategory && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <h2 className="text-2xl font-bold font-heading text-white">
              Featured Trainers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTrainers.map((trainer, idx) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/trainer/${trainer.id}`}>
                  <Card className="p-6 glass border-white/5 rounded-[2rem] hover:border-secondary/30 hover:bg-secondary/[0.02] transition-all group h-full">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center overflow-hidden border-2 border-secondary/20 group-hover:border-secondary/40 transition-all">
                        {trainer.user?.avatarUrl || trainer.user?.image ? (
                          <Image
                            src={trainer.user.avatarUrl || trainer.user.image}
                            alt={trainer.user?.name || ""}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <User className="h-10 w-10 text-white/50" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-heading text-white group-hover:text-secondary transition-colors">
                          {trainer.user?.name || "Trainer"}
                        </h3>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-muted-foreground">
                            {trainer.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {trainer.bio || "Professional fitness coach"}
                      </p>
                      {trainer.hourlyRate && (
                        <span className="text-lg font-bold font-heading text-secondary">
                          ${trainer.hourlyRate}/hr
                        </span>
                      )}
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl shadow-lg shadow-secondary/10 group-hover:shadow-secondary/20 transition-all">
                        View Profile
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Trainers Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-heading text-white">
          {selectedCategory
            ? `${selectedCategory} Trainers`
            : search
            ? `Search Results (${filteredTrainers.length})`
            : "All Trainers"}
        </h2>
        {filteredTrainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainers.map((trainer) => {
              const specialties: string[] = trainer.specialties
                ? JSON.parse(trainer.specialties)
                : [];
              return (
                <Link key={trainer.id} href={`/trainer/${trainer.id}`}>
                  <Card className="p-6 glass border-white/5 rounded-[2rem] hover:border-secondary/30 hover:bg-secondary/[0.02] transition-all group h-full">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center overflow-hidden shrink-0">
                          {trainer.user?.avatarUrl || trainer.user?.image ? (
                            <Image
                              src={trainer.user.avatarUrl || trainer.user.image}
                              alt={trainer.user?.name || ""}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User className="h-7 w-7 text-white/50" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold font-heading text-white truncate group-hover:text-secondary transition-colors">
                            {trainer.user?.name || "Trainer"}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-muted-foreground">
                              {trainer.rating.toFixed(1)} ({trainer.reviewCount})
                            </span>
                          </div>
                        </div>
                        {trainer.hourlyRate && (
                          <span className="text-lg font-bold font-heading text-secondary">
                            ${trainer.hourlyRate}
                          </span>
                        )}
                      </div>

                      {specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {specialties.slice(0, 3).map((s: string) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-lg bg-secondary/10 border border-secondary/20 text-[10px] font-bold text-secondary"
                            >
                              {s}
                            </span>
                          ))}
                          {specialties.length > 3 && (
                            <span className="text-[10px] text-muted-foreground font-bold">
                              +{specialties.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {trainer.bio || "Professional fitness coach"}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-white/5">
                        <span className="font-bold">
                          {trainer._count?.followers || 0} followers
                        </span>
                        <span className="font-bold">
                          {trainer.packages?.length || 0} packages
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading text-white mb-2">
              No trainers found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
