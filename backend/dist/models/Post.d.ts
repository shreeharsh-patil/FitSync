import mongoose, { Document } from "mongoose";
export interface IPost extends Document {
    userId: mongoose.Types.ObjectId;
    content: string;
    likes: number;
    likedBy: mongoose.Types.ObjectId[];
    comments: {
        userId: mongoose.Types.ObjectId;
        content: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Post: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}, mongoose.DefaultSchemaOptions> & IPost & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPost>;
//# sourceMappingURL=Post.d.ts.map