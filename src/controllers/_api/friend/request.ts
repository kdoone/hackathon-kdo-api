import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { User, Friend } from '../../../models';
import { isRequired } from '../../../util/is-required';
import { alreadyExists } from '../../../util';

export const friendRequest = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;
        if (!username) return isRequired('username', next);

        const { id: myUserId } = req.payload;
        const { _id: requestedUserId } = await User.getId('username', username);

        // Проверяем чтобы юзер не отправил запрос себе
        const { username: myUsername } = await User.findById(myUserId, 'username');

        if (myUsername === username) {
            return res.status(500).send('Cant request own username');
        }

        // Проверяем, существует ли такой запрос
        const isRequestExists = await Friend.isRequestExists(myUserId, requestedUserId);
        if (isRequestExists) return alreadyExists('request', next);

        const docA = await Friend.findOneAndUpdate(
            { requester: myUserId, recipient: requestedUserId },
            { $set: { status: 1 } },
            { upsert: true, new: true }
        );

        const docB = await Friend.findOneAndUpdate(
            { recipient: myUserId, requester: requestedUserId },
            { $set: { status: 2 } },
            { upsert: true, new: true }
        );

        await User.findOneAndUpdate(
            { _id: myUserId },
            { $push: { friends: docA._id } }
        );

        await User.findOneAndUpdate(
            { _id: requestedUserId },
            { $push: { friends: docB._id } }
        );

        res.send('request was successfull');

    }
    catch (err) {
        next(err);
    }
};