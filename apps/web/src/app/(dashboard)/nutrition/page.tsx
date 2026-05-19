import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Utensils, Droplets, Flame, Plus, Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function NutritionPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight">Nutrition</h1>
        <p className="text-muted-foreground mt-2">Fuel your performance and track your macros.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard 
              icon={<Flame className="h-5 w-5 text-orange-500" />}
              label="Calories"
              value="1,840"
              target="2,400 kcal"
              color="bg-orange-500"
              percentage={76}
            />
            <StatsCard 
              icon={<Utensils className="h-5 w-5 text-secondary" />}
              label="Protein"
              value="142g"
              target="180g"
              color="bg-secondary"
              percentage={78}
            />
            <StatsCard 
              icon={<Droplets className="h-5 w-5 text-blue-500" />}
              label="Water"
              value="2.4L"
              target="3.5L"
              color="bg-blue-500"
              percentage={68}
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-heading">Recent Meals</h2>
              <Button variant="ghost" className="text-secondary hover:text-secondary hover:bg-secondary/10">
                View History
              </Button>
            </div>
            <div className="space-y-3">
              <MealItem name="Grilled Chicken Salad" calories={450} time="1:30 PM" category="Lunch" />
              <MealItem name="Oatmeal with Berries" calories={320} time="8:15 AM" category="Breakfast" />
              <MealItem name="Protein Shake" calories={180} time="10:45 AM" category="Snack" />
            </div>
          </div>
        </div>

        {/* Food Search & AI Suggestions */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Log Food</h2>
            <Card className="p-6 glass border-secondary/20 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search food database..." className="pl-10" />
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white gap-2">
                <Plus className="h-4 w-4" />
                Add Custom Meal
              </Button>
            </Card>
          </div>

          <Card className="p-6 bg-secondary/10 border-secondary/20 border relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Utensils className="h-24 w-24 text-secondary" />
            </div>
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold text-sm uppercase tracking-wider">
                <Zap className="h-4 w-4 fill-secondary" />
                AI Meal Planner
              </div>
              <h3 className="text-lg font-bold font-heading">Need a recipe?</h3>
              <p className="text-sm text-muted-foreground">Get a personalized 7-day meal plan based on your goals.</p>
              <Button variant="link" className="p-0 h-auto text-secondary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Generate Now
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ icon, label, value, target, color, percentage }: { icon: React.ReactNode, label: string, value: string, target: string, color: string, percentage: number }) {
  return (
    <Card className="p-6 glass border-border/40">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg bg-background/50 flex items-center justify-center border border-border/40">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold font-heading">{value}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
          <span>Progress</span>
          <span>Target: {target}</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </Card>
  )
}

function MealItem({ name, calories, time, category }: { name: string, calories: number, time: string, category: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl glass border border-border/40 hover:border-secondary/20 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
          <Utensils className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{name}</h3>
          <p className="text-xs text-muted-foreground">{category} • {time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-sm">{calories} kcal</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Logged</p>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"
import { Zap } from "lucide-react"
