import { Response, NextFunction } from 'express';
import { Rating } from '../../../models';
import { isRequired } from '../../../util/is-required';
import { ReqWithPayload } from '../../../types/req-with-payload';

export const getLocalRating = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        // id юзера смотрит по токену
        const { id } = req.payload;

        Rating.findOne({ publicId: id }, 'record', (err, rating) => {
            if (err) next(err);

            res.json(rating);
        });
    }
    catch (err) {
        next(err);
    }

};

export const changeLocalRating = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { record } = req.body;
        const { id } = req.payload;

        if (!record) return isRequired(res, 'record');

        Rating.findOneAndUpdate({ publicId: id }, { record }, (err) => {
            if (err) next(err);

            res.json({
                message: 'Record updated'
            });
        });
    }
    catch (err) {
        next(err);
    }

};