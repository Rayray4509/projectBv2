import model from '../model/memberModel.js'

// 修改密碼
// 比對密碼格式 加密 寫入密碼
async function passwordRevise(req, res) {
    try {
        console.log('password:', req.body);
        const passwordFormat = model.passwordFormat(req.body.newPassword);
        if (!passwordFormat) return res.status(200).json({ "message": "密碼格式錯誤" });

        const passwordGen = await model.passwordGen(req.body.newPassword);
        if (passwordGen) {
            console.log('passwordGen', passwordGen);
            req.body.salt = passwordGen.salt;
            req.body.newPassword = passwordGen.password;
            console.log('加密後:', req.body);
        } else {
            return res.status(200).json({ "message": "加密錯誤" });
        }

        const passwordUpdate = await model.passwordUpdate(req.body);
        if (passwordUpdate) return res.status(200).json({ "message": "修改密碼成功" });
    } catch (err) {
        console.log(err);
        res.json(response(false, err))
    }
};


// 忘記密碼
async function passwordForgot(req, res) {
    try {
        const randNum = Math.random().toFixed(6).slice(-6);
        console.log(randNum);
        console.log('email:', req.body.forgotEmail);
        let data = {
            forgotEmail: req.body.forgotEmail,
            password: randNum,
            salt: ''
        }
        console.log(22,data);
        const emailCheck = await model.emailCheck(data.forgotEmail);
        if (emailCheck) return res.status(200).json({ "message": "信箱不存在" });

        const passwordGen = await model.passwordGen(data.password);
        if (passwordGen) {
            data.password = passwordGen.password;
            data.salt = passwordGen.salt;
            console.log(555, data);
        } else {
            return res.status(200).json({ "message": "加密錯誤" });
        }

        const randomPasswordUpdate = await model.randomPasswordUpdate(data);
        if (randomPasswordUpdate) console.log({ "message": "密碼寫入成功" });

        const emailSend = await model.passwordSend(data.forgotEmail,randNum);
        if (emailSend) {
            return res.json({ "message": "密碼已寄出" })
        };
    } catch (err) {
        console.log(err);
        res.json(response(false, err))
    }
}


export default {
    passwordRevise,
    passwordForgot
}