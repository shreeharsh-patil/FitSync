import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Activity,
  Zap,
  Brain,
  Trophy,
  Smartphone,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden selection:bg-secondary selection:text-primary">
      {/* Navigation */}
      <header className="px-6 lg:px-12 h-20 flex items-center border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <Activity className="h-6 w-6" />
          </div>
          <span className="ml-3 text-2xl font-bold font-heading tracking-tighter">
            FitSync
          </span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-8">
          <Link
            className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            href="/features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            href="/pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            href="/blog"
          >
            Blog
          </Link>
        </nav>
        <div className="ml-auto md:ml-8 flex gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="font-bold uppercase tracking-widest text-xs"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold uppercase tracking-widest text-xs px-6">
              Join Now
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-48 flex flex-col items-center justify-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--secondary)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-12 relative z-10">
            <div className="space-y-6 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em] animate-fade-in">
                <Zap className="h-3 w-3 fill-secondary" />
                The Future of Fitness is Here
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl font-heading leading-[0.9]">
                Sync Your Body. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary bg-[length:200%_auto] animate-gradient">
                  Sync Your Life.
                </span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
                The AI-powered fitness ecosystem designed to unify your
                tracking, nutrition, and community in one premium platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white px-10 h-16 text-lg font-bold shadow-2xl shadow-accent/20 transition-all hover:scale-105 active:scale-95"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 h-16 px-10 text-lg font-bold transition-all"
                >
                  Explore Ecosystem
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-12 flex flex-col items-center gap-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Trusted by 500,000+ athletes
              </p>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-12 w-12 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden"
                  >
                    <div className="h-full w-full bg-gradient-to-br from-secondary/40 to-primary/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-24 md:py-32 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-muted/20 -skew-y-3 origin-right scale-110" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl font-heading">
                Engineered for{" "}
                <span className="text-secondary">Peak Performance</span>
              </h2>
              <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl">
                FitSync combines elite-level data tracking with human-centric
                design.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-secondary" />}
                title="AI Coaching"
                description="Context-aware guidance that adapts to your recovery and progress in real-time."
              />
              <FeatureCard
                icon={<Activity className="h-8 w-8 text-accent" />}
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
        <section className="w-full py-24 md:py-32 border-t border-white/5 bg-gradient-to-b from-background to-primary/10">
          <div className="container px-4 md:px-6">
            <div className="glass p-12 md:p-24 rounded-[3rem] border-white/10 flex flex-col items-center justify-center space-y-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-4">
                <h2 className="text-4xl font-bold tracking-tight sm:text-7xl font-heading leading-tight">
                  Ready to Level Up Your <br />{" "}
                  <span className="text-secondary">Fitness DNA?</span>
                </h2>
                <p className="max-w-[600px] mx-auto text-muted-foreground text-lg md:text-xl">
                  Join the elite community of athletes who have found their
                  perfect sync.
                </p>
                <div className="pt-8">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-12 h-16 text-xl rounded-2xl shadow-2xl shadow-secondary/20 transition-all hover:scale-105"
                    >
                      Create Your Free Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold font-heading tracking-tighter">
              FitSync
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            © 2026 FitSync Platform. Built for the modern athlete.
          </p>
          <nav className="flex gap-8">
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="#"
            >
              Terms
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="#"
            >
              Privacy
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="#"
            >
              Security
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col items-start text-left space-y-6 transition-all hover:bg-white/5 hover:border-white/10 hover:-translate-y-2 group cursor-default">
      <div className="h-16 w-16 rounded-2xl bg-background/50 flex items-center justify-center border border-white/5 group-hover:border-secondary/20 transition-colors shadow-inner">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold font-heading group-hover:text-secondary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
