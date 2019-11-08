import { User } from '../models';
import { ReqWithPayload } from '../types';
export const worldRecordTotalService = async (req: ReqWithPayload): Promise<{ myWorldRecord: any; worldRecords: any }> => {

    const { username: myUsername } = req.user;

    const arrTotal: any = await User.aggregate([
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
            },
        },
        { $project: { 'records._id': 0, 'records.user': 0, 'records.email': 0, 'records.__v': 0 } },
    ]);

    const worldRecords = arrTotal.map(({ username, records }: any) => {
        const arr = Object.keys(records);
        const totalRecord = arr.reduce((prev: any, cur: any) => {
            return prev + records[cur];
        }, 0);

        return {
            username,
            totalRecord
        };
    });

    let myWorldRecord: any;

    let sorted = worldRecords.sort((a: any, b: any) => b.totalRecord - a.totalRecord);
    sorted = sorted.map((item: any, index: number) => {
        if (item.username === myUsername) {
            myWorldRecord = { ...item, position: index + 1 };
        }

        return { ...item, position: index + 1 };
    });


    return {
        myWorldRecord,
        worldRecords: sorted
    };
};