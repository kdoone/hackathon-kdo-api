import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { check, validationResult } from 'express-validator';

export const isUsernameUniqueValidate = [
    check('username')
        .trim()
        .custom(async value => {
            const exists = await User.exists({ username: value });
            if (exists) { return Promise.reject(); }
        })
];

export const isUsernameUnique = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(200).send(false);
        }

        res.status(200).send(true);
    }
    catch (err) {
        next(err);
    }
};