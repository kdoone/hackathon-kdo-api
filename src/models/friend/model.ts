import { model, Document } from 'mongoose';
import { FriendSchema } from './schema';

interface FriendDocument extends Document {
    requester: string;
    recipient: string;
    status: number;
}

export const Friend = model<FriendDocument>('Friend', FriendSchema, 'friends');
