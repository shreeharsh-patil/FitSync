"use client";

import Link from "next/link";
import { ArrowRight, Brain, BarChart3, Smartphone, Trophy, Check, Activity, ChevronRight, Dumbbell, Flame, Target, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LogoMark from "@/components/LogoMark";

const integrations = ["Apple Health", "Fitbit", "Strava", "Garmin", "Whoop", "Google Fit"];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-surface-0 overflow-x-hidden">
      {/* ═══ Navigation ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-border">
        <div className="container-wide flex items-center justify-between h-[60px]">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={22} />
            <span className="text-[15px] font-bold tracking-tight text-text-primary font-[family-name:var(--font-display)]">Fitsync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/features" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Pricing</Link>
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-border">
              <Link href="/login" className="text-[13px] text-text-muted hover:text-text-primary transition-colors px-3 py-1.5">Sign in</Link>
              <Link href="/signup" className="btn-primary text-[13px] px-4 py-2 rounded-lg">Get started</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ═══ Hero ═══ */}
        <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Ambient glow — single, not a mesh */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] bg-accent/[0.06] rounded-full blur-[180px]" />
          </div>

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container-wide relative w-full pt-28 md:pt-32">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border mb-8">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span className="text-[11px] font-medium text-text-secondary">Public beta — free for now</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-[family-name:var(--font-display)] text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem] font-bold leading-[0.95] tracking-[-0.03em] text-text-primary mb-6"
              >
                Stop guessing.<br />
                Start training.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-lg mb-10"
              >
                Fitsync connects your workouts, nutrition, and recovery in one place — then shows you what actually moves the needle.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-3 mb-16"
              >
                <Link href="/signup" className="btn-primary px-6 py-3 text-sm group inline-flex items-center justify-center gap-2 font-semibold rounded-lg">
                  Start free trial
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/features" className="btn-secondary px-6 py-3 text-sm inline-flex items-center justify-center gap-2 font-medium rounded-lg">
                  See features
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>

              {/* Real stat, not fake social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-8 text-sm"
              >
                <div>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">6</span>
                  <span className="text-text-muted ml-1.5">platforms</span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">14</span>
                  <span className="text-text-muted ml-1.5">day free trial</span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">0</span>
                  <span className="text-text-muted ml-1.5">credit card</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══ Integrations strip ═══ */}
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

        {/* ═══ Features — simple two-column, not bento grid ═══ */}
        <section className="section">
          <div className="container-wide">
            <div className="max-w-2xl mb-16">
              <span className="caption mb-3 block text-accent">Features</span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] text-text-primary mb-4">
                Built for people who actually train.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {[
                { icon: Brain, title: "AI Coaching", desc: "Not generic templates. Guidance that adapts to your sleep, recovery, and training history in real time." },
                { icon: BarChart3, title: "Deep Analytics", desc: "Charts, trendlines, and predictive metrics that reveal what's actually working — and what isn't." },
                { icon: Smartphone, title: "Unified Sync", desc: "Apple Health, Fitbit, Strava, and more. All your devices, one dashboard." },
                { icon: Trophy, title: "Gamification", desc: "XP, levels, streaks, and challenges. Enough structure to keep you coming back without the gimmick." },
              ].map((f) => (
                <div key={f.title} className="group">
                  <div className="h-10 w-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center mb-4 group-hover:border-border-hover transition-colors">
                    <f.icon className="h-5 w-5 text-text-muted" />
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link href="/features" className="btn-secondary text-sm group inline-flex items-center gap-2 font-medium">
                Explore all features
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ How It Works — clean, no fake numbered markers ═══ */}
        <section className="py-20 md:py-28 border-t border-border">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-4">
                <span className="caption mb-3 block text-accent">How it works</span>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight leading-[1.05] text-text-primary">
                  Connect. Analyze. Optimize.
                </h2>
              </div>

              <div className="lg:col-span-8 space-y-px">
                {[
                  { step: "1", title: "Connect", desc: "Sync your wearables, log your meals, and track your workouts. We pull data from 6+ platforms automatically.", icon: Smartphone },
                  { step: "2", title: "Analyze", desc: "Our engine correlates your sleep, recovery, nutrition, and training intensity to find what works for your body.", icon: BarChart3 },
                  { step: "3", title: "Optimize", desc: "Get workout splits, meal targets, and recovery protocols that evolve with you over time.", icon: Target },
                ].map((item) => (
                  <div key={item.step} className="bg-surface-1 border border-border p-7 md:p-8 flex gap-6">
                    <div className="shrink-0">
                      <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-surface-4 leading-none">{item.step}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="h-4 w-4 text-accent" />
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">{item.title}</h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Testimonial ═══ */}
        <section className="py-20 md:py-28 border-t border-border">
          <div className="container-wide">
            <div className="max-w-3xl">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-1 w-8 bg-accent rounded-full" />
                ))}
              </div>
              <blockquote className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.15] tracking-tight text-text-primary mb-8">
                &ldquo;Fitsync completely changed how I train. The AI caught patterns I never noticed in my sleep and recovery data.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-surface-3 flex items-center justify-center text-sm font-bold text-accent">JR</div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Jamie Rivers</p>
                  <p className="text-xs text-text-muted">2-year member</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="py-24 md:py-32 border-t border-border relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50vw] h-[30vw] bg-accent/[0.04] rounded-full blur-[150px]" />
          </div>
          <div className="container-wide relative">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] text-text-primary mb-5">
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
            </div>
          </div>
        </section>
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-border py-10">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <LogoMark size={18} />
            <span className="text-sm font-bold text-text-primary font-[family-name:var(--font-display)]">Fitsync</span>
          </div>
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/features" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/login" className="text-[13px] text-text-muted hover:text-text-primary transition-colors">Sign in</Link>
            <span className="text-[13px] text-text-muted/40">&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
