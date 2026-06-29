"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  Trophy,
  X,
  LogOut,
  CheckCircle2,
  ArrowLeft,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createTeam, joinTeam, leaveTeam } from "@/lib/corporate";

interface TeamMember {
  id: string;
  user: { id: string; name: string | null; image: string | null };
}

interface TeamData {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count: { members: number };
  members: TeamMember[];
}

export function TeamsClient({
  teams,
  orgId,
  currentTeamId,
  userId,
}: {
  teams: TeamData[];
  orgId: string;
  currentTeamId: string | null;
  userId: string;
}) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const isInTeam = !!currentTeamId;
  const currentTeam = teams.find((t) => t.id === currentTeamId);

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    setCreating(true);
    const result = await createTeam(orgId, teamName, teamDesc || undefined);
    setCreating(false);
    if (result.success) {
      setShowCreate(false);
      setTeamName("");
      setTeamDesc("");
      router.refresh();
    }
  };

  const handleJoin = async (teamId: string) => {
    const result = await joinTeam(teamId, userId);
    if (result.success) router.refresh();
  };

  const handleLeave = async () => {
    const result = await leaveTeam(userId);
    if (result.success) router.refresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" onClick={() => router.push("/corporate")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-bold font-heading flex items-center gap-2">
            <Users className="h-5 w-5 text-secondary" />
            {teams.length} {teams.length === 1 ? "Team" : "Teams"}
          </h2>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm" disabled={isInTeam}>
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </div>

      {currentTeam && (
        <Card className="border-secondary/20 bg-secondary/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="font-bold text-lg">{currentTeam.name}</p>
                <p className="text-xs text-muted-foreground">{currentTeam._count.members} members</p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLeave}>
              <LogOut className="h-4 w-4" />
              Leave Team
            </Button>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-secondary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create New Team</CardTitle>
                  <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <CardDescription>Create a department or team within your organization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Engineering, Marketing, etc."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Description (optional)</label>
                  <textarea
                    value={teamDesc}
                    onChange={(e) => setTeamDesc(e.target.value)}
                    placeholder="What does this team do?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground resize-none h-20"
                  />
                </div>
                <Button onClick={handleCreate} disabled={creating || !teamName.trim()} className="w-full">
                  {creating ? "Creating..." : "Create Team"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team, i) => {
            const isMyTeam = team.id === currentTeamId;
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={cn(
                  "h-full transition-all",
                  isMyTeam ? "border-secondary/30" : "hover:border-white/10",
                )}>
                  <CardContent className="py-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center",
                          isMyTeam ? "bg-secondary/10" : "bg-white/5",
                        )}>
                          <Users className={cn("h-5 w-5", isMyTeam ? "text-secondary" : "text-muted-foreground")} />
                        </div>
                        <div>
                          <p className="font-bold">{team.name}</p>
                          <p className="text-xs text-muted-foreground">{team._count.members} members</p>
                        </div>
                      </div>
                      {isMyTeam && (
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                      )}
                    </div>

                    {team.description && (
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{team.description}</p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      {team.members.slice(0, 5).map((m) => (
                        <div
                          key={m.id}
                          className="h-7 w-7 rounded-full bg-secondary/10 flex items-center justify-center text-[10px] font-bold text-secondary"
                        >
                          {(m.user.name || "U").charAt(0)}
                        </div>
                      ))}
                      {team._count.members > 5 && (
                        <span className="text-[10px] text-muted-foreground">+{team._count.members - 5}</span>
                      )}
                    </div>

                    {!isMyTeam && !isInTeam && (
                      <Button size="sm" variant="outline" className="w-full" onClick={() => handleJoin(team.id)}>
                        <Users className="h-4 w-4" />
                        Join Team
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-bold text-lg">No teams yet</p>
            <p className="text-muted-foreground text-sm mt-1">Create the first team to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
