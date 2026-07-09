"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Bell, Shield, CreditCard,
  Smartphone, Loader2, CheckCircle, AlertCircle, Eye, Moon,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  fitnessGoal?: string;
  activityLevel?: string;
  height?: number;
  weight?: number;
  bio?: string;
  isPublic?: boolean;
}

interface NotificationPrefs {
  email: boolean;
  push: boolean;
  sms: boolean;
  weekly: boolean;
}

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    fitnessGoal: "",
    activityLevel: "",
    height: undefined,
    weight: undefined,
    bio: "",
    isPublic: true,
  });
  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);

  const [notifications, setNotifications] = useState<NotificationPrefs>({
    email: true,
    push: false,
    sms: true,
    weekly: true,
  });

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          const loaded = {
            name: data.name || "",
            email: data.email || "",
            fitnessGoal: data.fitnessGoal || "",
            activityLevel: data.activityLevel || "",
            height: data.height,
            weight: data.weight,
            bio: data.bio || "",
            isPublic: data.isPublic ?? true,
          };
          setProfile(loaded);
          setInitialProfile(loaded);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSuccessMsg("Profile saved successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to save");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (key: keyof NotificationPrefs) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateProfile = (field: keyof UserProfile, value: string | number | boolean | undefined) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold mb-1"><Settings className="h-4 w-4" />Settings</div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-white">Preferences</h1>
        <p className="text-muted-foreground mt-1">Manage your account, notifications, and privacy.</p>
      </motion.div>

      {successMsg && (
        <div className="p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-4 w-4" />{successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />{errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeSection === s.id ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}>
              <s.icon className="h-5 w-5" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="glass rounded-[2rem] border-white/5 p-8 space-y-6">
                <h2 className="text-xl font-bold font-heading text-white">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                    <input value={profile.name} onChange={(e) => updateProfile("name", e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-secondary/40 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                    <input value={profile.email} disabled
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white/50 text-sm cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fitness Goal</label>
                    <select value={profile.fitnessGoal || ""} onChange={(e) => updateProfile("fitnessGoal", e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-secondary/40">
                      <option value="">Select a goal</option>
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="Endurance">Endurance</option>
                      <option value="General Fitness">General Fitness</option>
                      <option value="Strength">Strength</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Activity Level</label>
                    <select value={profile.activityLevel || ""} onChange={(e) => updateProfile("activityLevel", e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-secondary/40">
                      <option value="">Select level</option>
                      <option value="Sedentary">Sedentary</option>
                      <option value="Lightly Active">Lightly Active</option>
                      <option value="Moderately Active">Moderately Active</option>
                      <option value="Very Active">Very Active</option>
                      <option value="Extremely Active">Extremely Active</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Height (cm)</label>
                    <input type="number" value={profile.height || ""} onChange={(e) => updateProfile("height", e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-secondary/40 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Weight (kg)</label>
                    <input type="number" value={profile.weight || ""} onChange={(e) => updateProfile("weight", e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-secondary/40 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bio</label>
                  <textarea value={profile.bio || ""} onChange={(e) => updateProfile("bio", e.target.value)}
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-secondary/40 transition-all resize-none" />
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-end gap-4">
                  <button onClick={() => initialProfile && setProfile({...initialProfile})}
                    className="px-6 py-2.5 border border-white/10 rounded-xl text-sm font-bold text-muted-foreground hover:text-white transition-all">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="px-6 py-2.5 bg-secondary text-primary font-bold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div className="glass rounded-[2rem] border-white/5 p-8 space-y-4">
                <h2 className="text-xl font-bold font-heading text-white">Integrations</h2>
                {["Apple Health", "Google Fit", "Fitbit"].map((name) => (
                  <div key={name} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-bold text-white">{name}</span>
                    </div>
                    <span className="text-[10px] px-3 py-1 rounded-lg bg-secondary/10 text-secondary font-bold uppercase tracking-wider">Connected</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "notifications" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2rem] border-white/5 p-8 space-y-6">
              <h2 className="text-xl font-bold font-heading text-white">Notification Preferences</h2>
              {(Object.entries(notifications) as [keyof NotificationPrefs, boolean][]).map(([key, value]) => {
                const labels: Record<keyof NotificationPrefs, { label: string; desc: string }> = {
                  email: { label: "Email Notifications", desc: "Weekly progress reports and achievements" },
                  push: { label: "Push Notifications", desc: "Real-time updates on workouts and messages" },
                  sms: { label: "SMS Alerts", desc: "Critical reminders and account updates" },
                  weekly: { label: "Weekly Digest", desc: "Summary of your weekly performance" },
                };
                const info = labels[key];
                return (
                  <div key={key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                    <div>
                      <p className="font-bold text-sm text-white">{info.label}</p>
                      <p className="text-xs text-muted-foreground">{info.desc}</p>
                    </div>
                    <button onClick={() => toggleNotification(key)}
                      className={`w-14 h-7 rounded-full transition-all relative ${value ? "bg-secondary" : "bg-white/10"}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all absolute top-1 ${value ? "left-8" : "left-1"}`} />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeSection === "privacy" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2rem] border-white/5 p-8 space-y-6">
              <h2 className="text-xl font-bold font-heading text-white">Privacy & Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-bold text-sm text-white">Profile Visibility</p>
                      <p className="text-xs text-muted-foreground">Control who sees your profile</p>
                    </div>
                  </div>
                  <button onClick={() => updateProfile("isPublic", !profile.isPublic)}
                    className={`w-14 h-7 rounded-full transition-all relative ${profile.isPublic ? "bg-secondary" : "bg-white/10"}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all absolute top-1 ${profile.isPublic ? "left-8" : "left-1"}`} />
                  </button>
                </div>
                {[
                  { label: "Two-Factor Authentication", desc: "Add an extra layer of security", icon: Shield, status: "Coming Soon" },
                  { label: "Data Export", desc: "Download your fitness data", icon: Shield, status: "Request" },
                  { label: "Dark Mode", desc: "Toggle dark mode preference", icon: Moon, status: "On" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-bold text-sm text-white">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-secondary">{item.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "billing" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2rem] border-white/5 p-8 space-y-6">
              <h2 className="text-xl font-bold font-heading text-white">Billing & Subscription</h2>
              <div className="p-5 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-center justify-between">
                <div>
                  <p className="font-bold text-secondary">Premium Plan</p>
                  <p className="text-sm text-muted-foreground">$9.99 / month · Active</p>
                </div>
                <button className="px-4 py-2 bg-secondary text-primary font-bold text-sm rounded-xl">Manage</button>
              </div>
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-white">Payment Methods</h3>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-bold text-white">•••• 4242</span>
                  <span className="text-xs text-muted-foreground">Expires 12/27</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
