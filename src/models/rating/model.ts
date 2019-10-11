import { model } from 'mongoose';
import { RatingSchema, RatingDocument } from './schema';

export const Rating = model<RatingDocument>('Rating', RatingSchema, 'ratings');