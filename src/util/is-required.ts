import { NextFunction } from 'express';
import { ExtendedError } from './extended-error';

export const isRequired = (name: string, next: NextFunction) => {
    const message = name + ' is required';
    const err = new ExtendedError(message);

    err.statusCode = 422;
    err.response = {
        message
    };

    return next(err);
};