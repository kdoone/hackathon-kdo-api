import { Response, Request, NextFunction } from 'express';
import { User, Rating } from '../../models';

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { users } = req.body;

        const arr = await User.find({ username: { $in: users } }, '_id');
        const arrOnlyId = arr.map(item => item._id);
        await User.deleteMany({ username: { $in: users } });

        await Rating.deleteMany({ user: { $in: arrOnlyId } });

        res.json({ message: 'deleted' });
    }
    catch (err) {
        next(err);
    }
};