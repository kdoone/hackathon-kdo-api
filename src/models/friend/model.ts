import { model } from 'mongoose';
import { FriendSchema, FriendDocument, FriendModel } from './schema';

export const Friend = model<FriendDocument, FriendModel>('Friend', FriendSchema, 'friends');
