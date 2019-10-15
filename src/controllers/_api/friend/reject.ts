import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Friend, User } from '../../../models';
import { isRequired } from '../../../util/is-required';

export const friendReject = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) return isRequired(res, 'email');

        const { id: myUserId } = req.payload;
        const { _id: requestedUserId } = await User.getId(email);

        const docA = await Friend.findOneAndRemove(
            { requester: myUserId, recipient: requestedUserId }
        );
        const docB = await Friend.findOneAndRemove(
            { recipient: myUserId, requester: requestedUserId }
        );

        await User.findOneAndUpdate(
            { _id: myUserId },
            { $pull: { friends: docA._id } }
        );

        await User.findOneAndUpdate(
            { _id: requestedUserId },
            { $pull: { friends: docB._id } }
        );

        res.send('rejected');
    }
    catch (err) {
        next(err);
    }
};