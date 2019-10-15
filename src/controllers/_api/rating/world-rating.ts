import { Request, Response, NextFunction } from 'express';
import { Rating, User } from '../../../models';

export const getWorldRating = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const arr = await Rating.aggregate([

            {
                '$lookup': {
                    from: 'user',
                    localField: 'user',
                    foreignField: 'records',
                    as: 'record_objects'
                }
            },
        ]);


        res.json(arr);

    }
    catch (err) {
        next(err);
    }


};