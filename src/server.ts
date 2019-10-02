import { Class } from 'estree';

// import { createServer } from 'http';
// import app from './app';

// const server = createServer(app);

// server.listen(app.get('port'), () => {
//     console.log(
//         'App is running at http://localhost:%d in %s mode',
//         app.get('port'),
//         app.get('env')
//     );
// });

// export default server;

interface Counter {
    (x: number): number;
    title: string;
    tick(): void;
}

const getCounter = (): Counter => {
    const counter = ((x: number) => 40) as Counter;
    counter.title = 'test';
    counter.tick = function () { console.log('tick'); };
    return counter;
};