import { check } from 'express-validator';
import { User } from '../../models';

export const loginValidate = [
    check('phoneNumber')
        .trim()
        .not().isEmpty().withMessage({ message: 'phone number is empty' })
        .bail()
        .custom(async value => {
            const user = await User.findOne({ phoneNumber: value });
            if (!user) { return Promise.reject(); }
        }).withMessage({ message: 'Incorrect phone number' }),

    check('password')
        .trim()
        .exists().withMessage({ message: 'password is required' })
        .bail()
        .not().isEmpty().withMessage({ message: 'password is empty' })
        .bail()
        .isLength({ max: 32 }).withMessage({ message: 'shall not exceed 16 characters' })
        .bail()
        .custom(async (value, { req }) => {
            const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
            if (!user) { return Promise.reject({ statusCode: 9, message: 'Cannot validate due to email' }); }

            if (!user.validatePassword(value)) {
                return Promise.reject({ statusCode: 10, message: 'Incorrect password', ru: 'Некорректный пароль' });
            }
        })
];