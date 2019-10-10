import { Schema } from 'mongoose';

export const PersonSchema = new Schema({
    name: String,
    band: String
});

export const BandSchema = new Schema({
    name: String
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

