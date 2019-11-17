import { Response, NextFunction } from 'express';
import { User } from '../../../models';

export const fetchRadar = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myuserId } = req.user;

        const { records } = await User.findById(myuserId, 'records').populate({ path: 'records', select: '-_id -__v -user -email' });

        const initialObject: any = {
            reaction: records.shulteTable,
            memory: records.rememberNumber + records.rememberWords + records.memorySquare,
            accuracy: records.coloredFigures,
            attention: records.coloredWords,
            logics: records.shulteLetters
        };

        const radarStat = Object.keys(initialObject).map((item: any) => initialObject[item]);

        res.json(radarStat);

    }
    catch (err) {
        next(err);
    }
};