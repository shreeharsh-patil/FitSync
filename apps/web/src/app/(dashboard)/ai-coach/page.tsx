"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Brain, 
  Send, 
  Mic, 
  Sparkles, 
  User, 
  Dumbbell, 
  Flame, 
  ChevronRight,
  MessageSquarePlus,
  Zap,
  Coffee
} from "lucide-react"
import { cn } from "@/lib/utils"

const initialMessages = [
  {
    id: 1,
    role: "ai",
    content: "Your bench press volume has increased by 15% this week! That's impressive progress, Alex. Would you like me to suggest a deload week to optimize recovery, or do you want to keep pushing?",
    timestamp: "10:15 AM"
  },
  {
    id: 2,
    role: "user",
    content: "Keep pushing, but give me some accessory exercises for triceps to help my bench lockout.",
    timestamp: "10:16 AM"
  },
  {
    id: 3,
    role: "ai",
    content: "Understood. For tricep lockout strength, I recommend adding **Weighted Dips** and **Close-Grip Bench Press**. Given your current training load, adding 3 sets of 8-10 reps at the end of your Upper Body sessions would be ideal. Shall I add these to your plan for next Tuesday?",
    timestamp: "10:16 AM"
  }
]

export default function AICoachPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (!inputValue.trim()) return
    const newMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages([...messages, newMessage])
    setInputValue("")
    
    // Mock AI Response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: "ai",
        content: "That sounds like a great goal! I'll update your tracking metrics to focus on that. Is there anything else you'd like to adjust?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1500)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8 text-secondary" />
            FitSync AI Coach
          </h1>
          <p className="text-muted-foreground">Your personalized fitness intelligence assistant.</p>
        </div>
        <Button variant="outline" className="border-secondary/20 text-secondary hover:bg-secondary/10">
          <MessageSquarePlus className="h-4 w-4 mr-2" /> New Session
        </Button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col h-full glass rounded-2xl border-border/40 overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-start gap-4 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                  msg.role === "ai" ? "bg-secondary text-primary" : "bg-primary border border-border/40"
                )}>
                  {msg.role === "ai" ? <Brain className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className="space-y-1">
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === "ai" 
                      ? "bg-slate-900/40 border border-secondary/20 backdrop-blur-md relative overflow-hidden group" 
                      : "bg-primary text-foreground border border-border/40"
                  )}>
                    {msg.role === "ai" && (
                      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="h-12 w-12 text-secondary" />
                      </div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b class="text-secondary">$1</b>') }} />
                  </div>
                  <div className={cn(
                    "text-[10px] text-muted-foreground px-2",
                    msg.role === "user" ? "text-right" : ""
                  )}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/40 bg-background/40 backdrop-blur-sm">
            <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-2 border border-border/20 group focus-within:border-secondary/40 transition-colors">
              <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground hover:text-secondary">
                <Mic className="h-5 w-5" />
              </Button>
              <Input 
                placeholder="Ask me about form, meals, or motivation..." 
                className="border-0 bg-transparent focus-visible:ring-0 text-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                size="icon" 
                className="rounded-full bg-secondary text-primary hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                onClick={handleSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6 overflow-y-auto">
          <Card className="p-6 bg-card border-border/40">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Today's Context</h3>
            <div className="space-y-4">
              <ContextItem icon={<Dumbbell className="h-4 w-4" />} label="Last Workout" value="Upper Body" />
              <ContextItem icon={<Zap className="h-4 w-4" />} label="Intensity" value="High" />
              <ContextItem icon={<Flame className="h-4 w-4" />} label="Calories Burned" value="850 kcal" />
              <ContextItem icon={<Coffee className="h-4 w-4" />} label="Avg. Protein" value="142g / Day" />
            </div>
          </Card>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Quick Actions</h3>
            <div className="space-y-2">
              <QuickActionButton label="Analyze my form" />
              <QuickActionButton label="Suggest meal ideas" />
              <QuickActionButton label="Fix my sleep" />
              <QuickActionButton label="Motivation boost" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function ContextItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between group cursor-default">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="h-7 w-7 rounded bg-muted/50 flex items-center justify-center group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-medium">{label}</span>
      </div>
      <span className="text-xs font-bold font-mono">{value}</span>
    </div>
  )
}

function QuickActionButton({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-muted/20 border border-border/20 text-xs font-medium hover:border-secondary/40 hover:bg-secondary/5 transition-all group">
      {label}
      <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
    </button>
  )
}
