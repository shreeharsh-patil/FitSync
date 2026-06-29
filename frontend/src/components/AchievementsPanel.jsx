import React, { useState } from "react";
import { 
  Trophy, 
  Sparkles, 
  Lock, 
  Share2, 
  CheckCircle2, 
  Award,
  Zap,
  Flame,
  User,
  Activity
} from "lucide-react";

export default function AchievementsPanel({ activeLog, hasChattedWithAI, triggerToast, onShareToFeed }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const badges = [
    {
      id: "water_warrior",
      title: "Water Warrior",
      description: "Log at least 8 glasses of water in a single day.",
      criteria: "Requires 8+ glasses of hydration.",
      icon: "💧",
      color: "from-cyan-500 to-blue-600",
      checkUnlock: (log) => log.water >= 8
    },
    {
      id: "daily_champion",
      title: "Daily Champion",
      description: "Hit your daily steps goal of 10,000+ steps.",
      criteria: "Requires 10,000+ total steps.",
      icon: "👟",
      color: "from-primary-fixed to-lime-600",
      checkUnlock: (log) => log.steps >= 10000
    },
    {
      id: "iron_crusher",
      title: "Iron Crusher",
      description: "Log 15 or more resistance training sets today.",
      criteria: "Requires 15+ sets logged.",
      icon: "🏋️‍♂️",
      color: "from-red-500 to-amber-600",
      checkUnlock: (log) => log.sets >= 15
    },
    {
      id: "speed_demon",
      title: "Speed Demon",
      description: "Run a distance of 5.0 miles or more in a single session.",
      criteria: "Requires 5.0+ run miles.",
      icon: "⚡",
      color: "from-secondary-fixed to-teal-600",
      checkUnlock: (log) => log.runMiles >= 5.0
    },
    {
      id: "chat_buddy",
      title: "Chat Buddy",
      description: "Consult the AI Coach Chatbot for coaching advice.",
      criteria: "Requires sending 1 message to AI Coach.",
      icon: "🧠",
      color: "from-purple-500 to-pink-600",
      checkUnlock: (log, chatted) => chatted === true
    },
    {
      id: "perfect_recovery",
      title: "Active Recovery",
      description: "Ensure your recovery score is 80% or higher.",
      criteria: "Requires 80%+ recovery index.",
      icon: "🔋",
      color: "from-emerald-400 to-teal-500",
      checkUnlock: (log) => log.recovery >= 80
    }
  ];

  const handleShareBadge = (badge) => {
    onShareToFeed(
      `🏆 UNLOCKED MILESTONE: Earned the '${badge.title}' badge! Criteria met: ${badge.description}`
    );
    setSelectedBadge(null);
    triggerToast(`🔗 Shared '${badge.title}' achievement to feed!`);
  };

  return (
    <div className="glass-card p-md md:p-lg rounded-2xl border border-white/10 relative overflow-hidden shadow-lg min-h-[460px] flex flex-col justify-between">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 rounded-full blur-[40px] pointer-events-none -mr-12 -mt-12"></div>
      
      <div>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-sm mb-lg">
          <div className="flex items-center gap-xs">
            <Trophy className="h-5 w-5 text-primary-fixed" />
            <h3 className="font-display-sm text-sm font-bold uppercase tracking-wider text-white">Milestones & Achievements</h3>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">
            {badges.filter(b => b.checkUnlock(activeLog, hasChattedWithAI)).length} / {badges.length} UNLOCKED
          </span>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-md">
          {badges.map((badge) => {
            const isUnlocked = badge.checkUnlock(activeLog, hasChattedWithAI);
            return (
              <div
                key={badge.id}
                onClick={() => isUnlocked && setSelectedBadge(badge)}
                className={`p-md rounded-2xl border flex flex-col items-center text-center justify-between transition-all select-none ${
                  isUnlocked
                    ? "bg-surface-container hover:bg-surface-container-high border-primary-fixed/30 hover:border-primary-fixed cursor-pointer scale-100 hover:scale-[1.03] shadow-md"
                    : "bg-surface-container-low/40 border-white/5 opacity-40"
                }`}
              >
                <div className="relative mb-sm">
                  {/* Badge Outer Glow */}
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${isUnlocked ? badge.color : "from-white/5 to-white/10"} flex items-center justify-center text-2xl shadow-inner relative z-10`}>
                    {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-outline-variant" />}
                  </div>
                  {isUnlocked && (
                    <div className="absolute -top-1.5 -right-1.5 z-20 w-5 h-5 rounded-full bg-primary-fixed text-on-primary-fixed border border-background flex items-center justify-center shadow">
                      <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold ${isUnlocked ? "text-white" : "text-on-surface-variant"}`}>{badge.title}</h4>
                  <p className="text-[8px] text-on-surface-variant leading-snug">{isUnlocked ? "Unlocked Today" : badge.criteria}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-lg p-2.5 bg-white/5 border border-white/5 rounded-xl text-center text-[10px] text-on-surface-variant leading-relaxed">
        🥇 Achievements sync dynamically as your metrics (steps, water, workouts, coaching queries) refresh in real time. Click an unlocked badge to publish it to the community!
      </div>

      {/* Celebratory Modal Dialog */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/75 backdrop-blur-md" onClick={() => setSelectedBadge(null)}>
          <div className="relative w-full max-w-sm glass-card border border-primary-fixed/30 rounded-3xl p-lg text-center space-y-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Confetti particles preview */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(195,244,0,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${selectedBadge.color} flex items-center justify-center text-4xl shadow-lg ring-4 ring-primary-fixed/20 animate-bounce mb-sm`}>
                {selectedBadge.icon}
              </div>
              <div className="inline-flex items-center gap-xs px-2.5 py-0.5 bg-primary-fixed/15 border border-primary-fixed/20 rounded-full text-[10px] text-primary-fixed font-bold uppercase tracking-wider mb-xs">
                <Trophy className="w-3.5 h-3.5 fill-primary-fixed" />
                Achievement Unlocked
              </div>
              <h3 className="font-headline-lg text-lg text-white font-bold">{selectedBadge.title}</h3>
              <p className="text-xs text-on-surface-variant px-sm mt-xs leading-relaxed">{selectedBadge.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-sm pt-md border-t border-white/5">
              <button
                onClick={() => setSelectedBadge(null)}
                className="py-2.5 border border-white/10 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-white/5 transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleShareBadge(selectedBadge)}
                className="py-2.5 bg-primary-fixed text-on-primary-fixed font-bold hover:bg-white rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 glow-lime"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Feed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
