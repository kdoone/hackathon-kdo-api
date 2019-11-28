import { Response, NextFunction } from 'express';
import { ExtendedError } from '../util';

export const checkToken = (req: any, res: Response, next: NextFunction) => {
    const { headers: { authorization }, user: { token: userToken } } = req;

    const headersToken = authorization.split(' ')[1];

    if (headersToken !== userToken) {
        const error = new ExtendedError('token is not valid');
        error.statusCode = 401;

        throw error;
    }

    next();
};