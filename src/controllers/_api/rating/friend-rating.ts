import { Response, NextFunction } from 'express';
import { Rating, User } from '../../../models';
import { ReqWithPayload } from '../../../types/req-with-payload';

export const getFriendRating = async (req: ReqWithPayload, res: Response, next: NextFunction) => {

    try {
        const { id: myUserId } = req.payload;

        const getAllFriends: any = await User.findById(myUserId, 'friends')
            .populate({
                path: 'friends',
                select: 'recipient',
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
            const { recipient } = item.toObject();
            // Магия, выпиливаем records из объекта      
            const { records, ...withoutRecords } = recipient;

            if (!recipient.records.length) {
                return {
                    ...withoutRecords,
                    totalRecord: 0
                };
            }

            const totalRecord: number = recipient.records.reduce((prev: any, cur: any): number => {
                const { record: prevRecord = 0 } = prev;
                const { record: curRecord = 0 } = cur;

                return prevRecord + curRecord;
            }, 0);

            return {
                ...withoutRecords,
                totalRecord
            };
        });

        res.json(arr);
    }
    catch (err) {
        next(err);
    }

};