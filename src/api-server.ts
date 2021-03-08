// TODO 开发中

import express from 'express';
const app = express()
const port = 3000
const userRouter = express.Router();

app.get('/', (req, res) => { res.send('GET request to the homepage') })

// userRouter.get('/', async (req, res) => { res.send(JSON.stringify(await 用户表列获取())) })
// userRouter.get('/unreported', async (req, res) => { res.send(JSON.stringify(await 未上报用户获取())) })
// userRouter.post('/unreported', async (req, res) => { res.send(JSON.stringify(await 未上报用户上报())) })
// userRouter.get('/autoreport', async (req, res) => { res.send(JSON.stringify(await 需上报用户获取())) })
// userRouter.post('/autoreport', async (req, res) => { res.send(JSON.stringify(await 需上报用户上报())) })
// userRouter.put('/autoreport/:usercode', async (req, res) => { res.send(await 用户增加(req.params.usercode.toString())) })
// userRouter.put('/:usercode', async (req, res) => { res.send(await 用户增加(req.params.usercode.toString())) })
// userRouter.delete('/:usercode', async (req, res) => { res.send(await 用户删除(req.params.usercode.toString())) })
// userRouter.get('/:usercode', async (req, res) => { res.send(await 用户获取(req.params.usercode.toString())) })
// userRouter.post('/:usercode', async (req, res) => { res.send(await 用户上报(req.params.usercode.toString())) })

const apiRouter = express.Router()
apiRouter.get('/', (req, res) => res.send('API v1'))
apiRouter.use('/user', userRouter)

app.use('/v1', apiRouter)
app.listen(port, () => console.log(`Example app listening on port port!`))
