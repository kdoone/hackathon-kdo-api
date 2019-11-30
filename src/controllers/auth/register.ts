import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../util';
import { registerValidate } from './register-validate';

export { registerValidate };

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Валидация
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const cleaned = cleanUnnecessary(errors.array());

            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const finalUser = new User(req.body);

        finalUser.setPassword('admin');
        finalUser.setUid();
        await finalUser.save();

        const result = await finalUser.toAuthJSON();
        res.json(result);
    }

    catch (err) {
        next(err);
    }

};