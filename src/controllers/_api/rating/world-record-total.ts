import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types';
import { worldRecordTotalService } from '../../../services';

export const worldRecordTotal = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {

        const { worldRecords, myWorldRecord } = await worldRecordTotalService(req.user);

        res.json({
            status: 'accepted',
            myRecord: myWorldRecord,
            records: worldRecords
        });
    }
    catch (err) {
        next(err);
    }


};