"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Brain, Dumbbell, Utensils, LineChart, CheckCircle, Zap, Sparkles, ChevronRight } from "lucide-react";

const pillars = [
  { title: "AI Coaching Matrix", tagline: "Intelligent Guidance, Powered by AI", icon: <Brain className="h-8 w-8 text-secondary" />,
    description: "No generic templates. FitSync's AI layers compile your specific lifts, daily calories, and sleep rhythms to deliver hyper-targeted progressive overloads and recovery protocols.",
    bullets: ["Context-aware form & routine adjustments", "Overtraining checks to avoid injuries", "Custom active recovery protocols"],
    preview: "AI Coaching System Online", gradient: "from-secondary/20" },
  { title: "Athletic Workout Builder", tagline: "Track and Optimize with Precision", icon: <Dumbbell className="h-8 w-8 text-accent" />,
    description: "Build beautiful routines from our database of 500+ movements. Use our tracker to log weight, reps, sets, and rest times.",
    bullets: ["Dynamic drop sets and circuits support", "Estimated 1-Rep Max (1RM) tracker", "Audio cues and visual rest indicators"],
    preview: "Leg Day Destroyer Routine Active", gradient: "from-accent/20" },
  { title: "Macro-Nutrition Vault", tagline: "Fuel Your Hypertrophy or Deficit", icon: <Utensils className="h-8 w-8 text-blue-400" />,
    description: "Log meals in seconds, calculate exact macronutrient ratios, and monitor water intakes to maintain ultimate cell hydration.",
    bullets: ["900k+ food items database", "Auto-calculated TDEE & deficits", "One-click calorie & macro logs"],
    preview: "Nutrition Logs Synchronized", gradient: "from-blue-500/20" },
  { title: "Visual Transformation Dash", tagline: "Analytics That Celebrate Consistency", icon: <LineChart className="h-8 w-8 text-yellow-400" />,
    description: "See your body transform through high-fidelity progression charts, weight trendlines, and body measurement metrics.",
    bullets: ["Relational weight & fat percentage lines", "Streak metrics powered by gamification", "Milestone progress bars & ETA tools"],
    preview: "Progress Metrics Updated Today", gradient: "from-yellow-400/20" },
];

export default function FeaturesPage() {
  const [activePillar, setActivePillar] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      <header className="w-full border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><Activity className="h-6 w-6" /></div>
            <span className="text-2xl font-bold font-heading tracking-tighter text-white">FitSync</span>
          </Link>
          <nav className="ml-auto hidden md:flex gap-8">
            <Link className="text-sm font-bold uppercase tracking-widest text-secondary" href="/features">Features</Link>
            <Link className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-secondary transition-colors" href="/pricing">Pricing</Link>
          </nav>
          <div className="ml-auto md:ml-8 flex gap-4">
            <Link href="/login"><button className="px-5 py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-white">Login</button></Link>
            <Link href="/signup"><button className="px-6 py-2 bg-secondary text-primary text-sm font-bold uppercase tracking-widest rounded-xl">Join Free</button></Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_60%)] opacity-[0.02] pointer-events-none" />
        <div className="container px-4 mx-auto max-w-6xl space-y-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-[0.2em]">
              <Zap className="h-3 w-3 fill-accent" />Engineered For Results
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight leading-tight">
              An Ecosystem of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary bg-[length:200%_auto] animate-gradient">Peak Performance</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">Unify your workouts, nutrition, streaks, and AI coach insights in one hyper-fast interface.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            <div className="lg:col-span-4 space-y-4">
              {pillars.map((p, idx) => (
                <motion.button key={idx} whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }} onClick={() => setActivePillar(idx)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${activePillar === idx ? "bg-white/5 border-secondary/40 shadow-xl shadow-secondary/5" : "bg-transparent border-white/5 hover:border-white/10"}`}>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all ${activePillar === idx ? "bg-secondary/15 border-secondary/30" : "bg-white/5 border-white/5"}`}>
                    {p.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm tracking-wide ${activePillar === idx ? "text-secondary" : "text-muted-foreground"}`}>{p.title}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Pillar 0{idx + 1}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activePillar} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                className="lg:col-span-8 glass p-10 border-white/10 rounded-[3rem] space-y-8 relative overflow-hidden h-full flex flex-col justify-between min-h-[420px]">
                <div className={`absolute inset-0 bg-gradient-to-br ${pillars[activePillar].gradient} via-transparent to-transparent opacity-60`} />
                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{pillars[activePillar].tagline}</span>
                    <h2 className="text-3xl md:text-4xl font-bold font-heading">{pillars[activePillar].title}</h2>
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed">{pillars[activePillar].description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {pillars[activePillar].bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-3 text-sm font-semibold">
                        <div className="h-5 w-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0"><CheckCircle className="h-3.5 w-3.5 text-secondary" /></div>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between mt-8 relative z-10">
                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                    <div className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse" />
                    <span>{pillars[activePillar].preview}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-secondary">v1.0 Ready</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 border-t border-white/5">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-3"><Activity className="h-6 w-6 text-secondary" /><span className="text-xl font-bold font-heading tracking-tighter">FitSync</span></div>
          <p className="text-sm text-muted-foreground">© 2026 FitSync Platform.</p>
        </div>
      </footer>
    </div>
  );
}
