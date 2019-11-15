import { Response, NextFunction } from 'express';
import { User } from '../../../models';
import { getCurrentDate } from '../../../util';

export const fetchMonth = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const { monthStatistics } = await User.findById(myUserId, 'monthStatistics').populate({ path: 'monthStatistics', select: '-user' }).lean();
        const currentDate = getCurrentDate();

        const idx = monthStatistics.findIndex(({ month }: any) => month.find(({ date }: any) => date === currentDate));

        if (idx === -1) {
            return res.json(false);
        }

        res.json({
            currentMonth: monthStatistics[idx].month,
            allMonth: monthStatistics.slice(idx)
        });

    }
    catch (err) {
        next(err);
    }
};