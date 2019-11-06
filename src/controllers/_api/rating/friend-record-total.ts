import { Response, NextFunction } from 'express';
import { User } from '../../../models';
import { ReqWithPayload } from '../../../types/req-with-payload';
import { Types } from 'mongoose';

const { ObjectId } = Types;

export const totalFriendRecord = async (req: ReqWithPayload, res: Response, next: NextFunction) => {
    try {
        const { id: myUserId, username: myUsername } = req.user;

        const aggregated = await User.aggregate([
            { $match: { _id: ObjectId(myUserId) } },
            {
                $group: {
                    _id: '$_id',
                    friends: { $first: '$friends' }
                }
            },
            {
                $unwind: '$friends'
            },
            {
                $lookup: {
                    from: 'friends',
                    localField: 'friends',
                    foreignField: '_id',
                    as: 'friends'
                }
            },
            { $unwind: '$friends' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'friends.recipient',
                    foreignField: '_id',
                    as: 'friends.recipient'
                }
            },
            { $unwind: '$friends.recipient' },
            {
                $group: {
                    _id: '$friends.recipient._id',
                    records: { $first: '$friends.recipient.records' },
                    username: { $first: '$friends.recipient.username' }
                }
            },
            {
                $lookup: {
                    from: 'ratings',
                    localField: 'records',
                    foreignField: '_id',
                    as: 'records'
                }
            },
            { $unwind: '$records' },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    records: { $first: '$records' }
                }
            },
            { $project: { 'records._id': 0, 'records.user': 0, 'records.email': 0, 'records.__v': 0 } },
        ]);

        const { records } = await User.findById(myUserId, 'records -_id').populate({ path: 'records', select: '-_id -user -email -__v' });
        const recordsDoc = aggregated.slice();
        recordsDoc.push({ records: records.toObject(), username: myUsername });

        const friendRecords = recordsDoc.map(({ username, records }: any) => {
            const arr = Object.keys(records);
            const totalRecord = arr.reduce((prev: any, cur: any) => {
                return prev + records[cur];
            }, 0);

            return {
                username,
                totalRecord
            };
        });

        let myInfo: any;

        let sorted = friendRecords.sort((a: any, b: any) => b.totalRecord - a.totalRecord);
        sorted = sorted.map((item: any, index: number) => {
            if (item.username === myUsername) {
                myInfo = { ...item, position: index + 1 };
            }

            return { ...item, position: index + 1 };
        });

        res.json({
            status: 'accepted',
            myRecord: myInfo,
            records: sorted
        });

    }
    catch (err) {
        next(err);
    }

};