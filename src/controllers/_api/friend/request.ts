import { Response, Request, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { User, Friend } from '../../../models';
import { isRequired } from '../../../util/is-required';

export const friendRequest = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id } = req.payload;
        const { email } = req.body;

        if (!email) return isRequired(res, 'email');

        const myUserId = id;



    }
    catch (err) {
        next(err);
    }
};