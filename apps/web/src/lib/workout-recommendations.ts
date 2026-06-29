export interface WorkoutLogSummary {
  exerciseName: string;
  sets: { reps: number; weight: number; restSec: number }[];
  logDate: Date;
}

export interface WorkoutRecommendation {
  exerciseName: string;
  suggestedWeight: number;
  suggestedSets: number;
  suggestedReps: string;
  progressionType: "double_progression" | "linear" | "deload" | "maintenance";
  reason: string;
  substitution?: string;
}

export interface RecommendationsResult {
  recommendations: WorkoutRecommendation[];
  deloadRecommended: boolean;
  deloadReason?: string;
  fatigueScore: number;
  recoveryStatus: "fresh" | "moderate" | "fatigued" | "overtrained";
}

function calculateEstimatedMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

function calculateFatigueScore(recentLogs: WorkoutLogSummary[]): number {
  if (recentLogs.length === 0) return 0;

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

  const last7Days = recentLogs.filter((l) => new Date(l.logDate).getTime() > sevenDaysAgo);
  const last14Days = recentLogs.filter(
    (l) => new Date(l.logDate).getTime() > fourteenDaysAgo && new Date(l.logDate).getTime() <= sevenDaysAgo
  );

  const recentVolume = last7Days.reduce((sum, log) => {
    return sum + log.sets.reduce((s, set) => s + set.reps * set.weight, 0);
  }, 0);

  const previousVolume = last14Days.reduce((sum, log) => {
    return sum + log.sets.reduce((s, set) => s + set.reps * set.weight, 0);
  }, 0);

  const sessionCount = last7Days.length;

  let fatigue = 0;
  fatigue += Math.min(50, recentVolume / 1000);
  fatigue += sessionCount * 5;
  if (previousVolume > 0 && recentVolume > previousVolume * 1.2) {
    fatigue += 10;
  }

  return Math.min(100, fatigue);
}

function getRecoveryStatus(fatigueScore: number): RecommendationsResult["recoveryStatus"] {
  if (fatigueScore < 25) return "fresh";
  if (fatigueScore < 50) return "moderate";
  if (fatigueScore < 75) return "fatigued";
  return "overtrained";
}

const EXERCISE_SUBSTITUTIONS: Record<string, string[]> = {
  "Barbell Bench Press": ["Dumbbell Bench Press", "Push-up", "Machine Chest Press"],
  "Barbell Squat": ["Goblet Squat", "Leg Press", "Bulgarian Split Squat"],
  "Barbell Deadlift": ["Romanian Deadlift", "Trap Bar Deadlift", "Hyperextension"],
  "Pull-up": ["Lat Pulldown", "Inverted Row", "Seated Cable Row"],
  "Overhead Press": ["Dumbbell Shoulder Press", "Arnold Press", "Machine Shoulder Press"],
  "Barbell Row": ["Dumbbell Row", "T-Bar Row", "Cable Row"],
};

function getExerciseProgression(
  exerciseName: string,
  recentSets: { reps: number; weight: number }[]
): { suggestedWeight: number; progressionType: WorkoutRecommendation["progressionType"]; reason: string } {
  if (recentSets.length === 0) {
    return {
      suggestedWeight: 20,
      progressionType: "linear",
      reason: "No previous data — start with a manageable weight and progress linearly.",
    };
  }

  const bestSet = recentSets.reduce((best, s) => (s.weight > best.weight ? s : best));
  const avgReps = recentSets.reduce((s, set) => s + set.reps, 0) / recentSets.length;
  const e1rm = calculateEstimatedMax(bestSet.weight, bestSet.reps);

  if (avgReps >= 12 && bestSet.weight > 0) {
    return {
      suggestedWeight: Math.round((bestSet.weight * 1.05) / 2.5) * 2.5,
      progressionType: "linear",
      reason: `You hit ${Math.round(avgReps)} reps on average — increase weight by 5%.`,
    };
  }

  if (avgReps >= 8) {
    return {
      suggestedWeight: bestSet.weight,
      progressionType: "double_progression",
      reason: `Hit ${Math.round(avgReps)} reps — stay at this weight and push to 12 reps before increasing.`,
    };
  }

  if (avgReps >= 5) {
    return {
      suggestedWeight: bestSet.weight,
      progressionType: "double_progression",
      reason: `Building strength at ${Math.round(avgReps)} reps — continue adding reps until you reach 8.`,
    };
  }

  return {
    suggestedWeight: bestSet.weight - 5,
    progressionType: "maintenance",
    reason: "Reps are low — consider reducing weight slightly to focus on form and volume accumulation.",
  };
}

function findSubstitution(exerciseName: string): string | undefined {
  for (const [key, subs] of Object.entries(EXERCISE_SUBSTITUTIONS)) {
    if (exerciseName.toLowerCase().includes(key.toLowerCase())) {
      return subs[0];
    }
  }
  return undefined;
}

export function getWorkoutRecommendations(
  recentLogs: WorkoutLogSummary[],
  availableEquipment?: string[]
): RecommendationsResult {
  const fatigueScore = calculateFatigueScore(recentLogs);
  const recoveryStatus = getRecoveryStatus(fatigueScore);
  const deloadRecommended = fatigueScore >= 65;

  const exerciseGroups = new Map<string, { reps: number; weight: number }[]>();

  for (const log of recentLogs) {
    const key = log.exerciseName;
    if (!exerciseGroups.has(key)) {
      exerciseGroups.set(key, []);
    }
    for (const set of log.sets) {
      exerciseGroups.get(key)!.push({ reps: set.reps, weight: set.weight });
    }
  }

  const recommendations: WorkoutRecommendation[] = [];

  if (deloadRecommended) {
    for (const [exerciseName] of exerciseGroups) {
      recommendations.push({
        exerciseName,
        suggestedWeight: 0,
        suggestedSets: 3,
        suggestedReps: "10-12",
        progressionType: "deload",
        reason: "Elevated fatigue detected — reduce intensity by 40-50% this week.",
        substitution: findSubstitution(exerciseName),
      });
    }

    return {
      recommendations,
      deloadRecommended: true,
      deloadReason: `Your fatigue score is ${fatigueScore.toFixed(0)}/100. Take a deload week: reduce weights by 50% and keep volume low to supercompensate.`,
      fatigueScore,
      recoveryStatus,
    };
  }

  for (const [exerciseName, sets] of exerciseGroups) {
    const progression = getExerciseProgression(exerciseName, sets);
    const suggestedSets = recoveryStatus === "fresh" ? 4 : recoveryStatus === "moderate" ? 3 : 3;
    const suggestedReps =
      progression.progressionType === "deload"
        ? "10-12"
        : progression.progressionType === "linear"
          ? "8-10"
          : "10-12";

    recommendations.push({
      exerciseName,
      suggestedWeight: progression.suggestedWeight,
      suggestedSets,
      suggestedReps,
      progressionType: progression.progressionType,
      reason: progression.reason,
      substitution: findSubstitution(exerciseName),
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      exerciseName: "Start with a full-body routine",
      suggestedWeight: 20,
      suggestedSets: 3,
      suggestedReps: "10-12",
      progressionType: "linear",
      reason: "No workout history found — begin with conservative weights and focus on form.",
    });
  }

  return {
    recommendations,
    deloadRecommended: false,
    fatigueScore,
    recoveryStatus,
  };
}
