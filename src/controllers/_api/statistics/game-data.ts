import { Response, NextFunction } from 'express';
import { User } from '../../../models';

export const fetchGameData = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const { records } = await User.findById(myUserId, 'records').populate({ path: 'records', select: '-_id -__v -user -email' }).lean();

        const recordsNumber = Object.keys(records).map((item: any) => records[item]);
        const recordsString = Object.keys(records).map((item: any) => res.__(item));

        res.json({
            names: recordsString,
            records: recordsNumber
        });
    }
    catch (err) {
        next(err);
    }
};