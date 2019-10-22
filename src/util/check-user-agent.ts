import { Request, Response, NextFunction } from 'express';
import { ExtendedError } from './extended-error';

export const checkUserAgent = (req: Request, res: Response, next: NextFunction) => {

    if (req.get('Secret-key') === 'BoomBrains') {
        return next();
    }

    const error = new ExtendedError('secret is not allowed');
    throw error;

};