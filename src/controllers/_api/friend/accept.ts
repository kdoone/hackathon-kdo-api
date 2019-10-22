import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Friend, User } from '../../../models';
import { isRequired } from '../../../util/is-required';

export const friendAccept = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;
        if (!username) return isRequired('username', next);

        const { id: myUserId } = req.payload;
        const { _id: requestedUserId } = await User.getId('username', username);

        // Проверяем чтобы юзер не отправил запрос себе
        const { username: myUsername } = await User.findById(myUserId, 'username');

        if (myUsername === username) {
            return res.status(500).send('Cant accept own username');
        }

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