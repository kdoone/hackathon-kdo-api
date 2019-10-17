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

        interface Records {
            _id: string;
            game: string;
            // user is object id
            user: string;
            record: number;
        }

        interface ItemOfArrTotal {
            records: Records[];
            username: string;
            email: string;
        }

        interface ArrToTotal {
            _id?: string;
            username: string;
            email: string;
            totalRecord: number;
        }

        const arrToTotal = arrCopy.map((item: ItemOfArrTotal): ArrToTotal => {
            // Документ в объект                        
            // Убираем records
            const { records, ...withoutRecords } = item;

            if (!records.length) {
                return {
                    ...withoutRecords,
                    totalRecord: 0
                };
            }

            // Нужно превратить records в один рекорд сложив все значения
            const totalRecord: any = records.reduce((prev: number, cur: any) => {
                const { record: curRecord = 0 } = cur;

                return prev + curRecord;
            }, 0);

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