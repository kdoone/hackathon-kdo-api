import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { users } = req.body;

        await User.deleteMany({ username: { $in: users } });

        res.json({ message: 'deleted' });
    }
    catch (err) {
        next(err);
    }
};