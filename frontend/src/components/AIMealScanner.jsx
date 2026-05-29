import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  TrendingUp, 
  Check, 
  RotateCcw, 
  X, 
  Edit2, 
  Info
} from 'lucide-react';

// Pure global counters for generated simulation IDs
let customUploadIdCounter = 0;
let webcamCaptureIdCounter = 0;

// Preset Chef-Crafted Meals Data
const PRESET_MEALS = [
  {
    id: 'avocado_toast',
    name: 'Avocado Toast with Egg',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    calories: 380,
    protein: 14,
    carbs: 32,
    fats: 22,
    insights: ['High Healthy Fats', 'Good Fiber Source', 'Moderate Protein'],
    description: 'Fresh mashed avocado on toasted artisanal sourdough, topped with a soft-boiled egg and red pepper flakes.'
  },
  {
    id: 'salmon_bowl',
    name: 'Teriyaki Salmon Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    calories: 620,
    protein: 38,
    carbs: 55,
    fats: 26,
    insights: ['Rich in Omega-3', 'High Lean Protein', 'Complex Carbs'],
    description: 'Seared Atlantic salmon glazed with house-made teriyaki, served over brown rice, steamed broccoli, and edamame.'
  },
  {
    id: 'chicken_salad',
    name: 'Mediterranean Chicken Salad',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    calories: 450,
    protein: 42,
    carbs: 12,
    fats: 24,
    insights: ['Low Carb / Keto', 'High Muscle-Building Protein', 'Rich in Antioxidants'],
    description: 'Herb-grilled chicken breast tossed with crisp romaine, cucumbers, kalamata olives, cherry tomatoes, and light feta vinaigrette.'
  },
  {
    id: 'acai_bowl',
    name: 'Protein Berry Acai Bowl',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80',
    calories: 340,
    protein: 16,
    carbs: 58,
    fats: 8,
    insights: ['High Vitamin C', 'Antioxidant Superfood', 'Fast Digesting Energy'],
    description: 'Organic acai puree blended with vegan vanilla protein powder, topped with fresh berries, hemp seeds, and a drizzle of agave.'
  }
];

// Simulated Live Webcam Capture Image (High-quality Unsplash image of a steak salad/bowl)
const SIMULATED_WEBCAM_IMAGE = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80';

