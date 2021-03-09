/**
 * 自动上报
 * author: YiDong Zhuo(snomiao@gmail.com)
 */
import md5 from 'md5'
import fetch from 'node-fetch'
import { 数列生成, 列不含值否, 列含值否, 列差, 表键列, 表键筛, 列映 } from 'sno-utils/lib/表列'
import { 瞄于 } from 'sno-utils/lib/测试';
import pMap from 'p-map';
import snoMongoKu from 'sno-mongo-ku';
import { HttpsProxyAgent } from 'https-proxy-agent'
import dotenv from 'dotenv'; dotenv.config()
import TelegramBot from 'node-telegram-bot-api';
import { 睡 } from 'sno-utils/lib/异步';
const _学号 = 数列生成(40, 1).map(e => (e + '').padStart(2, '0'))
const 理院17列表 = 列差([
    ...列映(e => '17122111' + e)(_学号),
    ...列映(e => '17122112' + e)(_学号),
    ...列映(e => '17122311' + e)(_学号),
    ...列映(e => '17122111' + e)(_学号),
], '1712211125|1712231219|1712211137|1712211231|1712231140|1712211217'.split('|'))

const 上报系统构建 = async ({ 启用bot } = { 启用bot: false }) => {
    // .result.filter(e=>e.message.text.match('/add'))
    const { MONGO_URI, HEART_API, ALERT_API, HTTP_PROXY } = process.env
    const db = await snoMongoKu(MONGO_URI); db.上报历史, db.上报者状态, db.上报者信息
    const 通知 = async (消息: string) => (console.log('通知', 消息), await fetch(encodeURI(HEART_API.replace(/%s/g, 消息)), {
        ...HTTP_PROXY && { agent: new HttpsProxyAgent(HTTP_PROXY) }
    }).then(e => e.json()).then(e => { if (e.ok) return `✅通知：${消息}`; throw new Error('通知未成功, 返回' + JSON.stringify(e)) }))
    const 警报 = async (消息: string) => (console.log('警报', 消息), await fetch(encodeURI(ALERT_API.replace(/%s/g, 消息)), {
        ...HTTP_PROXY && { agent: new HttpsProxyAgent(HTTP_PROXY) }
    }).then(e => e.json()).then(e => { if (e.ok) return `❌警报：${消息}`; throw new Error('警报未成功, 返回' + JSON.stringify(e)) }))
    const decodes获取 = (usercode: string, ts: string) =>
        (n => (n.slice(16, 32) + n.slice(0, 16)).toUpperCase())
            (md5(`${usercode}Unifri${ts}`))
    const API请求 = async (路径: string, 表体: any, { ts = (+new Date()).toString() } = {}) =>
        await fetch('http://xgfy.sit.edu.cn' + 瞄于('API请求')(路径), {
            method: 'post', body: JSON.stringify(表体),
            headers: { 'content-type': 'application/json', decodes: decodes获取(表体.usercode ?? 表体.code ?? 表体._id, ts), ts },
            ...HTTP_PROXY && { agent: new HttpsProxyAgent(HTTP_PROXY) }
        }).then(e => e.json())
    const 信息抓取更新 = async ({ _id }) => await API请求('/report/report/selectByCode', { code: _id })
        .then(返回JSON => {
            if (返回JSON?.code !== 0) throw new EvalError(`${_id} 信息返回代码异常：` + JSON.stringify(返回JSON))
            return ({ _id, ...返回JSON.data, 更新于: new Date() });
        }).then(async ({ _id, ...表 }) => (await db.上报者信息.单补({ _id, ...表, 错误: null }),
            `✅${_id.slice(0, 2) + (表?.deptname?.slice(0, 1) || '') + (表?.name || _id.slice(2))}`))
        .catch(错误 => (db.上报者信息.单补({ _id, 错误: 错误.toString() }), `❌${_id} `));
    const 旧信息抓取更新通知 = async () => await pMap(
        await db.上报者信息.聚合([
            { $match: { 更新于: 较早于(-30 * 86400e3) } }, { $project: { _id: 1 } }, { $sample: { size: 100 } }]).toArray(),
        信息抓取更新, { concurrency: 3, stopOnError: false })
        .then(async 表列 => 表列.length && await 通知('信息更新' + 表列.join(' ')))
    const 状态抓取 = async ({ _id }) =>
        await API请求('/report/report/getMyReport', { usercode: _id })
            .then(返回 => {
                if (返回.code !== 0) throw new Error((`${_id}上报数据获取异常：${JSON.stringify(返回)}`));
                const 样例状态 = { "batchno": 20210130, "usercode": "xxxx", "username": "xxxx", "deptno": "200300", "jiguan": 15, "fanxiang": 0, "lvyou": 0, "jiechu": 0, "jiechuqy": 0, "notforegoing": 0, "currentsituation": 3, "creattime": null, "mobile": "15618104781", "auditor": "auto", "usertype": 2, "isback": 0, "isinhubei": 0, "jttw": 0, "jiaotongfangshi": 0, "studentclass": null, "wendu2": null, "ksfl2": null, "jttw2": null, "currentsituation2": null, "wendu": 0, "ksfl": 0, "mjjcqzhz": 0, "qwhtjzgfxdq": 0, "tzrqwhtjzgfxdq": 0, "position": "上海市-市辖区", "inschool": 0, "szdsfzgfxdq": 0, "szdssfyzgfxdq": 0, "cfsj": null, "drwf": 0, "mdd": null, "sy": null, "jtgj": 0, "jtcc": null, "remarks": "", "id": 6437001 }
                const 状态 = { ...返回?.data?.[0], 更新于: new Date() }
                if (!状态?.batchno) throw new Error((`${_id}上报数据获取异常：${JSON.stringify(返回)}`));
                false && 瞄于('抓取返回键列差')(列差(表键列(样例状态), 表键列(状态 || {})))
                return { _id, 历史: 返回.data, 状态 };
            })
    const 状态上报 = async ({ _id, ...状态 }) => {
        if (!状态) throw new Error((`${_id}昨日数据格式异常：${JSON.stringify(状态)}`));
        const 捕获请求 = { "usercode": "str", "username": "str", "usertype": 2, "jiguan": 3, "deptno": "201100", "wendu": 0, "ksfl": 0, "mjjcqzhz": 0, "qwhtjzgfxdq": 0, "tzrqwhtjzgfxdq": 0, "position": "上海-上海", "inschool": 0, "szdsfzgfxdq": 0, "szdssfyzgfxdq": 0, "cfsj": "请选择", "drwf": 0, "mdd": "请选择", "sy": null, "jtgj": 0, "jtcc": null, "remarks": "", "currentsituation": 3 };
        const 正上报数据 = 表键筛(列含值否([
            "usercode", "username", "usertype", "jiguan", "deptno", "wendu", "ksfl", "mjjcqzhz", "qwhtjzgfxdq",
            "tzrqwhtjzgfxdq", "position", "inschool", "szdsfzgfxdq", "szdssfyzgfxdq", "cfsj", "drwf", "mdd",
            "sy", "jtgj", "jtcc", "remarks", "currentsituation"
        ]))(状态);
        const 反上报数据 = 表键筛(列不含值否([
            'batchno', 'fanxiang', 'lvyou', 'jiechu', 'jiechuqy', 'notforegoing',
            'creattime', 'mobile', 'auditor', 'isback', 'isinhubei', 'jttw',
            'jiaotongfangshi', 'studentclass', 'wendu2', 'ksfl2', 'jttw2', 'currentsituation2', 'id'
        ]))(状态);
        // const 实上报数据 = [正上报数据, 反上报数据][2 * Math.random() | 0];
        const 实上报数据 = 正上报数据
        false && 瞄于('上报请求键列差')(列差(表键列(捕获请求), 表键列(正上报数据)));
        false && 瞄于('上报请求键列差')(列差(表键列(捕获请求), 表键列(反上报数据)));
        const 返回 = await API请求('/report/report/todayReport', 实上报数据);
        if (返回.code !== 0)
            throw new EvalError(JSON.stringify({ _id, ...返回 }));
        return { _id, ...状态 };
    }
    const 上报者添加 = async (上报者列: string[]) => await db.上报者.多补(上报者列.map(_id => ({ _id })))
        .then(async () => await db.上报者.aggregate([{ $match: { 删除于: null } }, { $merge: { into: '上报者状态' } }]).next())
        .then(async () => await db.上报者.aggregate([{ $match: { 删除于: null } }, { $merge: { into: '上报者信息' } }]).next())
        .then(async () => `✅上报者添加_x${上报者列.length}`)
    const 自动上报者添加 = async (上报者列: string[]) => await db.上报者.多补(上报者列.map(_id => ({ _id, 自动: true })))
        .then(async () => await db.上报者.aggregate([{ $match: { 删除于: null } }, { $merge: { into: '上报者状态' } }]).next())
        .then(async () => `✅自动上报者添加_x${上报者列.length}`)
    const 状态抓取更新 = async ({ _id }) => await 状态抓取({ _id })
        .then(async ({ _id, 状态, 历史 }) => (await Promise.all([
            db.上报者状态.单补({ _id, ...状态, 更新于: new Date(), 错误: null }),
            db.上报历史.多补(历史.map(({ id, ...表 }) => ({ _id: id, ...表, 更新于: new Date() }))),
        ]), `✅${_id}`))
        .catch(错误 => (db.上报者状态.单补({ _id, 错误 }), `❌${_id} ${错误.toString()}`));
    const 随机衰减 = () => (1 - Math.random() / 6)
    const 约晚于 = (时差: number) => new Date(+new Date() + (时差 * 随机衰减()))
    const 状态上报更新 = async ({ _id, ...状态 }) =>
        await (状态.batchno ? Promise.resolve({ _id, ...状态 }) : 状态抓取({ _id }))
            .then(状态上报)
            .then(({ _id, ...其它 }) => db.上报者状态.单补({
                _id, ...其它,
                计划时刻: new Date(+new Date() + (6 - Math.random()) * 3600e3) // 成功了就计划 5-6 hour 之后再试一次
            }))
            .catch(错误 => (db.上报者状态.单补({ _id, 错误, 计划于: 约晚于(15 * 60e3) }), `❌${_id} ` + 错误.toString()));
    const 今日批号获取 = () => parseInt(new Date(+new Date() + 8 * 3600e3 /* 北京时间 */).toISOString().replace(/\D/g, '').slice(0, 8))
    const 今日状态表述 = ({ _id, ...表 }) =>
        (表?.batchno === 今日批号获取() ? "✅" : "❌") + (表?.username ?? 表.name ?? _id);
    const 较早于 = (时差: number) => ({ $not: { $gt: new Date(+new Date() + 时差) } })
    const 上报异常者状态抓取更新 = async () => await pMap(
        await db.上报者状态.聚合([
            { $match: { batchno: { $ne: 今日批号获取() }, 计划于: 较早于(0), 更新于: 较早于(-37 * 60e3 /* 约 37分钟访问一次  */ * 随机衰减()) } }, { $project: { _id: 1 } }, { $sample: { size: 100 } }]).toArray(),
        状态抓取更新, { concurrency: 3, stopOnError: false }).then(e => (`✅上报异常者状态抓取更新_x` + e?.length)).catch(console.error)
    const 上报异常者上报 = async () => await pMap(
        await db.上报者状态.聚合([
            { $match: { batchno: { $ne: 今日批号获取() }, 计划于: 较早于(0) } }, { $sample: { size: 100 } }]).toArray(),
        状态上报更新, { concurrency: 3, stopOnError: false }).then(e => (`✅上报异常者上报_x` + e?.length)).catch(console.error)
    const 自动上报异常者状态抓取更新 = async () => await pMap(
        await db.上报者状态.聚合([
            { $match: { batchno: { $ne: 今日批号获取() }, 计划于: 较早于(0), 自动: true } }, { $project: { _id: 1 } }, { $sample: { size: 100 } }]).toArray(),
        状态抓取更新, { concurrency: 3, stopOnError: false }).then(e => (`✅自动上报异常者状态抓取更新_x` + e?.length)).catch(console.error)
    const 自动上报异常者上报 = async () => await pMap(
        await db.上报者状态.聚合([
            { $match: { batchno: { $ne: 今日批号获取() }, 计划于: 较早于(0), 自动: true } }, { $sample: { size: 100 } }]).toArray(),
        状态上报更新, { concurrency: 3, stopOnError: false }).then(e => (`✅自动上报异常者上报_x` + e?.length)).catch(console.error)
    const 上报异常者通知 = async () => await db.上报者状态.聚合([
        { $match: { batchno: { $ne: 今日批号获取() }, 更新于: 较早于(-57 * 60e3 /* 57分钟前 */) } }, { $sample: { size: 100 } }]).toArray()
        .then(async 表列 => (表列.length && await Promise.resolve(表列)
            .then(async () => await 通知('上报异常：' + 表列.map(e => 今日状态表述(e)).join(' ')))
            .then(async () => await db.上报者状态.多补(表列.map(({ _id }) => ({ _id, 异常通知批号: 今日批号获取() }))))
            .then(async () => `✅上报异常者通知_x${表列.length}`)))
    const 上报完成者通知 = async () => await db.上报者状态.聚合([
        { $match: { batchno: { $eq: 今日批号获取() }, 通知批号: { $ne: 今日批号获取() } } }, { $sample: { size: 100 } }]).toArray()
        .then(async 表列 => (表列.length && await Promise.resolve(表列)
            .then(async () => await 通知('上报完成：' + 表列.map(e => 今日状态表述(e)).join(' ')))
            .then(async () => await db.上报者状态.多补(表列.map(({ _id }) => ({ _id, 上报早于: new Date(), 通知批号: 今日批号获取() }))))
            .then(async () => `✅上报完成者通知_x${表列.length}`)))
    const 自动上报异常警报 = async () => await db.上报者状态.聚合([
        { $match: { 自动: true, batchno: { $ne: 今日批号获取() }, /* 异常通知批号: { $ne: 今日批号获取() } */ } }, { $sample: { size: 100 } }]).toArray()
        .then(async 表列 => (表列.length && await Promise.resolve(表列)
            .then(async () => await 警报('自动上报异常：' + 表列.map(e => 今日状态表述(e)).join('\n')))
            .then(async () => await db.上报者状态.多补(表列.map(({ _id }) => ({ _id, 异常通知批号: 今日批号获取() }))))
            .then(async () => `✅自动上报异常警报_x${表列.length}`)))
    const 无效上报者禁用通知 = async () => await db.上报者状态.聚合([
        { $match: { username: null } }, { $sample: { size: 100 } }]).toArray()
        .then(async 表列 => (表列.length && await Promise.resolve(表列)
            .then(async () => await 通知('无效上报者禁用：' + 表列.map(e => 今日状态表述(e)).join('\n')))
            .then(async () => await db.上报者.多补(表列.map(({ _id, ...表 }) => ({ _id, ...表, 删除于: new Date() }))))
            .then(async () => await Promise.all(表列.map(({ _id }) => db.上报者状态.单删({ _id }))))
            .then(async () => await 上报者添加(表列.map(({ _id }) => _id)))
        ))
    const 无效自动上报者禁用警报 = async () => await db.上报者状态.聚合([
        { $match: { 自动: true, username: null } }, { $sample: { size: 100 } }]).toArray()
        .then(async 表列 => (表列.length && await Promise.resolve(表列)
            .then(async () => await 警报('无效自动上报者禁用：' + 表列.map(e => 今日状态表述(e)).join('\n')))
            .then(async () => await db.上报者.多补(表列.map(({ _id }, ...表) => ({ _id, ...表, 删除于: new Date() }))))
            .then(async () => await Promise.all(表列.map(({ _id }) => db.上报者状态.单删({ _id }))))
            .then(async () => await 上报者添加(表列.map(({ _id }) => _id)))
        ))

    const 找 = async (搜索: string) => (await db.上报者信息.find({ $or: [{ name: new RegExp(搜索) }, { mobile: 搜索 }, { code: 搜索 }] }).limit(10).toArray())
        .map((e: any) => `${e.code || e._id} ${e.name} ${e.mobile}`).join('\n')

    let tgbot退出 = null
    if (启用bot) {
        const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
        bot.onText(/\/自动上报者添加 (.+)/, async (msg, [_, $1]) =>
            await bot.sendMessage(msg.chat.id, '喵：' + await 自动上报者添加($1.trim().split(' ')).catch(e => e.toString())))
        bot.onText(/\/自动上报 (.+)/, async (msg, [_, $1]) =>
            await bot.sendMessage(msg.chat.id, '喵：' + await 自动上报者添加($1.trim().split(' ')).catch(e => e.toString())))
        bot.onText(/\/上报者添加 (.+)/, async (msg, [_, $1]) =>
            await bot.sendMessage(msg.chat.id, '喵：' + await 上报者添加($1.trim().split(' ')).catch(e => e.toString())))
        bot.onText(/\/上报检查 (.+)/, async (msg, [_, $1]) =>
            await bot.sendMessage(msg.chat.id, '喵：' + await 状态抓取更新({ _id: $1.trim() })))
        bot.onText(/\/上报 (.+)/, async (msg, [_, $1]) =>
            await bot.sendMessage(msg.chat.id, '喵：' + await 状态上报更新({ _id: $1.trim() })))
        bot.onText(/\/找 (.+)/, async (msg, [_, $1]) =>
            await bot.sendMessage(msg.chat.id, '喵：' + await 找($1.trim()).catch(e => e.toString())))
        bot.onText(/\/重启/, async (msg, [_, $1]) =>
            await bot.sendMessage(msg.chat.id, '喵：5s后重启……').then(() => setTimeout(() => process.exit(0), 5e3)))
        bot.onText(/\/help/, async (msg, [_, $1]) =>
            await bot.sendMessage(msg.chat.id, '喵：使用方法：\n' +
                '/自动上报者添加 $学号\n' +
                '/自动上报 $学号\n' +
                '/上报者添加 $学号\n' +
                '/上报检查 $学号\n' +
                '/上报 $学号\n' +
                '/找 $学号 | 名字\n' +
                '/重启\n' +
                '/help\n'))
        tgbot退出 = async () => {
            await bot.stopPolling()
            await bot.close()
        }
    }
    const 退出 = async () => {
        await db._client.close()
        await tgbot退出()
        console.log('系统退出');
    }
    return {
        db,
        自动上报者添加, 上报者添加, 找,
        通知, 警报, 退出,
        旧信息抓取更新通知, 状态抓取更新, 信息抓取更新, 状态上报更新,
        上报异常者状态抓取更新, 上报异常者上报, 自动上报异常者状态抓取更新, 自动上报异常者上报,
        无效上报者禁用通知, 无效自动上报者禁用警报, 自动上报异常警报, 上报异常者通知, 上报完成者通知
    }
}
export default 上报系统构建

