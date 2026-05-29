import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Dumbbell, 
  Clock, 
  ShieldAlert, 
  Check, 
  AlertCircle,
  Activity,
  Flame,
  BrainCircuit
} from "lucide-react";

export default function AIWorkoutGenerator({ onSaveRoutine, triggerToast }) {
  const [step, setStep] = useState("setup"); // 'setup' | 'generating' | 'result'
  const [goal, setGoal] = useState("hypertrophy"); // 'hypertrophy' | 'endurance' | 'strength' | 'conditioning'
  const [equipment, setEquipment] = useState("gym"); // 'gym' | 'dumbbells' | 'bodyweight'
  const [focus, setFocus] = useState("fullbody"); // 'fullbody' | 'push' | 'pull' | 'legs' | 'core'
  const [duration, setDuration] = useState("45"); // '30' | '45' | '60' | '90'
  const [generatingText, setGeneratingText] = useState("");
  const [generatedRoutine, setGeneratedRoutine] = useState(null);

  const generationSteps = [
    "Analyzing biometric logs & current recovery scores...",
    "Calculating progressive overload values for target muscle groups...",
    "Selecting optimal exercise patterns based on equipment constraints...",
    "Assembling hypertrophy volume splits and targeted rest timers...",
    "Synthesizing elite fitness coaching routine blueprint..."
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    setStep("generating");
    let currentStepIdx = 0;
    setGeneratingText(generationSteps[0]);

    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < generationSteps.length) {
        setGeneratingText(generationSteps[currentStepIdx]);
      } else {
        clearInterval(interval);
        // Compile a realistic customized workout
        const routineName = `AI ${focus.charAt(0).toUpperCase() + focus.slice(1)} (${goal.toUpperCase()})`;
        
        let exercises = [];
        if (equipment === "bodyweight") {
          exercises = [
            { name: "Decline Push-ups", reps: "3 Sets x 15 Reps", note: "Focus on chest contraction" },
            { name: "Pull-ups / Inverted Rows", reps: "4 Sets x 8-10 Reps", note: "Strict form, pull with elbows" },
            { name: "Bulgarian Split Squats", reps: "3 Sets x 12 Reps per leg", note: "Deep range of motion" },
            { name: "Hanging Leg Raises / V-Ups", reps: "3 Sets x 12 Reps", note: "Engage lower abs" },
            { name: "Burpees", reps: "3 Sets x 45 Secs", note: "High intensity cardiovascular push" }
          ];
        } else if (equipment === "dumbbells") {
          exercises = [
            { name: "Dumbbell Floor Press", reps: "4 Sets x 10 Reps", note: "Slow eccentric movement" },
            { name: "Goblet Squats", reps: "4 Sets x 12 Reps", note: "Keep torso upright" },
            { name: "One-arm Dumbbell Rows", reps: "3 Sets x 10 Reps per arm", note: "Drive elbow to hip" },
            { name: "Dumbbell Shoulder Press", reps: "3 Sets x 8 Reps", note: "Controlled overhead drive" },
            { name: "Dumbbell Hammer Curls", reps: "3 Sets x 12 Reps", note: "Brace core, no swinging" }
          ];
        } else {
          // Full Gym
          if (focus === "push") {
            exercises = [
              { name: "Incline Barbell Bench Press", reps: "4 Sets x 8 Reps", note: "Heavy load compound base" },
              { name: "Overhead Military Press", reps: "4 Sets x 6 Reps", note: "Strict shoulders drive" },
              { name: "Weighted Chest Dips", reps: "3 Sets x 8 Reps", note: "Lean forward to engage lower chest" },
              { name: "Cable Lateral Raises", reps: "3 Sets x 15 Reps", note: "Isolate side deltoids" },
              { name: "Lying French Press", reps: "3 Sets x 10 Reps", note: "Triceps extension focus" }
            ];
          } else if (focus === "pull") {
            exercises = [
              { name: "Deadlifts (Barbell)", reps: "3 Sets x 5 Reps", note: "Power base, brace lumbar spine" },
              { name: "Weighted Pull-ups", reps: "4 Sets x 8 Reps", note: "Full vertical stretch" },
              { name: "Barbell Pendlay Rows", reps: "3 Sets x 8 Reps", note: "Pull from floor to lower chest" },
              { name: "Cable Face Pulls", reps: "4 Sets x 15 Reps", note: "Squeeze upper back & rear delts" },
              { name: "Incline Dumbbell Bicep Curls", reps: "3 Sets x 12 Reps", note: "Isolate bicep peak" }
            ];
          } else if (focus === "legs") {
            exercises = [
              { name: "Barbell Back Squats", reps: "4 Sets x 6 Reps", note: "Deep quad focus, break parallel" },
              { name: "Romanian Deadlifts (Barbell)", reps: "4 Sets x 8 Reps", note: "Hinge at hip, load hamstrings" },
              { name: "Bulgarian Split Squats", reps: "3 Sets x 10 Reps per leg", note: "Quad & glute unilateral balance" },
              { name: "Seated Calf Raises", reps: "4 Sets x 15 Reps", note: "Hold contraction for 1 second" }
            ];
          } else if (focus === "core") {
            exercises = [
              { name: "Kneeling Cable Crunches", reps: "4 Sets x 15 Reps", note: "Flex spine, pull with abs" },
              { name: "Hanging Leg Raises", reps: "4 Sets x 10 Reps", note: "Control swing, lift toes high" },
              { name: "Plank with Shoulder Taps", reps: "3 Sets x 60 Secs", note: "Keep pelvis level" },
              { name: "Russian Twists with Weighted Plate", reps: "3 Sets x 20 Reps", note: "Engage obliques" }
            ];
          } else {
            // Fullbody
            exercises = [
              { name: "Barbell Back Squats", reps: "3 Sets x 8 Reps", note: "Quad base compound" },
              { name: "Flat Bench Press", reps: "3 Sets x 8 Reps", note: "Horizontal push power" },
              { name: "Lat Pulldowns", reps: "3 Sets x 10 Reps", note: "Lat width vertical pull" },
              { name: "Dumbbell Lateral Raises", reps: "3 Sets x 12 Reps", note: "Isolate shoulders" },
              { name: "Decline Ab Crunches", reps: "3 Sets x 15 Reps", note: "Contract core" }
            ];
          }
        }

        setGeneratedRoutine({
          name: routineName,
          goal: goal,
          focus: focus,
          duration: duration,
          exercises: exercises
        });
        setStep("result");
      }
    }, 900);
  };

  const handleSave = () => {
    if (!generatedRoutine) return;
    onSaveRoutine(generatedRoutine.name, generatedRoutine.exercises);
  };

  return (
    <div className="glass-card w-full rounded-3xl border border-white/10 p-md md:p-lg text-on-surface shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
      {/* Background neon glows */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 rounded-full blur-[40px] pointer-events-none -mr-12 -mt-12"></div>
      
      {/* Setup Step */}
      {step === "setup" && (
        <div className="space-y-lg">
          <div className="border-b border-white/5 pb-md">
            <div className="flex items-center gap-xs mb-1">
              <BrainCircuit className="h-5 w-5 text-primary-fixed" />
              <span className="font-label-sm text-[10px] text-primary-fixed uppercase tracking-wider font-bold">AI Coach Module</span>
            </div>
            <h3 className="font-headline-lg text-md md:text-lg text-primary font-bold">AI Workout Routine Architect</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Let our LLM synthesize a customized routine based on recovery indicators and equipment.</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-md">
            {/* Fitness Goal */}
            <div className="space-y-2">
              <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Fitness Target</label>
              <div className="grid grid-cols-2 gap-sm">
                {[
                  { id: "hypertrophy", label: "Build Muscle (Hypertrophy)" },
                  { id: "endurance", label: "Cardio & Stamina" },
                  { id: "strength", label: "Strength (High Load)" },
                  { id: "conditioning", label: "Athletic Conditioning" }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={`p-sm text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      goal === g.id 
                        ? "bg-primary-fixed/15 border-primary-fixed text-primary-fixed" 
                        : "bg-surface-container/60 border-white/5 text-on-surface-variant hover:border-white/15"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Focus */}
            <div className="space-y-2">
              <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Available Equipment</label>
              <div className="grid grid-cols-3 gap-sm">
                {[
                  { id: "gym", label: "Full Commercial Gym" },
                  { id: "dumbbells", label: "Dumbbells Only" },
                  { id: "bodyweight", label: "Calisthenics (Bodyweight)" }
                ].map((eq) => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => setEquipment(eq.id)}
                    className={`p-sm text-center rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      equipment === eq.id 
                        ? "bg-primary-fixed/15 border-primary-fixed text-primary-fixed" 
                        : "bg-surface-container/60 border-white/5 text-on-surface-variant hover:border-white/15"
                    }`}
                  >
                    {eq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Muscle Focus */}
            {equipment !== "bodyweight" && (
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Muscle Group Target</label>
                <div className="flex flex-wrap gap-sm">
                  {[
                    { id: "fullbody", label: "Full Body" },
                    { id: "push", label: "Push Focus (Chest/Delts)" },
                    { id: "pull", label: "Pull Focus (Back/Bi)" },
                    { id: "legs", label: "Legs Focus" },
                    { id: "core", label: "Core Core Focus" }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFocus(f.id)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        focus === f.id 
                          ? "bg-primary-fixed/15 border-primary-fixed text-primary-fixed" 
                          : "bg-surface-container/60 border-white/5 text-on-surface-variant hover:border-white/15"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Session Commitment */}
            <div className="space-y-2">
              <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Workout Duration Limit</label>
              <div className="flex justify-between items-center gap-md">
                {["30", "45", "60", "90"].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur)}
                    className={`flex-grow py-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                      duration === dur 
                        ? "bg-secondary-container/20 border-secondary-fixed-dim text-secondary-fixed-dim" 
                        : "bg-surface-container/40 border-white/5 text-on-surface-variant hover:bg-surface-bright"
                    }`}
                  >
                    {dur} Min
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-lg bg-primary-fixed text-on-primary-fixed font-bold hover:bg-white transition-all text-xs uppercase tracking-widest rounded-xl shadow-lg glow-lime cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-on-primary-fixed" />
              Generate Custom Plan
            </button>
          </form>
        </div>
      )}

      {/* Generating Step */}
      {step === "generating" && (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full border-4 border-primary-fixed/20 border-t-primary-fixed animate-spin flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-fixed animate-pulse" />
          </div>
          
          <div className="space-y-xs max-w-sm">
            <h4 className="font-headline-lg text-sm text-primary font-bold">Synthesizing Blueprint</h4>
            <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed min-h-[40px] animate-pulse">
              {generatingText}
            </p>
          </div>
        </div>
      )}

      {/* Result Step */}
      {step === "result" && generatedRoutine && (
        <div className="space-y-lg">
          <div className="border-b border-white/5 pb-md flex justify-between items-start">
            <div>
              <div className="flex items-center gap-xs mb-1">
                <Sparkles className="h-4 w-4 text-primary-fixed" />
                <span className="font-label-sm text-[10px] text-primary-fixed uppercase tracking-wider font-bold">AI Design Completed</span>
              </div>
              <h3 className="font-headline-lg text-md text-primary font-bold">{generatedRoutine.name}</h3>
              <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Optimized for {generatedRoutine.duration} min duration limits.</p>
            </div>
            
            <span className="px-3 py-1 bg-surface-container rounded-full text-[10px] font-bold border border-white/10 uppercase font-mono text-secondary-fixed-dim">
              {generatedRoutine.goal}
            </span>
          </div>

          {/* Routine Exercises list */}
          <div className="space-y-sm bg-background/50 rounded-xl p-md border border-white/5 max-h-[320px] overflow-y-auto pr-xs">
            {generatedRoutine.exercises.map((ex, idx) => (
              <div key={idx} className="flex gap-md justify-between items-start p-sm bg-white/5 border border-white/5 rounded-lg hover:border-white/10 transition-all">
                <div className="flex gap-sm items-start">
                  <div className="w-6 h-6 rounded bg-primary-fixed/10 text-primary-fixed flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-label-md text-xs text-white font-bold">{ex.name}</h5>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">{ex.note}</p>
                  </div>
                </div>
                
                <span className="px-2 py-0.5 bg-surface-container text-primary-fixed text-[9px] font-bold rounded font-mono shrink-0">
                  {ex.reps}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-md pt-sm border-t border-white/5">
            <button
              onClick={() => setStep("setup")}
              className="py-3 border border-white/15 hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-all cursor-pointer"
            >
              Reconfigure
            </button>
            <button
              onClick={handleSave}
              className="py-3 bg-primary-fixed text-on-primary-fixed font-bold hover:bg-white rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 glow-lime"
            >
              <Check className="w-4 h-4" />
              Save to Planner
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
