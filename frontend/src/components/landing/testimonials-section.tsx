"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    quote: "Fitsync completely changed how I train. The AI caught patterns I never noticed in my sleep and recovery data.",
    name: "Jamie Rivers",
    initials: "JR",
    role: "2-year member",
  },
  {
    quote: "I tried every fitness app out there. Fitsync is the only one that actually showed me what was working and what wasn't.",
    name: "Alex Chen",
    initials: "AC",
    role: "Beta tester",
  },
  {
    quote: "The unified dashboard is a game changer. No more switching between 4 different apps to see my data.",
    name: "Sam Torres",
    initials: "ST",
    role: "1-year member",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container-wide">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="caption mb-3 block text-accent">Testimonials</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Trusted by athletes
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-surface-1 border border-border p-7 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-1 w-6 bg-accent rounded-full" />
                ))}
              </div>
              <blockquote className="text-base leading-relaxed text-text-primary mb-6 font-[family-name:var(--font-display)] font-medium">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-3 flex items-center justify-center text-sm font-bold text-accent">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
