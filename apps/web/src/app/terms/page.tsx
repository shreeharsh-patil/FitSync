import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Scale, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
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
              <Scale className="h-3 w-3" />
              Legal Framework
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-heading leading-none">
              Terms of <span className="text-secondary">Service</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Please read these terms carefully before starting your premium training journey with FitSync.
            </p>
            <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
              Last Updated: May 23, 2026
            </p>
          </div>

          {/* Legal Content */}
          <div className="space-y-8">
            <div className="glass p-8 md:p-12 rounded-[2.5rem] border-white/5 space-y-8">
              
              {/* Disclaimer */}
              <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 flex gap-4 items-start">
                <ShieldAlert className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-accent font-bold font-heading text-lg">Medical & Fitness Disclaimer</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    FitSync provides AI-generated fitness, recovery, and nutritional planning. Our platform is NOT a replacement for professional medical advice, diagnosis, or treatment. Always consult with a physician before starting any extreme diet or exercise program.
                  </p>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">1</span>
                  Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  By creating an account or accessing the FitSync web application, native apps, or API integration ("Services"), you agree to be bound by these Terms of Service. If you do not agree, you must immediately cease usage of our platform.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">2</span>
                  User Accounts & Security
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  You are responsible for maintaining the confidentiality of your credentials. Any active tracking device synchronized to your account will transmit biometric data, which we store in accordance with our Privacy Policy. You must be at least 18 years of age to register for our premium training suites.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">3</span>
                  Subscriptions & Billing
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  We bill recurring memberships automatically on a monthly or annual cycle. You can cancel your subscription at any time within your billing panel. If canceled, premium capabilities (such as deep data export, real-time AI feedback) remain active until the end of your billing cycle, and no further charges will apply.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">4</span>
                  Device Integration & Wearable Sync
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  Our ecosystem interfaces with health sensors, smartwatches, and third-party metrics APIs. We are not liable for biometric hardware synchronization failures, data packet drops, or inaccurate biometric tracking reporting from your hardware.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">5</span>
                  Termination
                </h2>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  We reserve the right to suspend or terminate accounts that breach our community guidelines, spread malicious software, or attempt reverse engineering of our AI model weights and data models.
                </p>
              </div>

            </div>
          </div>

          {/* Quick Contact */}
          <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading">Have any questions about our legal policies?</h3>
              <p className="text-muted-foreground text-sm">Our legal compliance team is ready to assist you.</p>
            </div>
            <a href="mailto:legal@fitsync.com">
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-8">
                Contact Legal Support
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
