"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Video,
  Calendar,
  Clock,
  Dumbbell,
  ChevronRight,
  X,
  CheckCircle2,
  PlayCircle,
  History,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createCoachingSession } from "@/lib/actions";

interface Session {
  id: string;
  trainerId: string;
  clientId: string;
  startTime: string;
  endTime: string | null;
  status: string;
  sessionType: string;
  trainer: { id: string; name: string | null; image: string | null };
  client: { id: string; name: string | null; image: string | null };
}

interface Trainer {
  id: string;
  name: string | null;
  image: string | null;
}

export function CoachingClient({
  sessions,
  trainers,
  userId,
  userRole,
}: {
  sessions: Session[];
  trainers: Trainer[];
  userId: string;
  userRole: string;
}) {
  const router = useRouter();
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const upcoming = sessions.filter((s) => s.status === "SCHEDULED" || s.status === "IN_PROGRESS");
  const history = sessions.filter((s) => s.status === "COMPLETED" || s.status === "CANCELLED");

  const handleSchedule = async () => {
    if (!selectedTrainer || !sessionDate || !sessionTime) return;
    setScheduling(true);
    const startTime = new Date(`${sessionDate}T${sessionTime}`);
    const result = await createCoachingSession(selectedTrainer, userId, startTime);
    setScheduling(false);
    if (result.success) {
      setShowSchedule(false);
      setSelectedTrainer("");
      setSessionDate("");
      setSessionTime("");
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-heading flex items-center gap-2">
          <Video className="h-5 w-5 text-secondary" />
          Your Sessions
        </h2>
        <Button onClick={() => setShowSchedule(true)} size="sm">
          <Calendar className="h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      <AnimatePresence>
        {showSchedule && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-secondary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Schedule New Session</CardTitle>
                  <button onClick={() => setShowSchedule(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Select Trainer</label>
                  <select
                    value={selectedTrainer}
                    onChange={(e) => setSelectedTrainer(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground"
                  >
                    <option value="">Choose a trainer...</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name || "Trainer"}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Date</label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Time</label>
                    <input
                      type="time"
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSchedule}
                  disabled={scheduling || !selectedTrainer || !sessionDate || !sessionTime}
                  className="w-full"
                >
                  {scheduling ? "Scheduling..." : "Schedule Session"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {upcoming.length > 0 ? (
        <div className="space-y-3">
          {upcoming.map((session) => {
            const isIncoming = session.clientId === userId;
            const otherParty = isIncoming ? session.trainer : session.client;
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="hover:border-secondary/20 transition-all group cursor-pointer" onClick={() => router.push(`/coaching/session/${session.id}`)}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Dumbbell className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-bold">{isIncoming ? `Session with ${otherParty.name || "Trainer"}` : `Training ${otherParty.name || "Client"}`}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(session.startTime), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(session.startTime), "h:mm a")}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            session.status === "IN_PROGRESS" ? "bg-secondary/10 text-secondary" : "bg-yellow-500/10 text-yellow-400"
                          )}>
                            {session.status === "IN_PROGRESS" ? "Live" : "Scheduled"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); router.push(`/coaching/session/${session.id}`); }}>
                        {session.status === "IN_PROGRESS" ? (
                          <><PlayCircle className="h-4 w-4" /> Join</>
                        ) : (
                          <><Video className="h-4 w-4" /> Start</>
                        )}
                      </Button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-secondary" />
            </div>
            <p className="font-bold text-lg">No upcoming sessions</p>
            <p className="text-muted-foreground text-sm mt-1">Schedule a session with a trainer to get started.</p>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <div>
          <h2 className="text-lg font-bold font-heading flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-muted-foreground" />
            Session History
          </h2>
          <div className="space-y-2">
            {history.map((session) => {
              const isIncoming = session.clientId === userId;
              const otherParty = isIncoming ? session.trainer : session.client;
              return (
                <Card key={session.id} size="sm">
                  <CardContent className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        session.status === "COMPLETED" ? "bg-green-500/10" : "bg-red-500/10"
                      )}>
                        {session.status === "COMPLETED" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{isIncoming ? otherParty.name || "Trainer" : otherParty.name || "Client"}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(session.startTime), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      session.status === "COMPLETED" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    )}>
                      {session.status}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