if (require.main === module) (async () => {
    await 自动上报警报流程();
    return '✅ DONE';
})().then(console.log).catch(console.error)

export async function 自动上报警报流程() {
    const 系统 = await 上报系统构建({ 启用bot: true });
    const 自动上报者列 = process.env.NEW_AUTO_USERS.trim().split(/\s+/);

    console.log('自动上报者添加', await 系统.自动上报者添加(自动上报者列));
    console.log('上报者添加', await 系统.上报者添加(自动上报者列));
    console.log('上报者添加', await 系统.上报者添加(理院17列表));
    const 启动时刻 = +new Date()
    while (+new Date() - 启动时刻 < 3600e3) { //运行1小时后退出，由docker来自动重启
        console.log('旧信息抓取更新通知', await 系统.旧信息抓取更新通知());
        console.log('自动上报异常者状态抓取更新', await 系统.自动上报异常者状态抓取更新())
        console.log('上报异常者状态抓取更新', await 系统.上报异常者状态抓取更新())
        console.log('自动上报异常者上报', await 系统.自动上报异常者上报())
        console.log('无效自动上报者禁用警报', await 系统.无效自动上报者禁用警报())
        console.log('无效上报者禁用通知', await 系统.无效上报者禁用通知())
        if (new Date(+new Date() + 8 * 3600e3).getUTCHours() > 6) { //6点后才用使用警报
            console.log('自动上报异常警报', await 系统.自动上报异常警报())
        }
        // console.log('上报异常者通知', await 系统.上报异常者通知())
        console.log('上报完成者通知', await 系统.上报完成者通知())
        await 睡(60e3)
    }
    await 系统.退出()
}
