import mongoose, { Document } from "mongoose";
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
export declare const Nutrition: mongoose.Model<INutrition, {}, {}, {}, mongoose.Document<unknown, {}, INutrition, {}, mongoose.DefaultSchemaOptions> & INutrition & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INutrition>;
//# sourceMappingURL=Nutrition.d.ts.map