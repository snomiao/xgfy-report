
// const 理院17列表 = 列差([
//     ...列映(e => '17122111' + e)(_学号),
//     ...列映(e => '17122112' + e)(_学号),
//     ...列映(e => '17122311' + e)(_学号),
//     ...列映(e => '17122111' + e)(_学号),
// ], '1712211125|1712231219|1712211137|1712211231|1712231140|1712211217'.split('|'))

const API请求 = async (路径, 表体, { ts = (+new Date()).toString() } = {}) => {
    瞄于('API请求')(`${路径}#${JSON.stringify(表体)}`);
    return await fetch('http://xgfy.sit.edu.cn' + 路径, {
        method: 'post', body: JSON.stringify(表体),
        headers: { 'content-type': 'application/json', decodes: decodes获取(表体.usercode ?? 表体.code ?? 表体._id, ts), ts },
        ...HTTP_PROXY && { agent: new HttpsProxyAgent(HTTP_PROXY) }
    })
        .then(e => e.json())
        .then(e => {
            console.log(`API请求 ${路径}#${JSON.stringify(表体)}` + 'API请求结果' + e)
            return e
        })
};