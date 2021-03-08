import { 睡 } from 'sno-utils/lib/异步'
import { 自动上报警报流程 } from './上报'

if (require.main === module) (async () => {
    await 自动上报警报流程()
    console.log('done')
    await 睡(17e3)
})()