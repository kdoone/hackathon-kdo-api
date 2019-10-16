import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { User } from '../../../models';

export const getStatusesIncoming = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.payload;

        const findAllStatuses: any = await User.findById(myUserId, 'friends')
            .populate({
                path: 'friends',
                match: { status: { '$eq': 2 } },
                populate: {
                    path: 'recipient requester',
                    select: 'username'
                }
            });

        res.json(findAllStatuses.friends);
    }
    catch (err) {
        next(err);
    }
};
