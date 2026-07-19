"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Footer } from "@/components/footer"

export default function CookiesPage() {
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
              <Link href="/login" className="bg-[#AFFF00] text-[#121212] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-[#AFFF00]/30 transition-all">Get Started</Link>
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
              <Link href="/login" className="block w-full py-2.5 text-sm bg-[#AFFF00] rounded-full text-[#121212] text-center font-bold">Get Started</Link>
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
                Cookie<br />
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
                  <strong className="text-[#AFFF00]">TL;DR:</strong> We use cookies to keep you logged in, make the app work, and understand how you use FitSync. No creepy tracking. You can control everything.
                </p>
              </div>

              <Section title="1. What Are Cookies?">
                <p>Cookies are small text files stored on your device by your web browser. They help us remember your preferences, keep you logged in, and understand how you interact with the Service.</p>
                <p className="mt-3">We also use similar technologies like local storage, session storage, and web beacons for the same purposes.</p>
              </Section>

              <Section title="2. Types of Cookies We Use">
                <h3 className="font-bold text-[#121212] mt-4 mb-2">Essential Cookies</h3>
                <p>Required for the Service to function. They handle authentication, session management, and security. Without these, FitSync won't work properly. These cannot be disabled.</p>

                <h3 className="font-bold text-[#121212] mt-4 mb-2">Functional Cookies</h3>
                <p>Remember your preferences — theme selection, workout filters, nutrition settings. These enhance your experience but are not strictly necessary.</p>

                <h3 className="font-bold text-[#121212] mt-4 mb-2">Analytics Cookies</h3>
                <p>Help us understand how people use FitSync — which features are popular, where users get stuck, and how we can improve. We use privacy-preserving analytics that anonymize IP addresses.</p>

                <h3 className="font-bold text-[#121212] mt-4 mb-2">Marketing Cookies (Opt-in)</h3>
                <p>Used only with your explicit consent. These help us show relevant content and measure the effectiveness of our campaigns. We never share data with ad networks.</p>
              </Section>

              <Section title="3. Third-Party Cookies">
                <p>We use limited third-party services that may set their own cookies:</p>
                <ul className="mt-3 space-y-1.5 list-disc pl-5">
                  <li><strong className="text-[#121212]">Vercel Analytics</strong> — anonymized page view and performance data</li>
                  <li><strong className="text-[#121212]">Sentry</strong> — error tracking and crash reporting (no personal data)</li>
                </ul>
                <p className="mt-3">These services are contractually restricted from using your data for their own purposes.</p>
              </Section>

              <Section title="4. Your Cookie Choices">
                <p>You can control cookies through:</p>
                <ul className="mt-3 space-y-1.5 list-disc pl-5">
                  <li><strong className="text-[#121212]">Browser settings</strong> — most browsers let you block or delete cookies</li>
                  <li><strong className="text-[#121212]">Cookie consent banner</strong> — appears on your first visit, lets you choose preferences</li>
                  <li><strong className="text-[#121212]">Account settings</strong> — manage privacy preferences anytime</li>
                </ul>
                <p className="mt-3">Blocking essential cookies will break FitSync. Blocking analytics cookies won't affect functionality.</p>
              </Section>

              <Section title="5. How Long We Keep Cookies">
                <p>Session cookies expire when you close your browser. Persistent cookies remain for up to 12 months or until you clear them. We refresh cookie preferences every 6 months.</p>
              </Section>

              <Section title="6. Do Not Track">
                <p>FitSync does not respond to "Do Not Track" signals at this time. However, we maintain the same level of privacy protection regardless of these signals — we never track you across third-party sites.</p>
              </Section>

              <Section title="7. Updates to This Policy">
                <p>We may update this Cookie Policy as our practices evolve. We'll notify you of significant changes via email or in-app notification.</p>
              </Section>

              <Section title="8. Contact">
                <p>Questions about cookies? Email us at <span className="text-[#AFFF00] font-semibold">privacy@fitsync.com</span>.</p>
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
    <div className="scroll-mt-24" id={title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}>
      <h2 className="text-lg font-black text-[#121212] tracking-tight mb-3 font-sans">{title}</h2>
      {children}
    </div>
  )
}


