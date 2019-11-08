import { Response, NextFunction } from 'express';
import { User } from '../../../models';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';

export const achievementsMiddleware = [
    check('username')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'username is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'username is empty' })
        .bail()
        .custom(async (value) => {
            const exists = await User.findOne({ username: value });
            if (!exists) { return Promise.reject({ statusCode: 3, message: 'user doesnt exists' }); }
        }),

    check('totalRecord')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'totalRecord is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'totalRecord is empty' })
];

export const achievements = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { username, totalRecord } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const { records, uid } = await User.findOne({ username });

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

        res.json({
            star: req.star,
            league: req.league,
            username,
            uid,
            achievements: achievementsArr
        });


    }
    catch (err) {
        next(err);
    }
};