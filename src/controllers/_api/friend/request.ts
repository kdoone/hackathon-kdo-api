import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { User, Friend } from '../../../models';
import { alreadyExists } from '../../../util';
import { check } from 'express-validator';

export const friendRequestValidate = [
    check('username')
        .trim()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' })
        .bail()
        .isLength({ max: 32 }).withMessage({ statusCode: 3, message: 'username shall not exceed 32 characters' })
];

export const friendRequest = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { uid, username } = req.body;

        if (username) {
            check('username')
                .trim()
                .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' })
                .bail()
                .isLength({ max: 32 }).withMessage({ statusCode: 3, message: 'username shall not exceed 32 characters' });
        }



        let requestedUserId: string;

        if (username) {
            const { _id } = await User.getId('username', username);
            requestedUserId = _id;
        } else {
            const { _id } = await User.getId('uid', uid);
            requestedUserId = _id;
        }

        // Проверка чтобы не отправил запрос самому себе
        if (myUserId === requestedUserId) {
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