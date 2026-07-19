"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"

const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
}

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y = useSpring(rawY, springConfig)

  const rawTextX1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const textX1 = useSpring(rawTextX1, springConfig)

  const rawTextX2 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const textX2 = useSpring(rawTextX2, springConfig)

  const rawOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const opacity = useSpring(rawOpacity, springConfig)

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface-0 noise-overlay"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-surface-0 via-accent/[0.04] to-surface-0" />

      <motion.div
        className="absolute top-20 left-10 w-24 h-24 rounded-full bg-accent/20 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-accent/10 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative z-10 container-wide pt-24 pb-12">
        <div className="max-w-3xl">
          <motion.div style={{ opacity }} className="space-y-6">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 bg-surface-2 border border-border px-3 py-1.5 rounded-full"
            >
              <motion.span
                className="w-2 h-2 bg-success rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <span className="text-xs font-medium text-text-secondary font-[family-name:var(--font-mono)] tracking-wider">
                PUBLIC BETA — FREE FOR NOW
              </span>
            </motion.div>

            <div className="space-y-1 overflow-hidden">
              <motion.h1
                style={{ x: textX1 }}
                className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-bold tracking-[-0.03em] text-text-primary leading-[0.95]"
              >
                <motion.span
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  className="inline-block"
                >
                  STOP GUESSING.
                </motion.span>
              </motion.h1>
              <motion.h1
                style={{ x: textX2 }}
                className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-bold tracking-[-0.03em] text-text-primary leading-[0.95]"
              >
                <motion.span
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="inline-block text-accent"
                >
                  START TRAINING.
                </motion.span>
              </motion.h1>
              <motion.p
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                className="text-lg text-text-secondary leading-relaxed pt-2 max-w-lg"
              >
                AI-powered fitness that connects your workouts, nutrition, and recovery — then shows you what actually moves the needle.
              </motion.p>
            </div>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Link
                href="/signup"
                className="btn-primary px-6 py-3 text-sm group inline-flex items-center justify-center gap-2 font-semibold rounded-lg"
              >
                Start free trial
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/features"
                className="btn-secondary px-6 py-3 text-sm inline-flex items-center justify-center gap-2 font-medium rounded-lg"
              >
                See features
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex flex-wrap gap-4 pt-2"
            >
              {["AI Coaching", "Deep Analytics", "Unified Sync", "Gamification"].map((benefit, i) => (
                <motion.div
                  key={benefit}
                  className="flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] text-text-muted"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                  {benefit}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex items-center gap-8 text-sm pt-4"
            >
              <div>
                <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">6</span>
                <span className="text-text-muted ml-1.5">platforms</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div>
                <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">14</span>
                <span className="text-text-muted ml-1.5">day free trial</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div>
                <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">0</span>
                <span className="text-text-muted ml-1.5">credit card</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <div className="w-5 h-8 border-2 border-text-muted/30 rounded-full flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-2 bg-text-muted/30 rounded-full"
              animate={{ y: [0, 6, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
