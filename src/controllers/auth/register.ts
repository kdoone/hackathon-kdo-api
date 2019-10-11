import { Response, Request, NextFunction } from 'express';
import { User, Rating } from '../../models';
import { isRequired } from '../../util/is-required';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username } = req.body;

    if (!email) return isRequired(res, 'email');
    if (!password) return isRequired(res, 'password');
    if (!username) return isRequired(res, 'username');

    const finalUser = new User({
        email,
        username
    });
    const isEmailExists = await User.isEmailExists(email);

    if (isEmailExists) {
        return res.status(409).json({
            errors: {
                email: 'already exists'
            }
        });
    }

    finalUser.setPassword(password);
    finalUser.setUid();

    // Создаем нулевой рейтинг
    const rating = new Rating({
        publicId: finalUser._id,
        record: 0
    });

    await rating.save((err) => {
        if (err) next(err);
    });

    finalUser.save((err, user) => {
        if (err) return next(err);

        res.json(user.toAuthJSON());
    });
};