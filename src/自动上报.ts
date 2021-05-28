import { selectByCode } from './api-xgfy';
import { getMyReport } from './api-xgfy';
import { db } from './db';
import { 今日batchno获取 } from './api-xgfy'
(await import('dotenv')).config()
const main = (await import('es-main')).default(import.meta)

const 用户合集 = db.上报v2
const 用户列 = (process.env.OLD_AUTO_USERS + ' ' + process.env.NEW_AUTO_USERS).split(/\s+/)
const 现在HK小时数 = () => new Date(+new Date() + 8 * 3600e3).getUTCHours();
if (main) {
    console.assert(用户列.length >= 63)
    await Promise.all(用户列.map(async 学号 => await 用户合集.upsertOne({ 学号 }, { $set: { 学号, 自动上报: true } })))
    console.assert((await 用户合集.find({}, { projection: { 学号: 1 } }).toArray()).length)

    await 用户信息更新()
    await 自动上报状态检查()
    console.log('done')
}
export default async function loop() {
    await 用户信息更新()
    await 自动上报状态检查()
}

async function 用户信息更新() {
    console.log('用户个人信息更新数', await 用户合集.并行聚合更新([
        { $match: { 个人信息: null } },
        { $project: { 学号: 1 } },
    ], async ({ 学号 }) => ({ $set: { 个人信息: await selectByCode(学号) } }), { 并行数: 8 }));
}

async function 自动上报状态检查() {
    console.log('上报状态检查数', await 用户合集.并行聚合更新([
        { $match: { 自动上报: true, "最新状态.batchno": { $ne: 今日batchno获取() } } },
        { $project: { 学号: 1 } },
    ], async ({ 学号 }) => {
        const 历史状态 = await getMyReport(学号)
        const 最新状态 = 历史状态[0]
        if (现在HK小时数() >= 3) {
            console.log('自动上报异常');

            // console.log('自动上报异常警报', await 自动上报异常警报()) //3点后才用使用警报，在这之前
        }
        // if(最新状态.batchno === 今日batchno获取()){
        //     最新状态.batchno
        // }
        return ({ $set: { 历史状态, 最新状态 } });
    }, { 并行数: 8 }));
}

// async function 自动上报异常警报() {
//     console.log('上报状态检查数', await 用户合集.并行聚合更新([
//         { $match: { 自动上报: true, "最新状态.batchno": { $ne: 今日batchno获取() } } },
//         { $project: { 学号: 1 } },
//     ], async ({ 学号 }) => {
//         const 历史状态 = await getMyReport(学号)

//         // return ({ $set: { 历史状态, 最新状态: 历史状态[0] } });
//     }, { 并行数: 8 }));
// }
