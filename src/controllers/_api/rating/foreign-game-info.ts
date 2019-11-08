import { Response, NextFunction } from 'express';
import { User } from '../../../models';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';
import { achievementsService } from '../../../services';

export const foreignGameInfoValidate = [
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

export const foreignGameInfo = async (req: any, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const { username, totalRecord } = req.body;

        const { uid, _id } = await User.findOne({ username });
        const { league, star, achievements } = await achievementsService(_id, totalRecord);

        res.json({
            star,
            league,
            username,
            uid,
            achievements
        });
    }
    catch (err) {
        next(err);
    }
};