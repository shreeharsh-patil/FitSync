"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star, Menu, X, ChevronRight } from "lucide-react";
import LogoMark from "@/components/LogoMark";

const faqs = [
  { question: "Can I cancel my subscription anytime?", answer: "Absolutely. Plans are month-to-month or annual, cancel anytime from settings." },
  { question: "How does the AI Coach work?", answer: "Our AI Coach integrates with your training logs, sleep, and nutrition data for custom protocols." },
  { question: "Is there a free trial?", answer: "Yes! 14-day all-access free pass. No credit card required." },
  { question: "Which wearables are supported?", answer: "Apple Health, Google Fit, Fitbit, Strava. Garmin and Whoop coming soon." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for getting started.",
    bullets: ["Up to 3 workout plans", "Unlimited workout logging", "14-day nutrition history", "Basic analytics", "Read-only community"],
    featured: false,
    cta: "Get Started Free",
    href: "/signup",
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/ month",
    desc: "The standard for elite athletes.",
    bullets: ["Unlimited workout plans", "Unlimited nutrition history", "AI Coach Chatbot", "AI Workout Generation", "Advanced analytics", "Community challenges", "Ad-free ecosystem"],
    featured: true,
    cta: "Unlock Premium",
    href: "/signup?plan=premium",
  },
  {
    name: "Trainer Pro",
    price: "$29.99",
    period: "/ month",
    desc: "Grow your fitness business.",
    bullets: ["All Premium features", "Manage 50 clients", "Trainer directory listing", "Direct messaging CRM", "Custom branded routines", "15% marketplace fee"],
    featured: false,
    cta: "Deploy CRM",
    href: "/signup?plan=trainer",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-surface-0">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-border">
        <div className="container-wide flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={22} />
            <span className="text-base font-bold tracking-tight text-text-primary">Fitsync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-accent">Pricing</Link>
            <div className="flex items-center gap-3 ml-4">
              <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium">Sign In</Link>
              <Link href="/signup" className="btn-primary text-sm">Get Started</Link>
            </div>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-text-secondary p-2 -mr-2">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="md:hidden bg-surface-1 border-t border-border px-6 py-6 space-y-4">
            <Link href="/features" className="block text-sm text-text-secondary" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-sm font-medium text-accent" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Link href="/login" className="block w-full py-2.5 text-sm border border-border-hover rounded-lg text-text-secondary text-center font-medium">Sign In</Link>
              <Link href="/signup" className="block w-full py-2.5 text-sm bg-accent text-white rounded-lg text-center font-semibold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-16">
        <div className="container-wide py-20 md:py-28 space-y-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-5">
            <span className="caption block">Pricing</span>
            <h1 className="display-xl">
              Invest in your<br /><span className="gradient-text">performance</span>
            </h1>
            <p className="body-lg">Choose the plan that fits your athletic level.</p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <span className={`text-sm font-medium ${!isAnnual ? "text-text-primary" : "text-text-muted"}`}>Monthly</span>
              <button onClick={() => setIsAnnual(!isAnnual)}
                className="w-12 h-6 rounded-full bg-surface-3 border border-border p-0.5 flex items-center relative transition-all hover:border-accent/30">
                <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-accent"
                  style={{ position: "absolute", left: isAnnual ? "1px" : "23px" }} />
              </button>
              <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? "text-text-primary" : "text-text-muted"}`}>
                Annual
                <span className="text-[10px] bg-accent-dim text-accent font-semibold px-2 py-0.5 rounded">
                  Save 33%
                </span>
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {plans.map((plan, idx) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`flex flex-col justify-between relative overflow-hidden rounded-xl p-7 border ${
                  plan.featured
                    ? "bg-surface-1 border-accent/30"
                    : "bg-surface-1 border-border"
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-accent text-white text-[9px] font-bold px-4 py-1.5 rounded-bl-lg uppercase tracking-widest flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />Popular
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className={`text-lg font-bold ${plan.featured ? "text-accent" : "text-text-primary"}`}>
                      {plan.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight text-text-primary">
                      {plan.name === "Premium" && isAnnual ? "$6.66" : plan.price}
                    </span>
                    <span className="text-xs text-text-muted ml-2 font-semibold uppercase tracking-wider">{plan.period}</span>
                  </div>

                  <div className="h-px bg-border" />

                  <ul className="space-y-2.5">
                    {plan.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.featured ? "text-accent" : "text-text-muted"}`} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link href={plan.href} className={`block w-full h-11 font-semibold text-sm rounded-lg text-center transition-all ${
                    plan.featured
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "border border-border text-text-secondary hover:text-text-primary hover:border-border-hover"
                  }`}>
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto space-y-5">
            <div className="text-center">
              <h2 className="heading-lg">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg bg-surface-1 border border-border overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-surface-2 transition-colors"
                  >
                    <span className="font-medium text-sm text-text-primary">{faq.question}</span>
                    <ChevronRight className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                      activeFaq === i ? "rotate-90 text-accent" : ""
                    }`} />
                  </button>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-4">
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-10">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <LogoMark size={18} />
            <span className="text-sm font-bold text-text-primary">Fitsync</span>
          </div>
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/features" className="text-sm text-text-muted hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-text-muted hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">Sign In</Link>
            <span className="text-sm text-text-muted/40">&copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
