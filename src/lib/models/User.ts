import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "trainer" | "admin";
  fitnessGoal?: string;
  activityLevel?: string;
  height?: number;
  weight?: number;
  dateOfBirth?: Date;
  bio?: string;
  isPublic: boolean;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    image: { type: String },
    role: { type: String, enum: ["user", "trainer", "admin"], default: "user" },
    fitnessGoal: { type: String },
    activityLevel: { type: String },
    height: { type: Number },
    weight: { type: Number },
    dateOfBirth: { type: Date },
    bio: { type: String },
    isPublic: { type: Boolean, default: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);
