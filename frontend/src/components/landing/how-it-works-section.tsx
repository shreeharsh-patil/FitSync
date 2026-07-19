"use client"

import { motion } from "framer-motion"
import { Smartphone, BarChart3, Target } from "lucide-react"

const steps = [
  {
    step: "1",
    title: "Connect",
    desc: "Sync your wearables, log your meals, and track your workouts. We pull data from 6+ platforms automatically.",
    icon: Smartphone,
  },
  {
    step: "2",
    title: "Analyze",
    desc: "Our engine correlates your sleep, recovery, nutrition, and training intensity to find what works for your body.",
    icon: BarChart3,
  },
  {
    step: "3",
    title: "Optimize",
    desc: "Get workout splits, meal targets, and recovery protocols that evolve with you over time.",
    icon: Target,
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-border">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="caption mb-3 block text-accent">How it works</span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold tracking-tight leading-[1.05] text-text-primary">
              Connect. Analyze. Optimize.
            </h2>
          </motion.div>

          <div className="lg:col-span-8 space-y-px">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                className="bg-surface-1 border border-border p-7 md:p-8 flex gap-6"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <div className="shrink-0">
                  <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-surface-4 leading-none">
                    {item.step}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="h-4 w-4 text-accent" />
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
