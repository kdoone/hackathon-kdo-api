import { Request, Response, NextFunction } from 'express';
import { User } from '../../../models';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';

export const separateWorldRecordValidate = [
    check('game')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'game is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' })
];

export const separateWorldRecord = async (req: Request, res: Response, next: NextFunction) => {
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

        res.json({
            status: 'accepted',
            records: arrTotal
        });
    }
    catch (err) {
        next(err);
    }


};