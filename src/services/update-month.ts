import { Response } from 'express';
import { Month, User } from '../models';
import { getCurrentDate } from '../util';

export const updateMonth = async (req: any, res: Response, total: number) => {

    const { id: myUserId } = req.user;

    const currentDate = getCurrentDate();
    const monthExists = await Month.exists({ 'month.date': currentDate });

    if (monthExists) {
        await Month.findOneAndUpdate({ 'month.date': currentDate, user: myUserId }, { $inc: { 'month.$.total': total } });
    } else {
        const month = new Month({ user: myUserId });
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        month.setMonth(currentMonth, currentYear, currentDate, total);

        await month.save();
        await User.findByIdAndUpdate(myUserId, { $addToSet: { monthStatistics: month._id } }, { upsert: true });
    }
};