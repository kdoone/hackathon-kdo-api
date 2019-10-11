import { Schema, Document } from 'mongoose';
const { ObjectId } = Schema.Types;

export interface RatingDocument extends Document {
    publicId: string;
    record: number;
}

export const RatingSchema = new Schema({
    publicId: { type: ObjectId, ref: 'User' },
    record: Number
});
