import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types';
import { Rating } from '../../../models';

export const updateRecord = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { localRecords = {} } = req.body;

        const records: any = await Rating.findOne({ user: myUserId }, '-_id -user -__v').lean();

        const updatedRecords: any = {};

        for (const item in records) {
            if (localRecords.hasOwnProperty(item)) {

                if (localRecords[item] > records[item]) {

                    updatedRecords[item] = localRecords[item];
                } else {

                    updatedRecords[item] = records[item];
                }

            } else {
                updatedRecords[item] = records[item];
            }
        }

        await Rating.findOneAndUpdate({ user: myUserId }, { ...updatedRecords });

        res.json({
            prev: records,
            updated: updatedRecords
        });
    }
    catch (err) {
        next(err);
    }
};