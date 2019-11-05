import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Friend, User } from '../../../models';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';

export const friendAcceptValidate = [
    check('uid')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'uid is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'uid is empty' })
        .bail()
        .custom(async (value) => {
            const exists = await User.findOne({ uid: value });
            if (!exists) { return Promise.reject({ statusCode: 3, message: 'user doesnt exists' }); }
        })
];

export const friendAccept = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { uid } = req.body;
        const { id: myUserId } = req.user;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const { _id: requestedUserId } = await User.getId('uid', uid);

        // Проверяем чтобы юзер не отправил запрос себе const { uid: myUsername } = await User.findById(myUserId, 'uid');
        if (myUserId === requestedUserId) {
            return res.status(200).json({ statusCode: 4, message: 'cant request myself' });
        }

        await Friend.findOneAndUpdate(
            { requester: myUserId, recipient: requestedUserId },
            { $set: { status: 3 } }
        );

        await Friend.findOneAndUpdate(
            { recipient: myUserId, requester: requestedUserId },
            { $set: { status: 3 } }
        );

        res.json({ status: 'accepted', message: 'request was accepted' });
    }
    catch (err) {
        next(err);
    }
};