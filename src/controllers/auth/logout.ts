import { Response, NextFunction } from 'express';
import { User } from '../../models';

export const logout = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        await User.findByIdAndUpdate(myUserId, { token: 'deleted' });

        res.json({
            status: 'accepted',
            message: 'token was deleted'
        });
    }
    catch (err) {
        next(err);
    }
};
