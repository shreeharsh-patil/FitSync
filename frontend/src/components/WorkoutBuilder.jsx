import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Plus, 
  Minus, 
  Trash2, 
  Save, 
  Search, 
  PlusCircle, 
  Check, 
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  Flame,
  Scale,
  Activity
} from 'lucide-react';

const DEFAULT_EXERCISES = {
  Chest: [
    { id: 'chest_bench_press', name: 'Bench Press' },
    { id: 'chest_incline_db_press', name: 'Incline Dumbbell Press' },
    { id: 'chest_flys', name: 'Chest Flys' },
    { id: 'chest_pushups', name: 'Pushups' },
    { id: 'chest_dips', name: 'Dips' },
  ],
  Back: [
    { id: 'back_pullups', name: 'Pull-ups' },
    { id: 'back_lat_pulldowns', name: 'Lat Pulldowns' },
    { id: 'back_rows', name: 'Bent-Over Rows' },
    { id: 'back_deadlifts', name: 'Deadlifts' },
    { id: 'back_tbar_rows', name: 'T-Bar Rows' },
  ],
  Legs: [
    { id: 'legs_squats', name: 'Squats' },
    { id: 'legs_rdl', name: 'Romanian Deadlifts' },
    { id: 'legs_press', name: 'Leg Press' },
    { id: 'legs_calf_raises', name: 'Calf Raises' },
    { id: 'legs_lunges', name: 'Lunges' },
  ],
  Cardio: [
    { id: 'cardio_treadmill', name: 'Treadmill Run' },
    { id: 'cardio_hiit', name: 'HIIT Interval' },
    { id: 'cardio_rowing', name: 'Rowing Machine' },
    { id: 'cardio_jumprope', name: 'Jump Rope' },
    { id: 'cardio_cycling', name: 'Cycling' },
  ]
};

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Cardio'];

