import { Response, NextFunction } from 'express';
import { friendRecordTotalService, worldRecordTotalService, achievementsService } from '../../services';

export const gameInfoTotalInit = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { friendRecords } = await friendRecordTotalService(req.user);
        const { myWorldRecord, worldRecords } = await worldRecordTotalService(req.user);
        const { achievements, league, star } = await achievementsService(req.user.id, myWorldRecord.totalRecord);

        req.friendRecords = friendRecords;
        req.myWorldRecord = myWorldRecord;
        req.worldRecords = worldRecords;
        req.achievements = achievements;
        req.league = league;
        req.star = star;

        next();
    }
    catch (err) {
        next(err);
    }
};