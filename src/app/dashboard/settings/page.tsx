"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Bell, Shield, CreditCard,
  Smartphone, Loader2, CheckCircle, AlertCircle, Eye, Moon,
} from "lucide-react";

interface UserProfile {
  name: string; email: string; fitnessGoal?: string; activityLevel?: string;
  height?: number; weight?: number; bio?: string; isPublic?: boolean;
}

interface NotificationPrefs { email: boolean; push: boolean; sms: boolean; weekly: boolean; }

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
    name: "", email: "", fitnessGoal: "", activityLevel: "",
    height: undefined, weight: undefined, bio: "", isPublic: true,
  });
  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);

  const [notifications, setNotifications] = useState<NotificationPrefs>({ email: true, push: false, sms: true, weekly: true });
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    appleHealth: false,
    googleFit: false,
    fitbit: false,
    strava: false,
  });

  useEffect(() => {
    fetch("/api/user").then((res) => res.json()).then((data) => {        if (data._id) {
        const loaded = { name: data.name || "", email: data.email || "", fitnessGoal: data.fitnessGoal || "", activityLevel: data.activityLevel || "", height: data.height, weight: data.weight, bio: data.bio || "", isPublic: data.isPublic ?? true };
        setProfile(loaded);
        setInitialProfile(loaded);
        if (data.integrations) setIntegrations(data.integrations);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSuccessMsg(""); setErrorMsg("");
    try {
      const res = await fetch("/api/user", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      if (res.ok) { setSuccessMsg("Profile saved successfully!"); setTimeout(() => setSuccessMsg(""), 3000); }
      else { const data = await res.json(); setErrorMsg(data.error || "Failed to save"); }
    } catch { setErrorMsg("Network error. Please try again."); }
    finally { setSaving(false); }
  };

  const toggleNotification = (key: keyof NotificationPrefs) => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  const updateProfile = (field: keyof UserProfile, value: string | number | boolean | undefined) => setProfile((prev) => ({ ...prev, [field]: value }));

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-text-muted text-sm font-semibold mb-1"><Settings className="h-4 w-4" />Settings</div>
        <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] tracking-tight text-text-primary">Preferences</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your account, notifications, and privacy.</p>
      </motion.div>

      {successMsg && (
        <div className="p-4 bg-success/10 border border-success/30 text-success rounded-lg text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />{successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-danger/10 border border-danger/30 text-danger rounded-lg text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />{errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-1">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeSection === s.id ? "bg-accent-dim text-accent" : "text-text-muted hover:text-text-primary hover:bg-surface-1"
              }`}>
              <s.icon className="h-4 w-4" />{s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="rounded-lg bg-surface-2 border border-border p-6 md:p-8 space-y-6">
                <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Full Name</label>
                    <input id="name" name="name" value={profile.name} onChange={(e) => updateProfile("name", e.target.value)} className="input w-full" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Email</label>
                    <input id="email" name="email" value={profile.email} disabled className="input w-full opacity-50 cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="fitnessGoal" className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Fitness Goal</label>
                    <select id="fitnessGoal" name="fitnessGoal" value={profile.fitnessGoal || ""} onChange={(e) => updateProfile("fitnessGoal", e.target.value)} className="input w-full">
                      <option value="">Select a goal</option>
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="Endurance">Endurance</option>
                      <option value="General Fitness">General Fitness</option>
                      <option value="Strength">Strength</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="activityLevel" className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Activity Level</label>
                    <select id="activityLevel" name="activityLevel" value={profile.activityLevel || ""} onChange={(e) => updateProfile("activityLevel", e.target.value)} className="input w-full">
                      <option value="">Select level</option>
                      <option value="Sedentary">Sedentary</option>
                      <option value="Lightly Active">Lightly Active</option>
                      <option value="Moderately Active">Moderately Active</option>
                      <option value="Very Active">Very Active</option>
                      <option value="Extremely Active">Extremely Active</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="height" className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Height (cm)</label>
                    <input id="height" name="height" type="number" value={profile.height || ""} onChange={(e) => updateProfile("height", e.target.value ? parseFloat(e.target.value) : undefined)} className="input w-full" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="weight" className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Weight (kg)</label>
                    <input id="weight" name="weight" type="number" value={profile.weight || ""} onChange={(e) => updateProfile("weight", e.target.value ? parseFloat(e.target.value) : undefined)} className="input w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Bio</label>
                  <textarea id="bio" name="bio" value={profile.bio || ""} onChange={(e) => updateProfile("bio", e.target.value)} className="input w-full h-24 resize-none" />
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-border">
                  <button onClick={() => initialProfile && setProfile({ ...initialProfile })}
                    className="px-5 py-2.5 border border-border rounded-lg text-xs font-semibold text-text-muted hover:text-text-primary transition-all">Cancel</button>
                  <button onClick={handleSave} disabled={saving}
                    className="px-5 py-2.5 bg-accent text-white font-bold text-sm rounded-lg disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-surface-2 border border-border p-6 md:p-8 space-y-4">
                <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">Integrations</h2>
                <p className="text-sm text-text-secondary mb-4">Connect your fitness platforms to sync data automatically.</p>
                {[
                  { key: "appleHealth", label: "Apple Health", icon: Smartphone },
                  { key: "googleFit", label: "Google Fit", icon: Smartphone },
                  { key: "fitbit", label: "Fitbit", icon: Smartphone },
                  { key: "strava", label: "Strava", icon: Smartphone },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-text-muted" />
                      <span className="text-sm font-semibold text-text-primary">{label}</span>
                    </div>
                    <button
                      onClick={async () => {
                        const enabled = !integrations[key];
                        try {
                          const res = await fetch("/api/user/integrations", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ integration: key, enabled }),
                          });
                          if (res.ok) setIntegrations((prev) => ({ ...prev, [key]: enabled }));
                        } catch {}
                      }}
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                        integrations[key]
                          ? "bg-success/10 text-success border border-success/30 hover:bg-danger/10 hover:text-danger hover:border-danger/30"
                          : "bg-surface-1 text-text-muted border border-border hover:bg-accent-dim hover:text-accent hover:border-accent/20"
                      }`}>
                      {integrations[key] ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "notifications" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-surface-2 border border-border p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">Notification Preferences</h2>
              {(Object.entries(notifications) as [keyof NotificationPrefs, boolean][]).map(([key, value]) => {
                const labels: Record<keyof NotificationPrefs, { label: string; desc: string }> = {
                  email: { label: "Email Notifications", desc: "Weekly progress reports and achievements" },
                  push: { label: "Push Notifications", desc: "Real-time updates on workouts and messages" },
                  sms: { label: "SMS Alerts", desc: "Critical reminders and account updates" },
                  weekly: { label: "Weekly Digest", desc: "Summary of your weekly performance" },
                };
                const info = labels[key];
                return (
                  <div key={key} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-sm text-text-primary">{info.label}</p>
                      <p className="text-xs text-text-muted">{info.desc}</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={value}
                      aria-label={info.label}
                      onClick={() => toggleNotification(key)}
                      className={`w-12 h-6 rounded-full transition-all relative focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 ${value ? "bg-accent" : "bg-surface-1 border border-border"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-all absolute top-1 ${value ? "left-7" : "left-1"}`} />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeSection === "privacy" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-surface-2 border border-border p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">Privacy & Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-text-muted" />
                    <div>
                      <p className="font-semibold text-sm text-text-primary">Profile Visibility</p>
                      <p className="text-xs text-text-muted">Control who sees your profile</p>
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={profile.isPublic}
                    aria-label="Profile visibility"
                    onClick={() => updateProfile("isPublic", !profile.isPublic)}
                    className={`w-12 h-6 rounded-full transition-all relative focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 ${profile.isPublic ? "bg-accent" : "bg-surface-1 border border-border"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-all absolute top-1 ${profile.isPublic ? "left-7" : "left-1"}`} />
                  </button>
                </div>
                {[
                  { label: "Two-Factor Authentication", desc: "Add an extra layer of security", icon: Shield, status: "Coming Soon" },
                  { label: "Data Export", desc: "Download your fitness data", icon: Shield, status: "Request" },
                  { label: "Dark Mode", desc: "Toggle dark mode preference", icon: Moon, status: "On" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-text-muted" />
                      <div>
                        <p className="font-semibold text-sm text-text-primary">{item.label}</p>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-success">{item.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "billing" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-surface-2 border border-border p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">Billing & Subscription</h2>
              <div className="p-5 rounded-lg bg-success/10 border border-success/30 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-success">Premium Plan</p>
                  <p className="text-sm text-text-muted">$9.99 / month · Active</p>
                </div>
                <button className="px-4 py-2 bg-accent text-white font-bold text-xs rounded-lg">Manage</button>
              </div>
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-sm text-text-primary">Payment Methods</h3>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-1 border border-border">
                  <CreditCard className="h-5 w-5 text-text-muted" />
                  <span className="text-sm font-semibold text-text-primary">\u2022\u2022\u2022\u2022 4242</span>
                  <span className="text-xs text-text-muted">Expires 12/27</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
