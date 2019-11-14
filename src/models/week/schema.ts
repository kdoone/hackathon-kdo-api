import { Schema, Document, Model } from 'mongoose';
import { Response } from 'express';

const { ObjectId } = Schema.Types;

export interface WeekDocument extends Document {
    week: any;
    month: number;
    user: string;
    setWeek(seconds: number, currentDate: string, res: Response): void;
    setMonth(): void;
}

interface Time {
    hour: number; minut: number;
}

export interface WeekModel extends Model<WeekDocument> {
    secondsToHms(seconds: number): Time;
    currentDate(): string;
    totalActivity(arr: Array<any>): { hour: number; minut: number };
}

export const WeekSchema = new Schema({
    week: [{ date: String, hour: Number, minut: Number }],
    month: Number,
    user: { type: ObjectId, ref: 'User' }
}, { timestamps: true });

const secondsToHms = (d: number): Time => {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);

    return {
        hour: h,
        minut: m
    };
};

WeekSchema.statics.secondsToHms = (d: number) => secondsToHms(d);
WeekSchema.statics.currentDate = () => new Date().toISOString().slice(0, 10);
WeekSchema.statics.totalActivity = (arr: Array<any>): { hour: number; minut: number } => {
    const total = arr.reduce((prev: any, cur: any) => {
        return {
            hour: prev.hour + cur.hour,
            minut: prev.minut + cur.minut
        };
    }, { hour: 0, minut: 0 });
    total.total = (total.hour * 60) + total.minut;
    return total;
};

WeekSchema.methods.setWeek = function (seconds: number, currentDate: string): void {
    const curr = new Date;
    const week = [];

    for (let i = 1; i <= 7; i++) {
        const first = curr.getDate() - curr.getDay() + i;
        const date = new Date(curr.setDate(first)).toISOString().slice(0, 10);

        let initialObject: Time = {
            hour: 0,
            minut: 0
        };

        if (date === currentDate) {
            initialObject = secondsToHms(seconds);
        }

        week.push({ date, ...initialObject });
    }

    this.week = week;
};

WeekSchema.methods.setMonth = function (): void {
    this.month = new Date().getMonth() + 1;
};

