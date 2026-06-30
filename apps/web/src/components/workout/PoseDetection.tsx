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
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
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

const KEYPOINT_NAMES = [
  "nose", "left_eye", "right_eye", "left_ear", "right_ear",
  "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
  "left_wrist", "right_wrist", "left_hip", "right_hip",
  "left_knee", "right_knee", "left_ankle", "right_ankle",
];

const SKELETON_CONNECTIONS: [number, number][] = [
  [5, 6], [5, 7], [7, 9], [6, 8], [8, 10],
  [5, 11], [6, 12], [11, 12], [11, 13], [13, 15],
  [12, 14], [14, 16],
];

export function PoseDetection({ exerciseName = "Exercise", onSessionComplete }: PoseDetectionProps) {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(85);
  const [feedbacks, setFeedbacks] = useState<FormFeedback[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const detectorRef = useRef<any>(null);
  const repPhaseRef = useRef<"up" | "down">("up");
  const lastRepTimeRef = useRef(0);
  const formScoresRef = useRef<number[]>([]);
  const feedbackLogRef = useRef<FormFeedback[]>([]);
  const lastFeedbackTimeRef = useRef(0);

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
    detectorRef.current = null;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    setSessionTime(0);
    repPhaseRef.current = "up";
    formScoresRef.current = [];
    feedbackLogRef.current = [];
  }, [stream]);

  const getAngle = (a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) => {
    const ab = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    const bc = Math.sqrt((b.x - c.x) ** 2 + (b.y - c.y) ** 2);
    const ac = Math.sqrt((c.x - a.x) ** 2 + (c.y - a.y) ** 2);
    return Math.acos((ab * ab + bc * bc - ac * ac) / (2 * ab * bc)) * (180 / Math.PI);
  };

  const analyzeForm = useCallback((keypoints: any[]) => {
    const kp = (name: string) => keypoints.find((k: any) => k.name === name);

    const lShoulder = kp("left_shoulder");
    const rShoulder = kp("right_shoulder");
    const lHip = kp("left_hip");
    const rHip = kp("right_hip");
    const lKnee = kp("left_knee");
    const rKnee = kp("right_knee");
    const lAnkle = kp("left_ankle");
    const rAnkle = kp("right_ankle");

    const newFeedbacks: FormFeedback[] = [];
    let score = 85;

    if (lHip && lKnee && lAnkle && rHip && rKnee && rAnkle) {
      const lAngle = getAngle(lHip, lKnee, lAnkle);
      const rAngle = getAngle(rHip, rKnee, rAnkle);
      const avgAngle = (lAngle + rAngle) / 2;

      if (avgAngle < 90) {
        newFeedbacks.push({ type: "success", message: "Great depth — full range of motion achieved" });
        score += 5;
      } else if (avgAngle < 120) {
        newFeedbacks.push({ type: "warning", message: "Go deeper — aim for at least 90 degrees at the knee" });
        score -= 3;
      } else {
        newFeedbacks.push({ type: "error", message: "Depth too shallow — lower until hips are below knees" });
        score -= 8;
      }
    }

    if (lShoulder && lHip && lKnee && rShoulder && rHip && rKnee) {
      const lTorso = getAngle(lShoulder, lHip, lKnee);
      const rTorso = getAngle(rShoulder, rHip, rKnee);

      if (lTorso > 160 && rTorso > 160) {
        newFeedbacks.push({ type: "success", message: "Chest upright — excellent posture" });
        score += 3;
      } else if (lTorso < 140 || rTorso < 140) {
        newFeedbacks.push({ type: "error", message: "Chest dropping forward — keep torso upright" });
        score -= 5;
      }
    }

    if (lHip && lKnee && rHip && rKnee) {
      const hipDiff = Math.abs(
        getAngle({ x: lHip.x - 10, y: lHip.y }, lHip, lKnee) -
        getAngle({ x: rHip.x - 10, y: rHip.y }, rHip, rKnee)
      );
      if (hipDiff > 15) {
        newFeedbacks.push({ type: "warning", message: "Weight shifting to one side — distribute evenly" });
        score -= 3;
      }
    }

    if (lShoulder && rShoulder && lHip && rHip) {
      const shoulderWidth = Math.abs(lShoulder.x - rShoulder.x);
      const hipWidth = Math.abs(lHip.x - rHip.x);
      if (shoulderWidth > hipWidth * 1.8) {
        newFeedbacks.push({ type: "warning", message: "Stance too wide — bring feet closer" });
        score -= 2;
      }
    }

    const now = Date.now();
    if (newFeedbacks.length > 0 && now - lastFeedbackTimeRef.current > 4000) {
      feedbackLogRef.current = [...feedbackLogRef.current, ...newFeedbacks].slice(-6);
      lastFeedbackTimeRef.current = now;
    }

    formScoresRef.current.push(Math.max(40, Math.min(100, score)));
    return score;
  }, []);

  const detectPose = useCallback(async () => {
    if (!detectorRef.current || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const poses = await detectorRef.current.estimatePoses(video);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (poses.length > 0 && poses[0].keypoints) {
        const keypoints = poses[0].keypoints;
        const visible = keypoints.filter((kp: any) => (kp.score || 0) > 0.3);

        ctx.strokeStyle = "rgba(0, 201, 167, 0.6)";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(0, 201, 167, 0.3)";
        ctx.shadowBlur = 8;

        for (const [i, j] of SKELETON_CONNECTIONS) {
          const a = visible.find((k: any) => k.name === KEYPOINT_NAMES[i]);
          const b = visible.find((k: any) => k.name === KEYPOINT_NAMES[j]);
          if (a && b) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        ctx.shadowBlur = 0;
        for (const kp of visible) {
          ctx.fillStyle = "rgba(0, 201, 167, 0.8)";
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        if (isTracking) {
          const score = analyzeForm(visible);
          setFormScore(Math.round(
            formScoresRef.current.reduce((a: number, b: number) => a + b, 0) / formScoresRef.current.length
          ));
          setFeedbacks([...feedbackLogRef.current]);

          const lHip = keypoints.find((k: any) => k.name === "left_hip");
          const rHip = keypoints.find((k: any) => k.name === "right_hip");
          const lKnee = keypoints.find((k: any) => k.name === "left_knee");
          const rKnee = keypoints.find((k: any) => k.name === "right_knee");

          if (lHip && rHip && lKnee && rKnee) {
            const avgHipY = (lHip.y + rHip.y) / 2;
            const avgKneeY = (lKnee.y + rKnee.y) / 2;
            const squatDepth = avgHipY - avgKneeY;
            const now = Date.now();

            if (squatDepth > 30 && repPhaseRef.current === "up" && now - lastRepTimeRef.current > 800) {
              repPhaseRef.current = "down";
            } else if (squatDepth < 10 && repPhaseRef.current === "down" && now - lastRepTimeRef.current > 800) {
              repPhaseRef.current = "up";
              setRepCount((prev) => prev + 1);
              lastRepTimeRef.current = now;
            }
          }
        }
      } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    } catch {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    animFrameRef.current = requestAnimationFrame(detectPose);
  }, [isTracking, analyzeForm]);

  useEffect(() => {
    if (isActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadeddata = () => {
        detectPose();
      };
    }
  }, [isActive, stream, detectPose]);

  const startTracking = useCallback(async () => {
    setModelLoading(true);
    try {
      const [tfjs, poseDetection] = await Promise.all([
        import("@tensorflow/tfjs-core"),
        import("@tensorflow-models/pose-detection"),
        import("@tensorflow/tfjs-backend-webgl"),
      ]);
      await tfjs.ready();

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );
      detectorRef.current = detector;
    } catch {
      setModelLoading(false);
      alert("Failed to load pose detection model. Please try a different browser.");
      return;
    }

    setModelLoading(false);
    setIsTracking(true);
    setRepCount(0);
    setFormScore(85);
    setFeedbacks([]);
    setSessionTime(0);
    setSessionComplete(false);
    setSummary(null);
    repPhaseRef.current = "up";
    formScoresRef.current = [];
    feedbackLogRef.current = [];
    lastRepTimeRef.current = Date.now();

    sessionTimerRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const endSession = useCallback(() => {
    setIsTracking(false);
    detectorRef.current = null;
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);

    const scores = formScoresRef.current;
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : 85;

    const fb = feedbackLogRef.current;
    const finalFeedbacks = fb.length > 0 ? fb : [
      { type: "success" as const, message: `Completed ${repCount} reps with real-time tracking` },
    ];

    setSessionComplete(true);
    setFormScore(avgScore);
    setFeedbacks([]);
    setSummary({
      duration: sessionTime,
      totalReps: repCount,
      avgFormScore: avgScore,
      feedbacks: finalFeedbacks,
    });
  }, [sessionTime, repCount]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, []);

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
              Real-time exercise form analysis powered by TensorFlow.js MoveNet — no server required.
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

            {modelLoading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary mx-auto" />
                  <p className="text-sm text-white/80 font-medium">Loading AI Model...</p>
                  <p className="text-[10px] text-muted-foreground">Downloading MoveNet pose detector</p>
                </div>
              </div>
            )}

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
                    {feedbacks.slice(-3).map((fb, idx) => (
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
                {!modelLoading && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={startTracking}
                      className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-2xl h-14 px-8 gap-2 shadow-lg shadow-secondary/20"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      Begin Tracking
                    </Button>
                  </motion.div>
                )}
              </>
            ) : (
              <Button
                variant="outline"
                onClick={endSession}
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
