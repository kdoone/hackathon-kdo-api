import { Types } from 'mongoose';
import { User } from '../models';

const { ObjectId } = Types;

export const friendRecordCertainService = async (user: any, body: any): Promise<{ friendRecords: any }> => {

    const { id: myUserId } = user;
    const { game: gameName } = body;

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
                record: { $first: `$records.${gameName}` }
            }
        },
        { $sort: { record: -1 } }
    ]);

    return {
        friendRecords: aggregated
    };
};