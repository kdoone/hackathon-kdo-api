import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Rating } from '../../../models';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';

export const createRatingValidate = [
    check('game')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'game is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' }),

    check('record')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'record is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'record is empty' })
];

export const getRatingValidate = [
    check('game')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'game is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' })
];

export const getRating = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        // id юзера смотрит по токену
        const { id: myUserId } = req.user;
        const { game: gameName } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        // выбираем gamename и деструктурируем объект выбрав только одно
        const { [gameName]: record }: any = await Rating.findOne({ user: myUserId }, gameName);

        res.json({ status: 'accepted', record });
    }
    catch (err) {
        next(err);
    }

};

export const createRating = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { game: gameName, record } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        await Rating.findOneAndUpdate(
            { user: myUserId },
            { [gameName]: record },
        );

        res.json({
            status: 'accepted',
            message: 'rating was updated'
        });

    }
    catch (err) {
        next(err);
    }
};