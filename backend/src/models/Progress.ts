import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  logDate: Date;
  weight?: number;
  bodyFatPct?: number;
  measurements?: { chest?: number; waist?: number; hips?: number; arms?: number; thighs?: number };
  photoUrl?: string;
  notes?: string;
  createdAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    logDate: { type: Date, default: Date.now },
    weight: { type: Number },
    bodyFatPct: { type: Number },
    measurements: { chest: { type: Number }, waist: { type: Number }, hips: { type: Number }, arms: { type: Number }, thighs: { type: Number } },
    photoUrl: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Progress = mongoose.model<IProgress>("Progress", ProgressSchema);
