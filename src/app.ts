import express, { json, urlencoded, Request, Response, NextFunction } from 'express';
import { connect } from 'mongoose';
import compression from 'compression';  // compresses requests
import path from 'path';
import { renderFile } from 'ejs';

// Controllers
import { getConsole } from './controllers/api';

// Create Express server
const app = express();

// Connect to MongoDB
const connectToDb = async () => {
    try {
        await connect(
            'mongodb://localhost:27017/findDifference',
            { useNewUrlParser: true, useUnifiedTopology: true, }
        );

        console.log('Connected to Mongodb');
    }
    catch (err) {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    }
};
connectToDb();


// Initialize all routes
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/public/views');
app.engine('html', renderFile);
app.set('view engine', 'html');
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
    express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

// Routes
app.get('/get-console', getConsole);

// Error handling
app.get('*', function (req, res, next) {
    const { ip, originalUrl } = req;

    const err: any = new Error(`${ip} tried to reach ${originalUrl}`); // Tells us which IP tried to reach a particular URL
    err.statusCode = 404;
    err.shouldRedirect = true; //New property on err so that our middleware will redirect
    next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {

    if (!err.statusCode) err.statusCode = 500;

    (err.shouldRedirect)
        ? res.render('404')
        : res.status(err.statusCode).send(err.message);
});

export default app;




