"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check,
  HelpCircle,
  Activity,
  Zap,
  ChevronDown,
  Info,
  Sparkles,
} from "lucide-react";

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. FitSync Premium and Trainer Pro plans are billed month-to-month or annually, and you can cancel or downgrade at any time with a single click in your settings panel. No questions asked.",
  },
  {
    question: "How does the AI Coach work?",
    answer: "Our AI Coach is powered by Grok, which integrates with your real-time training logs, sleep metrics, and nutrition data. It gives custom performance protocols, suggests progressive overloads, and adjusts macros based on daily effort.",
  },
  {
    question: "Which wearables can I synchronize?",
    answer: "FitSync currently supports seamless integration with Apple Health, Google Fit, Fitbit, and Strava. Garmin and Whoop integrations are coming in our Phase 2 launch later this year.",
  },
  {
    question: "Is there a free trial for the Premium plan?",
    answer: "Yes! Every new user gets a 14-day all-access free pass to FitSync Premium. No credit card is required to sign up for the trial.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

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
            className="text-sm font-bold uppercase tracking-widest text-secondary"
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

      <main className="flex-1 py-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--secondary)_0%,transparent_60%)] opacity-[0.02] pointer-events-none" />

        <div className="container px-4 mx-auto max-w-6xl space-y-20">
          {/* Header */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3 fill-secondary" />
              Flexible Subscriptions
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight leading-tight">
              Invest In Your <span className="text-secondary">Ecosystem</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Choose the plan that fits your athletic level. Sync your body, optimize your nutrition, and crush your goals.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <span className={`text-sm font-bold transition-colors ${!isAnnual ? "text-white" : "text-muted-foreground"}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-16 h-8 rounded-full bg-white/5 border border-white/10 p-1 flex items-center relative transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-secondary transition-all duration-300 absolute ${
                    isAnnual ? "left-9" : "left-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${isAnnual ? "text-white" : "text-muted-foreground"}`}>
                Annual Billing
                <span className="text-[10px] bg-accent/20 border border-accent/30 text-accent font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Save 33%
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Free Plan */}
            <Card className="p-8 glass border-white/5 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-heading">Free Tier</h3>
                  <p className="text-sm text-muted-foreground">Perfect for beginners logging workouts.</p>
                </div>
                <div className="flex items-baseline text-white">
                  <span className="text-5xl font-bold tracking-tight font-heading">$0</span>
                  <span className="text-sm text-muted-foreground ml-2 font-bold uppercase tracking-widest">/ forever</span>
                </div>
                <hr className="border-white/5" />
                <ul className="space-y-4">
                  <PricingBullet label="Up to 3 workout plans" />
                  <PricingBullet label="Unlimited workout logging" />
                  <PricingBullet label="14-day nutrition history" />
                  <PricingBullet label="Basic progress analytics" />
                  <PricingBullet label="Read-only community feed" />
                  <PricingBullet label="Ad-supported experience" disabled />
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/signup" className="block w-full">
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 h-12 font-bold rounded-xl">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 bg-slate-900/60 border-secondary/40 border-2 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-secondary/5">
              <div className="absolute top-0 right-0 bg-secondary text-primary text-[9px] font-bold px-6 py-2 rounded-bl-3xl uppercase tracking-widest">
                Recommended
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-heading text-secondary">Premium Plan</h3>
                    <Zap className="h-4 w-4 fill-secondary text-secondary" />
                  </div>
                  <p className="text-sm text-muted-foreground">The absolute standard for elite athletes.</p>
                </div>
                <div className="flex items-baseline text-white">
                  <span className="text-5xl font-bold tracking-tight font-heading">
                    {isAnnual ? "$6.66" : "$9.99"}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2 font-bold uppercase tracking-widest">
                    / month
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-widest leading-none">
                    Billed annually ($79.99/yr)
                  </p>
                )}
                <hr className="border-white/5" />
                <ul className="space-y-4">
                  <PricingBullet label="Unlimited workout plans" />
                  <PricingBullet label="Unlimited nutrition history" />
                  <PricingBullet label="AI Coach Chatbot (Grok)" highlight />
                  <PricingBullet label="AI Workout Generation" highlight />
                  <PricingBullet label="Advanced analytics & comparisons" />
                  <PricingBullet label="Community challenge creation" />
                  <PricingBullet label="Ad-free performance ecosystem" />
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/signup?plan=premium" className="block w-full">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary h-12 font-bold rounded-xl shadow-lg shadow-secondary/10">
                    Unlock Premium Pass
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Trainer Pro */}
            <Card className="p-8 glass border-white/5 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-heading">Trainer Pro</h3>
                  <p className="text-sm text-muted-foreground">Grow your digital business & manage clients.</p>
                </div>
                <div className="flex items-baseline text-white">
                  <span className="text-5xl font-bold tracking-tight font-heading">$29.99</span>
                  <span className="text-sm text-muted-foreground ml-2 font-bold uppercase tracking-widest">/ month</span>
                </div>
                <hr className="border-white/5" />
                <ul className="space-y-4">
                  <PricingBullet label="All Premium Tier features" />
                  <PricingBullet label="Manage up to 50 active clients" />
                  <PricingBullet label="Verified Trainer directory listing" />
                  <PricingBullet label="Direct messaging & feedback CRM" />
                  <PricingBullet label="Custom branded routine builders" />
                  <PricingBullet label="Low 15% marketplace transaction fee" />
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/signup?plan=trainer" className="block w-full">
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 h-12 font-bold rounded-xl">
                    Deploy Trainer CRM
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Deep Feature Comparison */}
          <div className="space-y-8 pt-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-heading">Ecosystem Comparison</h2>
              <p className="text-sm text-muted-foreground mt-2">A transparent look at our metrics and features.</p>
            </div>

            <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="p-6 text-sm font-bold font-heading">Feature Details</th>
                    <th className="p-6 text-sm font-bold font-heading text-muted-foreground">Free</th>
                    <th className="p-6 text-sm font-bold font-heading text-secondary">Premium</th>
                    <th className="p-6 text-sm font-bold font-heading text-accent">Trainer Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  <tr>
                    <td className="p-6 font-bold">Active Workout Routines</td>
                    <td className="p-6 text-muted-foreground">3 Routines</td>
                    <td className="p-6 text-secondary font-bold">Unlimited</td>
                    <td className="p-6 text-white">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-6 font-bold">Wearable Integrations</td>
                    <td className="p-6 text-muted-foreground">Basic Sync</td>
                    <td className="p-6 text-secondary font-bold">Real-time Auto-Sync</td>
                    <td className="p-6 text-white">Real-time Auto-Sync</td>
                  </tr>
                  <tr>
                    <td className="p-6 font-bold">AI Coach Chat & Plan Builder</td>
                    <td className="p-6 text-muted-foreground">—</td>
                    <td className="p-6 text-secondary font-bold">Unlimited Access</td>
                    <td className="p-6 text-white">Unlimited Access</td>
                  </tr>
                  <tr>
                    <td className="p-6 font-bold">Progress Charts</td>
                    <td className="p-6 text-muted-foreground">Basic Logs</td>
                    <td className="p-6 text-secondary font-bold">Advanced Analytics & PRs</td>
                    <td className="p-6 text-white">Client Progress Dashboards</td>
                  </tr>
                  <tr>
                    <td className="p-6 font-bold">Marketplace Tools</td>
                    <td className="p-6 text-muted-foreground">—</td>
                    <td className="p-6 text-muted-foreground">—</td>
                    <td className="p-6 text-white font-bold">CRM + Billing Integrations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-8 pt-10 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold font-heading flex items-center justify-center gap-3">
                <HelpCircle className="h-8 w-8 text-secondary" />
                Frequently Answered
              </h2>
              <p className="text-sm text-muted-foreground">Got questions? We have engineered the answers.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl border-white/5 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold text-base leading-snug">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                        activeFaq === i ? "rotate-180 text-secondary" : ""
                      }`}
                    />
                  </button>
                  {activeFaq === i && (
                    <div className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-white/5 bg-black/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
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
            <Link className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors" href="#">
              Security
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function PricingBullet({ label, highlight, disabled }: { label: string; highlight?: boolean; disabled?: boolean }) {
  return (
    <li className={`flex items-start gap-3 text-sm font-medium ${disabled ? "opacity-40" : ""}`}>
      <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
        highlight ? "bg-secondary/20 text-secondary" : "bg-white/5 text-muted-foreground"
      }`}>
        <Check className="h-3 w-3" />
      </div>
      <span className={highlight ? "text-secondary font-semibold" : "text-foreground"}>
        {label}
      </span>
    </li>
  );
}
