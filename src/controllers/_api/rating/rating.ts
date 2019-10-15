import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Rating, User } from '../../../models';
import { isRequired } from '../../../util/is-required';

export const createRating = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.payload;
        const { game, record } = req.body;

        if (!game) return isRequired(res, 'game');
        if (!record) return isRequired(res, 'record');

        const rating = await Rating.findOneAndUpdate(
            { game, user: myUserId },
            {
                record
            },
            { upsert: true, new: true }
        );

        await User.findByIdAndUpdate(
            myUserId,
            {
                '$addToSet': {
                    'records': rating._id
                }
            });

        res.json('rating was updated');

    }
    catch (err) {
        next(err);
    }
};