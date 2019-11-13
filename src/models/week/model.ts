import { model } from 'mongoose';
import { WeekDocument, WeekSchema, WeekModel } from './schema';

export const Week = model<WeekDocument, WeekModel>('Week', WeekSchema, 'weeks');