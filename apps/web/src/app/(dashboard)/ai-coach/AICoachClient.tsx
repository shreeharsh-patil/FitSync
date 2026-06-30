"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Loader2, Apple, Dumbbell, ChefHat, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { askGrokCoach, getWorkoutRecommendationsAction } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
  planData?: any;
}

interface WorkoutRec {
  exerciseName: string;
  suggestedWeight: number;
  suggestedSets: number;
  suggestedReps: string;
  progressionType: string;
  reason: string;
}

export function AICoachClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to your FitSync AI Coach matrix. I am powered by Grok. I can analyze your active workout sheets, calorie balances, and sleep habits to compile absolute hypertrophy protocols. What are we aiming to optimize today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      role: "user",
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const res = await askGrokCoach(textToSend, historyPayload);

    if (res.success && res.reply) {
      const coachMsg: Message = {
        role: "assistant",
        content: res.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } else {
      const errorMsg: Message = {
        role: "assistant",
        content: "I hit a network glitch connecting to the Grok API matrix, but consistency overrides latency. Please ask again!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setIsLoading(false);
  };

  const handleWorkoutRecommendations = async () => {
    setIsLoadingRecommendations(true);

    const userMsg: Message = {
      role: "user",
      content: "Analyze my recent workout logs and give me personalized recommendations for next session.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);

    const result = await getWorkoutRecommendationsAction("use-client");

    if (result.success && result.recommendations) {
      const recs = result.recommendations as WorkoutRec[];
      const coachMsg: Message = {
        role: "assistant",
        content: `## AI Workout Recommendations\n\n**Fatigue Score:** ${result.fatigueScore}/100 · **Recovery:** ${result.recoveryStatus}\n${result.deloadRecommended ? `\n⚠️ **Deload Recommended:** ${result.deloadReason}\n` : ""}\n\n### Recommended Next Session\n\n${recs.map((r: WorkoutRec) => `**${r.exerciseName}** — ${r.suggestedSets}×${r.suggestedReps} @ ${r.suggestedWeight}kg\n> ${r.reason}${r.substitution ? `\n> 🔄 Substitute: ${r.substitution}` : ""}`).join("\n\n")}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        planData: recs,
      };
      setMessages((prev) => [...prev, coachMsg]);
    } else {
      const errorMsg: Message = {
        role: "assistant",
        content: "I could not analyze your workout history. Make sure you have logged some workouts first!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsLoadingRecommendations(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    handleSendMessage(suggestionText);
  };

  return (
    <Card className="flex-1 glass border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-2xl min-h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-accent/5 opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary via-accent to-secondary" />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border mt-1 shadow-lg ${
                  msg.role === "assistant"
                    ? "bg-secondary/15 text-secondary border-secondary/30"
                    : "bg-accent/15 text-accent border-accent/30"
                }`}
              >
                {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </motion.div>
              <div className="space-y-2">
                <div className={cn(
                  "rounded-2xl p-4 border text-sm leading-relaxed shadow-xl backdrop-blur-md",
                  msg.role === "assistant"
                    ? "bg-white/5 border-white/10 rounded-tl-sm text-foreground"
                    : "bg-accent/10 border-accent/20 rounded-tr-sm text-white"
                )}>
                  {msg.content.split("\n").map((line, lIdx) => {
                    if (line.startsWith("## ")) {
                      return <h3 key={lIdx} className="text-base font-bold text-secondary mt-3 mb-2">{line.replace("## ", "")}</h3>;
                    }
                    if (line.startsWith("### ")) {
                      return <h4 key={lIdx} className="text-sm font-bold text-white mt-2 mb-1">{line.replace("### ", "")}</h4>;
                    }
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <p key={lIdx} className="font-bold text-white mt-2">{line.replace(/\*\*/g, "")}</p>;
                    }
                    if (line.startsWith("> ")) {
                      return (
                        <p key={lIdx} className="text-[11px] text-muted-foreground italic pl-3 border-l-2 border-secondary/30 mt-1">
                          {line.replace("> ", "")}
                        </p>
                      );
                    }
                    if (line.startsWith("⚠️")) {
                      return (
                        <p key={lIdx} className="text-[11px] text-accent font-bold mt-2 flex items-center gap-2">
                          <Zap className="h-3 w-3" />
                          {line.replace("⚠️ ", "")}
                        </p>
                      );
                    }
                    return (
                      <p key={lIdx} className={lIdx > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    );
                  })}
                </div>
                <p className={`text-[9px] text-muted-foreground font-mono font-bold ${msg.role === "user" ? "text-right mr-1" : "ml-1"}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 max-w-[80%] mr-auto"
          >
            <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center mt-1">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <div className="space-y-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-xs font-mono text-secondary animate-pulse">
                Grok Coach is analyzing body sheets & formulating advice...
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Panel */}
      <div className="p-8 border-t border-white/5 bg-slate-950/50 backdrop-blur-2xl relative z-10 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <div className="relative flex-1 group">
            <Input
              disabled={isLoading || isLoadingRecommendations}
              placeholder="Ask Grok Coach about progressive overload, macro ratios..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-5 pr-12 h-16 bg-white/5 border-white/10 focus:border-secondary/50 rounded-2xl text-base transition-all placeholder:text-muted-foreground hover:bg-white/10"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-secondary/50 transition-colors">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={isLoading || isLoadingRecommendations || !input.trim()}
              size="icon"
              className="h-16 w-16 rounded-2xl bg-secondary hover:bg-secondary/90 text-primary shadow-xl shadow-secondary/20 shrink-0"
            >
              <Send className="h-6 w-6" />
            </Button>
          </motion.div>
        </form>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-6 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
          <SuggestionButton 
            label="Suggest active recovery" 
            icon={<Activity className="h-3.5 w-3.5 text-secondary" />}
            onClick={() => handleSuggestionClick("Give me a 10-minute active recovery stretching routine for lower back soreness")} 
          />
          <SuggestionButton 
            label="Protein macro guidelines" 
            icon={<Apple className="h-3.5 w-3.5 text-secondary" />}
            onClick={() => handleSuggestionClick("How much daily protein do I need to support muscle hypertrophy?")} 
          />
          <SuggestionButton 
            label="Bench press plateaus" 
            icon={<Dumbbell className="h-3.5 w-3.5 text-secondary" />}
            onClick={() => handleSuggestionClick("How do I push past a plateau on my bench press?")} 
          />
          <SuggestionButton 
            label="Meal plan for cutting" 
            icon={<ChefHat className="h-3.5 w-3.5 text-secondary" />}
            onClick={() => handleSuggestionClick("Suggest a one-day meal plan for cutting with 2000 calories, high protein")} 
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleWorkoutRecommendations}
              disabled={isLoadingRecommendations}
              className="h-9 px-4 text-xs rounded-full border-accent/30 bg-accent/5 hover:bg-accent/10 whitespace-nowrap font-bold text-accent hover:text-accent transition-all shadow-md"
            >
              {isLoadingRecommendations ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
              ) : (
                <Zap className="h-3.5 w-3.5 mr-2" />
              )}
              Analyze My Workouts
            </Button>
          </motion.div>
        </div>

        {/* Suggestion Bubbles */}
        <div className="flex gap-3 mt-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
          <SuggestionButton 
            label="Design a push/pull/legs split" 
            onClick={() => handleSuggestionClick("Design a push/pull/legs workout split for intermediate lifters")} 
          />
          <SuggestionButton 
            label="How to improve squat depth" 
            onClick={() => handleSuggestionClick("How can I improve my squat depth and ankle mobility?")} 
          />
        </div>
      </div>
    </Card>
  );
}

function SuggestionButton({ label, onClick, icon }: { label: string; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClick}
        className="h-9 px-4 text-xs rounded-full border-white/10 bg-white/5 hover:bg-white/10 whitespace-nowrap font-bold text-muted-foreground hover:text-white transition-all shadow-md"
      >
        {icon || <Sparkles className="h-3.5 w-3.5 text-secondary mr-2" />}
        {label}
      </Button>
    </motion.div>
  );
}
