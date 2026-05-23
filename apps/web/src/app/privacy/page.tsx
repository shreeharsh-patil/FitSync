import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, ShieldCheck, Lock, Eye, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden selection:bg-secondary selection:text-primary">
      {/* Navigation */}
      <header className="w-full border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center">
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
        </div>
      </header>

      <main className="flex-1 py-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--secondary)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-16 relative z-10">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">
              <ShieldCheck className="h-3 w-3" />
              Athlete Trust Architecture
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-heading leading-none">
              Privacy <span className="text-secondary">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your biometric telemetry is your asset. We respect your data and provide top-tier encryption and control protocols.
            </p>
            <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
              Last Updated: May 23, 2026
            </p>
          </div>

          {/* Privacy Content */}
          <div className="space-y-8">
            <div className="glass p-8 md:p-12 rounded-[2.5rem] border-white/5 space-y-8">
              
              {/* Privacy Shield Info */}
              <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/20 flex gap-4 items-start">
                <Lock className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-secondary font-bold font-heading text-lg">Biometric Safety Guarantee</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    FitSync does NOT sell, lease, or distribute your fitness logs, wearable heart rate charts, active workouts, or nutrition data to marketing companies or third-party insurance providers. All data is processed solely to drive your AI fitness outcomes.
                  </p>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">1</span>
                  Information We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  We gather data that you explicitly provide, including username, biometric dimensions (height, weight, age, target outcomes), wearable heart rate signals, active training logs, hydration history, nutrition inputs, and active GPS coordinates for route mapping when workouts are recorded.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">2</span>
                  How We Process Biometrics
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  Biometric telemetry is parsed by our AI coaching algorithms to generate personalized recovery curves, progressive overload workout blueprints, and active macro recommendations. All analytical results are visualised under your private progress dashboards.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">3</span>
                  Third-Party Wearable Sync
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  When you synchronize smart devices (Apple HealthKit, Google Health Connect, Fitbit, Garmin, or Strava), we import raw activity logs and physiological metrics. You have complete control to revoke these connection channels at any time inside your FitSync profile integration panel.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">4</span>
                  Athlete Control & Deletion
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  In compliance with GDPR and CCPA, you own your health telemetry. You have the right to request a full CSV export of your training signals or trigger an instant, absolute deletion of all your training, physiological, and auth data from our cloud clusters.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">5</span>
                  Telemetry Protection Standards
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  All physiological telemetry packets are encrypted in transit using TLS 1.3 protocols and at rest within secure database systems. Access tokens, cookies, and keys are monitored dynamically under our strict active intrusion threat checks.
                </p>
              </div>

            </div>
          </div>

          {/* Quick Contact */}
          <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading">Need to trigger data deletion or export?</h3>
              <p className="text-muted-foreground text-sm">Our athlete support specialists can help you download or wipe your data.</p>
            </div>
            <a href="mailto:privacy@fitsync.com">
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-8">
                Request Data Deletion
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
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
              href="/terms"
            >
              Terms
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/security"
            >
              Security
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
