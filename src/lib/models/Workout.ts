import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration?: number;
  exercises: {
    name: string;
    muscleGroup: string;
    sets: { reps: number; weight: number; restSec: number }[];
    notes?: string;
  }[];
  volume?: number;
  isTemplate: boolean;
  logDate: Date;
  startTime?: Date;
  endTime?: Date;
  caloriesBurned?: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSchema = new Schema<IWorkout>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: { type: Number },
    exercises: [
      {
        name: { type: String, required: true },
        muscleGroup: { type: String, required: true },
        sets: [
          {
            reps: { type: Number, required: true },
            weight: { type: Number, default: 0 },
            restSec: { type: Number, default: 60 },
          },
        ],
        notes: { type: String },
      },
    ],
    volume: { type: Number, default: 0 },
    isTemplate: { type: Boolean, default: false },
    logDate: { type: Date, default: Date.now },
    startTime: { type: Date },
    endTime: { type: Date },
    caloriesBurned: { type: Number },
  },
  { timestamps: true }
);

export const Workout: Model<IWorkout> =
  mongoose.models.Workout ?? mongoose.model<IWorkout>("Workout", WorkoutSchema);
