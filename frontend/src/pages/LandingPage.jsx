import React, { useState } from "react";
import {
  ArrowRight,
  Activity,
  Zap,
  Brain,
  Trophy,
  Smartphone,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage({ onViewChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      {/* Header */}
      <header className="w-full border-b border-white/5 sticky top-0 bg-surface/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <button 
            onClick={() => onViewChange("landing")}
            className="flex items-center justify-center group bg-transparent border-none cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-primary-fixed/10 flex items-center justify-center text-primary-fixed group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <span className="ml-3 text-2xl font-bold font-display-sm tracking-tighter text-white">
              FitSync
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant hover:text-primary-fixed transition-colors">
              Features
            </a>
            <a href="#cta" className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant hover:text-primary-fixed transition-colors">
              Ecosystem
            </a>
          </nav>

          <div className="hidden md:flex gap-4">
            <button
              onClick={() => onViewChange("login")}
              className="px-6 py-2 rounded-lg border border-white/10 text-white font-semibold hover:bg-white/5 active:scale-95 transition-all text-xs uppercase tracking-widest cursor-pointer"
            >
              Login
            </button>
            <button 
              onClick={() => onViewChange("register")}
              className="px-6 py-2 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold hover:bg-white active:scale-95 transition-all text-xs uppercase tracking-widest glow-lime cursor-pointer"
            >
              Join Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-surface-container border-b border-white/5 p-6 space-y-6 flex flex-col transition-all duration-300">
            <nav className="flex flex-col gap-4">
              <a
                className="text-lg font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary-fixed transition-colors"
                href="#features"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                className="text-lg font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary-fixed transition-colors"
                href="#cta"
                onClick={() => setIsMenuOpen(false)}
              >
                Ecosystem
              </a>
            </nav>
            <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onViewChange("login");
                }}
                className="w-full py-3 border border-white/10 rounded-lg text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onViewChange("register");
                }}
                className="w-full py-3 bg-primary-fixed text-on-primary-fixed rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white transition-all glow-lime cursor-pointer"
              >
                Join Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-48 flex flex-col items-center justify-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(195,244,0,0.06)_0%,transparent_70%)] pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-12 relative z-10">
            <div className="space-y-6 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed text-[10px] font-bold uppercase tracking-[0.2em]">
                <Zap className="h-3.5 w-3.5 fill-primary-fixed" />
                The Future of Fitness is Here
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl font-display-sm leading-[0.9] text-white">
                Sync Your Body. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed via-secondary-container to-primary-fixed bg-[length:200%_auto] animate-gradient">
                  Sync Your Life.
                </span>
              </h1>
              <p className="mx-auto max-w-[800px] text-on-surface-variant text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
                The AI-powered fitness ecosystem designed to unify your
                tracking, nutrition, and community in one premium platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => onViewChange("register")}
                className="bg-primary-fixed text-on-primary-fixed px-10 h-16 text-lg font-bold rounded-xl shadow-2xl shadow-primary-fixed/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 glow-lime cursor-pointer"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href="#features"
                className="border border-white/10 hover:bg-white/5 h-16 px-10 text-lg font-bold rounded-xl flex items-center justify-center text-white transition-all"
              >
                Explore Ecosystem
              </a>
            </div>

            {/* Social Proof */}
            <div className="pt-12 flex flex-col items-center gap-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
                Trusted by 500,000+ athletes
              </p>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-12 w-12 rounded-full border-4 border-surface bg-surface-container-high flex items-center justify-center overflow-hidden"
                  >
                    <div className="h-full w-full bg-gradient-to-br from-primary-fixed/40 to-secondary-container/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-24 md:py-32 relative overflow-hidden bg-surface-container-low"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl font-display-sm text-white">
                Engineered for{" "}
                <span className="text-primary-fixed">Peak Performance</span>
              </h2>
              <p className="max-w-[800px] text-on-surface-variant text-lg md:text-xl">
                FitSync combines elite-level data tracking with human-centric
                design.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-primary-fixed" />}
                title="AI Coaching"
                description="Context-aware guidance that adapts to your recovery and progress in real-time."
              />
              <FeatureCard
                icon={<Activity className="h-8 w-8 text-secondary-fixed-dim" />}
                title="Deep Analytics"
                description="Visualise your progress with rich charts and predictive performance metrics."
              />
              <FeatureCard
                icon={<Smartphone className="h-8 w-8 text-blue-400" />}
                title="Unified Sync"
                description="Connect your wearables and nutrition in one seamless digital environment."
              />
              <FeatureCard
                icon={<Trophy className="h-8 w-8 text-yellow-400" />}
                title="Achievements"
                description="Stay motivated with an advanced gamification system and community challenges."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="w-full py-24 md:py-32 bg-gradient-to-b from-surface to-surface-container-low">
          <div className="container mx-auto px-4 md:px-6">
            <div className="glass-card p-12 md:p-24 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center space-y-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/5 to-secondary-container/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-4">
                <h2 className="text-4xl font-bold tracking-tight sm:text-7xl font-display-sm text-white leading-tight">
                  Ready to Level Up Your <br />{" "}
                  <span className="text-primary-fixed">Fitness DNA?</span>
                </h2>
                <p className="max-w-[600px] mx-auto text-on-surface-variant text-lg md:text-xl">
                  Join the elite community of athletes who have found their
                  perfect sync.
                </p>
                <div className="pt-8">
                  <button
                    onClick={() => onViewChange("register")}
                    className="bg-primary-fixed hover:bg-white text-on-primary-fixed font-bold px-12 h-16 text-xl rounded-2xl shadow-2xl shadow-primary-fixed/20 transition-all hover:scale-105 glow-lime cursor-pointer"
                  >
                    Create Your Free Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary-fixed" />
            <span className="text-xl font-bold font-display-sm tracking-tighter text-white">
              FitSync
            </span>
          </div>
          <p className="text-sm text-on-surface-variant font-medium">
            © 2026 FitSync Platform. Built for the modern athlete.
          </p>
          <nav className="flex gap-8">
            <a
              className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary-fixed transition-colors"
              href="#"
            >
              Terms
            </a>
            <a
              className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary-fixed transition-colors"
              href="#"
            >
              Privacy
            </a>
            <a
              className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary-fixed transition-colors"
              href="#"
            >
              Security
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card p-8 rounded-[2rem] flex flex-col items-center text-center space-y-6 transition-all hover:bg-white/5 hover:border-white/10 hover:-translate-y-2 group cursor-default">
      <div className="h-16 w-16 rounded-2xl bg-surface-container flex items-center justify-center border border-white/5 group-hover:border-primary-fixed/20 transition-colors shadow-inner">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold font-display-sm text-white group-hover:text-primary-fixed transition-colors">
          {title}
        </h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
