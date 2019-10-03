import { Response, Request, NextFunction } from 'express';
import { Differences } from '../models';

const updateAllItems = (updateId: number) => {
    const toUpdate = {
        'updateId': updateId
    };
    return Differences.updateMany(toUpdate, {
        items: 'string'
    });
};

export const getConsole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateAllItems(0);
    }
    catch (err) {
        next(err);
    }
};