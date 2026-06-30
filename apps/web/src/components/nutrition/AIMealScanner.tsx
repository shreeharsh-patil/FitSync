"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Camera,
  CameraOff,
  Scan,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Utensils,
  Sparkles,
  X,
  Edit3,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { analyzeMealPhoto } from "@/lib/actions";

interface DetectedFood {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

interface ScannerResult {
  items: DetectedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface AIMealScannerProps {
  onLogMeal?: (result: ScannerResult) => void;
}

export function AIMealScanner({ onLogMeal }: AIMealScannerProps) {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<ScannerResult | null>(null);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<DetectedFood | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError("Camera access denied. Please enable camera permissions or use manual entry.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsActive(false);
    setCapturedImage(null);
    setResult(null);
    setEditingItem(null);
    setEditValues(null);
    setError(null);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);

    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsActive(false);

    analyzeImage(imageData);
  }, [stream]);

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    const analysisResult = await analyzeMealPhoto(imageData);

    clearInterval(stepInterval);

    if (analysisResult.success) {
      setResult({
        items: analysisResult.items || [],
        totalCalories: analysisResult.totalCalories || 0,
        totalProtein: analysisResult.totalProtein || 0,
        totalCarbs: analysisResult.totalCarbs || 0,
        totalFat: analysisResult.totalFat || 0,
      });
    } else {
      setError(analysisResult.error || "Analysis failed. Please try again.");
    }

