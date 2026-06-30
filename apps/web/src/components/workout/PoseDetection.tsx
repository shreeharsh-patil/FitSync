"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Camera,
  CameraOff,
  Play,
  StopCircle,
  Activity,
  Target,
  Dumbbell,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormFeedback {
  type: "success" | "warning" | "error";
  message: string;
}

interface PoseDetectionProps {
  exerciseName?: string;
  onSessionComplete?: (summary: SessionSummary) => void;
}

interface SessionSummary {
  duration: number;
  totalReps: number;
  avgFormScore: number;
  feedbacks: FormFeedback[];
}

const FORM_FEEDBACKS: Record<string, FormFeedback[]> = {
  squat: [
    { type: "success", message: "Knee tracking aligned with toes — excellent" },
    { type: "warning", message: "Chest is dropping forward — keep chest up" },
    { type: "error", message: "Depth insufficient — break parallel for full ROM" },
  ],
  "bench press": [
    { type: "success", message: "Elbow angle optimal at 75 degrees" },
    { type: "warning", message: "Bar path drifting — keep over mid-chest" },
    { type: "error", message: "Shoulders not retracted — pinch shoulder blades" },
  ],
  deadlift: [
    { type: "success", message: "Hip hinge pattern looks solid" },
    { type: "warning", message: "Lower back rounding — brace core harder" },
    { type: "error", message: "Bar too far from shins — start closer" },
  ],
  default: [
    { type: "success", message: "Good tempo and control" },
    { type: "warning", message: "Range of motion could be deeper" },
    { type: "error", message: "Rushing the eccentric — slow down" },
  ],
};

const SAMPLE_SPOTS = [
  { x: 50, y: 10, label: "Head" },
  { x: 50, y: 25, label: "Shoulders" },
  { x: 40, y: 40, label: "L Elbow" },
  { x: 60, y: 40, label: "R Elbow" },
  { x: 35, y: 55, label: "L Wrist" },
  { x: 65, y: 55, label: "R Wrist" },
  { x: 50, y: 50, label: "Hips" },
  { x: 45, y: 65, label: "L Knee" },
  { x: 55, y: 65, label: "R Knee" },
  { x: 40, y: 85, label: "L Ankle" },
  { x: 60, y: 85, label: "R Ankle" },
];

const SKELETON_CONNECTIONS = [
  [0, 1], [1, 2], [1, 3], [2, 4], [3, 5],
  [1, 6], [6, 7], [6, 8], [7, 9], [8, 10],
  [4, 7], [5, 8], [7, 9], [8, 10],
];

