import snoMongoKu from 'sno-mongo-ku'
(await import('dotenv')).config()
const main = (await import('es-main')).default(import.meta)
type todb = snoMongoKu & {
    上报v2: typeof _db._合集,
    上报者: typeof _db._合集,
    上报者状态: typeof _db._合集,
    上报者信息: typeof _db._合集,
}
const { MONGO_URI } = process.env;
const _db = await snoMongoKu(MONGO_URI)
export const db = _db as todb
db.上报历史, db.上报者状态, db.上报者信息;

main && console.table(await db.上报者信息.多查列())
