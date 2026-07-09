"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Brain, Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Optimize my workout split",
  "Create a meal plan for cutting",
  "Recovery tips after leg day",
  "Calculate my macros",
];

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! I'm your AI fitness coach. Ask me anything about workouts, nutrition, or recovery." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setError("");

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to get response. Please try again.");
        setIsLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setError("Network error. Make sure the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-secondary/15 text-secondary border border-secondary/20 flex items-center justify-center">
          <Brain className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-heading text-white">AI Coach</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Online · Context Mode Active</p>
        </div>
      </motion.div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">{error}</div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
        {messages.map((msg, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
            <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center border text-xs font-bold ${msg.role === "assistant" ? "bg-secondary/15 text-secondary border-secondary/30" : "bg-accent/15 text-accent border-accent/30"}`}>
              {msg.role === "assistant" ? "AI" : "U"}
            </div>
            <div className={`rounded-xl p-4 border text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "assistant" ? "bg-white/5 border-white/10 text-muted-foreground" : "bg-accent/10 border-accent/20 text-white"}`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="h-8 w-8 rounded-lg bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center text-xs font-bold">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-secondary">
              <div className="flex items-center gap-2">
                <span className="animate-pulse">Analyzing your fitness data</span>
                <span className="flex gap-0.5">
                  <span className="h-1.5 w-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {suggestions.map((s) => (
          <button key={s} onClick={() => { setInput(s); }}
            disabled={isLoading}
            className="shrink-0 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-white hover:border-secondary/30 transition-all font-medium disabled:opacity-50">
            <Sparkles className="h-3 w-3 inline mr-1 text-secondary" />{s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 pt-4 border-t border-white/5">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask your AI coach anything..."
          disabled={isLoading}
          className="flex-1 h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white text-sm focus:outline-none focus:border-secondary/40 transition-all placeholder:text-muted-foreground/40 disabled:opacity-50" />
        <button onClick={handleSend} disabled={!input.trim() || isLoading}
          className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-lg shadow-secondary/15 disabled:opacity-50 transition-all hover:bg-secondary/90">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
