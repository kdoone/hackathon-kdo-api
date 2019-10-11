import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { isRequired } from '../../util/is-required';

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, id } = req.body;

        if (!password) return isRequired(res, 'password');
        if (!id) return isRequired(res, 'id');

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