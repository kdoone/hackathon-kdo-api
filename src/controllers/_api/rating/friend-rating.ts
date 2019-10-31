import { Response, NextFunction } from 'express';
import { User } from '../../../models';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';

export const getFriendRating = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const getAllFriends: any = await User.findById(myUserId, 'friends')
            .populate({
                path: 'friends',
                select: 'recipient status',
                populate: {
                    path: 'recipient',
                    model: 'User',
                    select: 'records username',
                    populate: {
                        path: 'records',
                        model: 'Rating'
                    }
                }
            });

        let arr = getAllFriends.friends.slice();
        arr = arr.map((item: any) => {
            // ToObject превращает документ в обычный js объект
            const { recipient, status } = item.toObject();
            // Магия, выпиливаем records из объекта      
            const { records, ...withoutRecords } = recipient;

            if (status !== 3) {
                return;
            }

            if (!records.length) {
                return {
                    ...withoutRecords,
                    totalRecord: 0
                };
            }

            const totalRecord: any = records.reduce((prev: number, cur: any) => {
                const { record: curRecord = 0 } = cur;

                return prev + curRecord;
            }, 0);

            return {
                ...withoutRecords,
                totalRecord
            };
        });

        // Так как если френд не в статусе 3 он возвращает null, поэтому мы должны убрать null объекты
        arr = arr.filter((item: any) => item);
        // Сортируем по totalRecord
        const arrSorted = arr.sort((a: any, b: any) => a.totalRecord < b.totalRecord);

        res.json(arrSorted);
    }
    catch (err) {
        next(err);
    }

};