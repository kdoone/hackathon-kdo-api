import { Response, NextFunction } from 'express';

export const gameInfoTotal = async (req: any, res: Response, next: NextFunction) => {
    try {

        res.json({
            league: req.league,
            star: req.star,
            achievements: req.achievements,
            worldRecords: req.worldRecords,
            myWorldRecord: req.myWorldRecord,
            friendRecords: req.friendRecords,
        });

    }
    catch (err) {
        next(err);
    }
};