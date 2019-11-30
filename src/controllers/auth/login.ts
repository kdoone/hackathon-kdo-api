import { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import { validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../util';
import { loginValidate } from './login-validate';

export { loginValidate };
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