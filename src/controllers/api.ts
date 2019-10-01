import { Response, Request, NextFunction } from 'express';
import { Schema, model } from 'mongoose';

const differences = new Schema({
    deviceId: { type: String, required: true },
    updateId: { type: Number, required: true },
    items: [{
        id: Number,
        imgList: String,
        imgDescr: String,
        imgOriginal: String,
        imgFake: String,
        defaultLife: Number,
        life: Number,
        defaultHint: Number,
        hint: Number,
        isPassed: Boolean,
        points: [{
            id: Number,
            x: Number, y: Number,
            isFound: Boolean
        }]
    }]
});

export const Differences = model('Differences', differences, 'differences');

const updateAllItems = (updateId: number) => {

    const toUpdate = {
        'updateId': updateId
    };
    return Differences.updateMany(toUpdate, {
        items: 'test'
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