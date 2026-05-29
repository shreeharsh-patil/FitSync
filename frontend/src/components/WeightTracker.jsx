import React, { useState } from "react";
import { 
  Activity, 
  Plus, 
  Calendar, 
  TrendingDown, 
  Scale, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function WeightTracker({ userProfile, setUserProfile, triggerToast }) {
  const [unit, setUnit] = useState("kg"); // 'kg' | 'lbs'
  const [weightVal, setWeightVal] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Base values in kg (internal storage)
  const [history, setHistory] = useState([
    { id: 1, date: "May 15", kg: 69.8 },
    { id: 2, date: "May 18", kg: 69.2 },
    { id: 3, date: "May 21", kg: 68.9 },
    { id: 4, date: "May 24", kg: 68.5 },
    { id: 5, date: "May 27", kg: 68.2 },
    { id: 6, date: "May 29", kg: 68.0 }
  ]);

  const convertValue = (val, toUnit) => {
    if (toUnit === "lbs") {
      return parseFloat((val * 2.20462).toFixed(1));
    }
    return val;
  };

  const currentWeightDisplay = unit === "kg" ? userProfile.weight : convertValue(userProfile.weight, "lbs");
  const targetWeightDisplay = unit === "kg" ? 62.0 : convertValue(62.0, "lbs"); // Mock goal weight is 62kg
  
  const handleLogWeight = (e) => {
    e.preventDefault();
    const parsed = parseFloat(weightVal);
    if (!parsed || parsed <= 0) return;

    // Convert input back to kg if logged in lbs
    const kgVal = unit === "lbs" ? parseFloat((parsed / 2.20462).toFixed(2)) : parsed;
    
    // Format date string for display (e.g. "May 29")
    const dateObj = new Date(logDate);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const displayDate = `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;

    const newLog = {
      id: history.length + 1,
      date: displayDate,
      kg: kgVal
    };

    const newHistory = [...history, newLog];
    setHistory(newHistory);
    
    // Update user profile weight
    setUserProfile(prev => ({
      ...prev,
      weight: parseFloat(kgVal.toFixed(1))
    }));

    setWeightVal("");
    triggerToast(`⚖️ Weight logged: ${parsed} ${unit}`);
  };

  // SVG Chart calculation parameters
  const chartHeight = 140;
  const chartWidth = 500;
  const padding = 25;

  const getChartPoints = () => {
    if (history.length < 2) return "";
    
    const displayHistory = history.map(item => ({
      x: 0,
      y: 0,
      val: unit === "kg" ? item.kg : convertValue(item.kg, "lbs")
    }));

    const vals = displayHistory.map(h => h.val);
    const maxVal = Math.max(...vals) + 1.0;
    const minVal = Math.max(0, Math.min(...vals) - 1.0);
    const range = maxVal - minVal;

    const points = displayHistory.map((item, idx) => {
      const x = padding + (idx * (chartWidth - padding * 2)) / (displayHistory.length - 1);
      // Invert Y axis for SVG (high values near top)
      const pct = (item.val - minVal) / (range || 1);
      const y = chartHeight - padding - pct * (chartHeight - padding * 2);
      return { x, y, val: item.val, label: history[idx].date };
    });

    return points;
  };

  const chartPoints = getChartPoints();
  
  // Construct path string
  let pathStr = "";
  let areaStr = "";
  if (chartPoints.length > 0) {
    pathStr = `M ${chartPoints[0].x} ${chartPoints[0].y} ` + chartPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
    
    // Area closes the loop at bottom axis
    areaStr = pathStr + ` L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - padding} L ${chartPoints[0].x} ${chartHeight - padding} Z`;
  }

  const weightDiff = Math.abs(currentWeightDisplay - targetWeightDisplay).toFixed(1);
  const isLoss = currentWeightDisplay > targetWeightDisplay;

  return (
    <div className="glass-card p-md md:p-lg rounded-2xl border border-white/10 relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[460px]">
      
      {/* Header with Switcher */}
      <div className="flex justify-between items-center border-b border-white/5 pb-sm mb-md">
        <div className="flex items-center gap-xs">
          <Scale className="h-5 w-5 text-primary-fixed" />
          <h3 className="font-display-sm text-sm font-bold uppercase tracking-wider text-white">Weight Tracker Hub</h3>
        </div>

        <div className="flex bg-surface-container p-0.5 rounded-full border border-white/10 text-[9px] font-bold">
          <button
            onClick={() => setUnit("kg")}
            className={`px-3 py-1 rounded-full uppercase tracking-wider cursor-pointer ${
              unit === "kg" ? "bg-primary-fixed text-on-primary-fixed" : "text-on-surface-variant hover:text-white"
            }`}
          >
            KG
          </button>
          <button
            onClick={() => setUnit("lbs")}
            className={`px-3 py-1 rounded-full uppercase tracking-wider cursor-pointer ${
              unit === "lbs" ? "bg-primary-fixed text-on-primary-fixed" : "text-on-surface-variant hover:text-white"
            }`}
          >
            LBS
          </button>
        </div>
      </div>

      {/* Main progress details */}
      <div className="grid grid-cols-3 gap-sm items-center text-center py-xs mb-sm">
        <div className="p-sm bg-white/5 border border-white/5 rounded-xl">
          <span className="text-[9px] text-on-surface-variant uppercase font-semibold">Current</span>
          <p className="font-stat-value text-lg md:text-xl font-bold text-primary">{currentWeightDisplay} <span className="text-[10px] font-normal">{unit}</span></p>
        </div>
        <div className="p-sm bg-white/5 border border-white/5 rounded-xl">
          <span className="text-[9px] text-on-surface-variant uppercase font-semibold">Target</span>
          <p className="font-stat-value text-lg md:text-xl font-bold text-secondary-fixed-dim">{targetWeightDisplay} <span className="text-[10px] font-normal">{unit}</span></p>
        </div>
        <div className="p-sm bg-primary-container/10 border border-primary-fixed/20 rounded-xl flex flex-col justify-center items-center">
          <span className="text-[9px] text-primary-fixed uppercase font-bold flex items-center gap-0.5">
            {isLoss ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
            Diff
          </span>
          <p className="font-stat-value text-lg md:text-xl font-bold text-primary">{weightDiff} <span className="text-[10px] font-normal">{unit}</span></p>
        </div>
      </div>

      {/* Chart Layout */}
      <div className="w-full bg-background/45 rounded-xl p-sm border border-white/5 relative mb-md">
        <span className="absolute top-2 left-3 text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">Progress Trend</span>
        
        {chartPoints.length > 0 ? (
          <div className="overflow-x-auto no-scrollbar pt-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[320px]">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#abd600" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#abd600" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

              {/* Area Below Curve */}
              {areaStr && <path d={areaStr} fill="url(#chartGlow)" />}

              {/* Curved Connection Path */}
              {pathStr && <path d={pathStr} fill="none" stroke="#abd600" strokeWidth="2.5" strokeLinecap="round" />}

              {/* Interaction Data Points */}
              {chartPoints.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#051424"
                    stroke="#abd600"
                    strokeWidth="2"
                    className="hover:r-6 transition-all"
                  />
                  {/* Tooltip on Hover */}
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fill="#abd600"
                    className="text-[8px] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    {pt.val}{unit}
                  </text>
                  {/* Label x-axis */}
                  <text
                    x={pt.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fill="rgba(212,228,250,0.4)"
                    className="text-[8px] font-semibold font-sans pointer-events-none"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-xs text-on-surface-variant">Log weight values to draw progress chart</div>
        )}
      </div>

      {/* Log Form */}
      <form onSubmit={handleLogWeight} className="flex gap-sm items-end border-t border-white/5 pt-md mt-auto">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">New Log Value</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={weightVal}
              onChange={(e) => setWeightVal(e.target.value)}
              placeholder={`Enter weight (${unit})`}
              className="w-full h-10 px-3 bg-surface-container border border-white/10 rounded-lg text-xs text-primary focus:outline-none focus:border-primary-fixed"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant font-bold uppercase">{unit}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Date</label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 w-4 h-4 text-outline" />
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-surface-container border border-white/10 rounded-lg text-xs text-primary focus:outline-none focus:border-primary-fixed cursor-pointer"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-10 px-4 bg-primary-fixed text-on-primary-fixed rounded-lg font-bold hover:bg-white active:scale-95 transition-all text-xs shrink-0 cursor-pointer flex items-center justify-center gap-1 glow-lime"
        >
          <Plus className="w-4 h-4" />
          Log
        </button>
      </form>
    </div>
  );
}
