"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight, Target, Zap, Users, Globe } from "lucide-react"
import { Footer } from "@/components/footer"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
}

const stats = [
  { value: "50k+", label: "Active Athletes" },
  { value: "500k+", label: "Workouts Logged" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "6+", label: "Platform Integrations" },
]

const values = [
  { icon: Target, title: "Precision Over Volume", desc: "Every feature exists because it moves the needle. No bloat, no gimmicks — just tools that make you better." },
  { icon: Zap, title: "Data-Driven Results", desc: "Your body doesn't lie. We correlate sleep, nutrition, recovery, and training to reveal what actually works for you." },
  { icon: Users, title: "Community > Competition", desc: "Compete in challenges, share wins, and learn from athletes at every level. We rise together." },
  { icon: Globe, title: "Accessible Excellence", desc: "World-class coaching and analytics shouldn't cost a fortune. We're building the free tier to prove it." },
]

const team = [
  { name: "Alex Chen", role: "CEO & Co-Founder", bio: "Former D1 athlete turned engineer. Built FitSync after 7 years building fitness apps at Apple." },
  { name: "Maya Rodriguez", role: "CTO & Co-Founder", bio: "ML engineer who optimized training plans for Olympic track cyclists. Now powers our AI Coach." },
  { name: "Jordan Kim", role: "Head of Product", bio: "Product designer who scaled Strava's premium tier to 3M subscribers. Fitness is in her DNA." },
  { name: "Dr. Sam Williams", role: "Head of Sports Science", bio: "PhD in Exercise Physiology. Former head of performance science at WHOOP." },
]

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" })

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
            <Link href="/about" className="text-sm font-medium text-[#AFFF00]">About</Link>
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
            <Link href="/features" className="block text-sm text-[#121212]/70" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-sm text-[#121212]/70" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/about" className="block text-sm text-[#AFFF00]" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-[#121212]/10">
              <Link href="/login" className="block w-full py-2.5 text-sm border-2 border-[#121212]/20 rounded-full text-[#121212] text-center font-medium">Sign In</Link>
              <Link href="/login" className="block w-full py-2.5 text-sm bg-[#AFFF00] rounded-full text-[#121212] text-center font-bold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-white noise-overlay">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#AFFF00]/5 to-white" />
          <motion.div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-[#AFFF00]/20 blur-3xl" animate={{ x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
            <div className="max-w-3xl">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="inline-flex items-center gap-2 bg-[#121212] text-white px-3 py-1.5 rounded-full text-xs font-mono tracking-wider mb-6">
                <span className="w-2 h-2 bg-[#AFFF00] rounded-full" />
                ABOUT FITSYNC
              </motion.div>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="text-5xl md:text-7xl font-black tracking-tighter text-[#121212] leading-[0.9] mb-6">
                Built by athletes.<br />
                <span className="text-[#AFFF00]">For athletes.</span>
              </motion.h1>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-lg md:text-xl font-mono text-[#121212]/60 leading-relaxed max-w-xl">
                FitSync was born in a garage gym in 2024 — two engineers tired of juggling five apps just to understand their own progress. We built the platform we wished existed.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section ref={statsRef} className="py-16 border-y border-[#121212]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-black text-[#121212] tracking-tighter">{stat.value}</p>
                  <p className="text-sm font-mono text-[#121212]/50 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <span className="font-mono text-xs text-[#121212]/50 tracking-widest">OUR STORY</span>
                <h2 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tighter mt-3 mb-6">
                  From a garage<br />
                  <span className="text-[#AFFF00]">to your wrist.</span>
                </h2>
                <div className="space-y-4 font-mono text-sm text-[#121212]/60 leading-relaxed">
                  <p>In early 2024, co-founders Alex and Maya were frustrated. They wore an Apple Watch, logged meals in MyFitnessPal, tracked sleep on WHOOP, and planned workouts on a shared Google Sheet. Their data was everywhere — and nowhere.</p>
                  <p>They quit their jobs, pooled their savings, and spent six months building the unified platform they needed. By August, the first beta had 200 athletes. By December, 10,000.</p>
                  <p>Today, FitSync powers over 50,000 athletes across 40+ countries. We're still a small team. We still train. And we still believe the best fitness app is the one you don't think about — because everything just works.</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl bg-[#121212] p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-black text-[#AFFF00] tracking-tighter">FS</div>
                    <p className="text-white/60 font-mono text-sm mt-4">Est. 2024</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#AFFF00] rounded-full -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-[#121212]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="font-mono text-xs text-[#AFFF00]/70 tracking-widest">OUR VALUES</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mt-3">
                What we<br />
                <span className="text-[#AFFF00]">stand for.</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-[#AFFF00]/30 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#AFFF00] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <v.icon className="w-5 h-5 text-[#121212]" />
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight mb-2">{v.title}</h3>
                  <p className="text-white/60 font-mono text-xs leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="font-mono text-xs text-[#121212]/50 tracking-widest">LEADERSHIP</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tighter mt-3">
                Meet the<br />
                <span className="text-[#AFFF00]">team.</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="bg-[#121212] rounded-2xl p-6 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#AFFF00] flex items-center justify-center mb-4">
                    <span className="text-lg font-black text-[#121212]">{member.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight">{member.name}</h3>
                  <p className="text-[#AFFF00] font-mono text-xs font-semibold mt-1">{member.role}</p>
                  <p className="text-white/60 font-mono text-xs leading-relaxed mt-3">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#AFFF00] noise-overlay">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-[#121212] tracking-tighter leading-[0.9] mb-6">
                Ready to join<br />
                <span className="text-white">50k+ athletes?</span>
              </h2>
              <p className="text-[#121212]/70 font-mono text-sm max-w-md mx-auto mb-8">
                Start for free. No credit card. Cancel anytime.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#121212] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
