"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Sparkles, Check, Star, Menu, X, InfinityIcon, ChevronRight } from "lucide-react";
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

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary selection:bg-accent-coral/15">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <div className="container-wide flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={20} />
            <span className="text-base font-semibold tracking-tight text-text-primary">Fitsync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className={`text-sm font-medium transition-colors ${link.href === "/pricing" ? "text-accent-coral" : "text-text-secondary hover:text-text-primary"}`}>
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 ml-4">
              <Link href="/login"><button className="btn-ghost text-sm">Sign In</button></Link>
              <Link href="/signup"><button className="btn-primary text-sm">Get Started</button></Link>
            </div>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-text-secondary">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-bg-card border-t border-border px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className={`block text-sm font-medium transition-colors ${link.href === "/pricing" ? "text-accent-coral" : "text-text-secondary hover:text-text-primary"}`}
                onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Link href="/login">
                <button className="w-full py-2.5 text-sm border border-border rounded-full text-text-secondary">Sign In</button>
              </Link>
              <Link href="/signup">
                <button className="w-full py-2.5 text-sm bg-accent-coral text-white rounded-full">Get Started</button>
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-14">
        <div className="container-wide py-20 md:py-28 space-y-20">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-6">
            <div className="caption inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-coral/5 border border-accent-coral/15">
              <Sparkles className="h-3 w-3 text-accent-coral" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-accent-coral">Flexible Subscriptions</span>
            </div>
            <h1 className="display-xl">
              Invest In Your <span className="text-accent-coral">Ecosystem</span>
            </h1>
            <p className="body-lg text-text-secondary">Choose the plan that fits your athletic level.</p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <span className={`text-sm font-medium ${!isAnnual ? "text-text-primary" : "text-text-muted"}`}>Monthly</span>
              <button onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-7 rounded-full bg-bg-secondary border border-border p-1 flex items-center relative transition-all hover:border-accent-coral/30">
                <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-accent-coral shadow-sm"
                  style={{ position: "absolute", left: isAnnual ? "6px" : "27px" }} />
              </button>
              <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? "text-text-primary" : "text-text-muted"}`}>
                Annual
                <span className="text-[9px] bg-accent-coral/10 border border-accent-coral/20 text-accent-coral font-semibold px-2 py-0.5 rounded-full">
                  Save 33%
                </span>
              </span>
            </div>
          </motion.div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, idx) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col justify-between relative overflow-hidden rounded-2xl p-8 border ${
                  plan.featured
                    ? "bg-bg-card border-accent-coral/30 shadow-lg shadow-accent-coral/[0.04]"
                    : "bg-bg-card border-border"
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-accent-coral text-white text-[8px] font-bold px-5 py-2 rounded-bl-2xl uppercase tracking-widest flex items-center gap-1.5">
                    <Star className="h-3 w-3 fill-white" />Best Value
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-bold font-heading ${plan.featured ? "text-accent-coral" : "text-text-primary"}`}>
                      {plan.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold font-heading tracking-tight text-text-primary">
                      {plan.name === "Premium" && isAnnual ? "$6.66" : plan.price}
                    </span>
                    <span className="text-xs text-text-muted ml-2 font-semibold uppercase tracking-wider">{plan.period}</span>
                  </div>

                  <div className="h-px bg-border" />

                  <ul className="space-y-3">
                    {plan.bullets.map((b, i) => (
                      <li key={i} className={`flex items-start gap-3 text-sm ${
                        plan.featured && i < 3 ? "text-text-primary font-medium" : "text-text-secondary"
                      }`}>
                        <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.featured && i < 3 ? "bg-accent-coral/10 text-accent-coral" : "bg-bg-secondary text-text-muted"
                        }`}>
                          <Check className="h-3 w-3" />
                        </div>
                        <span>
                          {b === "Unlimited workout plans" ? <><InfinityIcon className="h-3 w-3 inline mr-1" />Unlimited workout plans</> : b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link href={plan.href}>
                    <button className={`w-full h-12 font-bold text-sm rounded-xl transition-all ${
                      plan.featured
                        ? "bg-accent-coral text-white hover:shadow-lg hover:shadow-accent-coral/20"
                        : "border border-border text-text-secondary hover:text-text-primary hover:border-border-hover"
                    }`}>
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="heading-lg">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl bg-bg-card border border-border overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-bg-secondary transition-colors group"
                  >
                    <span className="font-medium text-sm text-text-primary group-hover:text-accent-coral transition-colors">{faq.question}</span>
                    <ChevronRight className={`h-4 w-4 text-text-muted transition-transform duration-300 ${
                      activeFaq === i ? "rotate-90 text-accent-coral" : ""
                    }`} />
                  </button>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      className="px-6 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-4">
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoMark size={16} />
            <span className="text-sm font-semibold text-text-primary">Fitsync</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/features" className="caption hover:text-text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="caption hover:text-text-primary transition-colors">Pricing</Link>
            <span className="caption text-text-muted/50">© 2026 Fitsync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
