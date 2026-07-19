"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight, Mail, MapPin, Phone, Send, Loader2, CheckCircle } from "lucide-react"
import { Footer } from "@/components/footer"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
}

const contactMethods = [
  { icon: Mail, title: "Email Us", value: "hello@fitsync.com", desc: "We respond within 24 hours" },
  { icon: MapPin, title: "Office", value: "San Francisco, CA", desc: "Remote-first team" },
  { icon: Phone, title: "Phone", value: "+1 (555) 123-4567", desc: "Mon-Fri, 9am-6pm PT" },
]

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return
    setSubmitting(true)
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

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
            <Link href="/contact" className="text-sm font-medium text-[#AFFF00]">Contact</Link>
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
            <Link href="/contact" className="block text-sm text-[#AFFF00]">Contact</Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-[#121212]/10">
              <Link href="/login" className="block w-full py-2.5 text-sm border-2 border-[#121212]/20 rounded-full text-[#121212] text-center font-medium">Sign In</Link>
              <Link href="/signup" className="block w-full py-2.5 text-sm bg-[#AFFF00] rounded-full text-[#121212] text-center font-bold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-white noise-overlay">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#AFFF00]/5 to-white" />
          <motion.div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-[#AFFF00]/20 blur-3xl" animate={{ x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
            <div className="max-w-3xl">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="inline-flex items-center gap-2 bg-[#121212] text-white px-3 py-1.5 rounded-full text-xs font-mono tracking-wider mb-6">
                <span className="w-2 h-2 bg-[#AFFF00] rounded-full" />
                GET IN TOUCH
              </motion.div>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="text-5xl md:text-7xl font-black tracking-tighter text-[#121212] leading-[0.9] mb-6">
                Let's talk.<br />
                <span className="text-[#AFFF00]">We're listening.</span>
              </motion.h1>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-lg md:text-xl font-mono text-[#121212]/60 leading-relaxed max-w-xl">
                Have a question, feature request, or just want to say hi? We'd love to hear from you.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-10 border-y border-[#121212]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-4">
              {contactMethods.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-[#121212] rounded-2xl p-5 text-center group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#AFFF00] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <m.icon className="w-5 h-5 text-[#121212]" />
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight">{m.title}</h3>
                  <p className="text-[#AFFF00] font-mono text-sm font-semibold mt-1">{m.value}</p>
                  <p className="text-white/60 font-mono text-xs mt-1">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-5 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2"
              >
                <span className="font-mono text-xs text-[#121212]/50 tracking-widest">SEND A MESSAGE</span>
                <h2 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tighter mt-3 mb-6">
                  Drop us a<br />
                  <span className="text-[#AFFF00]">line.</span>
                </h2>
                <p className="font-mono text-sm text-[#121212]/60 leading-relaxed">
                  Whether you're a user with feedback, a potential partner, or a journalist — we read every message and respond personally.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-mono text-[#121212]/60">
                    <div className="w-2 h-2 rounded-full bg-[#AFFF00]" />
                    Typically responds within 24 hours
                  </div>
                  <div className="flex items-center gap-3 text-sm font-mono text-[#121212]/60">
                    <div className="w-2 h-2 rounded-full bg-[#AFFF00]" />
                    Available in English & Spanish
                  </div>
                  <div className="flex items-center gap-3 text-sm font-mono text-[#121212]/60">
                    <div className="w-2 h-2 rounded-full bg-[#AFFF00]" />
                    We respect your privacy
                  </div>
                </div>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="md:col-span-3 bg-[#121212] rounded-2xl p-6 md:p-8 space-y-5"
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#AFFF00] flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-[#121212]" />
                    </div>
                    <h3 className="text-xl font-black text-white">Message Sent!</h3>
                    <p className="text-white/60 font-mono text-sm mt-2 text-center">We'll get back to you within 24 hours. In the meantime, keep training.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-white/60">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#AFFF00] transition-colors placeholder:text-white/30"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-white/60">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#AFFF00] transition-colors placeholder:text-white/30"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-white/60">Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#AFFF00] transition-colors placeholder:text-white/30"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-white/60">Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#AFFF00] transition-colors placeholder:text-white/30 resize-none"
                        placeholder="Tell us what's on your mind..."
                        required
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submitting || !formData.name.trim() || !formData.email.trim() || !formData.message.trim()}
                        className="inline-flex items-center gap-2 bg-[#AFFF00] text-[#121212] px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-[#AFFF00]/30 transition-all disabled:opacity-50"
                      >
                        {submitting ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                          <><Send className="w-4 h-4" /> Send Message</>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </motion.form>
            </div>
          </div>
        </section>

        {/* Support CTA */}
        <section className="py-16 bg-[#AFFF00] noise-overlay">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tighter leading-[0.9] mb-4">
                Need help fast?
              </h2>
              <p className="text-[#121212]/70 font-mono text-sm max-w-md mx-auto mb-6">
                Check our help center for guides, FAQs, and troubleshooting tips.
              </p>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 bg-[#121212] text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform"
              >
                Visit Help Center <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


