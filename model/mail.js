import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile = path.join(__dirname, '../../.env');
dotenv.config({ path: envFile });

const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

console.log(CLIENT_ID);
console.log(CLEINT_SECRET);
console.log(REDIRECT_URI);
console.log(REFRESH_TOKEN);

const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token:REFRESH_TOKEN });

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