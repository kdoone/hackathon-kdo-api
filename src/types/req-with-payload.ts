import { Request } from 'express';

export interface ReqWithPayload extends Request {
    payload: any;
    user: {
        id: string;
        email: string;
        username: string;
        uid: string;
        token: string;
    }
}

export const ReqWith = ''