import { Types } from 'mongoose';
import { User } from '../models';

const { ObjectId } = Types;

export const friendRecordCertainService = async (user: any, body: any): Promise<{ friendRecords: any }> => {

    const { id: myUserId, username: myUsername } = user;
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

    const { records } = await User.findById(myUserId).populate({ path: 'records', select: '-_id -__v -email -user' }).lean();

    let arr = aggregated.slice();
    arr.push({ _id: myUserId, username: myUsername, record: records[gameName] });

    arr = arr.sort((a: any, b: any) => b.record - a.record);
    arr = arr.map((item: any, index: number) => {
        return { ...item, position: index + 1 };
    });

    return {
        friendRecords: arr
    };
};