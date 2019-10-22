import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Friend, User } from '../../../models';
import { isRequired } from '../../../util/is-required';

export const friendReject = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
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