import crypto from "crypto";


export default {
    passwordHash (password){
        const salt = crypto.randomBytes(32).toString('hex');
        const passwordHash = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex');
        return {
            salt,
            passwordHash
        };
    },
    passwordComparison(password,hash,salt){
        const hashVerify = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex');
        return hash === hashVerify;
    }
};
