import { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import { isRequired } from '../../util/is-required';

export const login = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email) return isRequired(res, 'email');
    if (!password) return isRequired(res, 'password');

    passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if (err) return next(err);

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            res.json(user.toAuthJSON());
        }

        return res.status(400).send(info);
    })(req, res, next);

};