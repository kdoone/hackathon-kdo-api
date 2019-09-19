import { Schema, model } from 'mongoose'

const differences = Schema({
    deviceId: { type: String, required: true },
    version: { type: Number, required: true },
    items: [{
        id: Number,
        img: String,                   
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
