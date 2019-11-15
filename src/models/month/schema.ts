import { Schema, Document } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface MonthDocument extends Document {
    month: Array<any>;
    user: any;
    setMonth(month: number, year: number, currentDate: string, record: number): void;
}

export const MonthSchema = new Schema({
    month: [{ date: String, total: Number }],
    user: { type: ObjectId, ref: 'User' }
});

MonthSchema.methods.setMonth = function (month: number, year: number, currentDate: string, record: number): void {
    const date = new Date(Date.UTC(year, month, 1));
    const days = [];
    while (date.getMonth() === month) {
        const newDate = new Date(date).toISOString().slice(0, 10);

        let total = 0;

        if (newDate === currentDate) {
            total = record;
        }

        days.push({ date: newDate, total });
        date.setDate(date.getDate() + 1);
    }

    this.month = days;
};
