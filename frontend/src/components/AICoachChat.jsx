import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  Sparkles,
  Trash2,
  User,
  RefreshCw,
  Activity,
  Flame,
  Dumbbell,
  Clock,
  Sparkle
} from "lucide-react";

// Context-aware response generator based on user input and dashboard metrics
const getCoachResponse = (input, userProfile, activeLog) => {
  const text = input.toLowerCase();
  const responses = [];
  const firstName = userProfile?.name?.split(" ")[0] || "Athlete";
  const weight = userProfile?.weight || 68;
  const currentWorkout = activeLog?.workout || "workout";
  
  if (text.includes("sore")) {
    responses.push(`### Handling Muscle Soreness (DOMS)
Hi **${firstName}**, muscle soreness (Delayed Onset Muscle Soreness) is a natural adaptation response. Since your workout today was **${currentWorkout}**, here is your recovery blueprint:
- **Active Recovery:** Do a light walk or active mobility work. This increases blood flow and delivers repairing nutrients without further breaking down muscle fibers. You've logged **${activeLog?.steps?.toLocaleString() || 0} steps** so far—keep it gentle!
- **Hydration:** Proper hydration keeps muscle tissues lubricated and helps flush waste products. Make sure to hit your goal today!
- **Nutrition Recovery:** Consume **20-30g of fast-digesting protein** paired with simple carbohydrates immediately to kickstart protein synthesis.
- **Soft Tissue Release:** Spend 5-10 minutes foam rolling or using a massage gun on sore spots. Avoid heavy load training of the sore muscle groups for 24-48 hours.`);
  }

  if (text.includes("tired") || text.includes("fatigue") || text.includes("exhausted") || text.includes("sleep")) {
    const sleepHrs = activeLog?.sleep || 7.0;
    responses.push(`### Overcoming Fatigue & Training Load Management
Hey **${firstName}**, feeling fatigued is your body's signal to check its resource levels. You logged **${sleepHrs} hours** of sleep:
- **Sleep Optimization:** Try to hit your FitSync target of **${userProfile?.goals?.sleep || "8.0"} hours**. Ensure your sleeping room is dark and cool, and avoid screens 1 hour before bed.
- **Hydration Drain:** Mild dehydration is the most common cause of daytime fatigue. Have a large glass of water right now.
- **Nervous System Check:** With a current resting rate of **${activeLog?.bpm || 60} BPM**, monitor if your heart rate is elevated above normal. If so, your body is in a state of high stress.
- **Training Option:** Instead of a full-intensity workout, do a **"Deload Session"** (50% intensity/volume) or a low-intensity active recovery walk. Rest is where adaptation and growth actually occur.`);
  }

  if (text.includes("protein") || text.includes("nutrition") || text.includes("diet") || text.includes("eat")) {
    const minProtein = Math.round(weight * 1.6);
    const maxProtein = Math.round(weight * 2.2);
    responses.push(`### Optimizing Protein & Nutrition
Fueling is 70% of your performance equation. Based on your current weight of **${weight} kg**:
- **Daily Protein Target:** Aim for **${minProtein}g to ${maxProtein}g** of protein per day (approx 1.6g to 2.2g per kg of body weight).
- **Protein Distribution:** Divide this intake into **30-40g servings** spaced every 3-4 hours. This keeps Muscle Protein Synthesis (MPS) elevated throughout the day.
- **Quality Choices:** Prioritize complete proteins like lean chicken breast, wild fish, eggs, Greek yogurt, and tofu. If supplementing, a high-quality whey or plant-based isolate is ideal post-workout.`);
  }

  if (text.includes("workout") || text.includes("training") || text.includes("exercise") || text.includes("gym")) {
    responses.push(`### Elite Workout Structure & Progression
To get the absolute most out of your training sessions:
- **Dynamic Warm-Up (5-10 mins):** Do mobility drills and light cardio to prep joints and fire up the nervous system.
- **Compound Foundations:** Put your main compound movements (e.g., Squats, Bench Press, Rows) first when your energy and focus are at their peak.
- **Progressive Overload:** Strive to beat your previous session by 1 repetition or 1kg. Keep logging your sets in FitSync!
- **Parasympathetic Cool-Down:** Spend 5 minutes on static stretching and deep box breathing. This signals your body to switch from a stressed state (sympathetic) to a recovery state (parasympathetic).`);
  }

  if (responses.length > 0) {
    return responses.join("\n\n---\n\n");
  }

  // General welcome / fallback response with current stats parsed
  return `Hi **${firstName}**! I have analyzed your FitSync stats for today:
- **Logged Workout:** ${currentWorkout}
- **Steps Walked:** ${activeLog?.steps?.toLocaleString() || 0} / ${userProfile?.goals?.steps?.toLocaleString() || 10000}
- **Sleep Rec:** ${activeLog?.sleep || "N/A"} hours

I'm ready to support you. Let me know if you want to chat about:
1. Dealing with muscle **soreness**
2. Action plan for when you are **tired**
3. Reaching your daily **protein** requirements
4. Structuring a custom **workout** routine`;
};

