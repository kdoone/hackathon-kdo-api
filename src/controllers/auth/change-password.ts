import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { isRequired } from '../../util/is-required';
import { ReqWithPayload } from '../../types/req-with-payload';

export const changePassword = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {

        const { id } = req.payload;
        const { password } = req.body;

        if (!password) return isRequired('password', next);

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