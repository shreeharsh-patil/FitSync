"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Shield, ArrowLeft, KeyRound } from "lucide-react";
import { verifyTwoFactorLogin } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Verify2FAPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backward" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = code.join("");
    if (token.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (!session?.user?.id) {
      setError("Session not found. Please sign in again.");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await verifyTwoFactorLogin(session.user.id, token);
    if (res.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(res.error || "Invalid code");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#051424] text-on-surface font-body-md flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 kinetic-grid opacity-30"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 glow-sphere"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] glow-sphere opacity-50"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-surface-container-low border border-white/10 rounded-[2.5rem] p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary-container/10 rounded-2xl flex items-center justify-center mx-auto border border-secondary-container/20">
              <Shield className="h-8 w-8 text-secondary-container" />
            </div>
            <div className="space-y-1">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                Two-Factor Auth
              </h1>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5">
              <KeyRound className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 bg-surface-container border border-white/10 rounded-xl text-center text-on-surface font-headline-lg-mobile text-2xl focus:outline-none focus:border-secondary-container transition-all"
                  disabled={isLoading}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary-container text-on-primary-container font-headline-lg-mobile text-headline-lg-mobile rounded-xl shadow-[0_8px_20px_rgba(171,214,0,0.2)] hover:shadow-[0_8px_30px_rgba(171,214,0,0.4)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-sm cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Verify
                  <span className="material-symbols-outlined">verified</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
