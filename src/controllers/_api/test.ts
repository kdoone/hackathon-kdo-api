import { Response, Request, NextFunction } from 'express';
import { Rating } from '../../models';

interface Test extends Request {
    payload: any;
}

export const test = async (req: Test, res: Response, next: NextFunction) => {
    const { payload: { id } } = req;

    console.log(id);
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

// {
// 	"email": "dima@gmail.com",
// 	"username" : "dima",
// 	"password": "153624sanch"
// }

// {
// 	"email": "sanch@gmail.com",
// 	"username" : "sanch",
// 	"password": "153624sanch"
// }

// {
// 	"email": "maita@gmail.com",
// 	"username" : "maita",
// 	"password": "153624sanch"
// }
