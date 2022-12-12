import sql from '../model/MySQL/managerData.js';
import crypto from '../lib/crypto.js';
import {passport} from '../config/sessionPassport.js';
import { logger } from '../config/logger.js';
import { reTest } from '../lib/regularExpression.js';

export default  {
    async register(req,res){
        try {

            const {account,password,name} = req.body;
            if((!reTest("account",account)) || (!reTest("password",password))) return res.status(200).json({result:false,msg:"格式錯誤"});
            const {passwordHash,salt} = crypto.passwordHash(password);
            const accountExist = await sql.accountSelect(account);
            if (accountExist) return res.status(200).json({result:false,msg:"帳號重複"});
            const data = [account,passwordHash,name,salt];
            await sql.writeManagerInfo(data);
            res.status(200).json({result:true,msg:"wrote"});

            
        } catch (error) {

            console.log(error);
            return res.status(406).json({"message":"err"});
            
        }

    },
    login(req,res){
        try {
            const t1 = performance.timeOrigin;
            passport.authenticate('local', function (err, user) {
                console.log("passport::",req.body);
                if (err) { return res.status(200).json({ "message": err }) }
            // Redirect if it fails
                if (!user) { return res.status(200).json({ "message": "帳號或密碼錯誤" }); }
                req.logIn(user, function (err) {
                    console.log("login::",user);
                    if (err) { return res.status(200).json({ "message": err }) }
                // Redirect if it succeeds
                    return res.status(200).json({
                        message:'登入成功，1秒後跳轉',
                        userData:{
                            permission:user.permission,
                            name:user.name
                        }
                    });
                });
                const t2 =  performance.timeOrigin;
                console.log("t1::",t1);
                console.log("t2::",t2);
                console.log("execute times ::", t2 - t1);
                logger.info(`frontEnd_serverIP::${req.headers.origin} , clientIP::${req.headers["x-forwarded-for"]} , res_statusCode:${200}, user::${user.account} timeTaken::${Math.round(t2-t1)} %s`,{layer:"controller",act:'login'} );
            })(req,res); 
        } catch (error) {
                logger.error(error);
                console.log(error);
                return res.status(406).json({"message":"err"});
        }
        
    },
    logout(req,res){
        req.session.destroy();
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

console.log('test');
