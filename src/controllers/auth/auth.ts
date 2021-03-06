import jwt from 'express-jwt';
import { Request } from 'express';

const getTokenFromHeaders = (req: Request) => {
    const { headers: { authorization } } = req;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }

    return null;
};

export const auth = {
    required: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders
    }),
    optional: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false
    })
};