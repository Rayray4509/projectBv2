import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import { con } from './conMySQL.js'

const mysqlStore = new MySQLStore({clearExpired : true ,
	// 清除過期會話的頻率；milliseconds: 
	checkExpirationInterval : 1000*30 , 
	// 有效會話的最大年齡；milliseconds: 
	expiration : 1000 * 60 * 60 * 12,}, con);

const sessionSetting = () => {
    return session({
        secret: 'projectB session',
        store: mysqlStore,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 12
            // secure: true 
        },
        
        // clearExpired: true,
        // // 清除過期會話的頻率；milliseconds: 
        // checkExpirationInterval: 900000,
        // // 有效會話的最大年齡；milliseconds: 
        // expiration: 86400000,
    })
};
export { sessionSetting }

