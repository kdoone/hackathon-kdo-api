import { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import { isRequired } from '../../util/is-required';

export const login = async (req: Request, res: Response, next: NextFunction) => {

    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (!email) return isRequired('email', next);
        if (!password) return isRequired('password', next);

        passport.authenticate('local', { session: false }, (err, passportUser, info) => {
            if (err) return next(err);

            if (passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();

                res.json(user.toAuthJSON());
            }

            return res.status(200).send(info);
        })(req, res, next);
    }
    catch (err) {
        next(err);
    }

};