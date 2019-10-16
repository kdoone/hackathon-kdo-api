import { Request, Response, NextFunction } from 'express';
import { Rating, User } from '../../../models';

export const getWorldRating = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const arr = await User.aggregate([
            { '$unwind': '$records' },
            {
                '$lookup': {
                    from: 'ratings',
                    localField: 'records',
                    foreignField: '_id',
                    as: 'record_objects'
                }
            },
            { '$unwind': '$record_objects' },
            {
                '$group': {
                    '_id': '$_id',
                    'records': { '$push': '$record_objects' },
                    'username': { '$first': '$username' },
                    'email': { '$first': '$email' },
                }
            }
        ]);

        const arrCopy: any = arr.slice();

        const arrToTotal = arrCopy.map((item: any) => {
            // Документ в объект                        
            // Убираем records
            const { records, ...withoutRecords } = item;

            if (!records.length) {
                return {
                    ...withoutRecords,
                    totalRecord: 0
                };
            }

            if (records.length === 1) {
                return {
                    ...withoutRecords,
                    totalRecord: records[0].record
                };
            }

            // Нужно превратить records в один рекорд сложив все значения
            const totalRecord = records.reduce((prev: any, cur: any) => {
                const { record: prevRecord = 0 } = prev;
                const { record: curRecord = 0 } = cur;

                return prevRecord + curRecord;
            });

            return {
                ...withoutRecords,
                totalRecord
            };
        });
        // Сортируем по totalRecord
        const arrSorted = arrToTotal.sort((a: any, b: any) => a.totalRecord < b.totalRecord);

        res.json(arrSorted);

    }
    catch (err) {
        next(err);
    }


};