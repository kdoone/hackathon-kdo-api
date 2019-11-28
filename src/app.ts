import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import compression from 'compression';  // compresses requests
import path from 'path';
import { authenticate } from 'passport';
// Controllers
import { notFound, register, login, resetPassword, changePassword, isUsernameUnique, isEmailUnique, registerValidate, loginValidate, changePasswordValidate, resetPaswordValidate, isEmailUniqueValidate, isUsernameUniqueValidate, userInfo, logout, verifyToken, deleteUser, changeUsername, changeUsernameValidate, } from './controllers';
import { checkUserAgent } from './util';
import { checkToken, errorHandler, setLanguage } from './middlewares';
import i18n from 'i18n';

// Create Express server
const app = express();

// Connect to MongoDB
const connectToDb = async (): Promise<void> => {
    try {
        await connect(
            'mongodb://localhost:27017/hackathon',
            { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
        );

        console.log('Connected to Mongodb');
    }
    catch (err) {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    }
};
connectToDb();

i18n.configure({
    locales: ['en', 'ru', 'kz', 'es'],
    directory: __dirname + '/public/locales'
});

// Initialize all routes
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
    express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);
app.use(i18n.init);
app.use(setLanguage);

// Passport config
import './config/passport';

// *** Routes

// Middleware для авторизованных
// Перед запросом будет проверка есть ли токен, также дает доступ к текущему пользователю
const authJwt = authenticate('jwt', { session: false });
const auth = {
    required: [authJwt, checkToken]
};

// Auth
app.post('/api/register', registerValidate, checkUserAgent, register);
app.post('/api/login', loginValidate, checkUserAgent, login);
app.post('/api/reset-password', resetPaswordValidate, checkUserAgent, resetPassword);
app.post('/api/change-password', auth.required, changePasswordValidate, changePassword);
app.post('/api/exists-email', isEmailUniqueValidate, isEmailUnique);
app.post('/api/exists-username', isUsernameUniqueValidate, isUsernameUnique);
app.get('/api/user-info', auth.required, userInfo);
app.get('/api/logout', auth.required, logout);
app.get('/api/verify-token', verifyToken);
app.post('/api/delete-user', deleteUser);
app.post('/api/username', auth.required, changeUsernameValidate, changeUsername);


// Error handling
app.get('*', notFound);
app.use(errorHandler);
export default app;