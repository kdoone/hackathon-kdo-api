import { Response } from 'express';

export const alreadyExists = (res: Response, name: string) => res.status(409).json({
    message: name + ' already exists',
    subject: name
});