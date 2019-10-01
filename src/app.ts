import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import compression from 'compression';  // compresses requests

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
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.get('/get-console', getConsole);

// Error handling
app.use((err: any, req: any, res: any) => {
    res.status(500).send('Something broke!');
});



export default app;




