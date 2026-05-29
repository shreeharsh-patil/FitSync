import "dotenv/config"
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
]

async function main() {
  console.log('Start seeding...')
  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { name: ex.name },
      update: {},
      create: ex,
    })
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
