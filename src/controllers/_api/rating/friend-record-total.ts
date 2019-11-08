import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { friendRecordTotalService } from '../../../services';

export const friendRecordTotal = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {

        const { friendRecords } = await friendRecordTotalService(req.user);

        res.json({
            status: 'accepted',
            records: friendRecords
        });

    }
    catch (err) {
        next(err);
    }

};