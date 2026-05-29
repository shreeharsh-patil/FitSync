import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage({ onViewChange }) {
  const [role, setRole] = useState("athlete");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Mouse reactive parallax for background glow spheres (Athlete view)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (role !== "athlete") return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      const spheres = document.querySelectorAll(".glow-sphere");
      spheres.forEach((sphere, index) => {
        const speed = (index + 1) * 20;
        sphere.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login validation
    setTimeout(() => {
      if (!email.includes("@")) {
        setError("Invalid email address format. Please try again.");
        setIsLoading(false);
      } else if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        onViewChange("app"); // Logged in!
      }
    }, 1200);
  };

  const handleSocialLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onViewChange("app"); // Logged in!
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden relative flex flex-col items-center justify-center p-4 md:p-0">
      {/* Top Floating Role Switcher */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex bg-surface-container-high/60 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-2xl">
        <button
          type="button"
          onClick={() => {
            setRole("athlete");
            setError("");
          }}
          className={`relative px-5 py-2 rounded-full font-semibold transition-all duration-300 text-xs tracking-wider uppercase cursor-pointer ${
            role === "athlete"
              ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(195,244,0,0.3)]"
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
          className={`relative px-5 py-2 rounded-full font-semibold transition-all duration-300 text-xs tracking-wider uppercase cursor-pointer ${
            role === "pro"
              ? "bg-secondary-container text-on-secondary-container shadow-[0_0_15px_rgba(0,238,252,0.3)]"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Pro Mode
        </button>
      </div>

      <AnimatePresence mode="wait">
        {role === "athlete" ? (
          /* ================= ATHLETE LOGIN VIEW ================= */
          <motion.div
            key="athlete"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-8"
          >
            {/* Background Layer for Athlete */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[10%] right-[10%] w-96 h-96 rounded-full bg-primary-fixed/5 blur-[80px] glow-sphere"></div>
              <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-secondary-container/5 blur-[100px] glow-sphere opacity-50"></div>
            </div>

            <div className="w-full max-w-sm relative z-10 flex flex-col items-center space-y-6">
              {/* Logo & Branding Section */}
              <header className="w-full flex flex-col items-center text-center">
                <button
                  onClick={() => onViewChange("landing")}
                  className="flex items-center gap-2 mb-4 bg-transparent border-none cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary-container flex items-center justify-center rounded-xl shadow-[0_0_30px_rgba(195,244,0,0.3)]">
                    <span className="material-symbols-outlined text-on-primary-container text-[32px] font-bold">fitness_center</span>
                  </div>
                  <h1 className="font-display-sm text-display-sm text-primary-fixed italic tracking-tighter">FitSync</h1>
                </button>
                <h2 className="text-xl font-bold text-white">Welcome back, Athlete</h2>
                <p className="text-xs text-on-surface-variant font-medium">Your peak performance starts here.</p>
              </header>

              {error && (
                <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5 animate-pulse">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div className="space-y-4">
                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant px-1 uppercase tracking-widest" htmlFor="email">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-outline text-[20px]">mail</span>
                      </div>
                      <input
                        className="w-full h-14 bg-surface-container-low border border-white/10 rounded-xl pl-11 pr-4 text-on-surface font-body-md focus:outline-none focus:border-primary-fixed transition-all duration-300 placeholder:text-outline-variant"
                        id="email"
                        type="email"
                        placeholder="alex.rivers@fitsync.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="password">Password</label>
                      <a className="text-[10px] font-semibold text-primary-fixed hover:text-white transition-colors" href="#">Forgot Password?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                      </div>
                      <input
                        className="w-full h-14 bg-surface-container-low border border-white/10 rounded-xl pl-11 pr-12 text-on-surface font-body-md focus:outline-none focus:border-primary-fixed transition-all duration-300 placeholder:text-outline-variant"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <button
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface-variant transition-colors bg-transparent border-none cursor-pointer"
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
                  className="w-full h-14 bg-primary-fixed text-on-primary-fixed font-bold rounded-xl shadow-[0_8px_20px_rgba(195,244,0,0.2)] hover:bg-white hover:shadow-[0_8px_30px_rgba(195,244,0,0.4)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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
                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-grow h-px bg-white/10"></div>
                  <span className="text-[10px] font-bold text-outline-variant uppercase tracking-wider">OR CONTINUE WITH</span>
                  <div className="flex-grow h-px bg-white/10"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleSocialLogin}
                    className="flex items-center justify-center gap-2 h-14 bg-surface-container-high border border-white/5 rounded-xl hover:bg-white/5 transition-all active:scale-[0.95] cursor-pointer text-white font-semibold text-xs uppercase tracking-widest"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.34v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.12z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSocialLogin}
                    className="flex items-center justify-center gap-2 h-14 bg-surface-container-high border border-white/5 rounded-xl hover:bg-white/5 transition-all active:scale-[0.95] cursor-pointer text-white font-semibold text-xs uppercase tracking-widest"
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.96.96.08 2.19-.52 2.84-1.35Z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
              </form>

              {/* Footer / Redirect */}
              <footer className="w-full text-center pt-4">
                <p className="text-xs text-on-surface-variant font-medium">
                  New to FitSync? 
                  <button
                    onClick={() => onViewChange("register")}
                    className="text-primary-fixed font-bold hover:underline underline-offset-4 ml-1 bg-transparent border-none cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </footer>
            </div>
          </motion.div>
        ) : (
          /* ================= PRO MEMBER LOGIN VIEW ================= */
          <motion.div
            key="pro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[1000px] h-auto md:h-[650px] flex overflow-hidden rounded-2xl shadow-2xl border border-white/5 relative z-10 bg-surface-container-low"
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
              <div className="absolute bottom-10 left-10 max-w-sm z-10 text-left">
                <button
                  onClick={() => onViewChange("landing")}
                  className="flex items-center gap-2 mb-4 bg-transparent border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary-container text-4xl">bolt</span>
                  <h1 className="font-display-sm text-display-sm text-white italic tracking-tighter">FitSync</h1>
                </button>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Harness the power of data-driven performance. Log in to track your progress and sync your lifestyle.
                </p>
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-secondary-container">12.5k</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Pros</span>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-secondary-container">98%</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Goal Success</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Login Form Canvas */}
            <div className="flex-1 bg-surface-container/60 backdrop-blur-md flex flex-col justify-center items-center px-8 md:px-12 relative py-12 md:py-0">
              {/* Mobile Branding (Hidden on Desktop) */}
              <div className="md:hidden flex items-center gap-2 mb-8">
                <span className="material-symbols-outlined text-secondary-container text-3xl">bolt</span>
                <h1 className="font-display-sm text-display-sm text-white italic tracking-tighter">FitSync</h1>
              </div>

              <div className="w-full max-w-sm">
                <header className="mb-6">
                  <h2 className="text-xl font-bold text-white">Pro Console Login</h2>
                  <p className="text-xs text-on-surface-variant font-medium">Access client dashboards and protocols.</p>
                </header>

                {error && (
                  <div className="w-full p-4 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5 animate-pulse">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant px-1 uppercase tracking-widest" htmlFor="pro-email">Pro Email</label>
                    <input
                      className="w-full h-12 bg-surface-container-low border border-white/10 rounded-xl px-4 text-on-surface font-body-md focus:outline-none focus:border-secondary-container transition-all duration-300 placeholder:text-outline-variant"
                      id="pro-email"
                      type="email"
                      placeholder="trainer@fitsync.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="pro-password">Security Password</label>
                      <a className="text-[10px] font-semibold text-secondary-container hover:text-white transition-colors" href="#">Reset Key?</a>
                    </div>
                    <input
                      className="w-full h-12 bg-surface-container-low border border-white/10 rounded-xl px-4 text-on-surface font-body-md focus:outline-none focus:border-secondary-container transition-all duration-300 placeholder:text-outline-variant"
                      id="pro-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-secondary-container text-on-secondary-container font-bold rounded-xl shadow-[0_8px_20px_rgba(0,238,252,0.2)] hover:bg-white hover:text-primary hover:shadow-[0_8px_30px_rgba(0,238,252,0.4)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Launch Console
                        <span className="material-symbols-outlined">analytics</span>
                      </>
                    )}
                  </button>
                </form>

                <footer className="w-full text-center pt-6">
                  <p className="text-xs text-on-surface-variant font-medium">
                    Not a certified Pro? 
                    <button
                      onClick={() => {
                        setRole("athlete");
                        setError("");
                      }}
                      className="text-secondary-container font-bold hover:underline underline-offset-4 ml-1 bg-transparent border-none cursor-pointer"
                    >
                      Use Athlete Console
                    </button>
                  </p>
                </footer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
