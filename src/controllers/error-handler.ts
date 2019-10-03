import { Response, Request, NextFunction } from 'express';
import { logger } from '../util/logger';
// Без NextFunction хандлер не будет работать

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (!err.statusCode) err.statusCode = 500;

    logger.log({
        level: 'error',
        message: err.message,
        stack: err.stack
    });

    (err.shouldRedirect)
        ? res.render('404', { err })
        : res.status(err.statusCode).send(err.message);
};