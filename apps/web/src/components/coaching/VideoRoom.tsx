"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PeerConnection, type PeerConnectionState } from "@/lib/webrtc";
import { SessionControls } from "./SessionControls";

interface VideoRoomProps {
  sessionId: string;
  onEndCall: () => void;
}

function LocalVideo({ stream, isMuted }: { stream: MediaStream | null; isMuted: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 shadow-xl">
      {stream ? (
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center"
              >
                <div className="w-6 h-6 rounded-full bg-secondary/40 animate-pulse" />
              </motion.div>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Your Camera</p>
          </div>
        </div>
      )}
      {isMuted && (
        <div className="absolute bottom-3 left-3 bg-red-500/80 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
          Muted
        </div>
      )}
      <div className="absolute bottom-3 right-3 text-[10px] text-white/40 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
        You
      </div>
    </div>
  );
}

function RemoteVideo({ state }: { state: PeerConnectionState }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 shadow-xl">
      {state === "connected" ? (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-32 h-32 mx-auto rounded-full bg-secondary/5 border border-secondary/20 flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 animate-pulse" />
                </div>
              </motion.div>
              <p className="text-muted-foreground text-sm font-medium">Remote Trainer</p>
            </div>
          </div>
        </>
      ) : state === "connecting" ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 mx-auto rounded-full border-2 border-secondary/30 border-t-secondary"
            />
            <p className="text-muted-foreground text-sm">Connecting...</p>
          </div>
        </div>
      ) : state === "disconnected" || state === "failed" ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-red-400 text-2xl">!</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {state === "failed" ? "Connection failed" : "Disconnected"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-slate-600" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Waiting for trainer</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ConnectionIndicator({ state }: { state: PeerConnectionState }) {
  const colors: Record<PeerConnectionState, string> = {
    idle: "bg-slate-500",
    connecting: "bg-yellow-500 animate-pulse",
    connected: "bg-green-500",
    disconnected: "bg-red-500",
    failed: "bg-red-500 animate-pulse",
  };

  const labels: Record<PeerConnectionState, string> = {
    idle: "Idle",
    connecting: "Connecting",
    connected: "Connected",
    disconnected: "Disconnected",
    failed: "Connection Failed",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", colors[state])} />
      <span className="text-xs text-muted-foreground">{labels[state]}</span>
    </div>
  );
}

export function VideoRoom({ sessionId, onEndCall }: VideoRoomProps) {
  const [peerConnection] = useState(() => new PeerConnection(sessionId));
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<PeerConnectionState>("idle");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRaisedHand, setIsRaisedHand] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const initStream = async () => {
      const { createLocalStream, getAvailableDevices } = await import("@/lib/webrtc");
      const stream = await createLocalStream();
      if (stream) {
        setLocalStream(stream);
        peerConnection.setLocalStream(stream);
      }
    };
    initStream();
  }, [peerConnection]);

  useEffect(() => {
    peerConnection.onStateChange(setConnectionState);
    peerConnection.onRemoteStream(() => {});
    peerConnection.connect();

    return () => {
      peerConnection.disconnect();
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [peerConnection]);

  useEffect(() => {
    if (connectionState === "connected") {
      const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [connectionState]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleReconnect = useCallback(() => {
    peerConnection.reconnect();
  }, [peerConnection]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <ConnectionIndicator state={connectionState} />
          <div className="flex items-center gap-3">
            <motion.div
              animate={isRaisedHand ? { y: [0, -8, 0] } : {}}
              transition={{ duration: 0.5, repeat: isRaisedHand ? Infinity : 0 }}
              className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-lg"
            >
              {formatTime(elapsed)}
            </motion.div>
            <div className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-lg">
              Session #{sessionId.slice(0, 8)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          <RemoteVideo state={connectionState} />
          <LocalVideo stream={localStream} isMuted={!isAudioEnabled} />
        </div>

        <SessionControls
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          isScreenSharing={isScreenSharing}
          connectionState={connectionState}
          onToggleAudio={() => {
            peerConnection.toggleAudio(!isAudioEnabled);
            setIsAudioEnabled(!isAudioEnabled);
          }}
          onToggleVideo={() => {
            peerConnection.toggleVideo(!isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
          }}
          onScreenShare={async () => {
            if (isScreenSharing) {
              setIsScreenSharing(false);
            } else {
              const { createScreenStream } = await import("@/lib/webrtc");
              const stream = await createScreenStream();
              if (stream) setIsScreenSharing(true);
            }
          }}
          onEndCall={onEndCall}
          onRaiseHand={() => setIsRaisedHand(!isRaisedHand)}
          isRaisedHand={isRaisedHand}
          onReconnect={connectionState === "failed" ? handleReconnect : undefined}
        />
      </div>
    </div>
  );
}