export default function WorkoutBuilder({ onSaveRoutine }) {
  const [routineName, setRoutineName] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [customExercises, setCustomExercises] = useState({
    Chest: [],
    Back: [],
    Legs: [],
    Cardio: []
  });
  const [selectedExercises, setSelectedExercises] = useState([]);
  
  // Custom exercise creation state
  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomCategory, setNewCustomCategory] = useState('Chest');
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  // Success state for saving indicator
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  // Combine default exercises with custom exercises
  const allExercisesGrouped = useMemo(() => {
    const merged = {};
    const groups = ['Chest', 'Back', 'Legs', 'Cardio'];
    groups.forEach(group => {
      merged[group] = [...DEFAULT_EXERCISES[group], ...(customExercises[group] || [])];
    });
    return merged;
  }, [customExercises]);

  // Filter based on active tab and search query
  const filteredExercises = useMemo(() => {
    const result = {};
    const groups = ['Chest', 'Back', 'Legs', 'Cardio'];
    groups.forEach(group => {
      if (activeTab !== 'All' && activeTab !== group) return;
      
      const filtered = allExercisesGrouped[group].filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0 || searchTerm === '') {
        result[group] = filtered;
      }
    });
    return result;
  }, [allExercisesGrouped, activeTab, searchTerm]);

  // Toggle selection
  const toggleExercise = (exercise, category) => {
    const isSelected = selectedExercises.some(ex => ex.id === exercise.id);
    if (isSelected) {
      setSelectedExercises(prev => prev.filter(ex => ex.id !== exercise.id));
    } else {
      setSelectedExercises(prev => [
        ...prev,
        {
          id: exercise.id,
          name: exercise.name,
          category,
          sets: 3,
          reps: 10,
          weight: 20
        }
      ]);
    }
  };

  // Adjust sets or reps by +/- 1
  const adjustField = (id, field, amount) => {
    setSelectedExercises(prev => prev.map(ex => {
      if (ex.id === id) {
        const minVal = 1;
        const maxVal = field === 'sets' ? 20 : 100;
        const updated = Math.max(minVal, Math.min(maxVal, ex[field] + amount));
        return { ...ex, [field]: updated };
      }
      return ex;
    }));
  };

  // Adjust weight by +/- specified step
  const adjustWeight = (id, amount) => {
    setSelectedExercises(prev => prev.map(ex => {
      if (ex.id === id) {
        const updated = Math.max(0, ex.weight + amount);
        return { ...ex, weight: parseFloat(updated.toFixed(1)) };
      }
      return ex;
    }));
  };

  // Manually update weight via input field
  const handleWeightChange = (id, value) => {
    const parsed = parseFloat(value);
    setSelectedExercises(prev => prev.map(ex => {
      if (ex.id === id) {
        return { ...ex, weight: isNaN(parsed) ? 0 : parsed };
      }
      return ex;
    }));
  };

  // Add custom exercise
  const handleAddCustomExercise = (e) => {
    e.preventDefault();
    if (!newCustomName.trim()) return;

    const newId = `custom_${Date.now()}`;
    const newEx = { id: newId, name: newCustomName.trim() };

    setCustomExercises(prev => ({
      ...prev,
      [newCustomCategory]: [...prev[newCustomCategory], newEx]
    }));

    // Auto-select it
    setSelectedExercises(prev => [
      ...prev,
      {
        id: newId,
        name: newEx.name,
        category: newCustomCategory,
        sets: 3,
        reps: 10,
        weight: 20
      }
    ]);

    setNewCustomName('');
    setShowCustomForm(false);
  };

  // Clear all selections and fields
  const handleReset = () => {
    setRoutineName('');
    setSelectedExercises([]);
    setSearchTerm('');
    setActiveTab('All');
  };

  // Save Routine
  const handleSave = (e) => {
    e.preventDefault();
    if (!routineName.trim()) return;
    if (selectedExercises.length === 0) return;

    if (onSaveRoutine) {
      onSaveRoutine(routineName.trim(), selectedExercises);
    }

    setIsSavedSuccessfully(true);
    setTimeout(() => {
      setIsSavedSuccessfully(false);
      handleReset();
    }, 2000);
  };

  // Category badges configuration
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Chest': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Back': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Legs': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Cardio': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default: return 'bg-white/10 text-white/70 border border-white/10';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-lg animate-fade-in relative z-10 text-on-surface">
      {/* Background Layer (Parallax Glow) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-3xl">
        <div className="absolute top-[20%] right-[10%] w-80 h-80 rounded-full bg-primary-fixed/5 blur-[80px] opacity-70"></div>
        <div className="absolute bottom-[20%] left-[10%] w-96 h-96 rounded-full bg-secondary-container/5 blur-[100px] opacity-50"></div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg relative z-10">
        
        {/* LEFT COLUMN: Exercise Selector & Custom Exercise creation (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-md">
          {/* Header section for builder selector */}
          <div className="glass-card p-lg rounded-2xl border border-white/5 flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary-container/10 flex items-center justify-center rounded-lg border border-primary-fixed/20 shadow-md">
                  <Dumbbell className="h-5 w-5 text-primary-fixed" />
                </div>
                <div>
                  <h3 className="font-headline-lg text-sm md:text-md text-primary font-bold tracking-wide">Select Exercises</h3>
                  <p className="text-[10px] text-on-surface-variant font-medium">Add routines from library or custom list</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomForm(!showCustomForm)}
                className="px-3 py-1 bg-surface-variant/40 border border-white/10 hover:border-primary-fixed/30 hover:bg-white/5 text-primary-fixed text-xs font-semibold rounded-lg transition-all duration-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Custom</span>
              </button>
            </div>

            {/* Custom Exercise Form */}
            <AnimatePresence>
              {showCustomForm && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleAddCustomExercise}
                  className="bg-surface-container-low/50 border border-white/5 rounded-xl p-md flex flex-col gap-sm overflow-hidden"
                >
                  <h4 className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary-fixed" />
                    <span>Create Custom Exercise</span>
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Exercise Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Weighted Pullups"
                      value={newCustomName}
                      onChange={(e) => setNewCustomName(e.target.value)}
                      className="w-full h-10 bg-surface-container-lowest border border-white/10 rounded-lg px-3 text-xs text-on-surface focus:outline-none focus:border-primary-fixed transition-colors"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-sm">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Muscle Group</label>
                      <select
                        value={newCustomCategory}
                        onChange={(e) => setNewCustomCategory(e.target.value)}
                        className="w-full h-10 bg-surface-container-lowest border border-white/10 rounded-lg px-3 text-xs text-on-surface focus:outline-none focus:border-primary-fixed transition-colors"
                      >
                        <option value="Chest">Chest</option>
                        <option value="Back">Back</option>
                        <option value="Legs">Legs</option>
                        <option value="Cardio">Cardio</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full h-10 bg-primary-fixed text-on-primary-fixed font-bold rounded-lg text-xs hover:bg-white active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add & Select</span>
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Search and Category Tabs */}
            <div className="flex flex-col gap-sm">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 bg-surface-container-low border border-white/10 rounded-xl pl-10 pr-4 text-xs text-on-surface focus:outline-none focus:border-primary-fixed transition-colors placeholder:text-outline-variant"
                />
              </div>

              {/* Responsive Category Selector */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveTab(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 ${
                      activeTab === cat
                        ? 'bg-primary-container text-on-primary-container font-bold shadow-md'
                        : 'bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable exercise selection list */}
            <div className="flex flex-col gap-sm max-h-[360px] overflow-y-auto pr-1">
              {Object.keys(filteredExercises).length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                  <p className="text-xs text-on-surface-variant font-semibold">No exercises found</p>
                  <p className="text-[10px] text-outline mt-1">Try a different search term or add a custom exercise</p>
                </div>
              ) : (
                Object.entries(filteredExercises).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-2">
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
                      {category}
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {items.map(item => {
                        const isSelected = selectedExercises.some(ex => ex.id === item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleExercise(item, category)}
                            className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'bg-primary-container/10 border-primary-fixed/40 hover:bg-primary-container/15'
                                : 'bg-surface-container-high/40 border-white/5 hover:border-white/10 hover:bg-surface-container-high/60'
                            }`}
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className={`font-semibold text-xs transition-colors ${isSelected ? 'text-primary' : 'text-white'}`}>
                                {item.name}
                              </span>
                              <span className="text-[9px] text-on-surface-variant flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  category === 'Chest' ? 'bg-red-400' :
                                  category === 'Back' ? 'bg-emerald-400' :
                                  category === 'Legs' ? 'bg-blue-400' : 'bg-purple-400'
                                }`}></span>
                                {category}
                              </span>
                            </div>
                            
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-300 ${
                              isSelected
                                ? 'bg-primary-fixed border-primary-fixed text-on-primary-fixed shadow-md'
                                : 'border-white/20 text-transparent'
                            }`}>
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Routine Configuration, Setup Form & Save Routine (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-md">
          <form onSubmit={handleSave} className="glass-card p-lg rounded-2xl border border-white/5 flex flex-col gap-lg h-full">
            
            {/* Form Top Section: Name Input & Counters */}
            <div className="flex flex-col gap-md border-b border-white/5 pb-md">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
                  Routine Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Push Hypertrophy, Legs & Core Focus"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className="w-full h-12 bg-surface-container-low border border-white/10 rounded-xl px-4 text-sm text-primary-fixed focus:outline-none focus:border-primary-fixed transition-colors font-semibold placeholder:text-outline-variant placeholder:font-normal"
                  required
                />
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap gap-sm">
                <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-primary-fixed" />
                  <span className="text-[11px] font-semibold text-white/90">
                    {selectedExercises.length} {selectedExercises.length === 1 ? 'Exercise' : 'Exercises'}
                  </span>
                </div>
                <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-[11px] font-semibold text-white/90">
                    {selectedExercises.reduce((sum, ex) => sum + ex.sets, 0)} Total Sets
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Exercises Details List */}
            <div className="flex-grow flex flex-col gap-md">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
                Customize Sets, Reps & Weights
              </h4>

              <div className="flex flex-col gap-md max-h-[460px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {selectedExercises.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-xl px-md"
                    >
                      <div className="w-14 h-14 bg-surface-container/60 rounded-full flex items-center justify-center mb-md border border-white/5 shadow-inner">
                        <Dumbbell className="h-6 w-6 text-on-surface-variant" />
                      </div>
                      <p className="text-xs text-on-surface-variant font-bold">Your routine is empty</p>
                      <p className="text-[10px] text-outline mt-1 max-w-[280px]">
                        Select exercises from the library on the left to start building your custom routine.
                      </p>
                    </motion.div>
                  ) : (
                    selectedExercises.map((ex, idx) => (
                      <motion.div
                        key={ex.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="bg-surface-container-low/40 border border-white/10 rounded-xl p-md flex flex-col gap-md hover:border-white/15 transition-all relative overflow-hidden"
                      >
                        {/* Upper Details row */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white font-mono bg-white/5 w-5 h-5 rounded flex items-center justify-center border border-white/10 shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-xs text-primary leading-snug">
                              {ex.name}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getCategoryBadgeClass(ex.category)}`}>
                              {ex.category}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => toggleExercise(ex, ex.category)}
                            className="text-on-surface-variant hover:text-red-400 p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                            title="Remove exercise"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Interactive adjustment control row */}
                        <div className="grid grid-cols-3 gap-md bg-background/50 border border-white/5 rounded-xl p-sm">
                          {/* Sets Controls */}
                          <div className="flex flex-col items-center gap-1.5">
                            <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                              Sets
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => adjustField(ex.id, 'sets', -1)}
                                className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-90 transition-all cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-bold text-xs text-white min-w-[16px] text-center">
                                {ex.sets}
                              </span>
                              <button
                                type="button"
                                onClick={() => adjustField(ex.id, 'sets', 1)}
                                className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-90 transition-all cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Reps Controls */}
                          <div className="flex flex-col items-center gap-1.5">
                            <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                              Reps
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => adjustField(ex.id, 'reps', -1)}
                                className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-90 transition-all cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-bold text-xs text-white min-w-[16px] text-center">
                                {ex.reps}
                              </span>
                              <button
                                type="button"
                                onClick={() => adjustField(ex.id, 'reps', 1)}
                                className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-90 transition-all cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Weight Controls */}
                          <div className="flex flex-col items-center gap-1 border-l border-white/5 pl-sm">
                            <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                              Weight (kg)
                            </label>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => adjustWeight(ex.id, -2.5)}
                                className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                                title="-2.5 kg"
                              >
                                <Minus className="h-2.5 w-2.5" />
                              </button>
                              
                              <input
                                type="number"
                                step="0.5"
                                value={ex.weight}
                                onChange={(e) => handleWeightChange(ex.id, e.target.value)}
                                className="w-14 h-6 bg-surface-container-low border border-white/10 rounded text-center text-xs font-bold text-primary-fixed focus:outline-none focus:border-primary-fixed"
                              />

                              <button
                                type="button"
                                onClick={() => adjustWeight(ex.id, 2.5)}
                                className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                                title="+2.5 kg"
                              >
                                <Plus className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Actions section */}
            <div className="flex justify-between items-center gap-md border-t border-white/5 pt-lg mt-auto">
              <button
                type="button"
                onClick={handleReset}
                disabled={selectedExercises.length === 0 && !routineName}
                className="h-12 px-5 bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>

              <button
                type="submit"
                disabled={!routineName.trim() || selectedExercises.length === 0 || isSavedSuccessfully}
                className="h-12 px-6 flex-grow bg-primary-fixed text-on-primary-fixed hover:bg-white disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-bold transition-all duration-300 shadow-[0_8px_20px_rgba(195,244,0,0.15)] flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
              >
                {isSavedSuccessfully ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Saved!</span>
                  </motion.div>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Routine</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
