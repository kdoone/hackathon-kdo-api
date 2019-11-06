import { Response, NextFunction } from 'express';
import { User } from '../../../models';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { validationResult, check } from 'express-validator';
import { cleanUnnecessary } from '../../../util';
import { Types } from 'mongoose';

const { ObjectId } = Types;
export const getFriendRatingValidate = [
    check('game')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'game is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' })
];
export const getFriendRating = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const { game: gameName } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const aggregated = await User.aggregate([
            { $match: { _id: ObjectId(myUserId) } },
            {
                $group: {
                    _id: '$_id',
                    friends: { $first: '$friends' }
                }
            },
            {
                $unwind: '$friends'
            },
            {
                $lookup: {
                    from: 'friends',
                    localField: 'friends',
                    foreignField: '_id',
                    as: 'friends'
                }
            },
            { $unwind: '$friends' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'friends.recipient',
                    foreignField: '_id',
                    as: 'friends.recipient'
                }
            },
            { $unwind: '$friends.recipient' },
            {
                $group: {
                    _id: '$friends.recipient._id',
                    records: { $first: '$friends.recipient.records' },
                    username: { $first: '$friends.recipient.username' }
                }
            },
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
                    username: { $first: '$username' },
                    record: { $first: `$records.${gameName}` }
                }
            },
            { $sort: { record: -1 } }
        ]);

        res.json(aggregated);

    }
    catch (err) {
        next(err);
    }

};