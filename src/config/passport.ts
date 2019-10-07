import passport from 'passport';
import { Strategy as LocalStategy } from 'passport-local';
import { Users } from '../models';

passport.use(new LocalStategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
    session: false
}, (email, password, done) => {
    Users.findOne({ email }, (err, user) => {
        if (err) return done(err);

        // if email is incorrect
        if (!user) return done(null, false, { message: 'Incorrect email' });

        // if password is incorrect
        if (!user.validatePassword(password)) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
    });
}));