import { NextFunction } from 'express';
import { ExtendedError } from './extended-error';
export const alreadyExists = (name: string, next: NextFunction) => {
    const message = name + ' already exists';
    const err = new ExtendedError(message);
    let resStatusCode;

    switch (name) {
        case 'email':
            resStatusCode = 1;
            break;
        case 'username':
            resStatusCode = 2;
        default:
            resStatusCode = 0;
    }

    err.statusCode = 200;
    err.response = {
        status: 'rejected',
        statusCode: resStatusCode,
        message,
    };

    return next(err);
};