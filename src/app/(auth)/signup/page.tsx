"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      if (!res.ok) { setError(data.error || "Registration failed"); setIsLoading(false); return; }

      setSuccess("Account created! Signing you in...");
      const signInRes = await signIn("credentials", { email: email.toLowerCase(), password, redirect: false });
      if (signInRes?.error) { setError("Account created but login failed."); setIsLoading(false); router.push("/login"); return; }
      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-[-20vh] right-[-10vw] w-[50vw] h-[50vw] rounded-full bg-accent-coral/[0.015] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10vh] left-[-5vw] w-[30vw] h-[30vw] rounded-full bg-accent-coral/[0.01] blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative">
        <div className="border border-border rounded-2xl p-8 bg-bg-card shadow-lg shadow-black/[0.02]">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
            <LogoMark size={20} />
            <span className="text-base font-semibold text-text-primary group-hover:text-accent-coral transition-colors">Fitsync</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-text-primary mb-1">Create your account</h1>
            <p className="text-sm text-text-secondary">Join 500K+ athletes</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-accent-coral/5 border border-accent-coral/10 rounded-xl text-xs flex items-start gap-2 text-accent-coral">
              <AlertCircle className="h-4 w-4 shrink-0 mt-px" /><span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs flex items-start gap-2 text-emerald-600">
              <CheckCircle className="h-4 w-4 shrink-0 mt-px" /><span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-xs font-medium text-text-secondary mb-1.5 block">Full Name</label>
                <input className="input" id="name" name="name" type="text" placeholder="Alex Rivers" required disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="email" className="text-xs font-medium text-text-secondary mb-1.5 block">Email</label>
                <input className="input" id="email" name="email" type="email" placeholder="alex@fitsync.com" required disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="password" className="text-xs font-medium text-text-secondary mb-1.5 block">Password</label>
                <div className="relative">
                  <input className="input pr-10" id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" required disabled={isLoading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full h-11 bg-accent-coral text-white font-semibold text-sm rounded-full transition-all hover:bg-accent-coral/90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent-coral/10"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>Get Started Free <ArrowRight className="h-3.5 w-3.5" /></>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted font-medium">Or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-10 border border-border rounded-full text-xs font-medium text-text-secondary hover:text-text-primary hover:border-border-hover hover:bg-bg-secondary/50 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.34v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.12z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </motion.button>
            <motion.button type="button" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-10 border border-border rounded-full text-xs font-medium text-text-secondary hover:text-text-primary hover:border-border-hover hover:bg-bg-secondary/50 transition-all"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              GitHub
            </motion.button>
          </div>

          <p className="text-sm text-text-secondary text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent-coral hover:text-accent-coral/80 transition-colors">Sign in</Link>
          </p>
        </div>

        {/* Back link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            &larr; Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
