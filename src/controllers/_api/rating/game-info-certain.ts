import { Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';
import { Rating } from '../../../models';

export const gameInfoCertainValidate = [
    check('game')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'game is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' })
];
export const gameInfoCertain = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { game: gameName } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const { [gameName]: record }: any = await Rating.findOne({ user: myUserId }, gameName);

        res.json({
            game: gameName,
            record,
            worldRecords: req.worldRecords,
            friendRecords: req.friendRecords
        });

    }
    catch (err) {
        next(err);
    }
};