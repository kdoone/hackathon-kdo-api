import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Friend, User } from '../../../models';

export const getStatusesOutgoing = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.payload;

        const findAllStatuses = await User.findById(myUserId, 'friends')
            .populate({
                path: 'friends',
                match: { status: { '$eq': 1 } },
                populate: {
                    path: 'recipient requester',
                }
            });

        res.json(findAllStatuses);
    }
    catch (err) {
        next(err);
    }
};
