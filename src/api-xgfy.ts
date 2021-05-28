import md5 from 'md5'
import fetch from 'node-fetch'
import { 列差, 列映, 数列生成, 表键筛, 列含值否 } from 'sno-utils/lib/表列';
import { 相等断言 } from './相等断言';
const main = (await import('es-main')).default(import.meta)
import hpa from 'https-proxy-agent'
const { HttpsProxyAgent } = hpa;
const { HTTP_PROXY } = process.env;
export const 今日batchno获取 = () => parseInt(new Date(+new Date() + 8 * 3600e3 /* 北京时间 */).toISOString().replace(/\D/g, '').slice(0, 8));
export const decodes获取 = (usercode: string, ts: string) => (n => (n.slice(16, 32) + n.slice(0, 16)).toUpperCase())(md5(`${usercode}Unifri${ts}`));
export const API请求 = async (路径: string, 表体: any, { ts = (+new Date()).toString() } = {}) =>
    await fetch('http://xgfy.sit.edu.cn' + 路径, {
        method: 'post', body: JSON.stringify(表体),
        headers: { 'content-type': 'application/json', decodes: decodes获取(表体.usercode ?? 表体.code ?? 表体._id, ts), ts },
        ...HTTP_PROXY && { agent: new HttpsProxyAgent(HTTP_PROXY) }
    })
        .then(e => e.json())
export const API请求DATA = async (路径: string, 表体: any, { ts = (+new Date()).toString() } = {}) =>
    await API请求(路径, 表体, { ts }).then(e => e?.code === 0 && e?.data)
export const selectByCode = async (学号: string) => await API请求DATA('/report/report/selectByCode', { code: 学号 })
export const getMyReport = async (学号: string) => await API请求DATA('/report/report/getMyReport', { usercode: 学号 })
export const getMyLatestReport = async (学号: string) => await API请求DATA('/report/report/getMyReport', { usercode: 学号 }).then(e => e?.[0])
export const todayReport = async (上报数据: any) => await API请求DATA('/report/report/todayReport', 上报数据)

const _学号 = 数列生成(40, 1).map(e => (e + '').padStart(2, '0'))
const 理院17列表 = 列差([
    ...列映(e => '17122111' + e)(_学号),
    ...列映(e => '17122112' + e)(_学号),
    ...列映(e => '17122311' + e)(_学号),
    ...列映(e => '17122111' + e)(_学号),
], '1712211125|1712231219|1712211137|1712211231|1712231140|1712211217'.split('|'))

// main && console.assert(JSON.stringify(await API请求('/report/report/getMyReport', { "usercode": 3032 })).slice(0, 100), 'API请求失败')
// main && console.assert(await getMyReport(3032))
// main && console.assert(await todayReport(3032))

export const 状态向上报数据转换 = async (最新状态) => {
    const 捕获请求 = { "usercode": "str", "username": "str", "usertype": 2, "jiguan": 3, "deptno": "201100", "wendu": 0, "ksfl": 0, "mjjcqzhz": 0, "qwhtjzgfxdq": 0, "tzrqwhtjzgfxdq": 0, "position": "上海-上海", "inschool": 0, "szdsfzgfxdq": 0, "szdssfyzgfxdq": 0, "cfsj": "请选择", "drwf": 0, "mdd": "请选择", "sy": null, "jtgj": 0, "jtcc": null, "remarks": "", "currentsituation": 3 };
    const 正上报数据 = 表键筛(列含值否([
        "usercode", "username", "usertype", "jiguan", "deptno", "wendu", "ksfl", "mjjcqzhz", "qwhtjzgfxdq",
        "tzrqwhtjzgfxdq", "position", "inschool", "szdsfzgfxdq", "szdssfyzgfxdq", "cfsj", "drwf", "mdd",
        "sy", "jtgj", "jtcc", "remarks", "currentsituation"
    ]))(最新状态);
    // const 反上报数据 = 表键筛(列不含值否([
    //     'batchno', 'fanxiang', 'lvyou', 'jiechu', 'jiechuqy', 'notforegoing',
    //     'creattime', 'mobile', 'auditor', 'isback', 'isinhubei', 'jttw',
    //     'jiaotongfangshi', 'studentclass', 'wendu2', 'ksfl2', 'jttw2', 'currentsituation2', 'id'
    // ]))(最新状态);
    // const 实上报数据 = [正上报数据, 反上报数据][2 * Math.random() | 0];
    const 实上报数据 = 正上报数据;
    return 实上报数据;
}

export const 上报检查 = async (学号) => (await getMyLatestReport(学号)).batchno === 今日batchno获取()

async function 上报并检查(学号) {
    await todayReport(状态向上报数据转换(await getMyLatestReport(学号)))
    return (await getMyLatestReport(学号)).batchno === 今日batchno获取()
}

// realtime test
main && console.log('\n\ntests started\n\n')
main && 相等断言((await selectByCode('3032')).name, '黄丽')
main && 相等断言((await getMyLatestReport('3032')).username, '黄丽')
main && 相等断言((await 上报检查('1712211139')), true)
main && 相等断言((await 上报检查('1712211136')), false)
main && console.log('\n\ntests all done\n\n')
