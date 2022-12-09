import mail from "./mail.js";
import crypto from "crypto";
import {reTest} from "../lib/regularExpression.js"
import sql from "./MySQL/managerData.js"

// 1.發送驗證信
// 比對信箱格式
// 生成隨機6位數驗證碼 - 暫存驗證碼
// 寄出驗證碼

// 2.註冊
// 比對帳號格式
// 比對密碼格式
// 比對會員信箱是否重複
// 比對帳號是否重複
// 比對驗證碼 成功後刪除驗證碼
// 密碼加密
// 寫入資料庫
// 註冊成功

// 資料格式
// const data = {
//     account,
//     password,
//     userName,
//     email,
//     verify,
// }


let verifyCode = {};

// 比對信箱格式
function emailFormat(data) {
    const result = reTest("email",data)
    return result;
}

// 比對會員信箱是否重複
async function emailCheck(data) {
    const emailCheck = await sql.emailSelect(data);
    try {
        if (emailCheck) {
            console.log('email:', emailCheck);
            return (false);
        } else {
            return (true);
        };

    } catch (err) {
        console.log(err);
        return (false, err);
    }
}

// 生成隨機6位數驗證碼 - 暫存驗證碼 - 發送驗證碼
async function verifySend(data) {
    const randNum = Math.random().toFixed(6).slice(-6);
    console.log(randNum);

    verifyCode[data] = randNum;
    console.log(verifyCode);
    const sendVerify = await mail.emailSend(data, randNum);
    try {
        if (sendVerify) {
            console.log('verifyCode:', verifyCode);
            console.log("message:", "驗證碼已寄出");
            return true;
        } else {
            console.log(false, "請重新寄送email");
            return false;
        }
    } catch (err) {
        console.log(err);
        return (false, err);
    }
}

// 比對驗證碼後刪除
function verifyDelete(email, verify) {
    console.log(verifyCode);
    if (verify === verifyCode[`${email}`]) {
        delete verifyCode[`${email}`];
        console.log('驗證碼刪除');
        return true;
    } else {
        console.log('驗證碼錯誤');
        return false;
    }
}

// 比對帳號格式
function accountFormat(data) {
    console.log('account:', data);
    const accountFormat = /^[0-9A-Za-z,!@#$%^&*()><?。+=]{6,20}$/;
    if (accountFormat.test(data)) return true;
}

// 比對密碼格式
function passwordFormat(data) {
    console.log('password:', data);
    const passwordFormat = /^[0-9A-Za-z]{6,20}$/;
    if (passwordFormat.test(data)) return true;
}

// 比對帳號是否重複
async function accountCheck(data) {
    const accountCheck = await sql.accountSelect(data)
    try {
        console.log('accountCheck:', accountCheck);
        if (accountCheck) {
            return (false);
        } else {
            return (true);
        };

    } catch (err) {
        console.log(err);
        return (false, err);
    }
}

// 密碼加密
async function passwordGen(data) {
    let salt = crypto.randomBytes(32).toString('hex');
    let genHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt: salt,
        password: genHash
    };
}

// 註冊 (寫入資料庫)
async function accountCreate(data) {
    const status = 1;
    const permission = 1;
    const dataCreate = [status, permission, data.account, data.password, data.username, data.email, data.salt];
    if (dataCreate) {
        console.log('註冊資料', dataCreate);
        const accountCreate = await sql.accountCreate(dataCreate)
        try {
            if (accountCreate) {
                console.log('寫入資料成功');
                return true;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

// 管理員密碼修改
async function managerPasswordUpdate(data,user) {
    const dataCreate = [data.newPassword, data.salt ,user.account];
    if (dataCreate) {
        const passwordCreate = await sql.managerPasswordUpdate(dataCreate);
        try {
            if (passwordCreate) {
                console.log('寫入資料成功');
                return true;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

// 會員密碼修改
async function userPasswordUpdate(data,user) {
    const dataCreate = [data.newPassword, data.salt ,user.account];
    if (dataCreate) {
        const passwordCreate = await sql.userPasswordUpdate(dataCreate);
        try {
            if (passwordCreate) {
                console.log('寫入資料成功');
                return true;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

// 忘記密碼
// 資料庫比對信箱
// 寄出密碼

// 隨機生成密碼 寫入資料庫
async function randomPasswordUpdate(data){
    const dataCreate = [data.password, data.salt, data.forgotEmail];
    if (dataCreate) {
        const passwordCreate = await sql.randomPasswordUpdate(dataCreate);
        try {
            if (passwordCreate) {
                console.log('寫入資料成功');
                return true;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

// 寄出密碼
async function passwordSend(data,randNum) {
    console.log(44,randNum);
    const dataSend = await mail.emailSendPassword(data, randNum);
    if (dataSend) {
        console.log('dataSend:', dataSend);
        console.log("message:", "密碼已寄出");
        return (true,randNum);
    } else {
        console.log(false, "請重新寄送email");
        return false;
    }
}


export default {
    accountFormat,
    passwordFormat,
    accountCheck,
    emailFormat,
    emailCheck,
    verifySend,
    verifyDelete,
    passwordGen,
    accountCreate,
    userPasswordUpdate,
    managerPasswordUpdate,
    passwordSend,
    randomPasswordUpdate
}