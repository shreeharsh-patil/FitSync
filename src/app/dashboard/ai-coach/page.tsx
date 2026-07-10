"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Brain, Send, Sparkles, Loader2 } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

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
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      if (!res.ok) { setError(data.error || "Failed to get response."); setIsLoading(false); return; }
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch { setError("Network error. Make sure the server is running."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-accent-coral/10 flex items-center justify-center text-accent-coral border border-accent-coral/20">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-heading text-text-primary">AI Coach</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-text-muted font-medium">Online · Context Mode Active</span>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{error}</div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
        {messages.map((msg, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
            <div className={`h-7 w-7 shrink-0 rounded-lg flex items-center justify-center border text-[10px] font-bold mt-0.5 ${
              msg.role === "assistant"
                ? "bg-accent-coral/10 text-accent-coral border-accent-coral/20"
                : "bg-bg-secondary text-text-secondary border-border"
            }`}>
              {msg.role === "assistant" ? "AI" : "U"}
            </div>
            <div className={`rounded-xl p-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "assistant"
                ? "bg-bg-secondary border border-border text-text-secondary"
                : "bg-accent-coral/10 border border-accent-coral/20 text-text-primary"
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="h-7 w-7 rounded-lg bg-accent-coral/10 text-accent-coral border border-accent-coral/20 flex items-center justify-center text-[10px] font-bold">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-xl p-3.5 bg-bg-secondary border border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-accent-coral animate-pulse">Analyzing your fitness data</span>
                <span className="flex gap-0.5">
                  <span className="h-1.5 w-1.5 bg-accent-coral rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 bg-accent-coral rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 bg-accent-coral rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
        {suggestions.map((s) => (
          <button key={s} onClick={() => setInput(s)} disabled={isLoading}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-bg-secondary border border-border text-xs text-text-muted hover:text-text-primary hover:border-accent-coral/30 transition-all font-medium disabled:opacity-50">
            <Sparkles className="h-3 w-3 inline mr-1 text-accent-coral" />{s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask your AI coach anything..."
          disabled={isLoading}
          className="flex-1 h-13 input disabled:opacity-50" />
        <button onClick={handleSend} disabled={!input.trim() || isLoading}
          className="h-13 w-13 rounded-xl bg-accent-coral flex items-center justify-center text-white disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-accent-coral/20">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
