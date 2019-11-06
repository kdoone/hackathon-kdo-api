import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { User } from '../../../models';

export const getList = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const recordsDoc: any = await User.findById(myUserId)
            .populate({
                path: 'records',
                select: '-_id -__v -user -email'
            });

        const { records } = recordsDoc.toObject();

        const recordsToArray = Object.keys(records).map((key) => ({
            name: key,
            record: records[key]
        }));

        res.json({
            status: 'accepted',
            records: recordsToArray
        });
    }
    catch (err) {
        next(err);
    }
};