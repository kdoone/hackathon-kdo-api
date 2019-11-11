import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { User } from '../../../models';

export const getList = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const { records }: any = await User.findById(myUserId)
            .populate({
                path: 'records',
                select: '-_id -__v -user -email'
            }).lean();

        const recordsToArray = Object.keys(records).map((key) => ({
            gameName: key,
            name: key,
            record: records[key]
        }));

        const recordsToArrayMultilanguage = recordsToArray.map((item: any) => ({
            ...item,
            name: res.__(item.name)
        }));

        res.json({
            status: 'accepted',
            records: recordsToArrayMultilanguage
        });
    }
    catch (err) {
        next(err);
    }
};