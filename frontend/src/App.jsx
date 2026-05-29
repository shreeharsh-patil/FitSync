import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // --- Navigation & Core Views ---
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'workouts' | 'community' | 'settings' | 'activity' (mobile tab)
  const [activeWorkoutSubView, setActiveWorkoutSubView] = useState(null); // null | 'running'
  
  // Dashboard Section Mode selector: switch between Performance details and Wellness status
  const [dashboardMode, setDashboardMode] = useState('performance'); // 'performance' | 'wellness'
  
  const [selectedDayNum, setSelectedDayNum] = useState(14); // Wed 14 default
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showLogWorkoutModal, setShowLogWorkoutModal] = useState(false);
  const [showLogRunModal, setShowLogRunModal] = useState(false);
  
  // Custom Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- User Profile & Goals ---
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Rivers',
    level: 42,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANOmh7jFGIMlEymlm5qyXZ_-gkcHgYS-46pUy9xs-ZWni1tGrbTMaJs_S6GEFNakfHaGCFTG5voxDH5DqKKzXEr33PUXAcNGMVgM-Azc3_Ld7gMfOq24fAjo6YPDdSZ4av83pzCU7lVk4mv3YNeD07eh5iv_813c2EpNwEUAP7sPkoGkbfOpE5MEJYuZefdAOoqx1zj0hYiPh2pzz3MFndBE-BB2Bj3nAb6LRi3gPLW3LsWF5nhYJeBTr4x0MmbNrpGQs0AC6-kAjW',
    height: 175, // cm
    weight: 68.0, // kg
    targetBmi: 21.5,
    goals: {
      steps: 10000,
      calories: 700,
      hydration: 8,
      sleep: 8.0,
      activeMin: 60
    }
  });

  // --- Dynamic Wellness State (FitSync Status) ---
  const [hydrationLogs, setHydrationLogs] = useState({
    lastLogTime: '2:34 PM',
    nextReminderTime: '4:00 PM',
    glassesLog: 6 // 6 of 8 glasses
  });

  const [calorieIntake, setCalorieIntake] = useState(1840);
  const [activeCalorieGoal, setActiveCalorieGoal] = useState(700);

  // Hourly burn graph heights
  const [hourlyBurnData, setHourlyBurnData] = useState([20, 35, 60, 85, 45, 50, 100, 15, 10]);

  // --- Dynamic BMI calculation ---
  const calculatedBmi = parseFloat((userProfile.weight / ((userProfile.height / 100) * (userProfile.height / 100))).toFixed(1));
  
  // BMI categories mapping
  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25.0) return 'Normal';
    if (bmi < 30.0) return 'Overweight';
    return 'Obese';
  };

  // BMI Marker position calculation on visual slider range 15 to 35
  const getBmiMarkerPercent = (bmi) => {
    const minBmi = 15;
    const maxBmi = 35;
    const pct = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.max(2, Math.min(95, Math.round(pct)));
  };

  // --- Weekly Calendar Logs Data ---
  const [weeklyLogs, setWeeklyLogs] = useState([
    { dayName: 'MON', dayNum: 12, steps: 6200, km: 4.2, activeMin: 30, recovery: 65, sleep: '6.5', bpm: 68, water: 5, sets: 12, reps: 110, chest: 70, triceps: 60, shoulders: 50, workout: 'Pull Day', calories: 420, runMiles: 3.1 },
    { dayName: 'TUE', dayNum: 13, steps: 8100, km: 5.8, activeMin: 38, recovery: 70, sleep: '6.8', bpm: 64, water: 6, sets: 14, reps: 140, chest: 75, triceps: 65, shoulders: 55, workout: 'Leg Day', calories: 590, runMiles: 8.4 },
    { dayName: 'WED', dayNum: 14, steps: 12482, km: 8.2, activeMin: 54, recovery: 88, sleep: '7.3', bpm: 58, water: 7, sets: 18, reps: 182, chest: 92, triceps: 78, shoulders: 64, workout: 'Push Day', calories: 712, runMiles: 0.0 },
    { dayName: 'THU', dayNum: 15, steps: 9500, km: 6.8, activeMin: 40, recovery: 78, sleep: '7.0', bpm: 62, water: 6, sets: 15, reps: 150, chest: 80, triceps: 70, shoulders: 60, workout: 'Pull Day', calories: 680, runMiles: 6.9 },
    { dayName: 'FRI', dayNum: 16, steps: 10800, km: 7.4, activeMin: 49, recovery: 80, sleep: '7.2', bpm: 60, water: 7, sets: 16, reps: 160, chest: 85, triceps: 75, shoulders: 62, workout: 'Push Day', calories: 650, runMiles: 6.2 },
    { dayName: 'SAT', dayNum: 17, steps: 4200, km: 3.0, activeMin: 20, recovery: 85, sleep: '8.5', bpm: 55, water: 8, sets: 0, reps: 0, chest: 0, triceps: 0, shoulders: 0, workout: 'Rest Day', calories: 240, runMiles: 0.0 },
    { dayName: 'SUN', dayNum: 18, steps: 11200, km: 8.0, activeMin: 55, recovery: 82, sleep: '7.8', bpm: 59, water: 6, sets: 10, reps: 90, chest: 60, triceps: 50, shoulders: 45, workout: 'Cardio Day', calories: 390, runMiles: 0.0 }
  ]);

  const activeLogIndex = weeklyLogs.findIndex(log => log.dayNum === selectedDayNum);
  const activeLog = weeklyLogs[activeLogIndex] || weeklyLogs[2];

  const updateActiveLog = (updater) => {
    setWeeklyLogs(prev => prev.map(log => {
      if (log.dayNum === selectedDayNum) {
        return updater(log);
      }
      return log;
    }));
  };

  // --- Running Details Specific State ---
  const [selectedRunningMetric, setSelectedRunningMetric] = useState('distance'); // 'distance' | 'intensity'
  const [shoeMileage, setShoeMileage] = useState(312); // Nike Pegasus 40 logged miles
  const [runsList, setRunsList] = useState([
    { id: 1, name: 'Morning Tempo Run', date: 'Today', time: '6:15 AM', distance: 6.2, duration: '54:12', pace: "8'42\" /mi", bpm: 152, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-' },
    { id: 2, name: 'Evening Trail', date: 'Tuesday', time: '5:40 PM', distance: 8.4, duration: '1:12:05', pace: "8'34\" /mi", bpm: 146, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEmDrGdLfIwA0XhRe8akzIq5_19R6qy8f6OQQ2SsdNh0Bdr3hmgVqzZMc0OdskpFldYarwSViE4nMzz0chEp4XcSp5eJr1QuAcYF8XyohE8tHMyLIIk0lFQlfQ9QmoQp-IsZTmIgjMYnHsT96rJB-dNMYk3dIhK4Rf7EOxtg4KicxgflERqInMjM-DLJ06JKkrb7aAD7WMiera2f139VgbFaepMCOf3pEaBET0EQqQmy479aU4yaCiadKx8iFD60lOVIPQJ9mPKYc2' },
    { id: 3, name: 'Short Recovery', date: 'Monday', time: '7:00 AM', distance: 3.1, duration: '28:45', pace: "9'16\" /mi", bpm: 132, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeQvM_Qmnwu9QkjyLswq6sD3UoeKFVa0mh_2AJ-JaZIIIhhJgZWDFwK0cesVcRTL46PXXSvPOctV8O68_mBMxXTSTqnwosY-XUcunKX756e2g6QhrZ4kjtBSTf30eHGHB3wjXDRJssx9nztSnWcPuwo-TpUwvhF_pviArx0zA27Efr04FwwiDe7Sp5c0TcFIMHBsJlngGMRVghu5XL3zpKL_M71lm8Rbp8ixLKTt_447NfNt8VNNVARGOb7mDdM6Bnqt21M39h_5OP' },
    { id: 4, name: 'Steady State', date: 'Last Sunday', time: '9:30 AM', distance: 6.9, duration: '1:01:22', pace: "8'53\" /mi", bpm: 148, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQkZ_5zRFsPWp-5CAN7ZnmgzphHZkr4cKZIU1CH7s7n7pJ3yexmvJph_Pa7uq4Gt_asgT2dbyfGHT1B7XrTS59q1GjY7ewipQnYm8j19B7G9amzktdzmnVVy9tjsQYqVzDaHB_fYkYCt5fHx8zHydJChLIrk-cEv93HOeRy6SnklMcCTK6_4XHCYdK7wiAysyl9M3AsVbrBVP0DUeyZaRgrMks1AJAp78cPSSWts4SpkqSid-rbe2fpzV3gZu13qJJnHonUthiHDsM' }
  ]);

  const totalMiles = runsList.reduce((sum, run) => sum + run.distance, 0);

  // Modal Run form state
  const [runForm, setRunForm] = useState({
    name: 'Morning Hills',
    distance: 5.0,
    minutes: 42,
    seconds: 15,
    bpm: 145,
    dayNum: 14
  });

  const handleSaveRun = (e) => {
    e.preventDefault();
    const durationStr = `${runForm.minutes}:${runForm.seconds.toString().padStart(2, '0')}`;
    
    // Calculate Pace
    const decimalMins = parseFloat(runForm.minutes) + (parseFloat(runForm.seconds) / 60);
    const paceDecimal = decimalMins / parseFloat(runForm.distance);
    const paceMins = Math.floor(paceDecimal);
    const paceSecs = Math.round((paceDecimal - paceMins) * 60);
    const paceStr = `${paceMins}'${paceSecs.toString().padStart(2, '0')}" /mi`;

    const newRun = {
      id: runsList.length + 1,
      name: runForm.name,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      distance: parseFloat(runForm.distance),
      duration: durationStr,
      pace: paceStr,
      bpm: parseInt(runForm.bpm),
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-'
    };

    setRunsList(prev => [newRun, ...prev]);
    setShoeMileage(prev => prev + parseFloat(runForm.distance));

    setWeeklyLogs(prev => prev.map(log => {
      if (log.dayNum === parseInt(runForm.dayNum)) {
        return {
          ...log,
          runMiles: log.runMiles + parseFloat(runForm.distance),
          steps: log.steps + Math.round(parseFloat(runForm.distance) * 2000)
        };
      }
      return log;
    }));

    setShowLogRunModal(false);
    triggerToast(`🏃‍♂️ Run logged: ${runForm.name} (+${runForm.distance} mi)`);
  };

  // --- Workout Tracker stopwatch State ---
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutPaused, setWorkoutPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef(null);

  // --- Simulated Heart Rate Sensor ---
  const [liveHeartRate, setLiveHeartRate] = useState(activeLog.bpm);

  useEffect(() => {
    setLiveHeartRate(activeLog.bpm);
  }, [selectedDayNum]);

  useEffect(() => {
    const hrInterval = setInterval(() => {
      setLiveHeartRate(prev => {
        let baseMin = 55;
        let baseMax = 75;
        
        if (workoutActive && !workoutPaused) {
          baseMin = 120;
          baseMax = 160;
        } else if (activeLog.steps > 10000) {
          baseMin = 65;
          baseMax = 95;
        }

        const fluctuation = Math.floor(Math.random() * 8) - 4; // -4 to +3
        let newHr = prev + fluctuation;
        if (newHr < baseMin) newHr = baseMin + Math.floor(Math.random() * 4);
        if (newHr > baseMax) newHr = baseMax - Math.floor(Math.random() * 4);
        return newHr;
      });
    }, 3000);

    return () => clearInterval(hrInterval);
  }, [workoutActive, workoutPaused, selectedDayNum]);

  // Stopwatch Timer effect
  useEffect(() => {
    if (workoutActive && !workoutPaused) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [workoutActive, workoutPaused]);

  // --- PR & Strength Achievements State ---
  const [prLogs, setPrLogs] = useState([
    { id: 1, type: 'peak', title: 'Peak Performance', text: 'You are 12% stronger than last week during this push session.' },
    { id: 2, type: 'pr', title: 'New PR!', text: 'Bench Press: 105kg x 5 reps. Milestone achieved.' }
  ]);

  // --- Modal Workout Form State ---
  const [workoutForm, setWorkoutForm] = useState({
    focus: 'Bench Press',
    weight: 100,
    sets: 4,
    reps: 6,
    muscleGroup: 'Chest'
  });

  const handleSaveWorkout = (e) => {
    e.preventDefault();
    
    const addedReps = workoutForm.sets * workoutForm.reps;
    const addedMinutes = workoutForm.sets * 3;
    const addedCalories = workoutForm.sets * 25;

    updateActiveLog(log => {
      const updatedSets = log.sets + parseInt(workoutForm.sets);
      const updatedReps = log.reps + addedReps;
      const updatedActiveMin = log.activeMin + addedMinutes;
      const updatedCalories = log.calories + addedCalories;

      let updatedMuscleObj = {};
      const muscleKey = workoutForm.muscleGroup.toLowerCase();
      if (['chest', 'triceps', 'shoulders', 'legs', 'back', 'arms'].includes(muscleKey)) {
        const currentVal = log[muscleKey] || 0;
        updatedMuscleObj[muscleKey] = Math.min(100, currentVal + 10);
      }

      return {
        ...log,
        sets: updatedSets,
        reps: updatedReps,
        activeMin: updatedActiveMin,
        calories: updatedCalories,
        ...updatedMuscleObj
      };
    });

    if (workoutForm.weight >= 105) {
      const newPrId = prLogs.length + 1;
      setPrLogs(prev => [
        { id: newPrId, type: 'pr', title: 'New PR!', text: `${workoutForm.focus}: ${workoutForm.weight}kg x ${workoutForm.reps} reps. Milestone achieved.` },
        ...prev
      ]);
      triggerToast(`🏆 New PR Logged: ${workoutForm.focus} at ${workoutForm.weight}kg!`);
    } else {
      triggerToast(`🏋️‍♂️ Workout logged: ${workoutForm.focus} (+${workoutForm.sets} Sets)`);
    }

    setShowLogWorkoutModal(false);
  };

  // --- Notification Log State ---
  const [notifications, setNotifications] = useState([
    { id: 1, text: '🏋️‍♂️ Complete Push routine registered.', read: false, time: '3:20 PM' },
    { id: 2, text: '💧 Hydration warning: Drink 0.8L water now.', read: false, time: '1:45 PM' },
    { id: 3, text: '📈 New steps peak! Hit 12,482 steps.', read: true, time: 'Yesterday' }
  ]);

  // --- Quick Increment Stats Helpers ---
  const addSteps = (amount) => {
    updateActiveLog(log => {
      const newSteps = Math.max(0, log.steps + amount);
      const calBurned = Math.round(amount * 0.04);
      const distKm = parseFloat((amount * 0.0008).toFixed(2));
      return {
        ...log,
        steps: newSteps,
        calories: Math.max(0, log.calories + calBurned),
        km: parseFloat(Math.max(0, log.km + distKm).toFixed(1))
      };
    });
    triggerToast(`🚶‍♂️ Steps updated: ${amount > 0 ? '+' : ''}${amount.toLocaleString()}`);
  };

  const addHydration = (amount) => {
    updateActiveLog(log => {
      let currentVal = log.water;
      let val = 0;
      if (typeof currentVal === 'string') {
        val = parseFloat(currentVal.replace(' L', ''));
      } else {
        val = currentVal;
      }
      
      let newVal = Math.max(0, val + amount);
      let formattedVal = newVal;
      if (typeof currentVal === 'string') {
        formattedVal = `${newVal.toFixed(1)} L`;
      }
      return { ...log, water: formattedVal };
    });
    triggerToast(`💧 Water intake updated!`);
  };

  const stepsPercent = Math.min(100, Math.round((activeLog.steps / userProfile.goals.steps) * 100));
  const activeMinPercent = Math.min(100, Math.round((activeLog.activeMin / userProfile.goals.activeMin) * 100));
  
  const getWaterDisplayValue = (waterVal) => {
    if (typeof waterVal === 'string') return waterVal;
    return `${waterVal}/8`;
  };

  // Helper to click-toggle water segment glasses in status view
  const toggleWaterSegment = (index) => {
    setHydrationLogs(prev => {
      const targetCount = index + 1;
      const lastLogged = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
      triggerToast(`💧 Hydration updated to ${targetCount}/8 glasses`);
      return {
        ...prev,
        glassesLog: targetCount,
        lastLogTime: lastLogged
      };
    });
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md select-none relative overflow-x-hidden">
      
      {/* --- Toast System --- */}
      {toastMessage && (
        <div className="fixed top-20 right-gutter z-50 bg-surface-container-high border border-primary-fixed/30 text-primary-fixed px-md py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-md">info</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* --- Workout Logging Dialog Modal --- */}
      {showLogWorkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-container-high/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-lg animate-fade-in">
            <div className="flex justify-between items-center mb-lg border-b border-white/5 pb-sm">
              <h3 className="font-headline-lg text-headline-lg text-primary">Log Exercise Set</h3>
              <button 
                onClick={() => setShowLogWorkoutModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-on-surface-variant hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveWorkout} className="flex flex-col gap-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Exercise Focus</label>
                <input 
                  type="text" 
                  value={workoutForm.focus} 
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, focus: e.target.value }))}
                  className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={workoutForm.weight} 
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Target Muscle Group</label>
                  <select 
                    value={workoutForm.muscleGroup} 
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, muscleGroup: e.target.value }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="Chest">Chest</option>
                    <option value="Triceps">Triceps</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Back">Back</option>
                    <option value="Legs">Legs</option>
                    <option value="Arms">Arms</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Sets Completed</label>
                  <input 
                    type="number" min="1" max="10" value={workoutForm.sets} 
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Reps per Set</label>
                  <input 
                    type="number" min="1" max="30" value={workoutForm.reps} 
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, reps: parseInt(e.target.value) || 1 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 mt-lg bg-primary-fixed text-on-primary-fixed hover:bg-white transition-all font-semibold rounded-lg shadow-lg active:scale-95 text-sm">
                Log to Session #{activeLog.workout === 'Rest Day' ? 'Special' : '24'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Log Run Dialog Modal --- */}
      {showLogRunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-container-high/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-lg animate-fade-in">
            <div className="flex justify-between items-center mb-lg border-b border-white/5 pb-sm">
              <h3 className="font-headline-lg text-headline-lg text-primary">Log Running Activity</h3>
              <button 
                onClick={() => setShowLogRunModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-on-surface-variant hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveRun} className="flex flex-col gap-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Route / Run Title</label>
                <input 
                  type="text" value={runForm.name} 
                  onChange={(e) => setRunForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Distance (miles)</label>
                  <input 
                    type="number" step="0.1" value={runForm.distance} 
                    onChange={(e) => setRunForm(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Avg Heart Rate (bpm)</label>
                  <input 
                    type="number" value={runForm.bpm} 
                    onChange={(e) => setRunForm(prev => ({ ...prev, bpm: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Duration (Minutes)</label>
                  <input 
                    type="number" value={runForm.minutes} 
                    onChange={(e) => setRunForm(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Duration (Seconds)</label>
                  <input 
                    type="number" max="59" value={runForm.seconds} 
                    onChange={(e) => setRunForm(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Activity Date</label>
                <select 
                  value={runForm.dayNum} 
                  onChange={(e) => setRunForm(prev => ({ ...prev, dayNum: parseInt(e.target.value) }))}
                  className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                >
                  {weeklyLogs.map(log => (
                    <option key={log.dayNum} value={log.dayNum}>{log.dayName} {log.dayNum}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 mt-lg bg-primary-fixed text-on-primary-fixed hover:bg-white transition-all font-semibold rounded-lg shadow-lg active:scale-95 text-sm">
                Register Run & Track Mileage
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DESKTOP VIEWPORT: PERSISTENT SIDEBAR DRAWER + CANVAS */}
      {/* ============================================================== */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-white/5 shadow-2xl hidden md:flex flex-col p-lg gap-sm z-40">
        <div className="mb-8 flex flex-col items-start">
          <h1 className="font-display-lg text-display-lg text-primary-fixed leading-none">FitSync</h1>
          <p className="text-on-surface-variant font-label-md">Elite Member</p>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {/* Dashboard */}
          <button 
            onClick={() => { setCurrentTab('home'); setActiveWorkoutSubView(null); }}
            className={`w-full flex items-center gap-md px-4 py-3 rounded-lg transition-all hover:translate-x-1 ${
              currentTab === 'home' 
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body-md text-sm">Dashboard</span>
          </button>

          {/* Workouts */}
          <button 
            onClick={() => { setCurrentTab('workouts'); }}
            className={`w-full flex items-center gap-md px-4 py-3 rounded-lg transition-all hover:translate-x-1 ${
              currentTab === 'workouts' 
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <span className="material-symbols-outlined">fitness_center</span>
            <span className="font-body-md text-sm">Workouts</span>
          </button>

          {/* Social (Community) */}
          <button 
            onClick={() => { setCurrentTab('community'); setActiveWorkoutSubView(null); }}
            className={`w-full flex items-center gap-md px-4 py-3 rounded-lg transition-all hover:translate-x-1 ${
              currentTab === 'community' 
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <span className="material-symbols-outlined">forum</span>
            <span className="font-body-md text-sm">Social Feed</span>
          </button>

          {/* Preferences (Settings) */}
          <button 
            onClick={() => { setCurrentTab('settings'); setActiveWorkoutSubView(null); }}
            className={`w-full flex items-center gap-md px-4 py-3 rounded-lg transition-all hover:translate-x-1 ${
              currentTab === 'settings' 
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <span className="material-symbols-outlined">tune</span>
            <span className="font-body-md text-sm">Preferences</span>
          </button>
        </nav>

        {/* User Card Drawer Footer */}
        <div className="mt-auto pt-lg border-t border-white/5 flex items-center gap-md cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all" onClick={() => { setCurrentTab('settings'); setActiveWorkoutSubView(null); }}>
          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-primary-fixed/20 shrink-0">
            <img src={userProfile.avatar} alt="Alex Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <p className="font-label-md text-on-surface text-sm truncate">{userProfile.name}</p>
            <p className="text-xs text-on-surface-variant">Level {userProfile.level}</p>
          </div>
        </div>
      </aside>

      {/* --- DESKTOP CANVAS BODY CONTENT --- */}
      <main className="hidden md:block flex-grow ml-64 p-lg max-w-7xl mx-auto min-h-screen">
        
        {/* Desktop Top Header */}
        <header className="flex items-center justify-between mb-xl">
          <div>
            {activeWorkoutSubView === 'running' ? (
              <div>
                <nav className="flex items-center gap-xs text-on-surface-variant mb-xs cursor-pointer">
                  <span className="text-label-sm font-label-sm hover:underline" onClick={() => setActiveWorkoutSubView(null)}>Workouts</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-label-sm font-label-sm text-primary-fixed">Running</span>
                </nav>
                <h2 className="font-display-sm text-display-sm font-bold text-primary-fixed">Running Performance</h2>
              </div>
            ) : (
              <div>
                <h2 className="font-display-sm text-display-sm text-primary">
                  {currentTab === 'home' && (dashboardMode === 'performance' ? 'Activity Details' : 'FitSync Wellness Status')}
                  {currentTab === 'workouts' && 'Workouts Hub'}
                  {currentTab === 'community' && 'Social Hub & Challenges'}
                  {currentTab === 'settings' && 'Profile & Goal Preferences'}
                </h2>
                <p className="text-on-surface-variant font-body-md text-sm">
                  {currentTab === 'home' && (dashboardMode === 'performance' ? 'Performance tracking & health analytics' : 'Metabolic indices, hydration metrics, and BMI composition')}
                  {currentTab === 'workouts' && 'Track routines or log exercise sessions in real-time'}
                  {currentTab === 'community' && 'Compete in community challenges and cheer fit buddies'}
                  {currentTab === 'settings' && 'Update weight targets, display profile, and parameters'}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-md">
            {/* Dashboard Mode Switcher (Wellness vs Performance) */}
            {currentTab === 'home' && !activeWorkoutSubView && (
              <div className="flex bg-surface-container p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setDashboardMode('performance')}
                  className={`px-md py-1.5 font-label-md text-xs rounded-lg transition-all ${
                    dashboardMode === 'performance' 
                      ? 'bg-surface-variant text-primary-fixed shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Performance
                </button>
                <button 
                  onClick={() => setDashboardMode('wellness')}
                  className={`px-md py-1.5 font-label-md text-xs rounded-lg transition-all ${
                    dashboardMode === 'wellness' 
                      ? 'bg-surface-variant text-primary-fixed shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Wellness Status
                </button>
              </div>
            )}

            {/* Day / Week / Month selector */}
            <div className="flex bg-surface-container p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => triggerToast('Daily records loaded')}
                className="px-md py-1.5 font-label-md text-xs rounded-lg text-primary-fixed bg-surface-variant shadow-sm"
              >
                Day
              </button>
              <button 
                className="px-md py-1.5 font-label-md text-xs rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                Week
              </button>
              <button 
                onClick={() => triggerToast('Monthly trends details loaded')}
                className="px-md py-1.5 font-label-md text-xs rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                Month
              </button>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotificationDrawer(!showNotificationDrawer);
                  if (!showNotificationDrawer) {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  }
                }}
                className="w-12 h-12 flex items-center justify-center rounded-xl glass-card hover:bg-white/5 transition-all"
              >
                <span className="material-symbols-outlined text-primary-fixed">notifications</span>
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-error animate-pulse"></span>
                )}
              </button>

              {/* Notification Overlay List */}
              {showNotificationDrawer && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-high/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center">
                    <span className="font-label-md text-xs text-primary font-bold uppercase tracking-wider">Alerts Log</span>
                    <button className="text-[10px] text-secondary-fixed hover:underline" onClick={() => setNotifications([])}>Clear</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-on-surface-variant">No alerts registered.</div>
                    ) : (
                      notifications.map(item => (
                        <div key={item.id} className="px-4 py-2.5 border-b border-white/5 hover:bg-white/5 text-left">
                          <p className="text-[10px] text-on-surface-variant text-right mb-0.5">{item.time}</p>
                          <p className="text-xs text-primary leading-normal">{item.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* VIEW: HOME DASHBOARD */}
        {currentTab === 'home' && (
          <>
            {/* Desktop Horizontal Calendar */}
            <section className="mb-xl">
              <div className="flex justify-between items-center gap-md overflow-x-auto pb-4 no-scrollbar">
                {weeklyLogs.map(log => {
                  const active = log.dayNum === selectedDayNum;
                  return (
                    <div 
                      key={log.dayNum}
                      onClick={() => setSelectedDayNum(log.dayNum)}
                      className={`flex flex-col items-center min-w-[90px] p-md glass-card rounded-xl cursor-pointer hover:border-primary-fixed/30 hover:opacity-100 transition-all ${
                        active 
                          ? 'border-primary-fixed bg-surface-variant/40 accent-glow-lime opacity-100 scale-105' 
                          : 'opacity-60'
                      }`}
                    >
                      <span className={`font-label-sm text-xs mb-xs ${active ? 'text-primary-fixed font-bold' : 'text-on-surface-variant'}`}>
                        {log.dayName}
                      </span>
                      <span className={`font-headline-lg text-2xl ${active ? 'text-primary-fixed font-bold' : 'text-primary'}`}>
                        {log.dayNum}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PERFORMANCE MODE: Bento Grid Layout */}
            {dashboardMode === 'performance' && (
              <div className="grid grid-cols-12 gap-lg items-start">
                
                {/* LEFT COLUMN: Cardio & Recovery (4 cols) */}
                <section className="col-span-12 lg:col-span-4 space-y-lg">
                  {/* Cardio Card */}
                  <div className="glass-card p-lg rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all">
                    <div className="flex justify-between items-center mb-lg">
                      <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">Cardio Performance</h3>
                      <span className="material-symbols-outlined text-secondary-fixed-dim">directions_run</span>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-base">
                      <div className="relative w-48 h-48 mb-lg">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="96" cy="96" fill="none" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="10"></circle>
                          <circle 
                            className="drop-shadow-[0_0_8px_rgba(171,214,0,0.5)] transition-all duration-700" 
                            cx="96" cy="96" fill="none" r="80" 
                            stroke="url(#gradient-lime)" 
                            strokeDasharray="502" 
                            strokeDashoffset={502 - (502 * (stepsPercent / 100))} 
                            strokeLinecap="round" strokeWidth="10"
                          ></circle>
                        </svg>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-stat-value text-stat-value text-2xl text-primary font-bold">
                            {activeLog.steps.toLocaleString()}
                          </span>
                          <span className="font-label-sm text-[10px] text-on-surface-variant tracking-wider font-semibold">
                            STEPS ({stepsPercent}%)
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-md w-full text-center">
                        <div className="p-md bg-surface-container/40 rounded-xl border border-white/5 relative group">
                          <p className="font-label-sm text-xs text-on-surface-variant mb-xs">Distance</p>
                          <p className="font-headline-lg text-lg text-secondary-fixed-dim font-bold">{activeLog.km} <span className="text-xs font-normal">km</span></p>
                          <div className="absolute inset-0 bg-surface-container flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <button onClick={() => addSteps(1000)} className="text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded font-bold">+1k steps</button>
                          </div>
                        </div>
                        <div className="p-md bg-surface-container/40 rounded-xl border border-white/5 relative group">
                          <p className="font-label-sm text-xs text-on-surface-variant mb-xs">Active Time</p>
                          <p className="font-headline-lg text-lg text-primary-fixed font-bold">{activeLog.activeMin} <span className="text-xs font-normal">min</span></p>
                          <div className="absolute inset-0 bg-surface-container flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <button onClick={() => setCurrentTab('workouts')} className="text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded font-bold">Start Timer</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Recovery Card */}
                  <div className="glass-card p-lg rounded-2xl hover:border-white/20 transition-all">
                    <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-lg">Body Recovery</h3>
                    
                    <div className="space-y-md">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="font-label-sm text-xs text-on-surface-variant mb-0.5">Recovery Score</p>
                          <p className="font-stat-value text-stat-value text-2xl text-primary font-bold">{activeLog.recovery}%</p>
                        </div>
                        <div className="flex gap-1.5 h-12 items-end">
                          <div className="w-2.5 bg-primary-fixed/20 h-6 rounded-full"></div>
                          <div className="w-2.5 bg-primary-fixed/40 h-8 rounded-full"></div>
                          <div className="w-2.5 bg-primary-fixed h-11 rounded-full accent-glow-lime animate-pulse"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-sm pt-md border-t border-white/5 text-center">
                        <div className="hover:bg-white/5 py-1.5 rounded transition-colors">
                          <span className="material-symbols-outlined text-secondary-fixed-dim text-lg">bedtime</span>
                          <p className="font-label-sm text-xs mt-1 font-semibold text-primary">{activeLog.sleep}h</p>
                          <span className="text-[9px] text-on-surface-variant uppercase font-semibold">Sleep</span>
                        </div>
                        <div className="hover:bg-white/5 py-1.5 rounded transition-colors">
                          <span className="material-symbols-outlined text-error text-lg">favorite</span>
                          <p className="font-label-sm text-xs mt-1 font-semibold text-primary">{liveHeartRate} bpm</p>
                          <span className="text-[9px] text-on-surface-variant uppercase font-semibold">HR</span>
                        </div>
                        <div className="hover:bg-white/5 py-1.5 rounded transition-colors cursor-pointer group relative" onClick={() => addHydration(0.25)}>
                          <span className="material-symbols-outlined text-cyan-400 text-lg">water_drop</span>
                          <p className="font-label-sm text-xs mt-1 font-semibold text-primary">
                            {getWaterDisplayValue(activeLog.water)}
                          </p>
                          <span className="text-[9px] text-on-surface-variant uppercase font-semibold group-hover:hidden">Water</span>
                          <span className="text-[9px] text-cyan-300 font-bold hidden group-hover:block">+250ml</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Strength & PR details (8 cols) */}
                <section className="col-span-12 lg:col-span-8 space-y-lg">
                  <div className="glass-card p-lg rounded-2xl hover:border-white/20 transition-all">
                    <div className="flex justify-between items-center mb-xl">
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-primary-fixed">fitness_center</span>
                        <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">Strength Training</h3>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-primary-container/10 text-primary-fixed text-xs font-bold rounded-full">
                          {activeLog.workout.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-surface-variant text-on-surface-variant text-xs font-bold rounded-full">
                          SESSION #24
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
                      <div className="flex flex-col items-center md:items-start p-3 bg-surface-container-low/60 rounded-xl border border-white/5">
                        <span className="font-label-sm text-xs text-on-surface-variant mb-1">Workout Exercises</span>
                        <span className="font-stat-value text-stat-value text-2xl text-primary font-bold">
                          {activeLog.sets > 0 ? '06' : '00'}
                        </span>
                        <div className="w-full h-1 bg-surface-container mt-3 rounded-full overflow-hidden">
                          <div className="bg-primary-fixed h-full w-full"></div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-start p-3 bg-surface-container-low/60 rounded-xl border border-white/5 relative group">
                        <span className="font-label-sm text-xs text-on-surface-variant mb-1">Total Sets</span>
                        <span className="font-stat-value text-stat-value text-2xl text-primary font-bold">{activeLog.sets}</span>
                        <div className="w-full h-1 bg-surface-container mt-3 rounded-full overflow-hidden">
                          <div className="bg-secondary-fixed-dim h-full" style={{ width: `${Math.min(100, (activeLog.sets/20)*100)}%` }}></div>
                        </div>
                        <button onClick={() => setShowLogWorkoutModal(true)} className="absolute inset-0 bg-surface-container flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-xs text-secondary-fixed font-bold">
                          + Add Set
                        </button>
                      </div>

                      <div className="flex flex-col items-center md:items-start p-3 bg-surface-container-low/60 rounded-xl border border-white/5">
                        <span className="font-label-sm text-xs text-on-surface-variant mb-1">Total Reps</span>
                        <span className="font-stat-value text-stat-value text-2xl text-primary font-bold">{activeLog.reps}</span>
                        <div className="w-full h-1 bg-surface-container mt-3 rounded-full overflow-hidden">
                          <div className="bg-tertiary-fixed-dim h-full" style={{ width: `${Math.min(100, (activeLog.reps/200)*100)}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                      <div>
                        <h4 className="font-label-md text-sm text-on-surface font-semibold mb-lg">Muscle Intensity</h4>
                        <div className="space-y-md">
                          <div>
                            <div className="flex justify-between font-label-sm text-xs text-on-surface-variant mb-xs">
                              <span>Chest</span>
                              <span>{activeLog.chest}%</span>
                            </div>
                            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                              <div className="bg-primary-fixed h-full transition-all duration-500" style={{ width: `${activeLog.chest}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between font-label-sm text-xs text-on-surface-variant mb-xs">
                              <span>Triceps</span>
                              <span>{activeLog.triceps}%</span>
                            </div>
                            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                              <div className="bg-primary-fixed h-full transition-all duration-500" style={{ width: `${activeLog.triceps}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between font-label-sm text-xs text-on-surface-variant mb-xs">
                              <span>Shoulders</span>
                              <span>{activeLog.shoulders}%</span>
                            </div>
                            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                              <div className="bg-primary-fixed h-full transition-all duration-500" style={{ width: `${activeLog.shoulders}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Weekly consistency chart */}
                      <div className="bg-surface-container/30 rounded-xl p-md border border-white/5 flex flex-col justify-between">
                        <h4 className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant mb-sm">Weekly Consistency</h4>
                        <div className="flex items-end justify-between h-32 gap-2.5 pt-2">
                          {weeklyLogs.map(item => {
                            const active = item.dayNum === selectedDayNum;
                            const barHeight = item.sets > 0 ? `${(item.sets / 20) * 100}%` : '10%';
                            return (
                              <div key={item.dayNum} onClick={() => setSelectedDayNum(item.dayNum)} className="flex-grow flex flex-col items-center gap-1 group cursor-pointer">
                                <div className="w-full bg-surface-variant/30 rounded-t-sm h-[90px] flex items-end">
                                  <div className={`w-full rounded-t-sm transition-all duration-500 ${
                                    active ? 'bg-primary-fixed accent-glow-lime' : 'bg-surface-variant/70 hover:bg-primary-fixed/50'
                                  }`} style={{ height: barHeight }}></div>
                                </div>
                                <span className={`text-[10px] font-bold ${active ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                                  {item.dayName[0]}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    {prLogs.map(log => (
                      <div key={log.id} className={`glass-card p-lg rounded-2xl flex items-center gap-lg hover:scale-[1.02] transition-all border-l-4 ${
                        log.type === 'pr' ? 'border-l-primary-fixed' : 'border-l-secondary-fixed'
                      }`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                          log.type === 'pr' ? 'bg-primary-container/20' : 'bg-secondary-container/20'
                        }`}>
                          <span className={`material-symbols-outlined text-3xl ${log.type === 'pr' ? 'text-primary-fixed' : 'text-secondary-fixed-dim'}`}>
                            {log.type === 'pr' ? 'emoji_events' : 'bolt'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-headline-lg text-md text-primary font-bold">{log.title}</h4>
                          <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">{log.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* WELLNESS STATUS MODE (FitSync Status details) */}
            {dashboardMode === 'wellness' && (
              <div className="grid grid-cols-12 gap-lg items-start animate-fade-in">
                
                {/* LEFT COLUMN: Calorie Intake & Burn details (6 cols) */}
                <section className="col-span-12 lg:col-span-6 space-y-lg">
                  <div className="glass-surface rounded-xl p-lg relative overflow-hidden flex flex-col justify-between">
                    
                    <div className="flex justify-between items-start mb-md">
                      <div>
                        <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">Energy Burned</p>
                        <div className="flex items-baseline gap-xs">
                          <span className="font-stat-value text-4xl font-bold text-primary-fixed glow-lime">512</span>
                          <span className="font-label-md text-xs text-on-surface-variant">kcal</span>
                        </div>
                      </div>
                      
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90">
                          <circle className="text-white/10" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="5"></circle>
                          <circle className="text-primary-fixed glow-lime transition-all duration-1000" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset="47.5" strokeLinecap="round" strokeWidth="5"></circle>
                        </svg>
                        <span className="absolute font-label-sm text-xs text-primary font-bold">73%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-md mb-lg">
                      <div className="bg-white/5 rounded-lg p-sm border border-white/5">
                        <p className="font-label-sm text-xs text-on-surface-variant mb-xs">Active Burn</p>
                        <p className="font-headline-lg-mobile text-sm font-bold text-primary">312 <span className="text-[10px] opacity-60">kcal</span></p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-sm border border-white/5">
                        <p className="font-label-sm text-xs text-on-surface-variant mb-xs">Resting Metabolic</p>
                        <p className="font-headline-lg-mobile text-sm font-bold text-primary">200 <span className="text-[10px] opacity-60">kcal</span></p>
                      </div>
                    </div>

                    {/* Hourly burn graph list */}
                    <div className="h-20 flex items-end justify-between gap-1 mb-md bg-background/45 p-2 rounded-lg border border-white/5">
                      {hourlyBurnData.map((h, i) => (
                        <div 
                          key={i} 
                          style={{ height: `${h}%` }}
                          className="w-full bg-primary-fixed/20 rounded-t-xs transition-all hover:bg-primary-fixed cursor-pointer"
                        ></div>
                      ))}
                    </div>

                    {/* Calorie food Logger input */}
                    <div className="border-t border-white/10 pt-md flex justify-between items-center gap-sm">
                      <div className="text-xs">
                        <p className="text-on-surface-variant">Intake: <span className="text-primary font-bold">{calorieIntake} kcal</span></p>
                        <p className="text-primary-fixed font-bold">Net: +{calorieIntake - 512} kcal</p>
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <input 
                          type="number" placeholder="+ kcal"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = parseInt(e.target.value) || 0;
                              if (val > 0) {
                                setCalorieIntake(prev => prev + val);
                                triggerToast(`🥗 Logged Food Intake: +${val} kcal`);
                                e.target.value = '';
                              }
                            }
                          }}
                          className="w-20 bg-background/80 border border-white/10 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-primary-fixed text-primary text-center"
                        />
                      </div>
                    </div>

                  </div>
                </section>

                {/* RIGHT COLUMN: Hydration & BMI Calculators (6 cols) */}
                <section className="col-span-12 lg:col-span-6 space-y-lg">
                  
                  {/* Hydration Segment indicator */}
                  <div className="glass-surface rounded-xl p-lg">
                    <div className="flex items-center gap-base mb-md">
                      <span className="material-symbols-outlined text-secondary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                      <p className="font-label-md text-xs text-secondary-fixed-dim uppercase tracking-wider font-bold">Hydration</p>
                    </div>

                    <div className="flex items-end justify-between mb-lg">
                      <div className="space-y-xs">
                        <div className="flex items-baseline gap-xs">
                          <span className="font-stat-value text-3xl font-bold text-primary">{(hydrationLogs.glassesLog * 0.25).toFixed(2)}</span>
                          <span className="font-label-md text-xs text-on-surface-variant">Liters</span>
                        </div>
                        <p className="font-body-md text-xs text-on-surface-variant">{hydrationLogs.glassesLog}/8 glasses completed</p>
                      </div>
                      <div className="bg-secondary-fixed-dim/20 px-md py-1 rounded-full border border-secondary-fixed-dim/30">
                        <p className="font-label-sm text-xs text-secondary-fixed-dim">{8 - hydrationLogs.glassesLog} more to go</p>
                      </div>
                    </div>

                    {/* Progress bars segment boxes */}
                    <div className="flex gap-1.5 justify-between mb-lg">
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const active = idx < hydrationLogs.glassesLog;
                        return (
                          <button 
                            key={idx}
                            onClick={() => toggleWaterSegment(idx)}
                            className={`flex-1 h-3 rounded-full transition-all outline-none ${
                              active ? 'bg-secondary-fixed-dim glow-cyan' : 'bg-white/10 hover:bg-white/20'
                            }`}
                          ></button>
                        );
                      })}
                    </div>

                    <div className="bg-surface-container-low rounded-lg p-sm border border-white/5 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-xs">history</span>
                        <span>Last Log: {hydrationLogs.lastLogTime}</span>
                      </div>
                      <div className="flex items-center gap-xs text-secondary-fixed-dim font-bold">
                        <span className="material-symbols-outlined text-xs">alarm</span>
                        <span>Next Target: {hydrationLogs.nextReminderTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body composition scale BMI */}
                  <div className="glass-surface rounded-xl p-lg">
                    <div className="flex justify-between items-center mb-md">
                      <div className="flex items-center gap-base">
                        <span className="material-symbols-outlined text-tertiary-fixed-dim">monitor_weight</span>
                        <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold">Body Composition</p>
                      </div>
                      <div className="flex items-center gap-xs text-error font-semibold">
                        <span className="material-symbols-outlined text-xs">trending_down</span>
                        <span className="text-xs">0.3 pts (Weekly)</span>
                      </div>
                    </div>

                    <div className="text-center mb-lg">
                      <p className="font-stat-value text-4xl text-primary font-bold mb-xs">{calculatedBmi}</p>
                      <div className="inline-flex items-center gap-xs px-md py-1 bg-primary-fixed/10 border border-primary-fixed/20 rounded-full text-xs">
                        <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
                        <p className="font-label-sm text-primary-fixed font-bold">Status: {getBmiStatus(calculatedBmi)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-base mb-lg text-center">
                      <div>
                        <p className="text-[10px] text-on-surface-variant font-semibold">Height (Profile)</p>
                        <p className="font-headline-lg-mobile text-sm font-bold text-primary">{userProfile.height}<span className="text-[10px] opacity-60">cm</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant font-semibold">Weight (Profile)</p>
                        <p className="font-headline-lg-mobile text-sm font-bold text-primary">{userProfile.weight}<span className="text-[10px] opacity-60">kg</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant font-semibold">Target BMI</p>
                        <p className="font-headline-lg-mobile text-sm font-bold text-secondary-fixed-dim">{userProfile.targetBmi}</p>
                      </div>
                    </div>

                    {/* Custom sliding Visual indicator marker scale */}
                    <div className="relative pt-6 pb-2">
                      <div className="h-2 w-full rounded-full bg-gradient-to-r from-secondary-fixed-dim via-primary-fixed to-tertiary-fixed-dim"></div>
                      
                      {/* Marker placement based on calculated BMI */}
                      <div 
                        style={{ left: `${getBmiMarkerPercent(calculatedBmi)}%` }}
                        className="absolute top-0 flex flex-col items-center transition-all duration-700 ease-out"
                      >
                        <div className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg"></div>
                        <div className="w-[2px] h-4 bg-primary/30"></div>
                      </div>
                      
                      <div className="flex justify-between mt-xs text-[10px] text-on-surface-variant uppercase font-semibold">
                        <span>Under</span>
                        <span>Normal</span>
                        <span>Over</span>
                        <span>Obese</span>
                      </div>
                    </div>

                    <div className="mt-md p-sm bg-white/5 rounded-lg border border-white/5 text-center text-xs">
                      <p className="text-on-surface">Healthy range: 18.5 - 24.9 BMI</p>
                      <p className="text-primary-fixed font-bold">Your ratio is in the optimal range!</p>
                    </div>

                  </div>
                </section>

              </div>
            )}
          </>
        )}

        {/* VIEW: WORKOUTS HUB (OR RUNNING DETAILS) */}
        {currentTab === 'workouts' && (
          <div>
            {activeWorkoutSubView === 'running' ? (
              /* ========================================= */
              /* DESKTOP WORKOUT SUBVIEW: RUNNING DETAILS */
              /* ========================================= */
              <div className="space-y-lg animate-fade-in">
                <div className="grid grid-cols-12 gap-lg">
                  <div className="col-span-12 lg:col-span-8 space-y-lg">
                    {/* Running Hero Card */}
                    <div className="glass-card rounded-xl p-lg flex flex-col md:flex-row items-center gap-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                      <div className="flex-1">
                        <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-xs">Total Miles</p>
                        <h3 className="font-stat-value text-5xl font-bold text-primary-fixed lime-glow mb-sm">
                          {totalMiles.toFixed(1)} <span className="text-xl font-normal text-on-surface-variant">mi</span>
                        </h3>
                        
                        <div className="flex items-center gap-sm">
                          <span className="px-3 py-1 bg-primary-container/20 text-primary-fixed rounded-full text-xs font-semibold">
                            {runsList.length} runs this week
                          </span>
                          <span className="text-on-surface-variant text-xs flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-[16px] text-primary-fixed">trending_up</span>
                            +12% from last week
                          </span>
                        </div>
                      </div>

                      {/* Small mini-bar chart */}
                      <div className="w-full md:w-64 h-32 flex items-end gap-2 px-md">
                        {weeklyLogs.map((log, index) => {
                          const logMiles = log.runMiles;
                          const pct = logMiles > 0 ? `${Math.min(100, (logMiles / 12) * 100)}%` : '15%';
                          const isThu = log.dayName === 'THU';
                          return (
                            <div 
                              key={index} 
                              style={{ height: pct }}
                              className={`flex-1 rounded-t-sm transition-all duration-300 ${
                                isThu 
                                  ? 'bg-primary-fixed shadow-[0_0_15px_rgba(171,214,0,0.3)]' 
                                  : 'bg-surface-container-highest hover:bg-primary-fixed'
                              }`}
                            ></div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive chart miles per day */}
                    <div className="glass-card rounded-xl p-lg">
                      <div className="flex justify-between items-center mb-xl">
                        <h4 className="font-headline-lg text-lg text-primary font-bold">Miles per Day</h4>
                        <div className="flex gap-xs">
                          <button 
                            onClick={() => setSelectedRunningMetric('distance')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                              selectedRunningMetric === 'distance' 
                                ? 'bg-primary-fixed text-on-primary' 
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                            }`}
                          >
                            Distance
                          </button>
                          <button 
                            onClick={() => setSelectedRunningMetric('intensity')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                              selectedRunningMetric === 'intensity' 
                                ? 'bg-primary-fixed text-on-primary' 
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                            }`}
                          >
                            Intensity
                          </button>
                        </div>
                      </div>

                      <div className="h-64 relative w-full flex items-end justify-between px-4 pb-8 border-b border-white/10">
                        <div className="absolute inset-0 flex flex-col justify-between py-8 pointer-events-none">
                          <div className="border-t border-white/5 w-full"></div>
                          <div className="border-t border-white/5 w-full"></div>
                          <div className="border-t border-white/5 w-full"></div>
                        </div>

                        {/* Graph bars */}
                        {weeklyLogs.map((log, index) => {
                          let barHeight = '10%';
                          if (selectedRunningMetric === 'distance') {
                            barHeight = log.runMiles > 0 ? `${(log.runMiles / 12) * 100}%` : '5%';
                          } else {
                            barHeight = log.steps > 0 ? `${(log.steps / 15000) * 100}%` : '8%';
                          }

                          const active = log.dayNum === selectedDayNum;
                          const barColor = active 
                            ? 'bg-primary-fixed shadow-[0_0_15px_rgba(171,214,0,0.4)]' 
                            : 'bg-secondary-fixed-dim';

                          return (
                            <div key={index} className="group relative flex flex-col items-center w-12 cursor-pointer" onClick={() => setSelectedDayNum(log.dayNum)}>
                              <span className="absolute bottom-full mb-1 text-[10px] bg-surface-container border border-white/10 text-primary-fixed px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                {selectedRunningMetric === 'distance' ? `${log.runMiles} mi` : `${Math.round(log.steps/80)} bpm`}
                              </span>
                              <div style={{ height: barHeight }} className={`w-2.5 rounded-t-full transition-all group-hover:w-4 ${barColor}`}></div>
                              <span className={`absolute -bottom-8 text-xs font-semibold ${active ? 'text-primary-fixed font-bold' : 'text-on-surface-variant'}`}>
                                {log.dayName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metrics Aside (4 cols) */}
                  <aside className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-md items-start">
                    
                    <div className="glass-card rounded-xl p-md col-span-1 flex flex-col justify-between">
                      <span className="material-symbols-outlined text-secondary-fixed-dim mb-sm">pace</span>
                      <p className="text-xs text-on-surface-variant uppercase font-semibold">Avg Pace</p>
                      <p className="text-xl font-bold text-primary font-mono">8'12"</p>
                    </div>

                    <div className="glass-card rounded-xl p-md col-span-1 flex flex-col justify-between">
                      <span className="material-symbols-outlined text-error mb-sm">favorite</span>
                      <p className="text-xs text-on-surface-variant uppercase font-semibold">Avg HR</p>
                      <p className="text-xl font-bold text-primary">142 <span className="text-xs text-on-surface-variant font-normal">bpm</span></p>
                    </div>

                    <div className="glass-card rounded-xl p-md col-span-1 flex flex-col justify-between">
                      <span className="material-symbols-outlined text-secondary-container mb-sm">filter_hdr</span>
                      <p className="text-xs text-on-surface-variant uppercase font-semibold">Elevation</p>
                      <p className="text-xl font-bold text-primary font-mono">842 <span className="text-xs text-on-surface-variant font-normal">ft</span></p>
                    </div>

                    <div className="glass-card rounded-xl p-md col-span-1 flex flex-col justify-between">
                      <span className="material-symbols-outlined text-tertiary-fixed-dim mb-sm">local_fire_department</span>
                      <p className="text-xs text-on-surface-variant uppercase font-semibold">Calories</p>
                      <p className="text-xl font-bold text-primary font-mono">2,140</p>
                    </div>

                    {/* Shoe mileage card */}
                    <div className="glass-card rounded-xl p-lg col-span-2 relative overflow-hidden group">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-md">
                          <div>
                            <h4 className="font-label-md text-xs text-primary-fixed uppercase tracking-wider font-bold">Shoe Mileage</h4>
                            <p className="text-sm font-semibold text-primary">Nike Pegasus 40</p>
                          </div>
                          <span className="material-symbols-outlined text-primary-fixed">straighten</span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-2 mb-xs">
                          <div className="bg-primary-fixed h-full rounded-full lime-glow" style={{ width: `${(shoeMileage/500)*100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-on-surface-variant">
                          <span>{shoeMileage.toFixed(0)} mi logged</span>
                          <span>500 mi limit</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Cadence tip */}
                    <div className="glass-card rounded-xl p-md col-span-2 flex items-center gap-md border-l-4 border-secondary-container">
                      <div className="w-12 h-12 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary-container shrink-0">
                        <span className="material-symbols-outlined">auto_fix_high</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary">Performance Tip</p>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Your cadence is up 4% this week. Focus on short strides.</p>
                      </div>
                    </div>
                  </aside>
                </div>

                {/* Recent Runs Table */}
                <section className="glass-card rounded-xl overflow-hidden">
                  <div className="p-lg border-b border-white/5 flex justify-between items-center">
                    <h4 className="font-headline-lg text-lg text-primary font-bold">Recent Runs</h4>
                    <button 
                      onClick={() => setShowLogRunModal(true)}
                      className="text-primary-fixed font-label-md text-xs font-bold hover:underline"
                    >
                      + Log New Run
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs text-on-surface-variant bg-surface-container-low/50 uppercase tracking-widest">
                          <th className="px-lg py-md">Date</th>
                          <th className="px-lg py-md">Route Name</th>
                          <th className="px-lg py-md">Distance</th>
                          <th className="px-lg py-md">Duration</th>
                          <th className="px-lg py-md">Pace</th>
                          <th className="px-lg py-md text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {runsList.map(run => (
                          <tr key={run.id} className="hover:bg-surface-bright/20 transition-colors group">
                            <td className="px-lg py-lg text-xs font-semibold text-primary">{run.date} • {run.time}</td>
                            <td className="px-lg py-lg">
                              <div className="flex items-center gap-sm">
                                <div className="w-8 h-8 rounded bg-surface-container-highest overflow-hidden border border-white/5 shrink-0">
                                  <img 
                                    src={run.img} 
                                    alt="Route preview map" 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                                  />
                                </div>
                                <span className="font-label-md text-xs text-primary font-semibold">{run.name}</span>
                              </div>
                            </td>
                            <td className="px-lg py-lg text-xs text-primary font-bold">{run.distance} mi</td>
                            <td className="px-lg py-lg text-xs text-on-surface-variant">{run.duration}</td>
                            <td className="px-lg py-lg text-xs text-on-surface-variant font-mono">{run.pace}</td>
                            <td className="px-lg py-lg text-right">
                              <button 
                                onClick={() => triggerToast(`Visual route map path loaded`)}
                                className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed text-md"
                              >
                                open_in_new
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            ) : (
              /* ========================================= */
              /* DESKTOP WORKOUTS HUB GENERAL VIEW */
              /* ========================================= */
              <div className="grid grid-cols-12 gap-lg items-start animate-fade-in">
                
                {/* Selector cards column */}
                <div className="col-span-12 lg:col-span-6 space-y-lg">
                  <div className="glass-card p-lg rounded-2xl border border-white/10">
                    <h3 className="font-headline-lg text-lg text-primary font-bold mb-sm">Workout Disciplines</h3>
                    <p className="text-xs text-on-surface-variant mb-xl">Select an exercise format below to review metrics history, milestone achievements, and logs.</p>

                    <div className="flex flex-col gap-sm">
                      <div 
                        onClick={() => setActiveWorkoutSubView('running')}
                        className="p-lg bg-surface-container/60 hover:bg-surface-container border border-white/5 hover:border-primary-fixed/30 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-md">
                          <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-fixed">
                            <span className="material-symbols-outlined text-3xl">directions_run</span>
                          </div>
                          <div>
                            <h4 className="font-label-md text-sm text-primary font-bold">Running Performance</h4>
                            <p className="text-xs text-on-surface-variant mt-0.5">{totalMiles.toFixed(1)} miles tracked this week • {runsList.length} runs</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                      </div>

                      <div 
                        onClick={() => { setActiveWorkoutSubView(null); setCurrentTab('home'); setDashboardMode('performance'); }}
                        className="p-lg bg-surface-container/60 hover:bg-surface-container border border-white/5 hover:border-primary-fixed/30 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-md">
                          <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-fixed">
                            <span className="material-symbols-outlined text-3xl">fitness_center</span>
                          </div>
                          <div>
                            <h4 className="font-label-md text-sm text-primary font-bold">Strength Session Analytics</h4>
                            <p className="text-xs text-on-surface-variant mt-0.5">{activeLog.sets} sets logged today ({activeLog.workout})</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick exercise schedule planner */}
                  <div className="glass-card p-lg rounded-2xl">
                    <div className="flex justify-between items-center mb-lg">
                      <h3 className="font-headline-lg text-md text-primary font-bold">Strength Routines Planner</h3>
                      <button 
                        onClick={() => setShowLogWorkoutModal(true)}
                        className="text-xs bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-bold"
                      >
                        + Log Set
                      </button>
                    </div>

                    <div className="flex flex-col gap-sm">
                      {[
                        { name: 'Bench Press', routine: 'Chest & Triceps', repinfo: '4 Sets x 8 Reps', done: true },
                        { name: 'Incline Dumbbell Flys', routine: 'Chest Focus', repinfo: '3 Sets x 12 Reps', done: true },
                        { name: 'Dips (Weighted)', routine: 'Triceps & Lower Chest', repinfo: '3 Sets x 8 Reps', done: false }
                      ].map((ex, idx) => (
                        <div key={idx} className="flex justify-between items-center p-sm bg-surface-container-high/40 rounded-xl border border-white/5">
                          <div>
                            <p className="font-label-md text-xs text-primary font-bold">{ex.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{ex.routine} • {ex.repinfo}</p>
                          </div>
                          <button onClick={() => triggerToast(`Logged sets for ${ex.name}`)} className="w-8 h-8 rounded-full bg-primary-fixed/20 text-primary-fixed flex items-center justify-center">
                            <span className="material-symbols-outlined text-xs">check</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Workout Stopwatch Column */}
                <div className="col-span-12 lg:col-span-6 glass-card p-lg rounded-2xl border border-white/10 flex flex-col justify-between min-h-[350px]">
                  <div>
                    <h3 className="font-headline-lg text-lg text-primary mb-1">⏱️ Live Stopwatch Timer</h3>
                    <p className="text-xs text-on-surface-variant mb-lg">Track and clock your exercises in real time. Elapsed minutes automatically log into your active metrics.</p>
                  </div>

                  <div className="py-xl flex flex-col items-center justify-center bg-background/50 border border-white/5 rounded-xl my-md">
                    {!workoutActive ? (
                      <button 
                        onClick={startWorkout}
                        className="w-40 h-40 rounded-full bg-primary-fixed text-on-primary-fixed font-headline-lg text-stat-value shadow-2xl flex flex-col items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all outline-none"
                      >
                        <span className="material-symbols-outlined text-4xl mb-1">play_arrow</span>
                        <span className="text-xs tracking-wider uppercase font-semibold">Start Stopwatch</span>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="w-3 h-3 rounded-full bg-error animate-ping mb-3"></span>
                        <h4 className="font-stat-value text-5xl font-mono text-primary font-bold tracking-widest mb-lg">
                          {formatTimer(timerSeconds)}
                        </h4>
                        
                        <div className="flex gap-4">
                          <button 
                            onClick={pauseWorkout}
                            className="px-6 py-2 bg-surface-variant border border-white/15 text-primary-fixed text-sm font-semibold rounded-full active:scale-95 hover:bg-white/5 transition-all"
                          >
                            {workoutPaused ? 'Resume' : 'Pause'}
                          </button>
                          <button 
                            onClick={stopWorkout}
                            className="px-6 py-2 bg-error/20 border border-error/45 text-error text-sm font-semibold rounded-full active:scale-95 hover:bg-error/35 transition-all"
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* VIEW: COMMUNITY (SOCIAL) */}
        {currentTab === 'community' && (
          <div className="grid grid-cols-12 gap-lg items-start animate-fade-in">
            {/* Friends Leaderboard */}
            <div className="col-span-12 lg:col-span-6 glass-card p-lg rounded-2xl">
              <h3 className="font-headline-lg text-lg text-primary mb-md">Leaderboard Challenges</h3>
              <div className="flex flex-col gap-sm">
                {[
                  { rank: 1, name: 'Sarah Miller', score: '14,232 steps', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtXGk-Zp7Hxto9p5Q1z3m6j9L5bVw6c7F6E_V4N3u8tWq0' },
                  { rank: 2, name: `${userProfile.name} (You)`, score: `${activeLog.steps.toLocaleString()} steps`, active: true, avatar: userProfile.avatar },
                  { rank: 3, name: 'John Doe', score: '9,432 steps', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuEtWq0z7Hxto9p5Q1z3m6j9L5bVw6c7F6E_V4N3u8' }
                ].map((friend, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-sm rounded-xl border transition-all ${
                      friend.active 
                        ? 'bg-primary-container/10 border-primary-fixed/30 shadow-md' 
                        : 'bg-surface-container-high/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-sm">
                      <span className={`w-5 font-headline-lg font-bold text-center ${friend.rank === 1 ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                        {friend.rank}
                      </span>
                      <img src={friend.avatar} alt="User img" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-label-md text-xs text-primary font-bold">{friend.name}</div>
                        <div className="text-[11px] text-on-surface-variant">{friend.score}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => triggerToast(friend.active ? 'Score shared!' : 'Buddy cheered!')}
                      className="text-xs bg-surface-variant hover:bg-white/10 border border-white/15 px-3 py-1 rounded-full text-on-surface-variant hover:text-white"
                    >
                      {friend.active ? 'Share' : 'Cheer'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekend Challenge */}
            <div className="col-span-12 lg:col-span-6 bg-gradient-to-br from-surface-container/80 to-surface-container-high/80 backdrop-blur-xl border border-white/10 p-lg rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-[40px] pointer-events-none -mr-12 -mt-12"></div>
              
              <div className="flex items-center gap-xs mb-sm">
                <span className="material-symbols-outlined text-secondary-fixed text-sm">groups</span>
                <span className="font-label-sm text-[10px] text-secondary-fixed uppercase tracking-wider font-bold">Team Challenge</span>
              </div>
              <h3 className="font-headline-lg text-lg text-primary font-bold mb-1">Weekend Hydration Warriors</h3>
              <p className="text-xs text-on-surface-variant mb-md leading-relaxed">Drink 8 glasses of water daily from Fri-Sun. Team goal: 80% completion.</p>
              
              <div className="flex justify-between text-xs mb-2 font-semibold">
                <span className="text-on-surface-variant">Team Complete Rate</span>
                <span className="text-secondary-fixed">68% Finished</span>
              </div>
              <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mb-lg">
                <div className="bg-secondary-fixed h-full rounded-full w-[68%]" />
              </div>

              <button className="w-full py-2 bg-secondary-fixed text-on-secondary-fixed hover:bg-white transition-all font-semibold rounded-lg shadow-lg active:scale-95 text-xs">
                View Challenge Board
              </button>
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS (PREFERENCES) */}
        {currentTab === 'settings' && (
          <div className="max-w-2xl bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/10 p-lg shadow-lg animate-fade-in flex flex-col gap-lg">
            
            <div className="border-b border-white/5 pb-md">
              <h3 className="font-headline-lg text-lg text-primary">Elite Preferences Configurations</h3>
              <p className="text-xs text-on-surface-variant">Configure metrics, weight and height composition tracking values.</p>
            </div>

            <div className="flex flex-col gap-md">
              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Profile User Name</label>
                  <input 
                    type="text" value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Member Level</label>
                  <input 
                    type="number" value={userProfile.level}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              {/* Height / Weight body compositions */}
              <div className="grid grid-cols-3 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Height (cm)</label>
                  <input 
                    type="number" value={userProfile.height}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Weight (kg)</label>
                  <input 
                    type="number" step="0.1" value={userProfile.weight}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Target BMI</label>
                  <input 
                    type="number" step="0.1" value={userProfile.targetBmi}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, targetBmi: parseFloat(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Avatar Image Link</label>
                <input 
                  type="text" value={userProfile.avatar}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, avatar: e.target.value }))}
                  className="bg-background border border-white/10 rounded-lg px-3 py-2 text-xs text-on-surface-variant focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="mt-lg border-t border-white/5 pt-lg flex flex-col gap-md">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant font-semibold">Daily Steps Target</span>
                  <span className="text-sm font-bold text-primary-fixed">{userProfile.goals.steps.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="5000" max="15000" step="500" value={userProfile.goals.steps}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, goals: { ...prev.goals, steps: parseInt(e.target.value) } }))}
                  className="w-full accent-primary-fixed h-1.5 bg-surface-variant cursor-pointer"
                />

                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant font-semibold">Sleep hours Target</span>
                  <span className="text-sm font-bold text-secondary-fixed">{userProfile.goals.sleep} hrs</span>
                </div>
                <input 
                  type="range" min="6.0" max="9.5" step="0.5" value={userProfile.goals.sleep}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, goals: { ...prev.goals, sleep: parseFloat(e.target.value) } }))}
                  className="w-full accent-secondary-fixed h-1.5 bg-surface-variant cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MOBILE VIEWPORT Layout: APP BAR, MAIN AREA, BOTTOM BAR */}
      {/* ============================================================== */}
      <div className="block md:hidden min-h-screen pb-32">
        
        {/* Mobile Header TopAppBar */}
        <header className="fixed top-0 left-0 w-full bg-background/60 backdrop-blur-md z-45 flex items-center justify-between px-gutter h-16 border-b border-white/10 shadow-sm">
          <div className="flex items-center gap-sm">
            {activeWorkoutSubView === 'running' ? (
              <button 
                onClick={() => setActiveWorkoutSubView(null)}
                className="active:scale-95 duration-200 hover:opacity-80 transition-opacity w-8 h-8 rounded-full flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-primary">arrow_back</span>
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-variant ring-1 ring-white/20" onClick={() => { setCurrentTab('settings'); setActiveWorkoutSubView(null); }}>
                <img src={userProfile.avatar} alt="Profile avatar" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary-fixed leading-tight tracking-tight">
              {activeWorkoutSubView === 'running' ? 'Running' : (
                <>
                  {currentTab === 'home' && (dashboardMode === 'performance' ? 'Activity Coach' : 'FitSync')}
                  {currentTab === 'activity' && 'Activity Tracker'}
                  {currentTab === 'workouts' && 'Workouts Hub'}
                  {currentTab === 'community' && 'Community Social'}
                  {currentTab === 'settings' && 'User Preferences'}
                </>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-sm">
            <button 
              onClick={() => {
                setShowNotificationDrawer(!showNotificationDrawer);
                if (!showNotificationDrawer) {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                }
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-variant/30 active:scale-95 transition-all relative border border-white/5"
            >
              <span className="material-symbols-outlined text-primary-fixed">notifications</span>
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
              )}
            </button>

            {activeWorkoutSubView === 'running' && (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-surface-container shrink-0">
                <img src={userProfile.avatar} alt="Avatar profile small" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Notification dropdown for mobile */}
          {showNotificationDrawer && (
            <div className="absolute right-gutter top-16 w-72 bg-surface-container-high/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 py-2 animate-fade-in">
              <div className="px-4 py-1.5 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs text-primary font-bold">Alert Logs</span>
                <button className="text-[10px] text-secondary-fixed" onClick={() => setNotifications([])}>Clear</button>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-on-surface-variant">No alerts.</div>
                ) : (
                  notifications.map(item => (
                    <div key={item.id} className="px-4 py-2 border-b border-white/5 text-left">
                      <p className="text-[9px] text-on-surface-variant text-right mb-0.5">{item.time}</p>
                      <p className="text-xs text-on-background leading-tight">{item.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </header>

        {/* Mobile Page Canvas Content */}
        <main className="mt-20 px-container-padding flex flex-col gap-lg max-w-2xl mx-auto">
          
          {/* VIEW: RUNNING SUBVIEW FOR MOBILE */}
          {activeWorkoutSubView === 'running' && (
            <div className="flex flex-col gap-lg animate-fade-in">
              <section className="flex flex-col items-center py-xl text-center">
                <p className="font-label-md text-xs text-on-surface-variant mb-xs">Total Miles</p>
                <h2 className="font-display-lg text-4xl text-primary-container lime-glow font-bold">
                  {totalMiles.toFixed(1)} mi
                </h2>
                <p className="font-label-sm text-[10px] text-on-surface-variant bg-white/5 px-sm py-xs rounded-full mt-sm">
                  This week • {runsList.length} runs
                </p>
              </section>

              {/* Weekly chart */}
              <section className="glass-card rounded-xl p-lg">
                <div className="flex items-center justify-between mb-xl">
                  <h3 className="font-headline-lg-mobile text-sm text-primary font-bold">Weekly Activity</h3>
                  <span className="material-symbols-outlined text-primary-fixed-dim text-md">analytics</span>
                </div>

                <div className="flex items-end justify-between h-40 gap-xs">
                  {weeklyLogs.map((log, index) => {
                    const pct = log.runMiles > 0 ? `${Math.min(100, (log.runMiles / 12) * 100)}%` : '5%';
                    const isThu = log.dayName === 'THU';
                    const barColor = isThu ? 'bg-primary-fixed-dim shadow-[0_0_15px_rgba(171,214,0,0.4)]' : 'bg-primary-fixed-dim/20';

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-xs cursor-pointer" onClick={() => setSelectedDayNum(log.dayNum)}>
                        <div className="w-full bg-white/5 rounded-t-lg relative flex flex-col justify-end overflow-hidden h-[120px]">
                          <div className={`w-full h-full ${barColor}`} style={{ height: pct }}></div>
                        </div>
                        <span className={`font-label-sm text-[10px] ${isThu ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{log.dayName[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Detailed Metrics Grid */}
              <section className="grid grid-cols-2 gap-md">
                <div className="glass-card rounded-xl p-md">
                  <div className="flex items-center gap-xs mb-xs">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">timer</span>
                    <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold">Avg Pace</p>
                  </div>
                  <p className="font-stat-value text-lg font-bold text-primary">8'42"/mi</p>
                </div>

                <div className="glass-card rounded-xl p-md">
                  <div className="flex items-center gap-xs mb-xs">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">favorite</span>
                    <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold">Avg HR</p>
                  </div>
                  <p className="font-stat-value text-lg font-bold text-primary">152 bpm</p>
                </div>

                <div className="glass-card rounded-xl p-md">
                  <div className="flex items-center gap-xs mb-xs">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">landscape</span>
                    <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold">Elevation Gain</p>
                  </div>
                  <p className="font-stat-value text-lg font-bold text-primary">340 ft</p>
                </div>

                <div className="glass-card rounded-xl p-md">
                  <div className="flex items-center gap-xs mb-xs">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">local_fire_department</span>
                    <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold">Total Calories</p>
                  </div>
                  <p className="font-stat-value text-lg font-bold text-primary">2,150 kcal</p>
                </div>
              </section>

              {/* Recent Runs List */}
              <section className="mb-md">
                <div className="flex items-center justify-between mb-md">
                  <h3 className="font-headline-lg-mobile text-sm text-primary font-bold uppercase tracking-wider">Recent Runs</h3>
                  <button onClick={() => triggerToast('Viewing running archives')} className="text-primary-container font-label-md text-xs hover:underline">See All</button>
                </div>

                <div className="space-y-sm">
                  {runsList.map(run => (
                    <div 
                      key={run.id} 
                      onClick={() => triggerToast(`Details loaded for ${run.name}`)}
                      className="glass-card rounded-xl p-md flex items-center justify-between active:scale-[0.98] transition-transform duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded bg-primary-container/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary-container text-xl">directions_run</span>
                        </div>
                        <div>
                          <p className="font-label-md text-xs text-primary font-bold">{run.name}</p>
                          <p className="font-label-sm text-[10px] text-on-surface-variant">{run.date} • {run.time}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-label-md text-xs text-primary font-bold">{run.distance} mi</p>
                        <p className="font-label-sm text-[10px] text-on-surface-variant font-mono">{run.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* VIEW: HOME VIEW FOR MOBILE (COACH OR FITSYNC STATUS) */}
          {activeWorkoutSubView === null && currentTab === 'home' && (
            <div className="flex flex-col gap-lg animate-fade-in">
              {/* Mode switch header tabs */}
              <div className="flex bg-surface-container p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setDashboardMode('performance')}
                  className={`flex-1 py-1 text-xs rounded-full font-semibold transition-all ${
                    dashboardMode === 'performance' 
                      ? 'bg-surface-variant text-primary-fixed shadow' 
                      : 'text-on-surface-variant'
                  }`}
                >
                  Performance Summary
                </button>
                <button 
                  onClick={() => setDashboardMode('wellness')}
                  className={`flex-1 py-1 text-xs rounded-full font-semibold transition-all ${
                    dashboardMode === 'wellness' 
                      ? 'bg-surface-variant text-primary-fixed shadow' 
                      : 'text-on-surface-variant'
                  }`}
                >
                  Wellness Status
                </button>
              </div>

              {dashboardMode === 'performance' ? (
                /* Original Performance Summary screen */
                <>
                  <section className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed/5 rounded-full blur-[40px] pointer-events-none -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-xs mb-sm">
                      <span className="material-symbols-outlined text-secondary-fixed text-lg">auto_awesome</span>
                      <h2 className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-widest font-bold">Coaching Tip</h2>
                    </div>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                      Hi {userProfile.name.split(' ')[0]}! Steps are at <span className="text-primary-fixed font-bold">{activeLog.steps.toLocaleString()}</span> today. 
                      {activeLog.steps >= 10000 ? ' Target exceeded, great resilience! ' : ` Walk ${userProfile.goals.steps - activeLog.steps} more steps to hit goal. `}
                      Sleep of {activeLog.sleep} hrs provides adequate repair.
                    </p>
                  </section>

                  <div className="grid grid-cols-2 gap-sm">
                    <div className="col-span-2 bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md flex items-center justify-between shadow-sm relative overflow-hidden">
                      <div>
                        <div className="flex items-center gap-xs mb-xs">
                          <span className="material-symbols-outlined text-primary-fixed text-sm">directions_walk</span>
                          <h3 className="font-label-sm text-xs text-on-surface-variant uppercase">Steps</h3>
                        </div>
                        <div className="font-stat-value text-xl font-bold text-primary">{activeLog.steps.toLocaleString()}</div>
                        <div className="flex gap-1.5 mt-2">
                          <button onClick={() => addSteps(1000)} className="text-[10px] bg-primary-fixed text-on-primary-fixed font-bold px-2 py-0.5 rounded-full shadow">+1k</button>
                          <button onClick={() => addSteps(-1000)} className="text-[10px] bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full border border-white/10">-1k</button>
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-surface-variant relative flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path className="text-primary-fixed transition-all" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stepsPercent}, 100`} strokeWidth="3.5"></path>
                        </svg>
                        <span className="font-label-sm text-xs text-primary-fixed font-bold">{stepsPercent}%</span>
                      </div>
                    </div>

                    <div className="col-span-2 bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md shadow-sm">
                      <div className="flex items-center justify-between mb-sm">
                        <div className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-primary-fixed text-sm">timer</span>
                          <h3 className="font-label-sm text-xs text-on-surface-variant uppercase">Workout Timer</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-surface-container-high/40 p-2.5 rounded-lg border border-white/5">
                        {!workoutActive ? (
                          <button onClick={startWorkout} className="w-full py-1.5 bg-primary-fixed text-on-primary-fixed font-bold text-xs rounded-full flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-xs">play_arrow</span> Start Activity
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-between">
                            <span className="font-mono text-sm text-primary font-bold tracking-widest">{formatTimer(timerSeconds)}</span>
                            <div className="flex gap-1.5">
                              <button onClick={pauseWorkout} className="bg-surface-variant text-[10px] text-primary-fixed px-2 py-0.5 rounded-full border border-white/10">{workoutPaused ? 'Res' : 'Pau'}</button>
                              <button onClick={stopWorkout} className="bg-error/20 text-[10px] text-error px-2 py-0.5 rounded-full border border-error/30">End</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md shadow-sm">
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-error text-md animate-pulse">favorite</span>
                        <div>
                          <h3 className="text-[10px] text-on-surface-variant uppercase mb-0.5">Heart Rate</h3>
                          <p className="text-lg font-stat-value font-bold text-primary leading-none">{liveHeartRate} bpm</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md shadow-sm cursor-pointer" onClick={() => addHydration(1)}>
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-cyan-400 text-md">water_drop</span>
                        <div>
                          <h3 className="text-[10px] text-on-surface-variant uppercase mb-0.5">Hydration</h3>
                          <p className="text-lg font-stat-value font-bold text-primary leading-none">{getWaterDisplayValue(activeLog.water)}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              ) : (
                /* wellness status mockup details for mobile */
                <div className="flex flex-col gap-lg animate-fade-in">
                  
                  {/* Energy Burned section */}
                  <section className="glass-surface rounded-xl p-md relative overflow-hidden">
                    <div className="flex justify-between items-start mb-base">
                      <div>
                        <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">Energy Burned</p>
                        <div className="flex items-baseline gap-xs">
                          <span className="font-stat-value text-3xl font-bold text-primary-fixed glow-lime">512</span>
                          <span className="font-label-md text-xs text-on-surface-variant">kcal</span>
                        </div>
                      </div>
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90">
                          <circle className="text-white/10" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                          <circle className="text-primary-fixed glow-lime transition-all duration-1000" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-dasharray="175.9" stroke-dashoffset="47.5" stroke-linecap="round" stroke-width="6"></circle>
                        </svg>
                        <span className="absolute font-label-sm text-[10px] text-primary font-bold">73%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-md mb-lg">
                      <div className="bg-white/5 rounded-lg p-sm border border-white/5">
                        <p className="font-label-sm text-[10px] text-on-surface-variant mb-xs">Active</p>
                        <p className="font-headline-lg-mobile text-xs font-bold text-primary">312 <span className="text-[10px] opacity-60">kcal</span></p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-sm border border-white/5">
                        <p className="font-label-sm text-[10px] text-on-surface-variant mb-xs">Resting</p>
                        <p className="font-headline-lg-mobile text-xs font-bold text-primary">200 <span className="text-[10px] opacity-60">kcal</span></p>
                      </div>
                    </div>

                    {/* Hourly burn graph visual */}
                    <div className="h-20 flex items-end justify-between gap-1 mb-md bg-background/30 p-1.5 rounded border border-white/5">
                      {hourlyBurnData.map((h, i) => (
                        <div 
                          key={i} 
                          style={{ height: `${h}%` }}
                          className={`w-full rounded-t-xs transition-all ${
                            h === 100 ? 'bg-primary-fixed glow-lime' : 'bg-primary-fixed/20'
                          }`}
                        ></div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-base flex justify-between items-center text-xs">
                      <p className="text-on-surface-variant font-semibold">Intake: {calorieIntake} kcal</p>
                      <p className="text-primary-fixed font-bold">Net: +{calorieIntake - 512} kcal</p>
                    </div>
                  </section>

                  {/* Hydration Segment bar section */}
                  <section className="glass-surface rounded-xl p-md">
                    <div className="flex items-center gap-base mb-md">
                      <span className="material-symbols-outlined text-secondary-fixed-dim text-lg">water_drop</span>
                      <p className="font-label-md text-xs text-secondary-fixed-dim uppercase tracking-wider font-bold">Hydration</p>
                    </div>

                    <div className="flex items-end justify-between mb-lg">
                      <div className="space-y-xs">
                        <div className="flex items-baseline gap-xs">
                          <span className="font-stat-value text-2xl font-bold text-primary">{(hydrationLogs.glassesLog * 0.25).toFixed(1)}</span>
                          <span className="font-label-md text-xs text-on-surface-variant">Liters</span>
                        </div>
                        <p className="font-body-md text-xs text-on-surface-variant">{hydrationLogs.glassesLog}/8 glasses completed</p>
                      </div>
                      <div className="bg-secondary-fixed-dim/20 px-sm py-0.5 rounded-full border border-secondary-fixed-dim/30">
                        <p className="text-[10px] text-secondary-fixed-dim">{8 - hydrationLogs.glassesLog} more glasses</p>
                      </div>
                    </div>

                    {/* Progress visual segments */}
                    <div className="flex gap-[3px] mb-lg h-3 bg-white/10 rounded-full overflow-hidden">
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const active = idx < hydrationLogs.glassesLog;
                        return (
                          <div 
                            key={idx} 
                            onClick={() => toggleWaterSegment(idx)}
                            className={`h-full cursor-pointer flex-1 ${
                              active ? 'bg-secondary-fixed-dim glow-cyan' : 'bg-white/5'
                            }`}
                          ></div>
                        );
                      })}
                    </div>

                    <div className="bg-surface-container-low rounded-lg p-sm border border-white/5 flex justify-between items-center text-[10px] text-on-surface-variant">
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-xs">history</span>
                        <span>Last: {hydrationLogs.lastLogTime}</span>
                      </div>
                      <div className="flex items-center gap-xs text-secondary-fixed-dim font-bold">
                        <span className="material-symbols-outlined text-xs">alarm</span>
                        <span>Next: {hydrationLogs.nextReminderTime}</span>
                      </div>
                    </div>
                  </section>

                  {/* Body Composition BMI Section */}
                  <section className="glass-surface rounded-xl p-md">
                    <div className="flex justify-between items-center mb-md">
                      <div className="flex items-center gap-base">
                        <span className="material-symbols-outlined text-tertiary-fixed-dim">monitor_weight</span>
                        <p className="font-label-md text-xs text-on-surface-variant uppercase font-bold">Body Composition</p>
                      </div>
                      <div className="flex items-center gap-xs text-error font-bold">
                        <span className="material-symbols-outlined text-xs">trending_down</span>
                        <span>0.3 pts</span>
                      </div>
                    </div>

                    <div className="text-center mb-lg">
                      <p className="font-stat-value text-4xl text-primary font-bold mb-xs">{calculatedBmi}</p>
                      <div className="inline-flex items-center gap-xs px-md py-0.5 bg-primary-fixed/10 border border-primary-fixed/20 rounded-full text-xs">
                        <span className="w-2 h-2 rounded-full bg-primary-fixed"></span>
                        <p className="font-label-sm text-primary-fixed font-bold">Status: {getBmiStatus(calculatedBmi)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-base mb-lg text-center">
                      <div>
                        <p className="text-[10px] text-on-surface-variant">Height</p>
                        <p className="text-sm font-bold text-primary">{userProfile.height}<span className="text-[10px] opacity-60">cm</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant">Weight</p>
                        <p className="text-sm font-bold text-primary">{userProfile.weight}<span className="text-[10px] opacity-60">kg</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant">Target</p>
                        <p className="text-sm font-bold text-secondary-fixed-dim">{userProfile.targetBmi}</p>
                      </div>
                    </div>

                    {/* Scale */}
                    <div className="relative pt-6 pb-2">
                      <div className="h-2 w-full rounded-full bg-gradient-to-r from-secondary-fixed-dim via-primary-fixed to-tertiary-fixed-dim"></div>
                      <div 
                        style={{ left: `${getBmiMarkerPercent(calculatedBmi)}%` }}
                        className="absolute top-0 flex flex-col items-center transition-all duration-500"
                      >
                        <div className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg"></div>
                        <div className="w-[2px] h-4 bg-primary/30"></div>
                      </div>
                      <div className="flex justify-between mt-xs text-[9px] text-on-surface-variant uppercase tracking-tighter font-semibold">
                        <span>Under</span>
                        <span>Normal</span>
                        <span>Over</span>
                        <span>Obese</span>
                      </div>
                    </div>

                    <div className="mt-md p-sm bg-white/5 rounded-lg border border-white/5 text-center text-[11px]">
                      <p className="text-on-surface">Healthy range: 18.5 - 24.9 BMI</p>
                      <p className="text-primary-fixed font-bold">You're doing great!</p>
                    </div>
                  </section>

                </div>
              )}

            </div>
          )}

          {/* VIEW: WORKOUTS HUB GENERAL VIEW FOR MOBILE */}
          {activeWorkoutSubView === null && currentTab === 'workouts' && (
            <div className="flex flex-col gap-lg animate-fade-in">
              <section className="glass-card rounded-xl p-md">
                <h3 className="font-headline-lg-mobile text-sm text-primary mb-md font-bold uppercase tracking-wider">Select discipline</h3>
                <div className="flex flex-col gap-sm">
                  
                  {/* Running Selection */}
                  <div 
                    onClick={() => setActiveWorkoutSubView('running')}
                    className="p-md bg-surface-container-high/40 border border-white/5 active:scale-95 transition-all rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-sm">
                      <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-fixed">
                        <span className="material-symbols-outlined text-2xl">directions_run</span>
                      </div>
                      <div>
                        <h4 className="text-xs text-primary font-bold">Running Performance</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{totalMiles.toFixed(1)} miles tracked this week</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-md">chevron_right</span>
                  </div>

                  {/* Strength Selection */}
                  <div 
                    onClick={() => { setActiveWorkoutSubView(null); setCurrentTab('home'); setDashboardMode('performance'); }}
                    className="p-md bg-surface-container-high/40 border border-white/5 active:scale-95 transition-all rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-sm">
                      <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-fixed">
                        <span className="material-symbols-outlined text-2xl">fitness_center</span>
                      </div>
                      <div>
                        <h4 className="text-xs text-primary font-bold">Strength Training</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{activeLog.sets} sets logged today ({activeLog.workout})</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-md">chevron_right</span>
                  </div>

                </div>
              </section>

              {/* Stopwatch timer */}
              <section className="glass-card rounded-xl p-md">
                <h3 className="font-headline-lg-mobile text-sm text-primary mb-md font-bold uppercase tracking-wider">Live stopwatch</h3>
                <div className="py-lg flex flex-col items-center justify-center bg-background/40 border border-white/5 rounded-lg">
                  {!workoutActive ? (
                    <button onClick={startWorkout} className="px-6 py-2 bg-primary-fixed text-on-primary-fixed font-bold text-xs rounded-full">
                      Start stopwatch
                    </button>
                  ) : (
                    <div className="flex flex-col items-center">
                      <h4 className="font-mono text-xl text-primary font-bold tracking-widest mb-md">{formatTimer(timerSeconds)}</h4>
                      <div className="flex gap-2">
                        <button onClick={pauseWorkout} className="bg-surface-variant text-xs text-primary-fixed px-3 py-1 rounded-full">{workoutPaused ? 'Resume' : 'Pause'}</button>
                        <button onClick={stopWorkout} className="bg-error/20 text-xs text-error px-3 py-1 rounded-full">Complete</button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* VIEW: ACTIVITY LIST FOR MOBILE */}
          {activeWorkoutSubView === null && currentTab === 'activity' && (
            <div className="flex flex-col gap-lg animate-fade-in">
              <section className="flex flex-col gap-md">
                <div className="flex bg-surface-container rounded-full p-1 border border-white/5">
                  <button className="flex-1 py-1.5 text-xs text-primary-fixed bg-surface-variant rounded-full font-semibold shadow">Day</button>
                  <button onClick={() => triggerToast('Weekly stats')} className="flex-1 py-1.5 text-xs text-on-surface-variant font-semibold">Week</button>
                  <button onClick={() => triggerToast('Monthly stats')} className="flex-1 py-1.5 text-xs text-on-surface-variant font-semibold">Month</button>
                </div>
                
                <div className="flex justify-between items-center bg-surface-container-low p-sm rounded-xl border border-white/5">
                  {weeklyLogs.map(log => {
                    const active = log.dayNum === selectedDayNum;
                    return (
                      <div 
                        key={log.dayNum} onClick={() => setSelectedDayNum(log.dayNum)}
                        className={`flex flex-col items-center gap-xs cursor-pointer transition-all ${
                          active ? 'bg-primary-container/20 border border-primary-container/30 rounded-lg px-3 py-1 scale-105' : 'px-2'
                        }`}
                      >
                        <span className={`font-label-sm text-[10px] ${active ? 'text-primary-fixed font-bold' : 'text-on-surface-variant'}`}>{log.dayName}</span>
                        <span className={`w-2 h-2 rounded-full ${log.steps >= 10000 ? 'bg-primary-container' : 'bg-surface-variant'}`}></span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* CARDIO SECTION */}
              <section className="glass-card rounded-xl p-md flex flex-col gap-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary-fixed">directions_run</span>
                    <h2 className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Cardio Performance</h2>
                  </div>
                  <button onClick={() => setActiveWorkoutSubView('running')} className="material-symbols-outlined text-on-surface-variant text-sm">open_in_new</button>
                </div>

                <div className="grid grid-cols-3 gap-md text-center">
                  <div className="flex flex-col items-center gap-sm">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-surface-variant" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeWidth="6"></circle>
                        <circle className="text-primary-fixed transition-all" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeDasharray="163" strokeDashoffset={163 - (163 * (stepsPercent / 100))} strokeLinecap="round" strokeWidth="6"></circle>
                      </svg>
                      <span className="absolute font-label-sm text-[10px] text-primary-fixed font-bold">{stepsPercent}%</span>
                    </div>
                    <div>
                      <p className="font-stat-value text-md leading-none font-bold text-primary">{activeLog.steps.toLocaleString()}</p>
                      <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold">steps</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-sm">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-surface-variant" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeWidth="6"></circle>
                        <circle className="text-secondary-fixed transition-all" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeDasharray="163" strokeDashoffset={163 - (163 * (Math.min(100, Math.round((activeLog.km / 8.0) * 100)) / 100))} strokeLinecap="round" strokeWidth="6"></circle>
                      </svg>
                      <span className="absolute font-label-sm text-[10px] text-secondary-fixed font-bold">{Math.min(100, Math.round((activeLog.km / 8.0) * 100))}%</span>
                    </div>
                    <div>
                      <p className="font-stat-value text-md leading-none font-bold text-primary">{activeLog.km}</p>
                      <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold">km</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-sm">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-surface-variant" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeWidth="6"></circle>
                        <circle className="text-primary-fixed transition-all" cx="32" cy="32" fill="transparent" r="26" stroke="currentColor" strokeDasharray="163" strokeDashoffset={163 - (163 * (activeMinPercent / 100))} strokeLinecap="round" strokeWidth="6"></circle>
                      </svg>
                      <span className="absolute font-label-sm text-[10px] text-primary-fixed font-bold">{activeMinPercent}%</span>
                    </div>
                    <div>
                      <p className="font-stat-value text-md leading-none font-bold text-primary">{activeLog.activeMin}</p>
                      <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold">min</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* STRENGTH SECTION */}
              <section className="glass-card rounded-xl p-md flex flex-col gap-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary-fixed">fitness_center</span>
                    <h2 className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Strength Training</h2>
                  </div>
                  <div className="bg-primary-container/10 px-2 py-1 rounded-lg">
                    <span className="font-label-sm text-[10px] text-primary-fixed font-semibold">
                      {activeLog.sets > 0 ? '3/5 Complete' : 'Rest Day'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-lg text-center">
                  <div className="flex flex-col gap-xs bg-surface-container-low/50 py-2 rounded-lg">
                    <p className="font-stat-value text-xl font-bold text-primary">{activeLog.sets}</p>
                    <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold">TOTAL SETS</p>
                  </div>
                  <div className="flex flex-col gap-xs bg-surface-container-low/50 py-2 rounded-lg">
                    <p className="font-stat-value text-xl font-bold text-primary">{activeLog.reps}</p>
                    <p className="font-label-sm text-[10px] text-on-surface-variant font-semibold">TOTAL REPS</p>
                  </div>
                </div>

                <div className="space-y-sm">
                  <div className="flex justify-between items-center text-[10px] uppercase text-on-surface-variant font-bold mb-1">
                    <span>Muscle Groups</span>
                    <span>Intensity</span>
                  </div>
                  <div className="space-y-xs">
                    {[
                      { name: 'Chest', val: activeLog.chest },
                      { name: 'Back', val: activeLog.back || 78 },
                      { name: 'Legs', val: activeLog.legs || 64 },
                      { name: 'Arms', val: activeLog.arms || 88 }
                    ].map(muscle => (
                      <div key={muscle.name} className="flex items-center gap-sm">
                        <span className="w-12 font-label-sm text-xs text-primary font-semibold">{muscle.name}</span>
                        <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-primary-fixed electric-lime-glow transition-all" style={{ width: `${muscle.val}%` }}></div>
                        </div>
                        <span className="text-[10px] text-on-surface-variant w-6 text-right font-mono">{muscle.val}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consistency Grid */}
                <div className="flex flex-col gap-sm">
                  <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Weekly Consistency</h3>
                  <div className="flex justify-between gap-1 text-center">
                    {weeklyLogs.map(item => {
                      const active = item.dayNum === selectedDayNum;
                      const hasSets = item.sets > 0;
                      return (
                        <div key={item.dayNum} onClick={() => setSelectedDayNum(item.dayNum)} className={`flex-1 aspect-square rounded-sm flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all ${
                          active ? 'bg-primary-container text-on-primary-container border border-primary-fixed shadow' : hasSets ? 'bg-primary-container/60 text-on-primary-container' : 'bg-surface-variant text-on-surface-variant/75'
                        }`}>
                          {item.dayName[0]}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* RECOVERY SECTION */}
              <section className="glass-card rounded-xl p-md flex flex-col gap-md relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-secondary-fixed/5 blur-[40px] rounded-full"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary-fixed">bedtime</span>
                    <h2 className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant font-bold">Body Recovery</h2>
                  </div>
                </div>

                <div className="flex items-center gap-lg">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle className="text-surface-variant" cx="40" cy="40" fill="transparent" r="32" stroke="currentColor" strokeWidth="8"></circle>
                      <circle className="text-secondary-fixed neo-cyan-glow transition-all" cx="40" cy="40" fill="transparent" r="32" stroke="currentColor" strokeDasharray="201" strokeDashoffset={201 - (201 * (activeLog.recovery / 100))} strokeLinecap="round" strokeWidth="8"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-stat-value text-md font-bold text-primary">{activeLog.recovery}%</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-headline-lg-mobile text-sm font-bold text-secondary-fixed mb-0.5">Good zone</h3>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">Weekly rest levels are optimized. Focus on hydration to enhance it.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-sm mt-2 text-center">
                  <div className="bg-surface-container-high/40 p-sm rounded-lg border border-white/5">
                    <span className="material-symbols-outlined text-secondary-fixed text-sm mb-0.5">sleep</span>
                    <p className="font-stat-value text-md font-bold text-primary">{activeLog.sleep}h</p>
                    <p className="font-label-sm text-[9px] text-on-surface-variant uppercase font-semibold">Sleep</p>
                  </div>
                  <div className="bg-surface-container-high/40 p-sm rounded-lg border border-white/5">
                    <span className="material-symbols-outlined text-secondary-fixed text-sm mb-0.5">favorite</span>
                    <p className="font-stat-value text-md font-bold text-primary">{liveHeartRate}</p>
                    <p className="font-label-sm text-[9px] text-on-surface-variant uppercase font-semibold">BPM</p>
                  </div>
                  <div className="bg-surface-container-high/40 p-sm rounded-lg border border-white/5 cursor-pointer" onClick={() => addHydration(0.25)}>
                    <span className="material-symbols-outlined text-secondary-fixed text-sm mb-0.5">water_drop</span>
                    <p className="font-stat-value text-md font-bold text-primary">{getWaterDisplayValue(activeLog.water)}</p>
                    <p className="font-label-sm text-[9px] text-on-surface-variant uppercase font-semibold">Water</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* VIEW: COMMUNITY FOR MOBILE */}
          {activeWorkoutSubView === null && currentTab === 'community' && (
            <div className="flex flex-col gap-lg animate-fade-in">
              <div className="glass-card p-md rounded-xl">
                <h3 className="font-headline-lg-mobile text-sm text-primary mb-md font-bold uppercase tracking-wider">Social Standings</h3>
                <div className="flex flex-col gap-sm">
                  {[
                    { rank: 1, name: 'Sarah Miller', score: '14,232 steps', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtXGk-Zp7Hxto9p5Q1z3m6j9L5bVw6c7F6E_V4N3u8tWq0' },
                    { rank: 2, name: `${userProfile.name} (You)`, score: `${activeLog.steps.toLocaleString()} steps`, active: true, avatar: userProfile.avatar },
                    { rank: 3, name: 'John Doe', score: '9,432 steps', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuEtWq0z7Hxto9p5Q1z3m6j9L5bVw6c7F6E_V4N3u8' }
                  ].map((friend, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-sm rounded-lg border transition-all ${
                      friend.active ? 'bg-primary-container/10 border-primary-fixed/20 shadow-md' : 'bg-surface-container-high/40 border-white/5'
                    }`}>
                      <div className="flex items-center gap-sm">
                        <span className="w-4 font-bold text-xs text-on-surface-variant">{friend.rank}</span>
                        <img src={friend.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                        <div>
                          <div className="font-label-md text-xs text-primary font-bold">{friend.name}</div>
                          <div className="text-[10px] text-on-surface-variant">{friend.score}</div>
                        </div>
                      </div>
                      <button onClick={() => triggerToast('Buddy cheered!')} className="text-[10px] bg-surface-variant border border-white/10 text-on-surface-variant hover:text-white px-2.5 py-0.5 rounded-full">Cheer</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS FOR MOBILE */}
          {activeWorkoutSubView === null && currentTab === 'settings' && (
            <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md shadow-md animate-fade-in flex flex-col gap-md">
              <h3 className="font-headline-lg-mobile text-sm text-primary font-bold uppercase tracking-wider mb-sm">Preferences Config</h3>
              
              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-xs">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase">Display Name</label>
                  <input 
                    type="text" value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase">Level</label>
                  <input 
                    type="number" value={userProfile.level}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              {/* Weight / Height composition */}
              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-xs">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase">Height (cm)</label>
                  <input 
                    type="number" value={userProfile.height}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase">Weight (kg)</label>
                  <input 
                    type="number" step="0.1" value={userProfile.weight}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase">Profile Picture URL</label>
                <input 
                  type="text" value={userProfile.avatar}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, avatar: e.target.value }))}
                  className="bg-background border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-on-surface-variant focus:outline-none focus:border-primary-fixed"
                />
              </div>

              {/* Sliders for steps goals */}
              <div className="border-t border-white/5 pt-sm mt-xs space-y-sm">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Daily Steps Target</span>
                  <span className="text-primary-fixed font-bold">{userProfile.goals.steps.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="5000" max="15000" step="500" value={userProfile.goals.steps}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, goals: { ...prev.goals, steps: parseInt(e.target.value) } }))}
                  className="w-full accent-primary-fixed h-1 bg-surface-variant cursor-pointer"
                />
              </div>
            </div>
          )}

        </main>

        {/* Global Floating Action Button for Mobile activity list */}
        <button 
          onClick={() => {
            if (activeWorkoutSubView === 'running') {
              setShowLogRunModal(true);
            } else if (currentTab === 'home' && dashboardMode === 'wellness') {
              // Open custom water/intake logger
              const val = prompt("Enter food calories logged (kcal):");
              const intakeVal = parseInt(val) || 0;
              if (intakeVal > 0) {
                setCalorieIntake(prev => prev + intakeVal);
                triggerToast(`🥗 Intake updated +${intakeVal} kcal`);
              }
            } else {
              setShowLogWorkoutModal(true);
            }
          }}
          className="fixed bottom-24 right-gutter w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40 accent-glow-lime"
          aria-label="Add workout log"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>

        {/* Mobile BottomNavBar */}
        <nav className="fixed bottom-0 left-0 w-full rounded-t-xl z-45 bg-surface/60 backdrop-blur-xl border-t border-white/5 shadow-[0_-4px_20px_rgba(171,214,0,0.1)] flex justify-around items-center h-20 pb-safe px-base">
          {/* Home */}
          <button 
            onClick={() => { setCurrentTab('home'); setActiveWorkoutSubView(null); }}
            className={`flex flex-col items-center gap-xs transition-all px-4 py-1 ${
              currentTab === 'home' 
                ? 'text-primary bg-primary/10 rounded-xl font-bold' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: `FILL ${currentTab === 'home' ? 1 : 0}` }}>
              dashboard
            </span>
            <span className="font-label-sm text-[10px]">Home</span>
          </button>

          {/* Activity */}
          <button 
            onClick={() => { setCurrentTab('activity'); setActiveWorkoutSubView(null); }}
            className={`flex flex-col items-center gap-xs transition-all px-4 py-1 ${
              currentTab === 'activity' 
                ? 'text-primary bg-primary/10 rounded-xl font-bold' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: `FILL ${currentTab === 'activity' ? 1 : 0}` }}>
              fitness_center
            </span>
            <span className="font-label-sm text-[10px]">Activity</span>
          </button>

          {/* Community */}
          <button 
            onClick={() => { setCurrentTab('community'); setActiveWorkoutSubView(null); }}
            className={`flex flex-col items-center gap-xs transition-all px-4 py-1 ${
              currentTab === 'community' 
                ? 'text-primary bg-primary/10 rounded-xl font-bold' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: `FILL ${currentTab === 'community' ? 1 : 0}` }}>
              group
            </span>
            <span className="font-label-sm text-[10px]">Community</span>
          </button>

          {/* Settings */}
          <button 
            onClick={() => { setCurrentTab('settings'); setActiveWorkoutSubView(null); }}
            className={`flex flex-col items-center gap-xs transition-all px-4 py-1 ${
              currentTab === 'settings' 
                ? 'text-primary bg-primary/10 rounded-xl font-bold' 
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: `FILL ${currentTab === 'settings' ? 1 : 0}` }}>
              settings
            </span>
            <span className="font-label-sm text-[10px]">Settings</span>
          </button>
        </nav>

      </div>

    </div>
  );
}

export default App;
