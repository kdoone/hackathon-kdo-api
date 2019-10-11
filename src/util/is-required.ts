import { Response } from 'express';

export const isRequired = (res: Response, name: string) => res.status(422).json({
    errors: {
        [name]: 'is required'
    }
});