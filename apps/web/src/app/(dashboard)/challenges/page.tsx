"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Award,
  Flame,
  Target,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  X,
  CheckCircle2,
  Dumbbell,
  Salad,
  Zap,
  Trophy,
  Plus,
  Loader2,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Medal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getChallenges,
  getChallenge,
  joinChallenge,
  leaveChallenge,
  updateChallengeProgress,
  createChallenge,
} from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";

type ChallengeStatus = "active" | "upcoming" | "completed";

interface ChallengeItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  rules: any;
  participantCount: number;
  durationDays: number;
  status: ChallengeStatus;
  type: string;
  difficulty: string;
  participants: {
    id: string;
    name: string;
    avatar: string | null;
    progress: any;
    rank: number | null;
    joinedAt: string;
  }[];
}

const typeIcons: Record<string, any> = {
  workout: Dumbbell,
  nutrition: Salad,
  streak: Flame,
  custom: Target,
};

const typeColors: Record<string, string> = {
  workout: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  nutrition: "text-green-400 bg-green-500/10 border-green-500/20",
  streak: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  custom: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const difficultyColors: Record<string, string> = {
  BEGINNER: "text-green-400 bg-green-500/10 border-green-500/20",
  INTERMEDIATE: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  ADVANCED: "text-red-400 bg-red-500/10 border-red-500/20",
};

function computeProgress(challenge: ChallengeItem, userId?: string): number {
  if (!userId) return 0;
  const participant = challenge.participants.find((p) => p.id === userId);
  if (!participant) return 0;
  const p = participant.progress;
  if (p.completed) return 100;
  if (p.goal && p.current) {
    return Math.min(Math.round((p.current / p.goal) * 100), 100);
  }
  return 0;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("USER");
  const [filters, setFilters] = useState({ type: "all", difficulty: "all", duration: "all" });
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    type: "workout",
    difficulty: "BEGINNER",
    startDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    endDate: new Date(Date.now() + 37 * 86400000).toISOString().split("T")[0],
    goal: "",
  });

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChallenges(
        filters.type !== "all" || filters.difficulty !== "all" || filters.duration !== "all"
          ? { type: filters.type, difficulty: filters.difficulty, duration: filters.duration }
          : undefined
      );
      setChallenges(data as ChallengeItem[]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchUser();
    fetchChallenges();
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      if (session?.user?.id) {
        setUserId(session.user.id);
        setUserRole(session.user.role || "USER");
      }
    } catch {}
  }

  async function handleJoin(challengeId: string) {
    if (!userId) return;
    setActionLoading(challengeId);
    await joinChallenge(userId, challengeId);
    setActionLoading(null);
    fetchChallenges();
    if (selectedChallenge?.id === challengeId) {
      const updated = await getChallenge(challengeId);
      if (updated) {
        const { createdAt: _, ...base } = updated;
        setSelectedChallenge({
          ...base,
          durationDays: Math.ceil(
            (new Date(updated.endDate).getTime() - new Date(updated.startDate).getTime()) / (1000 * 60 * 60 * 24)
          ),
          status: new Date(updated.endDate) < new Date() ? "completed" : "active",
          type: (updated.rules as any)?.type || "custom",
          difficulty: (updated.rules as any)?.difficulty || "BEGINNER",
        } as ChallengeItem);
      }
    }
  }

  async function handleLeave(challengeId: string) {
    if (!userId) return;
    setActionLoading(challengeId);
    await leaveChallenge(userId, challengeId);
    setActionLoading(null);
    fetchChallenges();
    if (selectedChallenge?.id === challengeId) {
      setSelectedChallenge(null);
    }
  }

  async function handleCheckIn(challengeId: string) {
    if (!userId) return;
    setActionLoading(challengeId);
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;
    const participant = challenge.participants.find((p) => p.id === userId);
    const current = participant?.progress?.current || 0;
    const goal = participant?.progress?.goal || challenge.rules?.goal ? 100 : 10;
    const newCurrent = current + 1;
    const completed = newCurrent >= goal;
    await updateChallengeProgress(userId, challengeId, {
      current: newCurrent,
      goal,
      completed,
      lastCheckIn: new Date().toISOString(),
    });
    setActionLoading(null);
    if (completed) {
      setShowCelebration(challengeId);
    }
    fetchChallenges();
  }

  async function handleCreateChallenge() {
    if (!createForm.title.trim()) return;
    setActionLoading("create");
    await createChallenge(createForm);
    setActionLoading(null);
    setShowCreateModal(false);
    setCreateForm({
      title: "",
      description: "",
      type: "workout",
      difficulty: "BEGINNER",
      startDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      endDate: new Date(Date.now() + 37 * 86400000).toISOString().split("T")[0],
      goal: "",
    });
    fetchChallenges();
  }

  function isJoined(challengeId: string) {
    return challenges.find((c) => c.id === challengeId)?.participants.some((p) => p.id === userId) ?? false;
  }

  function isCompleted(challengeId: string) {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return false;
    const participant = challenge.participants.find((p) => p.id === userId);
    return participant?.progress?.completed ?? false;
  }

  const filteredChallenges = challenges.filter((c) => {
    if (filters.type !== "all" && c.type !== filters.type) return false;
    if (filters.difficulty !== "all" && c.difficulty !== filters.difficulty) return false;
    if (filters.duration !== "all") {
      if (filters.duration === "short" && c.durationDays > 14) return false;
      if (filters.duration === "medium" && (c.durationDays <= 14 || c.durationDays > 30)) return false;
      if (filters.duration === "long" && c.durationDays <= 30) return false;
    }
    return true;
  });

  const TypeIcon = typeIcons[selectedChallenge?.type || "custom"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight flex items-center gap-3 text-white">
            <Award className="h-8 w-8 text-yellow-400" />
            Challenges
          </h1>
          <p className="text-muted-foreground mt-2">
            Push your limits, compete with athletes, and earn your crown.
          </p>
        </div>
        {(userRole === "ADMIN" || userRole === "TRAINER" || userRole === "SUPER_ADMIN") && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-secondary hover:bg-secondary/90 text-primary font-bold gap-2 shadow-lg shadow-secondary/15"
          >
            <Plus className="h-4 w-4" />
            Create Challenge
          </Button>
        )}
      </div>

      {/* Detail View */}
      <AnimatePresence>
        {selectedChallenge ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button
              variant="ghost"
              onClick={() => setSelectedChallenge(null)}
              className="mb-4 text-muted-foreground hover:text-white gap-2 font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center border", typeColors[selectedChallenge.type] || "text-purple-400 bg-purple-500/10 border-purple-500/20")}>
                        <TypeIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold font-heading text-white">{selectedChallenge.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{selectedChallenge.rules.description}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      selectedChallenge.status === "active" ? "text-green-400 bg-green-500/10 border-green-500/20" :
                      selectedChallenge.status === "upcoming" ? "text-blue-400 bg-blue-500/10 border-blue-500/20" :
                      "text-muted-foreground bg-white/5 border-white/10"
                    )}>
                      {selectedChallenge.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                      <Calendar className="h-5 w-5 text-secondary mx-auto mb-2" />
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Start</p>
                      <p className="text-sm font-bold text-white mt-0.5">{new Date(selectedChallenge.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                      <Clock className="h-5 w-5 text-accent mx-auto mb-2" />
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">End</p>
                      <p className="text-sm font-bold text-white mt-0.5">{new Date(selectedChallenge.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                      <Users className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Participants</p>
                      <p className="text-sm font-bold text-white mt-0.5">{selectedChallenge.participantCount}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                      <Target className="h-5 w-5 text-yellow-400 mx-auto mb-2" />
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Duration</p>
                      <p className="text-sm font-bold text-white mt-0.5">{selectedChallenge.durationDays} days</p>
                    </div>
                  </div>

                  {selectedChallenge.rules.goal && (
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Challenge Goal</p>
                      <p className="text-sm text-white font-medium">{selectedChallenge.rules.goal}</p>
                    </div>
                  )}

                  {userId && isJoined(selectedChallenge.id) && !isCompleted(selectedChallenge.id) && selectedChallenge.status === "active" && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleCheckIn(selectedChallenge.id)}
                        disabled={actionLoading === selectedChallenge.id}
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold gap-2 h-12 rounded-xl"
                      >
                        {actionLoading === selectedChallenge.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )}
                        Check In Progress
                      </Button>
                    </div>
                  )}

                  {isCompleted(selectedChallenge.id) && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 text-center">
                      <Trophy className="h-10 w-10 text-yellow-400 mx-auto mb-2" />
                      <p className="font-bold text-yellow-400">Challenge Complete!</p>
                      <p className="text-sm text-muted-foreground mt-1">You crushed this challenge. Amazing work!</p>
                    </div>
                  )}
                </Card>

                {/* Participants */}
                <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
                  <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    Participants ({selectedChallenge.participants.length})
                  </h3>

                  <div className="space-y-3">
                    {selectedChallenge.participants.map((p, i) => {
                      const progress = p.progress?.completed
                        ? 100
                        : p.progress?.goal && p.progress?.current
                        ? Math.min(Math.round((p.progress.current / p.progress.goal) * 100), 100)
                        : 0;
                      return (
                        <div key={p.id} className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                          p.id === userId ? "bg-secondary/10 border-secondary/20" : "bg-white/5 border-white/5"
                        )}>
                          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-white border border-white/5 shrink-0">
                            {p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "AT"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white truncate">
                                {p.name} {p.id === userId && "(You)"}
                              </span>
                              {p.rank && (
                                <span className="text-[10px] font-bold text-secondary">#{p.rank}</span>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    progress >= 100 ? "bg-yellow-400" : "bg-secondary"
                                  )}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground shrink-0">{progress}%</span>
                            </div>
                          </div>
                          {p.id === userId && (
                            <Button
                              onClick={() => handleLeave(selectedChallenge.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Sidebar info */}
              <div className="space-y-6">
                <Card className="p-6 glass border-white/5 rounded-[2.5rem] space-y-4">
                  <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    Difficulty
                  </h3>
                  <div className={cn("px-3 py-1.5 rounded-xl inline-flex text-xs font-bold border", difficultyColors[selectedChallenge.difficulty] || "text-muted-foreground bg-white/5 border-white/10")}>
                    {selectedChallenge.difficulty}
                  </div>
                </Card>

                <Card className="p-6 glass border-white/5 rounded-[2.5rem] space-y-4">
                  <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-yellow-400" />
                    Type
                  </h3>
                  <div className={cn("px-3 py-1.5 rounded-xl inline-flex text-xs font-bold border items-center gap-2", typeColors[selectedChallenge.type] || "text-purple-400 bg-purple-500/10 border-purple-500/20")}>
                    <TypeIcon className="h-3.5 w-3.5" />
                    {selectedChallenge.type}
                  </div>
                </Card>

                {!isJoined(selectedChallenge.id) && selectedChallenge.status !== "completed" && (
                  <Button
                    onClick={() => handleJoin(selectedChallenge.id)}
                    disabled={actionLoading === selectedChallenge.id}
                    className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold gap-2 h-12 rounded-xl"
                  >
                    {actionLoading === selectedChallenge.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Join Challenge
                  </Button>
                )}

                {isJoined(selectedChallenge.id) && !isCompleted(selectedChallenge.id) && (
                  <Button
                    onClick={() => handleLeave(selectedChallenge.id)}
                    variant="outline"
                    className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 font-bold gap-2 h-12 rounded-xl"
                  >
                    <X className="h-4 w-4" />
                    Leave Challenge
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Filters */}
            <Card className="p-6 glass border-white/5 rounded-[2.5rem]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Type</p>
                  <div className="flex flex-wrap gap-2">
                    {["all", "workout", "nutrition", "streak", "custom"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilters((f) => ({ ...f, type: t }))}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                          filters.type === t
                            ? "bg-secondary/10 text-secondary border-secondary/20 shadow-sm"
                            : "text-muted-foreground border-white/5 hover:border-white/20 hover:text-white bg-white/5"
                        )}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Difficulty</p>
                  <div className="flex flex-wrap gap-2">
                    {["all", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((d) => (
                      <button
                        key={d}
                        onClick={() => setFilters((f) => ({ ...f, difficulty: d }))}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                          filters.difficulty === d
                            ? "bg-secondary/10 text-secondary border-secondary/20 shadow-sm"
                            : "text-muted-foreground border-white/5 hover:border-white/20 hover:text-white bg-white/5"
                        )}
                      >
                        {d === "all" ? "All" : d.charAt(0) + d.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Duration</p>
                  <div className="flex flex-wrap gap-2">
                    {[{ value: "all", label: "All" }, { value: "short", label: "Short (<2w)" }, { value: "medium", label: "Medium (2-4w)" }, { value: "long", label: "Long (>4w)" }].map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setFilters((f) => ({ ...f, duration: d.value }))}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                          filters.duration === d.value
                            ? "bg-secondary/10 text-secondary border-secondary/20 shadow-sm"
                            : "text-muted-foreground border-white/5 hover:border-white/20 hover:text-white bg-white/5"
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Challenge Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : filteredChallenges.length === 0 ? (
              <Card className="p-12 glass border-white/5 rounded-[2.5rem] text-center space-y-4">
                <Target className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-bold text-white">No challenges found</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {challenges.length === 0
                    ? "No challenges have been created yet. Check back soon or ask an admin to create one."
                    : "No challenges match your current filters. Try adjusting them."}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge) => {
                  const Icon = typeIcons[challenge.type] || Target;
                  const joined = isJoined(challenge.id);
                  const completed = isCompleted(challenge.id);
                  const progress = computeProgress(challenge, userId ?? undefined);

                  return (
                    <motion.div
                      key={challenge.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card
                        className={cn(
                          "p-6 glass rounded-[2.5rem] border transition-all duration-300 group cursor-pointer h-full flex flex-col",
                          completed
                            ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent"
                            : joined
                            ? "border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent"
                            : "border-white/5 hover:border-secondary/20"
                        )}
                        onClick={() => setSelectedChallenge(challenge)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border", typeColors[challenge.type] || "text-purple-400 bg-purple-500/10 border-purple-500/20")}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex items-center gap-2">
                            {completed && <Trophy className="h-5 w-5 text-yellow-400" />}
                            {joined && !completed && <Sparkles className="h-4 w-4 text-secondary" />}
                            <div className={cn(
                              "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border",
                              challenge.status === "active" ? "text-green-400 bg-green-500/10 border-green-500/20" :
                              challenge.status === "upcoming" ? "text-blue-400 bg-blue-500/10 border-blue-500/20" :
                              "text-muted-foreground bg-white/5 border-white/10"
                            )}>
                              {challenge.status}
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors mb-2">
                          {challenge.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                          {challenge.rules.description || "No description"}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-secondary" />
                            {challenge.participantCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-accent" />
                            {challenge.durationDays}d
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[8px] font-bold uppercase",
                            difficultyColors[challenge.difficulty] || "text-muted-foreground bg-white/5"
                          )}>
                            {challenge.difficulty === "BEGINNER" ? "Beginner" : challenge.difficulty === "INTERMEDIATE" ? "Inter" : "Adv"}
                          </span>
                        </div>

                        {(joined || completed) && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-bold text-white">Progress</span>
                              <span className={cn("font-bold", completed ? "text-yellow-400" : "text-secondary")}>{progress}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  completed ? "bg-yellow-400" : "bg-secondary"
                                )}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-auto">
                          {!joined && challenge.status !== "completed" && (
                            <Button
                              onClick={(e) => { e.stopPropagation(); handleJoin(challenge.id); }}
                              disabled={actionLoading === challenge.id}
                              size="sm"
                              className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold text-xs rounded-xl h-9"
                            >
                              {actionLoading === challenge.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                              Join
                            </Button>
                          )}
                          {joined && !completed && challenge.status === "active" && (
                            <Button
                              onClick={(e) => { e.stopPropagation(); handleCheckIn(challenge.id); }}
                              disabled={actionLoading === challenge.id}
                              size="sm"
                              variant="outline"
                              className="flex-1 border-secondary/30 text-secondary hover:bg-secondary/10 font-bold text-xs rounded-xl h-9"
                            >
                              {actionLoading === challenge.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                              Check In
                            </Button>
                          )}
                          {completed && (
                            <Button
                              onClick={() => setShowCelebration(challenge.id)}
                              size="sm"
                              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs rounded-xl h-9"
                            >
                              <Trophy className="h-3 w-3" />
                              Celebrate
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-white rounded-xl h-9"
                            onClick={() => setSelectedChallenge(challenge)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Challenge Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg"
            >
              <Card className="glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Award className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Create Challenge</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Title</label>
                    <Input
                      placeholder="e.g. 30-Day Beast Mode"
                      value={createForm.title}
                      onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Description</label>
                    <Input
                      placeholder="Describe the challenge..."
                      value={createForm.description}
                      onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Type</label>
                      <div className="flex gap-2">
                        {["workout", "nutrition", "streak", "custom"].map((t) => (
                          <button
                            key={t}
                            onClick={() => setCreateForm((f) => ({ ...f, type: t }))}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize",
                              createForm.type === t
                                ? "bg-secondary/10 text-secondary border-secondary/20"
                                : "text-muted-foreground border-white/5 hover:border-white/20 bg-white/5"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Difficulty</label>
                      <div className="flex gap-2">
                        {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((d) => (
                          <button
                            key={d}
                            onClick={() => setCreateForm((f) => ({ ...f, difficulty: d }))}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-bold border transition-all",
                              createForm.difficulty === d
                                ? "bg-secondary/10 text-secondary border-secondary/20"
                                : "text-muted-foreground border-white/5 hover:border-white/20 bg-white/5"
                            )}
                          >
                            {d === "BEGINNER" ? "Bgn" : d === "INTERMEDIATE" ? "Int" : "Adv"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Start Date</label>
                      <Input
                        type="date"
                        value={createForm.startDate}
                        onChange={(e) => setCreateForm((f) => ({ ...f, startDate: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">End Date</label>
                      <Input
                        type="date"
                        value={createForm.endDate}
                        onChange={(e) => setCreateForm((f) => ({ ...f, endDate: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Goal (e.g. &ldquo;Complete 10 workouts&rdquo;)</label>
                    <Input
                      placeholder="e.g. Complete 10 workouts in 30 days"
                      value={createForm.goal}
                      onChange={(e) => setCreateForm((f) => ({ ...f, goal: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateChallenge}
                  disabled={!createForm.title.trim() || actionLoading === "create"}
                  className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl"
                >
                  {actionLoading === "create" ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Launch Challenge
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (() => {
          const challenge = challenges.find((c) => c.id === showCelebration);
          return (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-full max-w-md"
              >
                <Card className="glass border-yellow-500/30 p-10 space-y-6 relative rounded-[3rem] shadow-[0_0_50px_rgba(234,179,8,0.15)] text-center">
                  <button
                    onClick={() => setShowCelebration(null)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6 }}
                  >
                    <Trophy className="h-20 w-20 text-yellow-400 mx-auto drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" />
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white font-heading">Challenge Complete!</h2>
                    <p className="text-muted-foreground">
                      You conquered <span className="font-bold text-yellow-400">{challenge?.title}</span>
                    </p>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <span className="text-white font-bold">{challenge?.rules?.goal || "Achieved"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You pushed through and came out stronger. This is what champions are made of.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex-1"
                    >
                      <Button
                        onClick={() => setShowCelebration(null)}
                        className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl"
                      >
                        Keep Going
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex-1"
                    >
                      <Button
                        onClick={() => { setShowCelebration(null); setShowCreateModal(true); }}
                        variant="outline"
                        className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 font-bold h-12 rounded-xl"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        New Challenge
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
