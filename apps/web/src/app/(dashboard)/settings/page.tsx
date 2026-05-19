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
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-bold font-heading tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and platform sync.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <SettingsTab
            icon={<User className="h-4 w-4" />}
            label="Account"
            active
          />
          <SettingsTab
            icon={<Bell className="h-4 w-4" />}
            label="Notifications"
          />
          <SettingsTab
            icon={<Shield className="h-4 w-4" />}
            label="Privacy & Security"
          />
          <SettingsTab
            icon={<CreditCard className="h-4 w-4" />}
            label="Billing"
          />
          <SettingsTab
            icon={<Smartphone className="h-4 w-4" />}
            label="Connected Apps"
          />
          <SettingsTab icon={<Globe className="h-4 w-4" />} label="Language" />
          <SettingsTab
            icon={<HelpCircle className="h-4 w-4" />}
            label="Help & Support"
          />
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-8">
          {/* Profile Section */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-8">
            <h2 className="text-xl font-bold font-heading">
              Account Information
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Full Name
                  </label>
                  <Input
                    defaultValue="Alex Rivers"
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Username
                  </label>
                  <Input
                    defaultValue="arivers_fit"
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Email Address
                </label>
                <Input
                  defaultValue="alex@example.com"
                  disabled
                  className="bg-white/5 border-white/10 h-12 rounded-xl opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button className="bg-secondary text-primary font-bold px-8 h-12 rounded-xl shadow-lg shadow-secondary/10">
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Password Section */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-8">
            <h2 className="text-xl font-bold font-heading">Security</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 h-12 rounded-xl pr-12"
                  />
                  <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 h-12 rounded-xl pr-12"
                  />
                  <Eye className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5 font-bold px-8 h-12 rounded-xl"
              >
                Update Password
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/20 space-y-4">
            <h2 className="text-xl font-bold font-heading text-red-500">
              Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button
              variant="ghost"
              className="text-red-500 hover:bg-red-500 hover:text-white font-bold px-8 h-12 rounded-xl transition-all"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all group",
        active
          ? "bg-secondary/10 text-secondary border border-secondary/20"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold tracking-wide">{label}</span>
      </div>
      {active && <ChevronRight className="h-4 w-4" />}
    </div>
  );
}

import { cn } from "@/lib/utils";
