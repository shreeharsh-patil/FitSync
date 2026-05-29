"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Activity,
  Zap,
  Brain,
  Trophy,
  Smartphone,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Chat Simulator State
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: "assistant", content: "Active recovery initialized. Choose a query blueprint to compile biological instructions." }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const mockReplies = [
    {
      q: "Explain progressive overload index",
      r: "Progressive overload is the foundation of hypertrophy. Aim to increase total mechanical tension weekly by incrementing load by 2.5% to 5%, or adding sets/reps. Maintain concentric control."
    },
    {
      q: "Suggest cellular recovery protocols",
      r: "Optimal recovery targets a parasympathetic shift. Implement:\n1. 10 mins myofascial release\n2. 3:1 hydration ratio (water to electrolytes)\n3. 8 hours sleep with dark temperature at 18°C."
    },
    {
      q: "Calculate protein macro targets",
      r: "To optimize protein synthesis: consume 2.0g per kg of bodyweight, distributed in 4 equal feeding windows of 35-40g every 3.5 hours. Prioritize post-workout synchronization."
    }
  ];

  const handleSimulateQuestion = (index: number) => {
    if (isTyping) return;
    const q = mockReplies[index].q;
    const r = mockReplies[index].r;
    
    // Add user message
    setChatMessages(prev => [...prev, { role: "user", content: q }]);
    setIsTyping(true);
    
    // Simulate thinking delay and typing effect
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: "assistant", content: r }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-background overflow-hidden selection:bg-secondary selection:text-primary relative">
      <Header />

      {/* Persistent Background Elements */}
      <div className="fixed inset-0 kinetic-grid opacity-10 pointer-events-none -z-10" />
      <div className="fixed top-0 left-0 w-full h-full bg-mesh opacity-20 pointer-events-none -z-10" />

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="w-full min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Floating Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] glow-sphere opacity-20 pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] glow-sphere opacity-15 pointer-events-none" 
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
          />

          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-12 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 max-w-5xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-bold uppercase tracking-[0.3em] backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 fill-secondary animate-pulse" />
                The Future of Fitness is Synchronized
              </div>
              <h1 className="text-6xl font-bold tracking-tight sm:text-8xl md:text-9xl lg:text-[10rem] font-heading leading-[0.85] text-white">
                Sync Your Body. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary bg-[length:200%_auto] animate-gradient">
                  Sync Your Life.
                </span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl lg:text-2xl font-medium leading-relaxed mt-8">
                The AI-powered fitness ecosystem designed to unify your
                tracking, nutrition, and community in one premium platform.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white px-12 h-16 text-xl font-bold shadow-2xl shadow-accent/40 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2">
                    Start Your Journey
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 h-16 px-12 text-xl font-bold transition-all backdrop-blur-md group"
                >
                  Explore Ecosystem
                  <ChevronRight className="ml-1 h-5 w-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Hero Image / Screen Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-5xl mt-8 relative group/hero-img"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-20 blur-[80px] rounded-[3rem] group-hover/hero-img:opacity-30 transition-opacity duration-700 pointer-events-none" />
              <div className="relative glass border-white/10 rounded-[2.5rem] p-2 overflow-hidden shadow-3xl">
                <img
                  src="/hero-dashboard.png"
                  alt="FitSync Performance Dashboard"
                  className="w-full h-auto rounded-[2rem] border border-white/5 object-cover"
                />
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="pt-16 flex flex-col items-center gap-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                <span className="h-px w-8 bg-white/10" />
                Trusted by 500,000+ athletes
                <span className="h-px w-8 bg-white/10" />
              </p>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, zIndex: 20 }}
                    className="h-14 w-14 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden cursor-pointer shadow-xl"
                  >
                    <div className="h-full w-full bg-gradient-to-br from-secondary/40 to-primary/40" />
                  </motion.div>
                ))}
                <div className="h-14 w-14 rounded-full border-4 border-background bg-secondary flex items-center justify-center font-bold text-primary text-xs shadow-xl z-10">
                  +2k
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest">Scroll</span>
            <div className="h-10 w-px bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-32 md:py-48 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-muted/10 -skew-y-3 origin-right scale-110 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-24">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="h-16 w-16 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 border border-secondary/20 shadow-inner"
              >
                <Sparkles className="h-8 w-8" />
              </motion.div>
              <h2 className="text-5xl font-bold tracking-tight sm:text-7xl font-heading text-white">
                Engineered for{" "}
                <span className="text-secondary relative">
                  Peak Performance
                  <div className="absolute bottom-2 left-0 w-full h-3 bg-secondary/10 -rotate-1 -z-10" />
                </span>
              </h2>
              <p className="max-w-[800px] text-muted-foreground text-xl md:text-2xl mt-4">
                FitSync combines elite-level data tracking with human-centric
                design.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                index={0}
                icon={<Brain className="h-10 w-10 text-secondary" />}
                title="AI Coaching"
                description="Context-aware guidance that adapts to your recovery and progress in real-time."
              />
              <FeatureCard
                index={1}
                icon={<Activity className="h-10 w-10 text-accent" />}
                title="Deep Analytics"
                description="Visualise your progress with rich charts and predictive performance metrics."
              />
              <FeatureCard
                index={2}
                icon={<Smartphone className="h-10 w-10 text-blue-400" />}
                title="Unified Sync"
                description="Connect your wearables and nutrition in one seamless digital environment."
              />
              <FeatureCard
                index={3}
                icon={<Trophy className="h-10 w-10 text-yellow-400" />}
                title="Achievements"
                description="Stay motivated with an advanced gamification system and community challenges."
              />
            </div>
          </div>
        </section>

        {/* Live Preview / alternating showcase */}
        <section className="w-full py-32 md:py-48 relative overflow-hidden bg-slate-950/20">
          <div className="container mx-auto px-4 md:px-6 space-y-32">
            
            {/* Part 1: Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">
                  <Activity className="h-3.5 w-3.5" />
                  Ecosystem Tracking
                </div>
                <h3 className="text-4xl sm:text-6xl font-bold font-heading text-white leading-tight">
                  Biometric Metric <br />
                  <span className="text-accent">Synchronization</span>
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                  Experience real-time performance tracking integrated across all platforms. Capture velocity index, workout heart-rate zone distributions, and automatic set increments inside one unified hub.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    Real-time biosensor wearable synchronization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    Progressive overload volume calculation algorithms
                  </li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-[3rem] opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
                <div className="relative glass border-white/5 rounded-[3rem] p-2 overflow-hidden shadow-2xl">
                  <img
                    src="/performance-showcase.png"
                    alt="Ecosystem Tracking"
                    className="w-full h-auto rounded-[2.5rem] border border-white/5 object-cover"
                  />
                </div>
              </motion.div>
            </div>

            {/* Part 2: Nutrition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:order-2 space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Nutrition Engine
                </div>
                <h3 className="text-4xl sm:text-6xl font-bold font-heading text-white leading-tight">
                  Intelligent Photo-Metric <br />
                  <span className="text-secondary">Meal Scanning</span>
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                  Simply point your device camera to log macro distributions instantly. Our AI parses meal components, estimates volumes, and compiles precise protein/carb targets tailored to your day's protocol.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                    Photo-metric computer vision food recognition
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                    24/7 AI Grok Coach dietary suggestions
                  </li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:order-1 relative group"
              >
                <div className="absolute inset-0 bg-secondary/20 blur-[60px] rounded-[3rem] opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
                <div className="relative glass border-white/5 rounded-[3rem] p-2 overflow-hidden shadow-2xl">
                  <img
                    src="/nutrition-showcase.png"
                    alt="AI Nutrition Engine"
                    className="w-full h-auto rounded-[2.5rem] border border-white/5 object-cover"
                  />
                </div>
              </motion.div>
            </div>

            {/* Part 3: AI Chat Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest font-mono">
                  <Brain className="h-3.5 w-3.5" />
                  Cognitive AI Layer
                </div>
                <h3 className="text-4xl sm:text-6xl font-bold font-heading text-white leading-tight">
                  Interact with the <br />
                  <span className="text-secondary">Grok Fitness Matrix</span>
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                  Try it live. Select a command blueprint below to simulate Grok's biological calculations in real-time.
                </p>
                
                {/* Pre-set simulation buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  {mockReplies.map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSimulateQuestion(idx)}
                      disabled={isTyping}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/20 hover:bg-secondary/[0.02] text-left text-sm font-bold text-white transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-secondary shrink-0" />
                        {item.q}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              
              {/* Interactive Phone/Card Mockup Chat Simulator */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-secondary/20 blur-[60px] rounded-[3rem] opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
                <div className="relative glass border-white/5 rounded-[3rem] p-6 h-[450px] flex flex-col shadow-2xl overflow-hidden bg-slate-950/40">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div className="h-10 w-10 rounded-xl bg-secondary/15 text-secondary border border-secondary/20 flex items-center justify-center font-bold">
                      <Brain className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold font-heading text-sm text-white">Grok AI Coach Simulator</h4>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Biometric Neural Model</p>
                    </div>
                  </div>
                  
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar scroll-smooth">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                      >
                        <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center border mt-0.5 text-xs font-bold ${
                          msg.role === "assistant" ? "bg-secondary/15 text-secondary border-secondary/30" : "bg-accent/15 text-accent border-accent/30"
                        }`}>
                          {msg.role === "assistant" ? "G" : "U"}
                        </div>
                        <div className={`rounded-xl p-3 border text-xs leading-relaxed ${
                          msg.role === "assistant" ? "bg-white/5 border-white/10 text-muted-foreground rounded-tl-sm" : "bg-accent/10 border-accent/20 text-white rounded-tr-sm"
                        }`}>
                          {msg.content.split("\n").map((line: string, iIdx: number) => (
                            <p key={iIdx} className={iIdx > 0 ? "mt-1.5" : ""}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3 max-w-[85%] mr-auto">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-secondary/15 text-secondary border border-secondary/30 flex items-center justify-center text-xs font-bold animate-pulse">
                          G
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl rounded-tl-sm p-3 text-[10px] font-mono text-secondary animate-pulse">
                          Grok Coach is compiling biological overrides...
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom input simulation bar */}
                  <div className="pt-3 border-t border-white/5 flex gap-2 items-center">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl h-10 px-3 flex items-center text-[10px] text-muted-foreground font-medium">
                      Blueprint command active... select question to execute.
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-lg shadow-secondary/15 shrink-0">
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
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-16 md:p-32 rounded-[4rem] border-white/10 flex flex-col items-center justify-center space-y-12 text-center relative overflow-hidden group shadow-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />

              <div className="relative z-10 space-y-6">
                <h2 className="text-5xl font-bold tracking-tight sm:text-8xl font-heading leading-[0.9] text-white">
                  Ready to Level Up Your <br />{" "}
                  <span className="text-secondary">Fitness DNA?</span>
                </h2>
                <p className="max-w-[700px] mx-auto text-muted-foreground text-xl md:text-2xl leading-relaxed">
                  Join the elite community of athletes who have found their
                  perfect sync.
                </p>
                <div className="pt-10">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-16 h-20 text-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,201,167,0.3)] transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10">Create Your Free Account</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-20 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-6">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-inner group-hover:scale-110 transition-transform">
                <Activity className="h-7 w-7" />
              </div>
              <span className="text-3xl font-bold font-heading tracking-tighter text-white">
                FitSync
              </span>
            </Link>
            <p className="text-sm text-muted-foreground font-medium max-w-xs text-center md:text-left leading-relaxed">
              Synchronize your body, synchronize your life. The ultimate ecosystem for the modern athlete.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-8">
            <nav className="flex gap-12">
              <Link
                className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-secondary transition-colors"
                href="/legal?tab=terms"
              >
                Terms
              </Link>
              <Link
                className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-secondary transition-colors"
                href="/legal?tab=privacy"
              >
                Privacy
              </Link>
              <Link
                className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-secondary transition-colors"
                href="/legal?tab=security"
              >
                Security
              </Link>
            </nav>
            <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest">
              © 2026 FitSync Platform. Engineered by Excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -15, scale: 1.02 }}
      className="glass p-10 rounded-[3rem] border-white/5 flex flex-col items-center text-center space-y-8 transition-all hover:bg-white/5 hover:border-white/10 hover:shadow-2xl group cursor-default h-full relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="h-20 w-20 rounded-3xl bg-background/50 flex items-center justify-center border border-white/5 group-hover:border-secondary/30 transition-all shadow-inner relative z-10">
        <div className="absolute inset-0 bg-secondary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        {icon}
      </div>
      <div className="space-y-3 relative z-10">
        <h3 className="text-2xl font-bold font-heading group-hover:text-secondary transition-colors text-white">
          {title}
        </h3>
        <p className="text-muted-foreground text-base leading-relaxed font-medium">
          {description}
        </p>
      </div>
      <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1 w-12 bg-secondary/30 rounded-full mx-auto" />
      </div>
    </motion.div>
  );
}
