import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Search, Dumbbell, Clock, Zap, Save, ChevronLeft, GripVertical, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function WorkoutBuilderPage() {
  return (
    <div className="p-8 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <Link href="/workout">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold font-heading tracking-tight">Create New Plan</h1>
            <p className="text-muted-foreground mt-2">Design your perfect training routine with precision.</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button variant="outline" className="border-white/5 hover:bg-white/5 font-bold rounded-xl px-8 h-12">Save Draft</Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl px-8 h-12 gap-2 shadow-lg shadow-secondary/10">
            <Save className="h-4 w-4" />
            Publish Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Builder Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-10 glass border-white/5 rounded-[3rem] space-y-8">
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Plan Name</label>
                  <Input placeholder="e.g. 12-Week Hypertrophy Protocol" className="h-16 text-2xl font-bold bg-white/5 border-white/5 rounded-2xl focus:border-secondary/40 px-6" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Difficulty</label>
                    <select className="w-full h-14 bg-white/5 border-white/5 rounded-2xl px-4 text-sm font-bold appearance-none hover:bg-white/10 transition-colors">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Days Per Week</label>
                    <Input type="number" min="1" max="7" defaultValue="4" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 font-bold" />
                  </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold font-heading">Exercises</h2>
                  <Button variant="ghost" className="text-secondary font-bold gap-2 hover:bg-secondary/10 hover:text-secondary rounded-xl">
                    <Plus className="h-4 w-4" />
                    Add Exercise
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <BuilderExerciseItem name="Barbell Bench Press" sets="4" reps="8-10" rest="90s" />
                  <BuilderExerciseItem name="Incline Dumbbell Flyes" sets="3" reps="12-15" rest="60s" />
                  <BuilderExerciseItem name="Weighted Dips" sets="3" reps="AMRAP" rest="120s" />
                </div>

                <Button variant="outline" className="w-full h-24 border-white/5 border-dashed hover:border-secondary/20 hover:bg-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-2 group transition-all">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-secondary transition-colors">Drag or click to add next movement</span>
                </Button>
             </div>
          </Card>
        </div>

        {/* Search & Sidebar */}
        <div className="space-y-8">
           <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
             <div className="space-y-2">
               <h2 className="text-xl font-bold font-heading">Exercise Library</h2>
               <p className="text-xs text-muted-foreground">Search and drag exercises into your plan.</p>
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search 500+ movements..." className="pl-10 bg-white/5 border-white/5 rounded-xl h-12" />
             </div>
             <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {["Deadlift", "Squat", "Pull-up", "Overhead Press", "Barbell Row", "Lunges", "Plank", "Leg Press"].map((ex) => (
                  <div key={ex} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-secondary/20 cursor-move group transition-all">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground/40 group-hover:text-secondary/40 transition-colors" />
                      <span className="text-sm font-bold">{ex}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg hover:bg-secondary/10 hover:text-secondary">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
             </div>
           </Card>

           <Card className="p-8 bg-secondary/10 border-secondary/20 border rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="h-24 w-24 text-secondary fill-secondary" />
              </div>
              <div className="relative z-10 space-y-4">
                 <h3 className="text-xl font-bold font-heading">AI Plan Assistant</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Let our AI analyze your goals and generate a scientifically-backed plan for you.
                 </p>
                 <Button className="bg-secondary text-primary font-bold w-full rounded-xl h-12 shadow-lg shadow-secondary/10">Generate with AI</Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}

function BuilderExerciseItem({ name, sets, reps, rest }: any) {
  return (
    <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-secondary/10 group transition-all relative overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
      <GripVertical className="h-5 w-5 text-muted-foreground/40 cursor-move shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold font-heading truncate">{name}</h4>
        <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
           <span>{sets} Sets</span>
           <span>{reps} Reps</span>
           <span>{rest} Rest</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10">
           <Settings className="h-4 w-4" />
         </Button>
         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500">
           <Trash2 className="h-4 w-4" />
         </Button>
      </div>
    </div>
  )
}

import { Settings } from "lucide-react"
