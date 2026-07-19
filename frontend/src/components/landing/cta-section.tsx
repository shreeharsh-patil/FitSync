"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 md:py-32 border-t border-border relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50vw] h-[30vw] bg-accent/[0.04] rounded-full blur-[150px]" />
      </div>
      <div className="container-wide relative">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] text-text-primary mb-5">
            Start training smarter.
            <br />
            Today.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-10 max-w-md mx-auto">
            14-day free trial. No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="btn-primary px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2 rounded-lg"
            >
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="btn-secondary px-8 py-3.5 text-sm font-medium rounded-lg">
              View plans
            </Link>
          </div>
          <div className="flex items-center justify-center gap-5 mt-8 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-accent" /> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-accent" /> Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-accent" /> Full access
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
