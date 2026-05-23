import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, ShieldAlert, Cpu, EyeOff, Server, HardDrive, Key } from "lucide-react";

export default function SecurityPage() {
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
              <ShieldAlert className="h-3 w-3" />
              Defense in Depth
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-heading leading-none">
              Security <span className="text-secondary">Guidelines</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our infrastructure is engineered from the ground up to shield and isolate athlete telemetry, profiles, and analytical nodes.
            </p>
            <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
              Last Updated: May 23, 2026
            </p>
          </div>

          {/* Security Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-8 rounded-3xl border-white/5 space-y-4 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-heading">Secure Telemetry</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Biometric data and sessions are encrypted in transit via TLS 1.3 and at rest with military-grade AES-256 database protection schemes.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border-white/5 space-y-4 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-2">
                <Server className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-heading">Wearable Sandboxes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                OAuth integrations with Apple, Google, Fitbit, Garmin, and Strava execute inside sandboxed workers to verify tokens and block injection vectors.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border-white/5 space-y-4 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-heading">AI Shielding</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our custom AI training and recovery model engines operate under strict endpoint rate limits to stop telemetry scraping and parameter tampering.
              </p>
            </div>
          </div>

          {/* Security Detail Content */}
          <div className="space-y-8">
            <div className="glass p-8 md:p-12 rounded-[2.5rem] border-white/5 space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">1</span>
                  Authentication & Authorization Standards
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  We use secure industry-standard NextAuth schemes with JWT tokens, password hashing via bcryptjs, and session timeouts. We strongly encourage all trainers and elite athletes to activate two-factor authentication channels to keep their profiles protected.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">2</span>
                  Network Isolation & Penetration Testing
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  FitSync API endpoints reside in decoupled subnets behind cloud load balancers and active firewalls. We run automated vulnerability audits and continuous static analysis, and schedule external third-party penetration audits quarterly.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">3</span>
                  Responsible Disclosure Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  If you discover a potential threat vector, data leak, or system exploit in our web service, database queries, or API nodes, please report it to our security taskforce immediately. We promise swift triage and do not prosecute security researchers who follow responsible disclosure practices.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading">Found a security flaw or vulnerability?</h3>
              <p className="text-muted-foreground text-sm">Please email details of the vulnerability directly to our response team.</p>
            </div>
            <a href="mailto:security@fitsync.com">
              <Button className="bg-accent hover:bg-accent/90 text-white font-bold px-8">
                Report Vulnerability
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