// Circular Progress Gauge for Macros
function MacroProgressRing({ value, target, label, color, glowClass, unit }) {
  const percentage = Math.min(100, Math.round((value / target) * 100));
  const radius = 30;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 shadow-inner">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Shadow Ring */}
        <div className="absolute inset-2 rounded-full bg-white/[0.01] blur-xs" />
        
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="stroke-white/10"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xs font-bold text-primary ${glowClass}`}>{value}</span>
          <span className="text-[8px] text-on-surface-variant uppercase font-semibold">{unit}</span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-[10px] text-on-surface-variant font-semibold block">{label}</span>
        <span className="text-[9px] text-primary-fixed/80 font-medium">{percentage}%</span>
      </div>
    </div>
  );
}

// Large Calorie Ring Gauge
function CalorieProgressRing({ value, target = 2000 }) {
  const percentage = Math.min(100, Math.round((value / target) * 100));
  const radius = 54;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center mx-auto my-2">
      {/* Decorative pulse border */}
      <div className="absolute inset-3 rounded-full border border-primary-fixed/10 animate-ping opacity-25" />
      <div className="absolute inset-5 rounded-full bg-primary-fixed/5 blur-md" />
      
      <svg className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="scannerCalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#abd600" />
            <stop offset="100%" stopColor="#00dbe9" />
          </linearGradient>
        </defs>
        <circle
          cx="72"
          cy="72"
          r={radius}
          className="stroke-white/5"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="url(#scannerCalGrad)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_6px_rgba(0,219,233,0.4)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-primary font-display-sm tracking-tight lime-glow">{value}</span>
        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Kcal</span>
        <span className="text-[9px] text-primary-fixed font-semibold mt-0.5">+{percentage}% of target</span>
      </div>
    </div>
  );
}

export default function AIMealScanner({ onLogNutrition }) {
  const [mode, setMode] = useState('select'); // 'select' | 'camera' | 'scanning' | 'results' | 'success'
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [customMealName, setCustomMealName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing AI analysis...');
  const [cameraCountdown, setCameraCountdown] = useState(null);
  
  const fileInputRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const scanningTimerRef = useRef(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (scanningTimerRef.current) clearInterval(scanningTimerRef.current);
    };
  }, []);

  // Handle Preset Select
  const handlePresetSelect = (meal) => {
    setSelectedMeal({ ...meal });
    setCustomMealName(meal.name);
    setMode('scanning');
    startScanning();
  };

  // Trigger File Input Click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle Custom File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    
    // Simulate AI scanning result based on file name or default
    const filename = file.name.toLowerCase();
    let name = 'Custom Plate Scan';
    let calories = 520;
    let protein = 24;
    let carbs = 48;
    let fats = 16;
    let insights = ['Portion Volume Detected', 'Balanced Energy Density'];

    if (filename.includes('salad') || filename.includes('chicken') || filename.includes('protein')) {
      name = 'AI Detected: Grilled Protein Salad';
      calories = 440;
      protein = 38;
      carbs = 16;
      fats = 18;
      insights = ['High Lean Protein', 'Low Carbohydrates', 'Nutrient Rich'];
    } else if (filename.includes('toast') || filename.includes('egg') || filename.includes('avocado')) {
      name = 'AI Detected: Avocado Egg Sourdough';
      calories = 410;
      protein = 15;
      carbs = 34;
      fats = 21;
      insights = ['Healthy Fats', 'Complex Carbohydrates', 'Moderate Protein'];
    } else if (filename.includes('salmon') || filename.includes('fish') || filename.includes('rice')) {
      name = 'AI Detected: Teriyaki Salmon Bowl';
      calories = 630;
      protein = 36;
      carbs = 52;
      fats = 25;
      insights = ['Rich in Omega-3', 'High Protein', 'Excellent for Recovery'];
    } else if (filename.includes('steak') || filename.includes('beef') || filename.includes('meat')) {
      name = 'AI Detected: Steak & Asparagus Plate';
      calories = 690;
      protein = 46;
      carbs = 8;
      fats = 42;
      insights = ['High Protein', 'Keto / Low Carb', 'Iron Rich'];
    } else if (filename.includes('fruit') || filename.includes('smoothie') || filename.includes('berry') || filename.includes('yogurt')) {
      name = 'AI Detected: Berry Yogurt Parfait';
      calories = 310;
      protein = 14;
      carbs = 54;
      fats = 6;
      insights = ['High Vitamin C', 'Low Fat Content', 'Quick Energy Source'];
    }

    const mockMeal = {
      id: 'custom_upload_' + (++customUploadIdCounter),
      name,
      image: imageUrl,
      calories,
      protein,
      carbs,
      fats,
      insights,
      description: 'Image upload processed using convolutional neural model matching visual features to standard recipe database.'
    };

    setSelectedMeal(mockMeal);
    setCustomMealName(mockMeal.name);
    setMode('scanning');
    startScanning();
  };

  // Start Simulated Webcam Mode
  const startCameraMode = () => {
    setMode('camera');
    setCameraCountdown(null);
  };

  // Trigger Simulated Camera Snapshot
  const captureSnapshot = () => {
    setCameraCountdown(3);
    
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    countdownIntervalRef.current = setInterval(() => {
      setCameraCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          
          // Set simulated capture result
          const mockMeal = {
            id: 'webcam_capture_' + (++webcamCaptureIdCounter),
            name: 'AI Detected: Protein Power Bowl',
            image: SIMULATED_WEBCAM_IMAGE,
            calories: 550,
            protein: 34,
            carbs: 45,
            fats: 20,
            insights: ['High Fiber', 'Lean Protein Source', 'Heart Healthy'],
            description: 'Simulated real-time camera capture. Deep neural network identifies leafy greens, red pepper, cucumber, and roasted organic chicken slices.'
          };
          
          setSelectedMeal(mockMeal);
          setCustomMealName(mockMeal.name);
          setMode('scanning');
          startScanning();
          return null;
        }
        return prev - 1;
      });
    }, 800);
  };

  // Start AI Scanner Simulation
  const startScanning = () => {
    setScanProgress(0);
    setScanStatus('Initializing neural models...');
    
    let progress = 0;
    if (scanningTimerRef.current) clearInterval(scanningTimerRef.current);

    scanningTimerRef.current = setInterval(() => {
      progress += 4;
      setScanProgress(Math.min(100, progress));

      // Dynamic scanning statuses
      if (progress < 20) {
        setScanStatus('Isolating meal container boundaries...');
      } else if (progress < 40) {
        setScanStatus('Detecting volume and portion size...');
      } else if (progress < 60) {
        setScanStatus('Matching features with food taxonomy...');
      } else if (progress < 80) {
        setScanStatus('Retrieving USDA nutritional indexes...');
      } else if (progress < 95) {
        setScanStatus('Calculating protein/carb/lipid ratios...');
      } else {
        setScanStatus('Finalizing analysis report...');
      }

      if (progress >= 100) {
        clearInterval(scanningTimerRef.current);
        // Timeout to reveal results smoothly
        setTimeout(() => {
          setMode('results');
        }, 300);
      }
    }, 100);
  };

  // Log Nutrition Callback Trigger
  const handleLogNutrition = () => {
    if (!selectedMeal) return;
    
    // Call parent stats updater
    if (onLogNutrition) {
      // Use custom name if edited by user
      const finalMeal = {
        ...selectedMeal,
        name: customMealName
      };
      onLogNutrition(finalMeal.calories);
    }
    
    setMode('success');
  };

  // Reset Scanner State
  const resetScanner = () => {
    setMode('select');
    setSelectedMeal(null);
    setCustomMealName('');
    setIsEditingName(false);
    setScanProgress(0);
    setScanStatus('Initializing AI analysis...');
  };

  // Calculate macro totals for layout ratio line
  const totalGrams = selectedMeal ? (selectedMeal.protein + selectedMeal.carbs + selectedMeal.fats) : 1;
  const pPct = selectedMeal ? Math.round((selectedMeal.protein / totalGrams) * 100) : 0;
  const cPct = selectedMeal ? Math.round((selectedMeal.carbs / totalGrams) * 100) : 0;
  const fPct = selectedMeal ? Math.round((selectedMeal.fats / totalGrams) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden transition-all duration-350 max-w-xl mx-auto w-full">
      {/* Self-contained custom CSS styles for specific animation effects */}
      <style>{`
        @keyframes sweep-line {
          0% { top: 0%; opacity: 0.2; }
          10% { opacity: 1; }
          50% { top: 100%; opacity: 1; }
          90% { opacity: 1; }
          100% { top: 0%; opacity: 0.2; }
        }
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ripple-pulse {
          0% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.2; }
          100% { transform: scale(0.95); opacity: 0.6; }
        }
        .animate-sweep {
          animation: sweep-line 2.5s ease-in-out infinite;
        }
        .animate-radar {
          animation: radar-spin 6s linear infinite;
        }
        .animate-ripple {
          animation: ripple-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Decorative gradient corner borders */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-fixed/50 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary-fixed-dim/50 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary-fixed-dim/50 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-fixed/50 rounded-br-xl pointer-events-none" />

      {/* Title block */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/30 text-primary-fixed">
            <Sparkles className="w-4 h-4 glow-lime" />
          </div>
          <div>
            <h3 className="font-headline-lg text-base md:text-lg font-bold text-primary tracking-wide">
              AI Meal Recognizer
            </h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Computer Vision Macros
            </p>
          </div>
        </div>
        {mode !== 'select' && (
          <button 
            onClick={resetScanner}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-on-surface-variant hover:text-white transition-all cursor-pointer"
            title="Reset scanner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ========================================== */}
      {/* 1. SELECTION STATE                         */}
      {/* ========================================== */}
      {mode === 'select' && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick upload zone */}
          <div className="grid grid-cols-2 gap-4">
            {/* Choose Photo */}
            <div 
              onClick={handleUploadClick}
              className="group border border-dashed border-white/10 hover:border-primary-fixed/50 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 active:scale-98 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 rounded-full bg-primary-fixed/10 border border-primary-fixed/20 flex items-center justify-center mb-3 text-primary-fixed group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 glow-lime" />
              </div>
              <span className="font-label-md text-xs text-primary mb-1">Upload Photo</span>
              <span className="text-[9px] text-on-surface-variant">JPG, PNG up to 5MB</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Webcam Stream Simulator */}
            <div 
              onClick={startCameraMode}
              className="group border border-dashed border-white/10 hover:border-secondary-fixed-dim/50 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 active:scale-98 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-fixed-dim/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 rounded-full bg-secondary-fixed-dim/10 border border-secondary-fixed-dim/20 flex items-center justify-center mb-3 text-secondary-fixed-dim group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 glow-cyan" />
              </div>
              <span className="font-label-md text-xs text-primary mb-1">Live Lens Scanner</span>
              <span className="text-[9px] text-on-surface-variant">Simulate live camera</span>
            </div>
          </div>

          {/* Quick presets divider */}
          <div className="flex items-center gap-3">
            <div className="h-px bg-white/10 flex-grow" />
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              Or Choose Preset Meal
            </span>
            <div className="h-px bg-white/10 flex-grow" />
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {PRESET_MEALS.map((meal) => (
              <div 
                key={meal.id}
                onClick={() => handlePresetSelect(meal)}
                className="group flex gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden active:scale-98"
              >
                {/* Overlay Glow hover */}
                <div className="absolute -inset-y-1 left-0 w-1 bg-gradient-to-b from-primary-fixed to-secondary-fixed-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/5 bg-surface-variant relative">
                  <img 
                    src={meal.image} 
                    alt={meal.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-0.5 right-0.5 bg-black/60 backdrop-blur-xs px-1 rounded text-[8px] text-primary-fixed font-bold">
                    {meal.calories} kcal
                  </div>
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="font-label-md text-xs text-primary truncate group-hover:text-primary-fixed-dim transition-colors">
                    {meal.name}
                  </span>
                  <p className="text-[9px] text-on-surface-variant line-clamp-2 mt-0.5">
                    {meal.description}
                  </p>
                  <div className="flex gap-2 mt-1.5 text-[8px] font-semibold text-primary/60">
                    <span>P: <strong className="text-secondary-fixed-dim">{meal.protein}g</strong></span>
                    <span>C: <strong className="text-primary-fixed">{meal.carbs}g</strong></span>
                    <span>F: <strong className="text-orange-300">{meal.fats}g</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Banner */}
          <div className="p-3.5 rounded-xl bg-primary-fixed/5 border border-primary-fixed/10 flex items-start gap-3">
            <Info className="w-4 h-4 text-primary-fixed shrink-0 mt-0.5" />
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              Our simulation replicates advanced <strong>computer vision food segmentation</strong> models. Uploading or choosing a preset initiates portion estimation algorithms and queries nutritional database values.
            </p>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. CAMERA VIEWFINDER SIMULATOR            */}
      {/* ========================================== */}
      {mode === 'camera' && (
        <div className="space-y-5 animate-fade-in text-center">
          <div className="relative aspect-video max-w-sm mx-auto rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
            {/* Scanning grids and UI overlays */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/70 z-10" />
            
            {/* Focus Reticles */}
            <div className="absolute w-12 h-12 border-t-2 border-l-2 border-secondary-fixed-dim top-6 left-6 z-20" />
            <div className="absolute w-12 h-12 border-t-2 border-r-2 border-secondary-fixed-dim top-6 right-6 z-20" />
            <div className="absolute w-12 h-12 border-b-2 border-l-2 border-secondary-fixed-dim bottom-6 left-6 z-20" />
            <div className="absolute w-12 h-12 border-b-2 border-r-2 border-secondary-fixed-dim bottom-6 right-6 z-20" />
            
            {/* Center target circle */}
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-white/20 flex items-center justify-center z-20">
              <div className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-ping" />
            </div>

            {/* REC indicator */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[9px] text-red-500 font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LENS LIVE
            </div>

            {/* Guide Text */}
            <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white/90 border border-white/5 inline-block">
                Center your plate inside the viewfinder
              </span>
            </div>

            {cameraCountdown !== null ? (
              <div className="z-30 text-5xl font-extrabold text-primary animate-scale-up font-display-sm select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                {cameraCountdown}
              </div>
            ) : (
              <div className="z-10 flex flex-col items-center gap-2">
                <Camera className="w-10 h-10 text-white/30 animate-pulse" />
                <span className="text-[10px] text-white/40">Camera Ready</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setMode('select')}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-primary transition-all font-semibold active:scale-95 cursor-pointer"
              disabled={cameraCountdown !== null}
            >
              Cancel
            </button>
            <button
              onClick={captureSnapshot}
              className="px-5 py-2 rounded-lg bg-secondary-fixed-dim text-on-secondary-fixed font-semibold text-xs hover:bg-white transition-all shadow-lg active:scale-95 flex items-center gap-1.5 cursor-pointer"
              disabled={cameraCountdown !== null}
            >
              <Camera className="w-4 h-4" />
              Capture Meal
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. SCANNING EFFECT STATE                   */}
      {/* ========================================== */}
      {mode === 'scanning' && selectedMeal && (
        <div className="space-y-6 animate-fade-in text-center">
          {/* Main Scanning Card Visual */}
          <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border border-white/15 bg-surface-container shadow-2xl">
            {/* The Image being scanned */}
            <img 
              src={selectedMeal.image} 
              alt="Scanning..." 
              className="w-full h-full object-cover scale-105 filter blur-[0.5px]"
            />
            
            {/* Radial overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            {/* Neon brackets */}
            <div className="absolute inset-4 border border-dashed border-white/10 rounded-xl" />
            
            {/* Visual Laser Line Sweep */}
            <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00eefc] to-transparent shadow-[0_0_12px_#00eefc] z-20 animate-sweep" />

            {/* Holographic Radar spinner */}
            <div className="absolute inset-8 rounded-full border border-primary-fixed/20 border-dashed animate-radar z-10 pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-secondary-fixed-dim/20 border-dotted animate-spin z-10 pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '4s' }} />

            {/* Percentage counter in center */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center">
                <span className="text-2xl font-extrabold text-secondary-fixed-dim font-display-sm tracking-tight">
                  {scanProgress}%
                </span>
                <span className="text-[8px] text-white/50 uppercase tracking-widest font-bold">
                  Analyzing
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar and logs */}
          <div className="space-y-3 max-w-sm mx-auto">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#abd600] to-[#00dbe9] transition-all duration-100 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            
            <div className="flex justify-center items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping" />
              <p className="text-xs text-primary-fixed-dim font-semibold tracking-wide italic">
                {scanStatus}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. RESULTS DISPLAY STATE                   */}
      {/* ========================================== */}
      {mode === 'results' && selectedMeal && (
        <div className="space-y-6 animate-fade-in">
          {/* Meal Intro Row */}
          <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-surface-variant relative shadow-md">
              <img src={selectedMeal.image} alt={selectedMeal.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow min-w-0 flex flex-col justify-center">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input 
                    type="text" 
                    value={customMealName}
                    onChange={(e) => setCustomMealName(e.target.value)}
                    className="bg-background border border-primary-fixed rounded px-2 py-0.5 text-xs text-primary focus:outline-none flex-grow min-w-0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingName(false);
                    }}
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsEditingName(false)}
                    className="p-1 rounded bg-primary-fixed text-on-primary-fixed hover:bg-white transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 group">
                  <h4 className="font-headline-lg text-sm md:text-base font-bold text-primary truncate leading-snug">
                    {customMealName}
                  </h4>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="opacity-40 group-hover:opacity-100 p-0.5 text-on-surface-variant hover:text-primary transition-all rounded hover:bg-white/5"
                    title="Edit meal name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-[10px] text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                {selectedMeal.description}
              </p>
            </div>
          </div>

          {/* Macro Displays */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Calories Ring (left) */}
            <div className="md:col-span-5 text-center bg-white/[0.01] border border-white/5 rounded-xl py-3 shadow-inner">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Total Calories
              </span>
              <CalorieProgressRing value={selectedMeal.calories} target={2000} />
            </div>

            {/* Individual Macro Progress Rings (right) */}
            <div className="md:col-span-7 grid grid-cols-3 gap-3">
              <MacroProgressRing 
                value={selectedMeal.protein} 
                target={90} 
                label="Protein" 
                color="#00dbe9" 
                glowClass="glow-cyan text-secondary-fixed-dim" 
                unit="g"
              />
              <MacroProgressRing 
                value={selectedMeal.carbs} 
                target={220} 
                label="Carbs" 
                color="#abd600" 
                glowClass="glow-lime text-primary-fixed-dim" 
                unit="g"
              />
              <MacroProgressRing 
                value={selectedMeal.fats} 
                target={65} 
                label="Fats" 
                color="#ffb77f" 
                glowClass="text-orange-300" 
                unit="g"
              />
            </div>
          </div>

          {/* Comparison Macro Ratios Layout Bar */}
          <div className="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold">
              <span>ESTIMATED MACRO DISTRIBUTION</span>
              <span className="text-primary-fixed">{totalGrams}g Total</span>
            </div>
            
            {/* Multi-segment Progress Bar */}
            <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-white/5 border border-white/5">
              <div 
                style={{ width: `${pPct}%` }} 
                className="bg-secondary-fixed-dim hover:opacity-90 transition-opacity cursor-pointer" 
                title={`Protein: ${pPct}%`}
              />
              <div 
                style={{ width: `${cPct}%` }} 
                className="bg-primary-fixed hover:opacity-90 transition-opacity cursor-pointer" 
                title={`Carbs: ${cPct}%`}
              />
              <div 
                style={{ width: `${fPct}%` }} 
                className="bg-amber-300 hover:opacity-90 transition-opacity cursor-pointer" 
                title={`Fats: ${fPct}%`}
              />
            </div>
            
            <div className="flex justify-between text-[9px] font-semibold text-on-surface-variant pt-1 px-1">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim" />
                Protein: {selectedMeal.protein}g ({pPct}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed" />
                Carbs: {selectedMeal.carbs}g ({cPct}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                Fats: {selectedMeal.fats}g ({fPct}%)
              </span>
            </div>
          </div>

          {/* AI Insights bullets */}
          <div className="space-y-2">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
              Nutritionist Insights
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedMeal.insights.map((insight, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/5 border border-white/5 hover:border-white/10 text-primary-fixed-dim flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3 h-3 text-[#00dbe9]" />
                  {insight}
                </span>
              ))}
            </div>
          </div>

          {/* Control Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={resetScanner}
              className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold text-xs text-primary active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Scan Another
            </button>
            <button
              onClick={handleLogNutrition}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-fixed to-[#00dbe9] hover:from-white hover:to-white text-on-primary-fixed hover:text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(171,214,0,0.2)] active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Log to Nutrition
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. SUCCESS LOGGED OVERLAY/STATE           */}
      {/* ========================================== */}
      {mode === 'success' && selectedMeal && (
        <div className="text-center py-8 space-y-6 animate-fade-in">
          {/* Animated checkmark indicator */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary-fixed/10 border border-primary-fixed/20 animate-ripple" />
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-fixed to-secondary-fixed-dim flex items-center justify-center shadow-lg shadow-primary-fixed/20">
              <Check className="w-7 h-7 text-on-primary-fixed stroke-[3]" />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-display-sm text-lg font-bold text-primary lime-glow">
              Meal Successfully Logged!
            </h4>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
              Added <strong>{selectedMeal.calories} kcal</strong> from <em>{customMealName}</em> to your daily nutrition dashboard.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 max-w-xs mx-auto flex justify-between items-center text-xs">
            <div className="text-left">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Logged Macros</span>
              <span className="text-primary font-bold">{selectedMeal.calories} kcal</span>
            </div>
            <div className="flex gap-2.5 text-[10px] font-bold text-on-surface-variant">
              <span className="text-secondary-fixed-dim">P: {selectedMeal.protein}g</span>
              <span className="text-primary-fixed">C: {selectedMeal.carbs}g</span>
              <span className="text-orange-300">F: {selectedMeal.fats}g</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={resetScanner}
              className="px-6 py-2.5 rounded-xl bg-primary-fixed hover:bg-white text-on-primary-fixed hover:text-black font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Analyze Another Meal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