// Simple Markdown parser for beautiful formatted bubble text
const parseMessageText = (text) => {
  if (!text) return "";
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={lineIdx} className="h-2" />;

    // Headings (### Section)
    if (trimmed.startsWith("### ")) {
      const headingText = trimmed.replace("### ", "");
      return (
        <h4 key={lineIdx} className="text-xs md:text-sm font-bold text-secondary-fixed-dim uppercase tracking-wider mt-4 mb-2 flex items-center gap-1.5 border-b border-white/5 pb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim inline-block animate-pulse"></span>
          {parseInlineFormatting(headingText)}
        </h4>
      );
    }

    // Bullet Lists (- item or * item)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const bulletText = trimmed.substring(2);
      return (
        <li key={lineIdx} className="ml-3 list-none flex items-start gap-2 my-1 text-on-surface-variant text-xs md:text-sm">
          <span className="text-primary-fixed mt-1 text-[10px]">•</span>
          <span className="flex-1">{parseInlineFormatting(bulletText)}</span>
        </li>
      );
    }

    // Numbered Lists (1. item)
    const numberedMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const itemText = numberedMatch[2];
      return (
        <li key={lineIdx} className="ml-3 list-none flex items-start gap-2 my-1 text-on-surface-variant text-xs md:text-sm">
          <span className="text-secondary-fixed-dim font-bold text-[11px] mt-0.5">{num}.</span>
          <span className="flex-1">{parseInlineFormatting(itemText)}</span>
        </li>
      );
    }

    // Divider
    if (trimmed === "---") {
      return <hr key={lineIdx} className="my-4 border-white/10" />;
    }

    // Default Paragraph
    return (
      <p key={lineIdx} className="my-1.5 leading-relaxed text-on-surface-variant text-xs md:text-sm">
        {parseInlineFormatting(trimmed)}
      </p>
    );
  });
};

