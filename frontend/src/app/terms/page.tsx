"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Footer } from "@/components/footer"

export default function TermsPage() {
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
                Terms of<br />
                <span className="text-[#AFFF00]">Service</span>
              </h1>
              <p className="text-lg font-mono text-[#121212]/60">Last updated: July 1, 2026</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-8 font-mono text-sm text-[#121212]/70 leading-relaxed">
              <Section title="1. Acceptance of Terms">
                <p>By accessing or using FitSync ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
                <p className="mt-3">We may update these terms. Continued use after updates constitutes acceptance. We'll notify you of material changes via email.</p>
              </Section>

              <Section title="2. Account Registration">
                <p>You must create an account to use FitSync. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.</p>
                <p className="mt-3">You must be at least 13 years old. If you are under 18, you represent that you have parental consent.</p>
                <p className="mt-3">You agree to provide accurate, current information and to update it as needed.</p>
              </Section>

              <Section title="3. Subscriptions & Payments">
                <p>FitSync offers free and paid subscription tiers. Paid plans are billed monthly or annually as selected. You may cancel at any time from your account settings.</p>
                <p className="mt-3">All fees are non-refundable except as required by law. We may change pricing with 30 days notice. Promotional pricing is subject to terms displayed at signup.</p>
                <p className="mt-3">Free trials convert to paid subscriptions unless canceled before the trial ends. We'll remind you before conversion.</p>
              </Section>

              <Section title="4. Acceptable Use">
                <p>You agree to use FitSync only for lawful purposes and in accordance with these terms. You agree not to:</p>
                <ul className="mt-3 space-y-1.5 list-disc pl-5">
                  <li>Use the Service for any illegal activity</li>
                  <li>Attempt to access another user's account</li>
                  <li>Scrape, crawl, or harvest data without authorization</li>
                  <li>Upload malicious code or interfere with Service operations</li>
                  <li>Impersonate any person or entity</li>
                  <li>Post abusive, harassing, or inappropriate content in community areas</li>
                </ul>
              </Section>

              <Section title="5. User Content">
                <p>You retain ownership of content you post (workout logs, nutrition entries, community posts). By posting, you grant FitSync a license to display and process this content within the Service.</p>
                <p className="mt-3">You represent that your content does not infringe third-party rights. We may remove content that violates these terms.</p>
              </Section>

              <Section title="6. AI Coach Disclaimer">
                <p>FitSync's AI Coach provides personalized recommendations based on your data. These are suggestions, not medical advice. Always consult qualified professionals for medical, nutritional, or training decisions.</p>
                <p className="mt-3">You understand that fitness activities carry inherent risk. FitSync is not liable for injuries sustained while following recommendations from the Service.</p>
              </Section>

              <Section title="7. Intellectual Property">
                <p>FitSync, the FitSync logo, and all related trademarks are owned by FitSync Inc. The Service's design, code, and proprietary algorithms are protected by intellectual property laws.</p>
                <p className="mt-3">You may not copy, modify, distribute, sell, or reverse engineer any part of the Service without express written permission.</p>
              </Section>

              <Section title="8. Limitation of Liability">
                <p>FitSync provides the Service "as is" without warranties of merchantability or fitness for a particular purpose. To the maximum extent permitted by law, FitSync's liability is limited to the amount you paid in the 12 months preceding a claim.</p>
                <p className="mt-3">We are not liable for indirect, incidental, or consequential damages arising from your use of the Service.</p>
              </Section>

              <Section title="9. Termination">
                <p>You may delete your account at any time from settings. We may suspend or terminate access for violations of these terms, with notice where possible.</p>
                <p className="mt-3">Upon termination, your right to access the Service ceases. Data is handled as described in our Privacy Policy.</p>
              </Section>

              <Section title="10. Governing Law">
                <p>These terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of San Francisco County.</p>
                <p className="mt-3">These terms constitute the entire agreement between you and FitSync regarding the Service.</p>
              </Section>

              <Section title="11. Contact">
                <p>Questions about these terms? Email us at <span className="text-[#AFFF00] font-semibold">legal@fitsync.com</span> or write to: FitSync Inc., 123 Market St, San Francisco, CA 94105.</p>
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


