import { Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../util';
import { User } from '../../models';

export const changeUsernameValidate = [
    check('username')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'username is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'username is empty' })
        .bail()
        .isLength({ max: 32 }).withMessage({ statusCode: 3, message: 'username shall not exceed 64 characters' })
];

export const changeUsername = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { username } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            let cleaned = cleanUnnecessary(errors.array());
            cleaned = cleaned.map((item: any) => ({ ...item, message: res.__(item.message) }));

            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        await User.findByIdAndUpdate(myUserId, { username });

        res.json({ status: 'accepted', message: 'username changed' });

    }
    catch (err) {
        next(err);
    }
};