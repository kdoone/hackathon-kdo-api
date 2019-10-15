import { Schema, Document } from 'mongoose';
const { ObjectId } = Schema.Types;

export interface RatingDocument extends Document {
    game: string;
    record: number;
    user: any;
}

export const RatingSchema = new Schema({
    game: String,
    record: Number,
    user: { type: ObjectId, ref: 'User' }
});
