import mongoose, { Document } from "mongoose";
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
    bio?: string;
    isPublic: boolean;
    xp: number;
    level: number;
    streak: number;
    longestStreak: number;
    integrations: {
        appleHealth: boolean;
        googleFit: boolean;
        fitbit: boolean;
        strava: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=User.d.ts.map