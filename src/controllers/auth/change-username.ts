import { Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../util';
import { User } from '../../models';
import { ReqWithPayload } from '../../types';

export const changeUsernameValidate = [
    check('username')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'username is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'username is empty' })
        .bail()
        .isLength({ max: 32 }).withMessage({ statusCode: 3, message: 'username shall not exceed 64 characters' })
];

export const changeUsername = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { username } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        await User.findByIdAndUpdate(myUserId, { username });

        res.json({ status: 'acccepted', message: 'username changed' });

    }
    catch (err) {
        next(err);
    }
};