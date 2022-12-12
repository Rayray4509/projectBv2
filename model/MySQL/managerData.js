import { con } from '../../config/conMySQL.js';



export default {
    //管理者資料寫入資料庫
    writeManagerInfo: async (data) => {
        const sql = 'INSERT INTO manager_account(status,account,password,name,salt,permission) VALUES(1,?,?,?,?,2)'
        await  con.execute(sql, data);
    },
    //獲取登入資料
    getLoginData: async (account) => {
        // console.log("sql::",account);
        const sql = `SELECT * FROM user_account WHERE account = ? 
                     UNION  
                     SELECT *,Null as level_id,Null as experience,Null as email FROM manager_account WHERE account = ?`;
        const [row, field] = await con.execute(sql,[account,account]);
        console.log("sql.getLoginData::",row);
        return row;
    },
    //設定管理者token
    setManagerToken: async ({ token, token_exptime, id }) => {
        const sql = 'UPDATE manager_account set token=?,token_exptime=? WHERE id = ?'
        con.execute(sql, [token, token_exptime, id]);
    },
    //獲取所有使用者資訊
    getUserData: async (id) => {
        const sql = `SELECT * FROM user_account WHERE id = ? UNION SELECT * FROM manager_account WHERE id = ?`
        const [row, field] = await con.execute(sql, [id]);
        return row;
    },
    //搜尋所有會員email
    emailSelect:async(email)=>{
        const sql =  `SELECT email FROM  user_account WHERE email = ?`;
        const [[emailCheck]] = await con.execute(sql, [email]);
        return emailCheck;
    },
    //搜尋管理員及會員帳號
    accountSelect:async(data)=>{
        const sql =  `SELECT account FROM user_account WHERE account = ? UNION SELECT account FROM manager_account WHERE account = ?`;
        const [[account]] = await con.execute(sql, [data,data]);
        console.log(account);
        return account;
    },
    //會員資料寫進會員資料庫
    accountCreate:async(data)=>{
        const sql = `INSERT INTO user_account ( status, permission, account, password, name, email, salt)  VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const accountCreate = await con.execute(sql, data);
        return accountCreate;
    },
    //會員修改密碼
    userPasswordUpdate:async(userPassword)=>{
        const sql = `UPDATE user_account SET password = ?, salt = ? WHERE account = ?`;
        const userPasswordUpdate = await con.execute(sql, userPassword);
        return userPasswordUpdate;
    },
    //管理員修改密碼
    managerPasswordUpdate:async(managerPassword)=>{
        const sql = `UPDATE manager_account SET password = ?, salt = ? WHERE account = ?`;
        const managerPasswordUpdate = await con.execute(sql, managerPassword);
        return managerPasswordUpdate;
    },
    //忘記密碼 更新隨機密碼寫入資料庫
    randomPasswordUpdate:async(data)=>{
        const sql =  `UPDATE user_account SET password = ?, salt = ? WHERE email = ? `;
        const account = await con.execute(sql, data);
        console.log(account);
        return account;
    },
}

