import { Response } from 'express';

export const isRequired = (res: Response, name: string) => res.status(422).json({
    message: name + ' is required',
    subject: name
});