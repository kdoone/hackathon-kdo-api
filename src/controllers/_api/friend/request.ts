import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { User, Friend } from '../../../models';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';

export const friendRequestValidate = [
    check('searchText')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'email is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' })
        .bail()
        .isLength({ max: 32 }).withMessage({ statusCode: 3, message: 'username shall not exceed 32 characters' })
];

export const friendRequest = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { searchText } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const uid = await User.getId('uid', searchText);
        const username = await User.getId('username', searchText);

        let requestedUserId: string;

        if (uid) {
            requestedUserId = uid._id;
        } else if (username) {
            requestedUserId = username._id;
        } else {
            return res.status(200).json({ statusCode: 4, message: 'this user doesnt exists' });
        }

        // Проверка чтобы не отправил запрос самому себе
        if (myUserId === requestedUserId) {
            return res.status(200).json({ statusCode: 5, message: 'cant request myself' });
        }

        // Проверяем, существует ли такой запрос
        const isRequestExists = await Friend.isRequestExists(myUserId, requestedUserId);
        if (isRequestExists) return res.status(200).json({ statusCode: 6, message: 'request where i am requester exists' });

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

        res.send({ status: 'accepted', message: 'request was successfull' });

    }
    catch (err) {
        next(err);
    }
};