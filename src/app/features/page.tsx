"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Dumbbell, Utensils, LineChart, CheckCircle, Zap, Sparkles, Menu, X
} from "lucide-react";
import LogoMark from "@/components/LogoMark";

const pillars = [
  {
    title: "AI Coaching Matrix",
    tagline: "Intelligent Guidance, Powered by AI",
    icon: Brain,
    description: "No generic templates. Fitsync's AI layers analyze your specific lifts, daily calories, and sleep rhythms to deliver hyper-targeted progressive overloads and recovery protocols.",
    bullets: ["Context-aware form & routine adjustments", "Overtraining checks to prevent injuries", "Custom active recovery protocols"],
    preview: "AI Coaching System Online",
  },
  {
    title: "Athletic Workout Builder",
    tagline: "Track and Optimize with Precision",
    icon: Dumbbell,
    description: "Build beautiful routines from our database of 500+ movements. Track weight, reps, sets, and rest times with precision.",
    bullets: ["Dynamic drop sets and circuits support", "Estimated 1-Rep Max (1RM) tracker", "Audio cues and visual rest indicators"],
    preview: "Leg Day Destroyer Routine Active",
  },
  {
    title: "Macro-Nutrition Vault",
    tagline: "Fuel Your Hypertrophy or Deficit",
    icon: Utensils,
    description: "Log meals in seconds, calculate exact macronutrient ratios, and monitor water intake to maintain ultimate cell hydration.",
    bullets: ["900k+ food items database", "Auto-calculated TDEE & deficits", "One-click calorie & macro logs"],
    preview: "Nutrition Logs Synchronized",
  },
  {
    title: "Visual Transformation Dash",
    tagline: "Analytics That Celebrate Consistency",
    icon: LineChart,
    description: "See your body transform through high-fidelity progression charts, weight trendlines, and body measurement metrics.",
    bullets: ["Relational weight & fat percentage lines", "Streak metrics powered by gamification", "Milestone progress bars & ETA tools"],
    preview: "Progress Metrics Updated Today",
  },
];

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

export default function FeaturesPage() {
  const [activePillar, setActivePillar] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const accentMap = [
    { bg: "bg-accent-coral/10", text: "text-accent-coral", border: "border-accent-coral/30" },
    { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary selection:bg-accent-coral/15">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <div className="container-wide flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={20} />
            <span className="text-base font-semibold tracking-tight text-text-primary">Fitsync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className={`text-sm font-medium transition-colors ${link.href === "/features" ? "text-accent-coral" : "text-text-secondary hover:text-text-primary"}`}>
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 ml-4">
              <Link href="/login"><button className="btn-ghost text-sm">Sign In</button></Link>
              <Link href="/signup"><button className="btn-primary text-sm">Get Started</button></Link>
            </div>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-text-secondary">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-bg-card border-t border-border px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className={`block text-sm font-medium transition-colors ${link.href === "/features" ? "text-accent-coral" : "text-text-secondary hover:text-text-primary"}`}
                onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Link href="/login">
                <button className="w-full py-2.5 text-sm border border-border rounded-full text-text-secondary">Sign In</button>
              </Link>
              <Link href="/signup">
                <button className="w-full py-2.5 text-sm bg-accent-coral text-white rounded-full">Get Started</button>
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-14">
        <div className="container-wide py-20 md:py-28 space-y-20">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-6">
            <div className="caption inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-coral/5 border border-accent-coral/15">
              <Zap className="h-3 w-3 text-accent-coral" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-accent-coral">Engineered For Results</span>
            </div>
            <h1 className="display-xl">
              An Ecosystem of <span className="text-accent-coral">Peak Performance</span>
            </h1>
            <p className="body-lg text-text-secondary">Unify your workouts, nutrition, and AI coach insights in one interface.</p>
          </motion.div>

          {/* Feature navigation + detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar nav */}
            <div className="lg:col-span-4 space-y-2">
              {pillars.map((p, idx) => {
                const a = accentMap[idx];
                return (
                  <motion.button key={idx}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActivePillar(idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${
                      activePillar === idx
                        ? `${a.bg} ${a.border}`
                        : "bg-transparent border-border hover:border-border-hover"
                    }`}
                  >
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-all ${
                      activePillar === idx
                        ? `${a.bg} ${a.border}`
                        : "bg-bg-secondary border-border"
                    }`}>
                      <p.icon className={`h-5 w-5 ${activePillar === idx ? a.text : "text-text-muted"}`} />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-semibold text-sm ${activePillar === idx ? a.text : "text-text-secondary"}`}>
                        {p.title}
                      </h3>
                      <p className="text-[9px] text-text-muted uppercase font-semibold tracking-wider mt-0.5">
                        Pillar 0{idx + 1}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              <motion.div key={activePillar}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="lg:col-span-8 rounded-2xl bg-bg-card border border-border p-8 md:p-10 min-h-[420px] flex flex-col justify-between relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${accentMap[activePillar].bg}`} />

                <div className="space-y-6 relative z-10">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${accentMap[activePillar].text}`}>
                      {pillars[activePillar].tagline}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
                      {pillars[activePillar].title}
                    </h2>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {pillars[activePillar].description}
                  </p>
                  <div className="space-y-3 pt-2">
                    {pillars[activePillar].bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-3 text-sm text-text-secondary">
                        <div className={`h-5 w-5 rounded-full ${accentMap[activePillar].bg} flex items-center justify-center shrink-0`}>
                          <CheckCircle className={`h-3 w-3 ${accentMap[activePillar].text}`} />
                        </div>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-bg-secondary border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{pillars[activePillar].preview}</span>
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider ${accentMap[activePillar].text}`}>
                    v1.0 Ready
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoMark size={16} />
            <span className="text-sm font-semibold text-text-primary">Fitsync</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/features" className="caption hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="caption hover:text-text-primary transition-colors">Pricing</Link>
            <span className="caption text-text-muted/50">© 2026 Fitsync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
