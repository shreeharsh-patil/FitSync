"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Scale,
  ShieldCheck,
  ShieldAlert,
  Bookmark,
  CheckCircle2,
  Key,
  Server,
  Cpu
} from "lucide-react";

type ActiveTab = "terms" | "privacy" | "security";

function LegalHubContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("terms");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const tabParam = searchParams.get("tab");
    if (tabParam === "terms" || tabParam === "privacy" || tabParam === "security") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const tabConfigs = [
    { id: "terms", label: "Terms of Service", icon: Scale },
    { id: "privacy", label: "Privacy Policy", icon: ShieldCheck },
    { id: "security", label: "Security Guidelines", icon: ShieldAlert },
  ] as const;

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
        
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">
              <Bookmark className="h-3 w-3" />
              FitSync Trust & Legal Hub
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-heading leading-none">
              Legal, Privacy & <span className="text-secondary">Security</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access all our legal frameworks, athlete privacy standards, and system security protocols in one interactive space.
            </p>
            <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
              Last Updated: May 23, 2026
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-[2rem] max-w-3xl mx-auto backdrop-blur-xl">
            {tabConfigs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                }}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === id
                    ? "bg-secondary text-primary shadow-lg shadow-secondary/20 scale-105"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Policy Dashboard Content */}
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border-white/5 space-y-8 min-h-[500px]">
            
            {/* Terms of Service Section */}
            {activeTab === "terms" && (
              <div className="space-y-8 animate-fade-in">
                <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 flex gap-4 items-start">
                  <ShieldAlert className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-accent font-bold font-heading text-lg">Medical & Fitness Disclaimer</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      FitSync provides AI-generated fitness, recovery, and nutritional planning. Our platform is NOT a replacement for professional medical advice, diagnosis, or treatment. Always consult with a physician before starting any extreme diet or exercise program.
                    </p>
                  </div>
                </div>

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
            )}

            {/* Privacy Policy Section */}
            {activeTab === "privacy" && (
              <div className="space-y-8 animate-fade-in">
                <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/20 flex gap-4 items-start">
                  <ShieldCheck className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-secondary font-bold font-heading text-lg">Biometric Safety Guarantee</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      FitSync does NOT sell, lease, or distribute your fitness logs, wearable heart rate charts, active workouts, or nutrition data to marketing companies or third-party insurance providers. All data is processed solely to drive your AI fitness outcomes.
                    </p>
                  </div>
                </div>

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
              </div>
            )}

            {/* Security Guidelines Section */}
            {activeTab === "security" && (
              <div className="space-y-8 animate-fade-in">
                {/* Security Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center flex flex-col items-center">
                    <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-3">
                      <Key className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold font-heading">Secure Telemetry</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
                      Biometric data and sessions are encrypted in transit via TLS 1.3 and at rest with military-grade AES-256 databases.
                    </p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center flex flex-col items-center">
                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3">
                      <Server className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold font-heading">Wearable Sandboxes</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
                      OAuth integrations with external health metrics APIs execute inside sandboxed workers to verify tokens and block injection vectors.
                    </p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center flex flex-col items-center">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold font-heading">AI Shielding</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
                      Our custom AI training and recovery model engines operate under strict rate limits to stop telemetry scraping and parameter tampering.
                    </p>
                  </div>
                </div>

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
            )}

          </div>

          {/* Bottom Call to Action */}
          <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading">Require custom compliance integrations?</h3>
              <p className="text-muted-foreground text-sm">We provide customized service level agreements and security architectures for enterprise teams.</p>
            </div>
            <a href="mailto:legal@fitsync.com">
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-8">
                Consult FitSync Compliance
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
              href="/legal"
            >
              Terms & Privacy Hub
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/legal?tab=terms"
            >
              Terms
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/legal?tab=privacy"
            >
              Privacy
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/legal?tab=security"
            >
              Security
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default function LegalHubPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="animate-pulse h-12 w-12 text-secondary" />
      </div>
    }>
      <LegalHubContent />
    </Suspense>
  );
}
