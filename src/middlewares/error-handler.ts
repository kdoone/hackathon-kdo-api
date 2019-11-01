import { Response, Request, NextFunction } from 'express';
import { logger } from '../util/logger';
import { ExtendedError } from '../util';

// Без next хандлер не будет работать
export const errorHandler = (err: ExtendedError, req: Request, res: Response, next: NextFunction) => {

    if (!err.statusCode) err.statusCode = 500;
    if (!err.response) err.response = err.message;

    logger.log({
        level: 'error',
        message: err.message,
        stack: err.stack
    });

    (err.shouldRedirect)
        ? res.render('404', { err })
        : res.status(err.statusCode).send(err.response);
};