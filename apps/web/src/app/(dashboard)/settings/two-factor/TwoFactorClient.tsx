"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  KeyRound,
  Copy,
  Download,
  CheckCircle2,
  Loader2,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  Smartphone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  setupTwoFactor,
  verifyTwoFactorToken,
  disableTwoFactor,
  sendVerificationEmailAction,
} from "@/lib/actions";

interface TwoFactorClientProps {
  userId: string;
  email: string;
  twoFactorEnabled: boolean;
  hasPassword: boolean;
}

export function TwoFactorClient({
  userId,
  email,
  twoFactorEnabled: initialEnabled,
  hasPassword,
}: TwoFactorClientProps) {
  const router = useRouter();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialEnabled);
  const [step, setStep] = useState<"idle" | "setup" | "verify" | "backup" | "disable">(
    initialEnabled ? "idle" : "idle"
  );
  const [secret, setSecret] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [uri, setUri] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    const res = await setupTwoFactor(userId);
    if (res.error) {
      setError(res.error);
      setIsLoading(false);
      return;
    }

    setSecret(res.secret!);
    setQrUrl(res.qrUrl!);
    setUri(res.uri!);
    setBackupCodes(res.backupCodes!);
    setStep("verify");
    setIsLoading(false);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await verifyTwoFactorToken(userId, verificationCode);
    if (res.success) {
      setTwoFactorEnabled(true);
      setStep("backup");
      setSuccess(res.success);
    } else {
      setError(res.error || "Invalid code");
    }
    setIsLoading(false);
  };

  const handleDisable = async () => {
    if (!password && hasPassword) {
      setError("Password is required to disable 2FA");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await disableTwoFactor(userId, password);
    if (res.success) {
      setTwoFactorEnabled(false);
      setStep("idle");
      setPassword("");
      setSecret("");
      setQrUrl("");
      setUri("");
      setBackupCodes([]);
      setVerificationCode("");
      setSuccess("Two-factor authentication disabled");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(res.error || "Failed to disable 2FA");
    }
    setIsLoading(false);
  };

  const handleSendVerification = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    const res = await sendVerificationEmailAction(userId);
    if (res.success) {
      setSuccess("Verification email sent! Check your inbox.");
    } else {
      setError(res.error || "Failed to send verification email");
    }
    setIsLoading(false);
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBackupCodes = () => {
    const blob = new Blob([backupCodes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `fitsync-backup-codes-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {success && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-6 fade-in duration-300 max-w-sm">
          <Card className="p-4 backdrop-blur-xl border border-secondary/40 rounded-2xl shadow-2xl bg-slate-950/90 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-secondary/15 border border-secondary/35 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4.5 w-4.5 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-secondary leading-none">
                Security Update
              </p>
              <p className="text-xs font-semibold text-white mt-1.5 leading-normal">{success}</p>
            </div>
          </Card>
        </div>
      )}

      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-white text-left">
          Two-Factor Authentication
        </h1>
        <p className="text-muted-foreground mt-2 text-sm text-left">
          Add an extra layer of security to your account.
        </p>
      </div>

      {step !== "backup" && step !== "verify" && (
        <Card className="p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[2.5rem] space-y-6 text-left">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-heading text-white flex items-center gap-3">
                <Shield className="h-5 w-5 text-secondary" />
                {twoFactorEnabled ? "2FA Active" : "2FA Not Active"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {twoFactorEnabled
                  ? "Your account is protected with two-factor authentication."
                  : "Protect your account with an authenticator app."}
              </p>
            </div>
            {twoFactorEnabled ? (
              <div className="h-10 w-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-secondary" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-4">
            {!twoFactorEnabled ? (
              <Button
                onClick={handleSetup}
                disabled={isLoading}
                className="bg-secondary text-primary font-bold px-8 h-12 rounded-xl shadow-lg shadow-secondary/15 gap-2 flex-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Smartphone className="h-4 w-4" />
                )}
                Set Up 2FA
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setStep("disable");
                  setError("");
                }}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold px-8 h-12 rounded-xl gap-2"
              >
                <Shield className="h-4 w-4" />
                Disable 2FA
              </Button>
            )}
            <Button
              onClick={handleSendVerification}
              disabled={isLoading}
              variant="outline"
              className="border-white/10 hover:bg-white/5 font-bold px-8 h-12 rounded-xl text-white text-xs gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              Verify Email
            </Button>
          </div>
        </Card>
      )}

      {step === "verify" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[2.5rem] space-y-8 text-left">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-heading text-white flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-secondary" />
                Scan QR Code
              </h2>
              <p className="text-xs text-muted-foreground">
                Scan this QR code with your authenticator app (e.g. Google Authenticator, Authy)
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-secondary-container/10 blur-3xl rounded-full opacity-50" />
                <img
                  src={qrUrl}
                  alt="TOTP QR Code"
                  className="relative w-64 h-64 rounded-2xl border border-white/10 bg-white p-4"
                />
              </div>

              <div className="w-full space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Or enter this key manually
                </p>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
                  <code className="flex-1 text-xs font-mono text-secondary-container break-all select-all">
                    {secret}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(secret);
                    }}
                    className="text-muted-foreground hover:text-white transition-colors shrink-0 cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Enter 6-digit code from app
              </label>
              <div className="flex gap-3">
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="bg-white/5 border-white/10 h-14 text-2xl tracking-[0.5em] text-center font-mono rounded-xl focus-visible:ring-secondary/40 text-white"
                  maxLength={6}
                />
                <Button
                  onClick={handleVerify}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="bg-secondary text-primary font-bold px-8 h-14 rounded-xl shadow-lg shadow-secondary/15 gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Verify
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setStep("idle");
                  setError("");
                }}
                className="text-xs text-muted-foreground hover:text-on-surface transition-colors cursor-pointer"
              >
                &larr; Go back
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === "backup" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 sm:p-8 md:p-10 glass border-secondary/20 rounded-[2.5rem] space-y-8 text-left">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-heading text-white flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                Backup Codes
              </h2>
              <p className="text-xs text-muted-foreground">
                Save these backup codes in a secure place. Each code can only be used once.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-3">
                {backupCodes.map((code, i) => (
                  <div
                    key={i}
                    className="font-mono text-sm text-secondary-container bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center tracking-wider"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={copyBackupCodes}
                variant="outline"
                className="border-white/10 hover:bg-white/5 font-bold px-6 h-12 rounded-xl text-white text-xs gap-2 flex-1"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy Codes"}
              </Button>
              <Button
                onClick={downloadBackupCodes}
                variant="outline"
                className="border-white/10 hover:bg-white/5 font-bold px-6 h-12 rounded-xl text-white text-xs gap-2 flex-1"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button
                onClick={() => {
                  setStep("idle");
                  router.refresh();
                }}
                className="bg-secondary text-primary font-bold px-8 h-12 rounded-xl shadow-lg shadow-secondary/15"
              >
                Done
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === "disable" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 sm:p-8 md:p-10 glass border-red-500/20 rounded-[2.5rem] space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-heading text-red-500">
                  Disable Two-Factor Authentication
                </h2>
                <p className="text-xs text-muted-foreground">
                  This will make your account less secure. Consider keeping 2FA enabled.
                </p>
              </div>
            </div>

            {hasPassword && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password to confirm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 h-12 rounded-xl pr-12 focus-visible:ring-red-500/40 text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {!hasPassword && (
              <p className="text-xs text-muted-foreground">
                Since you signed in with a social provider, no password confirmation is needed.
              </p>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <Button
                onClick={() => {
                  setStep("idle");
                  setError("");
                  setPassword("");
                }}
                variant="outline"
                className="flex-1 border-white/10 h-12 rounded-2xl font-bold text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDisable}
                disabled={isLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold h-12 rounded-2xl shadow-lg shadow-red-500/15 text-xs gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                Disable 2FA
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
