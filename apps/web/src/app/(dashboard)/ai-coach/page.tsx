import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageSquare, Send, Sparkles, User, Bot, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AICoachPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight flex items-center gap-3">
            AI Coach 
            <Sparkles className="h-6 w-6 text-secondary fill-secondary" />
          </h1>
          <p className="text-muted-foreground mt-2">Personalized fitness intelligence, available 24/7.</p>
        </div>
        <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 font-bold gap-2">
          <Plus className="h-4 w-4" />
          New Session
        </Button>
      </div>

      <Card className="flex-1 glass border-border/40 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ChatMessage 
            role="bot" 
            content="Hello Alex! I've analyzed your workout from yesterday. Your squat volume increased by 15%, which is excellent progress. How are you feeling today? Ready for your Upper Body session?"
            time="9:41 AM"
          />
          <ChatMessage 
            role="user" 
            content="I'm feeling a bit sore in my quads, but otherwise good. Should I adjust today's volume?"
            time="9:42 AM"
          />
          <ChatMessage 
            role="bot" 
            content="Since today is Upper Body focused, quad soreness won't directly impact your main lifts. However, I'd suggest a 5-minute longer dynamic warmup to improve systemic blood flow. We'll keep the Upper Body volume as planned to maintain your current adaptation curve. Want me to load the specific warmup exercises?"
            time="9:43 AM"
          />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-border/40 bg-muted/30">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input 
                placeholder="Ask anything about your training, nutrition, or recovery..." 
                className="pr-12 h-12 bg-background/50 border-border/40 focus:border-secondary/40 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">
                GPT-4o
              </div>
            </div>
            <Button size="icon" className="h-12 w-12 bg-secondary hover:bg-secondary/90 text-primary">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest">
            FitSync AI can make mistakes. Verify important health information.
          </p>
        </div>
      </Card>
    </div>
  )
}

function ChatMessage({ role, content, time }: { role: 'user' | 'bot', content: string, time: string }) {
  const isBot = role === 'bot'
  return (
    <div className={cn("flex gap-4 max-w-[80%]", isBot ? "self-start" : "self-end flex-row-reverse text-right")}>
      <div className={cn(
        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
        isBot ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-primary/20 text-accent border-accent/20"
      )}>
        {isBot ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>
      <div className="space-y-1">
        <div className={cn(
          "p-4 rounded-2xl text-sm leading-relaxed",
          isBot ? "bg-muted/50 rounded-tl-none text-foreground" : "bg-secondary text-primary font-medium rounded-tr-none"
        )}>
          {content}
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest px-1">{time}</p>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"
