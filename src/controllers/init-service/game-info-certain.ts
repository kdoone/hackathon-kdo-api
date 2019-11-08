import { Response, NextFunction } from 'express';
import { friendRecordCertainService, worldRecordCertainService } from '../../services';
import { validationResult, check } from 'express-validator';
import { cleanUnnecessary } from '../../util';

export const gameInfoCertainInit = async (req: any, res: Response, next: NextFunction) => {
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
        const { worldRecords, myWorldRecord } = await worldRecordCertainService(req.body, req.user);

        req.friendRecords = friendRecords;
        req.worldRecords = worldRecords;
        req.myWorldRecord = myWorldRecord;

        next();
    }
    catch (err) {
        next(err);
    }
};