import { Response, NextFunction } from 'express';
import { Friend } from '../../../models';
import { ReqWithPayload } from '../../../types';
import { Types } from 'mongoose';

const { ObjectId } = Types;
export const requestList = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId } = req.user;

        const aggregated = await Friend.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'requester',
                    foreignField: '_id',
                    as: 'requester'
                }
            },
            { $unwind: '$requester' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'recipient',
                    foreignField: '_id',
                    as: 'recipient'
                }
            },
            { $unwind: '$recipient' },
            { $match: { status: 1, 'recipient._id': ObjectId(myUserId) } },
            {
                $group: {
                    _id: '$_id',
                    requesterId: { $first: '$requester._id' },
                    username: { $first: '$requester.username' },
                    uid: { $first: '$requester.uid' },
                    createdAt: { $first: '$requester.createdAt' },
                    status: { $first: '$status' }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(aggregated);
    }
    catch (err) {
        next(err);
    }
};