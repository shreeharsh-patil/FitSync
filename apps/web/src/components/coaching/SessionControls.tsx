"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  Hand,
  Settings2,
  Wifi,
} from "lucide-react";
import type { PeerConnectionState } from "@/lib/webrtc";

interface SessionControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionState: PeerConnectionState;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
  onEndCall: () => void;
  onRaiseHand: () => void;
  isRaisedHand: boolean;
  onReconnect?: () => void;
}

function ControlButton({
  icon: Icon,
  active,
  danger,
  disabled,
  label,
  onClick,
}: {
  icon: any;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200",
        danger
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300"
          : active
            ? "bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20"
            : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-transparent",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-medium whitespace-nowrap">{label}</span>
    </motion.button>
  );
}

const qualityLevels = [
  { level: "Excellent", color: "text-green-400", bars: 4 },
  { level: "Good", color: "text-green-300", bars: 3 },
  { level: "Fair", color: "text-yellow-400", bars: 2 },
  { level: "Poor", color: "text-red-400", bars: 1 },
];

export function SessionControls({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  connectionState,
  onToggleAudio,
  onToggleVideo,
  onScreenShare,
  onEndCall,
  onRaiseHand,
  isRaisedHand,
  onReconnect,
}: SessionControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const quality = qualityLevels[Math.floor(Math.random() * 4)];

  return (
    <div className="flex items-center justify-between bg-black/20 backdrop-blur-xl rounded-2xl border border-white/5 p-3">
      <div className="flex items-center gap-2">
        <ControlButton
          icon={isAudioEnabled ? Mic : MicOff}
          active={isAudioEnabled}
          label={isAudioEnabled ? "Mute" : "Unmute"}
          onClick={onToggleAudio}
        />
        <ControlButton
          icon={isVideoEnabled ? Video : VideoOff}
          active={isVideoEnabled}
          label={isVideoEnabled ? "Hide" : "Show"}
          onClick={onToggleVideo}
        />
        <ControlButton
          icon={MonitorUp}
          active={isScreenSharing}
          label={isScreenSharing ? "Stop Share" : "Share"}
          onClick={onScreenShare}
        />
        <ControlButton
          icon={Hand}
          active={isRaisedHand}
          label={isRaisedHand ? "Lower" : "Raise Hand"}
          onClick={onRaiseHand}
        />
        <ControlButton
          icon={PhoneOff}
          danger
          label="End Call"
          onClick={onEndCall}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1 h-3 rounded-full transition-colors",
                i < quality.bars
                  ? quality.color.replace("text-", "bg-")
                  : "bg-white/10",
              )}
            />
          ))}
          <span className={cn("text-[10px] font-medium ml-1", quality.color)}>
            {quality.level}
          </span>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
          >
            <Settings2 className="h-4 w-4" />
          </motion.button>

          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-14 right-0 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-64 shadow-2xl space-y-3"
            >
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Device Settings
              </p>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">Camera</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground">
                  <option>Default Camera</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">Microphone</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground">
                  <option>Default Microphone</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block">Speaker</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground">
                  <option>Default Speaker</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {onReconnect && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onReconnect}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 text-xs font-medium transition-all"
          >
            <Wifi className="h-3.5 w-3.5" />
            Reconnect
          </motion.button>
        )}
      </div>
    </div>
  );
}
