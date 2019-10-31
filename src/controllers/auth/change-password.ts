import { Response, NextFunction } from 'express';
import { User } from '../../models';
import { ReqWithPayload } from '../../types/req-with-payload';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../util';

export const changePasswordValidate = [
    check('previousPassword')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'previous password is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'previous password is empty' })
        .bail()
        .custom(async (value, { req }) => {
            const user = await User.findById(req.user.id);

            if (!user) {
                return Promise.reject({ statusCode: 3, message: 'user doesnt exists' });
            }

            if (!user.validatePassword(value)) {
                return Promise.reject({
                    statusCode: 4,
                    message: 'is not equal to previous password'
                });
            }
        })
        .bail()
        .isLength({ max: 32 }).withMessage({ statusCode: 5, message: 'shall not exceed 16 characters' }),

    check('password')
        .trim()
        .exists().withMessage({ statusCode: 6, message: 'password is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 7, message: 'password is empty' })
        .bail()
        .isLength({ max: 32 }).withMessage({ statusCode: 8, message: 'shall not exceed 16 characters' })
];

export const changePassword = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {

        const { id, email } = req.user;
        const { password } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        // хэшируем пароль
        const user = new User({ _id: id, email });
        user.setPassword(password);
        const token = await user.generateJWT();
        // обновляем пароль
        User.findByIdAndUpdate(id, { hash: user.hash, salt: user.salt }, (err, user) => {
            if (err) next(err);

            res.json({
                status: 'accepted',
                message: 'Passsword changed successfully',
                email: user.email,
                token
            });
        });
    }
    catch (err) {
        next(err);
    }
};