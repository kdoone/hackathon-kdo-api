import { model } from 'mongoose';
import { MonthDocument, MonthSchema } from './schema';

export const Month = model<MonthDocument>('Month', MonthSchema, 'months');