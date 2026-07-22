import mongoose, { Document } from "mongoose";
export interface IProgress extends Document {
    userId: mongoose.Types.ObjectId;
    logDate: Date;
    weight?: number;
    bodyFatPct?: number;
    measurements?: {
        chest?: number;
        waist?: number;
        hips?: number;
        arms?: number;
        thighs?: number;
    };
    photoUrl?: string;
    notes?: string;
    createdAt: Date;
}
export declare const Progress: mongoose.Model<IProgress, {}, {}, {}, mongoose.Document<unknown, {}, IProgress, {}, mongoose.DefaultSchemaOptions> & IProgress & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProgress>;
//# sourceMappingURL=Progress.d.ts.map