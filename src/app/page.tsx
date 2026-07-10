"use client";

import Link from "next/link";
import { ArrowRight, Brain, BarChart3, Smartphone, Trophy, Zap, Sparkles, Check, Star, Activity } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import LogoMark from "@/components/LogoMark";

const features = [
  { icon: Brain, title: "AI Coaching", desc: "Context-aware guidance that adapts to your recovery, sleep, and progress in real time." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Rich charts, predictive metrics, and trendlines that reveal patterns you'd miss." },
  { icon: Smartphone, title: "Unified Sync", desc: "Connect Apple Health, Fitbit, Strava, and Whoop + nutrition and training." },
  { icon: Trophy, title: "Achievements", desc: "Gamification, challenges, and leaderboards that keep you coming back." },
];

const steps = [
  { number: "01", title: "Connect Your Data", desc: "Sync your wearables, log your meals, and track your workouts in one place." },
  { number: "02", title: "AI Analyzes Patterns", desc: "Our engine correlates your sleep, recovery, nutrition, and training intensity." },
  { number: "03", title: "Get Personalized Plans", desc: "Receive optimized workout splits, meal targets, and recovery protocols." },
];

const integrations = ["Apple Health", "Fitbit", "Strava", "Garmin", "Whoop", "Google Fit"];

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

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary selection:bg-accent-coral/15">
      {/* ═══ Navigation ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
        <div className="container-wide flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={20} />
            <span className="text-base font-semibold tracking-tight text-text-primary">Fitsync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</Link>
            <div className="flex items-center gap-3 ml-4">
              <Link href="/login" className="btn-ghost text-sm inline-flex items-center justify-center px-4 py-2 rounded-full font-semibold">Sign In</Link>
              <Link href="/signup" className="btn-primary text-sm inline-flex items-center justify-center px-4 py-2 rounded-full font-semibold gap-1.5">Get Started <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-text-secondary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 5h15M2.5 10h15M2.5 15h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-bg-card border-t border-border px-6 py-6 space-y-4">
            <Link href="/features" className="block text-sm text-text-secondary" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-sm text-text-secondary" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Link href="/login" className="block w-full py-2.5 text-sm border border-border rounded-full text-text-secondary text-center">Sign In</Link>
              <Link href="/signup" className="block w-full py-2.5 text-sm bg-accent-coral text-white rounded-full text-center">Get Started</Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* ═══ Hero ═══ */}
        <section ref={heroRef} className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-[-20vh] right-[-10vw] w-[50vw] h-[50vw] rounded-full bg-accent-coral/[0.02] blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10vh] left-[-5vw] w-[30vw] h-[30vw] rounded-full bg-accent-coral/[0.015] blur-[100px] pointer-events-none" />

          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container-wide relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Text */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-coral/5 border border-accent-coral/15 mb-6">
                  <Sparkles className="h-3 w-3 text-accent-coral" />
                  <span className="caption text-accent-coral" style={{ fontSize: "0.6875rem" }}>AI-Powered Fitness Platform</span>
                </div>
                <h1 className="display-xl mb-5 leading-[1.04]">
                  Sync Your Body.<br />
                  <span className="text-accent-coral">Sync Your Life.</span>
                </h1>
                <p className="body-lg text-text-secondary max-w-md mb-10">
                  The intelligent platform that unifies your training, nutrition, recovery, and community into one seamless experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/signup" className="btn-primary text-base px-8 py-3.5 group shadow-lg shadow-accent-coral/15 hover:shadow-xl hover:shadow-accent-coral/25 transition-shadow inline-flex items-center justify-center gap-2 font-semibold rounded-full">
                    Start Your Journey
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/features" className="btn-secondary text-base px-8 py-3.5 inline-flex items-center justify-center gap-2 font-semibold rounded-full">Learn More</Link>
                </div>

                {/* Animated Stats */}
                <div className="flex items-center gap-10 md:gap-14 mt-16 pt-10 border-t border-border">
                  {[
                    { end: 500, suffix: "K+", label: "Active Athletes" },
                    { end: 12, suffix: "M+", label: "Workouts Logged" },
                    { end: 98, suffix: "%", label: "Goal Success" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="stat-value text-accent-coral">
                        <Counter end={s.end} suffix={s.suffix} />
                      </p>
                      <p className="stat-label mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Product Mockup - AI Chat Dashboard */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
                className="relative">
                {/* Glow behind mockup */}
                <div className="absolute -inset-8 bg-accent-coral/[0.03] rounded-[2rem] blur-[60px]" />
                <div className="relative rounded-2xl border border-border overflow-hidden shadow-2xl shadow-black/[0.04] bg-white">
                  {/* Mac-style traffic lights */}
                  <div className="flex items-center gap-1.5 px-4 h-9 bg-bg-secondary border-b border-border">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#DD4444]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E6A23C]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C840]" />
                    <span className="ml-3 text-[11px] text-text-muted font-medium">AI Coach · Pro Plan</span>
                  </div>
                  {/* Chat content */}
                  <div className="p-5 space-y-4">
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                      className="flex gap-3 max-w-[85%]">
                      <div className="h-7 w-7 rounded-lg bg-accent-coral/10 flex items-center justify-center text-[10px] font-semibold text-accent-coral shrink-0">AI</div>
                      <div className="bg-bg-secondary rounded-xl rounded-tl-sm p-3.5 text-sm leading-relaxed text-text-secondary">
                        I've analyzed your last 7 days. Recovery is trending up, but sleep consistency dropped Tuesday. Want me to adjust this week's plan?
                      </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                      className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                      <div className="h-7 w-7 rounded-lg bg-text-primary/5 flex items-center justify-center text-[10px] font-semibold text-text-primary shrink-0">U</div>
                      <div className="bg-accent-coral/10 rounded-xl rounded-tr-sm p-3.5 text-sm leading-relaxed text-text-primary">
                        Yes, optimize my week.
                      </div>
                    </motion.div>
                    {/* Typing indicator */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                      className="flex gap-3 max-w-[85%]">
                      <div className="h-7 w-7 rounded-lg bg-accent-coral/10 flex items-center justify-center text-[10px] font-semibold text-accent-coral shrink-0">AI</div>
                      <div className="bg-bg-secondary rounded-xl rounded-tl-sm p-3.5 flex items-center gap-2">
                        <span className="text-sm text-accent-coral">Adjusting your plan</span>
                        <span className="flex gap-0.5">
                          <motion.span className="w-1 h-1 bg-accent-coral rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                          <motion.span className="w-1 h-1 bg-accent-coral rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
                          <motion.span className="w-1 h-1 bg-accent-coral rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
                        </span>
                      </div>
                    </motion.div>
                  </div>
                  {/* Input bar */}
                  <div className="px-5 py-3.5 border-t border-border">
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 rounded-lg border border-border px-4 flex items-center">
                        <span className="text-sm text-text-muted">Ask your AI coach...</span>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-accent-coral flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ═══ How It Works ═══ */}
        <section className="section bg-bg-secondary">
          <div className="container-wide">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center max-w-xl mx-auto mb-16">
              <div className="caption mb-4">Simple Setup</div>
              <h2 className="display-lg mb-4">Three steps to peak sync.</h2>
              <p className="body-lg text-text-secondary">Get started in minutes, see results in days.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {steps.map((step, idx) => (
                <motion.div key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 }}
                  className="relative text-center md:text-left"
                >
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-[2.5rem] font-bold tracking-tight text-accent-coral/20 leading-none mb-4">{step.number}</span>
                    <h3 className="heading-md mb-2">{step.title}</h3>
                    <p className="body-sm text-text-secondary">{step.desc}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[calc(100%+0.5rem)] w-[calc(100%-2rem)] h-px bg-border" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Features ═══ */}
        <section className="section">
          <div className="container-wide">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="max-w-xl mb-16">
              <div className="caption mb-4">Everything You Need</div>
              <h2 className="display-lg mb-4">Engineered for peak performance.</h2>
              <p className="body-lg text-text-secondary">Fitsync combines elite data tracking with human-centric design.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
              {features.map((f, idx) => (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-bg-card p-8 md:p-10 group hover:bg-bg-secondary/50 transition-colors duration-300"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent-coral/5 flex items-center justify-center mb-5 group-hover:bg-accent-coral/10 transition-colors">
                    <f.icon className="h-5 w-5 text-accent-coral" />
                  </div>
                  <h3 className="heading-md mb-2">{f.title}</h3>
                  <p className="body-sm text-text-secondary">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="mt-10 text-center">              <Link href="/features" className="btn-secondary text-sm group inline-flex items-center justify-center gap-2 font-semibold rounded-full px-5 py-2.5">
                Explore all features
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══ Integrations Marquee ═══ */}
        <section className="py-12 md:py-16 bg-bg-secondary overflow-hidden">
          <div className="text-center mb-10">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="caption mb-2">Compatible With</div>
              <p className="body-md text-text-secondary">Syncs with the platforms you already use.</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex overflow-hidden"
          >
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="flex shrink-0 gap-16 md:gap-20 px-8"
            >
              {[...integrations, ...integrations].map((name, i) => (
                <div key={i} className="flex items-center gap-3 text-text-muted/50">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-semibold tracking-wider whitespace-nowrap">{name}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═══ Social Proof / Testimonial ═══ */}
        <section className="section">
          <div className="container-wide">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              {/* Rating */}
              <div className="flex items-center justify-center gap-0.5 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-sm text-text-muted font-medium">4.9 avg rating</span>
              </div>
              <p className="display-lg mb-8 leading-snug text-text-primary">
                &ldquo;Fitsync completely changed how I train. The AI caught patterns I never noticed in my sleep and recovery data.&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent-coral/10 flex items-center justify-center text-sm font-semibold text-accent-coral">JR</div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-primary">Jamie Rivers</p>
                  <div className="flex items-center gap-2">
                    <span className="caption mt-0.5">2-year member</span>
                    <span className="text-text-muted/30">·</span>
                    <span className="caption mt-0.5 text-accent-coral">12M+ XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="section bg-bg-secondary">
          <div className="container-wide">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center max-w-xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-coral/5 border border-accent-coral/15 mb-6">
                <Sparkles className="h-3 w-3 text-accent-coral" />
                <span className="caption text-accent-coral" style={{ fontSize: "0.6875rem" }}>14-Day Free Trial</span>
              </div>
              <h2 className="display-lg mb-4">Ready to level up?</h2>
              <p className="body-lg text-text-secondary mb-10">Join 500K+ athletes who have found their perfect sync. No credit card required.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/signup" className="btn-primary text-base px-10 py-3.5 group shadow-lg shadow-accent-coral/15 inline-flex items-center justify-center gap-2 font-semibold rounded-full">
                  Create Your Free Account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/pricing" className="btn-secondary text-base px-8 py-3.5 inline-flex items-center justify-center gap-2 font-semibold rounded-full">View Plans</Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-text-muted">
                <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-accent-coral" /> No credit card</span>
                <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-accent-coral" /> Cancel anytime</span>
                <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-accent-coral" /> Full access</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ═══ Footer ═══ */}
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
