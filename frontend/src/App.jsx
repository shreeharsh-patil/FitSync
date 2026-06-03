import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WatchSimulator from './components/WatchSimulator';
import AICoachChat from './components/AICoachChat';
import AIMealScanner from './components/AIMealScanner';
import WorkoutBuilder from './components/WorkoutBuilder';
import NutritionHub from './components/NutritionHub';
import CommunityFeed from './components/CommunityFeed';
import AIWorkoutGenerator from './components/AIWorkoutGenerator';
import WeightTracker from './components/WeightTracker';
import AchievementsPanel from './components/AchievementsPanel';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // --- Navigation & Core Views ---
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'login' | 'register' | 'app'
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'activity' | 'workouts' | 'community' | 'settings'
  const [activeWorkoutSubView, setActiveWorkoutSubView] = useState(null); // null | 'running'

  const fetchUserData = async (userId) => {
    try {
      const [logsRes, routinesRes, mealsRes, postsRes] = await Promise.all([
        fetch(`/api/logs/${userId}`),
        fetch(`/api/routines/${userId}`),
        fetch(`/api/meals/${userId}`),
        fetch(`/api/posts`)
      ]);

      if (logsRes.ok) {
        const logs = await logsRes.json();
        if (logs && logs.length > 0) setWeeklyLogs(logs);
      }
      if (routinesRes.ok) {
        const routines = await routinesRes.json();
        if (routines) setRoutinesList(routines);
      }
      if (mealsRes.ok) {
        const meals = await mealsRes.json();
        if (meals) setLoggedMeals(meals);
      }
      if (postsRes.ok) {
        const posts = await postsRes.json();
        if (posts) setSocialPosts(posts);
      }
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setUserProfile(parsed);
      fetchUserData(parsed.id);
      setCurrentView('app');
    }
  }, []);
  
  // Dashboard Section Mode selector: switch between Performance details and Wellness status
  const [dashboardMode, setDashboardMode] = useState('wellness'); // 'performance' | 'wellness'
  
  // AI Tools & Scanners
  const [showMealScanner, setShowMealScanner] = useState(false);
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  const [showAIWorkoutGenerator, setShowAIWorkoutGenerator] = useState(false);
  const [showWeightTrackerModal, setShowWeightTrackerModal] = useState(false);
  const [hasChattedWithAI, setHasChattedWithAI] = useState(false);
  const [socialPosts, setSocialPosts] = useState([]);
  const [routinesList, setRoutinesList] = useState([
    { name: 'Bench Press', routine: 'Chest & Triceps', repinfo: '4 Sets x 8 Reps' },
    { name: 'Incline Dumbbell Flys', routine: 'Chest Focus', repinfo: '3 Sets x 12 Reps' },
    { name: 'Dips (Weighted)', routine: 'Triceps & Lower Chest', repinfo: '3 Sets x 8 Reps' }
  ]);
  const [loggedMeals, setLoggedMeals] = useState([
    {
      id: 1,
      name: "Avocado Toast with Egg",
      calories: 380,
      protein: 16,
      carbs: 42,
      fats: 18,
      type: "Breakfast",
      time: "08:15 AM",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-"
    },
    {
      id: 2,
      name: "Grilled Chicken Salad",
      calories: 520,
      protein: 42,
      carbs: 22,
      fats: 28,
      type: "Lunch",
      time: "01:30 PM",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-"
    }
  ]);
  
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

  const handleShareToFeed = async (content) => {
    const postPayload = {
      userId: currentUser?.id || "mock-user",
      author: userProfile.name,
      avatar: userProfile.avatar,
      tag: "Milestone",
      content: content,
      image: ""
    };

    try {
      if (currentUser) {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postPayload)
        });
        if (res.ok) {
          const saved = await res.json();
          const mapPostData = (post, currentUserId) => {
            const isReacted = (type) => {
              if (!post.reactedUsers || !post.reactedUsers[type]) return false;
              return currentUserId ? post.reactedUsers[type].includes(currentUserId) : false;
            };
            return {
              ...post,
              id: post._id || post.id,
              time: post.createdAt ? new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : (post.time || "Just now"),
              userReacted: {
                fire: isReacted("fire"),
                strong: isReacted("strong"),
                clap: isReacted("clap")
              },
              showComments: post.showComments || false
            };
          };
          setSocialPosts(prev => [mapPostData(saved, currentUser.id), ...prev]);
        }
      } else {
        const newPost = {
          ...postPayload,
          id: Date.now(),
          time: "Just now",
          reactions: { fire: 0, strong: 0, clap: 0 },
          userReacted: { fire: false, strong: false, clap: false },
          comments: [],
          showComments: false
        };
        setSocialPosts(prev => [newPost, ...prev]);
      }
      triggerToast("✨ Share published to FitSync Feed!");
    } catch (err) {
      console.error("Failed to share achievement:", err);
    }
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

  const [calorieIntake, setCalorieIntake] = useState(900);
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

  const handleSaveRun = async (e) => {
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

    const logToModify = weeklyLogs.find(log => log.dayNum === parseInt(runForm.dayNum));
    if (logToModify) {
      const targetRunMiles = logToModify.runMiles + parseFloat(runForm.distance);
      const targetSteps = logToModify.steps + Math.round(parseFloat(runForm.distance) * 2000);

      setWeeklyLogs(prev => prev.map(log => {
        if (log.dayNum === parseInt(runForm.dayNum)) {
          return {
            ...log,
            runMiles: targetRunMiles,
            steps: targetSteps
          };
        }
        return log;
      }));

      if (currentUser) {
        try {
          await fetch(`/api/logs/${currentUser.id}/${runForm.dayNum}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              runMiles: targetRunMiles,
              steps: targetSteps
            })
          });
        } catch (err) {
          console.error("Failed to sync logged run to backend:", err);
        }
      }
    }

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
  const [watchConnected, setWatchConnected] = useState(true);

  useEffect(() => {
    setLiveHeartRate(activeLog.bpm);
  }, [selectedDayNum]);

  useEffect(() => {
    if (watchConnected) return;

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
  }, [workoutActive, workoutPaused, selectedDayNum, watchConnected]);

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

  // Stopwatch Helper Functions
  const startWorkout = () => {
    setWorkoutActive(true);
    setWorkoutPaused(false);
    setTimerSeconds(0);
    triggerToast("⏱️ Workout session started!");
  };

  const pauseWorkout = () => {
    setWorkoutPaused(prev => !prev);
    triggerToast(!workoutPaused ? "⏱️ Timer paused" : "⏱️ Timer resumed");
  };

  const stopWorkout = () => {
    const elapsedMins = Math.round(timerSeconds / 60) || 1;
    updateActiveLog(log => ({
      ...log,
      activeMin: log.activeMin + elapsedMins,
      calories: log.calories + (elapsedMins * 6)
    }));
    setWorkoutActive(false);
    setWorkoutPaused(false);
    setTimerSeconds(0);
    triggerToast(`🏋️‍♂️ Workout completed! Logged ${elapsedMins} mins.`);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    
    const addedReps = workoutForm.sets * workoutForm.reps;
    const addedMinutes = workoutForm.sets * 3;
    const addedCalories = workoutForm.sets * 25;

    const targetSets = activeLog.sets + parseInt(workoutForm.sets);
    const targetReps = activeLog.reps + addedReps;
    const targetActiveMin = activeLog.activeMin + addedMinutes;
    const targetCalories = activeLog.calories + addedCalories;

    let targetMuscleObj = {};
    const muscleKey = workoutForm.muscleGroup.toLowerCase();
    if (['chest', 'triceps', 'shoulders', 'legs', 'back', 'arms'].includes(muscleKey)) {
      const currentVal = activeLog[muscleKey] || 0;
      targetMuscleObj[muscleKey] = Math.min(100, currentVal + 10);
    }

    updateActiveLog(log => ({
      ...log,
      sets: targetSets,
      reps: targetReps,
      activeMin: targetActiveMin,
      calories: targetCalories,
      ...targetMuscleObj
    }));

    if (currentUser) {
      try {
        await fetch(`/api/logs/${currentUser.id}/${selectedDayNum}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sets: targetSets,
            reps: targetReps,
            activeMin: targetActiveMin,
            calories: targetCalories,
            ...targetMuscleObj
          })
        });
      } catch (err) {
        console.error("Failed to sync logged sets to backend:", err);
      }
    }

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
  const addSteps = async (amount) => {
    const newSteps = Math.max(0, activeLog.steps + amount);
    const calBurned = Math.round(amount * 0.04);
    const newCalories = Math.max(0, activeLog.calories + calBurned);
    const distKm = parseFloat((amount * 0.0008).toFixed(2));
    const newKm = parseFloat(Math.max(0, activeLog.km + distKm).toFixed(1));

    updateActiveLog(log => ({
      ...log,
      steps: newSteps,
      calories: newCalories,
      km: newKm
    }));

    if (currentUser) {
      try {
        await fetch(`/api/logs/${currentUser.id}/${selectedDayNum}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ steps: newSteps, calories: newCalories, km: newKm })
        });
      } catch (err) {
        console.error(err);
      }
    }
    triggerToast(`🚶‍♂️ Steps updated: ${amount > 0 ? '+' : ''}${amount.toLocaleString()}`);
  };

  const addHydration = async (amount) => {
    let currentVal = activeLog.water;
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

    updateActiveLog(log => ({ ...log, water: formattedVal }));

    if (currentUser) {
      try {
        await fetch(`/api/logs/${currentUser.id}/${selectedDayNum}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ water: formattedVal })
        });
      } catch (err) {
        console.error(err);
      }
    }
    triggerToast(`💧 Water intake updated!`);
  };

  const handleLogMeal = async (meal) => {
    const mealPayload = {
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      type: meal.type || "Snack",
      time: meal.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      img: meal.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-'
    };

    if (currentUser) {
      try {
        const res = await fetch(`/api/meals/${currentUser.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mealPayload)
        });
        if (res.ok) {
          const saved = await res.json();
          setLoggedMeals(prev => [saved, ...prev]);
        }
      } catch (err) {
        console.error("Failed to log meal:", err);
      }
    } else {
      const offlineMeal = {
        id: Date.now(),
        ...mealPayload
      };
      setLoggedMeals(prev => [offlineMeal, ...prev]);
    }
    setCalorieIntake(prev => prev + mealPayload.calories);
  };

  const handleSaveRoutine = async (routineName, exercisesList, category = 'Custom Routine') => {
    const mappedExercises = exercisesList.map(e => {
      let repsStr = "";
      if (typeof e.reps === 'string') {
        repsStr = e.reps;
      } else if (e.sets !== undefined && e.reps !== undefined) {
        repsStr = `${e.sets} Sets x ${e.reps} Reps`;
      } else {
        repsStr = "3 Sets x 10 Reps";
      }

      let noteStr = "";
      if (typeof e.note === 'string') {
        noteStr = e.note;
      } else if (e.weight !== undefined) {
        noteStr = `${e.weight} kg`;
      }

      return {
        name: e.name,
        reps: repsStr,
        note: noteStr
      };
    });

    const routinePayload = {
      name: routineName,
      routine: category,
      repinfo: `${exercisesList.length} Exercises`,
      exercises: mappedExercises
    };

    if (currentUser) {
      try {
        const res = await fetch(`/api/routines/${currentUser.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routinePayload)
        });
        if (res.ok) {
          const saved = await res.json();
          setRoutinesList(prev => [saved, ...prev]);
        }
      } catch (err) {
        console.error("Failed to save routine:", err);
      }
    } else {
      const offlineRoutine = {
        id: Date.now(),
        ...routinePayload
      };
      setRoutinesList(prev => [offlineRoutine, ...prev]);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      triggerToast("⚠️ Image size should be less than 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserProfile(prev => ({ ...prev, avatar: reader.result }));
      triggerToast("📸 Image uploaded locally. Click save below to persist.");
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    if (currentUser) {
      try {
        const res = await fetch(`/api/profile/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userProfile.name,
            level: userProfile.level,
            height: userProfile.height,
            weight: userProfile.weight,
            targetBmi: userProfile.targetBmi,
            fitnessGoal: userProfile.fitnessGoal,
            avatar: userProfile.avatar,
            goals: userProfile.goals
          })
        });
        if (res.ok) {
          const updated = await res.json();
          const newUserData = { ...currentUser, ...updated };
          setCurrentUser(newUserData);
          setUserProfile(newUserData);
          localStorage.setItem('currentUser', JSON.stringify(newUserData));
          triggerToast('✨ Profile settings saved to database!');
        } else {
          triggerToast('❌ Failed to save profile settings.');
        }
      } catch (err) {
        console.error("Failed to save profile:", err);
        triggerToast('❌ Failed to save profile settings.');
      }
    } else {
      triggerToast('✨ Profile preferences updated locally.');
    }
  };


  const stepsPercent = Math.min(100, Math.round((activeLog.steps / userProfile.goals.steps) * 100));
  const activeMinPercent = Math.min(100, Math.round((activeLog.activeMin / userProfile.goals.activeMin) * 100));
  
  const getWaterDisplayValue = (waterVal) => {
    if (typeof waterVal === 'string') return waterVal;
    return `${waterVal}/8`;
  };

  // Helper to click-toggle water segment glasses in status view
  const toggleWaterSegment = async (index) => {
    const targetCount = index + 1;
    const lastLogged = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    
    setHydrationLogs(prev => ({
      ...prev,
      glassesLog: targetCount,
      lastLogTime: lastLogged
    }));

    updateActiveLog(log => ({ ...log, water: targetCount }));

    if (currentUser) {
      try {
        await fetch(`/api/logs/${currentUser.id}/${selectedDayNum}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ water: targetCount })
        });
      } catch (err) {
        console.error(err);
      }
    }
    triggerToast(`💧 Hydration updated to ${targetCount}/8 glasses`);
  };

  if (currentView === 'landing') {
    return <LandingPage onViewChange={setCurrentView} />;
  }
  if (currentView === 'login') {
    return (
      <LoginPage 
        onViewChange={setCurrentView} 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setUserProfile(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          fetchUserData(user.id);
          setCurrentView('app');
          triggerToast(`👋 Welcome back, ${user.name}!`);
        }} 
      />
    );
  }
  if (currentView === 'register') {
    return (
      <RegisterPage 
        onViewChange={setCurrentView} 
        onRegisterSuccess={(user) => {
          setCurrentUser(user);
          setUserProfile(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          fetchUserData(user.id);
          setCurrentView('app');
          triggerToast(`✨ Welcome to FitSync, ${user.name}!`);
        }} 
      />
    );
  }

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
      {/* PERSISTENT SIDEBAR DRAWER (Desktop viewport >= 1024px) */}
      {/* ============================================================== */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-white/5 shadow-2xl hidden lg:flex flex-col p-lg gap-sm z-40">
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

          {/* Detailed Analytics */}
          <button 
            onClick={() => { setCurrentTab('activity'); setActiveWorkoutSubView(null); }}
            className={`w-full flex items-center gap-md px-4 py-3 rounded-lg transition-all hover:translate-x-1 ${
              currentTab === 'activity' 
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <span className="material-symbols-outlined">insights</span>
            <span className="font-body-md text-sm">Analytics</span>
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

          {/* Nutrition Hub */}
          <button 
            onClick={() => { setCurrentTab('nutrition'); setActiveWorkoutSubView(null); }}
            className={`w-full flex items-center gap-md px-4 py-3 rounded-lg transition-all hover:translate-x-1 ${
              currentTab === 'nutrition' 
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <span className="material-symbols-outlined">restaurant</span>
            <span className="font-body-md text-sm">Nutrition Hub</span>
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

      {/* ============================================================== */}
      {/* MOBILE/TABLET BOTTOM NAVIGATION BAR (Viewport < 1024px) */}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 w-full rounded-t-xl z-40 bg-surface/90 backdrop-blur-xl border-t border-white/5 shadow-[0_-4px_20px_rgba(171,214,0,0.15)] flex justify-around items-center h-20 pb-safe px-base lg:hidden">
        {/* Home */}
        <button 
          onClick={() => { setCurrentTab('home'); setActiveWorkoutSubView(null); }}
          className={`flex flex-col items-center gap-xs transition-all px-4 py-1.5 ${
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

        {/* Workouts */}
        <button 
          onClick={() => { setCurrentTab('workouts'); }}
          className={`flex flex-col items-center gap-xs transition-all px-4 py-1.5 ${
            currentTab === 'workouts' 
              ? 'text-primary bg-primary/10 rounded-xl font-bold' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: `FILL ${currentTab === 'workouts' ? 1 : 0}` }}>
            fitness_center
          </span>
          <span className="font-label-sm text-[10px]">Workouts</span>
        </button>

        {/* Nutrition */}
        <button 
          onClick={() => { setCurrentTab('nutrition'); setActiveWorkoutSubView(null); }}
          className={`flex flex-col items-center gap-xs transition-all px-4 py-1.5 ${
            currentTab === 'nutrition' 
              ? 'text-primary bg-primary/10 rounded-xl font-bold' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: `FILL ${currentTab === 'nutrition' ? 1 : 0}` }}>
            restaurant
          </span>
          <span className="font-label-sm text-[10px]">Nutrition</span>
        </button>

        {/* Activity/Analytics */}
        <button 
          onClick={() => { setCurrentTab('activity'); setActiveWorkoutSubView(null); }}
          className={`flex flex-col items-center gap-xs transition-all px-4 py-1.5 ${
            currentTab === 'activity' 
              ? 'text-primary bg-primary/10 rounded-xl font-bold' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: `FILL ${currentTab === 'activity' ? 1 : 0}` }}>
            insights
          </span>
          <span className="font-label-sm text-[10px]">Analytics</span>
        </button>

        {/* Community */}
        <button 
          onClick={() => { setCurrentTab('community'); setActiveWorkoutSubView(null); }}
          className={`flex flex-col items-center gap-xs transition-all px-4 py-1.5 ${
            currentTab === 'community' 
              ? 'text-primary bg-primary/10 rounded-xl font-bold' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: `FILL ${currentTab === 'community' ? 1 : 0}` }}>
            group
          </span>
          <span className="font-label-sm text-[10px]">Social</span>
        </button>

        {/* Settings */}
        <button 
          onClick={() => { setCurrentTab('settings'); setActiveWorkoutSubView(null); }}
          className={`flex flex-col items-center gap-xs transition-all px-4 py-1.5 ${
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

      {/* ============================================================== */}
      {/* MAIN CANVAS BODY CONTAINER */}
      {/* ============================================================== */}
      <main className="flex-grow lg:ml-64 min-h-screen px-4 py-6 md:p-6 lg:p-10 pt-24 lg:pt-10 pb-32 lg:pb-10 max-w-7xl mx-auto flex flex-col gap-lg">
        
        {/* --- Unified Header Block --- */}
        <header className="fixed top-0 left-0 w-full h-16 bg-surface/90 backdrop-blur-md z-30 flex items-center justify-between px-md border-b border-white/5 shadow-sm lg:relative lg:top-auto lg:left-auto lg:w-auto lg:h-auto lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:shadow-none lg:p-0 lg:mb-sm">
          <div className="flex items-center gap-sm">
            {activeWorkoutSubView && (
              <button 
                onClick={() => setActiveWorkoutSubView(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-primary hover:bg-white/10 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-md">arrow_back</span>
              </button>
            )}
            {!activeWorkoutSubView && (
              <div 
                onClick={() => { setCurrentTab('settings'); setActiveWorkoutSubView(null); }}
                className="w-8 h-8 rounded-full overflow-hidden bg-surface-variant ring-1 ring-white/20 lg:hidden cursor-pointer shrink-0"
              >
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h2 className="font-display-sm text-lg md:text-xl lg:text-2xl text-primary font-bold">
                {activeWorkoutSubView === 'running' ? 'Running Analytics' : (
                  <>
                    {currentTab === 'home' && (dashboardMode === 'performance' ? 'Coaching Hub' : 'Wellness Composition')}
                    {currentTab === 'activity' && 'Analytics & Metrics'}
                    {currentTab === 'workouts' && 'Workouts Hub'}
                    {currentTab === 'nutrition' && 'Nutrition & Hydration'}
                    {currentTab === 'community' && 'Social Feed'}
                    {currentTab === 'settings' && 'User Preferences'}
                  </>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-xs md:gap-md">
            {/* Home Dashboard Mode Switcher */}
            {currentTab === 'home' && !activeWorkoutSubView && (
              <div className="flex bg-surface-container p-0.5 rounded-xl border border-white/5">
                <button 
                  onClick={() => setDashboardMode('performance')}
                  className={`px-2.5 py-1 font-label-md text-[10px] md:text-xs rounded-lg transition-all ${
                    dashboardMode === 'performance' 
                      ? 'bg-surface-variant text-primary-fixed font-bold shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Performance
                </button>
                <button 
                  onClick={() => setDashboardMode('wellness')}
                  className={`px-2.5 py-1 font-label-md text-[10px] md:text-xs rounded-lg transition-all ${
                    dashboardMode === 'wellness' 
                      ? 'bg-surface-variant text-primary-fixed font-bold shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Wellness
                </button>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotificationDrawer(!showNotificationDrawer);
                  if (!showNotificationDrawer) {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  }
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-variant/30 hover:bg-white/5 transition-all border border-white/5 active:scale-95"
              >
                <span className="material-symbols-outlined text-primary-fixed text-lg">notifications</span>
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error animate-pulse"></span>
                )}
              </button>

              {showNotificationDrawer && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-container-high/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 py-2 animate-fade-in">
                  <div className="px-4 py-1.5 border-b border-white/5 flex justify-between items-center">
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">Alerts Log</span>
                    <button className="text-[10px] text-secondary-fixed hover:underline" onClick={() => setNotifications([])}>Clear</button>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-on-surface-variant">No alerts registered.</div>
                    ) : (
                      notifications.map(item => (
                        <div key={item.id} className="px-4 py-2 border-b border-white/5 text-left">
                          <p className="text-[9px] text-on-surface-variant text-right mb-0.5">{item.time}</p>
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

        {/* ============================================================== */}
        {/* VIEW: HOME DASHBOARD */}
        {/* ============================================================== */}
        {currentTab === 'home' && (
          <div className="flex flex-col gap-lg animate-fade-in">
            {/* Interactive Coaching Chat Component */}
            {dashboardMode === 'performance' && (
              <AICoachChat 
                userProfile={userProfile} 
                activeLog={activeLog} 
                onChatted={() => setHasChattedWithAI(true)} 
              />
            )}

            {/* PERFORMANCE MODE: Quick Summary Dashboard */}
            {dashboardMode === 'performance' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md lg:gap-lg">
                
                {/* Steps Tracker Card */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-sm">
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-primary-fixed text-sm">directions_walk</span>
                        <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">Steps Progress</h3>
                      </div>
                      <span className="text-[10px] text-primary-fixed font-bold">{stepsPercent}%</span>
                    </div>

                    <div className="flex items-center justify-between gap-md my-sm">
                      <div>
                        <div className="font-stat-value text-2xl font-bold text-primary">{activeLog.steps.toLocaleString()}</div>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">Goal: {userProfile.goals.steps.toLocaleString()}</p>
                      </div>
                      
                      <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                          <circle cx="18" cy="18" r="16" fill="none" stroke="#c3f400" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - stepsPercent} strokeLinecap="round" />
                        </svg>
                        <span className="material-symbols-outlined text-primary-fixed text-md">flag</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workout Stopwatch Card */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div>
                    <div className="flex items-center gap-xs mb-xs">
                      <span className="material-symbols-outlined text-primary-fixed text-sm">timer</span>
                      <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">Workout Timer</h3>
                    </div>

                    <div className="py-sm my-xs text-center">
                      {workoutActive ? (
                        <div className="flex flex-col items-center">
                          <span className="font-mono text-2xl text-primary font-bold tracking-widest">{formatTimer(timerSeconds)}</span>
                          <span className="text-[9px] text-error font-bold flex items-center gap-0.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> Live Recording
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-on-surface-variant py-2">Stopwatch ready to track active session.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-white/5 pt-sm mt-xs">
                    {!workoutActive ? (
                      <button onClick={startWorkout} className="w-full py-1 text-[10px] bg-primary-fixed text-on-primary-fixed font-bold rounded-lg flex items-center justify-center gap-0.5 active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-xs">play_arrow</span> Start Workout
                      </button>
                    ) : (
                      <>
                        <button onClick={pauseWorkout} className="flex-grow py-1 text-[10px] bg-white/5 text-primary-fixed border border-white/10 font-semibold rounded-lg active:scale-95 transition-transform">
                          {workoutPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button onClick={stopWorkout} className="py-1 px-3 text-[10px] bg-error/20 text-error border border-error/30 font-bold rounded-lg active:scale-95 transition-transform">
                          End
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Heart Rate Sensor Card */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div>
                    <div className="flex items-center gap-xs mb-sm">
                      <span className="material-symbols-outlined text-error text-sm animate-pulse">favorite</span>
                      <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">Live Heart Rate</h3>
                    </div>

                    <div className="flex items-center justify-between gap-md my-sm">
                      <div>
                        <div className="font-stat-value text-2xl font-bold text-primary leading-none">{liveHeartRate}</div>
                        <p className="text-[10px] text-on-surface-variant mt-1.5">beats per minute</p>
                      </div>
                      
                      {/* Premium Scrolling ECG svg */}
                      <svg className="w-16 h-8 text-error/40 shrink-0" viewBox="0 0 100 30" fill="none">
                        <path 
                          className="animate-ecg"
                          d="M0,15 L20,15 L25,5 L30,25 L35,0 L40,30 L45,10 L50,15 L100,15" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="text-[9px] text-on-surface-variant border-t border-white/5 pt-sm mt-xs flex justify-between items-center">
                    <span>Active Fluctuation: On</span>
                    <span className="text-secondary-fixed">Live Sensor Sim</span>
                  </div>
                </div>

                {/* Hydration Tracker Quick Card */}
                <div className="bg-surface-container/60 backdrop-blur-xl rounded-xl border border-white/10 p-md flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div>
                    <div className="flex items-center gap-xs mb-sm">
                      <span className="material-symbols-outlined text-cyan-400 text-sm">water_drop</span>
                      <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">Hydration Tracker</h3>
                    </div>

                    <div className="flex items-center justify-between gap-md my-sm">
                      <div>
                        <div className="font-stat-value text-2xl font-bold text-primary leading-none">
                          {getWaterDisplayValue(activeLog.water)}
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-1.5">glasses logged today</p>
                      </div>
                      
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0 animate-bounce">
                        <span className="material-symbols-outlined text-lg">local_drink</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => addHydration(1)}
                    className="w-full py-1 text-[10px] bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-bold border border-cyan-400/30 rounded-lg active:scale-95 transition-transform"
                  >
                    + Log 1 Glass (250ml)
                  </button>
                </div>

              </div>
            )}

            {/* WELLNESS STATUS MODE: Advanced Diagnostics Panel */}
            {dashboardMode === 'wellness' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md lg:gap-lg">
                
                {/* Energy Burned Section */}
                <section className="glass-surface rounded-xl p-md flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-md">
                    <div>
                      <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">Energy Burned</p>
                      <div className="flex items-baseline gap-xs">
                        <span className="font-stat-value text-3xl font-bold text-primary-fixed glow-lime">512</span>
                        <span className="font-label-md text-xs text-on-surface-variant">kcal</span>
                      </div>
                    </div>
                    
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-white/10" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeWidth="5"></circle>
                        <circle className="text-primary-fixed glow-lime transition-all duration-1000" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeDasharray="150.8" strokeDashoffset="40.7" strokeLinecap="round" strokeWidth="5"></circle>
                      </svg>
                      <span className="absolute font-label-sm text-[10px] text-primary font-bold">73%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-sm mb-md">
                    <div className="bg-white/5 rounded-lg p-sm border border-white/5">
                      <p className="font-label-sm text-[9px] text-on-surface-variant mb-xs">Active Burn</p>
                      <p className="font-headline-lg-mobile text-xs font-bold text-primary">312 <span className="text-[9px] opacity-60">kcal</span></p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-sm border border-white/5">
                      <p className="font-label-sm text-[9px] text-on-surface-variant mb-xs">Resting Metabolic</p>
                      <p className="font-headline-lg-mobile text-xs font-bold text-primary">200 <span className="text-[9px] opacity-60">kcal</span></p>
                    </div>
                  </div>

                  {/* Sparkline Bar Chart */}
                  <div className="h-16 flex items-end justify-between gap-0.5 mb-md bg-background/45 p-1.5 rounded-lg border border-white/5">
                    {hourlyBurnData.map((h, i) => (
                      <div 
                        key={i} 
                        style={{ height: `${h}%` }}
                        className="w-full bg-primary-fixed/20 rounded-t-xs hover:bg-primary-fixed transition-colors cursor-pointer"
                      ></div>
                    ))}
                  </div>

                  {/* Calorie food input with AI Scanner trigger */}
                  <div className="border-t border-white/10 pt-sm flex flex-col gap-sm">
                    <button 
                      onClick={() => setShowMealScanner(true)}
                      className="w-full py-1.5 bg-primary-fixed/20 text-primary-fixed hover:bg-primary-fixed hover:text-on-primary-fixed font-bold border border-primary-fixed/30 rounded-lg active:scale-95 transition-all text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                      AI Scan Meal Photo
                    </button>
                    <div className="flex justify-between items-center gap-xs">
                      <div className="text-[10px]">
                        <p className="text-on-surface-variant">Intake: <span className="text-primary font-bold">{calorieIntake} kcal</span></p>
                        <p className="text-primary-fixed font-bold">Net: +{calorieIntake - 512} kcal</p>
                      </div>
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
                        className="w-16 bg-background/80 border border-white/10 rounded-md px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-primary-fixed text-primary text-center"
                      />
                    </div>
                  </div>
                </section>

                {/* Hydration Tracker Details */}
                <section className="glass-surface rounded-xl p-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-base mb-sm">
                      <span className="material-symbols-outlined text-secondary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                      <p className="font-label-md text-xs text-secondary-fixed-dim uppercase tracking-wider font-bold">Hydration</p>
                    </div>

                    <div className="flex items-end justify-between mb-md">
                      <div className="space-y-xs">
                        <div className="flex items-baseline gap-xs">
                          <span className="font-stat-value text-2xl font-bold text-primary">{(hydrationLogs.glassesLog * 0.25).toFixed(2)}</span>
                          <span className="font-label-md text-xs text-on-surface-variant">Liters</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant">{hydrationLogs.glassesLog}/8 glasses completed</p>
                      </div>
                      <div className="bg-secondary-fixed-dim/20 px-2 py-0.5 rounded-full border border-secondary-fixed-dim/30">
                        <p className="text-[9px] text-secondary-fixed-dim">{8 - hydrationLogs.glassesLog} more to go</p>
                      </div>
                    </div>

                    {/* Interactive segments bar */}
                    <div className="flex gap-1 justify-between mb-md">
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const active = idx < hydrationLogs.glassesLog;
                        return (
                          <button 
                            key={idx}
                            onClick={() => toggleWaterSegment(idx)}
                            className={`flex-1 h-2 rounded-full transition-all outline-none ${
                              active ? 'bg-secondary-fixed-dim glow-cyan' : 'bg-white/15 hover:bg-white/35'
                            }`}
                          ></button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-lg p-2 border border-white/5 flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[12px]">history</span>
                      <span>Last: {hydrationLogs.lastLogTime}</span>
                    </div>
                    <div className="flex items-center gap-xs text-secondary-fixed-dim font-bold">
                      <span className="material-symbols-outlined text-[12px]">alarm</span>
                      <span>Next: {hydrationLogs.nextReminderTime}</span>
                    </div>
                  </div>
                </section>

                {/* BMI composition slider range */}
                <section className="glass-surface rounded-xl p-md flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-sm">
                      <div className="flex items-center gap-base">
                        <span className="material-symbols-outlined text-tertiary-fixed-dim">monitor_weight</span>
                        <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold">Body Composition</p>
                      </div>
                      <div className="flex items-center gap-xs text-error font-semibold">
                        <span className="material-symbols-outlined text-[14px]">trending_down</span>
                        <span className="text-[10px]">0.3 pts</span>
                      </div>
                    </div>

                    <div className="text-center mb-md">
                      <p className="font-stat-value text-3xl text-primary font-bold mb-xs">{calculatedBmi}</p>
                      <div className="inline-flex items-center gap-xs px-2.5 py-0.5 bg-primary-fixed/10 border border-primary-fixed/20 rounded-full text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span>
                        <p className="font-label-sm text-primary-fixed font-bold">Status: {getBmiStatus(calculatedBmi)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-xs mb-md text-center">
                      <div>
                        <p className="text-[9px] text-on-surface-variant">Height</p>
                        <p className="text-xs font-bold text-primary">{userProfile.height}<span className="text-[9px] opacity-60">cm</span></p>
                      </div>
                      <div>
                        <p className="text-[9px] text-on-surface-variant">Weight</p>
                        <p className="text-xs font-bold text-primary">{userProfile.weight}<span className="text-[9px] opacity-60">kg</span></p>
                      </div>
                      <div>
                        <p className="text-[9px] text-on-surface-variant">Target</p>
                        <p className="text-xs font-bold text-secondary-fixed-dim">{userProfile.targetBmi}</p>
                      </div>
                    </div>

                    {/* Scale tracker visual slider */}
                    <div className="relative pt-4 pb-2">
                      <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-secondary-fixed-dim via-primary-fixed to-tertiary-fixed-dim"></div>
                      <div 
                        style={{ left: `${getBmiMarkerPercent(calculatedBmi)}%` }}
                        className="absolute top-0.5 flex flex-col items-center transition-all duration-700 ease-out"
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-background shadow-lg"></div>
                        <div className="w-[1.5px] h-3 bg-primary/45"></div>
                      </div>
                      
                      <div className="flex justify-between mt-1 text-[8px] text-on-surface-variant font-bold uppercase">
                        <span>Under</span>
                        <span>Normal</span>
                        <span>Over</span>
                        <span>Obese</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-xs p-2 bg-white/5 rounded-lg border border-white/5 text-center text-[10px] flex flex-col gap-xs">
                    <p className="text-on-surface">Healthy range: 18.5 - 24.9 BMI</p>
                    <p className="text-primary-fixed font-bold">Your ratio is in the optimal range!</p>
                    <button 
                      onClick={() => setShowWeightTrackerModal(true)}
                      className="w-full mt-xs py-1.5 bg-secondary-container/20 text-secondary-fixed-dim hover:bg-secondary-container hover:text-on-secondary-container font-bold border border-secondary-fixed-dim/30 rounded-lg active:scale-95 transition-all text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">scale</span>
                      Track Weight Trends & Logs
                    </button>
                  </div>
                </section>

              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW: DETAILED ANALYTICS (ACTIVITY) */}
        {/* ============================================================== */}
        {currentTab === 'activity' && (
          <div className="flex flex-col gap-lg animate-fade-in">
            
            {/* Weekly calendar slider selector */}
            <section className="mb-xs">
              <div className="flex justify-between items-center gap-sm overflow-x-auto pb-3 no-scrollbar">
                {weeklyLogs.map(log => {
                  const active = log.dayNum === selectedDayNum;
                  return (
                    <div 
                      key={log.dayNum}
                      onClick={() => setSelectedDayNum(log.dayNum)}
                      className={`flex flex-col items-center min-w-[70px] md:min-w-[90px] p-sm md:p-md glass-card rounded-xl cursor-pointer hover:border-primary-fixed/30 hover:opacity-100 transition-all shrink-0 ${
                        active 
                          ? 'border-primary-fixed bg-surface-variant/40 accent-glow-lime opacity-100 scale-105' 
                          : 'opacity-60'
                      }`}
                    >
                      <span className={`font-label-sm text-[10px] md:text-xs mb-xs ${active ? 'text-primary-fixed font-bold' : 'text-on-surface-variant'}`}>
                        {log.dayName}
                      </span>
                      <span className={`font-headline-lg text-lg md:text-2xl ${active ? 'text-primary-fixed font-bold' : 'text-primary'}`}>
                        {log.dayNum}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Bento Grid layout: adapts column grid columns dynamically */}
            <div className="grid grid-cols-12 gap-lg items-start">
              
              {/* Left column (col-span-12 lg:col-span-4) - Cardio & Recovery */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
                
                {/* Cardio Details Card */}
                <div className="glass-card p-lg rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all">
                  <div className="flex justify-between items-center mb-lg">
                    <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">Cardio Details</h3>
                    <span className="material-symbols-outlined text-secondary-fixed-dim">directions_run</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-sm">
                    <div className="relative w-40 h-40 mb-lg">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" fill="none" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                        <circle 
                          className="drop-shadow-[0_0_8px_rgba(171,214,0,0.5)] transition-all duration-700" 
                          cx="80" cy="80" fill="none" r="70" 
                          stroke="#c3f400" 
                          strokeDasharray="439.8" 
                          strokeDashoffset={439.8 - (439.8 * (stepsPercent / 100))} 
                          strokeLinecap="round" strokeWidth="8"
                        ></circle>
                      </svg>
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-stat-value text-xl text-primary font-bold">
                          {activeLog.steps.toLocaleString()}
                        </span>
                        <span className="font-label-sm text-[8px] text-on-surface-variant tracking-wider font-semibold">
                          STEPS ({stepsPercent}%)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-sm w-full text-center">
                      <div className="p-md bg-surface-container/40 rounded-xl border border-white/5">
                        <p className="font-label-sm text-[10px] text-on-surface-variant mb-xs">Distance</p>
                        <p className="font-headline-lg text-md text-secondary-fixed-dim font-bold">{activeLog.km} <span className="text-[10px] font-normal">km</span></p>
                      </div>
                      <div className="p-md bg-surface-container/40 rounded-xl border border-white/5 relative group">
                        <p className="font-label-sm text-[10px] text-on-surface-variant mb-xs">Active Time</p>
                        <p className="font-headline-lg text-md text-primary-fixed font-bold">{activeLog.activeMin} <span className="text-[10px] font-normal">min</span></p>
                        <div className="absolute inset-0 bg-surface-container flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <button onClick={() => setCurrentTab('workouts')} className="text-[9px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-bold">Timer</button>
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
                        <p className="font-label-sm text-[10px] text-on-surface-variant mb-0.5">Recovery Score</p>
                        <p className="font-stat-value text-2xl text-primary font-bold">{activeLog.recovery}%</p>
                      </div>
                      <div className="flex gap-1 h-10 items-end">
                        <div className="w-2 bg-primary-fixed/20 h-5 rounded-full"></div>
                        <div className="w-2 bg-primary-fixed/40 h-7 rounded-full"></div>
                        <div className="w-2 bg-primary-fixed h-9 rounded-full accent-glow-lime animate-pulse"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-xs pt-md border-t border-white/5 text-center">
                      <div className="hover:bg-white/5 py-1.5 rounded transition-colors">
                        <span className="material-symbols-outlined text-secondary-fixed-dim text-md">bedtime</span>
                        <p className="font-label-sm text-xs mt-0.5 font-bold text-primary">{activeLog.sleep}h</p>
                        <span className="text-[8px] text-on-surface-variant uppercase font-bold">Sleep</span>
                      </div>
                      <div className="hover:bg-white/5 py-1.5 rounded transition-colors">
                        <span className="material-symbols-outlined text-error text-md">favorite</span>
                        <p className="font-label-sm text-xs mt-0.5 font-bold text-primary">{liveHeartRate} bpm</p>
                        <span className="text-[8px] text-on-surface-variant uppercase font-bold">BPM</span>
                      </div>
                      <div className="hover:bg-white/5 py-1.5 rounded transition-colors cursor-pointer group relative" onClick={() => addHydration(0.25)}>
                        <span className="material-symbols-outlined text-cyan-400 text-md">water_drop</span>
                        <p className="font-label-sm text-xs mt-0.5 font-bold text-primary">
                          {getWaterDisplayValue(activeLog.water)}
                        </p>
                        <span className="text-[8px] text-on-surface-variant uppercase font-bold group-hover:hidden text-center">Water</span>
                        <span className="text-[8px] text-cyan-300 font-bold hidden group-hover:block">+250ml</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right column (col-span-12 lg:col-span-8) - Strength Training & PR logs */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">
                
                {/* Strength training metrics card */}
                <div className="glass-card p-lg rounded-2xl hover:border-white/20 transition-all">
                  <div className="flex justify-between items-center mb-lg">
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-primary-fixed">fitness_center</span>
                      <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">Strength Analytics</h3>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <span className="px-2.5 py-0.5 bg-primary-container/10 text-primary-fixed text-[10px] font-bold rounded-full">
                        {activeLog.workout.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-0.5 bg-surface-variant text-on-surface-variant text-[10px] font-bold rounded-full">
                        SESSION #24
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
                    <div className="flex flex-col p-3 bg-surface-container-low/60 rounded-xl border border-white/5">
                      <span className="font-label-sm text-[10px] text-on-surface-variant mb-1">Exercises Focus</span>
                      <span className="font-stat-value text-xl text-primary font-bold">
                        {activeLog.sets > 0 ? '06' : '00'}
                      </span>
                      <div className="w-full h-1 bg-surface-container mt-3 rounded-full overflow-hidden">
                        <div className="bg-primary-fixed h-full w-full"></div>
                      </div>
                    </div>

                    <div className="flex flex-col p-3 bg-surface-container-low/60 rounded-xl border border-white/5 relative group">
                      <span className="font-label-sm text-[10px] text-on-surface-variant mb-1">Total Sets</span>
                      <span className="font-stat-value text-xl text-primary font-bold">{activeLog.sets}</span>
                      <div className="w-full h-1 bg-surface-container mt-3 rounded-full overflow-hidden">
                        <div className="bg-secondary-fixed-dim h-full" style={{ width: `${Math.min(100, (activeLog.sets/20)*100)}%` }}></div>
                      </div>
                      <button onClick={() => setShowLogWorkoutModal(true)} className="absolute inset-0 bg-surface-container flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-[10px] text-secondary-fixed font-bold cursor-pointer">
                        + Add Set
                      </button>
                    </div>

                    <div className="flex flex-col p-3 bg-surface-container-low/60 rounded-xl border border-white/5">
                      <span className="font-label-sm text-[10px] text-on-surface-variant mb-1">Total Reps</span>
                      <span className="font-stat-value text-xl text-primary font-bold">{activeLog.reps}</span>
                      <div className="w-full h-1 bg-surface-container mt-3 rounded-full overflow-hidden">
                        <div className="bg-tertiary-fixed-dim h-full" style={{ width: `${Math.min(100, (activeLog.reps/200)*100)}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div>
                      <h4 className="font-label-md text-xs text-on-surface uppercase tracking-wider font-semibold mb-md">Muscle Intensities</h4>
                      <div className="space-y-md">
                        {[
                          { name: 'Chest', val: activeLog.chest },
                          { name: 'Triceps', val: activeLog.triceps },
                          { name: 'Shoulders', val: activeLog.shoulders }
                        ].map(muscle => (
                          <div key={muscle.name}>
                            <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant mb-xs">
                              <span>{muscle.name}</span>
                              <span>{muscle.val}%</span>
                            </div>
                            <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                              <div className="bg-primary-fixed h-full transition-all duration-500" style={{ width: `${muscle.val}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly consistency chart */}
                    <div className="bg-surface-container/30 rounded-xl p-md border border-white/5 flex flex-col justify-between">
                      <h4 className="font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant mb-sm">Weekly Consistency</h4>
                      <div className="flex items-end justify-between h-28 gap-2 pt-2">
                        {weeklyLogs.map(item => {
                          const active = item.dayNum === selectedDayNum;
                          const barHeight = item.sets > 0 ? `${(item.sets / 20) * 100}%` : '10%';
                          return (
                            <div key={item.dayNum} onClick={() => setSelectedDayNum(item.dayNum)} className="flex-grow flex flex-col items-center gap-1 group cursor-pointer">
                              <div className="w-full bg-surface-variant/35 rounded-t-sm h-[75px] flex items-end">
                                <div className={`w-full rounded-t-sm transition-all duration-500 ${
                                  active ? 'bg-primary-fixed accent-glow-lime' : 'bg-surface-variant/70 hover:bg-primary-fixed/50'
                                }`} style={{ height: barHeight }}></div>
                              </div>
                              <span className={`text-[9px] font-bold ${active ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                                {item.dayName[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements logs grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
                  {prLogs.map(log => (
                    <div key={log.id} className={`glass-card p-md rounded-xl flex items-center gap-md hover:scale-[1.01] transition-transform border-l-4 ${
                      log.type === 'pr' ? 'border-l-primary-fixed' : 'border-l-secondary-fixed'
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        log.type === 'pr' ? 'bg-primary-container/20' : 'bg-secondary-container/20'
                      }`}>
                        <span className={`material-symbols-outlined text-xl ${log.type === 'pr' ? 'text-primary-fixed' : 'text-secondary-fixed-dim'}`}>
                          {log.type === 'pr' ? 'emoji_events' : 'bolt'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-headline-lg text-sm text-primary font-bold">{log.title}</h4>
                        <p className="text-on-surface-variant text-[10px] mt-0.5 leading-normal">{log.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic Achievements & Badges Panel */}
                <AchievementsPanel 
                  activeLog={activeLog}
                  hasChattedWithAI={hasChattedWithAI}
                  triggerToast={triggerToast}
                  onShareToFeed={handleShareToFeed}
                />

              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW: WORKOUTS HUB (OR RUNNING DETAILS) */}
        {/* ============================================================== */}
        {currentTab === 'workouts' && (
          <div>
            {activeWorkoutSubView === 'running' ? (
              
              /* WORKOUT SUBVIEW: RUNNING DETAILS */
              <div className="space-y-lg animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
                  
                  {/* Running Hero Card & Interactive Chart */}
                  <div className="col-span-12 lg:col-span-8 space-y-lg">
                    {/* Hero Card */}
                    <div className="glass-card rounded-xl p-lg flex flex-col sm:flex-row items-center gap-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                      <div className="flex-1">
                        <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-xs">Total Distance</p>
                        <h3 className="font-stat-value text-4xl font-bold text-primary-fixed lime-glow mb-sm">
                          {totalMiles.toFixed(1)} <span className="text-lg font-normal text-on-surface-variant">mi</span>
                        </h3>
                        
                        <div className="flex items-center gap-sm">
                          <span className="px-2.5 py-0.5 bg-primary-container/25 text-primary-fixed rounded-full text-[10px] font-semibold">
                            {runsList.length} runs logged
                          </span>
                          <span className="text-on-surface-variant text-[10px] flex items-center gap-0.5 font-semibold">
                            <span className="material-symbols-outlined text-[12px] text-primary-fixed">trending_up</span>
                            +12% vs last week
                          </span>
                        </div>
                      </div>

                      {/* Small mini-bar chart */}
                      <div className="w-full sm:w-56 h-24 flex items-end gap-1.5 px-md">
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
                                  ? 'bg-primary-fixed shadow-[0_0_12px_rgba(171,214,0,0.3)]' 
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
                        <h4 className="font-headline-lg text-md text-primary font-bold">Daily Breakdown</h4>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => setSelectedRunningMetric('distance')}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                              selectedRunningMetric === 'distance' 
                                ? 'bg-primary-fixed text-on-primary' 
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                            }`}
                          >
                            Distance
                          </button>
                          <button 
                            onClick={() => setSelectedRunningMetric('intensity')}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                              selectedRunningMetric === 'intensity' 
                                ? 'bg-primary-fixed text-on-primary' 
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                            }`}
                          >
                            Steps Scale
                          </button>
                        </div>
                      </div>

                      <div className="h-56 relative w-full flex items-end justify-between px-2 pb-6 border-b border-white/10">
                        <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none">
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
                            <div key={index} className="group relative flex flex-col items-center w-8 md:w-12 cursor-pointer" onClick={() => setSelectedDayNum(log.dayNum)}>
                              <span className="absolute bottom-full mb-1 text-[8px] bg-surface-container border border-white/10 text-primary-fixed px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold shrink-0">
                                {selectedRunningMetric === 'distance' ? `${log.runMiles} mi` : `${log.steps.toLocaleString()}`}
                              </span>
                              <div style={{ height: barHeight }} className={`w-2 rounded-t-full transition-all group-hover:w-3.5 ${barColor}`}></div>
                              <span className={`absolute -bottom-6 text-[10px] font-semibold ${active ? 'text-primary-fixed font-bold' : 'text-on-surface-variant'}`}>
                                {log.dayName[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metrics Aside (col-span-12 lg:col-span-4) */}
                  <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-md items-start">
                    
                    <div className="glass-card rounded-xl p-md flex flex-col justify-between">
                      <span className="material-symbols-outlined text-secondary-fixed-dim mb-sm text-lg">pace</span>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Avg Pace</p>
                      <p className="text-lg font-bold text-primary font-mono">8'12"</p>
                    </div>

                    <div className="glass-card rounded-xl p-md flex flex-col justify-between">
                      <span className="material-symbols-outlined text-error mb-sm text-lg">favorite</span>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Avg HR</p>
                      <p className="text-lg font-bold text-primary">142 <span className="text-[10px] text-on-surface-variant font-normal">bpm</span></p>
                    </div>

                    <div className="glass-card rounded-xl p-md flex flex-col justify-between">
                      <span className="material-symbols-outlined text-secondary-container mb-sm text-lg">filter_hdr</span>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Elevation</p>
                      <p className="text-lg font-bold text-primary font-mono">842 <span className="text-[10px] text-on-surface-variant font-normal">ft</span></p>
                    </div>

                    <div className="glass-card rounded-xl p-md flex flex-col justify-between">
                      <span className="material-symbols-outlined text-tertiary-fixed-dim mb-sm text-lg">local_fire_department</span>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Calories</p>
                      <p className="text-lg font-bold text-primary font-mono">2,140</p>
                    </div>

                    {/* Shoe mileage card */}
                    <div className="glass-card rounded-xl p-md col-span-2 relative overflow-hidden group">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-sm">
                          <div>
                            <h4 className="font-label-md text-[10px] text-primary-fixed uppercase tracking-wider font-bold">Shoe Mileage</h4>
                            <p className="text-xs font-semibold text-primary">Nike Pegasus 40</p>
                          </div>
                          <span className="material-symbols-outlined text-primary-fixed text-lg">straighten</span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-1.5 mb-xs">
                          <div className="bg-primary-fixed h-full rounded-full lime-glow" style={{ width: `${(shoeMileage/500)*100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-on-surface-variant">
                          <span>{shoeMileage.toFixed(0)} mi logged</span>
                          <span>500 mi limit</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Cadence tip */}
                    <div className="glass-card rounded-xl p-md col-span-2 flex items-center gap-md border-l-4 border-secondary-container">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary-container shrink-0">
                        <span className="material-symbols-outlined text-lg">auto_fix_high</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary">Performance Tip</p>
                        <p className="text-[10px] text-on-surface-variant leading-relaxed">Your cadence is up 4% this week. Focus on short steps.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Runs section: responsive table or card list */}
                <section className="glass-card rounded-xl overflow-hidden mt-md">
                  <div className="p-md md:p-lg border-b border-white/5 flex justify-between items-center">
                    <h4 className="font-headline-lg text-sm md:text-lg text-primary font-bold">Recent Runs</h4>
                    <button 
                      onClick={() => setShowLogRunModal(true)}
                      className="text-primary-fixed font-label-md text-xs font-bold hover:underline cursor-pointer"
                    >
                      + Log New Run
                    </button>
                  </div>
                  
                  {/* Desktop Table View >= 768px */}
                  <div className="hidden md:block overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-on-surface-variant bg-surface-container-low/50 uppercase tracking-widest">
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
                                  <img src={run.img} alt="Route preview map" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
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
                                className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed text-md cursor-pointer"
                              >
                                open_in_new
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List View < 768px */}
                  <div className="block md:hidden p-md space-y-sm">
                    {runsList.map(run => (
                      <div 
                        key={run.id} 
                        onClick={() => triggerToast(`Details loaded for ${run.name}`)}
                        className="p-md bg-white/5 rounded-xl flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer border border-white/5"
                      >
                        <div className="flex items-center gap-md">
                          <div className="w-9 h-9 rounded bg-primary-container/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary-container text-lg">directions_run</span>
                          </div>
                          <div>
                            <p className="font-label-md text-xs text-primary font-bold">{run.name}</p>
                            <p className="text-[9px] text-on-surface-variant">{run.date} • {run.time}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-label-md text-xs text-primary font-bold">{run.distance} mi</p>
                          <p className="text-[9px] text-on-surface-variant font-mono">{run.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

            ) : (
              
              /* WORKOUTS HUB GENERAL VIEW: Discipline selector & Stopwatch */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg items-start animate-fade-in">
                
                {/* Selector cards column */}
                <div className="space-y-lg">
                  <div className="glass-card p-lg rounded-2xl border border-white/10">
                    <h3 className="font-headline-lg text-md md:text-lg text-primary font-bold mb-xs">Workout Disciplines</h3>
                    <p className="text-xs text-on-surface-variant mb-lg">Select an exercise format below to review metrics history, milestone achievements, and logs.</p>

                    <div className="flex flex-col gap-sm">
                      {/* Running Selector */}
                      <div 
                        onClick={() => setActiveWorkoutSubView('running')}
                        className="p-md bg-surface-container/60 hover:bg-surface-container border border-white/5 hover:border-primary-fixed/30 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-fixed shrink-0">
                            <span className="material-symbols-outlined text-2xl">directions_run</span>
                          </div>
                          <div>
                            <h4 className="font-label-md text-xs text-primary font-bold">Running Performance</h4>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">{totalMiles.toFixed(1)} miles tracked this week • {runsList.length} runs</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                      </div>

                      {/* Strength Selector */}
                      <div 
                        onClick={() => { setActiveWorkoutSubView(null); setCurrentTab('home'); setDashboardMode('performance'); }}
                        className="p-md bg-surface-container/60 hover:bg-surface-container border border-white/5 hover:border-primary-fixed/30 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-fixed shrink-0">
                            <span className="material-symbols-outlined text-2xl">fitness_center</span>
                          </div>
                          <div>
                            <h4 className="font-label-md text-xs text-primary font-bold">Strength Training</h4>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">{activeLog.sets} sets logged today ({activeLog.workout})</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                      </div>
                    </div>
                  </div>

                  {/* Routine Planner card with custom Workout Builder */}
                  <div className="glass-card p-lg rounded-2xl">
                    <div className="flex justify-between items-center mb-lg">
                      <h3 className="font-headline-lg text-xs md:text-sm text-primary font-bold uppercase tracking-wider">Routines Planner</h3>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => setShowAIWorkoutGenerator(true)}
                          className="text-[10px] bg-gradient-to-r from-primary-fixed to-secondary-container text-on-primary-fixed px-2.5 py-1 rounded-full font-bold cursor-pointer hover:scale-105 transition-transform"
                        >
                          🪄 AI Generator
                        </button>
                        <button 
                          onClick={() => setShowWorkoutBuilder(true)}
                          className="text-[10px] bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full font-bold cursor-pointer"
                        >
                          + Builder
                        </button>
                        <button 
                          onClick={() => setShowLogWorkoutModal(true)}
                          className="text-[10px] bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-bold cursor-pointer"
                        >
                          + Log Set
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-sm">
                      {routinesList.map((ex, idx) => (
                        <div key={idx} className="flex justify-between items-center p-sm bg-surface-container-high/40 rounded-xl border border-white/5">
                          <div>
                            <p className="font-label-md text-xs text-primary font-bold">{ex.name}</p>
                            <p className="text-[9px] text-on-surface-variant">{(ex.routine || ex.repinfo)} • {ex.repinfo}</p>
                          </div>
                          <button onClick={() => triggerToast(`Logged sets for ${ex.name}`)} className="w-7 h-7 rounded-full bg-primary-fixed/20 text-primary-fixed flex items-center justify-center cursor-pointer active:scale-90 transition-transform">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Workout Stopwatch Card */}
                <div className="glass-card p-lg rounded-2xl border border-white/10 flex flex-col justify-between min-h-[320px]">
                  <div>
                    <h3 className="font-headline-lg text-md md:text-lg text-primary mb-1">⏱️ Live Stopwatch Timer</h3>
                    <p className="text-xs text-on-surface-variant mb-lg">Track and clock your exercises in real time. Elapsed minutes automatically log into your active metrics.</p>
                  </div>

                  <div className="py-lg flex flex-col items-center justify-center bg-background/50 border border-white/5 rounded-xl my-xs">
                    {!workoutActive ? (
                      <button 
                        onClick={startWorkout}
                        className="w-32 h-32 rounded-full bg-primary-fixed text-on-primary-fixed font-headline-lg text-stat-value shadow-2xl flex flex-col items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-3xl mb-1">play_arrow</span>
                        <span className="text-[9px] tracking-wider uppercase font-bold">Start</span>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping mb-2.5"></span>
                        <h4 className="font-stat-value text-3xl md:text-4xl font-mono text-primary font-bold tracking-widest mb-md">
                          {formatTimer(timerSeconds)}
                        </h4>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={pauseWorkout}
                            className="px-5 py-1.5 bg-surface-variant border border-white/15 text-primary-fixed text-xs font-semibold rounded-full active:scale-95 hover:bg-white/5 transition-all cursor-pointer"
                          >
                            {workoutPaused ? 'Resume' : 'Pause'}
                          </button>
                          <button 
                            onClick={stopWorkout}
                            className="px-5 py-1.5 bg-error/20 border border-error/45 text-error text-xs font-semibold rounded-full active:scale-95 hover:bg-error/35 transition-all cursor-pointer"
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

        {/* ============================================================== */}
        {/* VIEW: NUTRITION & HYDRATION HUB */}
        {/* ============================================================== */}
        {currentTab === 'nutrition' && (
          <NutritionHub 
            calorieIntake={calorieIntake}
            setCalorieIntake={setCalorieIntake}
            hydrationLogs={hydrationLogs}
            addHydration={addHydration}
            setShowMealScanner={setShowMealScanner}
            userProfile={userProfile}
            loggedMeals={loggedMeals}
            triggerToast={triggerToast}
            onLogMeal={handleLogMeal}
          />
        )}

        {/* ============================================================== */}
        {/* VIEW: COMMUNITY (SOCIAL) */}
        {/* ============================================================== */}
        {currentTab === 'community' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start animate-fade-in">
            {/* Left Column: Community Feed */}
            <div className="col-span-12 lg:col-span-8">
              <CommunityFeed 
                userProfile={userProfile}
                activeLog={activeLog}
                triggerToast={triggerToast}
                currentUser={currentUser}
                posts={socialPosts}
                setPosts={setSocialPosts}
              />
            </div>

            {/* Right Column: Sidebar challenges */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
              {/* Friends Leaderboard */}
              <div className="glass-card p-lg rounded-2xl">
                <h3 className="font-headline-lg text-md md:text-lg text-primary mb-md">Leaderboard Challenges</h3>
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
                        <img src={friend.avatar} alt="User avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div>
                          <div className="font-label-md text-xs text-primary font-bold">{friend.name}</div>
                          <div className="text-[10px] text-on-surface-variant">{friend.score}</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => triggerToast(friend.active ? 'Score shared!' : 'Cheered buddy!')}
                        className="text-[10px] bg-surface-variant hover:bg-white/10 border border-white/15 px-3 py-1 rounded-full text-on-surface-variant hover:text-white cursor-pointer active:scale-95 transition-transform"
                      >
                        {friend.active ? 'Share' : 'Cheer'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekend Challenge */}
              <div className="bg-gradient-to-br from-surface-container/80 to-surface-container-high/80 backdrop-blur-xl border border-white/10 p-lg rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-[40px] pointer-events-none -mr-12 -mt-12"></div>
                
                <div className="flex items-center gap-xs mb-sm">
                  <span className="material-symbols-outlined text-secondary-fixed text-sm">groups</span>
                  <span className="font-label-sm text-[10px] text-secondary-fixed uppercase tracking-wider font-bold">Team Challenge</span>
                </div>
                <h3 className="font-headline-lg text-sm md:text-lg text-primary font-bold mb-1">Weekend Hydration Warriors</h3>
                <p className="text-xs text-on-surface-variant mb-md leading-relaxed">Drink 8 glasses of water daily from Fri-Sun. Team goal: 80% completion.</p>
                
                <div className="flex justify-between text-xs mb-2 font-semibold">
                  <span className="text-on-surface-variant">Team Completion Rate</span>
                  <span className="text-secondary-fixed">68% Finished</span>
                </div>
                <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mb-lg">
                  <div className="bg-secondary-fixed h-full rounded-full w-[68%]" />
                </div>

                <button 
                  onClick={() => triggerToast('Weekend challenge board loaded')}
                  className="w-full py-2 bg-secondary-fixed text-on-secondary-fixed hover:bg-white transition-all font-semibold rounded-lg shadow-lg active:scale-95 text-xs cursor-pointer"
                >
                  View Challenge Board
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW: SETTINGS (PREFERENCES) */}
        {/* ============================================================== */}
        {currentTab === 'settings' && (
          <div className="max-w-2xl mx-auto w-full bg-surface-container/60 backdrop-blur-xl rounded-2xl border border-white/10 p-md md:p-lg shadow-lg animate-fade-in flex flex-col gap-lg">
            
            <div className="border-b border-white/5 pb-md">
              <h3 className="font-headline-lg text-md md:text-lg text-primary font-bold">Preferences Config</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Configure metrics, weight and height composition tracking values.</p>
            </div>

            <div className="flex flex-col gap-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Display Profile Name</label>
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
                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                  <label className="text-xs text-on-surface-variant font-semibold">Fitness Goal Focus</label>
                  <select 
                    value={userProfile.fitnessGoal || 'GENERAL'}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, fitnessGoal: e.target.value }))}
                    className="bg-background border border-white/10 rounded-lg px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-primary-fixed cursor-pointer"
                  >
                    <option value="GENERAL" className="bg-surface">General Fitness / Health</option>
                    <option value="WEIGHT_LOSS" className="bg-surface">Weight Loss / Fat Burn</option>
                    <option value="MUSCLE_GAIN" className="bg-surface">Muscle Gain / Hypertrophy</option>
                    <option value="ENDURANCE" className="bg-surface">Cardiovascular Endurance</option>
                    <option value="FLEXIBILITY" className="bg-surface">Flexibility & Joint Mobility</option>
                  </select>
                </div>
              </div>

              {/* Height / Weight indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
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

              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant font-semibold">Profile Avatar Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-md bg-background/30 p-sm rounded-xl border border-white/5">
                  <img src={userProfile.avatar} alt="Profile preview" className="w-16 h-16 rounded-full object-cover border border-primary-fixed/20 shrink-0" />
                  <div className="flex-grow flex flex-col gap-2 w-full">
                    <input 
                      type="text" value={userProfile.avatar}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="Paste image URL..."
                      className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-xs text-on-surface-variant focus:outline-none focus:border-primary-fixed"
                    />
                    <div className="flex items-center gap-xs">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload-input"
                      />
                      <label 
                        htmlFor="avatar-upload-input"
                        className="px-3 py-1 bg-primary-fixed/10 hover:bg-primary-fixed/20 border border-primary-fixed/25 text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer flex items-center justify-center gap-1 active:scale-95 transition-all text-primary-fixed"
                      >
                        <span className="material-symbols-outlined text-xs">upload</span>
                        Upload File
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-lg border-t border-white/5 pt-lg flex flex-col gap-md">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant font-semibold">Daily Steps Target</span>
                  <span className="text-sm font-bold text-primary-fixed">{userProfile.goals.steps.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="5000" max="15000" step="500" value={userProfile.goals.steps}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, goals: { ...prev.goals, steps: parseInt(e.target.value) } }))}
                  className="w-full accent-primary-fixed h-1 bg-surface-variant cursor-pointer"
                />

                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant font-semibold">Sleep Target hours</span>
                  <span className="text-sm font-bold text-secondary-fixed">{userProfile.goals.sleep} hrs</span>
                </div>
                <input 
                  type="range" min="6.0" max="9.5" step="0.5" value={userProfile.goals.sleep}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, goals: { ...prev.goals, sleep: parseFloat(e.target.value) } }))}
                  className="w-full accent-secondary-fixed h-1 bg-surface-variant cursor-pointer"
                />

                <div className="mt-lg border-t border-white/5 pt-lg flex flex-col gap-sm">
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full py-3 bg-primary text-on-primary hover:bg-white hover:text-primary transition-all font-semibold rounded-lg shadow-lg active:scale-95 text-xs uppercase tracking-widest cursor-pointer mb-md"
                  >
                    Save Settings to Database
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('currentUser');
                      setCurrentUser(null);
                      setCurrentView('landing');
                      setCurrentTab('home');
                      triggerToast('👋 Signed out successfully.');
                    }}
                    className="w-full py-3 bg-error text-on-error hover:bg-white hover:text-primary transition-all font-semibold rounded-lg shadow-lg active:scale-95 text-xs uppercase tracking-widest cursor-pointer"
                  >
                    Sign Out of Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Global Floating Action Button for Mobile/Tablet views */}
      <button 
        onClick={() => {
          if (activeWorkoutSubView === 'running') {
            setShowLogRunModal(true);
          } else {
            setShowLogWorkoutModal(true);
          }
        }}
        className="fixed bottom-24 right-gutter w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-30 accent-glow-lime lg:hidden cursor-pointer"
        aria-label="Quick Add log"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      {/* AI Meal Scanner Modal Dialog */}
      {showMealScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-xl">
            <button 
              onClick={() => setShowMealScanner(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-on-surface-variant hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <AIMealScanner 
              onLogNutrition={(meal) => {
                handleLogMeal(meal);
                triggerToast(`🥗 Logged AI Meal Scan: ${meal.name} (+${meal.calories} kcal)`);
                setTimeout(() => setShowMealScanner(false), 2000);
              }} 
            />
          </div>
        </div>
      )}

      {/* Custom Workout Routine Builder Modal Dialog */}
      {showWorkoutBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <button 
              onClick={() => setShowWorkoutBuilder(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-on-surface-variant hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <WorkoutBuilder 
              onSaveRoutine={(routineName, exercisesList) => {
                handleSaveRoutine(routineName, exercisesList, 'Custom Routine');
                triggerToast(`🏋️‍♂️ Custom routine '${routineName}' created!`);
                setTimeout(() => setShowWorkoutBuilder(false), 1500);
              }} 
            />
          </div>
        </div>
      )}

      {/* AI Workout Generator Modal Dialog */}
      {showAIWorkoutGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <button 
              onClick={() => setShowAIWorkoutGenerator(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-on-surface-variant hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <AIWorkoutGenerator 
              onSaveRoutine={(routineName, exercisesList) => {
                handleSaveRoutine(routineName, exercisesList, 'AI Optimized');
                triggerToast(`🏋️‍♂️ AI routine '${routineName}' saved!`);
                setTimeout(() => setShowAIWorkoutGenerator(false), 1500);
              }}
              triggerToast={triggerToast}
            />
          </div>
        </div>
      )}

      {/* Weight Tracker Modal Dialog */}
      {showWeightTrackerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl my-8">
            <button 
              onClick={() => setShowWeightTrackerModal(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-on-surface-variant hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <WeightTracker 
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              triggerToast={triggerToast}
              currentUser={currentUser}
            />
          </div>
        </div>
      )}

      {/* Smartwatch Companion Simulator */}
      <WatchSimulator 
        isConnected={watchConnected}
        setIsConnected={setWatchConnected}
        currentSteps={activeLog.steps}
        currentActiveMin={activeLog.activeMin}
        dashboardWorkoutActive={workoutActive}
        dashboardWorkoutPaused={workoutPaused}
        dashboardWorkoutSeconds={timerSeconds}
        onSyncHeartRate={(bpm) => setLiveHeartRate(bpm)}
        onSyncSteps={(amount) => addSteps(amount)}
        onStartWorkout={startWorkout}
        onStopWorkout={stopWorkout}
      />

    </div>
  );
}

export default App;
