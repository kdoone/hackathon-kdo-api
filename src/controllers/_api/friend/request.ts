import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { User, Friend } from '../../../models';
import { isRequired } from '../../../util/is-required';

export const friendRequest = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) return isRequired(res, 'email');

        const { id: myUserId } = req.payload;
        const { _id: requestedUserId } = await User.getId(email);

        // Проверяем чтобы юзер не отправил запрос себе
        const { email: myEmail } = await User.findById(myUserId, 'email');
        if (myEmail === email) {
            return res.status(500).send('Cant request own email');
        }

        // Проверяем, существует ли такой запрос
        const isRequestExists = await Friend.isRequestExists(myUserId, requestedUserId);
        if (isRequestExists) return res.status(409).json({
            message: 'request already exists'
        });

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