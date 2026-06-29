"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Trophy,
  Activity,
  TrendingUp,
  Scale,
  Heart,
  Flame,
  ArrowRight,
  Sparkles,
  Medal,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardProps {
  org: any;
  dashboard: any;
  leaderboard: any;
  userId: string;
}

function WellnessScoreRing({ score, label, size = "md" }: { score: number; label: string; size?: "sm" | "md" | "lg" }) {
  const radius = size === "sm" ? 24 : size === "lg" ? 48 : 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const dim = (radius + 12) * 2;

  const colors = score >= 80 ? "stroke-green-400" : score >= 60 ? "stroke-yellow-400" : "stroke-red-400";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={dim} height={dim} className="transform -rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
        <motion.circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className={colors}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <span className={cn(
        "font-bold text-muted-foreground",
        size === "sm" ? "text-[10px]" : size === "lg" ? "text-lg" : "text-sm",
      )}>
        {score}
      </span>
      <span className={cn("text-muted-foreground", size === "sm" ? "text-[8px]" : "text-[10px]")}>{label}</span>
    </div>
  );
}

export function CorporateDashboardClient({ org, dashboard, leaderboard, userId }: DashboardProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");

  const handleCreateOrg = async () => {
    if (!orgName || !orgSlug) return;
    const { createOrganization } = await import("@/lib/actions");
    const result = await createOrganization(orgName, orgSlug, userId);
    if (result.success) {
      window.location.reload();
    }
  };

  if (!org) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading">No Organization Connected</h2>
              <p className="text-muted-foreground mt-2 max-w-md">
                Create or join an organization to access corporate wellness features, team challenges, and company-wide leaderboards.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowCreate(true)}>
                <Building2 className="h-4 w-4" />
                Create Organization
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4" />
                Join Existing
              </Button>
            </div>
          </CardContent>
        </Card>

        {showCreate && (
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle>Create Organization</CardTitle>
              <CardDescription>Set up your company wellness program.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Slug</label>
                <input
                  type="text"
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="acme-corp"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground"
                />
              </div>
              <Button onClick={handleCreateOrg} className="w-full">Create Organization</Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card size="sm">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading">{dashboard.companyAvgScore}</p>
              <p className="text-xs text-muted-foreground">Company Wellness Score</p>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading">{dashboard.totalMembers}</p>
              <p className="text-xs text-muted-foreground">Active Members</p>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading">{dashboard.totalTeams}</p>
              <p className="text-xs text-muted-foreground">Teams</p>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading">{dashboard.teamScores.length}</p>
              <p className="text-xs text-muted-foreground">Active Departments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-400" />
                Department Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((dept: any, i: number) => (
                    <motion.div
                      key={dept.teamName}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl transition-all",
                        i === 0 ? "bg-yellow-500/5 border border-yellow-500/20" : "bg-white/5",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          i === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-white/10 text-muted-foreground",
                        )}>
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-bold text-sm">{dept.teamName}</p>
                          <p className="text-xs text-muted-foreground">{dept.members.length} members</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5 text-secondary" />
                          <span className="text-sm font-bold">{dept.avgScore}</span>
                        </div>
                        {i === 0 && <Trophy className="h-4 w-4 text-yellow-400" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm py-8 text-center">No teams with score data yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                Team Roster
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.teamScores.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.teamScores.slice(0, 5).map((teamScore: any) => (
                    <div key={teamScore.team.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold">{teamScore.team.name}</span>
                        <span className="text-xs text-muted-foreground">{teamScore.memberCount} members</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${teamScore.avgScore}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={cn(
                              "h-full rounded-full",
                              teamScore.avgScore >= 80 ? "bg-green-400" : teamScore.avgScore >= 60 ? "bg-yellow-400" : "bg-red-400",
                            )}
                          />
                        </div>
                        <span className="text-xs font-bold w-8 text-right">{teamScore.avgScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm py-8 text-center">No teams yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Top Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.memberScores.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.memberScores.slice(0, 5).map((ms: any, i: number) => (
                    <motion.div
                      key={ms.member.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                      <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary">
                        {(ms.member.user.name || "U").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{ms.member.user.name || "Unknown"}</p>
                      </div>
                      <span className={cn(
                        "text-xs font-bold",
                        ms.score?.overall >= 80 ? "text-green-400" : ms.score?.overall >= 60 ? "text-yellow-400" : "text-red-400",
                      )}>
                        {ms.score?.overall || 0}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm py-8 text-center">No members with scores yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Wellness Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-6">
                <WellnessScoreRing score={dashboard.companyAvgScore} label="Company" size="lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <WellnessScoreRing score={80} label="Workout" size="sm" />
                <WellnessScoreRing score={75} label="Nutrition" size="sm" />
                <WellnessScoreRing score={65} label="Hydration" size="sm" />
                <WellnessScoreRing score={70} label="Consistency" size="sm" />
              </div>
            </CardContent>
          </Card>

          <Link href="/corporate/teams">
            <Button variant="outline" className="w-full justify-between">
              Manage Teams
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
