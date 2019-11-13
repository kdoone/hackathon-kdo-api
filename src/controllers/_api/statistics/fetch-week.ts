import { Response, Request, NextFunction } from 'express';
import { Week } from '../../../models';

export const fetchWeek = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentDate = Week.currentDate();

        const allWeeks = await Week.find({}, 'week').populate('weekStatistics').lean();

        const idx = allWeeks.findIndex(({ week }: any) => week.find(({ date }: any) => date === currentDate));

        const { totalActivity } = Week;

        if (idx === -1) {
            return res.json(false);
        }

        if (idx === 0) {
            return res.json({
                prev: false,
                cur: totalActivity(allWeeks[0].week),
                week: allWeeks[0].week,
            });
        }

        return res.json({
            prev: totalActivity(allWeeks[idx - 1].week),
            cur: totalActivity(allWeeks[idx].week),
            week: allWeeks[0].week,
        });

    }
    catch (err) {
        next(err);
    }
};