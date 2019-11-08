import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../../util';
import { worldRecordCertainService } from '../../../services';



export const worldRecordCertain = async (req: Request, res: Response, next: NextFunction) => {
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

        const { worldRecords } = await worldRecordCertainService(req.body, req.user);

        res.json({
            status: 'accepted',
            records: worldRecords
        });
    }
    catch (err) {
        next(err);
    }


};