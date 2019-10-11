import mongoose from 'mongoose';
import { UserSchema, UserModel, UserDocument } from './schema';

export const User = mongoose.model<UserDocument, UserModel>('User', UserSchema, 'users');