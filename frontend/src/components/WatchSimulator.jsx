import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flame, RefreshCw, Check, Minus, Plus, Wifi, Battery, Play, Square, Bluetooth, Radio } from 'lucide-react';

/**
 * WatchSimulator Component
 * 
 * Renders a visual mock of a smartwatch face (Apple Watch/Fitbit style) with a mock screen showing:
 * - Live heart rate, steps, and active minutes.
 * - Controls to increase/decrease the simulated live heart rate.
 * - A 'Simulate Workout Spike' button that raises the heart rate to 140+ BPM and triggers visual pulse animations.
 * - Accept callback props `onSyncHeartRate(bpm)` and `onSyncSteps(stepsAmount)` to update parent app stats.
 * - Premium floating glassmorphism design.
 * 
 * @param {Function} onSyncHeartRate - Callback when heart rate syncs/updates.
 * @param {Function} onSyncSteps - Callback when steps are added.
 */
export default function WatchSimulator({ 
  isConnected = true, 
  setIsConnected, 
  currentSteps, 
  currentActiveMin, 
  dashboardWorkoutActive, 
  dashboardWorkoutPaused, 
  dashboardWorkoutSeconds, 
  onSyncHeartRate, 
  onSyncSteps, 
  onStartWorkout, 
  onStopWorkout 
}) {
  // --- Smartwatch Simulated States ---
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(6280);
  const [activeMin, setActiveMin] = useState(28);
  
  // --- Interface States ---
  const [autoSync, setAutoSync] = useState(true);
  const [isSpiked, setIsSpiked] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(false);
  const [watchTime, setWatchTime] = useState('10:09');
  
  // --- Workout Session Simulator ---
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);

  // --- Real BLE Wearable States ---
  const [bleDevice, setBleDevice] = useState(null);
  const [bleError, setBleError] = useState(null);

  // Sync steps/activeMin with dashboard when connected
  useEffect(() => {
    if (isConnected && currentSteps !== undefined) {
      setSteps(currentSteps);
    }
  }, [currentSteps, isConnected]);

  useEffect(() => {
    if (isConnected && currentActiveMin !== undefined) {
      setActiveMin(currentActiveMin);
    }
  }, [currentActiveMin, isConnected]);

  // Sync workout status and elapsed seconds with dashboard when connected
  useEffect(() => {
    if (isConnected && dashboardWorkoutActive !== undefined) {
      setWorkoutActive(dashboardWorkoutActive);
    }
  }, [dashboardWorkoutActive, isConnected]);

  useEffect(() => {
    if (isConnected && dashboardWorkoutSeconds !== undefined) {
      setWorkoutSeconds(dashboardWorkoutSeconds);
    }
  }, [dashboardWorkoutSeconds, isConnected]);

  // Update watch clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setWatchTime(`${hrs}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Workout Session Timer (only run locally if disconnected)
  useEffect(() => {
    if (!workoutActive || isConnected) return;

    const interval = setInterval(() => {
      setWorkoutSeconds((prev) => {
        const nextSec = prev + 1;
        // Increment active minutes occasionally (every 30s)
        if (nextSec > 0 && nextSec % 30 === 0) {
          setActiveMin((m) => m + 1);
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [workoutActive, isConnected]);

  // Handle auto-fluctuation of heart rate when normal (or spiked)
  useEffect(() => {
    if (bleDevice) return;

    const hrInterval = setInterval(() => {
      setHeartRate((prev) => {
        let baseMin = 60;
        let baseMax = 80;

        if (isSpiked) {
          baseMin = 140;
          baseMax = 175;
        } else if (workoutActive) {
          baseMin = 125;
          baseMax = 155;
        }

        const delta = Math.floor(Math.random() * 6) - 3; // -3 to +2
        let newHr = prev + delta;

        if (newHr < baseMin) newHr = baseMin + Math.floor(Math.random() * 5);
        if (newHr > baseMax) newHr = baseMax - Math.floor(Math.random() * 5);

        // Sync immediately if autoSync is on
        if (autoSync && onSyncHeartRate && isConnected) {
          onSyncHeartRate(newHr);
        }

        return newHr;
      });
    }, 2500);

    return () => clearInterval(hrInterval);
  }, [isSpiked, workoutActive, autoSync, onSyncHeartRate, isConnected, bleDevice]);

  // Sync to parent app when heartRate changes (if autoSync is on)
  useEffect(() => {
    if (bleDevice) return;
    if (autoSync && onSyncHeartRate && isConnected) {
      onSyncHeartRate(heartRate);
    }
  }, [heartRate, autoSync, onSyncHeartRate, isConnected, bleDevice]);

  // Manual Trigger Sync
  const triggerManualSync = () => {
    if (onSyncHeartRate && isConnected) {
      onSyncHeartRate(heartRate);
    }
    setSyncFeedback(true);
    setTimeout(() => setSyncFeedback(false), 2000);
  };

  // Adjust Heart Rate
  const adjustHeartRate = (amount) => {
    setHeartRate((prev) => {
      const nextHr = Math.max(40, Math.min(220, prev + amount));
      if (nextHr < 140 && isSpiked) {
        setIsSpiked(false);
      }
      return nextHr;
    });
  };

  // Adjust Steps (passes delta to callback)
  const addStepsAmount = (amount) => {
    setSteps((prev) => prev + amount);
    if (onSyncSteps && isConnected) {
      onSyncSteps(amount);
    }
    setSyncFeedback(true);
    setTimeout(() => setSyncFeedback(false), 2000);
  };

  // Toggle Workout Active State
  const toggleWorkoutActive = () => {
    if (isConnected) {
      if (workoutActive) {
        if (onStopWorkout) onStopWorkout();
      } else {
        if (onStartWorkout) onStartWorkout();
      }
    } else {
      setWorkoutActive((prev) => {
        const next = !prev;
        if (!next) {
          setWorkoutSeconds(0);
        }
        return next;
      });
    }
  };

  // Simulate Workout Spike
  const toggleWorkoutSpike = () => {
    if (isSpiked) {
      setIsSpiked(false);
      setHeartRate(75);
    } else {
      setIsSpiked(true);
      setHeartRate(148);
      // Automatically activate workout screen mode
      if (isConnected) {
        if (!workoutActive && onStartWorkout) {
          onStartWorkout();
        }
      } else {
        setWorkoutActive(true);
      }
    }
  };

  // --- Real Web Bluetooth Smartwatch Connection (Noise ColorFit / BLE device) ---
  useEffect(() => {
    return () => {
      if (bleDevice && bleDevice.gatt && bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
      }
    };
  }, [bleDevice]);

  const connectBleDevice = async () => {
    setBleError(null);
    if (!navigator.bluetooth) {
      setBleError("Web Bluetooth is not supported in this browser. Try Chrome/Edge.");
      return;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { namePrefix: 'Noise' },
          { namePrefix: 'ColorFit' },
          { namePrefix: 'ColourFit' }
        ],
        optionalServices: ['heart_rate', 'battery_service']
      });

      setBleDevice(device);
      
      const server = await device.gatt.connect();

      device.addEventListener('gattserverdisconnected', () => {
        setBleDevice(null);
        setBleError("Device disconnected.");
      });

      let service;
      try {
        service = await server.getPrimaryService('heart_rate');
      } catch (e) {
        throw new Error("Connected but standard BLE Heart Rate service not found.");
      }
      
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      await characteristic.startNotifications();
      
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value;
        const flags = value.getUint8(0);
        const rate16Bits = flags & 0x1;
        let heartRateVal = 0;
        if (rate16Bits) {
          heartRateVal = value.getUint16(1, true);
        } else {
          heartRateVal = value.getUint8(1);
        }

        setHeartRate(heartRateVal);
        
        if (onSyncHeartRate) {
          onSyncHeartRate(heartRateVal);
        }
      });
      
    } catch (err) {
      console.error(err);
      setBleError(err.message || "Failed to connect to device.");
      setBleDevice(null);
    }
  };

  const disconnectBleDevice = () => {
    if (bleDevice && bleDevice.gatt && bleDevice.gatt.connected) {
      bleDevice.gatt.disconnect();
    }
    setBleDevice(null);
  };

  // Format workout timer display
  const formatWorkoutTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Radial Ring Calculations (Apple Watch style)
  const calculateCircleProps = (value, target) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(100, Math.max(0, (value / target) * 100));
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return { radius, circumference, strokeDashoffset };
  };

  // Progress goals
  const stepRing = calculateCircleProps(steps, 10000);
  const activeRing = calculateCircleProps(activeMin, 60);

  // Dynamic heart rate pulse speed (duration in seconds per beat)
  const pulseDuration = heartRate > 0 ? 60 / heartRate : 1;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Minimized Float Trigger */}
      {isMinimized && (
        <motion.button
          layoutId="watch-container"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-md py-3 rounded-full glass-card border border-primary-fixed/30 shadow-2xl text-primary hover:text-primary-fixed cursor-pointer transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative flex h-3.5 w-3.5">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${isSpiked || workoutActive ? 'bg-error' : 'bg-primary-fixed'}`}></span>
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isSpiked || workoutActive ? 'bg-error' : 'bg-primary-fixed'}`}></span>
          </span>
          <span className="font-label-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            Watch Simulator ({heartRate} bpm)
          </span>
        </motion.button>
      )}

      {/* Main Simulator Card */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            layoutId="watch-container"
            className="w-80 rounded-2xl glass-card border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-fade-in text-on-surface"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
          >
            {/* Widget Title Header */}
            <div className="bg-surface-container/80 px-md py-3 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 text-primary-fixed ${(isConnected || bleDevice) ? 'animate-pulse' : 'text-on-surface-variant'}`} />
                <span className="text-xs font-bold font-display-sm uppercase tracking-wider text-primary truncate max-w-[120px]" title={bleDevice ? bleDevice.name : "FitSync Watch Sim"}>
                  {bleDevice ? bleDevice.name : "FitSync Watch Sim"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (bleDevice) {
                      disconnectBleDevice();
                    } else if (setIsConnected) {
                      setIsConnected(!isConnected);
                    }
                  }}
                  title={bleDevice ? 'Disconnect Real Wearable' : isConnected ? 'Disconnect Mock Watch' : 'Connect Mock Watch'}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors hover:bg-white/5 cursor-pointer ${
                    (isConnected || bleDevice) ? 'text-primary-fixed' : 'text-on-surface-variant'
                  }`}
                >
                  <Bluetooth className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 cursor-pointer text-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Smartwatch Outer Frame Area */}
            <div className="flex flex-col items-center justify-center py-6 bg-surface-container-lowest/60 relative">
              {/* Strap Top */}
              <div className="absolute top-0 w-20 h-3 bg-surface-variant/40 rounded-b-md border-x border-b border-white/5"></div>
              
              {/* Watch Outer Shell */}
              <div className="relative w-48 h-56 rounded-[36px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-2.5 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] border border-slate-600/80 flex items-center justify-center">
                {/* Crown Button Mock */}
                <div className="absolute -right-[4px] top-1/4 w-[6px] h-10 bg-gradient-to-r from-slate-800 to-slate-600 rounded-r-md border-y border-r border-slate-500 shadow-md"></div>
                <div className="absolute -right-[3px] top-1/2 w-[5px] h-6 bg-gradient-to-r from-slate-800 to-slate-600 rounded-r-sm border-y border-r border-slate-500 shadow-md"></div>

                {/* Inner Screen */}
                <div className="w-full h-full rounded-[28px] bg-[#000000] overflow-hidden flex flex-col p-3 relative border border-slate-950/80 select-none">
                  {/* Glass reflection streak */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>

                  {/* Top Bar of Watch */}
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 px-1 font-semibold">
                    <span>{watchTime}</span>
                    <div className="flex items-center gap-1">
                      <Wifi className="w-2.5 h-2.5 text-zinc-600" />
                      <Battery className="w-3.5 h-2.5 text-zinc-500" />
                    </div>
                  </div>

                  {/* Watch Face UI */}
                  <div className="flex-1 flex flex-col justify-between mt-1 z-10">
                    
                    {/* Ring Progress Overlay or Workout Mode Banner */}
                    <div className="relative h-[84px] w-full flex items-center justify-center">
                      
                      {/* Apple Watch style concentric rings */}
                      <svg className="w-20 h-20 transform -rotate-90">
                        {/* Track Rings */}
                        <circle cx="40" cy="40" r="35" stroke="rgba(195, 244, 0, 0.08)" strokeWidth="4.5" fill="transparent" />
                        <circle cx="40" cy="40" r="28" stroke="rgba(125, 244, 255, 0.08)" strokeWidth="4.5" fill="transparent" />
                        
                        {/* Active Progress Rings */}
                        <circle 
                          cx="40" cy="40" r="35" 
                          stroke="#c3f400" 
                          strokeWidth="4.5" 
                          fill="transparent" 
                          strokeDasharray={stepRing.circumference}
                          strokeDashoffset={stepRing.strokeDashoffset}
                          strokeLinecap="round"
                        />
                        <circle 
                          cx="40" cy="40" r="28" 
                          stroke="#7df4ff" 
                          strokeWidth="4.5" 
                          fill="transparent" 
                          strokeDasharray={activeRing.circumference}
                          strokeDashoffset={activeRing.strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Ring Center: Workout / Heart Rate View */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1.5">
                        <motion.div
                          animate={{ scale: [1, 1.25, 1] }}
                          transition={{ repeat: Infinity, duration: pulseDuration, ease: "easeInOut" }}
                          className="relative"
                        >
                          <Heart className={`w-6 h-6 ${isSpiked || workoutActive ? 'text-red-500 fill-red-500 glow-lime' : 'text-rose-400 fill-rose-400'}`} />
                        </motion.div>
                        <span className="font-stat-value text-lg font-bold leading-none text-zinc-100 mt-1">{heartRate}</span>
                        <span className="text-[7px] text-zinc-400 uppercase tracking-widest font-semibold font-label-sm">BPM</span>
                      </div>

                    </div>

                    {/* Live Stats Rows */}
                    <div className="bg-zinc-900/60 rounded-xl p-1.5 px-2 border border-white/5 flex flex-col gap-0.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-400 font-label-sm">Steps</span>
                        <span className="font-bold text-[#c3f400] font-stat-value">{steps.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-400 font-label-sm">Active Min</span>
                        <span className="font-bold text-[#7df4ff] font-stat-value">{activeMin}m</span>
                      </div>
                      {workoutActive && (
                        <div className="flex justify-between items-center text-[8px] text-red-400 border-t border-white/5 pt-0.5 mt-0.5 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-0.5">
                            <Flame className={`w-2.5 h-2.5 ${dashboardWorkoutPaused && isConnected ? '' : 'animate-pulse'}`} />
                            {dashboardWorkoutPaused && isConnected ? 'Paused' : 'Workout'}
                          </span>
                          <span>{formatWorkoutTime(workoutSeconds)}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              {/* Strap Bottom */}
              <div className="absolute bottom-0 w-20 h-3 bg-surface-variant/40 rounded-t-md border-x border-t border-white/5"></div>
            </div>

            {/* Controls Panel */}
            <div className="p-md bg-surface-container flex flex-col gap-md">
              
              {/* Heart Rate controls */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-on-surface-variant">Heart Rate Adjuster</span>
                  <span className="text-xs font-bold text-primary">{heartRate} BPM</span>
                </div>
                <div className="flex items-center gap-sm">
                  <button 
                    onClick={() => adjustHeartRate(-5)}
                    className="w-8 h-8 rounded-lg bg-surface-container-high border border-white/5 hover:bg-white/5 active:scale-95 flex items-center justify-center text-on-surface transition-all cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input 
                    type="range" 
                    min="40" 
                    max="190" 
                    value={heartRate}
                    onChange={(e) => {
                      const nextBpm = parseInt(e.target.value);
                      setHeartRate(nextBpm);
                      if (nextBpm < 140) setIsSpiked(false);
                    }}
                    className="flex-1 h-1 rounded-full accent-primary-fixed bg-surface-container-high cursor-pointer"
                  />
                  <button 
                    onClick={() => adjustHeartRate(5)}
                    className="w-8 h-8 rounded-lg bg-surface-container-high border border-white/5 hover:bg-white/5 active:scale-95 flex items-center justify-center text-on-surface transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Steps Add Increments */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-on-surface-variant">Simulate Steps Intake</span>
                <div className="grid grid-cols-3 gap-xs">
                  <button 
                    onClick={() => addStepsAmount(100)}
                    className="py-1 px-2 rounded bg-surface-container-high hover:bg-white/5 border border-white/5 text-[11px] font-bold text-primary-fixed active:scale-95 transition-all cursor-pointer"
                  >
                    +100
                  </button>
                  <button 
                    onClick={() => addStepsAmount(500)}
                    className="py-1 px-2 rounded bg-surface-container-high hover:bg-white/5 border border-white/5 text-[11px] font-bold text-primary-fixed active:scale-95 transition-all cursor-pointer"
                  >
                    +500
                  </button>
                  <button 
                    onClick={() => addStepsAmount(1000)}
                    className="py-1 px-2 rounded bg-surface-container-high hover:bg-white/5 border border-white/5 text-[11px] font-bold text-primary-fixed active:scale-95 transition-all cursor-pointer"
                  >
                    +1.0k
                  </button>
                </div>
              </div>

              {/* Workout Spike Button & Session Control */}
              <div className="grid grid-cols-2 gap-sm pt-sm border-t border-white/5">
                <button
                  onClick={toggleWorkoutSpike}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border cursor-pointer ${
                    isSpiked 
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30' 
                      : 'bg-surface-container-high text-rose-400 border-rose-500/20 hover:bg-white/5'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${isSpiked ? 'animate-bounce text-red-400' : ''}`} />
                  {isSpiked ? 'Spike Active' : 'HR Workout Spike'}
                </button>

                <button
                  onClick={toggleWorkoutActive}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border cursor-pointer ${
                    workoutActive 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                      : 'bg-surface-container-high text-amber-400 border-amber-500/20 hover:bg-white/5'
                  }`}
                >
                  {workoutActive ? (
                    <>
                      <Square className="w-3 h-3 fill-amber-300" />
                      Stop Watch
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-amber-400" />
                      Start Watch
                    </>
                  )}
                </button>
              </div>

              {/* Sync settings / Manual sync */}
              <div className="flex items-center justify-between pt-sm border-t border-white/5 text-xs text-on-surface-variant font-semibold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoSync} 
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="rounded accent-primary-fixed bg-surface-container-high border-white/10"
                  />
                  Auto-Sync
                </label>
                <button 
                  onClick={triggerManualSync}
                  disabled={!isConnected && !bleDevice}
                  className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {syncFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-primary-fixed" />
                      <span className="text-primary-fixed">Synced!</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync Now</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real BLE Wearable Connectivity Controls */}
              <div className="flex flex-col gap-1.5 pt-sm border-t border-white/5">
                <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1">
                  <Bluetooth className="w-3 h-3 text-primary-fixed animate-pulse" /> Noise Wearable Bluetooth Sync
                </span>
                <div className="flex flex-col gap-xs mt-0.5">
                  {bleDevice ? (
                    <div className="flex flex-col gap-sm bg-surface-container-high/40 p-2.5 rounded-xl border border-primary-fixed/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-primary truncate max-w-[145px]">{bleDevice.name || 'ColourFit 3'}</span>
                        <span className="text-[10px] text-green-400 font-bold flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Live Synced
                        </span>
                      </div>
                      <button
                        onClick={disconnectBleDevice}
                        className="w-full py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-[10px] font-bold text-red-300 active:scale-95 transition-all cursor-pointer"
                      >
                        Disconnect Smartwatch
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={connectBleDevice}
                      className="w-full py-2 px-md rounded-xl bg-gradient-to-r from-primary to-primary-fixed text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
                    >
                      <Bluetooth className="w-3.5 h-3.5" />
                      Connect ColourFit Plus 3
                    </button>
                  )}
                  {bleError && (
                    <span className="text-[9px] text-error font-semibold mt-1 leading-tight flex items-start gap-1">
                      ⚠️ {bleError}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
