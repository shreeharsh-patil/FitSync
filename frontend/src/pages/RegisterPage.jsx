import React, { useState } from "react";
import { Activity, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage({ onViewChange, onRegisterSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (name.trim().split(" ").length < 2) {
      setError("Please enter your full name (First and Last name).");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }
      setIsLoading(false);
      onRegisterSuccess(data.user);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "alex@fitsync.com", password: "password123" })
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        onRegisterSuccess(data.user);
        return;
      }

      const regResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Alex Rivers", email: "alex@fitsync.com", password: "password123" })
      });
      const regData = await regResponse.json();
      if (!regResponse.ok) {
        throw new Error(regData.error || "Social registration failed.");
      }
      setIsLoading(false);
      onRegisterSuccess(regData.user);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
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
            Google
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSocialRegister}
            className="w-full h-12 flex items-center justify-center gap-2 border border-white/5 bg-surface-container hover:bg-white/5 transition-all rounded-xl cursor-pointer text-white font-bold text-xs uppercase tracking-widest"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.96.96.08 2.19-.52 2.84-1.35Z" />
            </svg>
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
