import TelegramBot from 'node-telegram-bot-api';
export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
export const 警报 = async (msg: string) => (console.error(msg), await bot.sendMessage(process.env.BOT_ALERT_CHATID, msg))
export const 通知 = async (msg: string) => (console.info(msg), await bot.sendMessage(process.env.BOT_NOTIFY_CHATID, msg))

bot.onText(/\/help/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：使用方法：\n' +
    '/check _学号或名字\n' +
    '/report _学号或名字\n' +
    '/report _学号或名字\n' +
    '/autoReporterAdd _学号\n' +
    '/autoReporterRemove _学号或名字\n' +
    '/autoReporterListCheck?\n' +
    '/autoReporterList _学号或名字?\n' +
    '/autoReporterList _学号或名字?\n' +
    '/autoReport _学号或名字\n' +
    '/保护上报者添加 _学号\n' +
    '/保护上报移除 _学号或名字\n' +
    '/保护上报 _学号或名字\n' +
    '/保护上报者检查\n' +
    '/上报者添加 _学号\n' +
    '/上报检查 _学号或名字\n' +
    '/上报 _学号或名字\n' +
    '/找 _学号或名字\n' +
    '/ping\n' +
    '/重启\n' +
    '/help\n'))

// bot.onText(/\/autoReport者添加 (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 自动上报者添加($1.trim().split(' ')).catch(e => e.toString())))
// bot.onText(/\/autoReport (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 自动上报($1.trim()).catch(e => e.toString())))
// bot.onText(/\/autoReport移除 (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 自动上报移除($1.trim()).catch(e => e.toString())))
// bot.onText(/\/autoReport者检查/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + (await pMap(await db.上报者状态.多查列({ 自动: true }), async ({ _id }) => await 状态抓取更新({ _id }))).join(' ')))
// bot.onText(/\/保护上报者添加 (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 保护上报者添加($1.trim().split(' ')).catch(e => e.toString())))
// bot.onText(/\/保护上报 (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 保护上报($1.trim()).catch(e => e.toString())))
// bot.onText(/\/保护上报移除 (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 保护上报移除($1.trim()).catch(e => e.toString())))
// bot.onText(/\/保护上报者检查/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + (await pMap(await db.上报者状态.多查列({ 保护: true }), async ({ _id }) => await 状态抓取更新({ _id }))).join(' ')))
// bot.onText(/\/上报者添加 (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 上报者添加($1.trim().split(' ')).catch(e => e.toString())))
// bot.onText(/\/上报检查 (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 上报检查($1.trim())))
// bot.onText(/\/上报 (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 上报($1.trim())))
// bot.onText(/\/找 (.+)/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：' + await 找($1.trim()).catch(e => e.toString())))
// bot.onText(/\/重启/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵：5s后重启……').then(() => setTimeout(() => process.exit(0), 5e3)))
// bot.onText(/\/ping/, async (msg, [_, $1]) => await bot.sendMessage(msg.chat.id, '喵！'))

// // tgbot退出 = async () => {
// //     await bot.stopPolling();
// //     await bot.close();
// // };
