import passport from 'passport';
import { Users, UserDocument } from '../models';
import { Strategy as LocalStrategy } from 'passport-local';


passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
}, (email, password, done) => {
    Users.findOne({ email })
        .then((user: UserDocument) => {
            if (!user || !user.validatePassword(password)) {
                return done(null, false, { message: 'email or password : is invalid' });
            }

            return done(null, user);
        }).catch(done);
}));
//