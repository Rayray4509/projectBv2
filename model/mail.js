import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = '756484568220-48ai6cq0bdqoun948eq6kh6q5t91fruq.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04q0kdb6KecTmCgYIARAAGAQSNwF-L9IrhnDlFowWu0v3OqWteErR-nGtWtxhgXgUemI3TGn0ru8B3Nr4sZv1qmCIIS4QD4a_TLQ'

const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function emailSend(email, vCode) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 's107328021@mail1.ncnu.edu.tw',
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'BOWA官網',
            to: `${email}`,
            subject: '歡迎註冊本網站',
            text: '歡迎註冊本網站',
            html: `<h1>您的驗證碼是: [${vCode}]</h1>`,
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}


async function emailSendPassword(email, vCode) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 's107328021@mail1.ncnu.edu.tw',
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'BOWA官網',
            to: `${email}`,
            subject: '親愛的會員您好',
            text: '親愛的會員您好',
            html: `<h1>您的密碼是: [${vCode}] </h1>`
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}


export default {
    emailSend,
    emailSendPassword
}