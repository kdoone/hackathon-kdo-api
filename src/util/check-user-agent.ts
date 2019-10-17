import { Request, Response, NextFunction } from 'express';

export const checkUserAgent = (req: Request, res: Response, next: NextFunction) => {

    if (req.get('User-agent') === 'BoomBrains') {
        return next();
    }

    return res.json({
        message: 'secret is not allowed'
    });

};