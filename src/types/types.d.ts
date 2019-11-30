import { Request } from 'express';

export declare interface RequestUser extends Request {
    user: GlobalUser
}