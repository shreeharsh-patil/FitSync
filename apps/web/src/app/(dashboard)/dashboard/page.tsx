import { Card } from "@/components/ui/card"
import { 
  Zap, 
  Flame, 
  Trophy, 
  ArrowUpRight, 
  Clock, 
  Target,
  ChevronRight,
  Brain
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Alex. Here's your performance summary.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
            <Flame className="h-5 w-5 text-secondary animate-pulse" />
            <span className="font-bold text-secondary">7 Day Streak</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: 2 columns wide on large screens */}
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Summary Rings Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActivityRingCard 
              label="Calories" 
              value="850" 
              goal="1200" 
              unit="kcal" 
              color="text-secondary" 
            />
            <ActivityRingCard 
              label="Active Min" 
              value="45" 
              goal="60" 
              unit="min" 
              color="text-accent" 
            />
            <ActivityRingCard 
              label="Steps" 
              value="8,432" 
              goal="10,000" 
              unit="steps" 
              color="text-blue-400" 
            />
          </div>

          {/* Recent Workouts */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-heading">Recent Workouts</h2>
              <button className="text-sm text-secondary hover:underline flex items-center">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <WorkoutLogItem 
                title="Upper Body Power" 
                date="Today, 10:30 AM" 
                duration="65 min" 
                volume="4,500 kg" 
              />
              <WorkoutLogItem 
                title="Morning Yoga Flow" 
                date="Yesterday, 07:00 AM" 
                duration="30 min" 
                volume="--" 
              />
              <WorkoutLogItem 
                title="Leg Day Intensity" 
                date="12 May, 06:15 PM" 
                duration="75 min" 
                volume="8,200 kg" 
              />
            </div>
          </section>

          {/* Goal Progress */}
          <section>
            <h2 className="text-xl font-bold font-heading mb-4">Goal Progress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GoalCard 
                title="Weight Loss" 
                current={78.5} 
                target={75.0} 
                unit="kg" 
                progress={65} 
              />
              <GoalCard 
                title="Muscle Gain" 
                current={4.2} 
                target={6.0} 
                unit="kg muscle" 
                progress={40} 
              />
            </div>
          </section>
        </div>

        {/* Sidebar Column: 1 column wide */}
        <div className="space-y-8">
          {/* AI Insights */}
          <Card className="glass border-secondary/20 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain className="h-24 w-24 text-secondary" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-secondary" />
              <h3 className="font-bold font-heading">FitSync AI Insights</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <p className="text-sm leading-relaxed italic text-muted-foreground border-l-2 border-secondary/40 pl-4">
                "You're strongest on Tuesdays between 10 AM and 12 PM. Consider scheduling your next PR attempt then."
              </p>
              <p className="text-sm leading-relaxed italic text-muted-foreground border-l-2 border-secondary/40 pl-4">
                "Your protein intake was 15% below target yesterday. Aim for 30g with breakfast to recover faster."
              </p>
            </div>
            <button className="w-full mt-6 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary text-sm font-bold rounded-lg transition-colors">
              Talk to AI Coach
            </button>
          </Card>

          {/* Achievements Preview */}
          <section>
            <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent" />
              Latest Achievements
            </h3>
            <div className="flex gap-2">
              <div className="h-12 w-12 rounded-full bg-muted border border-border/40 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help" title="Early Bird">
                🌅
              </div>
              <div className="h-12 w-12 rounded-full bg-muted border border-secondary/40 flex items-center justify-center" title="7 Day Streak">
                🔥
              </div>
              <div className="h-12 w-12 rounded-full bg-muted border border-border/40 flex items-center justify-center grayscale" title="100 Workouts">
                💯
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function ActivityRingCard({ label, value, goal, unit, color }: any) {
  const percentage = Math.min(100, (parseInt(value.replace(',', '')) / parseInt(goal.replace(',', ''))) * 100)
  
  return (
    <Card className="p-6 bg-card border-border/40 hover:border-border transition-colors">
      <div className="flex flex-col items-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className="relative h-24 w-24 flex items-center justify-center">
          <svg className="h-full w-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted/10"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * percentage) / 100}
              className={cn(color, "transition-all duration-1000 ease-out")}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold font-mono tracking-tighter">{value}</span>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground">Goal: {goal} {unit}</span>
      </div>
    </Card>
  )
}

function WorkoutLogItem({ title, date, duration, volume }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm">{title}</h4>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {duration}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Target className="h-3 w-3" /> {volume}
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
      </div>
    </div>
  )
}

function GoalCard({ title, current, target, unit, progress }: any) {
  return (
    <Card className="p-6 bg-card border-border/40">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-sm">{title}</h4>
        <span className="text-xs font-mono text-secondary">{progress}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
        <div 
          className="bg-secondary h-full rounded-full transition-all duration-1000" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Current: {current}{unit}</span>
        <span>Target: {target}{unit}</span>
      </div>
    </Card>
  )
}

import { cn } from "@/lib/utils"
