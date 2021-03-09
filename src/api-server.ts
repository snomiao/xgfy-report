// TODO 开发中

import express from 'express';
const app = express()
const port = process.env.PORT || 5000
const userRouter = express.Router();

// 规则(/^\/自动上报者添加 (.+)/, async (msg, [_, $1]) =>
//     await bot.sendMessage(msg.chat.id, '喵：' + await 自动上报者添加($1.trim().split(' ')).catch(e => e.toString())))
// 规则(/^\/自动上报 (.+)/, async (msg, [_, $1]) =>
//     await bot.sendMessage(msg.chat.id, '喵：' + await 自动上报者添加($1.trim().split(' ')).catch(e => e.toString())))
// 规则(/^\/上报者添加 (.+)/, async (msg, [_, $1]) =>
//     await bot.sendMessage(msg.chat.id, '喵：' + await 上报者添加($1.trim().split(' ')).catch(e => e.toString())))
// 规则(/^\/上报检查 (.+)/, async (msg, [_, $1]) =>
//     await bot.sendMessage(msg.chat.id, '喵：' + await 状态抓取更新({ _id: $1.trim() })))
// 规则(/^\/上报 (.+)/, async (msg, [_, $1]) =>
//     await bot.sendMessage(msg.chat.id, '喵：' + await 状态上报更新({ _id: $1.trim() })))
// 规则(/^\/找 (.+)/, async (msg, [_, $1]) =>
//     await bot.sendMessage(msg.chat.id, '喵：' + await 找($1.trim()).catch(e => e.toString())))
// 规则(/^\/重启/, async (msg, [_, $1]) =>
//     await bot.sendMessage(msg.chat.id, '喵：5s后重启……').then(() => setTimeout(() => process.exit(0), 5e3)))

app.get('/', (req, res) => { res.send('GET request to the homepage') })

const apiRouter = express.Router()
apiRouter.get('/', (req, res) => res.send('API v1'))
apiRouter.use('/user', userRouter)

app.use('/v1', apiRouter)
app.listen(port, () => console.log(`Example app listening on port port!`))
