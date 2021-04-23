import md5 from 'md5';
import { createClient } from "oicq";
import dotenv from 'dotenv'
dotenv.config()
const uin = parseInt(process.env.QQ_NUMBER); // your account
const bot = createClient(uin);

//监听并输入滑动验证码ticket
bot.on("system.login.slider", (data) => {
    process.stdin.once("data", (input: string) => {
        bot.sliderLogin(input);
    });
});

bot.on("message", (data) => {
    // console.log(data);

    // if (data.group_id > 0)
    // bot.sendGroupMsg(data.group_id, "hello");
    // else
    // bot.sendPrivateMsg(data.user_id, "hello");
});

bot.login(process.env.QQ_PASSWORD); // your password or password_md5
