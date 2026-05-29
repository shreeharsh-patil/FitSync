"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"athlete" | "pro">("athlete");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Subtle mouse reactive parallax for the background glow (Athlete view)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (role !== "athlete") return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const spheres = document.querySelectorAll(".glow-sphere");
      spheres.forEach((sphere, index) => {
        const speed = (index + 1) * 20;
        (sphere as HTMLElement).style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [role]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email address or password. Please try again.");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Login submit error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#051424] text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden relative flex flex-col items-center justify-center p-4 md:p-0">
      
      {/* Top Floating Role Switcher */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex bg-surface-container-high/60 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-2xl">
        <button
          type="button"
          onClick={() => {
            setRole("athlete");
            setError("");
          }}
          className={`relative px-5 py-2 rounded-full font-label-md text-[11px] tracking-wider uppercase font-semibold transition-all duration-300 ${
            role === "athlete"
              ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(171,214,0,0.4)]"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Athlete Mode
        </button>
        <button
          type="button"
          onClick={() => {
            setRole("pro");
            setError("");
          }}
          className={`relative px-5 py-2 rounded-full font-label-md text-[11px] tracking-wider uppercase font-semibold transition-all duration-300 ${
            role === "pro"
              ? "bg-secondary-container text-on-secondary-container shadow-[0_0_15px_rgba(0,238,252,0.4)]"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Pro Mode
        </button>
      </div>

      <AnimatePresence mode="wait">
        {role === "athlete" ? (
          /* ================= ATHLETE LOGIN VIEW (HTML 1) ================= */
          <motion.div
            key="athlete"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full min-h-screen flex flex-col items-center justify-center relative z-10 px-container-padding py-xl"
          >
            {/* Background Layer for Athlete */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 kinetic-grid opacity-30"></div>
              <div className="absolute top-[-10%] right-[-10%] w-96 h-96 glow-sphere"></div>
              <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] glow-sphere opacity-50"></div>
            </div>

            <div className="w-full max-w-sm relative z-10 flex flex-col items-center space-y-lg">
              {/* Logo & Branding Section */}
              <header className="w-full flex flex-col items-center mb-base text-center">
                <div className="flex items-center gap-xs mb-md">
                  <div className="w-12 h-12 bg-primary-container flex items-center justify-center rounded-xl shadow-[0_0_30px_rgba(171,214,0,0.4)]">
                    <span className="material-symbols-outlined text-on-primary-container text-[32px] font-bold">fitness_center</span>
                  </div>
                  <h1 className="font-display-sm text-display-sm text-primary-fixed italic tracking-tighter">FitSync</h1>
                </div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">Welcome back, Athlete</h2>
                <p className="font-label-md text-label-md text-on-surface-variant">Your peak performance starts here.</p>
              </header>

              {error && (
                <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5 animate-pulse">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="w-full space-y-lg">
                <div className="space-y-md">
                  {/* Email Field */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-on-surface-variant px-1 uppercase tracking-widest" htmlFor="email">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-outline text-[20px]">mail</span>
                      </div>
                      <input
                        className="w-full h-14 bg-surface-container-low border border-white/10 rounded-xl pl-11 pr-md text-on-surface font-body-md focus:outline-none focus:border-secondary-container transition-all duration-300 placeholder:text-outline-variant"
                        id="email"
                        name="email"
                        placeholder="alex.rivers@performance.com"
                        type="email"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col gap-xs">
                    <div className="flex justify-between items-center px-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" htmlFor="password">Password</label>
                      <a className="font-label-sm text-label-sm text-secondary-container hover:text-secondary-fixed-dim transition-colors" href="#">Forgot Password?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                      </div>
                      <input
                        className="w-full h-14 bg-surface-container-low border border-white/10 rounded-xl pl-11 pr-12 text-on-surface font-body-md focus:outline-none focus:border-secondary-container transition-all duration-300 placeholder:text-outline-variant"
                        id="password"
                        name="password"
                        placeholder=""
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                      />
                      <button
                        className="absolute inset-y-0 right-0 pr-md flex items-center text-outline hover:text-on-surface-variant transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-primary-container text-on-primary-container font-headline-lg-mobile text-headline-lg-mobile rounded-xl shadow-[0_8px_20px_rgba(171,214,0,0.2)] hover:shadow-[0_8px_30px_rgba(171,214,0,0.4)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-sm cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <span className="material-symbols-outlined">bolt</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-md py-sm">
                  <div className="flex-grow h-px bg-white/10"></div>
                  <span className="font-label-sm text-label-sm text-outline-variant">OR CONTINUE WITH</span>
                  <div className="flex-grow h-px bg-white/10"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-md">
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="flex items-center justify-center gap-sm h-14 bg-surface-container-high border border-white/5 rounded-xl hover:bg-surface-variant transition-all active:scale-[0.95] cursor-pointer"
                  >
                    <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPb0vRi19aXl0VtZl3foWY0y7WGo0S7nQoVAPKvhzFz64-LGo_L88t5zk5m4cy-KUYSc_UGu8xG-4RG6Hmjem53qPhATZjJg--W3WlhL3p6tAe5cM0efkBxWwSpgDWxLZNh0j99NXYuBdyK8b4FtETs75kC0-si39K69S2OaEUSH22t0IQDeRKA_uo45MmZtKqHfGrgHwrBxm54BwXt1oA2eCYskGF_dYEn2p4cyg98s7Bc3JUrdIdBPpxcoDCQqvEv4jw5h1rcrUC" />
                    <span className="font-label-md text-label-md">Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => signIn("github", { callbackUrl: "/dashboard" })} // Fallback to GitHub instead of iOS
                    className="flex items-center justify-center gap-sm h-14 bg-surface-container-high border border-white/5 rounded-xl hover:bg-surface-variant transition-all active:scale-[0.95] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[24px]">ios</span>
                    <span className="font-label-md text-label-md">GitHub</span>
                  </button>
                </div>
              </form>

              {/* Footer / Redirect */}
              <footer className="w-full text-center pt-md">
                <p className="font-label-md text-label-md text-on-surface-variant">
                  New to FitSync? 
                  <Link className="text-primary-container font-bold hover:underline underline-offset-4 ml-1" href="/signup">
                    Create Account
                  </Link>
                </p>
              </footer>
            </div>
          </motion.div>
        ) : (
          /* ================= PRO MEMBER LOGIN VIEW (HTML 2) ================= */
          <motion.div
            key="pro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[1200px] h-auto md:h-[720px] flex overflow-hidden rounded-2xl shadow-2xl border border-white/5 relative z-10 bg-mesh"
          >
            {/* Left Side: Visual/Hero Section */}
            <div className="hidden md:flex flex-1 relative overflow-hidden">
              <img
                alt="High performance training"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH10kfcnCjyz1ANrDojoEV5rNZg6WILWcy-fyg6fdfYu6WXy6wR6sx5teXXIUXgbFQiNRRwJ-WWgeLfd5GOeLoUfsU5qFE2mr9OGI4pv8CJYX-YiTIZ0U46KDnTIb5cQ05qs5CwZXUjtxpvMeb5QAPycKJdudlAh2AMPVxwMonDm9TRw6XrNn1K-BhiiVFKZYv9PESbHbDBl2nyO3gsQS9ja2IEeAsdixksE5kCWo-oaSGiIY1SGonMkrSBcAiBa5QmvzTZON846Jn"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#051424]/90 via-[#051424]/40 to-transparent"></div>
              
              {/* Branding Overlay */}
              <div className="absolute bottom-xl left-xl max-w-sm z-10 text-left">
                <div className="flex items-center gap-xs mb-md">
                  <span className="material-symbols-outlined text-primary-fixed text-4xl">bolt</span>
                  <h1 className="font-display-sm text-display-sm text-primary italic tracking-tighter">FitSync</h1>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
                  Harness the power of data-driven performance. Log in to track your progress and sync your lifestyle.
                </p>
                <div className="flex gap-md">
                  <div className="flex flex-col">
                    <span className="font-stat-value text-stat-value text-primary-fixed">12.5k</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Active Pros</span>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="font-stat-value text-stat-value text-secondary-fixed-dim">98%</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Goal Success</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Login Form Canvas */}
            <div className="flex-1 bg-surface-container-low flex flex-col justify-center items-center px-lg md:px-xl relative py-xl md:py-0">
              
              {/* Mobile Branding (Hidden on Desktop) */}
              <div className="md:hidden flex items-center gap-xs mb-xl">
                <span className="material-symbols-outlined text-primary-fixed text-3xl">bolt</span>
                <h1 className="font-display-sm text-display-sm text-primary italic tracking-tighter">FitSync</h1>
              </div>

              <div className="w-full max-w-md">
                <div className="mb-xl text-center md:text-left">
                  <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Pro Member Login</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Enter your credentials to access your dashboard.</p>
                </div>

                {error && (
                  <div className="mb-md p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5 animate-pulse">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-lg text-left">
                  {/* Email Field */}
                  <div className="space-y-xs group">
                    <label className="font-label-md text-label-md text-on-surface-variant block ml-1" htmlFor="pro-email">Email Address</label>
                    <div className="relative neon-glow rounded-xl overflow-hidden border border-white/10 bg-background transition-all duration-300">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                      <input
                        className="w-full bg-transparent text-on-surface pl-12 pr-4 py-4 focus:ring-0 focus:outline-none placeholder:text-white/20 font-body-md text-body-md border-none"
                        id="pro-email"
                        name="email"
                        placeholder="alex.rivers@fitsync.pro"
                        type="email"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-xs group">
                    <label className="font-label-md text-label-md text-on-surface-variant block ml-1 flex justify-between" htmlFor="pro-password">
                      <span>Password</span>
                      <a className="text-secondary-fixed-dim hover:underline transition-all text-xs" href="#">Forgot Password?</a>
                    </label>
                    <div className="relative neon-glow rounded-xl overflow-hidden border border-white/10 bg-background transition-all duration-300">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                      <input
                        className="w-full bg-transparent text-on-surface pl-12 pr-12 py-4 focus:ring-0 focus:outline-none placeholder:text-white/20 font-body-md text-body-md border-none"
                        id="pro-password"
                        name="password"
                        placeholder=""
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                      />
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center gap-md">
                    <label className="relative flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" name="remember" />
                      <div className="w-5 h-5 bg-background border border-white/20 rounded peer-checked:bg-primary-container peer-checked:border-primary-container transition-all"></div>
                      <span className="material-symbols-outlined absolute left-0 text-on-primary text-[20px] opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                      <span className="ml-3 font-label-md text-label-md text-on-surface-variant">Remember me for 30 days</span>
                    </label>
                  </div>

                  {/* Action Button */}
                  <button
                    className="w-full electric-btn py-4 rounded-xl font-label-md text-label-md uppercase tracking-widest flex items-center justify-center gap-md cursor-pointer disabled:opacity-75"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#161e00]" />
                    ) : (
                      <>
                        Sign In
                        <span className="material-symbols-outlined">login</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Links */}
                <div className="mt-xl text-center">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Don't have a Pro account? 
                    <Link className="text-primary-fixed font-semibold hover:underline decoration-primary-fixed decoration-2 underline-offset-4 ml-1" href="/signup">
                      Create Account
                    </Link>
                  </p>
                </div>

                {/* Terms/Legal */}
                <div className="mt-lg pt-lg border-t border-white/5 flex justify-center gap-lg">
                  <a className="font-label-sm text-label-sm text-white/30 hover:text-on-surface-variant transition-colors" href="#">Terms of Service</a>
                  <a className="font-label-sm text-label-sm text-white/30 hover:text-on-surface-variant transition-colors" href="#">Privacy Policy</a>
                </div>
              </div>

              {/* Atmospheric Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed-dim/5 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-fixed/5 blur-[120px] rounded-full pointer-events-none"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
