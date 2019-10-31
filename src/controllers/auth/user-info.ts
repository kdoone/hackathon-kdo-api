import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../types/req-with-payload';

export const userInfo = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id, email, username, uid }: any = req.user;

        res.json({ id, email, username, uid });
    }
    catch (err) {
        next(err);
    }
};