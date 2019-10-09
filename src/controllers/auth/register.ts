import { Response, Request, NextFunction } from 'express';
import { Users } from '../../models';
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required'
            }
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required'
            }
        });
    }

    const finalUser = new Users(user);
    const isEmailExists = await Users.isEmailExists(user.email);

    if (isEmailExists) {
        return res.status(409).json({
            errors: {
                email: 'already exists'
            }
        });
    }

    finalUser.setPassword(user.password);
    finalUser.setUid();
    finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
};