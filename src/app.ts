import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import compression from 'compression';  // compresses requests
import path from 'path';

// Controllers
import { errorHandler, notFound, auth, register, login, resetPassword } from './controllers';

// Create Express server
const app = express();

// Connect to MongoDB
const connectToDb = async (): Promise<void> => {
    try {
        await connect(
            'mongodb://localhost:27017/findDifference',
            { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
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
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
    express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

// Passport config
import './config/passport';

// Routes
app.post('/auth/register', auth.optional, register);
app.post('/auth/login', auth.optional, login);
app.post('/auth/reset-password', auth.optional, resetPassword);

// Error handling
app.get('*', notFound);
app.use(errorHandler);

export default app;
