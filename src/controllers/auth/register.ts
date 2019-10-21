import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { isRequired } from '../../util/is-required';
import { alreadyExists } from '../../util';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password, username } = req.body;

        if (!email) return isRequired(res, 'email');
        if (!password) return isRequired(res, 'password');
        if (!username) return isRequired(res, 'username');

        const isEmailExists = await User.isEmailExists(email);
        const isUsernameExists = await User.isUsernameExists(username);

        if (isEmailExists) return alreadyExists(res, 'email');
        if (isUsernameExists) return alreadyExists(res, 'username');

        // Создаем id для рейтинга и user                
        const finalUser = new User({
            email,
            username,
        });

        finalUser.setPassword(password);
        finalUser.setUid();
        await finalUser.save();

        res.json(finalUser.toAuthJSON());
    }

    catch (err) {
        next(err);
    }

};