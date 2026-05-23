"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, Activity, Target, Edit3, Settings, X, Loader2, Sparkles } from "lucide-react";
import { updateProfile } from "@/lib/actions";

interface ProfileTrackerClientProps {
  user: any;
}

export function ProfileTrackerClient({ user }: ProfileTrackerClientProps) {
  const [profile, setProfile] = useState(user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form State
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [height, setHeight] = useState<number>(user.height || 0);
  const [weight, setWeight] = useState<number>(user.weight || 0);
  const [fitnessGoal, setFitnessGoal] = useState(user.fitnessGoal || "MUSCLE_GAIN");
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || "MODERATELY_ACTIVE");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const res = await updateProfile(user.id, {
      name,
      bio,
      height: height || undefined,
      weight: weight || undefined,
      fitnessGoal,
      activityLevel,
    });

    if (res.success) {
      setProfile((prev: any) => ({
        ...prev,
        name,
        bio,
        height,
        weight,
        fitnessGoal,
        activityLevel,
      }));
      setIsModalOpen(false);
    } else {
      alert(res.error || "Failed to update profile");
    }
    setIsUpdating(false);
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case "WEIGHT_LOSS":
        return "Weight Loss Deficit";
      case "MUSCLE_GAIN":
        return "Muscle Hypertrophy";
      case "ENDURANCE":
        return "Stamina & Endurance";
      case "GENERAL":
        return "General Fitness";
      default:
        return goal || "Not Set";
    }
  };

  const getActivityLabel = (level: string) => {
    switch (level) {
      case "SEDENTARY":
        return "Sedentary (Desk Job)";
      case "LIGHTLY_ACTIVE":
        return "Lightly Active";
      case "MODERATELY_ACTIVE":
        return "Moderately Active";
      case "VERY_ACTIVE":
        return "Very Active Athlete";
      default:
        return level || "Not Set";
    }
  };

  return (
    <div className="space-y-12">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 w-full rounded-[2.5rem] bg-gradient-to-r from-secondary/20 via-accent/20 to-primary/20 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-6 px-8 -mt-20 relative z-10">
          <div className="h-40 w-40 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-2xl relative group">
            <div className="h-full w-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name || "Avatar"} className="h-full w-full object-cover" />
              ) : (
                <User className="h-16 w-16 text-white/50" />
              )}
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Edit3 className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="flex-1 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold font-heading tracking-tight text-white">
                {profile.name || "Alex Athlete"}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {profile.email}
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              className="border-white/10 hover:bg-white/5 font-bold gap-2 rounded-xl"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <h2 className="text-2xl font-bold font-heading">Bio</h2>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-muted-foreground leading-relaxed font-medium">
                {profile.bio || "No bio provided yet. Click 'Edit Profile' to write a bio and tell the community about your fitness journey!"}
              </p>
            </div>
          </Card>

          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-secondary animate-pulse" />
              <h2 className="text-2xl font-bold font-heading">Fitness Blueprint</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                  Primary Focus
                </p>
                <p className="text-xl font-bold font-heading mt-2 text-secondary">
                  {getGoalLabel(profile.fitnessGoal)}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                  Activity Level
                </p>
                <p className="text-xl font-bold font-heading mt-2 text-white">
                  {getActivityLabel(profile.activityLevel)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-6 w-6 text-accent" />
              <h2 className="text-xl font-bold font-heading">Body Metrics</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold text-muted-foreground">Height</span>
                <span className="text-lg font-bold font-heading text-white">
                  {profile.height ? `${profile.height} cm` : "--"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold text-muted-foreground">Current Weight</span>
                <span className="text-lg font-bold font-heading text-white">
                  {profile.weight ? `${profile.weight} kg` : "--"}
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold rounded-xl mt-4 h-12 shadow-lg shadow-accent/15"
            >
              Update Metrics
            </Button>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-heading flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Edit Profile
              </h3>
              <p className="text-xs text-muted-foreground">Modify your biological and athletic specifications.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Athlete Name
                </label>
                <Input required value={name} onChange={(e) => setName(e.target.value)} className="h-12 bg-white/5 border-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Height (cm)
                  </label>
                  <Input
                    type="number"
                    value={height || ""}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="h-12 bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    value={weight || ""}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="h-12 bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Fitness Goal
                  </label>
                  <select
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:border-secondary/40"
                  >
                    <option value="WEIGHT_LOSS">Weight Loss</option>
                    <option value="MUSCLE_GAIN">Muscle Gain</option>
                    <option value="ENDURANCE">Endurance</option>
                    <option value="FLEXIBILITY">Flexibility</option>
                    <option value="GENERAL">General Fitness</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                    Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:border-secondary/40"
                  >
                    <option value="SEDENTARY">Sedentary</option>
                    <option value="LIGHTLY_ACTIVE">Lightly Active</option>
                    <option value="MODERATELY_ACTIVE">Moderately Active</option>
                    <option value="VERY_ACTIVE">Very Active</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                  Athlete Bio
                </label>
                <textarea
                  placeholder="Tell the ecosystem about your goals..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-secondary/40 text-white"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl shadow-lg shadow-secondary/10 gap-2"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
                  Save Profile
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
