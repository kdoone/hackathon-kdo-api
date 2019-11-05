import { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import { check, validationResult } from 'express-validator';
import { User } from '../../models';
import { cleanUnnecessary } from '../../util';

export const loginValidate = [
    check('email')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'email is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'email is empty' })
        .bail()
        .isEmail().withMessage({ statusCode: 3, message: 'it is not email' })
        .bail()
        .custom(async value => {
            const user = await User.findOne({ email: value });
            if (!user) { return Promise.reject(); }
        }).withMessage({ statusCode: 4, message: 'Incorrect email', ru: 'Некорректный email' })
        .bail()
        .isLength({ max: 64 }).withMessage({ statusCode: 5, message: 'shall not exceed 32 characters' }),

    check('password')
        .trim()
        .exists().withMessage({ statusCode: 6, message: 'password is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 7, message: 'password is empty' })
        .bail()
        .isLength({ max: 32 }).withMessage({ statusCode: 8, message: 'shall not exceed 16 characters' })
        .bail()
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: req.body.email });
            if (!user) { return Promise.reject({ statusCode: 9, message: 'Cannot validate due to email' }); }

            if (!user.validatePassword(value)) {
                return Promise.reject({ statusCode: 10, message: 'Incorrect password', ru: 'Некорректный пароль' });
            }
        })
];
export const login = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // Валидация
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        passport.authenticate('local', { session: false }, async (err, passportUser, info) => {
            if (err) return next(err);

            if (passportUser) {
                const user = passportUser;
                const result = await user.toAuthJSON();

                return res.json(result);
            }

            return res.status(200).send(info);
        })(req, res, next);
    }
    catch (err) {
        next(err);
    }

};