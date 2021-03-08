import dotenv from 'dotenv'; dotenv.config()
import TelegramBot from 'node-telegram-bot-api';
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })


bot.onText(/\/添加 (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    bot.sendMessage(chatId, resp);
});
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId, 'Received your message')
});