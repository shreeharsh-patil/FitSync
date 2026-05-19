import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Utensils, 
  Droplets, 
  Plus, 
  Brain, 
  Search,
  ChevronRight,
  TrendingUp,
  Apple,
  Coffee,
  Sun,
  Moon
} from "lucide-react"

export default function NutritionPage() {
  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Nutrition Tracking</h1>
          <p className="text-muted-foreground">Fuel your performance. Track your macros and hydration.</p>
        </div>
        <Button className="bg-secondary text-primary font-bold">
          <Search className="h-4 w-4 mr-2" /> Log Food
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Calorie & Macros Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="md:col-span-2 p-6 glass flex items-center justify-between border-secondary/20">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Calories Remaining</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-mono tracking-tighter">2,240</span>
                  <span className="text-muted-foreground text-sm">/ 2,800 kcal</span>
                </div>
                <div className="w-full bg-muted/30 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-secondary h-full w-[80%]" />
                </div>
              </div>
              <div className="hidden sm:block">
                <TrendingUp className="h-12 w-12 text-secondary opacity-20" />
              </div>
            </Card>
            
            <MacroCard label="Protein" current={140} target={180} unit="g" color="bg-secondary" />
            <MacroCard label="Carbs" current={210} target={300} unit="g" color="bg-blue-400" />
          </div>

          {/* Meals Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Today's Meals</h2>
            <div className="space-y-4">
              <MealCard 
                icon={<Coffee className="h-5 w-5" />} 
                name="Breakfast" 
                time="08:00 AM" 
                calories={540} 
                items={[
                  "Oatmeal with Blueberries & Honey",
                  "Protein Shake (Whey)",
                  "Black Coffee"
                ]} 
              />
              <MealCard 
                icon={<Sun className="h-5 w-5" />} 
                name="Lunch" 
                time="01:30 PM" 
                calories={720} 
                items={[
                  "Grilled Chicken Breast (200g)",
                  "Quinoa with Roasted Vegetables",
                  "Half Avocado"
                ]} 
              />
              <MealCard 
                icon={<Moon className="h-5 w-5" />} 
                name="Dinner" 
                time="07:45 PM" 
                calories={0} 
                isPending 
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Water Tracker */}
          <Card className="p-6 bg-card border-border/40">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold font-heading">Hydration</h3>
              </div>
              <span className="text-xs font-mono font-bold text-blue-400">1.5 / 3.0L</span>
            </div>
            <div className="flex justify-between items-end gap-1 h-32 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm transition-all duration-500 ${i <= 4 ? 'bg-blue-400' : 'bg-muted/20'}`}
                  style={{ height: i <= 4 ? `${20 + i * 10}%` : '10%' }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                +250ml
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                +500ml
              </Button>
            </div>
          </Card>

          {/* AI Meal Tip */}
          <Card className="glass border-accent/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-accent" />
              <h3 className="font-bold font-heading">AI Nutrition Tip</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "Your protein intake is 15% lower than average for a heavy leg day. Adding 30g of protein to your dinner will optimize muscle protein synthesis tonight."
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MacroCard({ label, current, target, unit, color }: any) {
  const percentage = (current / target) * 100
  return (
    <Card className="p-4 bg-card border-border/40 flex flex-col justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono">{current}</span>
          <span className="text-muted-foreground text-[10px]">/ {target}{unit}</span>
        </div>
        <div className="w-full bg-muted/30 h-1 rounded-full mt-2 overflow-hidden">
          <div className={`${color} h-full`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </Card>
  )
}

function MealCard({ icon, name, time, calories, items, isPending }: any) {
  return (
    <Card className="glass border-border/40 p-6 group hover:border-secondary/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-secondary">
            {icon}
          </div>
          <div>
            <h4 className="font-bold">{name}</h4>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold font-mono">
            {isPending ? "--" : calories} <span className="text-[10px] text-muted-foreground">kcal</span>
          </div>
          {!isPending && <span className="text-[10px] text-secondary font-bold">Logged</span>}
        </div>
      </div>
      
      {!isPending ? (
        <ul className="space-y-2 mb-4">
          {items.map((item: string, i: number) => (
            <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-secondary/40" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-4 border-2 border-dashed border-border/20 rounded-lg flex flex-col items-center justify-center text-muted-foreground mb-4">
          <Apple className="h-6 w-6 mb-2 opacity-20" />
          <span className="text-xs italic">No entries yet</span>
        </div>
      )}

      <Button variant="ghost" className="w-full text-xs hover:bg-secondary/10 hover:text-secondary h-8">
        <Plus className="h-3 w-3 mr-1" /> {isPending ? "Log Meal" : "Add Food"}
      </Button>
    </Card>
  )
}
