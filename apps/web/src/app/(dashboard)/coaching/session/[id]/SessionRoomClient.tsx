"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageSquare,
  StickyNote,
  Hand,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { VideoRoom } from "@/components/coaching/VideoRoom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SessionData {
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

export function SessionRoomClient({
  session,
  userId,
}: {
  session: SessionData;
  userId: string;
}) {
  const router = useRouter();
  const [showPanel, setShowPanel] = useState<"chat" | "notes" | null>(null);
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string; time: Date }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [notes, setNotes] = useState(session.status === "COMPLETED" ? "" : "");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "You", text: chatInput, time: new Date() },
    ]);
    setChatInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: session.trainer.name || "Trainer",
          text: "Great work! Keep pushing! 💪",
          time: new Date(),
        },
      ]);
    }, 1500);
  };

  const handleEndCall = async () => {
    const { updateSessionStatus } = await import("@/lib/actions");
    await updateSessionStatus(session.id, "COMPLETED");
    router.push("/coaching");
  };

  const isCurrentUserTrainer = userId === session.trainerId;
  const displayName = isCurrentUserTrainer ? session.client.name || "Client" : session.trainer.name || "Trainer";

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.push("/coaching")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold font-heading">
              {isCurrentUserTrainer ? "Training" : "Session with"} {displayName}
            </h1>
            <p className="text-xs text-muted-foreground">
              {format(new Date(session.startTime), "MMMM d, yyyy h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={showPanel === "chat" ? "secondary" : "ghost"}
            onClick={() => setShowPanel(showPanel === "chat" ? null : "chat")}
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Button>
          <Button
            size="sm"
            variant={showPanel === "notes" ? "secondary" : "ghost"}
            onClick={() => setShowPanel(showPanel === "notes" ? null : "notes")}
          >
            <StickyNote className="h-4 w-4" />
            Notes
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <VideoRoom sessionId={session.id} onEndCall={handleEndCall} />
        </div>

        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[360px] h-full bg-card/30 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col">
                {showPanel === "chat" && (
                  <>
                    <div className="p-4 border-b border-white/5">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-secondary" />
                        Session Chat
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.length === 0 && (
                        <div className="text-center text-muted-foreground text-xs py-8">
                          No messages yet. Say hello!
                        </div>
                      )}
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex flex-col",
                            msg.sender === "You" ? "items-end" : "items-start",
                          )}
                        >
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2 max-w-[85%] text-sm",
                              msg.sender === "You"
                                ? "bg-secondary/20 text-secondary-foreground rounded-br-md"
                                : "bg-white/10 text-foreground rounded-bl-md",
                            )}
                          >
                            <p className="text-xs font-bold text-muted-foreground mb-1">{msg.sender}</p>
                            <p>{msg.text}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-1">
                            {format(msg.time, "h:mm a")}
                          </span>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t border-white/5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                        />
                        <Button size="icon" onClick={handleSendMessage} disabled={!chatInput.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {showPanel === "notes" && (
                  <>
                    <div className="p-4 border-b border-white/5">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <StickyNote className="h-4 w-4 text-secondary" />
                        Session Notes
                      </h3>
                    </div>
                    <div className="flex-1 p-4">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write your session notes here..."
                        className="w-full h-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground resize-none"
                      />
                    </div>
                    <div className="p-4 border-t border-white/5">
                      <p className="text-[10px] text-muted-foreground">
                        Notes are saved locally during the session.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
