import passport from 'passport';
import { Strategy as LocalStategy } from 'passport-local';
import { User } from '../models';

passport.use(new LocalStategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, (email, password, done: any) => {
    User.findOne({ email }, (err, user) => {
        if (err) return done(err);

        // if email is incorrect
        if (!user) return done(null, false, {
            status: 'rejected',
            statusCode: 1,
            message: 'Incorrect email'
        });

        // if password is incorrect
        if (!user.validatePassword(password)) {
            return done(null, false, {
                status: 'rejected',
                statusCode: 3,
                message: 'Incorrect password'
            });
        }

        return done(null, user);
    });
}));