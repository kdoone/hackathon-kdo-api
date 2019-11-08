import { Response, NextFunction } from 'express';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { validationResult, check } from 'express-validator';
import { cleanUnnecessary } from '../../../util';
import { friendRecordCertainService } from '../../../services';


export const friendRecordCertain = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        await check('game')
            .trim()
            .exists().withMessage({ statusCode: 1, message: 'game is required' })
            .bail()
            .not().isEmpty().withMessage({ statusCode: 2, message: 'game is empty' }).run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());
            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const { friendRecords } = await friendRecordCertainService(req.user, req.body);

        res.json({
            status: 'accepted',
            records: friendRecords
        });

    }
    catch (err) {
        next(err);
    }

};