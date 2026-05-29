import React, { useState } from "react";
import { Activity, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage({ onViewChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate registration validation
    setTimeout(() => {
      if (name.trim().split(" ").length < 2) {
        setError("Please enter your full name (First and Last name).");
        setIsLoading(false);
      } else if (!email.includes("@")) {
        setError("Invalid email address format.");
        setIsLoading(false);
      } else if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        onViewChange("app"); // Logged in and registered!
      }
    }, 1200);
  };

  const handleSocialRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onViewChange("app");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface p-4 relative overflow-hidden text-on-surface">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-fixed/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-container/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md glass-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 p-8 space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <button
            onClick={() => onViewChange("landing")}
            className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-fixed to-secondary-container p-[1px] cursor-pointer bg-transparent border-none"
          >
            <div className="h-full w-full rounded-2xl bg-surface flex items-center justify-center text-primary-fixed">
              <Activity className="h-10 w-10" />
            </div>
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-display-sm tracking-tight text-white">
              Create Account
            </h1>
            <p className="text-on-surface-variant text-sm font-medium">
              Join the 500K+ athletes syncing their life.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5 animate-pulse">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 pl-10 bg-surface-container border border-white/10 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all placeholder:text-outline-variant"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 bg-surface-container border border-white/10 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all placeholder:text-outline-variant"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
              <input
                name="password"
                type="password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-10 bg-surface-container border border-white/10 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all placeholder:text-outline-variant"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary-fixed hover:bg-white text-on-primary-fixed font-bold text-base shadow-lg shadow-primary-fixed/20 transition-all active:scale-[0.98] rounded-xl flex items-center justify-center gap-2 glow-lime cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Get Started Free"
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface-container px-2.5 text-on-surface-variant font-bold tracking-wider text-[10px]">
              Or sign up with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSocialRegister}
            className="w-full h-12 flex items-center justify-center gap-2 border border-white/5 bg-surface-container hover:bg-white/5 transition-all rounded-xl cursor-pointer text-white font-bold text-xs uppercase tracking-widest"
          >
            <img className="h-5 w-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPb0vRi19aXl0VtZl3foWY0y7WGo0S7nQoVAPKvhzFz64-LGo_L88t5zk5m4cy-KUYSc_UGu8xG-4RG6Hmjem53qPhATZjJg--W3WlhL3p6tAe5cM0efkBxWwSpgDWxLZNh0j99NXYuBdyK8b4FtETs75kC0-si39K69S2OaEUSH22t0IQDeRKA_uo45MmZtKqHfGrgHwrBxm54BwXt1oA2eCYskGF_dYEn2p4cyg98s7Bc3JUrdIdBPpxcoDCQqvEv4jw5h1rcrUC" alt="Google Logo" />
            Google
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSocialRegister}
            className="w-full h-12 flex items-center justify-center gap-2 border border-white/5 bg-surface-container hover:bg-white/5 transition-all rounded-xl cursor-pointer text-white font-bold text-xs uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[20px]">ios</span>
            Apple
          </button>
        </div>

        <footer className="text-center">
          <p className="text-xs text-on-surface-variant font-medium">
            Already have an account?{" "}
            <button
              onClick={() => onViewChange("login")}
              className="text-primary-fixed font-bold hover:underline underline-offset-4 ml-1 bg-transparent border-none cursor-pointer"
            >
              Login
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
}
