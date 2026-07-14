"use client";

import Link from "next/link";
import { ArrowRight, Brain, BarChart3, Smartphone, Trophy, Check, Activity, ChevronRight, Dumbbell, Flame, Target, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import LogoMark from "@/components/LogoMark";

function Counter({ end, suffix = "", duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const integrations = ["Apple Health", "Fitbit", "Strava", "Garmin", "Whoop", "Google Fit"];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-surface-0 overflow-x-hidden">
      {/* ═══ Navigation ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-0/60 backdrop-blur-xl border-b border-border">
        <div className="container-wide flex items-center justify-between h-[60px]">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={22} />
            <span className="text-[15px] font-bold tracking-tight text-text-primary">Fitsync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/features" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Pricing</Link>
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-border">
              <Link href="/login" className="text-[13px] text-text-muted hover:text-text-primary transition-colors px-3 py-1.5">Sign In</Link>
              <Link href="/signup" className="btn-primary text-[13px] px-4 py-2 rounded-lg">Get Started</Link>
            </div>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-text-muted p-2 -mr-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {mobileMenuOpen ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="md:hidden bg-surface-1 border-t border-border px-6 py-6 space-y-4">
            <Link href="/features" className="block text-sm text-text-secondary" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-sm text-text-secondary" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Link href="/login" className="block w-full py-2.5 text-sm border border-border-hover rounded-lg text-text-secondary text-center font-medium">Sign In</Link>
              <Link href="/signup" className="block w-full py-2.5 text-sm bg-accent text-white rounded-lg text-center font-semibold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* ═══ Hero — Full-viewport, massive type ═══ */}
        <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Ambient gradient mesh */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-accent/[0.04] rounded-full blur-[200px] translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-500/[0.02] rounded-full blur-[180px] -translate-x-1/4 translate-y-1/4" />
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }} />
          </div>

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container-wide relative w-full pt-28 md:pt-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left — Copy */}
              <div className="lg:col-span-6 xl:col-span-5">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border mb-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[11px] font-semibold text-text-secondary tracking-wide">Now in public beta</span>
                  </div>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-text-primary mb-6">
                  Train with<br />
                  <span className="text-accent">intelligence.</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                  className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-md mb-10">
                  The platform that turns your training, nutrition, and recovery data into a personalized performance engine.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                  className="flex flex-col sm:flex-row gap-3 mb-14">
                  <Link href="/signup" className="btn-primary px-6 py-3 text-sm group inline-flex items-center justify-center gap-2 font-semibold rounded-lg">
                    Start free trial
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link href="/features" className="btn-secondary px-6 py-3 text-sm inline-flex items-center justify-center gap-2 font-medium rounded-lg">
                    See features
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>

                {/* Social proof strip */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {["AT", "MK", "JR", "LS", "DP"].map((initials, i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-surface-3 border-2 border-surface-0 flex items-center justify-center text-[9px] font-bold text-text-muted">
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-sm font-bold text-text-primary">500K+ athletes</p>
                    <p className="text-[11px] text-text-muted">already training smarter</p>
                  </div>
                </motion.div>
              </div>

              {/* Right — Floating dashboard mockup */}
              <motion.div initial={{ opacity: 0, x: 30, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                className="lg:col-span-6 xl:col-span-7 relative hidden lg:block">
                {/* Floating accent bar */}
                <div className="absolute -top-4 -right-4 w-32 h-1 bg-gradient-to-r from-accent to-transparent rounded-full" />

                <div className="relative rounded-xl border border-border overflow-hidden bg-surface-1" style={{ transform: "perspective(1200px) rotateY(-4deg) rotateX(2deg)" }}>
                  {/* Title bar */}
                  <div className="flex items-center gap-2 px-4 h-9 bg-surface-2 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#3B3B3B]" />
                      <div className="w-2 h-2 rounded-full bg-[#3B3B3B]" />
                      <div className="w-2 h-2 rounded-full bg-[#3B3B3B]" />
                    </div>
                    <span className="ml-2 text-[10px] text-text-muted font-mono">fitsync.app/dashboard</span>
                  </div>

                  {/* Dashboard header */}
                  <div className="px-6 py-5 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-accent font-semibold mb-0.5">Welcome back, Alex</p>
                        <p className="text-lg font-extrabold text-text-primary tracking-tight">Your Dashboard</p>
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-dim border border-accent/20">
                        <Sparkles className="h-3 w-3 text-accent" />
                        <span className="text-[11px] font-bold text-accent">Lv.12</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="px-6 py-4 grid grid-cols-4 gap-3">
                    {[
                      { label: "Workouts", value: "847", icon: Dumbbell, accent: true },
                      { label: "Calories", value: "2.1K", icon: Flame, accent: false },
                      { label: "Streak", value: "14d", icon: Target, accent: false },
                      { label: "Recovery", value: "82%", icon: Activity, accent: false },
                    ].map((stat) => (
                      <div key={stat.label} className="p-3 rounded-lg bg-surface-2 border border-border">
                        <stat.icon className={`h-3.5 w-3.5 mb-2 ${stat.accent ? "text-accent" : "text-text-muted"}`} />
                        <p className="text-lg font-extrabold text-text-primary leading-none">{stat.value}</p>
                        <p className="text-[9px] text-text-muted mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="px-6 pb-5">
                    <div className="p-4 rounded-lg bg-surface-2 border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold text-text-secondary">Weekly Volume</span>
                        <span className="text-[9px] text-text-muted font-mono">+12% vs last week</span>
                      </div>
                      <div className="flex items-end gap-1 h-20">
                        {[35, 55, 45, 70, 60, 85, 65].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div className={`w-full rounded-sm ${i === 5 ? "bg-accent" : "bg-surface-4"}`} style={{ height: `${h}%` }} />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1.5">
                        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                          <span key={i} className="text-[8px] text-text-muted font-medium flex-1 text-center">{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating mini-card — AI insight */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-6 -left-8 p-3.5 rounded-lg bg-surface-2 border border-border shadow-2xl shadow-black/30">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-md bg-accent-dim flex items-center justify-center">
                      <Brain className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted font-semibold">AI Insight</p>
                      <p className="text-[11px] text-text-primary font-medium">Recovery +8% this week</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══ Logos / Integrations strip ═══ */}
        <section className="py-10 border-y border-border">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-widest shrink-0">Syncs with</p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {integrations.map((name) => (
                  <div key={name} className="flex items-center gap-2 text-text-muted/60 hover:text-text-muted transition-colors">
                    <Activity className="h-3 w-3" />
                    <span className="text-[13px] font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Features — Bento grid ═══ */}
        <section className="section">
          <div className="container-wide">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="max-w-2xl mb-14">
              <span className="caption mb-3 block text-accent">Features</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-text-primary mb-4">
                Everything you need.<br />Nothing you don't.
              </h2>
              <p className="text-base text-text-secondary">Built for athletes who care about the details.</p>
            </motion.div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* AI Coaching — hero card */}
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="md:col-span-7 bg-surface-1 border border-border rounded-xl p-7 md:p-8 group hover:border-border-hover transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.04] rounded-full blur-[60px]" />
                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-accent-dim flex items-center justify-center mb-5">
                    <Brain className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">AI Coaching</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-sm mb-6">
                    Context-aware guidance that adapts to your recovery, sleep, and progress in real time. Not generic templates — real intelligence.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Overtraining checks", "Recovery protocols", "Form adjustments"].map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold text-text-muted bg-surface-2 border border-border px-2.5 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Achievements — compact card */}
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.06 }}
                className="md:col-span-5 bg-surface-1 border border-border rounded-xl p-7 group hover:border-border-hover transition-colors">
                <div className="h-10 w-10 rounded-lg bg-accent-dim flex items-center justify-center mb-5">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Achievements</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Gamification, challenges, and leaderboards that keep you accountable and coming back.
                </p>
              </motion.div>

              {/* Sync — compact card */}
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.12 }}
                className="md:col-span-5 bg-surface-1 border border-border rounded-xl p-7 group hover:border-border-hover transition-colors">
                <div className="h-10 w-10 rounded-lg bg-accent-dim flex items-center justify-center mb-5">
                  <Smartphone className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Unified Sync</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  All your devices, one dashboard. Apple Health, Fitbit, Strava, and more.
                </p>
              </motion.div>

              {/* Analytics — wide card */}
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.18 }}
                className="md:col-span-7 bg-surface-1 border border-border rounded-xl p-7 md:p-8 group hover:border-border-hover transition-colors relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/[0.03] rounded-full blur-[80px]" />
                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-accent-dim flex items-center justify-center mb-5">
                    <BarChart3 className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Deep Analytics</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-sm mb-6">
                    Rich charts, predictive metrics, and trendlines that reveal patterns you'd miss on your own.
                  </p>
                  {/* Mini chart preview */}
                  <div className="flex items-end gap-1 h-12">
                    {[20, 35, 28, 50, 42, 65, 55, 70, 60, 80].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-surface-3" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="mt-10 text-center">
              <Link href="/features" className="btn-secondary text-sm group inline-flex items-center gap-2 font-medium">
                Explore all features
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══ How It Works — Full-width, editorial ═══ */}
        <section className="py-20 md:py-28 border-t border-border relative">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left — sticky heading */}
              <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <span className="caption mb-3 block text-accent">How it works</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.05] text-text-primary">
                    Three steps to<br />peak sync.
                  </h2>
                </motion.div>
              </div>

              {/* Right — steps */}
              <div className="lg:col-span-8 space-y-px">
                {[
                  { step: "01", title: "Connect", desc: "Sync your wearables, log your meals, and track your workouts in one place. We pull data from 6+ platforms automatically.", icon: Smartphone },
                  { step: "02", title: "Analyze", desc: "Our engine correlates your sleep, recovery, nutrition, and training intensity to find what actually works for your body.", icon: BarChart3 },
                  { step: "03", title: "Optimize", desc: "Receive optimized workout splits, meal targets, and recovery protocols that evolve with you over time.", icon: Target },
                ].map((item, idx) => (
                  <motion.div key={item.step}
                    initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-surface-1 border border-border p-7 md:p-8 group hover:bg-surface-2 transition-colors flex gap-6"
                  >
                    <div className="shrink-0">
                      <span className="text-4xl font-extrabold text-surface-4 group-hover:text-accent/20 transition-colors leading-none">{item.step}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="h-4 w-4 text-accent" />
                        <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Testimonial — Full-width, editorial ═══ */}
        <section className="py-20 md:py-28 border-t border-border">
          <div className="container-wide">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1 w-8 bg-accent rounded-full" />
                  ))}
                </div>
                <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.15] tracking-tight text-text-primary mb-8">
                  &ldquo;Fitsync completely changed how I train. The AI caught patterns I never noticed in my sleep and recovery data.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-surface-3 flex items-center justify-center text-sm font-bold text-accent">JR</div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Jamie Rivers</p>
                    <p className="text-xs text-text-muted">2-year member &middot; 12M+ XP</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ CTA — Clean, confident ═══ */}
        <section className="py-24 md:py-32 border-t border-border relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50vw] h-[30vw] bg-accent/[0.04] rounded-full blur-[150px]" />
          </div>
          <div className="container-wide relative">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-text-primary mb-5">
                Start training smarter.<br />Today.
              </h2>
              <p className="text-base sm:text-lg text-text-secondary mb-10 max-w-md mx-auto">
                14-day free trial. No credit card required. Cancel anytime.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/signup" className="btn-primary px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2 rounded-lg">
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="btn-secondary px-8 py-3.5 text-sm font-medium rounded-lg">View plans</Link>
              </div>
              <div className="flex items-center justify-center gap-5 mt-8 text-xs text-text-muted">
                <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-accent" /> No credit card</span>
                <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-accent" /> Cancel anytime</span>
                <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-accent" /> Full access</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-border py-10">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <LogoMark size={18} />
            <span className="text-sm font-bold text-text-primary">Fitsync</span>
          </div>
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/features" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/login" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Sign In</Link>
            <span className="text-[13px] text-text-muted/40">&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
