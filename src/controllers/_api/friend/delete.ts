import { Response, Request, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';
import { User, Friend } from '../../../models';
import { ReqWithPayload } from '../../../types';

export const deleteFriendValidate = [
    check('username')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'username is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'username is empty' })
        .bail()
        .custom(async (value) => {
            const exists = await User.findOne({ username: value });
            if (!exists) { return Promise.reject({ statusCode: 3, message: 'user doesnt exists' }); }
        }),
];

export const deleteFriend = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;
        const { username } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const { _id: requestedUserId } = await User.findOne({ username });

        // Проверяем чтобы юзер не отправил запрос себе        
        if (myUserId == requestedUserId) {
            return res.status(200).json({ statusCode: 4, message: 'cant request myself' });
        }

        const isRejectExists = await Friend.isRejectExists(myUserId, requestedUserId);
        if (!isRejectExists) return res.status(200).json({ statusCode: 5, message: 'request where i am recipient doesnt exists' });

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

        res.send({ status: 'accepted', message: 'friend was deleted' });
    }
    catch (err) {
        next(err);
    }
};