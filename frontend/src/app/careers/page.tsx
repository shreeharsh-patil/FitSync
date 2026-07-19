"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight, MapPin, Clock, Sparkles, Building2, Heart, Zap } from "lucide-react"
import { Footer } from "@/components/footer"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
}

const perks = [
  { icon: Zap, title: "Remote-First", desc: "Work from anywhere. We trust you to own your schedule." },
  { icon: Heart, title: "Health & Wellness", desc: "Free FitSync Premium + $5k annual wellness stipend." },
  { icon: Building2, title: "Home Office Setup", desc: "$3k budget for your ideal workspace." },
  { icon: Sparkles, title: "Equity & Growth", desc: "Competitive salary + equity + learning budget." },
]

const openings = [
  { title: "Senior Full-Stack Engineer", dept: "Engineering", location: "Remote (US/EU)", type: "Full-time", desc: "Build the core platform that powers 50k+ athletes. React, TypeScript, Node.js, and a passion for performance." },
  { title: "Machine Learning Engineer", dept: "AI", location: "San Francisco, CA", type: "Full-time", desc: "Train and deploy models that personalize workouts, nutrition plans, and recovery protocols in real time." },
  { title: "Product Designer", dept: "Design", location: "Remote", type: "Full-time", desc: "Design intuitive, beautiful interfaces that make fitness tracking feel effortless. Experience with motion design a plus." },
  { title: "iOS Engineer", dept: "Engineering", location: "Remote (US)", type: "Full-time", desc: "Build our native iOS experience. SwiftUI, Core Data, HealthKit integration, and obsessive attention to detail." },
  { title: "Athlete Success Manager", dept: "Community", location: "Remote", type: "Full-time", desc: "Help athletes get the most out of FitSync. You live and breathe fitness and understand the user's journey." },
  { title: "Content & Social Media Lead", dept: "Marketing", location: "Remote", type: "Full-time", desc: "Own our voice across social, blog, and community. You know what resonates with the fitness audience." },
]

export default function CareersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#121212]/10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-black tracking-tighter">
            <span className="text-[#121212]">Fit</span>
            <span className="text-[#AFFF00]">Sync</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm font-medium text-[#121212]/70 hover:text-[#121212] transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-[#121212]/70 hover:text-[#121212] transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-[#121212]/70 hover:text-[#121212] transition-colors">About</Link>
            <Link href="/careers" className="text-sm font-medium text-[#AFFF00]">Careers</Link>
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
            <Link href="/careers" className="block text-sm text-[#AFFF00]">Careers</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-[#121212]/10">
              <Link href="/login" className="block w-full py-2.5 text-sm border-2 border-[#121212]/20 rounded-full text-[#121212] text-center font-medium">Sign In</Link>
              <Link href="/signup" className="block w-full py-2.5 text-sm bg-[#AFFF00] rounded-full text-[#121212] text-center font-bold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-white noise-overlay">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#AFFF00]/5 to-white" />
          <motion.div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-[#AFFF00]/20 blur-3xl" animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
            <div className="max-w-3xl">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="inline-flex items-center gap-2 bg-[#121212] text-white px-3 py-1.5 rounded-full text-xs font-mono tracking-wider mb-6">
                <span className="w-2 h-2 bg-[#AFFF00] rounded-full" />
                JOIN THE TEAM
              </motion.div>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="text-5xl md:text-7xl font-black tracking-tighter text-[#121212] leading-[0.9] mb-6">
                Build the future<br />
                <span className="text-[#AFFF00]">of fitness.</span>
              </motion.h1>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-lg md:text-xl font-mono text-[#121212]/60 leading-relaxed max-w-xl">
                We're a small, remote-first team of builders, athletes, and data nerds. We move fast, train hard, and ship daily.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="py-16 border-y border-[#121212]/10">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-black text-[#121212] tracking-tighter text-center mb-10"
            >
              Perks that<br />
              <span className="text-[#AFFF00]">matter.</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {perks.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[#121212] rounded-2xl p-6 border border-white/10 hover:border-[#AFFF00]/30 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#AFFF00] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <p.icon className="w-5 h-5 text-[#121212]" />
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight mb-2">{p.title}</h3>
                  <p className="text-white/60 font-mono text-xs leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Openings */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="font-mono text-xs text-[#121212]/50 tracking-widest">OPEN ROLES</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tighter mt-3">
                Join our<br />
                <span className="text-[#AFFF00]">mission.</span>
              </h2>
            </motion.div>
            <div className="space-y-3">
              {openings.map((job, i) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-[#121212] rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedJob(selectedJob === i ? null : i)}
                >
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white group-hover:text-[#AFFF00] transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 text-[#AFFF00] font-mono text-xs">
                          <Building2 className="w-3 h-3" />{job.dept}
                        </span>
                        <span className="inline-flex items-center gap-1 text-white/60 font-mono text-xs">
                          <MapPin className="w-3 h-3" />{job.location}
                        </span>
                        <span className="inline-flex items-center gap-1 text-white/60 font-mono text-xs">
                          <Clock className="w-3 h-3" />{job.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#AFFF00] font-bold text-sm group-hover:translate-x-1 transition-transform">
                        {selectedJob === i ? "Close" : "View Role"} <ArrowRight className="w-3 h-3 inline" />
                      </span>
                    </div>
                  </div>
                  {selectedJob === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="px-5 pb-5 border-t border-white/10 pt-4"
                    >
                      <p className="text-white/60 font-mono text-sm leading-relaxed mb-4">{job.desc}</p>
                      <Link
                        href={`mailto:careers@fitsync.com?subject=Applying for ${encodeURIComponent(job.title)}`}
                        className="inline-flex items-center gap-2 bg-[#AFFF00] text-[#121212] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-[#AFFF00]/30 transition-all"
                      >
                        Apply Now <ArrowRight className="w-3 h-3" />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* No role matching */}
        <section className="py-16 bg-[#AFFF00] noise-overlay">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tighter leading-[0.9] mb-4">
                Don't see your role?
              </h2>
              <p className="text-[#121212]/70 font-mono text-sm max-w-md mx-auto mb-6">
                We're always looking for talented people. Send us your resume and tell us what you'd build.
              </p>
              <Link
                href="mailto:careers@fitsync.com"
                className="inline-flex items-center gap-2 bg-[#121212] text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform"
              >
                Drop us a line <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
