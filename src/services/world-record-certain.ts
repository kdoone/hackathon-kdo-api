import { User } from '../models';

export const worldRecordCertainService = async (body: any, user: any): Promise<{ worldRecords: any; myWorldRecord: number }> => {

    const { username: myUsername } = user;
    const { game: gameName } = body;

    const arrTotal = await User.aggregate([
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
                game: { $first: gameName },
                record: { $first: `$records.${gameName}` },
                username: { $first: '$username' }
            }
        },
        { $sort: { record: -1 } }
    ]);

    let arr = arrTotal;
    let myWorldRecord;

    arr = arr.map((item: any, index: number) => {
        if (item.username === myUsername) {
            myWorldRecord = { ...item, position: index + 1 };
        }

        return { ...item, position: index + 1 };
    });

    return {
        worldRecords: arr,
        myWorldRecord
    };
};