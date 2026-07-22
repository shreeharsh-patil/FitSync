"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LogoMark from "./LogoMark";
import { Dumbbell, Flame, Activity, Sparkles } from "lucide-react";

export default function AuthVisualSignup() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-[#F8F8F3] relative overflow-hidden flex-col justify-between p-12 select-none border-r border-zinc-200/60">
      {/* Dynamic Grid Background (Charcoal dots matching landing page feel) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(18,18,18,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(18,18,18,0.025)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Radial Glow Animations */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full bg-[#AFFF00]/15 blur-[120px] -top-20 -right-20 pointer-events-none"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.6, 0.75, 0.6],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full bg-[#F97316]/8 blur-[100px] -bottom-20 -left-10 pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
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
      <div className="relative z-10 flex flex-col my-auto w-full max-w-md mx-auto gap-8">
        
        {/* Title and Intro */}
        <div className="text-left space-y-3">
          <motion.h2 
            className="font-[family-name:var(--font-display)] text-3xl font-black text-zinc-900 leading-tight tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Track what matters.<br />
            <span className="text-zinc-800 border-b-4 border-[#AFFF00] pb-0.5">See what works.</span>
          </motion.h2>
          <motion.p 
            className="text-sm text-zinc-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect your training, nutrition, and recovery data. Fitsync finds the patterns your body is telling you.
          </motion.p>
        </div>

        {/* Dashboard Preview Widgets Stacking */}
        <div className="relative w-full h-[280px] mt-2 select-none">
          
          {/* Card 1: Workout Stats (Left) */}
          <motion.div
            className="absolute top-0 left-0 w-[220px] backdrop-blur-xl bg-white/70 border border-zinc-200/85 rounded-xl p-4 shadow-2xl z-10"
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-[#AFFF00]/20 flex items-center justify-center text-zinc-800">
                  <Dumbbell className="h-3.5 w-3.5 text-zinc-700" />
                </div>
                <span className="text-xs font-bold text-zinc-900">Workouts</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">1.2h load</span>
            </div>
            
            <p className="text-xs text-zinc-500">Strength Training</p>
            <p className="text-lg font-black text-zinc-900 mt-0.5 tracking-tight font-[family-name:var(--font-display)]">4,850 kg</p>
            
            {/* Workout Volume bar */}
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                <span>Volume goal</span>
                <span className="text-zinc-800 font-bold">108%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#121212] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "88%" }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Nutrition Macros Breakdown (Right) */}
          <motion.div
            className="absolute top-8 right-0 w-[200px] backdrop-blur-xl bg-white/60 border border-zinc-200/80 rounded-xl p-4 shadow-2xl z-20"
            initial={{ opacity: 0, x: 30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Flame className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-zinc-900">Nutrition</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* SVG Ring */}
              <div className="relative h-12 w-12 shrink-0">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(18,18,18,0.04)" strokeWidth="3" />
                  {/* Protein Ring */}
                  <motion.circle 
                    cx="18" 
                    cy="18" 
                    r="15.915" 
                    fill="none" 
                    stroke="#121212" 
                    strokeWidth="3.2" 
                    strokeDasharray="45 100" 
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: "45 100" }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                  />
                  {/* Carbs Ring */}
                  <motion.circle 
                    cx="18" 
                    cy="18" 
                    r="15.915" 
                    fill="none" 
                    stroke="#F97316" 
                    strokeWidth="3.2" 
                    strokeDasharray="35 100" 
                    strokeDashoffset="80"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: "35 100" }}
                    transition={{ duration: 1.2, delay: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-zinc-900 font-mono">75%</span>
                </div>
              </div>
              
              <div className="min-w-0 font-mono text-[9px] text-zinc-500 space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                  <span>Protein: 145g</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                  <span>Carbs: 210g</span>
                </div>
                <p className="text-[10px] font-bold text-zinc-900 mt-1">2,150 kcal</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Recovery Trend (Bottom Left overlapping) */}
          <motion.div
            className="absolute bottom-2 left-10 w-[240px] backdrop-blur-xl bg-white/90 border border-zinc-200/80 rounded-xl p-4 shadow-2xl z-30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-[#AFFF00]/20 flex items-center justify-center text-zinc-900">
                  <Activity className="h-3.5 w-3.5 text-zinc-700" />
                </div>
                <span className="text-xs font-bold text-zinc-900">Recovery Profile</span>
              </div>
              <span className="text-[10px] text-zinc-700 font-bold font-mono">Optimal</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-500">Sleep Quality</p>
                <p className="text-base font-black text-zinc-900 font-[family-name:var(--font-display)]">88 / 100</p>
              </div>
              <div className="h-8 w-16 bg-zinc-50 border border-zinc-200 rounded flex items-center justify-center overflow-hidden">
                {/* SVG HRV wave */}
                <svg className="w-full h-6 px-1 text-zinc-900" viewBox="0 0 50 20" fill="none">
                  <motion.path 
                    d="M0 10 Q 5 2, 10 10 T 20 10 T 30 10 T 40 10 T 50 10" 
                    stroke="currentColor" 
                    strokeWidth="1.8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                  />
                </svg>
              </div>
            </div>

            {/* AI Notification inside widget */}
            <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-start gap-1.5 text-[9px] text-zinc-500">
              <Sparkles className="h-3 w-3 text-orange-500 shrink-0 mt-0.5" />
              <span>HRV up 12% following optimized active-recovery block.</span>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Footer Text */}
      <div className="relative z-10 text-xs text-zinc-500 flex justify-between items-center w-full">
        <span>© {new Date().getFullYear()} FitSync Inc.</span>
        <span>Secure authentication</span>
      </div>
    </div>
  );
}
