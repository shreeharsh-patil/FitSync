"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, Loader2, AlertCircle, Sparkles, CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"athlete" | "pro">("athlete");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      setSuccess("Account created! Signing you in...");

      // Auto sign-in after registration
      const signInRes = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created but login failed. Please sign in.");
        setIsLoading(false);
        router.push("/login");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
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
            <h2 className="text-3xl font-bold font-heading text-white mb-1">{role === "athlete" ? "Create Account" : "Pro Registration"}</h2>
            <p className="text-muted-foreground text-sm">{role === "athlete" ? "Join 500K+ athletes syncing their life." : "Unlock premium tools for your fitness business."}</p>
          </header>

          {error && (
            <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error}</span>
            </div>
          )}

          {success && (
            <div className="w-full p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl text-xs flex items-start gap-2.5">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Full Name</label>
                <div className="relative group">
                  <input className="w-full h-13 bg-surface-container-low border border-white/10 rounded-xl px-4 text-foreground text-sm focus:outline-none focus:border-secondary transition-all neon-glow"
                    name="name" type="text" placeholder="Alex Rivers" required disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Email Address</label>
                <div className="relative group">
                  <input className="w-full h-13 bg-surface-container-low border border-white/10 rounded-xl px-4 text-foreground text-sm focus:outline-none focus:border-secondary transition-all neon-glow"
                    name="email" type="email" placeholder="alex@fitsync.com" required disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Password</label>
                <div className="relative group">
                  <input className="w-full h-13 bg-surface-container-low border border-white/10 rounded-xl px-4 text-foreground text-sm focus:outline-none focus:border-secondary transition-all neon-glow"
                    name="password" type="password" placeholder="Min. 6 characters" required disabled={isLoading} />
                </div>
              </div>
            </div>

            <motion.button type="submit" disabled={isLoading}
              className={`w-full h-13 font-bold text-base rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group ${
                role === "athlete" ? "bg-secondary text-primary shadow-lg shadow-secondary/20" : "bg-accent text-white shadow-lg shadow-accent/20"}`}>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{role === "athlete" ? "Get Started Free" : "Start Pro Trial"} <Sparkles className="h-4 w-4" /></>}
              </span>
            </motion.button>
          </form>

          <div className="w-full flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button type="button" disabled className="flex items-center justify-center gap-2 h-13 bg-surface-container-high border border-white/5 rounded-xl opacity-50 cursor-not-allowed text-sm font-bold">
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.34v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.12z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button type="button" disabled className="flex items-center justify-center gap-2 h-13 bg-surface-container-high border border-white/5 rounded-xl opacity-50 cursor-not-allowed text-sm font-bold">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              GitHub
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-secondary font-bold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
