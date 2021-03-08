import fs from 'fs'
import 上报系统构建 from "./上报";
if (require.main === module) (async () => {
    const 系统 = await 上报系统构建();
    const 表列 = (await fs.promises.readFile('E:/(20200411)上应数据库/sit-xgfy.js/(20200221)xgfy用户.疫情用户数据.mongo.json', 'utf-8'))
        .trim().split(/\n/)
        .map(e => JSON.parse(e))
        .map(({ code, ...d }) => ({ ...d, _id: code }))
        .map(({ _id }) => ({ _id: _id?.replace?.(/^1[789](........)$/, (_, $1) => `20${$1}`) }))
        .filter(({ _id }) => _id?.match(/^20(........)$/))
    await 系统.db.上报者信息.多补(表列)
    return 表列



    return '✅DONE';
})().then(console.log).catch(console.error)

