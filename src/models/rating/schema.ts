import { Schema, Document } from 'mongoose';
const { ObjectId } = Schema.Types;

export interface RatingDocument extends Document {
    game: string;
    user: string;
    shulteTable: number;
    rememberNumber: number;
    findNumber: number;
    calculation: number;
    equation: number;
    shulteLetters: number;
    rememberWords: number;
}

export const RatingSchema = new Schema({
    user: { type: ObjectId, ref: 'User' },
    shulteTable: {
        type: Number,
        default: 0
    },
    rememberNumber: {
        type: Number,
        default: 0
    },
    findNumber: {
        type: Number,
        default: 0
    },
    calculation: {
        type: Number,
        default: 0
    },
    equation: {
        type: Number,
        default: 0
    },
    shulteLetters: {
        type: Number,
        default: 0
    },
    rememberWords: {
        type: Number,
        default: 0
    },
    memorySquare: {
        type: Number,
        default: 0
    },
    coloredFigures: {
        type: Number,
        default: 0
    },
    coloredWords: {
        type: Number,
        default: 0
    }
});
