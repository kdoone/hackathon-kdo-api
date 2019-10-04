import { Schema, model } from 'mongoose';

const FriendRequestSchema = new Schema({
    requester: {
        type: Number,
        required: true
    },
    recipient: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    }
});

export const FriendRequest = model('Users', FriendRequestSchema, 'user');