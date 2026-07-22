"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LogoMark from "./LogoMark";
import { TrendingUp, Activity, Check, Sparkles } from "lucide-react";

export default function AuthVisualLogin() {
  // SVG Chart path parameters
  // Coordinates for 6 weeks: 140kg, 140kg, 144kg, 148kg, 150kg, 155kg
  const chartPath = "M 20 80 L 70 80 L 120 65 L 170 50 L 220 40 L 270 15";
  const areaPath = "M 20 80 L 70 80 L 120 65 L 170 50 L 220 40 L 270 15 L 270 110 L 20 110 Z";

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-[#F8F8F3] relative overflow-hidden flex-col justify-between p-12 select-none border-r border-zinc-200/60">
      {/* Dynamic Grid Background (Charcoal dots matching landing page feel) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(18,18,18,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(18,18,18,0.025)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Radial Glow Animations */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full bg-[#AFFF00]/15 blur-[120px] -top-20 -right-20 pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full bg-orange-500/8 blur-[100px] -bottom-20 -left-10 pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Header Logo */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center group">
          <span className="text-lg font-black tracking-tighter text-[#121212] font-[family-name:var(--font-display)]">
            Fit<span className="text-accent">Sync</span>
          </span>
        </Link>
      </div>

      {/* Main Interactive Dashboard Mockup Area */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-md mx-auto gap-6">
        
        {/* Widget 1: Deadlift 1RM Progress (Glowing Card) */}
        <motion.div
          className="w-full backdrop-blur-xl bg-white/70 border border-zinc-200/80 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Accent Top Edge Line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#AFFF00]/50 to-transparent" />
          
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Performance Trend</p>
              <h3 className="text-base font-bold text-zinc-900 mt-0.5">Deadlift 1RM</h3>
            </div>
            <div className="flex items-center gap-1 bg-[#AFFF00]/20 border border-[#AFFF00]/30 px-2 py-0.5 rounded-full text-[10px] font-bold text-zinc-900 font-mono">
              <TrendingUp className="h-3 w-3 text-zinc-700" />
              <span>+15kg</span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="text-3xl font-black text-zinc-900 tracking-tight font-[family-name:var(--font-display)]">155</span>
            <span className="text-sm font-semibold text-zinc-500">kg</span>
            <span className="text-xs text-zinc-400 ml-1">vs 140kg initial</span>
          </div>

          {/* SVG Progress Line Chart */}
          <div className="relative h-28 w-full select-none">
            <svg viewBox="0 0 290 110" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#AFFF00" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#AFFF00" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="80" x2="270" y2="80" stroke="rgba(18,18,18,0.03)" strokeDasharray="3,3" />
              <line x1="20" y1="50" x2="270" y2="50" stroke="rgba(18,18,18,0.03)" strokeDasharray="3,3" />
              <line x1="20" y1="15" x2="270" y2="15" stroke="rgba(18,18,18,0.03)" strokeDasharray="3,3" />

              {/* Area Gradient under curve */}
              <motion.path
                d={areaPath}
                fill="url(#chartGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Glowing Line (Sleek charcoal line with a shadow for maximum legibility on light background) */}
              <motion.path
                d={chartPath}
                fill="none"
                stroke="#121212"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />

              {/* Data Dots */}
              {[
                { x: 20, y: 80 },
                { x: 70, y: 80 },
                { x: 120, y: 65 },
                { x: 170, y: 50 },
                { x: 220, y: 40 },
                { x: 270, y: 15 }
              ].map((pt, idx) => (
                <g key={idx}>
                  <motion.circle
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === 6 - 1 ? "5.5" : "3"}
                    className={idx === 6 - 1 ? "fill-[#AFFF00] stroke-zinc-900 stroke-2" : "fill-[#AFFF00] stroke-zinc-900 stroke-[1.5px]"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.15 + 0.5, type: "spring", stiffness: 200 }}
                  />
                  {idx === 6 - 1 && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      className="fill-none stroke-[#AFFF00]/60 stroke-1 animate-ping"
                    />
                  )}
                </g>
              ))}

              {/* X Axis Labels */}
              <text x="20" y="102" fill="#71717a" fontSize="9" textAnchor="middle" className="font-mono font-medium">W1</text>
              <text x="120" y="102" fill="#71717a" fontSize="9" textAnchor="middle" className="font-mono font-medium">W3</text>
              <text x="270" y="102" fill="#71717a" fontSize="9" textAnchor="middle" className="font-mono font-medium">W6</text>
            </svg>
          </div>
        </motion.div>

        {/* Widget 2: Testimonial Quote (Jamie Rivers) */}
        <motion.div
          className="w-full backdrop-blur-xl bg-white/60 border border-zinc-200/80 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Custom rating indicators in accent color */}
          <div className="flex gap-1 mb-3.5">
            {[...Array(5)].map((_, idx) => (
              <span key={idx} className="h-1 w-6 rounded-full bg-zinc-900" />
            ))}
          </div>

          <blockquote className="font-[family-name:var(--font-display)] text-lg md:text-xl font-bold leading-snug text-zinc-900 mb-4">
            &ldquo;Fitsync caught a recovery pattern I missed for months. My deadlift jumped 15kg in 6 weeks.&rdquo;
          </blockquote>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#AFFF00] to-orange-500 p-[1.5px] flex items-center justify-center">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-black text-zinc-900">
                JR
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-zinc-900">Jamie Rivers</p>
                <div className="h-3.5 w-3.5 rounded-full bg-[#AFFF00]/20 border border-[#AFFF00]/40 flex items-center justify-center text-[8px] text-zinc-700">
                  <Check className="h-2.5 w-2.5 stroke-[3px]" />
                </div>
              </div>
              <p className="text-xs text-zinc-500">2-year member</p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer Text */}
      <div className="relative z-10 text-xs text-zinc-500 flex justify-between items-center w-full">
        <span>© {new Date().getFullYear()} FitSync Inc.</span>
        <span>Secure authentication</span>
      </div>
    </div>
  );
}
