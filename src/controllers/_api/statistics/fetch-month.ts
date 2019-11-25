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

        const sixMonth = Array(6).fill(null).map((item: any, index: number) => {
            const arrMonth = transformDate(currentDate);
            const [month, date, year] = arrMonth.split('/');
            let monthToStat: any = Number(month) - index;

            if (monthToStat > 12) {
                const count = monthToStat - 12;
                if (count >= 10 && count <= 12) {
                    monthToStat = count;
                    return;
                }

                monthToStat = `0${count}`;
            } else if (monthToStat < 10) {
                monthToStat = `0${monthToStat}`;
            }

            const formatted = `${monthToStat}/${year}`;

            if (allMonth[index - idx]) {
                const [date, record] = allMonth[index - idx];

                return [formatted, record];
            }

            return [formatted, 0];
        }).reverse();

        const twelveMonth = Array(12).fill(null).map((item: any, index: number) => {
            const arrMonth = transformDate(currentDate);
            const [month, date, year] = arrMonth.split('/');
            let monthToStat: any = index + 1;

            if (monthToStat < 10) {
                monthToStat = `0${monthToStat}`;
            }

            const formatted = `${monthToStat}/${year}`;

            if (allMonth[index]) {
                const [date, record] = allMonth[index];

                return [formatted, record];
            }

            return [formatted, 0];
        });

        res.json({
            currentMonth: mapMonthStatistics[idx].month,
            sixMonth,
            twelveMonth,
            prevTotal,
            currentTotal
        });

    }
    catch (err) {
        next(err);
    }
};