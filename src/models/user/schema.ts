import { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import generator from 'generate-password';

const { ObjectId } = Schema.Types;
export interface UserDocument extends Document {
    email: string;
    salt: string;
    hash: string;
    user: any;
    uid: string;
    test: any;
    username: string;
    generateJWT: () => string;
    toAuthJSON: () => AuthJson;
    setPassword: (password: string) => any;
    validatePassword: (password: string) => any;
    setUid: () => void;
    friends: any;
    record: any;
}

export interface UserModel extends Model<UserDocument> {
    isEmailExists: (email: string) => Promise<any>;
    isUsernameExists: (username: string) => Promise<any>;
    getId: (key: string, value: any) => Promise<any>;
}

export const UserSchema = new Schema({
    email: {
        type: String,
        index: true
    },
    username: String,
    hash: String,
    salt: String,
    uid: String,
    friends: [{ type: ObjectId, ref: 'Friend' }],
    records: [{ type: ObjectId, ref: 'Rating' }]
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

UserSchema.statics.isEmailExists = async function (email: string): Promise<any> {
    return this.exists({ email });
};

UserSchema.statics.isUsernameExists = async function (username: string): Promise<any> {
    return this.exists({ username });
};

UserSchema.statics.getId = async function (key: string, value: any): Promise<any> {
    return this.findOne({ [key]: value });
};

UserSchema.methods.generateJWT = function (this: UserDocument): string {
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
    status: string;
    statusCode: number;
    _id: string;
    email: string;
    token: string;
    uid: string;
    username: string;
}

UserSchema.methods.toAuthJSON = function (this: UserDocument): AuthJson {
    return {
        status: 'accepted',
        statusCode: 0,
        _id: this._id,
        email: this.email,
        username: this.username,
        token: this.generateJWT(),
        uid: this.uid
    };
};

UserSchema.virtual('ownRating', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'publicId',
    justOne: true
});