import dotenv from 'dotenv'; dotenv.config()
import snoMongoKu from 'sno-mongo-ku'
import { 睡 } from 'sno-utils/lib/异步.js'
// console.log(pkg);
const { MONGO_URI } = process.env
const db = await snoMongoKu(MONGO_URI)// db.上报历史, db.上报者状态, db.上报者信息


await db.上报者状态.并行各改(async (doc) => {
    console.log(doc)
    await 睡(5000)
}, { $sample: { size: Infinity }, })

// nodemon src/上报.mjs

console.log("finish");
