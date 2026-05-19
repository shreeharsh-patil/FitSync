import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function AICoachPage() {
  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight flex items-center gap-3">
            <Bot className="h-8 w-8 text-secondary" />
            FitSync AI Coach
          </h1>
          <p className="text-muted-foreground mt-2">
            Your 24/7 intelligent fitness assistant.
          </p>
        </div>
      </div>

      <Card className="flex-1 glass border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-accent/5 opacity-50 pointer-events-none" />

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Welcome Message */}
          <div className="flex gap-4 max-w-[80%]">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30 mt-1">
              <Bot className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4">
                <p className="text-sm leading-relaxed">
                  Welcome back, Alex! I noticed you hit a new PR on your
                  deadlift yesterday. Are we focusing on recovery today, or are
                  you ready for another session?
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground ml-1">10:00 AM</p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30 mt-1">
              <User className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <div className="bg-accent/10 border border-accent/20 rounded-2xl rounded-tr-sm p-4">
                <p className="text-sm leading-relaxed">
                  I&apos;m feeling a bit sore in my lower back. What&apos;s a
                  good active recovery routine I can do?
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground mr-1 text-right">
                10:02 AM
              </p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex gap-4 max-w-[80%]">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30 mt-1 relative">
              <Bot className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full animate-ping" />
            </div>
            <div className="space-y-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 space-y-4">
                <p className="text-sm leading-relaxed">
                  Lower back soreness after heavy deadlifts is common! Here is a
                  15-minute active recovery routine to promote blood flow
                  without straining the muscles:
                </p>
                <ul className="text-sm space-y-2 list-disc pl-4 text-muted-foreground">
                  <li>Cat-Cow Stretch (2 sets of 10 reps)</li>
                  <li>Child&apos;s Pose (Hold for 30 seconds, 2 sets)</li>
                  <li>Bird Dog (2 sets of 10 reps)</li>
                  <li>Light walking or cycling (10 minutes)</li>
                </ul>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold gap-2"
                  >
                    <Sparkles className="h-3 w-3 text-secondary" />
                    Log this routine
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground ml-1">10:03 AM</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-background/50 backdrop-blur-xl relative z-10">
          <form className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Input
                placeholder="Ask about your workouts, nutrition, or recovery..."
                className="pl-4 pr-12 h-14 bg-white/5 border-white/10 focus:border-secondary/50 rounded-2xl text-base transition-all"
              />
            </div>
            <Button
              type="submit"
              size="icon"
              className="h-14 w-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-primary shadow-lg shadow-secondary/20 shrink-0 transition-transform active:scale-95"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-full border-white/10 bg-white/5 hover:bg-white/10 whitespace-nowrap"
            >
              Generate Meal Plan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-full border-white/10 bg-white/5 hover:bg-white/10 whitespace-nowrap"
            >
              Analyze my last workout
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-full border-white/10 bg-white/5 hover:bg-white/10 whitespace-nowrap"
            >
              Suggest a stretching routine
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
