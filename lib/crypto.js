import crypto from "crypto";
import { Buffer } from 'buffer';
// console.log(crypto);

export default {
    passwordHash (password){
        const salt = crypto.randomBytes(32).toString('hex');
        const passwordHash = crypto.pbkdf2Sync(password,salt,1000,64,'sha512').toString('hex');
        return {
            salt,
            passwordHash
        };
    },
    passwordComparison(password,hash,salt){
        const hashVerify = crypto.pbkdf2Sync(password,salt,1000,64,'sha512').toString('hex');
        return hash === hashVerify;
    }
};






// const buf = Buffer.alloc(10);
// console.log("buf::",buf);
// crypto.randomFill(buf, (err, buf) => {
//   if (err) throw err;
//   console.log(buf.toString('hex'));
// });
// const a = new Uint32Array(10);
// console.log("a::",a);
// console.log(Buffer.from(crypto.randomFillSync(a).buffer,
//                         a.byteOffset, a.byteLength).toString('hex'));

// const secret = 'abcdefg';
// const hash = crypto.createHmac('sha256', secret)
//                .update('I love cupcakes')
//                .digest('hex');
// console.log(hash);