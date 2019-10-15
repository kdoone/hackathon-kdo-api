import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { isRequired } from '../../util/is-required';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, username } = req.body;

        if (!email) return isRequired(res, 'email');
        if (!password) return isRequired(res, 'password');
        if (!username) return isRequired(res, 'username');

        const isEmailExists = await User.isEmailExists(email);

        if (isEmailExists) {
            return res.status(409).json({
                errors: {
                    email: 'already exists'
                }
            });
        }
        // 
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