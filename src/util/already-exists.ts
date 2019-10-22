import { NextFunction } from 'express';
import { ExtendedError } from './extended-error';
export const alreadyExists = (name: string, next: NextFunction) => {
    const message = name + ' already exists';
    const err = new ExtendedError(message);

    err.statusCode = 409;
    err.response = {
        message
    };

    return next(err);
};