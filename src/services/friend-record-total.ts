import { Types } from 'mongoose';
import { User } from '../models';

const { ObjectId } = Types;

export const friendRecordTotalService = async (user: any): Promise<{ friendRecords: any }> => {

    const { id: myUserId, username: myUsername } = user;

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
        { $match: { 'friends.status': { $eq: 3 } } },
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
                username: { $first: '$friends.recipient.username' },
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
                records: { $first: '$records' },
            }
        },
        { $project: { 'records._id': 0, 'records.user': 0, 'records.email': 0, 'records.__v': 0 } },

    ]);

    const { records } = await User.findById(myUserId).populate({ path: 'records', select: '-_id -__v -email -user' }).lean();

    const recordsDoc = aggregated.slice();
    recordsDoc.push({ username: myUsername, records });

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


    let sorted = friendRecords.sort((a: any, b: any) => b.totalRecord - a.totalRecord);
    sorted = sorted.map((item: any, index: number) => ({ ...item, position: index + 1 }));

    return {
        friendRecords: sorted
    };

};
