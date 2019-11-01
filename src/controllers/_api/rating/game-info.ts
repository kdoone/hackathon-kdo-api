import { Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';
import { ReqWithPayload } from '../../../types';
import { Rating, User } from '../../../models';

export const gameInfoValidate = [
    check('game')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'game is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' })
];
export const gameInfo = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { game: gameName } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const { [gameName]: record }: any = await Rating.findOne({ user: myUserId }, gameName);

        const arrTotal = await User.aggregate([
            {
                $lookup: {
                    from: 'ratings',
                    localField: 'records',
                    foreignField: '_id',
                    as: 'records'
                }
            },
            { $unwind: '$records' },
            {
                $group: {
                    _id: '$_id',
                    game: { $first: gameName },
                    record: { $first: `$records.${gameName}` },
                    username: { $first: '$username' }
                }
            },
            { $sort: { record: -1 } }
        ]);

        res.json({
            game: gameName,
            record,
            worldRating: arrTotal
        });

    }
    catch (err) {
        next(err);
    }
};