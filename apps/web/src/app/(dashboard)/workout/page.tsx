"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Dumbbell, 
  History,
  CheckCircle2,
  MoreVertical,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function WorkoutSessionPage() {
  const [seconds, setSeconds] = useState(2535) // 42:15
  const [isActive, setIsActive] = useState(true)
  const [restSeconds, setRestSeconds] = useState(90) // 01:30

  useEffect(() => {
    let interval: any = null
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1)
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, seconds])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8 pb-32">
      <header className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b border-border/40 -mx-8 px-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-secondary border border-secondary/20">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading">Upper Body Power</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className={cn("font-mono font-bold", isActive ? "text-secondary" : "text-muted-foreground")}>
                {formatTime(seconds)}
              </span>
              <span className="text-muted-foreground text-xs">• Active Session</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setIsActive(!isActive)}>
            {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isActive ? "Pause" : "Resume"}
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-white font-bold px-6">
            Finish Workout
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Exercise Area */}
        <div className="lg:col-span-2 space-y-6">
          <ExerciseCard 
            name="Barbell Bench Press" 
            sets={[
              { id: 1, weight: 100, reps: 8, completed: true, previous: "100kg x 8" },
              { id: 2, weight: 102.5, reps: 6, completed: false, previous: "100kg x 8" },
              { id: 3, weight: 102.5, reps: 5, completed: false, previous: "100kg x 8" },
            ]} 
          />
          
          <ExerciseCard 
            name="Incline Dumbbell Press" 
            sets={[
              { id: 4, weight: 32, reps: 10, completed: false, previous: "30kg x 12" },
              { id: 5, weight: 32, reps: 10, completed: false, previous: "30kg x 12" },
              { id: 6, weight: 32, reps: 10, completed: false, previous: "30kg x 10" },
            ]} 
          />

          <Button variant="ghost" className="w-full border-2 border-dashed border-border/40 py-8 text-muted-foreground hover:border-secondary/40 hover:text-secondary transition-all">
            <Plus className="h-5 w-5 mr-2" /> Add Exercise
          </Button>
        </div>

        {/* Upcoming Exercises Sidebar */}
        <div className="space-y-6">
          <section className="glass p-6 rounded-xl border-border/40">
            <h3 className="font-bold font-heading mb-4 flex items-center gap-2">
              <History className="h-4 w-4 text-secondary" />
              Up Next
            </h3>
            <div className="space-y-3">
              <UpcomingItem name="Weighted Dips" sets="3 Sets" />
              <UpcomingItem name="Lat Pulldowns" sets="4 Sets" />
              <UpcomingItem name="Lateral Raises" sets="3 Sets" />
              <UpcomingItem name="Face Pulls" sets="3 Sets" />
            </div>
          </section>
        </div>
      </div>

      {/* Floating Rest Timer */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="glass px-8 py-4 rounded-2xl flex items-center gap-8 shadow-2xl border-secondary/20 ring-1 ring-black/50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Rest Timer</span>
            <span className="text-3xl font-bold font-mono text-secondary tabular-nums">
              {formatTime(restSeconds)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="rounded-full border-border/40">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button className="rounded-full bg-secondary text-primary font-bold px-6">
              Skip Rest
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExerciseCard({ name, sets }: any) {
  return (
    <Card className="glass border-border/40 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold font-heading">{name}</h3>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">
          <div className="col-span-1">Set</div>
          <div className="col-span-4 text-center">Previous</div>
          <div className="col-span-3 text-center">Weight</div>
          <div className="col-span-3 text-center">Reps</div>
          <div className="col-span-1 text-center">Status</div>
        </div>
        
        {sets.map((set: any, index: number) => (
          <div 
            key={set.id} 
            className={cn(
              "grid grid-cols-12 gap-4 items-center p-2 rounded-lg transition-colors",
              set.completed ? "bg-secondary/5 border border-secondary/10" : "bg-muted/30 border border-transparent"
            )}
          >
            <div className="col-span-1 text-sm font-bold font-mono text-center">{index + 1}</div>
            <div className="col-span-4 text-xs text-muted-foreground font-mono text-center italic">{set.previous}</div>
            <div className="col-span-3">
              <Input 
                type="number" 
                defaultValue={set.weight} 
                className="h-8 text-center font-mono font-bold bg-background/50 border-border/40" 
              />
            </div>
            <div className="col-span-3">
              <Input 
                type="number" 
                defaultValue={set.reps} 
                className="h-8 text-center font-mono font-bold bg-background/50 border-border/40" 
              />
            </div>
            <div className="col-span-1 flex justify-center">
              <Checkbox 
                checked={set.completed} 
                className="h-5 w-5 border-border/60 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" 
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function UpcomingItem({ name, sets }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/20 group hover:border-secondary/20 transition-colors">
      <span className="text-sm font-medium group-hover:text-foreground transition-colors">{name}</span>
      <span className="text-[10px] font-bold text-muted-foreground uppercase">{sets}</span>
    </div>
  )
}
