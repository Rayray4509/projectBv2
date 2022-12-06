import passport from 'passport';
import { Strategy } from 'passport-local';
import mysql from '../model/MySQL/managerData.js';
import crypto from '../lib/crypto.js';


const userInfo = {
    usernameField: 'loginAccount',
    passwordField: 'loginPassword'
}

const authVerify = (account, password, done) => {
    // console.log(account);
    mysql.getLoginData(account).then(res => {

        console.log("res::",res);

        const [user] = res;

        if (!user) return done(null, false);

        const isValid = crypto.passwordComparison(password, user.password, user.salt);
        console.log(isValid);
        if (isValid) {

            return done(null, user);
        } else {
            return done(null, false);
        }

    })
        .catch((err) => {
            console.log(err);
            done(err)
        });
}

const localStrategy = new Strategy(userInfo, authVerify);

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    mysql.getUserData(id).then(res => {
        const [user, ] = res;
        done(null, user);
    })
        .catch(err => {
            done(err);
        })
});

export {
    passport
}