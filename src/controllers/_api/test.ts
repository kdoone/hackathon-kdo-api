import { Response, Request, NextFunction } from 'express';
import { Person, Band } from '../../models';

export const test = async (req: Request, res: Response, next: NextFunction) => {

    await Person.deleteOne({ name: 'Slash' });
    res.send('done');
};


// Band.find().populate({ path: 'members' }).exec(function (err, bands: any) {
//     if (err) next(err);

//     res.json({
//         members: bands
//     });
// });


// await Band.insertMany([
//     {
//         name: 'Guns N'
//     },
//     {
//         name: 'Motley Crue'
//     }
// ]);

// res.send('done');