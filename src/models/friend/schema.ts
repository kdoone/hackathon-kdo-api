import { Schema, Document, Model } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface FriendDocument extends Document {
    requester: string;
    recipient: string;
    status: number;
}

export interface FriendModel extends Model<FriendDocument> {
    isRequestExists: (myUserId: string, requestedUserId: string) => Promise<any>;
}

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

FriendSchema.statics.isRequestExists = async function (myUserId: string, requestedUserId: string): Promise<any> {
    return this.exists({ requester: myUserId, recipient: requestedUserId });
}; 