import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Friend } from '../../../models';

export const getStatuses = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.payload;

        const findAllStatuses = await Friend.find().populate('recipient requester')
            .or([
                { recipient: myUserId, status: { '$lt': 3 } },
                { requester: myUserId, status: { '$lt': 3 } }
            ]);

        res.json(findAllStatuses);
    }
    catch (err) {
        next(err);
    }
};
