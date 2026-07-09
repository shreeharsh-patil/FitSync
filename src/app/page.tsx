"use client";

import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Zap,
  Brain,
  Trophy,
  Smartphone,
  ChevronRight,
  Sparkles,
  Dumbbell,
  Utensils,
  LineChart,
  Shield,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Active recovery initialized. Your morning run logged. Let me compile your nutrition targets for today." },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const demoQuestions = [
    { q: "Optimize my leg day", r: "Based on your last 3 sessions, your quad development is plateauing. Try front squats (3x8) + Bulgarian split squats (3x10) + leg extensions (3x12). Increase volume by 10% this week." },
    { q: "Meal plan for cutting", r: "Target: 1800 kcal. Protein: 180g (40%), Carbs: 135g (30%), Fat: 60g (30%). Sample: Breakfast — 3 eggs + oats; Lunch — Chicken breast + quinoa + broccoli; Dinner — Salmon + sweet potato + asparagus." },
    { q: "Suggest recovery protocol", r: "Your HRV is down 12% from baseline. Prioritize: 1) 8+ hours sleep tonight, 2) 30min zone 2 cardio, 3) 10min mobility flow, 4) Increase water to 3L. Delay heavy lifts by 24h." },
  ];

  const handleSimulateQuestion = (index: number) => {
    if (isTyping) return;
    const q = demoQuestions[index].q;
    const r = demoQuestions[index].r;
    setChatMessages((prev) => [...prev, { role: "user", content: q }]);
    setIsTyping(true);
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "assistant", content: r }]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-background overflow-hidden selection:bg-secondary/30 selection:text-white relative">
      {/* Navigation */}
      <header className="w-full border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5, type: "spring" }} className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,201,167,0.1)]">
              <Activity className="h-6 w-6" />
            </motion.div>
            <span className="text-2xl font-bold font-heading tracking-tighter text-white">FitSync</span>
          </Link>
          <nav className="ml-auto hidden md:flex gap-8">
            <Link className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-secondary transition-colors" href="/features">Features</Link>
            <Link className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-secondary transition-colors" href="/pricing">Pricing</Link>
          </nav>
          <div className="ml-auto md:ml-8 flex gap-4">
            <Link href="/login"><button className="px-5 py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Login</button></Link>
            <Link href="/signup"><button className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-primary text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-secondary/20">Join Free</button></Link>
          </div>
        </div>
      </header>

      {/* Background Effects */}
      <div className="fixed inset-0 kinetic-grid opacity-20 pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-mesh opacity-30 pointer-events-none -z-10" />

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="w-full min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
          <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] glow-sphere opacity-20" />
          <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)" }} />

          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-12 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 max-w-5xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-bold uppercase tracking-[0.3em] backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 fill-secondary animate-pulse" />
                The Future of Fitness is Synchronized
              </div>
              <h1 className="text-6xl font-bold tracking-tight sm:text-8xl lg:text-[10rem] font-heading leading-[0.85] text-white">
                Sync Your Body. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary bg-[length:200%_auto] animate-gradient">Sync Your Life.</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl lg:text-2xl font-medium leading-relaxed mt-8">
                The AI-powered fitness ecosystem designed to unify your tracking, nutrition, and community in one premium platform.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-6">
              <Link href="/signup">
                <button className="bg-accent hover:bg-accent/90 text-white px-12 h-16 text-xl font-bold rounded-2xl shadow-2xl shadow-accent/40 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2">Start Your Journey <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" /></span>
                </button>
              </Link>
              <Link href="/features">
                <button className="border border-white/10 hover:bg-white/5 h-16 px-12 text-xl font-bold rounded-2xl transition-all backdrop-blur-md group">
                  Explore Ecosystem <ChevronRight className="ml-1 h-5 w-5 opacity-50 group-hover:translate-x-1 transition-transform inline" />
                </button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="w-full max-w-5xl mt-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-20 blur-[80px] rounded-[3rem] group-hover:opacity-30 transition-opacity" />
              <div className="relative glass rounded-[2.5rem] p-2 overflow-hidden shadow-3xl border-white/10 border">
                <div className="w-full h-auto aspect-video rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center border border-white/5 relative overflow-hidden">
                  {/* Animated Stats Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-6 md:gap-12 px-8">
                      {[
                        { value: "500K+", label: "Athletes" },
                        { value: "12M+", label: "Workouts" },
                        { value: "98%", label: "Goal Rate" },
                      ].map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.2 }} className="text-center">
                          <p className="text-2xl md:text-4xl font-bold font-heading text-white">{stat.value}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {/* Subtle data decoration */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                    {["Workout", "Nutrition", "Sleep", "HRV"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="pt-16 flex flex-col items-center gap-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                <span className="h-px w-8 bg-white/10" />Trusted by 500,000+ athletes<span className="h-px w-8 bg-white/10" />
              </p>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 w-14 rounded-full border-4 border-background bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center shadow-xl" />
                ))}
                <div className="h-14 w-14 rounded-full border-4 border-background bg-secondary flex items-center justify-center font-bold text-primary text-xs shadow-xl">+2k</div>
              </div>
            </motion.div>
          </div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <span className="text-[9px] font-bold uppercase tracking-widest">Scroll</span>
            <div className="h-10 w-px bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full py-32 md:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/10 -skew-y-3 origin-right scale-110 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-24">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="h-16 w-16 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 border border-secondary/20 shadow-inner">
                <Sparkles className="h-8 w-8" />
              </motion.div>
              <h2 className="text-5xl font-bold tracking-tight sm:text-7xl font-heading text-white">
                Engineered for <span className="text-secondary relative">Peak Performance<div className="absolute bottom-2 left-0 w-full h-3 bg-secondary/10 -rotate-1 -z-10" /></span>
              </h2>
              <p className="max-w-[800px] text-muted-foreground text-xl md:text-2xl mt-4">FitSync combines elite-level data tracking with human-centric design.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard index={0} icon={<Brain className="h-10 w-10 text-secondary" />} title="AI Coaching" description="Context-aware guidance that adapts to your recovery and progress in real-time." />
              <FeatureCard index={1} icon={<LineChart className="h-10 w-10 text-accent" />} title="Deep Analytics" description="Visualise your progress with rich charts and predictive performance metrics." />
              <FeatureCard index={2} icon={<Smartphone className="h-10 w-10 text-blue-400" />} title="Unified Sync" description="Connect your wearables and nutrition in one seamless digital environment." />
              <FeatureCard index={3} icon={<Trophy className="h-10 w-10 text-yellow-400" />} title="Achievements" description="Stay motivated with an advanced gamification system and community challenges." />
            </div>
          </div>
        </section>

        {/* Interactive AI Chat Simulator */}
        <section className="w-full py-32 md:py-48 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
                  <Brain className="h-3.5 w-3.5" /> Cognitive AI Layer
                </div>
                <h3 className="text-4xl sm:text-6xl font-bold font-heading text-white leading-tight">
                  Interact with the <br /><span className="text-secondary">Fitness Matrix</span>
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                  Try it live. Select a command blueprint below to simulate AI calculations in real-time.
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  {demoQuestions.map((item, idx) => (
                    <motion.button key={idx} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={() => handleSimulateQuestion(idx)} disabled={isTyping}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/20 hover:bg-secondary/[0.02] text-left text-sm font-bold text-white transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-secondary shrink-0" />{item.q}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative group">
                <div className="absolute inset-0 bg-secondary/20 blur-[60px] rounded-[3rem] opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
                <div className="relative glass border-white/5 rounded-[3rem] p-6 h-[480px] flex flex-col shadow-2xl overflow-hidden bg-slate-950/40">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div className="h-10 w-10 rounded-xl bg-secondary/15 text-secondary border border-secondary/20 flex items-center justify-center">
                      <Brain className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold font-heading text-sm text-white">AI Coach</h4>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Online — Biometric Model Active</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                        <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center border mt-0.5 text-xs font-bold ${msg.role === "assistant" ? "bg-secondary/15 text-secondary border-secondary/30" : "bg-accent/15 text-accent border-accent/30"}`}>
                          {msg.role === "assistant" ? "AI" : "U"}
                        </div>
                        <div className={`rounded-xl p-3 border text-xs leading-relaxed ${msg.role === "assistant" ? "bg-white/5 border-white/10 text-muted-foreground rounded-tl-sm" : "bg-accent/10 border-accent/20 text-white rounded-tr-sm"}`}>
                          {msg.content.split("\n").map((line, iIdx) => (
                            <p key={iIdx} className={iIdx > 0 ? "mt-1.5" : ""}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3 max-w-[85%] mr-auto">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center text-xs font-bold animate-pulse">AI</div>
                        <div className="bg-white/5 border border-white/10 rounded-xl rounded-tl-sm p-3 text-[10px] font-mono text-secondary animate-pulse">Compiling biological overrides...</div>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-white/5 flex gap-2 items-center">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl h-10 px-3 flex items-center text-[10px] text-muted-foreground font-medium">Select a question above to chat with AI Coach.</div>
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-lg shadow-secondary/15">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-32 md:py-48 border-t border-white/5 bg-gradient-to-b from-background to-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          <div className="container mx-auto px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass p-16 md:p-32 rounded-[4rem] border-white/10 flex flex-col items-center justify-center space-y-12 text-center relative overflow-hidden group shadow-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-5xl font-bold tracking-tight sm:text-8xl font-heading leading-[0.9] text-white">
                  Ready to Level Up Your <br /><span className="text-secondary">Fitness DNA?</span>
                </h2>
                <p className="max-w-[700px] mx-auto text-muted-foreground text-xl md:text-2xl leading-relaxed">
                  Join the elite community of athletes who have found their perfect sync.
                </p>
                <div className="pt-10">
                  <Link href="/signup">
                    <button className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-16 h-20 text-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,201,167,0.3)] transition-all hover:scale-105 active:scale-95 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10">Create Your Free Account</span>
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-20 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-inner group-hover:scale-110 transition-transform">
                <Activity className="h-7 w-7" />
              </div>
              <span className="text-3xl font-bold font-heading tracking-tighter text-white">FitSync</span>
            </Link>
            <p className="text-sm text-muted-foreground font-medium max-w-xs text-center md:text-left leading-relaxed">
              Synchronize your body, synchronize your life. The ultimate ecosystem for the modern athlete.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-8">
            <nav className="flex gap-12">
              <Link className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-secondary transition-colors" href="/legal">Terms</Link>
              <Link className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-secondary transition-colors" href="/legal">Privacy</Link>
              <Link className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-secondary transition-colors" href="/legal">Security</Link>
            </nav>
            <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest">© 2026 FitSync Platform. Engineered by Excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
      whileHover={{ y: -15, scale: 1.02 }}
      className="glass p-10 rounded-[3rem] border-white/5 flex flex-col items-center text-center space-y-8 transition-all hover:bg-white/5 hover:border-white/10 hover:shadow-2xl group cursor-default h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="h-20 w-20 rounded-3xl bg-background/50 flex items-center justify-center border border-white/5 group-hover:border-secondary/30 transition-all shadow-inner relative z-10">
        <div className="absolute inset-0 bg-secondary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        {icon}
      </div>
      <div className="space-y-3 relative z-10">
        <h3 className="text-2xl font-bold font-heading group-hover:text-secondary transition-colors text-white">{title}</h3>
        <p className="text-muted-foreground text-base leading-relaxed font-medium">{description}</p>
      </div>
      <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1 w-12 bg-secondary/30 rounded-full mx-auto" />
      </div>
    </motion.div>
  );
}