// Inline bold formatter (**bold**)
const parseInlineFormatting = (text) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} className="font-bold text-white">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export default function AICoachChat({ userProfile, activeLog }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "ai",
      text: `Hello! I am your **FitSync AI Coach**. 🦾

I have analyzed your fitness metrics and logged recovery details. I'm ready to act as your personalized performance guide.

How can I help you today? You can type your question or select one of the recovery queries below!`,
      timestamp: new Date(),
      streaming: false
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatHistoryRef = useRef(null);

  // Auto scroll to bottom of chat history when new messages arrive or typing status changes
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle message sending
  const handleSend = (textToSend = inputValue) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText) return;

    // 1. Add user message
    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: "user",
      text: trimmedText,
      timestamp: new Date(),
      streaming: false
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // 2. Simulate AI "thinking" delay
    setTimeout(() => {
      setIsTyping(false);
      const coachText = getCoachResponse(trimmedText, userProfile, activeLog);
      const aiMsgId = `ai-${Date.now()}`;

      // Insert empty AI message to start streaming
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: "ai",
          text: "",
          timestamp: new Date(),
          streaming: true
        }
      ]);

      // Stream response character-chunk by character-chunk
      let currentLength = 0;
      const chunkSpeed = 3; // Characters added per tick
      const tickMs = 15; // Interval duration

      const timer = setInterval(() => {
        currentLength += chunkSpeed;
        if (currentLength >= coachText.length) {
          currentLength = coachText.length;
          clearInterval(timer);
        }

        const partialText = coachText.slice(0, currentLength);

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === aiMsgId) {
              return {
                ...msg,
                text: partialText,
                streaming: currentLength < coachText.length
              };
            }
            return msg;
          })
        );
      }, tickMs);
    }, 1200); // 1.2s delay for realism
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: "Conversation reset. How can I help you optimize your training and recovery now? 🦾",
        timestamp: new Date(),
        streaming: false
      }
    ]);
  };

  // Quick prompt suggestions
  const SUGGESTIONS = [
    { label: "Muscle Soreness", text: "My muscles are sore from my last workout, what is the best recovery protocol?", icon: <Flame className="h-3.5 w-3.5 text-orange-400" /> },
    { label: "Feeling Tired", text: "I feel tired and low energy today. Should I skip my workout or push through?", icon: <Activity className="h-3.5 w-3.5 text-cyan-400" /> },
    { label: "Protein Intake", text: "What is my daily protein target and how should I distribute it?", icon: <Dumbbell className="h-3.5 w-3.5 text-primary-fixed" /> },
    { label: "Workout Structure", text: "How do I structure a workout session to balance heavy lifts and recovery?", icon: <Clock className="h-3.5 w-3.5 text-purple-400" /> }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col glass-card rounded-2xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-container-high/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-fixed to-secondary-fixed-dim p-0.5 flex items-center justify-center neo-cyan-glow">
              <div className="w-full h-full bg-surface-container-lowest rounded-[10px] flex items-center justify-center">
                <Bot className="h-5.5 w-5.5 text-primary-fixed glow-lime" />
              </div>
            </div>
            {/* Status dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary-fixed rounded-full border-2 border-surface-container-lowest animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display-sm text-sm md:text-base font-bold text-white tracking-tight">FitSync Coach</h3>
              <Sparkle className="h-3.5 w-3.5 text-secondary-fixed-dim animate-spin-slow" />
            </div>
            <p className="text-[10px] md:text-xs text-on-surface-variant font-label-sm uppercase tracking-wider">
              {isTyping ? "Synthesizing response..." : "Active Cognitive Guide"}
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-lg bg-white/5 text-on-surface-variant hover:text-white hover:bg-white/10 hover:border-white/20 transition-all border border-transparent cursor-pointer flex items-center gap-1 text-xs"
          title="Reset Conversation"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Chat History Area */}
      <div
        ref={chatHistoryRef}
        className="flex-1 overflow-y-auto px-6 py-6 min-h-[350px] max-h-[500px] flex flex-col gap-4 no-scrollbar bg-surface/20"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 max-w-[85%] ${isAI ? "self-start" : "self-end flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isAI
                    ? "bg-primary-fixed/10 border-primary-fixed/20 text-primary-fixed"
                    : "bg-secondary-fixed-dim/10 border-secondary-fixed-dim/20 text-secondary-fixed-dim"
                }`}>
                  {isAI ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                </div>

                {/* Text bubble */}
                <div className={`rounded-2xl px-4 py-3 relative border ${
                  isAI
                    ? "bg-surface-container/80 border-white/5 rounded-tl-none text-on-surface"
                    : "bg-secondary-fixed-dim/5 border-secondary-fixed-dim/25 rounded-tr-none text-white shadow-[0_0_15px_rgba(0,219,233,0.03)]"
                }`}>
                  {/* Decorative background lights inside bubbles */}
                  {isAI ? (
                    <div className="absolute top-0 left-0 w-12 h-12 bg-primary-fixed/3 rounded-full blur-xl pointer-events-none"></div>
                  ) : (
                    <div className="absolute top-0 right-0 w-12 h-12 bg-secondary-fixed-dim/3 rounded-full blur-xl pointer-events-none"></div>
                  )}

                  <div className="relative z-10 break-words select-text">
                    {parseMessageText(msg.text)}
                  </div>
                  
                  {/* Streamer flashing indicator */}
                  {msg.streaming && (
                    <span className="inline-block w-1.5 h-3.5 ml-1 bg-primary-fixed/80 animate-pulse vertical-middle align-middle" />
                  )}

                  {/* Timestamp */}
                  <span className="block text-[9px] text-on-surface-variant/40 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator bubble */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-[80%] self-start"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed flex items-center justify-center shrink-0">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div className="bg-surface-container/80 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed/70 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed/40 animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested prompts list */}
      <div className="px-6 pt-3 pb-2 border-t border-white/5 bg-surface-container-low/20">
        <p className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-primary-fixed" /> Suggested Recovery Queries
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary-fixed/30 hover:bg-primary-fixed/5 text-xs text-on-surface hover:text-white transition-all shrink-0 cursor-pointer active:scale-95 duration-200"
            >
              {sug.icon}
              <span>{sug.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Footer */}
      <div className="p-4 border-t border-white/5 bg-surface-container-high/40 backdrop-blur-md flex items-center gap-3">
        <textarea
          rows={1}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask AI Coach about soreness, fatigue, workouts, protein..."
          className="flex-1 bg-surface-container-lowest/80 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-on-surface-variant/40 focus:outline-none focus:border-primary-fixed/50 transition-all resize-none max-h-24 no-scrollbar"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isTyping}
          className="bg-primary-fixed text-on-primary-fixed hover:bg-white active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all p-3 rounded-xl glow-lime cursor-pointer flex items-center justify-center shrink-0 shadow-lg"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
