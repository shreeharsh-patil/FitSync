import mongoose, { Schema, Document, Model } from "mongoose";

export interface INutrition extends Document {
  userId: mongoose.Types.ObjectId;
  logDate: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foodItems: {
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterMl: number;
  notes?: string;
  createdAt: Date;
}

const NutritionSchema = new Schema<INutrition>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    logDate: { type: Date, default: Date.now },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    foodItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: "g" },
        calories: { type: Number, required: true },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
      },
    ],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    waterMl: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Nutrition: Model<INutrition> =
  mongoose.models.Nutrition ?? mongoose.model<INutrition>("Nutrition", NutritionSchema);
