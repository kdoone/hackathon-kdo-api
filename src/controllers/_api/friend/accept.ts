import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Friend, User } from '../../../models';
import { isRequired } from '../../../util/is-required';

export const friendAccept = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) return isRequired(res, 'email');

        const { id: myUserId } = req.payload;
        const { _id: requestedUserId } = await User.getId(email);

        await Friend.findOneAndUpdate(
            { requester: myUserId, recipient: requestedUserId },
            { $set: { status: 3 } }
        );

        await Friend.findOneAndUpdate(
            { recipient: myUserId, requester: requestedUserId },
            { $set: { status: 3 } }
        );

        res.send('accepted');
    }
    catch (err) {
        next(err);
    }
};