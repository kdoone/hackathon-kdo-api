import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { headers: { authorization } } = req;

        const headersToken = authorization.split(' ')[1];

        verify(headersToken, 'secret', (err) => {
            if (err) {
                return res.status(401).send('token is not valid');
            }

            res.status(200).send('token is valid');
        });
    }
    catch (err) {
        next(err);
    }
};