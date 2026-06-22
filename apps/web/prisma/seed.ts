import { Difficulty, ExerciseCategory } from '@prisma/client'
import prisma from '../src/lib/db'

const exercises = [
  {
    name: 'Push-up',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Chest, Triceps, Shoulders',
    equipment: 'None',
    instructions: 'Start in a plank position. Lower your body until your chest nearly touches the floor. Push back up.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Squat',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Quads, Glutes, Hamstrings',
    equipment: 'None',
    instructions: 'Stand with feet shoulder-width apart. Lower your hips as if sitting in a chair. Keep your chest up.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Pull-up',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Back, Biceps',
    equipment: 'Pull-up Bar',
    instructions: 'Hang from a bar with an overhand grip. Pull your body up until your chin is over the bar.',
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: 'Deadlift',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Back, Legs, Core',
    equipment: 'Barbell',
    instructions: 'Lift a loaded barbell off the ground to the level of the hips, then lower it back to the ground.',
    difficulty: Difficulty.ADVANCED,
  },
  {
    name: 'Running',
    category: ExerciseCategory.CARDIO,
    muscleGroups: 'Legs, Heart',
    equipment: 'None',
    instructions: 'Run at a steady pace.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Plank',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Core',
    equipment: 'None',
    instructions: 'Hold a push-up position but with your weight on your forearms.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Barbell Bench Press',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Chest, Triceps, Shoulders',
    equipment: 'Barbell, Bench',
    instructions: 'Lie on a flat bench. Grip the barbell at shoulder width. Lower to your chest, then press up.',
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: 'Dumbbell Row',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Back, Biceps',
    equipment: 'Dumbbell',
    instructions: 'Place one knee and hand on a bench. Pull a dumbbell to your hip, squeezing your back.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Overhead Press',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Shoulders, Triceps',
    equipment: 'Barbell or Dumbbell',
    instructions: 'Press the weight from shoulder height to full extension overhead.',
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: 'Barbell Row',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Back, Biceps',
    equipment: 'Barbell',
    instructions: 'Hinge at the hips, pull the barbell to your lower ribcage.',
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: 'Lunges',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Quads, Glutes, Hamstrings',
    equipment: 'None',
    instructions: 'Step forward and lower your back knee toward the ground. Push through the front heel to return.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Dumbbell Curl',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Biceps',
    equipment: 'Dumbbell',
    instructions: 'Curl the dumbbells toward your shoulders, keeping elbows fixed at your sides.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Tricep Pushdown',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Triceps',
    equipment: 'Cable Machine',
    instructions: 'Push the cable attachment down until arms are fully extended.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Leg Press',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Quads, Glutes, Hamstrings',
    equipment: 'Leg Press Machine',
    instructions: 'Press the platform away using your legs, then return slowly.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Lat Pulldown',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Back, Biceps',
    equipment: 'Cable Machine',
    instructions: 'Pull the bar down to your upper chest, squeeze your shoulder blades.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Dumbbell Shoulder Fly',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Shoulders',
    equipment: 'Dumbbell',
    instructions: 'Raise dumbbells to your sides until parallel with the ground.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Cable Fly',
    category: ExerciseCategory.STRENGTH,
    muscleGroups: 'Chest',
    equipment: 'Cable Machine',
    instructions: 'Bring your hands together in front of your chest in a hugging motion.',
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: 'Cycling',
    category: ExerciseCategory.CARDIO,
    muscleGroups: 'Legs, Heart',
    equipment: 'Stationary Bike',
    instructions: 'Pedal at a steady pace. Maintain consistent resistance.',
    difficulty: Difficulty.BEGINNER,
  },
  {
    name: 'Jump Rope',
    category: ExerciseCategory.CARDIO,
    muscleGroups: 'Legs, Heart, Shoulders',
    equipment: 'Jump Rope',
    instructions: 'Jump rope at a steady pace for the prescribed duration.',
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    name: 'Yoga Flow',
    category: ExerciseCategory.FLEXIBILITY,
    muscleGroups: 'Full Body',
    equipment: 'Mat',
    instructions: 'Flow through a sequence of yoga poses, focusing on breath and mobility.',
    difficulty: Difficulty.BEGINNER,
  },
]

async function main() {
  console.log('Start seeding...')

  for (const ex of exercises) {
    const existing = await prisma.exercise.findUnique({
      where: { name: ex.name },
    })
    if (!existing) {
      await prisma.exercise.create({ data: ex })
      console.log(`  Created exercise: ${ex.name}`)
    } else {
      console.log(`  Skipped existing exercise: ${ex.name}`)
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
