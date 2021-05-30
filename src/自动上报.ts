import { selectByCode, todayReport, 上报数据由状态转换 } from './api-xgfy';
import { getMyReport } from './api-xgfy';
import { db } from './db';
import { 今日batchno获取 } from './api-xgfy'
(await import('dotenv')).config()
const main = (await import('es-main')).default(import.meta)

const 用户合集 = db.上报v2
const 用户列 = (process.env.OLD_AUTO_USERS + ' ' + process.env.NEW_AUTO_USERS + ' 1712211127 1712211133 1712211135 1712211210 1712211214').trim().split(/\s+/)

const 现在HK小时数 = () => new Date(+new Date() + 8 * 3600e3).getUTCHours();
if (main) {
    console.assert(用户列.length >= 63)
    await Promise.all(用户列.map(async 学号 => await 用户合集.upsertOne({ 学号 }, { $setOnInsert: { 学号, 自动上报: true } })))
    console.assert((await 用户合集.find({}, { projection: { 学号: 1 } }).toArray()).length)
    await loop()
}

export default async function loop() {
    console.log('上报开始')
    console.log(await 用户信息更新())
    console.log(await 自动上报状态检查())
    console.log('上报done')
}

export async function 用户信息更新() {
    return {
        用户个人信息更新数: await 用户合集.并行聚合更新([
            { $match: { 个人信息: null } },
            { $project: { 学号: 1 } },
        ], async ({ 学号 }) => ({ $set: { 个人信息: await selectByCode(学号) } }),
            { 并行数: 8 })
    }
}

export async function 自动上报状态检查() {
    return {
        上报状态检查数: await 用户合集.并行聚合更新([
            { $match: { 自动上报: true, "最新状态.batchno": { $ne: 今日batchno获取() } } },
            { $project: { 学号: 1 } },
        ], async ({ 学号, 错误数 }) => {
            let 历史状态 = await getMyReport(学号)
            let 最新状态 = 历史状态?.[0]
            let 状态是最新 = 最新状态?.batchno === 今日batchno获取()
            if (最新状态 && !状态是最新) {
                const 上报数据 = 上报数据由状态转换(最新状态)
                await todayReport(上报数据)
                历史状态 = await getMyReport(学号)
                最新状态 = 历史状态?.[0]
                状态是最新 = 最新状态?.batchno === 今日batchno获取()
            }
            // 
            if (!状态是最新) {
                console.warn('警告：自动上报异常：', 学号, 最新状态)
                if (现在HK小时数() >= 3 && 3 <= 错误数) {
                    console.warn('警告：自动上报异常，已禁用用户：', 学号, 最新状态)
                    return { $set: { 自动上报: false } }
                }
            }
            return ({ $set: { 历史状态, 最新状态 } });
        },
            { 并行数: 8 })
    }
}