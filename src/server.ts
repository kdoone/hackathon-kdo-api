import { createServer } from 'http';
import app from './app';

const server = createServer(app);

server.listen(app.get('port'), (): void => {
    console.log(
        'App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
    );
});

export default server;

export { };
