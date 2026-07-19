"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#121212]/10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-black tracking-tighter">
            <span className="text-[#121212]">Fit</span><span className="text-[#AFFF00]">Sync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm font-medium text-[#121212]/70 hover:text-[#121212] transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-[#121212]/70 hover:text-[#121212] transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-[#121212]/70 hover:text-[#121212] transition-colors">About</Link>
            <div className="flex items-center gap-3 ml-4">
              <Link href="/login" className="text-sm text-[#121212]/70 hover:text-[#121212] transition-colors font-medium">Sign In</Link>
              <Link href="/signup" className="bg-[#AFFF00] text-[#121212] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-[#AFFF00]/30 transition-all">Get Started</Link>
            </div>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#121212] p-2">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden bg-white border-t border-[#121212]/10 px-6 py-6 space-y-4">
            <Link href="/features" className="block text-sm text-[#121212]/70">Features</Link>
            <Link href="/pricing" className="block text-sm text-[#121212]/70">Pricing</Link>
            <Link href="/about" className="block text-sm text-[#121212]/70">About</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-[#121212]/10">
              <Link href="/login" className="block w-full py-2.5 text-sm border-2 border-[#121212]/20 rounded-full text-[#121212] text-center font-medium">Sign In</Link>
              <Link href="/signup" className="block w-full py-2.5 text-sm bg-[#AFFF00] rounded-full text-[#121212] text-center font-bold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden bg-white noise-overlay">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#AFFF00]/5 to-white" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-[#121212] text-white px-3 py-1.5 rounded-full text-xs font-mono tracking-wider mb-6">
                <span className="w-2 h-2 bg-[#AFFF00] rounded-full" />
                LEGAL
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#121212] leading-[0.9] mb-4">
                Privacy<br />
                <span className="text-[#AFFF00]">Policy</span>
              </h1>
              <p className="text-lg font-mono text-[#121212]/60">Last updated: July 1, 2026</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8 font-mono text-sm text-[#121212]/70 leading-relaxed">
              <div className="p-6 rounded-2xl bg-[#121212] border border-white/10">
                <p className="text-white/80 text-xs leading-relaxed">
                  <strong className="text-[#AFFF00]">TL;DR:</strong> We collect only what we need to power your fitness journey. We never sell your data. You own your information, period.
                </p>
              </div>

              <Section title="1. Information We Collect">
                <p>We collect information you provide directly: name, email, profile details, workout logs, nutrition entries, and health metrics you choose to input or sync from connected devices.</p>
                <p className="mt-3">When you connect third-party services (Apple Health, Google Fit, Fitbit, Strava), we import data you authorize — such as steps, heart rate, sleep, and activity summaries. We only read data you explicitly approve.</p>
                <p className="mt-3">We automatically collect usage data: app interactions, feature usage, session duration, and crash reports. This helps us improve the product.</p>
              </Section>

              <Section title="2. How We Use Your Data">
                <p>Your data powers your experience: AI coaching recommendations, personalized workout plans, nutrition insights, and progress tracking.</p>
                <p className="mt-3">We use aggregated, anonymized data to improve our algorithms and train our AI models. Individual data is never shared or sold.</p>
                <p className="mt-3">We may send product updates, tips, and community notifications. You can control these in settings.</p>
              </Section>

              <Section title="3. Data Sharing">
                <p>We do not sell, rent, or trade your personal data. Period.</p>
                <p className="mt-3">We share data only with: (a) service providers who process data on our behalf (cloud hosting, analytics) under strict contracts, (b) law enforcement when legally required, or (c) with your explicit consent.</p>
                <p className="mt-3">Community posts and profile information you choose to make public are visible to other users as you intend.</p>
              </Section>

              <Section title="4. Data Retention">
                <p>We retain your data for as long as your account is active. If you delete your account, we delete or anonymize your data within 30 days, except where retention is required by law.</p>
                <p className="mt-3">You can export your data at any time from Settings. We believe in data portability.</p>
              </Section>

              <Section title="5. Security">
                <p>We use industry-standard encryption (AES-256 at rest, TLS 1.3 in transit). Our infrastructure is SOC 2 compliant. Access to production data is restricted, logged, and audited.</p>
                <p className="mt-3">No system is 100% secure, but we invest heavily in protecting your trust.</p>
              </Section>

              <Section title="6. Your Rights">
                <p>You have the right to: access your data, correct inaccuracies, delete your account, export your data, and withdraw consent for data processing.</p>
                <p className="mt-3">For GDPR users: you have additional rights including data portability and the right to object to processing. Contact us at privacy@fitsync.com.</p>
              </Section>

              <Section title="7. Children's Privacy">
                <p>FitSync is not intended for users under 13. We do not knowingly collect data from children. If we discover a child's data, we delete it immediately.</p>
              </Section>

              <Section title="8. Changes to This Policy">
                <p>We'll notify you of material changes via email or in-app notification. Continued use after changes constitutes acceptance.</p>
              </Section>

              <Section title="9. Contact">
                <p>Questions about your privacy? Email us at <span className="text-[#AFFF00] font-semibold">privacy@fitsync.com</span> or write to: FitSync Inc., 123 Market St, San Francisco, CA 94105.</p>
              </Section>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="scroll-mt-24" id={title.toLowerCase().replace(/\s+/g, "-")}>
      <h2 className="text-lg font-black text-[#121212] tracking-tight mb-3 font-sans">{title}</h2>
      {children}
    </div>
  )
}


