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

        let prevTotal = 0, currentTotal = 0;

        if (mapMonthStatistics[idx - 1]) {
            const [dat, prevTotalSlice] = mapMonthStatistics[idx - 1].month[0];
            prevTotal = prevTotalSlice;
        }

        const allMonth = mapMonthStatistics.slice(idx).map((item: any) => {
            const [date, record] = item.month[0];

            currentTotal = item.total;

            return [date, item.total];
        });


        res.json({
            currentMonth: mapMonthStatistics[idx].month,
            allMonth,
            prevTotal,
            currentTotal
        });

    }
    catch (err) {
        next(err);
    }
};