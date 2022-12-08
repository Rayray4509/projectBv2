// import passport from "../config/passport";
// import regularExpression from '../lib/regularExpression';
import sql from '../model/MySQL/managerData.js';
import crypto from '../lib/crypto.js';
import {passport} from '../config/sessionPassport.js';
import { logger } from '../config/logger.js';
// console.log(crypto.passwordHash);

export default  {
    async register(req,res){
        //**參數未定**
        const {managerAccount,managerPassword,managerName} = req.body;
        const {passwordHash,salt} = crypto.passwordHash(managerPassword);
        const accountExist = sql.accountSelect(managerAccount);
        if (accountExist.length !== 0) return res.status(200).json({result:false,msg:"帳號重複"});
        const data = [managerAccount,passwordHash,managerName,salt];
        await sql.writeManagerInfo(data);
        res.status(200).json({result:true,msg:"wrote"});
    },
    login(req,res){
        passport.authenticate('local', function (err, user) {
            console.log("passport::",req.body);
            if (err) { return res.status(200).json({ "message": err }) }
            // Redirect if it fails
            if (!user) { return res.status(200).json({ "message": "帳號或密碼錯誤" }); }
            req.logIn(user, function (err) {
                console.log("login::",user);
                if (err) { return res.status(200).json({ "message": err }) }
                // Redirect if it succeeds
                return res.status(200).json({message:'登入成功，1秒後跳轉',userData:{permission:user.permission}});
            });
            logger.info(`${JSON.stringify(req.headers)} ${req.ip} %s`,{layer:"controller",act:"login"} )
        })(req,res);
    },
    logout(req,res){
        console.log(req.session);
        req.session.destroy();
        console.log(req.session);
        res.clearCookie('connect.sid');
        res.status(200).json({message:'登出成功，1秒後跳轉'});
        res.end();
    }
} 


// const login = (req, res, next) => {

//     passport.passport.authenticate('local', function (err, user) {
//         if (err) { return res.status(200).json({ "message": err }) }
//         // Redirect if it fails
//         if (!user) { return res.status(200).json({ "message": "帳號或密碼錯誤" }); }
//         req.logIn(user, function (err) {
//             if (err) { return res.status(200).json({ "message": err }) }
//             // Redirect if it succeeds
//             return next();
//         });
//     })(req, res, next);

    
// }
