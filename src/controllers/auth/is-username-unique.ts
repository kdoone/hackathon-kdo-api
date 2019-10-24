import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { isRequired } from '../../util/is-required';

export const isUsernameUnique = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;

        if (!username) return isRequired('username', next);

        const isExists = await User.isUsernameExists(username);

        res.status(200).json({
            isExists
        });
    }
    catch (err) {
        next(err);
    }
};