import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { ReqWithPayload } from '../../types/req-with-payload';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../util';

export const changePasswordValidate = [
    check('password')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'password is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'password is empty' })
        .bail()
        .isLength({ max: 16 }).withMessage({ statusCode: 3, message: 'shall not exceed 16 characters' })
];

export const changePassword = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {

        const { id } = req.payload;
        const { password } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        // хэшируем пароль
        const user = new User();
        user.setPassword(password);
        // обновляем пароль
        User.findByIdAndUpdate(id, { hash: user.hash, salt: user.salt }, (err, user) => {
            if (err) next(err);

            res.json({
                message: 'Passsword changed successfully',
                email: user.email
            });
        });
    }
    catch (err) {
        next(err);
    }
};