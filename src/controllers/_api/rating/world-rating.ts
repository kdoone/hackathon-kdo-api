import { Request, Response, NextFunction } from 'express';
import { Rating } from '../../../models';

export const getWorldRating = (req: Request, res: Response, next: NextFunction) => {

    Rating.aggregate([
        {
            $group: {
                _id: '$_id',
                record: {
                    '$first': '$record'
                }
            }
        },
        {
            $sort: {
                record: -1
            }
        }
    ])
        .exec((err, rating) => {
            if (err) next(err);

            res.json(rating);
        });

};