import model from '../model/memberModel.js'

//註冊
async function register(req, res) {
    console.log("data:", req.body);
    try {
        // 比對帳號格式
        const accountCheckResult = model.accountFormat(req.body.account)
        if (!accountCheckResult) return res.status(200).json({ "message": "帳號格式錯誤" });
        // 比對密碼格式
        const passwordFormat = model.passwordFormat(req.body.password);
        if (!passwordFormat) return res.status(200).json({ "message": "密碼格式錯誤" });
        // 比對資料庫有無重複帳號
        const accountCheck = await model.accountCheck(req.body.account);
        if (!accountCheck) return res.status(200).json({ "message": "帳號已被使用" });
        // 比對信箱及驗證碼是否正確
        const verifyDelete = model.verifyDelete(req.body.email, req.body.verify);
        if (!verifyDelete) return res.status(200).json({ "message": "驗證碼錯誤" });
        // 密碼加密
        const passwordGen = await model.passwordGen(req.body.password);
        if (passwordGen) {
            req.body.salt = passwordGen.salt;
            req.body.password = passwordGen.password;
            console.log('加密後:',req.body);
        } else {
            return res.status(200).json({ "message": "加密錯誤" });
        }
        // 寫入帳號 成功後回傳訊息
        const accountCreate = await model.accountCreate(req.body);
        if(accountCreate){
            console.log('帳號創建成功',accountCreate);
            res.json({"message":"註冊成功"})
        }else{
            return res.status(200).json({ "message": "帳號創建錯誤" });
        }
    } catch (err) {
        console.log('錯誤:',err);
        res.json(false, err)
    }
};

//寄驗證信
async function sendEmail(req, res) {
    try {
        console.log('email:', req.body.email);
        const emailFormat = model.emailFormat(req.body.email);
        if (!emailFormat) return res.status(200).json({ "message": "信箱格式錯誤" });
        const emailCheck = await model.emailCheck(req.body.email);
        if (!emailCheck) return res.status(200).json({ "message": "信箱已註冊" });
        const sendVerify = await model.verifySend(req.body.email);
        if (sendVerify) return res.json({ "message": "驗證碼已寄出" });
    } catch (err) {
        console.log(err);
        res.json(response(false, err))
    }
};



export default {
    register,
    sendEmail,
}