    setIsAnalyzing(false);
    setAnalysisStep(0);
  };

  const startEditItem = (index: number) => {
    if (!result) return;
    setEditingItem(index);
    setEditValues({ ...result.items[index] });
  };

  const saveEditItem = () => {
    if (editingItem === null || !editValues || !result) return;
    const newItems = [...result.items];
    newItems[editingItem] = editValues;
    const totals = newItems.reduce(
      (acc, item) => ({
        totalCalories: acc.totalCalories + item.calories,
        totalProtein: acc.totalProtein + item.protein,
        totalCarbs: acc.totalCarbs + item.carbs,
        totalFat: acc.totalFat + item.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );
    setResult({ items: newItems, ...totals });
    setEditingItem(null);
    setEditValues(null);
  };

  const resetScan = () => {
    setCapturedImage(null);
    setResult(null);
    setEditingItem(null);
    setEditValues(null);
    setError(null);
  };

  const handleLogMeal = () => {
    if (result && onLogMeal) {
      onLogMeal(result);
      resetScan();
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-secondary";
    if (confidence >= 0.7) return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {!isActive && !capturedImage && !result && !error && (
        <Card className="p-8 glass border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
          <div className="h-20 w-20 rounded-[2rem] bg-secondary/10 flex items-center justify-center border border-secondary/20">
            <Camera className="h-10 w-10 text-secondary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-heading text-white">AI Meal Scanner</h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Point your camera at any meal and let AI analyze the nutritional content in real-time.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startCamera}
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 px-10 rounded-2xl gap-3 shadow-xl shadow-secondary/20"
            >
              <Camera className="h-5 w-5" />
              Start Scanning
            </Button>
          </motion.div>
        </Card>
      )}

      {isActive && (
        <Card className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full aspect-[4/3] object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
            <div className="flex justify-between">
              <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.3em] bg-black/50 px-3 py-1.5 rounded-xl backdrop-blur-md">
                Live Feed
              </span>
              <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
            </div>
            <div className="flex justify-center gap-4 pointer-events-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={capturePhoto}
                  className="h-16 w-16 rounded-full bg-white text-black hover:bg-white/90 shadow-2xl border-4 border-white/50"
                >
                  <div className="h-12 w-12 rounded-full border-2 border-black" />
                </Button>
              </motion.div>
            </div>
            <div className="flex justify-center pointer-events-auto">
              <Button
                variant="ghost"
                onClick={stopCamera}
                className="text-white/60 hover:text-white hover:bg-white/10 font-bold rounded-2xl gap-2"
              >
                <CameraOff className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isAnalyzing && (
        <Card className="p-10 glass border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
          <div className="relative">
            <div className="h-24 w-24 rounded-[2.5rem] bg-secondary/10 flex items-center justify-center border-2 border-secondary/30">
              <Scan className="h-12 w-12 text-secondary animate-pulse" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <Loader2 className="h-6 w-6 text-secondary" />
            </motion.div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold font-heading text-white">AI Vision Analysis</h3>
            <p className="text-sm text-muted-foreground">Identifying food items and calculating macros...</p>
          </div>
          <div className="w-full max-w-xs bg-slate-950/60 rounded-2xl p-4 border border-white/5 space-y-3">
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${((analysisStep + 1) / 4) * 100}%` }}
                className="h-full bg-secondary transition-all duration-1000"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={analysisStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[9px] text-secondary font-mono font-bold uppercase tracking-[0.3em]"
              >
                {analysisStep === 0 && "Capturing image..."}
                {analysisStep === 1 && "Analyzing food items..."}
                {analysisStep === 2 && "Calculating nutritional values..."}
                {analysisStep === 3 && "Finalizing results..."}
              </motion.p>
            </AnimatePresence>
          </div>
        </Card>
      )}

      {error && !isAnalyzing && (
        <Card className="p-8 glass border-red-500/20 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 shadow-2xl">
          <div className="h-16 w-16 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center border border-red-500/30">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Scan Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => { setError(null); startCamera(); }}
              className="border-white/10 hover:bg-white/10 font-bold rounded-2xl gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
            <Button
              variant="ghost"
              onClick={() => setError(null)}
              className="font-bold rounded-2xl"
            >
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
          </div>
        </Card>
      )}

      {result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-secondary" />
              <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetScan}
                className="border-white/10 hover:bg-white/10 font-bold rounded-2xl gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Rescan
              </Button>
              <Button
                onClick={handleLogMeal}
                className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-2xl gap-2 shadow-lg shadow-secondary/20"
              >
                <Check className="h-4 w-4" />
                Log Meal
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MacroSummaryCard label="Calories" value={result.totalCalories} unit="kcal" color="text-orange-400" />
            <MacroSummaryCard label="Protein" value={result.totalProtein} unit="g" color="text-secondary" />
            <MacroSummaryCard label="Carbs" value={result.totalCarbs} unit="g" color="text-accent" />
            <MacroSummaryCard label="Fat" value={result.totalFat} unit="g" color="text-blue-400" />
          </div>

          <Card className="p-6 glass border-white/5 rounded-[2.5rem] shadow-xl">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Utensils className="h-4 w-4 text-secondary" />
              Detected Items
            </h4>
            <div className="space-y-3">
              {result.items.map((item, idx) => (
                <div key={idx}>
                  {editingItem === idx ? (
                    <div className="p-4 bg-slate-950/60 rounded-2xl border border-secondary/30 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Name</label>
                          <input
                            value={editValues?.name || ""}
                            onChange={(e) => setEditValues((v) => v ? { ...v, name: e.target.value } : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Serving</label>
                          <input
                            value={editValues?.servingSize || ""}
                            onChange={(e) => setEditValues((v) => v ? { ...v, servingSize: e.target.value } : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Calories</label>
                          <input
                            type="number"
                            value={editValues?.calories || 0}
                            onChange={(e) => setEditValues((v) => v ? { ...v, calories: parseInt(e.target.value) || 0 } : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Protein</label>
                          <input
                            type="number"
                            value={editValues?.protein || 0}
                            onChange={(e) => setEditValues((v) => v ? { ...v, protein: parseInt(e.target.value) || 0 } : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-secondary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Carbs</label>
                          <input
                            type="number"
                            value={editValues?.carbs || 0}
                            onChange={(e) => setEditValues((v) => v ? { ...v, carbs: parseInt(e.target.value) || 0 } : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-accent"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Fat</label>
                          <input
                            type="number"
                            value={editValues?.fat || 0}
                            onChange={(e) => setEditValues((v) => v ? { ...v, fat: parseInt(e.target.value) || 0 } : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-blue-400"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingItem(null)}
                          className="text-xs font-bold"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={saveEditItem}
                          className="bg-secondary hover:bg-secondary/90 text-primary text-xs font-bold"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-secondary/20 hover:bg-white/[0.04] group transition-all">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="space-y-1 min-w-0">
                          <p className="font-bold text-white text-sm truncate">{item.name}</p>
                          <p className="text-[9px] text-muted-foreground">{item.servingSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">AI</span>
                          <span className={cn("font-mono font-bold text-xs", getConfidenceColor(item.confidence))}>
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                        <span className="font-mono font-bold text-sm text-white min-w-[50px] text-right">{item.calories}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditItem(idx)}
                          className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-all bg-white/5 hover:bg-white/10"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function MacroSummaryCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <Card className="p-5 glass border-white/5 rounded-[1.5rem] text-center space-y-2 shadow-lg">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
      <p className={cn("font-mono font-bold text-2xl", color)}>
        {value}
        <span className="text-[10px] text-muted-foreground ml-1">{unit}</span>
      </p>
    </Card>
  );
}
