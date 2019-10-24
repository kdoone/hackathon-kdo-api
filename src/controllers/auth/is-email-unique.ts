import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { isRequired } from '../../util/is-required';

export const isEmailUnique = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        if (!email) return isRequired('email', next);

        const isExists = await User.isEmailExists(email);

        res.status(200).json({
            isExists
        });
    }
    catch (err) {
        next(err);
    }
};