import { Schema, model, Document } from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export type UserDocument = Document & {
    password: string;
    email: string;

    setPassword: (password: string) => any;
    validatePassword: (password: string) => any;
    generateJWT: any;
    toAuthJSON: any;
}

const UsersSchema = new Schema({
    password: String,
    email: {
        type: String
    }
});


UsersSchema.methods.setPassword = function (password: string) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function (password: string) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UsersSchema.methods.generateJWT = function () {
    const today: Date = new Date();
    const expirationDate: Date = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: expirationDate.getTime() / 1000
    }, 'secret');
};

UsersSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

export const Users = model('Users', UsersSchema, 'user');