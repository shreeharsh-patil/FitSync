import mongoose, { Schema, Document } from "mongoose";

export interface IChallenge extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participants: { userId: mongoose.Types.ObjectId; progress: number; joinedAt: Date }[];
  rules?: string;
  createdAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [{
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      progress: { type: Number, default: 0 },
      joinedAt: { type: Date, default: Date.now },
    }],
    rules: { type: String },
  },
  { timestamps: true }
);

export const Challenge = mongoose.model<IChallenge>("Challenge", ChallengeSchema);
