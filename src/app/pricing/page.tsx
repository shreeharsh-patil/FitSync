"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, Sparkles, Check, HelpCircle, ChevronDown, Star, Shield, Infinity as InfinityIcon } from "lucide-react";

const faqs = [
  { question: "Can I cancel my subscription anytime?", answer: "Absolutely. Plans are month-to-month or annual, cancel anytime from settings." },
  { question: "How does the AI Coach work?", answer: "Our AI Coach integrates with your training logs, sleep, and nutrition data for custom protocols." },
  { question: "Is there a free trial?", answer: "Yes! 14-day all-access free pass. No credit card required." },
  { question: "Which wearables are supported?", answer: "Apple Health, Google Fit, Fitbit, Strava. Garmin and Whoop coming soon." },
];

const PricingBullet = ({ label, highlight, disabled }: { label: React.ReactNode; highlight?: boolean; disabled?: boolean }) => (
  <li className={`flex items-start gap-3 text-sm font-medium ${disabled ? "opacity-40" : ""}`}>
    <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${highlight ? "bg-secondary/20 text-secondary" : "bg-white/5 text-muted-foreground"}`}>
      <Check className="h-3 w-3" />
    </div>
    <span className={highlight ? "text-secondary font-semibold" : ""}>{label}</span>
  </li>
);

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      <header className="w-full border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"><Activity className="h-6 w-6" /></div>
            <span className="text-2xl font-bold font-heading tracking-tighter text-white">FitSync</span>
          </Link>
          <nav className="ml-auto hidden md:flex gap-8">
            <Link className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-secondary" href="/features">Features</Link>
            <Link className="text-sm font-bold uppercase tracking-widest text-secondary" href="/pricing">Pricing</Link>
          </nav>
          <div className="ml-auto md:ml-8 flex gap-4">
            <Link href="/login"><button className="px-5 py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-white">Login</button></Link>
            <Link href="/signup"><button className="px-6 py-2 bg-secondary text-primary text-sm font-bold uppercase tracking-widest rounded-xl">Join Free</button></Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-20 relative">
        <div className="container px-4 mx-auto max-w-6xl space-y-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3 fill-secondary" />Flexible Subscriptions
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight leading-tight">Invest In Your <span className="text-secondary">Ecosystem</span></h1>
            <p className="text-muted-foreground text-lg md:text-xl">Choose the plan that fits your athletic level.</p>

            <div className="flex items-center justify-center gap-4 pt-6">
              <span className={`text-sm font-bold ${!isAnnual ? "text-white" : "text-muted-foreground"}`}>Monthly</span>
              <button onClick={() => setIsAnnual(!isAnnual)} className="w-16 h-8 rounded-full bg-white/5 border border-white/10 p-1 flex items-center relative hover:border-secondary/30">
                <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-6 h-6 rounded-full bg-secondary shadow-lg" style={{ position: "absolute", left: isAnnual ? "9px" : "33px" }} />
              </button>
              <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? "text-white" : "text-muted-foreground"}`}>
                Annual <span className="text-[10px] bg-accent/20 border border-accent/30 text-accent font-bold px-2 py-0.5 rounded-full">Save 33%</span>
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              { name: "Free", price: "$0", period: "forever", desc: "Perfect for beginners.", bullets: ["Up to 3 workout plans", "Unlimited workout logging", "14-day nutrition history", "Basic analytics", "Read-only community", "Ad-supported"], featured: false, cta: "Get Started Free", href: "/signup" },
              { name: "Premium", price: isAnnual ? "$6.66" : "$9.99", period: "/ month", desc: "The standard for elite athletes.", bullets: ["Unlimited workout plans", "Unlimited nutrition history", "AI Coach Chatbot", "AI Workout Generation", "Advanced analytics", "Community challenges", "Ad-free ecosystem"], featured: true, cta: "Unlock Premium", href: "/signup?plan=premium" },
              { name: "Trainer Pro", price: "$29.99", period: "/ month", desc: "Grow your fitness business.", bullets: ["All Premium features", "Manage 50 clients", "Trainer directory listing", "Direct messaging CRM", "Custom branded routines", "15% marketplace fee"], featured: false, cta: "Deploy CRM", href: "/signup?plan=trainer" },
            ].map((plan, idx) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group ${plan.featured ? "bg-slate-900/60 border-secondary/40 border-2 shadow-2xl shadow-secondary/5" : "glass border-white/5 border"}`}>
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-secondary text-primary text-[9px] font-bold px-6 py-2 rounded-bl-3xl uppercase tracking-widest flex items-center gap-1.5">
                    <Star className="h-3 w-3 fill-primary" />Recommended
                  </div>
                )}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className={`text-xl font-bold font-heading ${plan.featured ? "text-secondary" : ""}`}>{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline text-white">
                    <span className="text-5xl font-bold tracking-tight font-heading">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-2 font-bold uppercase tracking-widest">{plan.period}</span>
                  </div>
                  <hr className="border-white/5" />
                  <ul className="space-y-4">
                    {plan.bullets.map((b, i) => (
                      <PricingBullet key={i} label={b === "Unlimited workout plans" ? <><InfinityIcon className="h-3 w-3 inline mr-1" />Unlimited workout plans</> : b}
                        highlight={plan.featured && i < 3} disabled={b === "Ad-supported"} />
                    ))}
                  </ul>
                </div>
                <div className="pt-8">
                  <Link href={plan.href} className="block w-full">
                    <button className={`w-full h-12 font-bold rounded-xl transition-all relative overflow-hidden group ${plan.featured ? "bg-secondary text-primary shadow-lg shadow-secondary/10" : "border border-white/10 hover:bg-white/5"}`}>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10">{plan.cta}</span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold font-heading flex items-center justify-center gap-3"><HelpCircle className="h-8 w-8 text-secondary" />Frequently Answered</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="glass rounded-2xl border-white/5 overflow-hidden">
                  <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors group">
                    <span className="font-bold group-hover:text-secondary transition-colors">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${activeFaq === i ? "rotate-180 text-secondary" : ""}`} />
                  </button>
                  {activeFaq === i && (
                    <div className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-white/5 bg-black/10">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 border-t border-white/5">
        <div className="container px-4 md:px-6 flex justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3"><Activity className="h-6 w-6 text-secondary" /><span className="text-xl font-bold font-heading tracking-tighter">FitSync</span></div>
          <p className="text-sm text-muted-foreground">© 2026 FitSync Platform.</p>
        </div>
      </footer>
    </div>
  );
}
