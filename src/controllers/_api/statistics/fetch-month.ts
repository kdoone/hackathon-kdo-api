import { Response, NextFunction } from 'express';
import { User } from '../../../models';
import { getCurrentDate } from '../../../util';

export const fetchMonth = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const { monthStatistics } = await User.findById(myUserId, 'monthStatistics').populate({ path: 'monthStatistics', select: '-user' }).lean();
        const currentDate = getCurrentDate();

        if (!monthStatistics) {
            return res.json(false);
        }

        const idx = monthStatistics.findIndex(({ month }: any) => month.find(({ date }: any) => date === currentDate));

        const transformDate = (date: string) => {
            const [year, month, day] = date.split('-');
            const formattedDate = `${month}/${day}/${year}`;
            return formattedDate;
        };

        const mapMonthStatistics = monthStatistics.slice().map((item: any) => {
            const newMonth = item.month.slice().map(({ date, total }: any) => [transformDate(date), total]);
            const totalOfNewMonth = newMonth.reduce((prev: any, cur: any) => {
                const [date, record] = cur;
                return prev + record;
            }, 0);

            return { ...item, month: newMonth, total: totalOfNewMonth };
        });

        if (idx === -1) {
            return res.json(false);
        }

        res.json({
            currentMonth: mapMonthStatistics[idx].month,
            allMonth: mapMonthStatistics.slice(idx).map((item: any) => ({ ...item, month: item.total }))
        });

    }
    catch (err) {
        next(err);
    }
};