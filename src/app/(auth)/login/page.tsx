"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { Activity, Zap, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<"athlete" | "pro">("athlete");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const res = await signIn("credentials", { email: email.toLowerCase(), password, redirect: false });
      if (res?.error) { setError("Invalid email or password."); setIsLoading(false); }
      else { window.location.href = "/dashboard"; }
    } catch { setError("An unexpected error occurred. Make sure MongoDB is running."); setIsLoading(false); }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex bg-white/5 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-2xl">
        <button onClick={() => { setRole("athlete"); setError(""); }}
          className={`relative px-5 py-2 rounded-full text-[11px] tracking-wider uppercase font-semibold transition-all duration-300 ${
            role === "athlete" ? "bg-secondary/20 text-secondary shadow-[0_0_15px_rgba(0,201,167,0.3)]" : "text-muted-foreground hover:text-white"}`}>
          Athlete Mode
        </button>
        <button onClick={() => { setRole("pro"); setError(""); }}
          className={`relative px-5 py-2 rounded-full text-[11px] tracking-wider uppercase font-semibold transition-all duration-300 ${
            role === "pro" ? "bg-accent/20 text-accent shadow-[0_0_15px_rgba(255,107,53,0.3)]" : "text-muted-foreground hover:text-white"}`}>
          Pro Mode
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={role} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }}
          className="w-full max-w-sm relative z-10 flex flex-col items-center space-y-8">
          <header className="w-full flex flex-col items-center text-center">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }}
              className={`h-16 w-16 rounded-2xl bg-gradient-to-br p-[1px] mb-4 ${role === "athlete" ? "from-secondary to-primary" : "from-accent to-primary"}`}>
              <div className={`h-full w-full rounded-2xl bg-background flex items-center justify-center ${role === "athlete" ? "text-secondary" : "text-accent"}`}>
                {role === "athlete" ? <Activity className="h-10 w-10" /> : <Zap className="h-10 w-10" />}
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold font-heading text-white mb-1">{role === "athlete" ? "Welcome back, Athlete" : "Pro Member Login"}</h2>
            <p className="text-muted-foreground text-sm">{role === "athlete" ? "Your peak performance starts here." : "Enter your credentials to access your dashboard."}</p>
          </header>

          {error && (
            <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5 animate-pulse">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <input className="w-full h-14 bg-surface-container-low border border-white/10 rounded-xl pl-11 pr-4 text-foreground text-sm focus:outline-none focus:border-secondary transition-all duration-300 placeholder:text-muted-foreground/40 neon-glow"
                    id="email" name="email" placeholder="alex@fitsync.com" type="email" required disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                  <button type="button" className="text-[10px] font-bold text-secondary hover:text-secondary/80 transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input className="w-full h-14 bg-surface-container-low border border-white/10 rounded-xl pl-11 pr-12 text-foreground text-sm focus:outline-none focus:border-secondary transition-all duration-300 placeholder:text-muted-foreground/40 neon-glow"
                    id="password" name="password" type={showPassword ? "text" : "password"} required disabled={isLoading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className={`w-full h-14 font-bold text-base rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group ${
                role === "athlete" ? "bg-secondary text-primary shadow-lg shadow-secondary/20 hover:shadow-secondary/30" : "bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/30"}`}>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign In <Zap className="h-4 w-4" /></>}
              </span>
            </button>
          </form>

          <p className="text-sm text-muted-foreground">
            New to FitSync? <Link href="/signup" className="text-secondary font-bold hover:underline">Create Account</Link>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
