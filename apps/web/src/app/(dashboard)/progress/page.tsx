import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, Scale, Ruler, Camera, Plus, Calendar, ChevronRight, Info } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ProgressPage() {
  return (
    <div className="p-8 space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight">Progress Tracking</h1>
          <p className="text-muted-foreground mt-2">Visualise your transformation and celebrate every win.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-white/5 hover:bg-white/5 font-bold gap-2">
            <Camera className="h-4 w-4" />
            Add Progress Photo
          </Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold gap-2">
            <Plus className="h-4 w-4" />
            Log New Metrics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Tracking */}
        <Card className="lg:col-span-2 p-10 glass border-white/5 rounded-[3rem] space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading">Weight Transformation</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Goal: 75.0 kg</p>
              </div>
            </div>
            <div className="flex bg-muted/50 p-1 rounded-xl border border-white/5">
              <Button variant="ghost" size="sm" className="text-xs h-8 px-4 rounded-lg bg-background shadow-sm font-bold">3M</Button>
              <Button variant="ghost" size="sm" className="text-xs h-8 px-4 rounded-lg text-muted-foreground hover:text-foreground font-bold">6M</Button>
              <Button variant="ghost" size="sm" className="text-xs h-8 px-4 rounded-lg text-muted-foreground hover:text-foreground font-bold">1Y</Button>
            </div>
          </div>

          <div className="h-[300px] w-full bg-background/30 rounded-[2rem] border border-white/5 flex items-end justify-between px-10 pb-10 relative group">
             {/* Simple SVG Chart Placeholder */}
             <svg className="absolute inset-0 w-full h-full px-10 pb-10 overflow-visible" preserveAspectRatio="none">
               <path 
                 d="M 0 150 Q 50 120 100 130 T 200 100 T 300 110 T 400 80 T 500 90 T 600 60" 
                 fill="none" 
                 stroke="var(--secondary)" 
                 strokeWidth="4"
                 strokeLinecap="round"
                 className="drop-shadow-[0_0_8px_rgba(0,201,167,0.4)]"
               />
               <circle cx="600" cy="60" r="6" fill="var(--secondary)" />
             </svg>
             <div className="absolute inset-x-10 bottom-4 flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
               <span>March</span>
               <span>April</span>
               <span>May</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <MetricSmall 
              label="Starting Weight" 
              value="84.2 kg" 
              date="Mar 1, 2026" 
            />
            <MetricSmall 
              label="Current Weight" 
              value="78.2 kg" 
              date="May 18, 2026" 
              trend="-6.0 kg" 
              trendColor="text-secondary"
            />
            <MetricSmall 
              label="Remaining" 
              value="3.2 kg" 
              date="To reach 75kg" 
            />
          </div>
        </Card>

        {/* Body Measurements */}
        <div className="space-y-8">
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                <Ruler className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold font-heading">Measurements</h2>
            </div>
            
            <div className="space-y-4">
              <MeasurementItem label="Chest" value="104 cm" trend="+2 cm" />
              <MeasurementItem label="Waist" value="82 cm" trend="-4 cm" />
              <MeasurementItem label="Hips" value="96 cm" trend="-2 cm" />
              <MeasurementItem label="Arms" value="38 cm" trend="+1.5 cm" />
            </div>

            <Button variant="ghost" className="w-full text-accent hover:text-accent hover:bg-accent/10 font-bold group">
              View All History
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-primary/40 to-background border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
               <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary animate-bounce">
                  <TrendingUp className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-bold font-heading">Milestone Reached!</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">
                 You've been consistent for 30 days! You're in the top 2% of beginners this month.
               </p>
               <div className="pt-2">
                 <Button className="bg-secondary text-primary font-bold rounded-xl px-8">Claim Badge</Button>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetricSmall({ label, value, date, trend, trendColor }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-xl font-bold font-heading">{value}</p>
        {trend && <span className={cn("text-[10px] font-bold", trendColor)}>{trend}</span>}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">{date}</p>
    </div>
  )
}

function MeasurementItem({ label, value, trend }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all cursor-default group">
      <span className="font-bold text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{value}</span>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          trend.startsWith('+') ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"
        )}>
          {trend}
        </span>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"
