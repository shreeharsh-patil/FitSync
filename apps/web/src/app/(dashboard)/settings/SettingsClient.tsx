"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Smartphone,
  Globe,
  HelpCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Trash2,
  Sparkles,
  Activity,
  X,
  Lock, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateUserSettings, updateUserPassword, deleteUserAccount } from "@/lib/actions";
import { signOut } from "next-auth/react";

interface SettingsClientProps {
  user: any;
}

export function SettingsClient({ user }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "security" | "billing" | "apps" | "help">("account");

  // Account Information form states
  const [fullName, setFullName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [isPublic, setIsPublic] = useState(user.isPublic ?? true);
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  // Password Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notification toggles
  const [notifications, setNotifications] = useState({
    workouts: true,
    hydration: true,
    community: false,
    aiDeloads: true,
  });

  // App Tracker sync states
  const [syncedApps, setSyncedApps] = useState<Record<string, { synced: boolean; loading: boolean; lastSync?: string }>>({
    apple: { synced: true, loading: false, lastSync: "10 mins ago" },
    strava: { synced: false, loading: false },
    garmin: { synced: false, loading: false },
  });

  // Danger zone account deletion states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast status alert states
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = (message: string, type: "success" | "error" = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const handleSaveAccountInfo = async () => {
    setIsSavingAccount(true);
    const res = await updateUserSettings(user.id, {
      name: fullName,
      username: username || undefined,
      bio,
      isPublic,
    });

    if (res.success) {
      triggerAlert(res.success, "success");
    } else {
      triggerAlert(res.error || "Failed to update profile settings", "error");
    }
    setIsSavingAccount(false);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      return triggerAlert("Current and new passwords are required", "error");
    }
    if (newPassword.length < 6) {
      return triggerAlert("New password must be at least 6 characters long", "error");
    }

    setIsUpdatingPassword(true);
    const res = await updateUserPassword(user.id, {
      currentPassword,
      newPassword,
    });

    if (res.success) {
      triggerAlert(res.success, "success");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      triggerAlert(res.error || "Failed to update password security credentials", "error");
    }
    setIsUpdatingPassword(false);
  };

  const handleSyncApp = (appKey: string) => {
    setSyncedApps((prev) => ({
      ...prev,
      [appKey]: { ...prev[appKey], loading: true },
    }));

    // Simulate standard OAuth fetching handshake
    setTimeout(() => {
      setSyncedApps((prev) => ({
        ...prev,
        [appKey]: {
          synced: !prev[appKey].synced,
          loading: false,
          lastSync: !prev[appKey].synced ? "Just now ⚡" : undefined,
        },
      }));
      triggerAlert(`${appKey === "apple" ? "Apple Health" : appKey === "strava" ? "Strava" : "Garmin"} sync status updated!`, "success");
    }, 1200);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const res = await deleteUserAccount(user.id);
    if (res.success) {
      triggerAlert("Account deleted. Expunging data...", "success");
      setTimeout(() => {
        signOut({ callbackUrl: "/signup" });
      }, 1500);
    } else {
      triggerAlert(res.error || "Failed to delete account", "error");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      triggerAlert("Notification preferences updated dynamically! 🔔", "success");
      return next;
    });
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 sm:space-y-12">
      {/* Toast Alert popup banner */}
      {showAlert && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-6 fade-in duration-300 max-w-sm">
          <Card 
            className={cn(
              "p-4 backdrop-blur-xl border rounded-2xl shadow-2xl flex items-center gap-3 text-left",
              alertType === "success" 
                ? "bg-slate-950/90 border-secondary/40 shadow-secondary/5 text-white" 
                : "bg-red-950/90 border-red-500/40 shadow-red-500/5 text-white"
            )}
          >
            <div 
              className={cn(
                "h-8 w-8 rounded-xl flex shrink-0 items-center justify-center border",
                alertType === "success" 
                  ? "bg-secondary/15 border-secondary/35 text-secondary animate-pulse" 
                  : "bg-red-500/15 border-red-500/35 text-red-400"
              )}
            >
              {alertType === "success" ? <Sparkles className="h-4.5 w-4.5" /> : <Lock className="h-4.5 w-4.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-[9px] font-bold uppercase tracking-widest leading-none", alertType === "success" ? "text-secondary" : "text-red-400")}>
                {alertType === "success" ? "Preference Synchronized" : "Security Alert"}
              </p>
              <p className="text-xs font-semibold text-white mt-1.5 leading-normal">{alertMessage}</p>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="text-muted-foreground hover:text-white shrink-0 ml-1 p-0.5 rounded-full hover:bg-white/5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Card>
        </div>
      )}

      {/* Header section */}
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-white text-left">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base text-left">
          Manage your account preferences, wearable trackers, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 gap-2 shrink-0 scrollbar-none">
          <SettingsTab
            icon={<User className="h-4 w-4" />}
            label="Account"
            active={activeTab === "account"}
            onClick={() => setActiveTab("account")}
          />
          <SettingsTab
            icon={<Bell className="h-4 w-4" />}
            label="Notifications"
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
          <SettingsTab
            icon={<Shield className="h-4 w-4" />}
            label="Security"
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          />
          <SettingsTab
            icon={<CreditCard className="h-4 w-4" />}
            label="Billing"
            active={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
          />
          <SettingsTab
            icon={<Smartphone className="h-4 w-4" />}
            label="Trackers"
            active={activeTab === "apps"}
            onClick={() => setActiveTab("apps")}
          />
          <SettingsTab
            icon={<HelpCircle className="h-4 w-4" />}
            label="Support"
            active={activeTab === "help"}
            onClick={() => setActiveTab("help")}
          />
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-8">
          
          {/* TAB 1: Account Information */}
          {activeTab === "account" && (
            <Card className="p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[2.5rem] space-y-8 text-left animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-heading text-white">
                  Account Information
                </h2>
                <p className="text-xs text-muted-foreground">
                  Update your standard user profile credentials.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Full Name
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-secondary/40 text-white text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Username
                    </label>
                    <Input
                      value={username}
                      placeholder="e.g. alex_ rivers"
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-secondary/40 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Bio / Status
                  </label>
                  <Input
                    value={bio}
                    placeholder="Tell the community about your fitness goals..."
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-secondary/40 text-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Email Address
                  </label>
                  <Input
                    value={user.email || ""}
                    disabled
                    className="bg-white/5 border-white/10 h-12 rounded-xl opacity-40 cursor-not-allowed text-white text-sm"
                  />
                  <p className="text-[9px] text-muted-foreground ml-1">
                    Email addresses are locked to your login provider context.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <Button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  variant="ghost"
                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10 font-bold px-6 h-12 rounded-xl text-xs gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
                <Button 
                  onClick={handleSaveAccountInfo}
                  disabled={isSavingAccount}
                  className="bg-secondary text-primary font-bold px-8 h-12 rounded-xl shadow-lg shadow-secondary/15 flex items-center gap-2"
                >
                  {isSavingAccount ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {/* TAB 2: Notifications */}
          {activeTab === "notifications" && (
            <Card className="p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[2.5rem] space-y-8 text-left animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-heading text-white">
                  Notification Settings
                </h2>
                <p className="text-xs text-muted-foreground">
                  Decide how you prefer to be notified of synchronization protocols.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { key: "workouts", title: "Workout Reminders", desc: "Notify me when dynamic routines are scheduled for today." },
                  { key: "hydration", title: "Hydration Alerts", desc: "Push periodic hydration reminder cues during training cycles." },
                  { key: "community", title: "Social Feeds Digests", desc: "Send comment updates, likes, and community challenge alerts." },
                  { key: "aiDeloads", title: "AI Coach Protocols", desc: "Notify me when optimal recovery/deload indexes are reached." }
                ].map((item) => (
                  <div 
                    key={item.key}
                    onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:border-secondary/20 transition-all group"
                  >
                    <div className="space-y-1 pr-4">
                      <p className="text-sm font-bold text-white group-hover:text-secondary transition-colors">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">{item.desc}</p>
                    </div>
                    <div className={cn(
                      "h-6 w-6 rounded-lg border flex shrink-0 items-center justify-center transition-all",
                      notifications[item.key as keyof typeof notifications] 
                        ? "bg-secondary border-secondary text-primary" 
                        : "border-white/20 hover:border-secondary/40 bg-white/5"
                    )}>
                      {notifications[item.key as keyof typeof notifications] && <CheckCircle2 className="h-4.5 w-4.5 text-primary stroke-[3px]" />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 3: Security & Privacy */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Privacy settings */}
              <Card className="p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[2.5rem] space-y-8 text-left">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-heading text-white">
                    Profile Privacy
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Control who can view your dynamic workouts and progress charts.
                  </p>
                </div>

                <div 
                  onClick={async () => {
                    const next = !isPublic;
                    setIsPublic(next);
                    await updateUserSettings(user.id, { isPublic: next });
                    triggerAlert(`Profile status swapped to ${next ? "Public" : "Private"}!`, "success");
                  }}
                  className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:border-secondary/20 transition-all group"
                >
                  <div className="space-y-1 text-left">
                    <p className="text-sm font-bold text-white group-hover:text-secondary transition-colors">
                      {isPublic ? "Public Profile Status" : "Private Profile Status"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
                      {isPublic 
                        ? "Your posts, PR logs, and comments are visible to the dynamic community family."
                        : "Your logs are hidden, only you can consult progress analytics curves."
                      }
                    </p>
                  </div>
                  <div className={cn(
                    "h-6 w-6 rounded-lg border flex shrink-0 items-center justify-center transition-all",
                    isPublic 
                      ? "bg-secondary border-secondary text-primary" 
                      : "border-white/20 hover:border-secondary/40 bg-white/5"
                  )}>
                    {isPublic && <CheckCircle2 className="h-4.5 w-4.5 text-primary stroke-[3px]" />}
                  </div>
                </div>
              </Card>

              {/* Password Section */}
              <Card className="p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[2.5rem] space-y-8 text-left">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-heading text-white">
                    Password Security
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Update your local security login credentials.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-white/5 border-white/10 h-12 rounded-xl pr-12 focus-visible:ring-secondary/40 text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-white/5 border-white/10 h-12 rounded-xl pr-12 focus-visible:ring-secondary/40 text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <Button
                    onClick={handleUpdatePassword}
                    disabled={isUpdatingPassword}
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 font-bold px-8 h-12 rounded-xl text-white text-xs gap-2"
                  >
                    {isUpdatingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Update Password
                  </Button>
                </div>
              </Card>

              {/* Danger Zone account deletion */}
              <div className="p-6 sm:p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/20 space-y-5 text-left">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-heading text-red-500">
                    Danger Zone
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Deleting your account expunges all historical workout records, progress sheets, and social posts.
                  </p>
                </div>
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  variant="ghost"
                  className="text-red-500 hover:bg-red-500 hover:text-white border border-red-500/10 font-bold px-8 h-12 rounded-xl transition-all text-xs"
                >
                  Delete Athlete Account
                </Button>
              </div>
            </div>
          )}

          {/* TAB 4: Billing */}
          {activeTab === "billing" && (
            <Card className="p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[2.5rem] space-y-8 text-left animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-heading text-white">
                  Subscription & Billing
                </h2>
                <p className="text-xs text-muted-foreground">
                  Consult billing plan targets and Stripe payment configurations.
                </p>
              </div>

              <div className="p-6 bg-secondary/5 border border-secondary/15 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-bold bg-secondary text-primary uppercase tracking-widest px-2 py-0.5 rounded font-mono">
                      Active membership
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-2">
                      FitSync Premium Coach Plan
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Renews automatically on June 23, 2026 ($9.99/mo)
                    </p>
                  </div>
                  <Sparkles className="h-8 w-8 text-secondary animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-sm text-white">Billing History</h3>
                <div className="space-y-2.5">
                  {[
                    { date: "May 23, 2026", amount: "$9.99", id: "INV-9824A" },
                    { date: "April 23, 2026", amount: "$9.99", id: "INV-9712B" },
                  ].map((inv) => (
                    <div 
                      key={inv.id}
                      className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-xs"
                    >
                      <span className="font-semibold text-white">{inv.date}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-muted-foreground">{inv.id}</span>
                        <span className="font-bold text-secondary">{inv.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <Button 
                  onClick={() => triggerAlert("Stripe Checkout Portal synchronization is active!", "success")}
                  className="bg-secondary text-primary font-bold px-8 h-12 rounded-xl shadow-lg shadow-secondary/15"
                >
                  Manage Stripe Invoices
                </Button>
              </div>
            </Card>
          )}

          {/* TAB 5: Connected Trackers */}
          {activeTab === "apps" && (
            <Card className="p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[2.5rem] space-y-8 text-left animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-heading text-white">
                  Wearable Applications Sync
                </h2>
                <p className="text-xs text-muted-foreground">
                  Synchronize training heart rates and running tracks dynamically from physical trackers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { key: "apple", title: "Apple Health", desc: "Heart rate and sleep parameters logs.", color: "from-red-500/10" },
                  { key: "strava", title: "Strava Sync", desc: "GPS running coordinates and cardio tracks.", color: "from-orange-500/10" },
                  { key: "garmin", title: "Garmin Connect", desc: "Calorie burns and strength logs metrics.", color: "from-blue-500/10" }
                ].map((app) => {
                  const state = syncedApps[app.key];
                  return (
                    <div 
                      key={app.key}
                      className={cn(
                        "p-6 rounded-[2rem] border bg-gradient-to-br transition-all flex flex-col justify-between min-h-[220px] group",
                        app.color,
                        state.synced 
                          ? "border-secondary/20 bg-secondary/[0.01]" 
                          : "border-white/5 bg-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="space-y-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-900/60 flex items-center justify-center text-white border border-white/5 group-hover:scale-105 transition-transform">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{app.title}</h4>
                          <p className="text-[10px] text-muted-foreground leading-normal mt-1">{app.desc}</p>
                        </div>
                      </div>

                      <div className="space-y-3.5 pt-4">
                        <div className="flex justify-between items-center text-[8px] font-mono font-bold uppercase tracking-wider">
                          <span className={cn(state.synced ? "text-secondary" : "text-muted-foreground")}>
                            {state.synced ? "Active Synchronized" : "Disconnected"}
                          </span>
                          {state.lastSync && (
                            <span className="text-muted-foreground">Sync: {state.lastSync}</span>
                          )}
                        </div>

                        <Button
                          onClick={() => handleSyncApp(app.key)}
                          disabled={state.loading}
                          variant={state.synced ? "outline" : "secondary"}
                          className="w-full text-xs font-bold rounded-xl h-10 gap-2 shadow-inner"
                        >
                          {state.loading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : state.synced ? (
                            "Disconnect App"
                          ) : (
                            "Synchronize"
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* TAB 6: Help & Support */}
          {activeTab === "help" && (
            <Card className="p-6 sm:p-8 md:p-10 glass border-white/5 rounded-[2.5rem] space-y-8 text-left animate-in fade-in duration-200">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-heading text-white">
                  Help & Support
                </h2>
                <p className="text-xs text-muted-foreground">
                  Consult standard FAQ grids or log a priority ticket for priority assistance.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { q: "How is my streak level count verified?", a: "Streaks increase for each consecutive day you log an active workout or dynamic macro balance inside your metrics history sheet." },
                  { q: "Can I synchronize Strava GPS records?", a: "Yes, navigate to the Connected Apps tab, and toggle Strava synchronization. GPS records are parsed automatically." },
                  { q: "How do I upgrade to the premium coaching plan?", a: "Subscription invoices and tiers can be managed under the Billing tab, running payments through standard secure Stripe checkouts." }
                ].map((faq, idx) => (
                  <div key={idx} className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-secondary shrink-0" />
                      {faq.q}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed font-semibold pl-6">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <Button 
                  onClick={() => triggerAlert("Support ticket generated dynamically. Check notifications!", "success")}
                  className="bg-secondary text-primary font-bold px-8 h-12 rounded-xl shadow-lg shadow-secondary/15"
                >
                  Generate Support Ticket
                </Button>
              </div>
            </Card>
          )}

        </div>
      </div>

      {/* Danger Zone Account Deletion Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md glass border-red-500/20 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl text-left">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-3.5">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-inner mb-4">
                <Trash2 className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-red-500">Expunge Athlete Profile?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                This action is irreversible. All logged training volumes, calorie balances, streak records, and profile details will be permanently destroyed.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 border-white/10 border h-12 rounded-2xl font-bold text-xs"
              >
                Cancel Deletion
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold h-12 rounded-2xl shadow-lg shadow-red-500/15 text-xs gap-2"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Confirm Deletion
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function SettingsTab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all group shrink-0 whitespace-nowrap md:w-full",
        active
          ? "bg-secondary/10 text-secondary border border-secondary/20 shadow-md"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold tracking-wide">{label}</span>
      </div>
      {active && <ChevronRight className="hidden md:block h-4 w-4" />}
    </div>
  );
}
