import mongoose, { Document } from "mongoose";
export interface IChallenge extends Document {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    participants: {
        userId: mongoose.Types.ObjectId;
        progress: number;
        joinedAt: Date;
    }[];
    rules?: string;
    createdAt: Date;
}
export declare const Challenge: mongoose.Model<IChallenge, {}, {}, {}, mongoose.Document<unknown, {}, IChallenge, {}, mongoose.DefaultSchemaOptions> & IChallenge & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IChallenge>;
//# sourceMappingURL=Challenge.d.ts.map