import fetch from 'node-fetch';
(await import('dotenv')).config()
const main = (await import('es-main')).default(import.meta)
const cpurl = process.env.COOLPUSH

export const 警报 = async (msg: string) => (console.error(msg), await fetch(cpurl, { "method": "POST", body: "上报警报-" + msg }).then(e => e.json()))
export const 通知 = async (msg: string) => (console.info(msg), await fetch(cpurl, { "method": "POST", body: "上报通知-" + msg }).then(e => e.json()))

console.log(cpurl);
console.log(await fetch(cpurl, { method: "POST", body: "上报通知" }).then(e => e.text()));

main && 警报('测试')
main && 通知('测试')