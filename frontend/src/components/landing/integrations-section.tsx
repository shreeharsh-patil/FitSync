"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"

const integrations = ["Apple Health", "Fitbit", "Strava", "Garmin", "Whoop", "Google Fit"]

export function IntegrationsSection() {
  return (
    <section className="py-10 border-y border-border">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.p
            className="text-xs text-text-muted font-semibold uppercase tracking-widest shrink-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Syncs with
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {integrations.map((name, i) => (
              <motion.div
                key={name}
                className="flex items-center gap-2 text-text-muted/60 hover:text-text-muted transition-colors"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Activity className="h-3 w-3" />
                <span className="text-sm font-medium">{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
