import { con } from '../../config/conMySQL.js';



export default {
    //管理者資料寫入資料庫
    writeManagerInfo: async (data) => {
        const sql = 'INSERT INTO manager_account(account,password,name,salt,permission) VALUES(?,?,?,?,2)'
        await  con.execute(sql, data);
    },
    //獲取登入資料
    getLoginData: async (account) => {
        // console.log("sql::",account);
        const sql = `SELECT * FROM manager.user_account WHERE account = ? UNION SELECT * FROM manager.manager_account WHERE account = ? `
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
        const sql = `SELECT * FROM manager.user_account WHERE id = ? UNION SELECT * FROM manager.manager_account WHERE id = ?`
        const [row, field] = await con.execute(sql, [id]);
        return row;
    },
    emailSelect:async(email)=>{
        const sql =  `SELECT email FROM  manager.user_account WHERE email = ?`;
        const [[emailCheck]] = await con.execute(sql, [email]);
        return emailCheck;

    },
    accountSelect:async(data)=>{
        const sql =  `SELECT account FROM manager.user_account WHERE account = ? UNION SELECT account FROM manager.manager_account WHERE account = ?`;
        const [[account]] = await con.execute(sql, [data,data]);
        return account;
    },
    nameSelect:async(data)=>{
        const sql = `SELECT name FROM manager.user_account WHERE name = ? UNION SELECT name FROM manager.manager_account WHERE name = ?;`;
        const [[name]] = await con.execute(sql,[data, data]);
        return name;
    },
    accountCreate:async(data)=>{
        const sql = `INSERT INTO manager.user_account ( status, permission, account, password, name, email, salt , permission)  VALUES (?, ?, ?, ?, ?, ?, 1)`;
        const accountCreate = await con.execute(sql, data);
        return accountCreate;
    },
    passwordUpdate:async(dataCreate)=>{
        const sql = `UPDATE manager.user_account SET password = ?, salt = ? WHERE user_id = 1`;
        const accountCreate = await con.execute(sql, dataCreate);
        return accountCreate;
    },
    randomPasswordUpdate:async(dataCreate)=>{
        const sql = `UPDATE manager.user_account SET password = ?, salt = ? WHERE email = ?`;
        const passwordCreate = await con.execute(sql, dataCreate);
        return passwordCreate;
    }
    
}




// export async function writeManagerInfo(data){
//     con.execute(sqlCommand.writeManager,[data]);
// };
// export async function getManagerData(id){
//     const [row,field] = con.execute(sqlCommand.getManager,[id]);
//     return row;
// };

// export async function setManagerToken({token,token_exptime,id}) {
//     con.execute(sqlCommand.writeManagerToken,[token,token_exptime,id]);
// }

