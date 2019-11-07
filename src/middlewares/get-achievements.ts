import { Response, NextFunction } from 'express';
import { User } from '../models';

export const getAchievementsMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const { records } = await User.findById(myUserId);

        let achievements = [];

        if (records.shulteTable >= 15000) {
            achievements.push({ name: 'fastHand', verity: true });
        } else {
            achievements.push({ name: 'fastHand', verity: false });
        }

        if (records.rememberNumber >= 1900 || records.rememberWords >= 1900 || records.memorySquare >= 5000) {
            achievements.push({ name: 'goodMemory', verity: true });
        } else {
            achievements.push({ name: 'goodMemory', verity: false });
        }

        if (records.coloredWords >= 2000) {
            achievements.push({ name: 'attentiveness', verity: true });
        } else {
            achievements.push({ name: 'attentiveness', verity: false });
        }

        req.achievements = achievements;

        next();


    }
    catch (err) {
        next(err);
    }
};