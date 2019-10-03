import { Response, Request, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const { ip, originalUrl } = req;

    const err: any = new Error(`${ip} tried to reach ${originalUrl}`); // Tells us which IP tried to reach a particular URL
    err.statusCode = 404;
    err.shouldRedirect = true; //New property on err so that our middleware will redirect
    next(err);
};