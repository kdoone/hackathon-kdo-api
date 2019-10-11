import { Request } from 'express';

export interface ReqWithPayload extends Request {
    payload: any;
}

export const ReqWith = ''