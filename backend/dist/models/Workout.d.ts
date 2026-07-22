import mongoose, { Document } from "mongoose";
export interface IWorkout extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    duration?: number;
    exercises: {
        name: string;
        muscleGroup: string;
        sets: {
            reps: number;
            weight: number;
            restSec: number;
        }[];
        notes?: string;
    }[];
    volume?: number;
    isTemplate: boolean;
    logDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Workout: mongoose.Model<IWorkout, {}, {}, {}, mongoose.Document<unknown, {}, IWorkout, {}, mongoose.DefaultSchemaOptions> & IWorkout & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IWorkout>;
//# sourceMappingURL=Workout.d.ts.map