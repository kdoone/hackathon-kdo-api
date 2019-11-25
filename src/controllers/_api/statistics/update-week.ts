import { Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';
import { Week, User } from '../../../models';
import { ReqWithPayload } from '../../../types';

export const updateWeekValidate = [
    check('seconds')
        .trim()
        .not().isEmpty().withMessage({ statusCode: 1, message: 'minute is empty' })
];

export const updateWeek = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { seconds } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const currentDate = Week.currentDate();

        const { hour, minut } = Week.secondsToHms(seconds);

        const weekExists = await Week.exists({ 'week.date': currentDate });

        if (weekExists) {
            await Week.findOneAndUpdate({ 'week.date': currentDate, user: myUserId }, { $inc: { 'week.$.hour': hour, 'week.$.minut': minut } });
        } else {
            const newWeek = new Week({ user: myUserId });
            newWeek.setWeek(seconds, currentDate, res);
            newWeek.setMonth();

            await newWeek.save();
            await User.findByIdAndUpdate(myUserId, { $addToSet: { weekStatistics: newWeek._id } }, { upsert: true });
        }

        res.json({ status: 'added' });

    }
    catch (err) {
        next(err);
    }
};