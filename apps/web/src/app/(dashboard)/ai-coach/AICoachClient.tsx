"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { askGrokCoach } from "@/lib/actions";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
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

    // Format chat history for Grok model context
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    handleSendMessage(suggestionText);
  };

  return (
    <Card className="flex-1 glass border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col relative h-[550px] shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-accent/5 opacity-50 pointer-events-none" />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-4 max-w-[80%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border mt-1 ${
              msg.role === "assistant"
                ? "bg-secondary/15 text-secondary border-secondary/30"
                : "bg-accent/15 text-accent border-accent/30"
            }`}>
              {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            <div className="space-y-2">
              <div className={`rounded-2xl p-4 border text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-white/5 border-white/10 rounded-tl-sm text-foreground"
                  : "bg-accent/10 border-accent/20 rounded-tr-sm text-white"
              }`}>
                {msg.content.split("\n").map((line, lIdx) => (
                  <p key={lIdx} className={lIdx > 0 ? "mt-2" : ""}>
                    {line}
                  </p>
                ))}
              </div>
              <p className={`text-[9px] text-muted-foreground font-mono font-bold ${msg.role === "user" ? "text-right mr-1" : "ml-1"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-4 max-w-[80%] mr-auto animate-pulse">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center mt-1">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <div className="space-y-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-xs font-mono text-secondary">
                Grok Coach is analyzing body sheets & formulating advice...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Panel */}
      <div className="p-6 border-t border-white/5 bg-background/50 backdrop-blur-xl relative z-10 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Input
              disabled={isLoading}
              placeholder="Ask Grok Coach about progressive overload, macro ratios, or custom plans..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-4 pr-12 h-14 bg-white/5 border-white/10 focus:border-secondary/50 rounded-2xl text-sm transition-all placeholder:text-muted-foreground"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-14 w-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-primary shadow-lg shadow-secondary/20 shrink-0 transition-transform active:scale-95"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>

        {/* Suggestion Bubbles */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
          <SuggestionButton label="Suggest active recovery stretching" onClick={() => handleSuggestionClick("Give me a 10-minute active recovery stretching routine for lower back soreness")} />
          <SuggestionButton label="Explain protein macro guidelines" onClick={() => handleSuggestionClick("How much daily protein do I need to support muscle hypertrophy?")} />
          <SuggestionButton label="Explain bench press plateaus" onClick={() => handleSuggestionClick("How do I push past a plateau on my bench press?")} />
        </div>
      </div>
    </Card>
  );
}

function SuggestionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-8 text-xs rounded-full border-white/10 bg-white/5 hover:bg-white/10 whitespace-nowrap font-bold text-muted-foreground hover:text-white"
    >
      <Sparkles className="h-3 w-3 text-secondary mr-1.5" />
      {label}
    </Button>
  );
}
