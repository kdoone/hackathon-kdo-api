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
//     "email": "dima@gmail.com",
//         "username" : "dima",
//             "password": "153624sanch"
//             token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpbWFAZ21haWwuY29tIiwiaWQiOiI1ZGE1OGI5M2E5MGJmYjA0NDRjM2QyNjUiLCJleHAiOjE1NzY0MDYyOTAuMjk5LCJpYXQiOjE1NzEyMjIyOTB9.jI1VcHpGTXZvJJiVo2nLpp14fRdy3vKoBofgdxgcYzs
// }

// {
//     "email": "sanch@gmail.com",
//         "username" : "sanch",
//             "password": "153624sanch"
//             token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbmNoQGdtYWlsLmNvbSIsImlkIjoiNWRhNThiYTNhOTBiZmIwNDQ0YzNkMjY3IiwiZXhwIjoxNTc2NDA3OTM1LjUyNywiaWF0IjoxNTcxMjIzOTM1fQ.ZDUpTBIlSKTMWY6VReddEerp8BYfIaQNaMCoUAJwEhU
// }

// {
//     "email": "maita@gmail.com",
//         "username" : "maita",
//             "password": "153624sanch"
// }
