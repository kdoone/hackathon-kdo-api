import { Response, NextFunction } from 'express';

export const userInfo = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id, email, username, uid }: any = req.user;

        res.json({ id, email, username, uid });
    }
    catch (err) {
        next(err);
    }
};