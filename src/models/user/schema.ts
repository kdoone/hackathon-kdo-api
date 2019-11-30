import { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import generator from 'generate-password';

export interface UserDocument extends GlobalUser, Document {
    generateJWT: () => string;
    toAuthJSON: () => AuthJson;
    setPassword: (password: string) => any;
    validatePassword: (password: string) => any;
    setUid: () => void;
}

export interface UserModel extends Model<UserDocument> {
    isEmailExists: (email: string) => Promise<any>;
}

export const UserSchema = new Schema({
    email: {
        type: String,
        index: true
    },
    hash: String,
    salt: String,
    uid: String,
    firstName: String,
    lastName: String,
    patronymic: String,
    uin: Number,
    udNumber: Number,
    udCity: String,
    udByWhom: String,
    udFromDate: String,
    udToDate: String,
    liveCity: String,
    loanConditions: Number,
    phoneNumber: String,
    placeOfWork: String,
    category: Number,
    position: String,
    token: {
        type: String,
        default: ''
    },
}, { timestamps: true });

UserSchema.methods.setPassword = function (this: UserDocument, password: string): void {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.setUid = function (this: UserDocument): void {
    this.uid = generator.generate({
        length: 7,
        numbers: true,
        uppercase: false,
    });
};

UserSchema.methods.validatePassword = function (this: UserDocument, password: string): boolean {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = async function (this: UserDocument): Promise<string> {
    const token = jwt.sign({
        email: this.email,
        id: this._id
    }, 'secret');

    await this.updateOne({ token });

    return token;
};

UserSchema.statics.isEmailExists = async function (email: string): Promise<any> {
    return this.exists({ email });
};

interface AuthJson {
    status: string;
    statusCode: number;
    _id: string;
    email: string;
    token: string;
    uid: string;
}

UserSchema.methods.toAuthJSON = async function (this: UserDocument): Promise<AuthJson> {
    const token = await this.generateJWT();

    return {
        status: 'accepted',
        statusCode: 0,
        _id: this._id,
        email: this.email,
        token,
        uid: this.uid
    };
};