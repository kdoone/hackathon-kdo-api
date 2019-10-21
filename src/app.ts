import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import compression from 'compression';  // compresses requests
import path from 'path';
// Controllers
import { errorHandler, notFound, auth, register, login, resetPassword, changePassword, getLocalRating, changeLocalRating, getWorldRating, friendRequest, friendReject, friendAccept, getFriendRating, createRating, getStatusesOutgoing, getStatusesIncoming } from './controllers';
import { checkUserAgent } from './util';
// Create Express server
const app = express();

// Connect to MongoDB
const connectToDb = async (): Promise<void> => {
    try {
        await connect(
            'mongodb://localhost:27017/findDifference',
            { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
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

// *** Routes

// Auth

app.post('/auth/register', auth.optional, checkUserAgent, register);
app.post('/auth/login', auth.optional, checkUserAgent, login);
app.post('/auth/reset-password', auth.optional, checkUserAgent, resetPassword);
app.post('/auth/change-password', auth.required, changePassword);
// Rating
app.get('/api/local-rating', auth.required, getLocalRating);
app.post('/api/local-rating', auth.required, changeLocalRating);
app.get('/api/world-rating', auth.required, getWorldRating);
app.get('/api/friend-rating', auth.required, getFriendRating);
app.post('/api/rating', auth.required, createRating);
// Friend
app.post('/api/friend-request', auth.required, friendRequest);
app.post('/api/friend-accept', auth.required, friendAccept);
app.post('/api/friend-reject', auth.required, friendReject);
app.get('/api/status-outgoing', auth.required, getStatusesOutgoing);
app.get('/api/status-incoming', auth.required, getStatusesIncoming);

// Error handling
app.get('*', notFound);
app.use(errorHandler);

// *** Routes

export default app;
