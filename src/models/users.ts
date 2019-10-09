import { Schema, model, Document, Model } from 'mongoose';
import uuidv1 from 'uuid/v1';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
export type UserDocument = Document & {
    email: string;
    salt: string;
    hash: string;
    user: any;
    uid: string;
    test: any;
    generateJWT: () => string;
    toAuthJSON: () => AuthJson;
    setPassword: (password: string) => any;
    validatePassword: (password: string) => any;
    setUid: () => void;
}

export interface UserModel extends Model<UserDocument> {
    isEmailExists: (email: string) => Promise<any>;
}

const UsersSchema = new Schema({
    email: {
        type: String,
        index: true
    },
    hash: String,
    salt: String,
    uid: String
});

UsersSchema.methods.setPassword = function (this: UserDocument, password: string): void {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.setUid = function (this: UserDocument): void {
    this.uid = uuidv1();
};

UsersSchema.methods.validatePassword = function (this: UserDocument, password: string): boolean {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UsersSchema.statics.isEmailExists = async function (email: string): Promise<any> {
    return this.findOne({ email });
};

UsersSchema.methods.generateJWT = function (this: UserDocument): string {
    const today: Date = new Date();
    const expirationDate: Date = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: expirationDate.getTime() / 1000
    }, 'secret');
};

interface AuthJson {
    _id: string;
    email: string;
    token: string;
    uid: string;
}

UsersSchema.methods.toAuthJSON = function (this: UserDocument): AuthJson {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
        uid: this.uid
    };
};

export const Users = model<UserDocument, UserModel>('User', UsersSchema, 'users');