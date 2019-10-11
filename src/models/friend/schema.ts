import { Schema } from 'mongoose';

const { ObjectId } = Schema.Types;

export const FriendSchema = new Schema({
    requester: { type: ObjectId, ref: 'User' },
    recipient: { type: ObjectId, ref: 'User' },
    status: {
        type: Number,
        enums: [
            0,    //'add friend',
            1,    //'requested',
            2,    //'pending',
            3    //'friends'
        ]
    }
}, { timestamps: true });
