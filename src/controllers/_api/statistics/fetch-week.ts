import { Response, Request, NextFunction } from 'express';
import { Week } from '../../../models';

export const fetchWeek = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentDate = Week.currentDate();

        const allWeeks = await Week.find({}, 'week').populate('weekStatistics').lean();

        const idx = allWeeks.findIndex(({ week }: any) => week.find(({ date }: any) => date === currentDate));

        const { totalActivity } = Week;

        const calculateTotal = (hour: number, minut: number) => {
            const total = (hour * 60) + minut;
            if (total === 0) {
                return 1;
            }

            return total;
        };

        const addTotal = (arr: Array<any>) => arr.map((item: any) => ({ ...item, total: calculateTotal(item.hour, item.minut) }));

        if (idx === -1) {
            return res.json(false);
        }

        if (idx === 0) {
            return res.json({
                prev: false,
                cur: totalActivity(allWeeks[0].week),
                week: addTotal(allWeeks[0].week),
            });
        }

        return res.json({
            prev: totalActivity(allWeeks[idx - 1].week),
            cur: totalActivity(allWeeks[idx].week),
            week: addTotal(allWeeks[0].week),
        });

    }
    catch (err) {
        next(err);
    }
};