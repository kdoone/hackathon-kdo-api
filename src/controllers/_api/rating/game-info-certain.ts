import { Response, NextFunction } from 'express';
import { Rating } from '../../../models';

export const gameInfoCertain = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { game: gameName } = req.body;

        const { [gameName]: record }: any = await Rating.findOne({ user: myUserId }, gameName);

        res.json({
            game: gameName,
            gameName: res.__(gameName),
            record,
            worldRecords: req.worldRecords,
            myWorldRecord: req.myWorldRecord,
            friendRecords: req.friendRecords
        });

    }
    catch (err) {
        next(err);
    }
};