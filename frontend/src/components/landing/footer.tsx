"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import LogoMark from "@/components/LogoMark"

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative bg-surface-0 border-t border-border py-10">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <LogoMark size={18} />
              <span className="text-sm font-bold text-text-primary font-[family-name:var(--font-display)]">
                Fitsync
              </span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed max-w-[200px]">
              AI-powered fitness tracking, nutrition, and recovery — all in one place.
            </p>
          </motion.div>

          {footerLinks.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <h4 className="font-bold text-text-primary text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                      <Link
                        href={link.href}
                        className="text-text-muted hover:text-accent text-xs transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-border gap-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={14} />
            <span className="text-xs text-text-muted font-[family-name:var(--font-display)] font-bold">Fitsync</span>
          </div>
          <p className="text-xs text-text-muted/50">&copy; 2026 Fitsync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
