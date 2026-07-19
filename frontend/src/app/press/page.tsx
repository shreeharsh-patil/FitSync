"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight, Download, ExternalLink, Calendar } from "lucide-react"
import { Footer } from "@/components/footer"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
}

const releases = [
  { date: "June 15, 2026", title: "FitSync Launches AI Coach 2.0 with Real-Time Form Analysis", excerpt: "The update brings computer vision-powered form tracking, personalized recovery protocols, and seamless integration with Apple Health and WHOOP." },
  { date: "April 22, 2026", title: "FitSync Reaches 50,000 Active Athletes Across 40 Countries", excerpt: "The AI-powered fitness platform tripled its user base in six months, driven by organic growth and community referrals." },
  { date: "February 8, 2026", title: "FitSync Raises $12M Series A to Expand AI Coaching Platform", excerpt: "Led by Topher Capital with participation from existing investors. Funds will accelerate development of the AI Coach and expand the engineering team." },
  { date: "November 12, 2025", title: "FitSync Launches Community Challenges & Leaderboards", excerpt: "New gamification features let athletes compete in monthly challenges, earn XP, and climb global leaderboards." },
  { date: "September 3, 2025", title: "FitSync Introduces Unified Nutrition Tracking", excerpt: "The new Nutrition Hub lets athletes log meals, track macros, and monitor hydration — all within the FitSync ecosystem." },
  { date: "July 20, 2025", title: "FitSync Public Beta Launches with 5,000 Athletes", excerpt: "After six months of private development, FitSync opens its doors to the public with AI coaching, workout tracking, and integrated analytics." },
]

const mentions = [
  { outlet: "TechCrunch", title: "FitSync Is Building The Operating System For Athletes", date: "June 16, 2026", url: "#" },
  { outlet: "The Verge", title: "This AI Fitness Platform Actually Works", date: "April 23, 2026", url: "#" },
  { outlet: "Forbes", title: "How FitSync Is Democratizing Elite Athletic Training", date: "February 10, 2026", url: "#" },
  { outlet: "Bloomberg", title: "FitSync's Series A Signals Growing Appetite for AI Fitness", date: "February 8, 2026", url: "#" },
]

export default function PressPage() {
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
            <Link href="/press" className="text-sm font-medium text-[#AFFF00]">Press</Link>
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
            <Link href="/press" className="block text-sm text-[#AFFF00]">Press</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-[#121212]/10">
              <Link href="/login" className="block w-full py-2.5 text-sm border-2 border-[#121212]/20 rounded-full text-[#121212] text-center font-medium">Sign In</Link>
              <Link href="/login" className="block w-full py-2.5 text-sm bg-[#AFFF00] rounded-full text-[#121212] text-center font-bold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-white noise-overlay">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#AFFF00]/5 to-white" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
            <div className="max-w-3xl">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="inline-flex items-center gap-2 bg-[#121212] text-white px-3 py-1.5 rounded-full text-xs font-mono tracking-wider mb-6">
                <span className="w-2 h-2 bg-[#AFFF00] rounded-full" />
                PRESS & MEDIA
              </motion.div>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="text-5xl md:text-7xl font-black tracking-tighter text-[#121212] leading-[0.9] mb-6">
                Press &<br />
                <span className="text-[#AFFF00]">Media.</span>
              </motion.h1>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-lg md:text-xl font-mono text-[#121212]/60 leading-relaxed max-w-xl">
                Latest news, press releases, and media resources for FitSync.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Media Kit CTA */}
        <section className="py-10 border-y border-[#121212]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#121212]">Media Kit</h3>
                <p className="text-sm font-mono text-[#121212]/60">Logos, screenshots, brand guidelines, and team photos.</p>
              </div>
              <Link href="#" className="inline-flex items-center gap-2 bg-[#121212] text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-[#121212]/80 transition-colors">
                <Download className="w-4 h-4" />Download Media Kit
              </Link>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="font-mono text-xs text-[#121212]/50 tracking-widest">PRESS RELEASES</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tighter mt-3">
                Latest<br />
                <span className="text-[#AFFF00]">updates.</span>
              </h2>
            </motion.div>
            <div className="space-y-4">
              {releases.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group bg-[#121212] rounded-2xl p-5 cursor-pointer hover:border-[#AFFF00]/30 border border-transparent transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden md:flex items-center gap-2 text-[#AFFF00] font-mono text-xs shrink-0 w-24 pt-1">
                      <Calendar className="w-3 h-3" />{r.date}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white group-hover:text-[#AFFF00] transition-colors">{r.title}</h3>
                      <p className="text-white/60 font-mono text-sm mt-2 leading-relaxed">{r.excerpt}</p>
                      <div className="flex items-center gap-3 mt-3 md:hidden">
                        <span className="text-white/40 font-mono text-xs"><Calendar className="w-3 h-3 inline mr-1" />{r.date}</span>
                      </div>
                    </div>
                    <div className="shrink-0 pt-1">
                      <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#AFFF00] transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* In the News */}
        <section className="py-20 bg-[#121212]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="font-mono text-xs text-[#AFFF00]/70 tracking-widest">IN THE NEWS</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mt-3">
                As featured<br />
                <span className="text-[#AFFF00]">in.</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4">
              {mentions.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-[#AFFF00]/30 transition-colors group"
                >
                  <span className="text-[#AFFF00] font-mono text-xs font-semibold">{m.outlet}</span>
                  <h3 className="text-lg font-black text-white mt-1 mb-2 group-hover:text-[#AFFF00] transition-colors">{m.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 font-mono text-xs">{m.date}</span>
                    <Link href={m.url} className="text-[#AFFF00] font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Article <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-[#AFFF00] noise-overlay">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tighter leading-[0.9] mb-4">
                Press inquiries?
              </h2>
              <p className="text-[#121212]/70 font-mono text-sm max-w-md mx-auto mb-6">
                Reach our communications team for interview requests, quotes, and media assets.
              </p>
              <Link
                href="mailto:press@fitsync.com"
                className="inline-flex items-center gap-2 bg-[#121212] text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform"
              >
                press@fitsync.com <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


