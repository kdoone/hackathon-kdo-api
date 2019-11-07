import { Response, NextFunction } from 'express';
import { User } from '../models';

export const getAchievementsMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const { records } = await User.findById(myUserId).populate('records');

        let achievements: any = {
            fastHand: false,
            goodMemory: false,
            attentiveness: false,
            bronze: false,
            silver: false,
            gold: false,
            platinum: false
        };

        if (records.shulteTable >= 15000) { achievements.fastHand = true; }
        if (records.rememberNumber >= 1900 || records.rememberWords >= 1900 || records.memorySquare >= 5000) { achievements.goodMemory = true; }
        if (records.coloredWords >= 2000) { achievements.attentiveness = true; }

        const { totalRecord } = req.myWorldRecord;

        if (totalRecord >= 0) { req.league = 'bronze'; req.star = 1; }
        if (totalRecord >= 10000) { req.star = 2; }
        if (totalRecord >= 15000) { req.star = 3; }

        if (totalRecord >= 20000) { req.league = 'silver'; achievements.bronze = true; req.star = 1; }
        if (totalRecord >= 25000) { req.star = 2; }
        if (totalRecord >= 30000) { req.star = 3; }

        if (totalRecord >= 40000) { req.league = 'gold'; achievements.silver = true; req.star = 1; }
        if (totalRecord >= 45000) { req.star = 2; }
        if (totalRecord >= 50000) { req.star = 3; }

        if (totalRecord >= 60000) { req.league = 'platinum'; achievements.gold = true; req.star = 1; }
        if (totalRecord >= 65000) { req.star = 2; }
        if (totalRecord >= 70000) { req.star = 3; }

        if (totalRecord >= 80000) { achievements.platinum = true; }

        const achievementsArr = Object.keys(achievements).map(item => ({
            name: item,
            verity: achievements[item]
        }));

        req.achievements = achievementsArr;

        next();


    }
    catch (err) {
        next(err);
    }
};