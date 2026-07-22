"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Dumbbell, Utensils, LineChart, CheckCircle, Zap, Menu, X } from "lucide-react";
import LogoMark from "@/components/LogoMark";

const pillars = [
  {
    title: "AI Coaching Matrix",
    tagline: "Intelligent Guidance",
    icon: Brain,
    description: "No generic templates. Fitsync's AI layers analyze your specific lifts, daily calories, and sleep rhythms to deliver hyper-targeted progressive overloads and recovery protocols.",
    bullets: ["Context-aware form & routine adjustments", "Overtraining checks to prevent injuries", "Custom active recovery protocols"],
    preview: "AI Coaching System Online",
  },
  {
    title: "Athletic Workout Builder",
    tagline: "Precision Tracking",
    icon: Dumbbell,
    description: "Build beautiful routines from our database of 500+ movements. Track weight, reps, sets, and rest times with precision.",
    bullets: ["Dynamic drop sets and circuits support", "Estimated 1-Rep Max (1RM) tracker", "Audio cues and visual rest indicators"],
    preview: "Leg Day Destroyer Routine Active",
  },
  {
    title: "Macro-Nutrition Vault",
    tagline: "Fuel Your Goals",
    icon: Utensils,
    description: "Log meals in seconds, calculate exact macronutrient ratios, and monitor water intake to maintain ultimate cell hydration.",
    bullets: ["900k+ food items database", "Auto-calculated TDEE & deficits", "One-click calorie & macro logs"],
    preview: "Nutrition Logs Synchronized",
  },
  {
    title: "Visual Transformation Dash",
    tagline: "Analytics That Matter",
    icon: LineChart,
    description: "See your body transform through high-fidelity progression charts, weight trendlines, and body measurement metrics.",
    bullets: ["Relational weight & fat percentage lines", "Streak metrics powered by gamification", "Milestone progress bars & ETA tools"],
    preview: "Progress Metrics Updated Today",
  },
];

const accentMap = [
  { bg: "bg-accent-dim", text: "text-accent", border: "border-accent/30" },
  { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
];

export default function FeaturesPage() {
  const [activePillar, setActivePillar] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-surface-0">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-border">
        <div className="container-wide flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-base font-bold tracking-tight text-text-primary">
              Fit<span className="text-accent">Sync</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm font-medium text-accent">Features</Link>
            <Link href="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
            <div className="flex items-center gap-3 ml-4">
              <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium">Sign In</Link>
              <Link href="/login" className="btn-primary text-sm">Get Started</Link>
            </div>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-text-secondary p-2 -mr-2">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="md:hidden bg-surface-1 border-t border-border px-6 py-6 space-y-4">
            <Link href="/features" className="block text-sm font-medium text-accent" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-sm text-text-secondary" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Link href="/login" className="block w-full py-2.5 text-sm border border-border-hover rounded-lg text-text-secondary text-center font-medium">Sign In</Link>
              <Link href="/login" className="block w-full py-2.5 text-sm bg-accent text-white rounded-lg text-center font-semibold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-16">
        <div className="container-wide py-20 md:py-28 space-y-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-5">
            <span className="caption block">Features</span>
            <h1 className="display-xl">
              An ecosystem of<br /><span className="gradient-text">peak performance</span>
            </h1>
            <p className="body-lg max-w-lg mx-auto">Unify your workouts, nutrition, and AI coach insights in one interface.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-2">
              {pillars.map((p, idx) => {
                const a = accentMap[idx];
                return (
                  <motion.button key={idx}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActivePillar(idx)}
                    className={`w-full text-left px-5 py-4 rounded-lg border transition-all flex items-center gap-4 ${
                      activePillar === idx
                        ? `${a.bg} ${a.border}`
                        : "bg-transparent border-border hover:border-border-hover"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all ${
                      activePillar === idx ? `${a.bg}` : "bg-surface-3"
                    }`}>
                      <p.icon className={`h-5 w-5 ${activePillar === idx ? a.text : "text-text-muted"}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm ${activePillar === idx ? a.text : "text-text-secondary"}`}>
                        {p.title}
                      </h3>
                      <p className="text-[10px] text-text-muted uppercase font-semibold tracking-wider mt-0.5">
                        {p.tagline}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activePillar}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="lg:col-span-8 rounded-xl bg-surface-1 border border-border p-8 md:p-10 min-h-[400px] flex flex-col justify-between relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentMap[activePillar].bg}`} />

                <div className="space-y-5 relative z-10">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${accentMap[activePillar].text}`}>
                      {pillars[activePillar].tagline}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                      {pillars[activePillar].title}
                    </h2>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {pillars[activePillar].description}
                  </p>
                  <div className="space-y-3 pt-2">
                    {pillars[activePillar].bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-3 text-sm text-text-secondary">
                        <div className={`h-5 w-5 rounded-md ${accentMap[activePillar].bg} flex items-center justify-center shrink-0`}>
                          <CheckCircle className={`h-3 w-3 ${accentMap[activePillar].text}`} />
                        </div>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-lg bg-surface-2 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span>{pillars[activePillar].preview}</span>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${accentMap[activePillar].text}`}>
                    v1.0 Ready
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-10">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <span className="text-sm font-bold text-text-primary">
              Fit<span className="text-accent">Sync</span>
            </span>
          </div>
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/features" className="text-sm text-text-muted hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-text-muted hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">Sign In</Link>
            <span className="text-sm text-text-muted/40">&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