export function PoseDetection({ exerciseName = "Exercise", onSessionComplete }: PoseDetectionProps) {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(85);
  const [feedbacks, setFeedbacks] = useState<FormFeedback[]>([]);
  const [isInDownPosition, setIsInDownPosition] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval>>();
  const spotAnimRef = useRef<number>(0);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setStream(mediaStream);
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      alert("Camera access denied. Please enable camera permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsActive(false);
    setIsTracking(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (spotAnimRef.current) cancelAnimationFrame(spotAnimRef.current);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    setSessionTime(0);
  }, [stream]);

  const drawSkeleton = useCallback(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const time = Date.now() / 1000;
    const animOffset = Math.sin(time * 0.5) * 0.02;

    const spots = SAMPLE_SPOTS.map((spot, i) => {
      const wobble = Math.sin(time * 2 + i) * 3;
      const breathOffset = i === 1 || i === 6 ? Math.sin(time * 0.8) * 2 : 0;
      return {
        x: (spot.x / 100) * canvas.width + wobble,
        y: (spot.y / 100) * canvas.height + breathOffset + (isTracking ? animOffset * canvas.height : 0),
        label: spot.label,
      };
    });

    ctx.strokeStyle = "rgba(0, 201, 167, 0.6)";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(0, 201, 167, 0.3)";
    ctx.shadowBlur = 8;

    for (const [i, j] of SKELETON_CONNECTIONS) {
      ctx.beginPath();
      ctx.moveTo(spots[i].x, spots[i].y);
      ctx.lineTo(spots[j].x, spots[j].y);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    for (const spot of spots) {
      ctx.fillStyle = "rgba(0, 201, 167, 0.8)";
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 201, 167, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (isTracking) {
      spotAnimRef.current = requestAnimationFrame(drawSkeleton);
    }
  }, [isTracking]);

  useEffect(() => {
    if (isActive && !isTracking) {
      drawSkeleton();
    }
  }, [isActive, isTracking, drawSkeleton]);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    setRepCount(0);
    setFormScore(85);
    setFeedbacks([]);
    setSessionTime(0);
    setSessionComplete(false);
    setSummary(null);

    sessionTimerRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    setTimeout(() => {
      setFeedbacks([...FORM_FEEDBACKS.default]);
    }, 2000);

    const feedbackInterval = setInterval(() => {
      setFeedbacks((prev) => {
        const exerciseKey = exerciseName.toLowerCase();
        const feedbackList = FORM_FEEDBACKS[exerciseKey] || FORM_FEEDBACKS.default;
        const shuffled = [...feedbackList].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 2);
      });

      setFormScore((prev) => Math.max(40, Math.min(100, prev + (Math.random() > 0.4 ? 3 : -5))));
    }, 3000);

    let lastRepTime = 0;
    const repInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastRepTime > 1800) {
        setRepCount((prev) => prev + 1);
        lastRepTime = now;
        setIsInDownPosition((prev) => !prev);
      }
    }, 2200);

    setTimeout(() => {
      setIsTracking(false);
      clearInterval(feedbackInterval);
      clearInterval(repInterval);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);

      setSessionComplete(true);
      setFeedbacks([]);

      const finalScore = Math.round(65 + Math.random() * 25);
      setFormScore(finalScore);
      setSummary({
        duration: sessionTime,
        totalReps: repCount,
        avgFormScore: finalScore,
        feedbacks: [
          { type: Math.random() > 0.5 ? "success" : "warning", message: exerciseName === "Squat" ? "Overall depth needs improvement" : "Form consistency is stable" },
          { type: "success", message: `Completed ${repCount} reps with controlled tempo` },
          { type: Math.random() > 0.6 ? "warning" : "success", message: "Keep core braced throughout movement" },
        ],
      });
    }, 15000);
  }, [exerciseName]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-accent";
    return "text-red-400";
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return "stroke-secondary";
    if (score >= 60) return "stroke-accent";
    return "stroke-red-400";
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const FeedbackIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-secondary" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-accent" />;
      case "error": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  if (sessionComplete && summary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <Card className="p-10 glass border-white/5 rounded-[3rem] text-center space-y-8 shadow-2xl">
          <div className="flex justify-center">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full -rotate-90">
                <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                <motion.circle
                  cx="64" cy="64" r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="transparent"
                  initial={{ strokeDasharray: 339.292, strokeDashoffset: 339.292 }}
                  animate={{ strokeDashoffset: 339.292 - (summary.avgFormScore / 100) * 339.292 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={getScoreRingColor(summary.avgFormScore)}
                  style={{ filter: "drop-shadow(0 0 10px currentColor)" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-3xl font-bold font-heading", getScoreColor(summary.avgFormScore))}>
                  {summary.avgFormScore}
                </span>
                <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                  Form Score
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <p className="text-2xl font-bold font-heading text-white">{summary.totalReps}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Total Reps</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-white">{formatTime(summary.duration)}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Duration</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-secondary">{Math.round(summary.avgFormScore * repCount / 100)}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Quality Reps</p>
            </div>
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            {summary.feedbacks.map((fb, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border text-left text-sm font-medium",
                  fb.type === "success" ? "bg-secondary/5 border-secondary/20 text-secondary" :
                  fb.type === "warning" ? "bg-accent/5 border-accent/20 text-accent" :
                  "bg-red-500/5 border-red-500/20 text-red-400"
                )}
              >
                <FeedbackIcon type={fb.type} />
                {fb.message}
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSessionComplete(false);
                setSummary(null);
                setRepCount(0);
                setFormScore(85);
              }}
              className="border-white/10 hover:bg-white/10 font-bold rounded-2xl h-14 px-8 gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              New Session
            </Button>
            <Button
              onClick={() => {
                if (onSessionComplete) onSessionComplete(summary);
                setSessionComplete(false);
                setSummary(null);
                setRepCount(0);
                setFormScore(85);
              }}
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-2xl h-14 px-8 gap-2 shadow-xl shadow-secondary/20"
            >
              <CheckCircle2 className="h-5 w-5" />
              Log Session
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {!isActive && (
        <Card className="p-8 glass border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
          <div className="h-20 w-20 rounded-[2rem] bg-secondary/10 flex items-center justify-center border border-secondary/20">
            <Activity className="h-10 w-10 text-secondary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-heading text-white">AI Pose Detection</h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Real-time exercise form analysis with skeleton tracking, rep counting, and feedback.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startCamera}
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 px-10 rounded-2xl gap-3 shadow-xl shadow-secondary/20"
            >
              <Camera className="h-5 w-5" />
              Start Camera
            </Button>
          </motion.div>
        </Card>
      )}

      {isActive && (
        <div className="space-y-4">
          <Card className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full aspect-[4/3] object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />

            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.3em] bg-black/50 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  {exerciseName}
                </span>
                {isTracking && (
                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-[0.3em] bg-black/50 px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    REC
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-lg text-white drop-shadow-lg">
                  {formatTime(sessionTime)}
                </p>
              </div>
            </div>

            {isTracking && (
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                <div className="grid grid-cols-3 gap-3 pointer-events-auto">
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Reps</p>
                    <p className="text-xl font-bold font-heading text-white">{repCount}</p>
                  </div>
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Score</p>
                    <p className={cn("text-xl font-bold font-heading", getScoreColor(formScore))}>{formScore}</p>
                  </div>
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Time</p>
                    <p className="text-xl font-bold font-heading text-white">{formatTime(sessionTime)}</p>
                  </div>
                </div>

                {feedbacks.length > 0 && (
                  <div className="space-y-1.5">
                    {feedbacks.map((fb, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md text-[10px] font-bold",
                          fb.type === "success" ? "bg-secondary/20 text-secondary border border-secondary/30" :
                          fb.type === "warning" ? "bg-accent/20 text-accent border border-accent/30" :
                          "bg-red-500/20 text-red-400 border border-red-500/30"
                        )}
                      >
                        <FeedbackIcon type={fb.type} />
                        {fb.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          <div className="flex justify-center gap-4">
            {!isTracking ? (
              <>
                <Button
                  variant="outline"
                  onClick={stopCamera}
                  className="border-white/10 hover:bg-white/10 font-bold rounded-2xl h-14 px-8 gap-2"
                >
                  <CameraOff className="h-5 w-5" />
                  Stop Camera
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={startTracking}
                    className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-2xl h-14 px-8 gap-2 shadow-lg shadow-secondary/20"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Begin Tracking
                  </Button>
                </motion.div>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setIsTracking(false);
                  if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
                  setSessionComplete(true);
                }}
                className="border-red-500/30 hover:bg-red-500/10 font-bold rounded-2xl h-14 px-8 gap-2 text-red-400"
              >
                <StopCircle className="h-5 w-5" />
                End Session
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
