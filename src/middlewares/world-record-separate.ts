import { Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { User } from '../models';
import { cleanUnnecessary } from '../util';

export const separateWorldRecordMiddlewareValidate = [
    check('game')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'game is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' })
];

export const separateWorldRecordMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {

        const { game: gameName } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

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

        req.worldRecords = arrTotal;

        next();
    }
    catch (err) {
        next(err);
    }


};